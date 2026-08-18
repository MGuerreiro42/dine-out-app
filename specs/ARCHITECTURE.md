# Architecture — Target Backend Design

**Status**: Vision — target architecture, not built. Compare against `PROJECT.md`'s Feature Index for current build state.
**Builds on**: `DATA_MODEL.md`'s `Restaurant` entity family; Google Maps Platform's Service Specific Terms.
**Created**: 2026-08-18

This document specifies the backend's target design: module topology, the Google Places integration pattern, authentication, API surface, database schema, and the restaurant-ownership system. Diff against `PROJECT.md`'s Feature Index to determine remaining work.

**Compliance constraint**: Google Maps Platform's Terms restrict caching of Places content. Only `place_id` may be retained indefinitely; coordinates may be retained up to 30 days. All other Places content — name, address, rating, photos, reviews, hours, phone — must be fetched live on each request and must not be persisted, regardless of schema or storage format.

**Legal status**: retention windows below are derived from Google's developer policy pages and secondary summaries, not a complete reading of the current Service Specific Terms (the primary document did not fully load during research). Verify exact wording, section numbers, and the EEA addendum before deployment.

---

## 1. System topology

Mobile (Expo/React Native) communicates over REST/JSON with a Bearer token to a NestJS API of seven modules, backed by PostgreSQL via Prisma. `RestaurantsModule` is the only module with a live external dependency (Google Places API, New).

| Module | Responsibility |
|---|---|
| `RestaurantsModule` | Reads the stored row (product-authored fields), fetches from Google live, merges before responding. No Google-sourced field is persisted. |
| `AuthModule` | Signup, login, refresh, logout. Issues the Bearer token. Includes `GET /users/me`. |
| `FavoritesModule` | `User`–`Restaurant` relation. |
| `OrdersModule` | `profile.md` US3. Provisional, not specced. |
| `ReservationsModule` | `profile.md` US4. Provisional, not specced. |
| `PaymentMethodsModule` | `profile.md` US5. Provisional, not specced. Card-data storage is a separate decision (PCI scope, likely a tokenizing provider). |
| `NotificationSettingsModule` | `profile.md` US6. Provisional, not specced. |

`RestaurantsModule` performs a live merge on every request. It does not cache, sync, or persist Google-sourced content.

---

## 2. Restaurant read: request sequence

1. Mobile sends `GET /restaurants/:id`.
2. Backend loads the stored row by id: `googlePlaceId`, `occasion`, `ambient`, `tags`, `menu`.
3. Backend calls Google Place Details using `googlePlaceId`. Every request. No TTL check. Result not persisted.
4. `RestaurantsService` merges stored fields with the Google response.
5. Response returned to mobile.

Search behaves identically: Nearby/Text Search results are returned directly from the live Google response. `place_id` may be persisted for later lookups; list content is not.

Each detail view and each search issues a billable Google request. There is no cache hit path.

---

## 3. Field provenance

| Field / entity | Source | Retention |
|---|---|---|
| `googlePlaceId` | Google (ID only) | Indefinite — exempt from the caching restriction |
| `latitude`, `longitude` | Google | ≤ 30 days |
| `occasion`, `ambient`, `tags`, `whatsapp`, `instagramHandle` | Product-authored | Indefinite |
| `MenuItem`, `ThingToKnow`, `Highlight` | Product-authored | Indefinite |
| `User`, `Favorite`, `Order`, `Reservation`, `PaymentMethod`, `NotificationSetting` | Account/product data | Indefinite |
| `displayName`, `formattedAddress`, `rating`, `userRatingCount`, `priceLevel`, `primaryType`, `editorialSummary`, phone, amenity flags | Google | Not persisted |
| Photos | Google | Not persisted |
| Reviews | Google | Not persisted |
| Opening hours | Google | Not persisted |

---

## 4. Stack decisions

| Layer | Choice | Rationale |
|---|---|---|
| Backend framework | NestJS | Assumed in `PROJECT.md`'s decision log. Modular controller/service structure matches the mobile app's feature-vertical isolation. |
| Database | PostgreSQL | Relational schema matches `DATA_MODEL.md` — foreign keys and enums, not document storage. |
| ORM | Prisma | Prisma Studio/migrate tooling already available in this environment. |
| API style | REST | `repository.ts` mirrors Google's REST response shapes with Zod contracts. |
| Google content strategy | Live pass-through | Cache-aside (24h TTL, previously specified in `DATA_MODEL.md`) violates the Terms. §3. Corrected in `DATA_MODEL.md`'s Changelog. |
| Session strategy | JWT access (15 min), rotating refresh (30 d) | Access tokens are not persisted on either side. Refresh tokens rotate on each use with reuse detection; a stolen refresh token is usable once before all sessions for that user are revoked. |
| Password hashing | argon2id | Current OWASP-recommended default. Applies only to email/password accounts — Google/Apple accounts have no `passwordHash`. |
| Token storage (mobile) | Refresh token in `expo-secure-store`; access token in memory only | AsyncStorage and a persisted Zustand store are unencrypted. SecureStore uses the platform Keychain/Keystore. |
| Restaurant ownership | CNPJ/CPF claim, optimistic approval, tiered edit rights | Ownership grants immediately, revocable within a 14-day dispute window. Edit rights start at LIMITED; FULL requires document review. Independent axes. §9. |

