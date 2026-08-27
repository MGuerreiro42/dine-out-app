# Data Model

**Created**: 2026-08-13
**Status**: Draft — `Restaurant` entity family modeled; no backend/ORM/framework work started

Cross-feature index, not a feature spec — same role `FLOWS.md` plays for user flows: a source of truth for the app's *persisted* entities and how they relate, citing the feature spec that owns each field's requirement. When this file and a feature spec disagree, the feature spec wins; fix this file to match. Full backend topology, auth design, and API surface: `ARCHITECTURE.md`, which owns the compliance rule below.

**Why separate from the wire contract**: `src/lib/googlePlaces/schema.ts` defines a wire contract mirroring Google Places API (New), kept separate from internal domain types (`PROJECT.md`'s decision log). What a real backend persists is different again from what its API returns.

**Compliance rule** (`ARCHITECTURE.md` §3): Google Maps Platform's Terms restrict caching of Places content. Only `place_id` may be retained indefinitely; coordinates may be retained up to 30 days. All other Google-sourced content — name, address, rating, photos, reviews, hours, phone — is not persisted. It is fetched live on each request.

**Scope**: only the `Restaurant` entity family — the one entity fully implemented and stable (`restaurant.md`'s US1-6). `User`, `Order`, `Reservation`, `PaymentMethod`, `NotificationSetting`, `Favorite` are not modeled in field-level detail here — see "Deferred entities."

## Data sourcing

- Restaurant core data and reviews come from Google Places, fetched live on every request. Not cached, not synced. Only `googlePlaceId` (indefinite) and `latitude`/`longitude` (≤30 days) are stored with a freshness check.
- Reviews are externally sourced, not user-authored in-app, and not persisted. No `Review` table exists in this model.
- `occasion`, `ambient`, `tags`, `whatsapp`, `instagramHandle`, `menu`, `thingsToKnow`, `highlights` are product-authored. Restaurant partners author their own listing's editable fields via a CNPJ/CPF ownership claim (`ARCHITECTURE.md` §9). Unclaimed restaurants retain whatever a manual per-city seeding pass set; that seeding process is undefined.

---

## Persisted model vs. wire contract

| Field | Wire contract today | Persisted model | Why |
|---|---|---|---|
| `cuisine`, price display (`$`/`$$$`) | Not on the wire contract as separate fields — derived at the frontend (`mapPrimaryTypeToCuisine`, `mapPriceLevel` in `src/lib/googlePlaces/mappers.ts`) | Not stored — only `primaryType` and the real Google `priceLevel` enum are | Derive both display forms wherever needed, never store redundantly. |

Opening hours, review text/timestamp, and photo URLs are fetched live from Google on every request and formatted into their wire shape at serve time. Not tables, not stored fields. See `ARCHITECTURE.md` §2-3.

---

## Entities

### `Restaurant` (core)

| Field | Type | Notes |
|---|---|---|
| `id` | integer/serial, PK | Not a UUID — the frontend does `Number(place.id)` at its normalization boundary (`mapPlaceToRestaurant`) and stores favorited ids as `Set<number>` (`src/stores/favorites.ts`). Distinct from `googlePlaceId` — this PK is our own, never sourced from Google. |
| `googlePlaceId` | string, unique, indexed | The one Google-sourced field retained indefinitely (§3 above). FK target for `Favorite`/`Order`/`Reservation`. |
| `coordsCachedAt` | timestamp | Freshness check for `latitude`/`longitude` only — nothing else on this table has a TTL. |
| `latitude`, `longitude` | float | ≤ 30 days retention. |
| `occasion`, `ambient` | string/enum | Product-authored, no Google equivalent. |
| `tags` | string[] | Product-authored. |
| `whatsapp`, `instagramHandle` | string, nullable | Product-authored. |
| `photoUrl` | string, non-nullable | Ingestion-assigned, not Google-sourced and not product-authored: drawn once, randomly, from the restaurant's cuisine bucket's 5-photo stock pool at first ingestion; excluded from every later re-ingestion's upsert so it never reassigns. A stock fallback, not real per-restaurant photography. Backfilled across all 41,205 rows and confirmed `NOT NULL`. `dine-out-backend-overture`'s `specs/restaurants.md` FR-028–FR-031. |
| `ownerId` | FK → `User`, nullable | Set on an approved ownership claim — `ARCHITECTURE.md` §9. |
| `createdAt`, `updatedAt` | timestamp | |

### `MenuItem` (1-N)

| Field | Type | Notes |
|---|---|---|
| `id` | PK | |
| `restaurantId` | FK → `Restaurant` | |
| `name` | string | |
| `price` | string (display) | Not a structured currency amount — fine for a prototype, would need revisiting for a real ordering flow. |

### `ThingToKnow` (1-N)

| Field | Type |
|---|---|
| `id` | PK |
| `restaurantId` | FK → `Restaurant` |
| `title` | string |
| `text` | text |

### `Highlight` (1-N)

| Field | Type |
|---|---|
| `id` | PK |
| `restaurantId` | FK → `Restaurant` |
| `title` | string |
| `description` | text |

---

## Deferred entities

Not modeled in field-level detail here — each is either low-priority today or tied to a decision recorded elsewhere. `ARCHITECTURE.md` §8 sketches all of these at the schema level (columns, FKs) as part of the full system design; this document's narrower scope is the detailed field-by-field rationale, deferred until each entity's owning spec is picked up.

- **`User`** — `auth.md`'s Out of Scope: no real backend auth is built yet. Target shape (`passwordHash`, argon2id) in `ARCHITECTURE.md` §5/§8.
- **`Favorite`** (`User`↔`Restaurant`) — `favorites.md`'s Architecture Mapping: favorited restaurants belong to a user account once login/auth exists. Sketched in `ARCHITECTURE.md` §8.
- **`Order`, `Reservation`, `PaymentMethod`, `NotificationSetting`** — back `profile.md`'s User Stories 3-6, still P3, not started. Marked `provisional` in `ARCHITECTURE.md` §8.
- **`instagramPhotos`** — no Google equivalent, no real Instagram integration planned (`restaurant.md`'s Out of Scope).
- **`RestaurantClaim`** — `ARCHITECTURE.md` §9 (ownership + edit-tier system), outside this document's `Restaurant`-core-only scope.

## What this document does not include

No migrations, no repo scaffolding, no endpoints — entity/relationship design only. Backend framework (NestJS/Prisma/Postgres) is confirmed in `ARCHITECTURE.md` §4; scaffolding is a separate, not-yet-started step.

## Changelog

| Date | Change |
|------|--------|
| 2026-08-13 | Created. `Restaurant` entity family modeled (`Restaurant`, `RestaurantPhoto`, `MenuItem`, `Review`, `ThingToKnow`, `Highlight`, `OpeningHours`), persisted-vs-wire-contract distinction made explicit. `User`/`Order`/`Reservation`/`PaymentMethod`/`NotificationSetting`/`Favorite` deferred. |
| 2026-08-13 | Added "Data sourcing" section confirming real product intent (Google Places for core data + reviews; custom fields stay product-authored, source `[NEEDS CLARIFICATION]`). Added `Restaurant.googlePlaceId` + a freshness timestamp. |
| 2026-08-13 | Corrected sourcing pattern from proactive "sync" to cache-aside (check DB by `googlePlaceId`, call Google only on a miss/TTL expiry). Renamed `lastSyncedAt` → `cachedAt`. Resolved the `Review` de-dup question: a cache refresh deletes and reinserts reviews wholesale. |
| 2026-08-18 | Corrected for Google Maps Platform ToS compliance (`ARCHITECTURE.md`): the 24h cache-aside pattern above violates the Terms — only `place_id` (indefinite) and coordinates (≤30 days) may be cached. Removed `RestaurantPhoto`, `Review`, `OpeningHours` as persisted entities (all live-only now); removed `Restaurant`'s Google-sourced display columns (`displayName`, `formattedAddress`, `rating`, `userRatingCount`, `priceLevel`, `primaryType`, `internationalPhoneNumber`, `editorialSummary`, 12 amenity flags); renamed whole-row `cachedAt` → `coordsCachedAt`, scoped to `latitude`/`longitude` only. Added `Restaurant.ownerId`, resolving "who authors custom fields" via `ARCHITECTURE.md` §9's ownership-claim system. |
| 2026-08-18 | Rewritten for tone — narrative/historical framing removed from body sections, consolidated into this Changelog. |
| 2026-08-27 | Added `Restaurant.photoUrl` (nullable stock-photo fallback, ingestion-assigned once per row from its cuisine bucket's pool, never reassigned — `dine-out-backend-overture`'s `specs/restaurants.md` FR-028–FR-031). This document still models the pre-Overture-pivot Google Places shape (`googlePlaceId`, `coordsCachedAt`; no `cuisineId`/`source`/`sourceId`) — not resynced in full this round, scoped to `photoUrl` only. |
| 2026-08-27 | `photoUrl` backfilled across all 41,205 rows and the follow-up `NOT NULL` migration applied on the backend; column marked non-nullable here to match. Wired into the app's wire/domain layers (`src/lib/api/schema.ts`, `src/lib/api/mappers.ts`, `useRestaurantDetailQuery.ts`) — real photos now render on Home, Search, and restaurant detail, verified via a live Playwright pass against the running backend. |
