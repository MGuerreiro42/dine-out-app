# Architecture — Target Backend Design

**Status**: Vision — target architecture, nothing here is built yet. Compare against `PROJECT.md`'s Feature Index for real build state.
**Builds on**: `DATA_MODEL.md`'s `Restaurant` entity family + Google Maps Platform's Service Specific Terms
**Created**: 2026-08-18

Every module built, every feature live — the north star to diff current work against, with Google Places' caching rules designed in from the start rather than patched in later. Not a status report; kept here so it can be diffed against real build state to generate remaining work.

**The one rule everything below follows**: Google Maps Platform's Terms prohibit pre-fetching, caching, or storing most Places content — only `place_id` is exempt indefinitely, and coordinates may be cached up to 30 days. Everything else (name, address, rating, photos, reviews, hours, phone) must be requested live and displayed, not warehoused. Reformatting it into our own schema doesn't create an exception — the restriction is on the content itself, not its shape on disk.

**Legal note**: retention windows below come from Google's developer policy pages and secondary summaries, not a full read of the current Service Specific Terms (didn't fully load during research). Confirm exact wording, section numbers, and the EEA-specific addendum before this ships.

---

## 1. System topology

Mobile (Expo/React Native) → REST/JSON, Bearer token → NestJS API (7 modules) → Prisma → PostgreSQL. `RestaurantsModule` is the one module with a live external call to Google Places API (New); every other module is a plain Controller → Service → Prisma stack.

| Module | Responsibility |
|---|---|
| `RestaurantsModule` | Reads our row (product-authored fields) + calls Google live, merges before responding. Nothing Google-sourced hits Prisma. |
| `AuthModule` | Signup/login/refresh/logout, issues the Bearer token. Folds in `GET /users/me` — no separate `UsersModule` for one route. |
| `FavoritesModule` | `User` ↔ `Restaurant`. |
| `OrdersModule` | `profile.md` US3 — provisional, not specced. |
| `ReservationsModule` | `profile.md` US4 — provisional, not specced. |
| `PaymentMethodsModule` | `profile.md` US5 — provisional, not specced. Storing real card data is its own decision (PCI scope, likely a tokenizing provider), not made here. |
| `NotificationSettingsModule` | `profile.md` US6 — provisional, not specced. |

**The one shape this diagram insists on**: `RestaurantsModule` never becomes a proxy that *stores* what Google returns — it's a live merge of two sources, every request, not a sync target.

---

## 2. A restaurant read, end to end

No freshness check, no TTL branch — there's nothing to invalidate because Google content was never written down. Every restaurant detail request does one live Google call, unconditionally:

1. Mobile: `GET /restaurants/:id`
2. Backend loads our row by id — `googlePlaceId`, `occasion`/`ambient`/`tags`, `menu`, etc.
3. Backend calls Google Place Details live, using that `googlePlaceId` — every request, no TTL check. Result never written to Postgres.
4. `RestaurantsService` merges our fields + Google's fields.
5. Response to mobile.

Same shape for a search list: Nearby/Text Search results are displayed straight from the live Google response — `place_id` may be persisted for later lookups, but the list content itself is never stored.

**Trade-off worth naming out loud**: every detail view and every search is now a billable, latency-bearing Google call — there's no warm-cache fast path. That's the cost of the compliant version of this pattern, not a bug to fix later.

---

## 3. Ours vs. Google's — field by field

The split `RestaurantsModule`'s merge step (§2) depends on.

| Field / entity | Source | Retention |
|---|---|---|
| `googlePlaceId` | Google (the ID only) | Indefinite — explicitly exempt from the caching restriction |
| `latitude`, `longitude` | Google | ≤ 30 days — must be refreshed or dropped after |
| `occasion`, `ambient`, `tags`, `whatsapp`, `instagramHandle` | Ours, product-authored | Indefinite — no Google content involved |
| `MenuItem`, `ThingToKnow`, `Highlight` | Ours, product-authored | Indefinite |
| `User`, `Favorite`, `Order`, `Reservation`, `PaymentMethod`, `NotificationSetting` | Ours, account/product data | Indefinite |
| `displayName`, `formattedAddress`, `rating`, `userRatingCount`, `priceLevel`, `primaryType`, `editorialSummary`, phone, amenity flags | Google | Live only — fetched per request, never written to Postgres |
| Photos | Google | Live only |
| Reviews | Google | Live only |
| Opening hours | Google | Live only |