---

## 5. Authentication

`auth.md`'s current implementation is `isLoggedIn: boolean`. No credential, token, or session exists in the prototype.

**Login**:
1. Mobile submits email and password.
2. `AuthModule` verifies `argon2id(password) == User.passwordHash`.
3. Backend issues a token pair: access (JWT, 15 min), refresh (random, 30 d).
4. The refresh token's hash — not the raw token — is stored in a `RefreshToken` row.
5. Mobile stores the access token in memory only; the refresh token in `expo-secure-store`. Neither token is written to AsyncStorage or a persisted Zustand store.

**Refresh**:
1. Access token expires, or the app cold-starts. Mobile calls `POST /auth/refresh`.
2. Backend hashes the incoming token, looks it up.
3. Not found or expired: `401`.
4. Found, current: issue a new pair; mark the prior row `rotated` (`replacedByTokenId`).
5. Found, already `rotated`: reuse signal. Revoke all refresh tokens for the user. `401`. Client re-authenticates.

---

## 6. API surface

`mocks/repository.ts`'s function signatures define the route contracts below, per `PROJECT.md`'s decision log.

| Mock function | Route | Change |
|---|---|---|
| `getNearbyPlaces()` / `searchPlaces(q)` | `GET /restaurants` | Single route. Nearby-vs-Text-Search selection (presence of `q`) is internal to `RestaurantsService`. |
| `getPlaceDetails(id)` | `GET /restaurants/:id` | Same shape; live merge per §2. |
| `getPlacePhotoUrl(name)` | `GET /restaurants/:id/photos/:photoName` | Proxies Google's Photo Media endpoint. API key stays server-side. |
| `getDiscoveryTaxonomies()` | `GET /taxonomies` | No change. |
| `getCurrentUser()` | `GET /users/me` | First route requiring the Bearer token. |

`Auth: none` = accessible while logged out, required by `auth.md`'s US2. All read-only `RestaurantsModule`/`taxonomies` routes stay open.

| Route | Module | Auth | Notes |
|---|---|---|---|
| `GET /restaurants` | Restaurants | none | Query: `q`, `lat`, `lng`, `category`, `occasion`. Filter set tracks `search.md` US4/US6, not started. |
| `GET /restaurants/:id` | Restaurants | none | §2 |
| `GET /restaurants/:id/photos/:photoName` | Restaurants | none | Proxy |
| `GET /taxonomies` | Restaurants | none | cuisines, occasions, ambients, benefits, categorySubtypes |
| `POST /auth/signup` | Auth | none | Body: name, email, password. argon2id |
| `POST /auth/login` | Auth | none | Body: email, password. Returns token pair, §5 |
| `POST /auth/refresh` | Auth | none* | Body: refresh token. *Credential is the token itself, no Bearer header. §5 |
| `POST /auth/logout` | Auth | Bearer | Revokes the session's refresh token |
| `POST /auth/oauth/:provider` | Auth | — | Deferred. `auth.md`'s Google/Apple buttons remain simulated. §10 |
| `GET /users/me` | Auth | Bearer | |
| `GET /favorites` | Favorites | Bearer | |
| `PUT /favorites/:restaurantId` | Favorites | Bearer | Idempotent add |
| `DELETE /favorites/:restaurantId` | Favorites | Bearer | |
| `GET /orders` | Orders | Bearer | Provisional. `profile.md` US3 not specced |
| `GET /reservations` | Reservations | Bearer | Provisional. `profile.md` US4 not specced |
| `GET/POST /payment-methods`, `DELETE /payment-methods/:id` | PaymentMethods | Bearer | Provisional. `profile.md` US5 not specced |
| `GET/PUT /notification-settings` | NotificationSettings | Bearer | Provisional. `profile.md` US6 not specced |
| `POST/GET /restaurants/:id/claim` | Claims | Bearer | Submit; `AUTO_APPROVED` immediately. Check claim status. §9 |
| `POST /restaurants/:id/claim/dispute` | Claims | Bearer | Any authenticated user, within the 14-day window |
| `POST /restaurants/:id/claim/upgrade` | Claims | Bearer | Owner only. Submits evidence for FULL tier |
| `PATCH /restaurants/:id` (whatsapp, instagramHandle) | Restaurants | Bearer | Owner only, LIMITED tier sufficient. Guard: `ownerId === request.user.id` |
| `PATCH /restaurants/:id` (occasion, ambient, tags); menu-items/things-to-know/highlights CRUD | Restaurants | Bearer | Owner only, FULL tier required. Guard: `ownerId === request.user.id AND trustTier === 'FULL'`. §9 |
| `GET /admin/claims/disputes`, `POST /admin/claims/:id/resolve-dispute` | Claims | Bearer | Admin only |
| `GET /admin/claims/upgrades`, `POST /admin/claims/:id/{approve,reject}-upgrade` | Claims | Bearer | Admin only. First-admin provisioning undecided. §10 |

