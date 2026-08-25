# Architecture — Target Backend Design

**Status**: Vision — target architecture, not built. Compare against `PROJECT.md`'s Feature Index for current build state.
**Builds on**: `DATA_MODEL.md`'s `Restaurant` entity family; Overture Maps' CDLA Permissive 2.0 license; Google Maps Platform's Service Specific Terms (deferred enrichment layer only, §10).
**Created**: 2026-08-18

This document specifies the backend's target design: module topology, the restaurant catalog's Overture Maps sourcing, authentication, API surface, database schema, and the restaurant-ownership system. Diff against `PROJECT.md`'s Feature Index to determine remaining work.

**Overture sourcing**: the restaurant catalog's base read path is populated by an offline ingestion script reading Overture Maps' Places dataset (`dine-out-backend`'s `specs/restaurants.md`). Overture's CDLA Permissive 2.0 license permits indefinite retention of the full place record — no live per-request fetch, no caching restriction, no share-alike obligation.

**Compliance constraint (deferred enrichment layer only)**: Google Maps Platform's Terms restrict caching of Places content. Only `place_id` may be retained indefinitely; coordinates may be retained up to 30 days. All other Places content — name, address, rating, photos, reviews, hours, phone — must be fetched live on each request and must not be persisted, regardless of schema or storage format. This constraint does not apply to any Overture-sourced field (§3); it would apply only if the deferred Google enrichment layer (§10) is built.

**Legal status**: retention windows below are derived from Google's developer policy pages and secondary summaries, not a complete reading of the current Service Specific Terms (the primary document did not fully load during research). Verify exact wording, section numbers, and the EEA addendum before deployment — relevant only if the deferred Google enrichment layer is built.

---

## 1. System topology

Mobile (Expo/React Native) communicates over REST/JSON with a Bearer token to a NestJS API of seven modules, backed by PostgreSQL via Prisma. No module has a live external dependency on the request path. `RestaurantsModule`'s catalog is populated offline by a batch ingestion script reading Overture Maps' Places dataset (`dine-out-backend`'s `specs/restaurants.md`); a possible future Google Places enrichment layer (reviews, photos) is deferred, not implemented (§10).

| Module | Responsibility |
|---|---|
| `RestaurantsModule` | Reads the stored row — Overture-sourced catalog fields merged with product-authored fields — from Postgres. No live external call per request. |
| `AuthModule` | Signup, login, refresh, logout. Issues the Bearer token. Includes `GET /users/me`. |
| `FavoritesModule` | `User`–`Restaurant` relation. |
| `OrdersModule` | `profile.md` US3. Provisional, not specced. |
| `ReservationsModule` | `profile.md` US4. Provisional, not specced. |
| `PaymentMethodsModule` | `profile.md` US5. Provisional, not specced. Card-data storage is a separate decision (PCI scope, likely a tokenizing provider). |
| `NotificationSettingsModule` | `profile.md` US6. Provisional, not specced. |

`RestaurantsModule` reads Postgres only. The catalog itself is kept current by re-running the ingestion script (`dine-out-backend`'s `specs/restaurants.md`), not by a per-request fetch.

---

## 2. Restaurant read: request sequence

1. Mobile sends `GET /restaurants/:id`.
2. Backend loads the stored row by id, joined with `MenuItem`/`ThingToKnow`/`Highlight`.
3. `RestaurantsService` returns the row's Overture-sourced fields (`displayName`, `formattedAddress`, `latitude`, `longitude`, `category`) alongside product-authored fields (`occasion`, `ambient`, `tags`, `whatsapp`, `instagramHandle`) as one response. No merge step, no outbound call.
4. Response returned to mobile.

`GET /restaurants` behaves identically in kind: `lat`/`lng` (radius) or `q` (case-insensitive substring on `displayName`), plus `category`/`occasion` filters, run directly against Postgres — no external search call.

The catalog is populated and refreshed by a separate, offline ingestion script (`dine-out-backend`'s `specs/restaurants.md`), not by any request handler. A request never triggers ingestion and never blocks on an external service.

Restaurant ownership claims and edit rights are unaffected by this change — §9 still governs who may set `occasion`/`ambient`/`tags`/`whatsapp`/`instagramHandle`, which are always product-authored regardless of catalog source. An ingested-but-unclaimed row returns `occasion`/`ambient` as `null` on the wire (`dine-out-backend`'s `specs/restaurants.md` FR-009) — the mobile client's wire contract (`src/types/restaurant.ts`, `src/lib/googlePlaces/schema.ts`) needs the same nullable update before it can consume this API; tracked as follow-up work, not part of this document.

---

## 3. Field provenance

| Field / entity | Source | Retention |
|---|---|---|
| `sourceId`, `source`, `category`, `confidence`, `sourceAttributes`, `lastSyncedAt`, `displayName`, `formattedAddress`, `latitude`, `longitude` | Overture Maps Places (CDLA Permissive 2.0) | Indefinite — no caching restriction applies to Overture-sourced content |
| `phones`, `websites`, `socialLinks`, `categoryAlternates`, `categoryHierarchy`, `postalCode`, `region`, `country`, `brandName`, `brandWikidataId` | Overture Maps Places (CDLA Permissive 2.0) | Indefinite, same rule as the row above. Specced (`dine-out-backend`'s `specs/restaurants.md` FR-015–FR-018), not yet migrated |
| `googlePlaceId` | Reserved for a future Google enrichment layer | Not populated by ingestion; nullable |
| `occasion`, `ambient`, `tags`, `whatsapp`, `instagramHandle` | Product-authored | Indefinite. Null until an ownership claim sets them (§9) for a row ingestion alone created |
| `MenuItem`, `ThingToKnow`, `Highlight` | Product-authored | Indefinite |
| `User`, `Favorite`, `Order`, `Reservation`, `PaymentMethod`, `NotificationSetting` | Account/product data | Indefinite |
| `rating`, `userRatingCount`, `priceLevel`, `primaryType`, `editorialSummary`, phone, amenity flags | Google (deferred enrichment layer, not implemented) | Would not be persisted if implemented — Google's Terms restrict caching of this content (below) |
| Photos | Google (deferred enrichment layer, not implemented) | Not persisted if implemented. No fallback source chosen; `dine-out-backend`'s `specs/restaurants.md` drops the photo route this pass |
| Reviews | Google (deferred enrichment layer, not implemented) | Not persisted if implemented |
| Opening hours | Google (deferred enrichment layer, not implemented) | Not persisted if implemented |

The retention restriction below (Google Maps Platform's Terms) applies only to the deferred enrichment layer. It does not constrain the Overture-sourced fields above — Overture's CDLA Permissive 2.0 license permits indefinite retention with no share-alike or caching restriction.

---

## 4. Stack decisions

| Layer | Choice | Rationale |
|---|---|---|
| Backend framework | NestJS | Assumed in `PROJECT.md`'s decision log. Modular controller/service structure matches the mobile app's feature-vertical isolation. |
| Database | PostgreSQL | Relational schema matches `DATA_MODEL.md` — foreign keys and enums, not document storage. |
| ORM | Prisma | Prisma Studio/migrate tooling already available in this environment. |
| API style | REST | `repository.ts` mirrors Google's REST response shapes with Zod contracts. |
| Restaurant catalog source | Overture Maps Places, offline ingestion | CDLA Permissive 2.0 permits indefinite retention; unblocks `RestaurantsModule` without the still-blocked Google Places API key. §2/§3. A prior live Google pass-through design, and before that a 24h cache-aside design, are both superseded — see `DATA_MODEL.md`'s Changelog. |
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
| `getNearbyPlaces()` / `searchPlaces(q)` | `GET /restaurants` | Single route. Radius-vs-substring-search selection (presence of `q`) is internal to `RestaurantsService`, resolved against Postgres per §2. |
| `getPlaceDetails(id)` | `GET /restaurants/:id` | Same shape; stored-row read per §2, no merge step. |
| `getPlacePhotoUrl(name)` | `GET /restaurants/:id/photos/:photoName` | Deferred — see the row below and §10. |
| `getDiscoveryTaxonomies()` | `GET /taxonomies` | No change. |
| `getCurrentUser()` | `GET /users/me` | First route requiring the Bearer token. |

`Auth: none` = accessible while logged out, required by `auth.md`'s US2. All read-only `RestaurantsModule`/`taxonomies` routes stay open.

| Route | Module | Auth | Notes |
|---|---|---|---|
| `GET /restaurants` | Restaurants | none | Query: `q`, `lat`, `lng`, `category`, `occasion`. Filter set tracks `search.md` US4/US6, not started. `category` matches exact only, not `categoryAlternates`; no `brand` query param this round — `dine-out-backend`'s `specs/restaurants.md` FR-021/FR-022. |
| `GET /restaurants/:id` | Restaurants | none | §2 |
| `GET /restaurants/:id/photos/:photoName` | Restaurants | none | Deferred — Overture has no photo field; no fallback source chosen. Dropped from `dine-out-backend`'s `specs/restaurants.md` this pass, not implemented |
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

Eleven tables, twelve including `RestaurantClaim` (§9). No `RestaurantPhoto`, `Review`, or `OpeningHours` table — prohibited under §3. `Favorite`, `Order`, and `Reservation` each hold foreign keys to both `User` and `Restaurant`, resolving three separate many-to-many relationships. `Restaurant`'s ten field-enrichment columns below (`phones` through `brandWikidataId`) are specced (`dine-out-backend`'s `specs/restaurants.md` FR-015–FR-018), not yet migrated.

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
| `Restaurant` | id | serial, PK | Internal ID, distinct from any source's own id |
| | source | enum (`OVERTURE`) | Which catalog source populated this row. Extensible |
| | sourceId | string | Overture GERS id. `(source, sourceId)` unique together — the ingestion upsert key |
| | category | string | Overture `categories.primary`. Indexed — `GET /restaurants`'s `category` filter |
| | confidence | float | Overture's row-level confidence score, 0-1 |
| | sourceAttributes | json | Full raw source row, for traceability without re-fetching |
| | lastSyncedAt | timestamp | Last ingestion touch. Not a TTL — no field on this table expires |
| | displayName | string | Overture `names.primary`. Indefinite retention. §3 |
| | formattedAddress | string, nullable | Overture-sourced. Indefinite retention. §3 |
| | latitude, longitude | float | Overture-sourced. Indefinite retention, indexed for bbox/radius queries. §3 |
| | googlePlaceId | string, unique, nullable | Reserved for a future Google enrichment layer. Not populated by ingestion |
| | phones, websites | string[] | Overture-sourced. Specced (`dine-out-backend`'s `specs/restaurants.md` FR-015), not yet migrated |
| | socialLinks | string[] | Overture's `socials` column, renamed — mixed-platform URLs, distinct from `instagramHandle`. Specced (FR-015), not yet migrated |
| | categoryAlternates | string[] | Overture `categories.alternate`. Specced (FR-016), not yet migrated. `category` filtering (§6) does not match this field (FR-021) |
| | categoryHierarchy | string[] | Overture `taxonomy.hierarchy` — full category tree path. Specced (FR-016), not yet migrated |
| | postalCode, region, country | string, nullable | Structured address components alongside `formattedAddress`. Specced (FR-017), not yet migrated |
| | brandName, brandWikidataId | string, nullable | Overture `brand.names.primary`/`brand.wikidata`. Specced (FR-018), not yet migrated. Capture-only — no `brand` filter (§6) this round (FR-022) |
| | occasion, ambient | string, nullable | Product-authored. Null until an ownership claim sets them (§9) |
| | tags | string[] | Product-authored |
| | whatsapp, instagramHandle | string, nullable | Product-authored |
| | createdAt, updatedAt | timestamp | |
| `MenuItem` | id, restaurantId | serial PK, FK → Restaurant | |
| | name, price | string, string (display) | |
| `ThingToKnow` | id, restaurantId | serial PK, FK → Restaurant | |
| | title, text | string, text | |
| `Highlight` | id, restaurantId | serial PK, FK → Restaurant | |
| | title, description | string, text | |
| `Favorite` | userId, restaurantId | composite PK, FK × 2 | |
| | createdAt | timestamp | |
| `Order` (provisional) | id, userId, restaurantId | serial PK, FK × 2 | `profile.md` US3 not specced |
| `Reservation` (provisional) | id, userId, restaurantId | serial PK, FK × 2 | `profile.md` US4 not specced |
| `PaymentMethod` (provisional) | id, userId | serial PK, FK → User | `profile.md` US5 not specced |
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

- **Legal**: retention windows derived from secondary sources, not a full reading of the current Service Specific Terms. Verify before deployment, including the EEA addendum — relevant only if the deferred Google enrichment layer is built.
- **First admins**: dispute review and tier upgrades (§9) require at least one admin `User`. Provisioning mechanism undecided; presumed seeded directly, not via public signup.
- **Hosting/deployment**: not addressed. Object storage for claim evidence documents not chosen.
- **Real OAuth**: `auth.md`'s Google/Apple buttons remain simulated. Real implementation (authorization code + PKCE) is out of scope for this document.
- **First-run default**: whether a fresh install defaults to logged-out is unresolved, carried over from `auth.md`.
- **Unclaimed-restaurant `occasion`/`ambient`**: resolved — the API returns `null` until a claim sets them (`dine-out-backend`'s `specs/restaurants.md` FR-009). The mobile wire contract (`src/types/restaurant.ts`, `src/lib/googlePlaces/schema.ts`) still needs updating to accept `null` and render a "no occasion/ambient set" state — tracked as follow-up work for whenever `dine-out-app` swaps its mocks for this API, not resolved by this document.
- **Ingestion confidence floor**: resolved — `confidence >= 0.5` (`dine-out-backend`'s `specs/restaurants.md` FR-014).
- **Photo fallback**: no image source is chosen for a restaurant with no photos (every ingested-but-unclaimed row, since Overture has no photo field). `GET /restaurants/:id/photos/:photoName` is dropped from `dine-out-backend`'s `specs/restaurants.md` this pass, not built.
- **Category filter broadening**: resolved — `GET /restaurants?category=X` (§6) stays exact-match against `category` only, `Restaurant.categoryAlternates` is not matched. `dine-out-backend`'s `specs/restaurants.md` FR-021.
- **Brand filter scope**: resolved — no `?brand=X` query param (§6) this round. `brandName`/`brandWikidataId` are captured, not queryable, until a User Story requests chain browsing. `dine-out-backend`'s `specs/restaurants.md` FR-022.

Resolved by this document: content authorship for `occasion`/`tags`/`menu` — restaurant partners, via CNPJ/CPF claim (§9). Seeding process for unclaimed restaurants — the Overture ingestion script (`dine-out-backend`'s `specs/restaurants.md`), resolving the prior open item below.

## Follow-up

1. `DATA_MODEL.md`'s `RestaurantPhoto`/`Review`/`OpeningHours` tables and 24h `cachedAt` contradicted §3. Corrected there; see its Changelog.
2. `auth.md`'s Out of Scope previously stated no backend design existed. Updated to reference this document.
3. Framework scaffolding (NestJS project, Prisma schema, migrations) not started.

## Changelog

| Date | Change |
|------|--------|
| 2026-08-18 | Created. Resolves `DATA_MODEL.md`'s Google-caching compliance gap (cache-aside → live pass-through). Confirms NestJS/Postgres/Prisma/REST. Specifies auth token strategy, API surface, request lifecycle, database schema, restaurant-claim system. Design only, not built. |
| 2026-08-18 | Rewritten for tone: removed narrative framing, "X, not Y" constructions, explanatory asides. |
| 2026-08-25 | Restaurant catalog re-sourced from Overture Maps Places (CDLA Permissive 2.0) instead of a live Google Places pass-through, unblocking `RestaurantsModule` without the still-blocked Google API key (§1/§2/§3/§4/§8). Google Places becomes a documented, deferred future enrichment layer (§10), not removed. `Restaurant`'s schema (§8) gains `source`/`sourceId`/`category`/`confidence`/`sourceAttributes`/`lastSyncedAt`/`displayName`/`formattedAddress`; `googlePlaceId` becomes nullable; `coordsCachedAt` removed (no TTL under Overture's license); `occasion`/`ambient` become nullable. Photo route dropped from this pass (§6). Full design: `dine-out-backend`'s `specs/restaurants.md`. |
| 2026-08-25 | User resolved the three open items raised above: ingestion confidence floor `>= 0.5`; unclaimed-restaurant `occasion`/`ambient` return `null` on the wire (mobile contract update tracked as separate follow-up, not this document); `dine-out-backend`'s `feat/api-docs` merged to `main`, no new backend dependency blocker. |
| 2026-08-25 | `Restaurant`'s schema (§8) and field provenance table (§3) gain ten additional Overture-sourced fields: `phones`, `websites`, `socialLinks` (renamed from Overture's `socials`), `categoryAlternates`, `categoryHierarchy`, `postalCode`, `region`, `country`, `brandName`, `brandWikidataId` — specced in `dine-out-backend`'s `specs/restaurants.md` (FR-015–FR-018), not yet migrated. |
| 2026-08-25 | User resolved both open items from the entry above (§10): `category` filtering (§6) stays exact-match only, not broadened to `categoryAlternates` (FR-021); no `brand` query param this round (FR-022). |