---

## 4. Confirmed this round

| Layer | Choice | Why |
|---|---|---|
| Backend framework | NestJS | Already the assumed name in `PROJECT.md`'s decision log; modular controller/service structure echoes the mobile app's own feature-vertical isolation |
| Database | PostgreSQL | Relational fits `DATA_MODEL.md`'s shape directly — FKs and enums, not a document store |
| ORM | Prisma | Prisma Studio/migrate tooling already available in this environment |
| API style | REST | `repository.ts` already mirrors Google's REST-shaped responses with Zod contracts |
| Google content strategy | Live pass-through, not cache-aside | Google's Terms restrict caching to `place_id` (indefinite) and coordinates (≤30d) — the 24h cache-aside pattern `DATA_MODEL.md` used to describe for the rest of `Restaurant` would violate those terms as written; corrected there, see its Changelog |
| Session strategy | JWT access (15 min) + rotating refresh (30 d) | Access tokens never touch disk on either side — short-lived enough that a leak self-expires fast. Refresh tokens rotate on every use with reuse detection, so a stolen one is usable exactly once before every session for that user is revoked |
| Password hashing | argon2id | Current OWASP-recommended default — memory-hard, more GPU-crack-resistant than bcrypt. Only applies to email/password signups; Google/Apple accounts never get a `passwordHash` |
| Token storage (mobile) | `expo-secure-store` for the refresh token; access token in memory only | AsyncStorage and a persisted Zustand store are unencrypted plain files — fine for UI state, wrong for anything that grants access. SecureStore wraps the platform Keychain/Keystore |
| Restaurant ownership | CNPJ/CPF claim, instant optimistic approval, tiered edit rights | Granted immediately (no admin bottleneck day one), revocable via a 14-day dispute window; edit rights start LIMITED, unlock FULL only after an owner-initiated document review — two independent axes, not one gate. See §9 |

---

## 5. Auth: tokens and where they live

`auth.md`'s entire backend today is `isLoggedIn: boolean` — no credential, token, or session exists anywhere in the prototype. This is the one gap from a security checklist that's real and immediate, not a hosting-provider checkbox.

**Login — issuing the pair**:
1. Mobile submits email + password.
2. `AuthModule` verifies `argon2id(password) == User.passwordHash`.
3. Issues a token pair: access (JWT, 15 min), refresh (random, 30 d).
4. Refresh token's *hash* (never the raw token) is stored in a `RefreshToken` row.
5. Mobile stores: access token in memory only; refresh token in `expo-secure-store` (iOS Keychain / Android Keystore). Never AsyncStorage, never a persisted Zustand store.

**Refresh — rotation and reuse detection**:
1. Access token expires (or app cold start) → mobile calls `POST /auth/refresh` with the refresh token.
2. Backend hashes the incoming token, looks it up.
3. Not found or expired → `401`.
4. Found and current → issue a new pair, mark the old row `rotated` (`replacedByTokenId`).
5. Found but *already* marked rotated — a newer token already superseded it — that's a reuse signal: revoke every refresh token for that user, `401`, force a full re-login.

---

## 6. API surface — routes

Not invented from scratch — `mocks/repository.ts`'s function signatures are what `PROJECT.md`'s decision log already calls "the contract a real backend call will eventually replace, one function body at a time." Each route below is that same contract, named.