Claims/admin routes are named, not specced. Each requires its own spec before implementation.

---

## 7. Request lifecycle

1. Mobile sends a request with `Authorization: Bearer <token>` if authenticated.
2. Route requires auth (§6)? No: proceed to controller. Yes: check access token.
3. Access token valid: `req.user` set from JWT payload. Proceed to controller.
4. Access token invalid/expired: `401`. Mobile's interceptor calls `POST /auth/refresh` (§5).
5. Refresh succeeds: retry the original request once with the new access token. Re-enters at step 1.
6. Refresh fails: clear SecureStore, route to Login (`FLOWS.md` Flow 2).
7. Controller executes the handler (§2 read or §6 write), returns response.

Public routes bypass the guard, making `auth.md`'s "browse fully while logged out" requirement structural rather than convention-dependent. Retry occurs at most once; a revoked session routes to login without repeated refresh attempts.

---

## 8. Database schema

Thirteen tables, fourteen including `RestaurantClaim` (§9). No `RestaurantPhoto`, `Review`, or `OpeningHours` table — prohibited under §3. `Favorite`, `Order`, and `Reservation` each hold foreign keys to both `User` and `Restaurant`, resolving three separate many-to-many relationships. `OrderItem` and `PaymentTransaction` each hold foreign keys to two non-hub tables (`Order`↔`MenuItem`, `Order`↔`PaymentMethod` respectively).

| Table | Field | Type | Notes |
|---|---|---|---|
| `User` | id | serial, PK | |
| | email | string, unique | |
| | passwordHash | string, nullable | argon2id. Null for Google/Apple accounts |
| | name | string | |
| | createdAt, updatedAt | timestamp | |
| `RefreshToken` | id | serial, PK | |
| | userId | FK → User | |
| | tokenHash | string | Not the raw token |
| | expiresAt, revokedAt | timestamp, nullable | |
| | replacedByTokenId | FK → RefreshToken, nullable, self | Set on rotation |
| `Restaurant` | id | serial, PK | Internal ID, distinct from Google's |
| | googlePlaceId | string, unique, indexed | Indefinite retention. §3 |
| | latitude, longitude | float | ≤ 30 days. §3 |
| | coordsCachedAt | timestamp | TTL for the row above. No other field on this table has a TTL |
| | occasion, ambient | enum/string | Product-authored |
| | tags | string[] | Product-authored |
| | whatsapp, instagramHandle | string, nullable | Product-authored |
| | createdAt, updatedAt | timestamp | |
| `MenuItem` | id, restaurantId | serial PK, FK → Restaurant | |
| | name, price | string, string (display) | |
| | category | string | Free-form, not an enum — restaurant-defined groupings |
| | isAvailable | boolean | |
| `ThingToKnow` | id, restaurantId | serial PK, FK → Restaurant | |
| | title, text | string, text | |
| `Highlight` | id, restaurantId | serial PK, FK → Restaurant | |
| | title, description | string, text | |
| `Favorite` | userId, restaurantId | composite PK, FK × 2 | |
| | createdAt | timestamp | |
| `Order` (provisional) | id, userId, restaurantId | bigserial PK, FK × 2 | `profile.md` US3 not specced |
| | status | enum | `PENDING`\|`CONFIRMED`\|`COMPLETED`\|`CANCELLED`\|`REFUNDED`. Derived from `PaymentTransaction.status`, not set directly |
| | totalCents | integer | |
| `OrderItem` (provisional) | id, orderId | bigserial PK, FK → Order (CASCADE) | Line items — `Order` alone is a total with no detail |
| | menuItemId | FK → MenuItem, nullable (SET NULL) | |
| | nameSnapshot, unitPriceCents | text, integer | Copied from `MenuItem` at order time, never read live — decouples receipts from menu price changes |
| | quantity | smallint, CHECK > 0 | |
| `Reservation` (provisional) | id, userId, restaurantId | serial PK, FK × 2 | `profile.md` US4 not specced |
| | status | enum | `PENDING`\|`CONFIRMED`\|`CANCELLED`\|`COMPLETED`\|`NO_SHOW` |
| `PaymentMethod` (provisional) | id, userId | serial PK, FK → User | `profile.md` US5 not specced |
| `PaymentTransaction` (provisional) | id, orderId | bigserial PK, FK → Order (CASCADE) | One row per charge attempt |
| | paymentMethodId | FK → PaymentMethod, nullable (SET NULL) | |
| | idempotencyKey | text, unique | Guards against duplicate charges on retry |
| | providerRef, amountCents | text nullable, integer | |
| | methodLast4, methodBrand | text | Snapshotted at charge time |
| | status | enum | `PENDING`\|`SUCCEEDED`\|`FAILED`\|`REFUNDED`\|`PARTIALLY_REFUNDED` |
| | failureReason | text, nullable | |
| `NotificationSetting` (provisional) | userId | PK, FK → User (1–1) | `profile.md` US6 not specced |

