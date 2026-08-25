# Data Model

**Created**: 2026-08-13
**Status**: Draft — `Restaurant` entity family modeled; no backend/ORM/framework work started

Cross-feature index, not a feature spec — same role `FLOWS.md` plays for user flows: a source of truth for the app's *persisted* entities and how they relate, citing the feature spec that owns each field's requirement. When this file and a feature spec disagree, the feature spec wins; fix this file to match. Full backend topology, auth design, and API surface: `ARCHITECTURE.md`, which owns the compliance rule below.

**Why separate from the wire contract**: `src/lib/googlePlaces/schema.ts` defines a wire contract mirroring Google Places API (New), kept separate from internal domain types (`PROJECT.md`'s decision log). What a real backend persists is different again from what its API returns.

**Overture sourcing rule** (`ARCHITECTURE.md` §2/§3): the `Restaurant` catalog's base read path is populated by an offline ingestion script reading Overture Maps' Places dataset (`dine-out-backend`'s `specs/restaurants.md`), not a per-request Google fetch. Overture's CDLA Permissive 2.0 license permits indefinite retention of the full place record — `sourceId`, `source`, `category`, `confidence`, `sourceAttributes`, `lastSyncedAt`, `displayName`, `formattedAddress`, `latitude`, `longitude` are all persisted, with no TTL and no caching restriction.

**Compliance rule, deferred enrichment layer only** (`ARCHITECTURE.md` §3/§10): Google Maps Platform's Terms restrict caching of Places content. Only `place_id` may be retained indefinitely; coordinates may be retained up to 30 days. All other Google-sourced content — name, address, rating, photos, reviews, hours, phone — must not be persisted, fetched live on each request instead. This rule applies only if a future Google enrichment layer (reviews, photos) is built; no such layer exists today, and `googlePlaceId` is reserved, unpopulated by ingestion.

**Scope**: only the `Restaurant` entity family — the one entity fully implemented and stable (`restaurant.md`'s US1-6). `User`, `Order`, `Reservation`, `PaymentMethod`, `NotificationSetting`, `Favorite` are not modeled in field-level detail here — see "Deferred entities."

## Data sourcing

- Restaurant core data (`displayName`, `formattedAddress`, `latitude`, `longitude`, `category`) comes from Overture Maps' Places dataset, populated by an offline ingestion script (`dine-out-backend`'s `specs/restaurants.md`), not a per-request fetch. `sourceId`/`source` identify the Overture record; `confidence` and `sourceAttributes` carry provenance; `lastSyncedAt` marks the last ingestion touch — not a TTL, since Overture's license imposes no retention limit.
- Reviews have no source today. A future Google Places enrichment layer (`ARCHITECTURE.md` §10) is deferred, not implemented; if built, its content would be fetched live and not persisted, per Google's Terms. No `Review` table exists in this model.
- `occasion`, `ambient`, `tags`, `whatsapp`, `instagramHandle`, `menu`, `thingsToKnow`, `highlights` are product-authored. Restaurant partners author their own listing's editable fields via a CNPJ/CPF ownership claim (`ARCHITECTURE.md` §9). Unclaimed restaurants come from the Overture ingestion script — the previously-undefined seeding process — with `occasion`/`ambient` unset; what the app displays in that state is `[NEEDS CLARIFICATION]`, see `dine-out-backend`'s `specs/restaurants.md` FR-009.

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
| `id` | integer/serial, PK | Not a UUID — the frontend does `Number(place.id)` at its normalization boundary (`mapPlaceToRestaurant`) and stores favorited ids as `Set<number>` (`src/stores/favorites.ts`). Distinct from `sourceId`/`googlePlaceId` — this PK is our own, never sourced externally. |
| `source` | enum (`OVERTURE`) | Which catalog source populated this row. Extensible for a future source. |
| `sourceId` | string | Overture GERS id. `(source, sourceId)` unique together — the ingestion script's upsert key. |
| `category` | string | Overture `categories.primary` (e.g. `italian_restaurant`). Distinct from `occasion`/`ambient` below. |
| `confidence` | float | Overture's row-level confidence score, 0-1. |
| `sourceAttributes` | json | Full raw Overture Places row, for traceability without re-fetching from the source dataset. |
| `lastSyncedAt` | timestamp | Last ingestion touch. Not a TTL — Overture's license imposes no retention limit (§ above). |
| `displayName` | string | Overture `names.primary`. Indefinite retention (§ above). |
| `formattedAddress` | string, nullable | Overture-sourced; not every source row has an address. Indefinite retention. |
| `latitude`, `longitude` | float | Overture-sourced. Indefinite retention. |
| `googlePlaceId` | string, unique, nullable | Reserved for a future Google enrichment layer (`ARCHITECTURE.md` §10). Not populated by ingestion. |
| `occasion`, `ambient` | string, nullable | Product-authored, no Overture equivalent. Null until an ownership claim sets them (`ARCHITECTURE.md` §9) — see the unclaimed-row open question above. |
| `tags` | string[] | Product-authored. |
| `whatsapp`, `instagramHandle` | string, nullable | Product-authored. |
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
| 2026-08-25 | Restaurant catalog re-sourced from Overture Maps Places (CDLA Permissive 2.0) instead of a live Google Places pass-through — the Google-caching compliance rule now applies only to a deferred, unbuilt future enrichment layer. `Restaurant` gains `source`/`sourceId`/`category`/`confidence`/`sourceAttributes`/`lastSyncedAt`/`displayName`/`formattedAddress`, all persisted indefinitely under Overture's license (re-adding `displayName`/`formattedAddress`, removed 2026-08-18 as Google-sourced-not-persisted, now Overture-sourced-and-persisted). `googlePlaceId` becomes nullable, reserved for the deferred enrichment layer. `coordsCachedAt` removed — no TTL under Overture's license, replaced by `lastSyncedAt`. `occasion`/`ambient` become nullable: resolves "seeding process for unclaimed restaurants is undefined" (now: the Overture ingestion script) but opens a new, unresolved question — what the app displays for a row ingestion alone created. Full design and open questions: `dine-out-backend`'s `specs/restaurants.md`. |