| Mock function today | Becomes | What changes |
|---|---|---|
| `getNearbyPlaces()` / `searchPlaces(q)` | `GET /restaurants` | One route, not two — Google's real Nearby-vs-Text-Search split stays an internal `RestaurantsService` detail, picked by whether `q` is present |
| `getPlaceDetails(id)` | `GET /restaurants/:id` | Same shape — now the live merge from §2 instead of a fixture lookup |
| `getPlacePhotoUrl(name)` | `GET /restaurants/:id/photos/:photoName` | Becomes a real proxy to Google's Photo Media endpoint, so the Google API key stays server-side |
| `getDiscoveryTaxonomies()` | `GET /taxonomies` | Unchanged in spirit — ours, persisted, no Google content |
| `getCurrentUser()` | `GET /users/me` | Was a public mock; becomes the first route that actually needs the Bearer token to mean anything |

`Auth` column below: **none** = reachable while logged out — required by `auth.md`'s own User Story 2 ("browse fully while logged out"), so every read-only `RestaurantsModule`/`taxonomies` route has to stay open.

| Route | Module | Auth | Notes |
|---|---|---|---|
| `GET /restaurants` | Restaurants | none | Query: `q`, `lat`, `lng`, `category`, `occasion` — exact filter set still open, tracks `search.md`'s US4/US6, not started |
| `GET /restaurants/:id` | Restaurants | none | Live merge, §2 |
| `GET /restaurants/:id/photos/:photoName` | Restaurants | none | Proxy |
| `GET /taxonomies` | Restaurants | none | cuisines, occasions, ambients, benefits, categorySubtypes |
| `POST /auth/signup` | Auth | none | Body: name, email, password. Hashes with argon2id |
| `POST /auth/login` | Auth | none | Body: email, password → token pair, §5 |
| `POST /auth/refresh` | Auth | none* | Body: refresh token — rotation + reuse detection, §5. *the refresh token itself is the credential, no Bearer header |
| `POST /auth/logout` | Auth | Bearer | Revokes the one session's refresh token |
| `POST /auth/oauth/:provider` | Auth | — | Deferred — `auth.md`'s Google/Apple buttons are still simulated, see §10 |
| `GET /users/me` | Auth | Bearer | Folded into Auth, not its own module |
| `GET /favorites` | Favorites | Bearer | Current user's favorited restaurants |
| `PUT /favorites/:restaurantId` | Favorites | Bearer | Idempotent add — replaces the client-only `toggleFavorite` half that adds |
| `DELETE /favorites/:restaurantId` | Favorites | Bearer | Remove |
| `GET /orders` | Orders | Bearer | Provisional — `profile.md` US3 not specced |
| `GET /reservations` | Reservations | Bearer | Provisional — `profile.md` US4 not specced |
| `GET/POST /payment-methods`, `DELETE /payment-methods/:id` | PaymentMethods | Bearer | Provisional — `profile.md` US5 not specced. PCI scope note above |
| `GET/PUT /notification-settings` | NotificationSettings | Bearer | Provisional — `profile.md` US6 not specced |
| `POST/GET /restaurants/:id/claim` | Claims (§9) | Bearer | Submit → `AUTO_APPROVED` instantly, no admin step; check your own claim's status |
| `POST /restaurants/:id/claim/dispute` | Claims (§9) | Bearer | Any authenticated user — files a report against an active claim, within the 14-day window |
| `POST /restaurants/:id/claim/upgrade` | Claims (§9) | Bearer | Owner-only — submits evidence to request the FULL tier |
| `PATCH /restaurants/:id` (whatsapp, instagramHandle only) | Restaurants | Bearer | Owner-only, LIMITED tier is enough — guard checks `ownerId === request.user.id` |
| `PATCH /restaurants/:id` (occasion, ambient, tags); `POST/PATCH/DELETE` on menu-items/things-to-know/highlights | Restaurants | Bearer | Owner-only AND FULL tier — guard checks `ownerId === request.user.id AND trustTier === 'FULL'`, §9 |
| `GET /admin/claims/disputes`, `POST /admin/claims/:id/resolve-dispute` | Claims (§9) | Bearer | Admin-only — uphold (revoke) or dismiss |
| `GET /admin/claims/upgrades`, `POST /admin/claims/:id/{approve,reject}-upgrade` | Claims (§9) | Bearer | Admin-only — grants or denies the FULL tier. Who the first admins are isn't decided, see §10 |