---

## 9. Restaurant ownership claims

Ownership and edit rights are independent axes. Ownership is granted on submission and revocable on dispute. Edit rights start at LIMITED and require a separate review to reach FULL.

1. Owner submits a document type and number. CNPJ: automated registry lookup. CPF: format check only, no registry exists.
2. Claim is `AUTO_APPROVED` immediately. Sets `Restaurant.ownerId`, grants LIMITED tier.
3. Dispute track: any user may dispute within 14 days. Admin review upholds (revokes ownership) or dismisses. No dispute within the window: ownership final.
4. Upgrade track, independent of the dispute track: owner submits evidence for FULL tier. Admin approves or denies (retriable).

Concurrent claims: the first submission sets `ownerId` (database unique constraint plus transaction). Subsequent attempts on an owned restaurant are not claims — they are `POST /restaurants/:id/claim/dispute`.

New table: `RestaurantClaim` — id, restaurantId (FK), claimantUserId (FK), docType (`CNPJ`|`CPF`), docNumber, status, disputeWindowExpiresAt, trustTier (`LIMITED`|`FULL`). New field: `Restaurant.ownerId` (FK → User, nullable).

---

## 10. Open items

- **Legal**: retention windows derived from secondary sources, not a full reading of the current Service Specific Terms. Verify before deployment, including the EEA addendum.
- **First admins**: dispute review and tier upgrades (§9) require at least one admin `User`. Provisioning mechanism undecided; presumed seeded directly, not via public signup.
- **Hosting/deployment**: not addressed. Object storage for claim evidence documents not chosen.
- **Real OAuth**: `auth.md`'s Google/Apple buttons remain simulated. Real implementation (authorization code + PKCE) is out of scope for this document.
- **First-run default**: whether a fresh install defaults to logged-out is unresolved, carried over from `auth.md`.

Resolved by this document: content authorship for `occasion`/`tags`/`menu` — restaurant partners, via CNPJ/CPF claim (§9). Seeding process for unclaimed restaurants remains undefined.

## Follow-up

1. `DATA_MODEL.md`'s `RestaurantPhoto`/`Review`/`OpeningHours` tables and 24h `cachedAt` contradicted §3. Corrected there; see its Changelog.
2. `auth.md`'s Out of Scope previously stated no backend design existed. Updated to reference this document.
3. Framework scaffolding (NestJS project, Prisma schema, migrations) not started.

## Changelog

| Date | Change |
|------|--------|
| 2026-08-18 | Created. Resolves `DATA_MODEL.md`'s Google-caching compliance gap (cache-aside → live pass-through). Confirms NestJS/Postgres/Prisma/REST. Specifies auth token strategy, API surface, request lifecycle, database schema, restaurant-claim system. Design only, not built. |
| 2026-08-18 | Rewritten for tone: removed narrative framing, "X, not Y" constructions, explanatory asides. |
| 2026-08-18 | §8 schema reconciled against a standalone data-modeling review: added `OrderItem` (order line items, price-snapshotted) and `PaymentTransaction` (charge attempts, idempotency-keyed) to close the gap where `Order` referenced `MenuItem` price live and had no payment-retry safety. Added `MenuItem.category`/`isAvailable`, resolved `Order.status`/`Reservation.status` enum values. Indexing, integrity, and scalability rationale for these additions is not reproduced here — kept out-of-repo pending the entities' owning spec, consistent with `DATA_MODEL.md`'s scope rule. |