**The claims/admin rows are placeholders, not a design** — same caveat as the provisional modules above: these route names exist so the API surface has a complete shape to look at, not because their request/response contracts have been thought through. Each gets specced for real before it's built, same as every other feature in this project.

---

## 7. Request lifecycle

The layer none of §2/§5/§6 show on its own: the guard deciding whether a route needs a token, and what happens when an access token has quietly expired mid-session.

1. Mobile sends a request, `Authorization: Bearer <token>` if logged in.
2. Route requires auth (§6)?
   - **No** (public) → skip straight to the controller.
   - **Yes** → check the access token.
3. Access token valid & unexpired? → **yes**: `req.user` ← JWT payload, proceed to the controller.
4. Invalid/expired → `401` → mobile's HTTP interceptor calls `POST /auth/refresh` (§5's rotation flow).
5. Refresh succeeded? → **yes**: retry the *original* request once, with the new access token — re-enters at step 1, never loops twice.
6. Refresh failed (revoked/expired) → clear SecureStore, route to the Login screen (`FLOWS.md`'s Flow 2).
7. Controller executes the route's handler (reads §2 or writes §6 as appropriate) → response to mobile (200, or the module's own error shape).

Two details worth reading twice: public routes never touch the guard at all — that's what makes `auth.md`'s "browse fully while logged out" true by construction, not a check someone has to remember. And the retry only happens once — a genuinely revoked session fails fast into the login screen instead of hammering `/auth/refresh`.

---

## 8. Database tables

Eleven tables pre-claim (a 12th, `RestaurantClaim`, arrives in §9), all of them ours — no `RestaurantPhoto`, no `Review`, no `OpeningHours`, because none of that is allowed to be a table at all (§3). `Favorite`, `Order`, and `Reservation` are the only tables holding a foreign key into both `User` and `Restaurant` — the many-to-many resolved three different ways, once per relationship, rather than one generic junction table serving all three.

| Table | Field | Type | Notes |
|---|---|---|---|
| `User` | id | serial, PK | |
| | email | string, unique | |
| | passwordHash | string, nullable | argon2id — §5. Null for Google/Apple-only accounts |
| | name | string | |
| | createdAt, updatedAt | timestamp | |
| `RefreshToken` | id | serial, PK | |
| | userId | FK → User | |
| | tokenHash | string | Never the raw token — §5 |
| | expiresAt, revokedAt | timestamp, nullable | |
| | replacedByTokenId | FK → RefreshToken, nullable, self | Set on rotation — enables §5's reuse-detection branch |
| `Restaurant` | id | serial, PK | Ours — not Google's id |
| | googlePlaceId | string, unique, indexed | Exempt from caching restrictions — indefinite, §3 |
| | latitude, longitude | float | ≤ 30 days, §3 |
| | coordsCachedAt | timestamp | TTL check for the row above — nothing else on this table has a TTL. Replaces `DATA_MODEL.md`'s old whole-record `cachedAt` |
| | occasion, ambient | enum/string | Ours — no Google equivalent |
| | tags | string[] | Ours |
| | whatsapp, instagramHandle | string, nullable | Ours |
| | createdAt, updatedAt | timestamp | |
| `MenuItem` | id, restaurantId | serial PK, FK → Restaurant | |
| | name, price | string, string (display) | Ours — no Google equivalent |
| `ThingToKnow` | id, restaurantId | serial PK, FK → Restaurant | |
| | title, text | string, text | Ours |
| `Highlight` | id, restaurantId | serial PK, FK → Restaurant | |
| | title, description | string, text | Ours |
| `Favorite` | userId, restaurantId | composite PK, FK × 2 | No surrogate id needed — the pair is already unique |
| | createdAt | timestamp | |
| `Order` *(provisional)* | id, userId, restaurantId | serial PK, FK × 2 | `profile.md` US3 not specced — shape is a placeholder |
| `Reservation` *(provisional)* | id, userId, restaurantId | serial PK, FK × 2 | `profile.md` US4 not specced — placeholder |
| `PaymentMethod` *(provisional)* | id, userId | serial PK, FK → User | `profile.md` US5 not specced. Likely a tokenized provider reference, not raw card data |
| `NotificationSetting` *(provisional)* | userId | PK, FK → User (1—1) | `profile.md` US6 not specced — placeholder |

---

## 9. Restaurant claims: from listing to owner-managed

Resolves what used to be an open "who authors `occasion`/`tags`/`menu`" question — but not with a single gate. Two independent axes: **ownership** is granted instantly and can be revoked later if disputed (optimistic, not pessimistic); **edit rights** start LIMITED and only unlock FULL once someone actually reviews evidence. Neither axis waits on an admin existing on day one.

1. Owner submits a document type + number. CNPJ gets an automated registry lookup; CPF gets only a format check (no public lookup exists).
2. Either way: claim is `AUTO_APPROVED` instantly — sets `Restaurant.ownerId`, grants LIMITED edit tier, no human involved yet.
3. **Safety-net track**: if anyone disputes the claim within a 14-day window, an admin reviews it → uphold (revoke ownership) or dismiss (ownership stands). No dispute within the window → ownership is simply final.
4. **Capability-upgrade track** (independent of the above): owner may submit an evidence document to request FULL edit rights → admin reviews → grants FULL, or the claim stays LIMITED (retriable).

**Concurrent claims**: the optimistic model sidesteps the race — first submission sets `ownerId` instantly (a DB-level unique/not-null constraint + transaction handles the millisecond-level race); a second attempt on an already-owned restaurant isn't a competing claim, it's `POST /restaurants/:id/claim/dispute`.

**New table**: `RestaurantClaim` — id, restaurantId (FK), claimantUserId (FK), docType (`CNPJ`|`CPF`), docNumber, status, disputeWindowExpiresAt, trustTier (`LIMITED`|`FULL`). Plus `Restaurant.ownerId` (FK → User, nullable).

---

## 10. Open questions

- **LEGAL — verify against the primary Terms**: retention windows here come from Google's developer policy pages and secondary summaries, not a full read of the current Service Specific Terms. Confirm exact wording, section numbers, and the EEA addendum before this ships.
- **NEEDS CLARIFICATION — first admins**: ownership itself needs zero admins now, but disputes and full-tier upgrades (§9) still need at least one `User` who can review them — nothing here says how that account is created. Presumably seeded directly, not through public signup, but that's an assumption.
- **NOT ADDRESSED — hosting, deployment & document storage**: where NestJS and Postgres actually run is out of scope for this doc — topology and data flow only. §9 adds an object-storage provider for claim evidence documents, not chosen here either.
- **DEFERRED — real OAuth**: `auth.md`'s Google/Apple buttons are still simulated (`Alert.alert`). A real implementation is authorization code + PKCE for mobile — its own diagram, when picked up.
- **NEEDS CLARIFICATION — first-run default**: carried over from `auth.md` — whether a fresh install should default to logged-out (currently `isLoggedIn: true`, a demo convenience) is untouched by this round.

**Resolved by this doc**: "who authors `occasion`/`tags`/`menu`" — restaurant partners, via a CNPJ/CPF claim (§9); unclaimed restaurants stay whatever a manual per-city seeding pass put there (that seeding process is still undefined, but now a smaller, separate question).

## Next steps, if picked up

1. `DATA_MODEL.md`'s `RestaurantPhoto`/`Review`/`OpeningHours` tables and 24h `cachedAt` contradict §3 — corrected there, see its Changelog.
2. `auth.md`'s Out of Scope said "no backend/token/session designed" — no longer true; it now points here.
3. Framework/build scaffolding (actual NestJS project, Prisma schema, migrations) is a deliberately separate next step, once this document itself is settled.

## Changelog

| Date | Change |
|------|--------|
| 2026-08-18 | Created from the target-architecture artifact (claude.ai design project). Resolves `DATA_MODEL.md`'s Google-caching compliance gap (cache-aside → live pass-through), confirms NestJS/Postgres/Prisma/REST, designs the full auth token strategy, API surface, request lifecycle, DB schema, and a two-axis restaurant-claim system. Vision only — nothing built yet. |
