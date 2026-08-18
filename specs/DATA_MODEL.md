# Data Model

**Created**: 2026-08-13
**Status**: Draft — `Restaurant` entity family modeled; corrected 2026-08-18 for Google Maps Platform ToS compliance (see Changelog); no backend/ORM/framework work started yet

Cross-feature index, not a feature spec — same role `FLOWS.md` plays for user flows: a source of truth for the app's *persisted* entities and how they relate, citing the feature spec that owns each field's requirement. When this file and a feature spec disagree, the feature spec wins; fix this file to match. For the full backend topology, auth design, API surface, and the *why* behind the compliance rule below, see `ARCHITECTURE.md`.

**Why separate from the wire contract**: `src/lib/googlePlaces/schema.ts` defines a wire contract mirroring Google Places API (New), deliberately kept separate from internal domain types (`PROJECT.md`'s decision log). This doc extends that one layer deeper: **what a real backend persists is also different from what its API returns**.

**Compliance rule (corrected 2026-08-18, see `ARCHITECTURE.md` §3)**: Google Maps Platform's Terms prohibit caching most Places content — only `place_id` is exempt indefinitely, and coordinates may be cached up to 30 days. Everything else Google-sourced (name, address, rating, photos, reviews, hours, phone) is **not a table in this model** — it's fetched live on every request and merged into the response, never written to Postgres. Reformatting it into our own schema wouldn't create an exception.

**Scope of this round**: only the `Restaurant` entity family — the one entity fully implemented and stable (`restaurant.md`'s US1-6). `User`, `Order`, `Reservation`, `PaymentMethod`, `NotificationSetting`, `Favorite` deliberately not modeled yet — see "Deferred entities."

## Data sourcing (confirmed with the user; corrected 2026-08-18)

The frontend's mock shape is a *reference* for what fields exist, not the authority on how the real product sources/stores them:

- **Restaurant core data and reviews come from Google Places, fetched live on every request — not cached, not synced.** ~~Read through a cache-aside pattern with a 24h TTL~~ — corrected: Google's Terms don't allow caching this content at all (see the compliance rule above and `ARCHITECTURE.md` §2-3). Only `googlePlaceId` (indefinite) and `latitude`/`longitude` (≤30 days) get a stored, freshness-checked row; everything else Google-sourced is merged into the response at request time and discarded.
- **Reviews stay externally-sourced, not user-authored in-app, and are not persisted at all** — no `Review` table exists in this model (see Entities below).
- **`occasion`, `ambient`, `tags`, `whatsapp`, `instagramHandle`, `menu`, `thingsToKnow`, `highlights` have no Google Places equivalent** — remain product-authored. **Resolved** (`ARCHITECTURE.md` §9): restaurant partners author their own listing's editable fields via a CNPJ/CPF ownership claim; unclaimed restaurants stay whatever a manual per-city seeding pass put there — that seeding process itself is still undefined.

---

## Persisted model vs. wire contract: what's different, and why

**Corrected 2026-08-18**: this table used to describe *how* opening hours, reviews, and photos would be persisted. They aren't — see the compliance rule above. What's left is only the one row that was never about Google-content retention in the first place.

| Field | Wire contract today | Persisted model | Why |
|---|---|---|---|
| `cuisine`, price display (`$`/`$$$`) | Not on the wire contract as separate fields — already derived at the frontend (`mapPrimaryTypeToCuisine`, `mapPriceLevel` in `src/lib/googlePlaces/mappers.ts`) | Not stored — only `primaryType` and the real Google `priceLevel` enum are | Unchanged from today's approach, just confirmed at the persistence layer too: derive both display forms wherever they're needed, never store them redundantly. |

Opening hours, review text/timestamp, and photo URLs are fetched live from Google on every request and formatted into their wire shape at serve time — never a table, never a stored field. See `ARCHITECTURE.md` §2-3.

---

## Entities

### `Restaurant` (core)

| Field | Type | Notes |
|---|---|---|
| `id` | integer/serial, PK | **Not** a UUID — the frontend already does `Number(place.id)` at its normalization boundary (`mapPlaceToRestaurant` in `src/lib/googlePlaces/mappers.ts`) and stores favorited ids as `Set<number>` (`src/stores/favorites.ts`). An integer-compatible PK, serialized as a string on the wire (matching Google's `id: z.string()`), keeps both of those working with zero frontend change. **Distinct from `googlePlaceId` below** — this PK is purely our own, never exposed to or sourced from Google. |
| `googlePlaceId` | string, unique, indexed | The one Google-sourced field we're allowed to keep indefinitely (§3) — what we look up by before calling Google, and the FK target for `Favorite`/`Order`/`Reservation`. |
| `coordsCachedAt` | timestamp | **Renamed from `cachedAt`, scoped down** (corrected 2026-08-18) — was a whole-row freshness timestamp under the old cache-aside design; now checks only `latitude`/`longitude`'s 30-day retention limit (§3). Nothing else on this table has a TTL, because nothing else Google-sourced is stored on it at all. |
| `latitude`, `longitude` | float | ≤ 30 days retention, `coordsCachedAt` above |
| `occasion`, `ambient` | string/enum | Custom, no Google equivalent — same as today (`AppPlaceSchema`'s extension over `GooglePlaceSchema`) |
| `tags` | string[] | Custom |
| `whatsapp`, `instagramHandle` | string, nullable | Custom |
| `ownerId` | FK → `User`, nullable | Set on an approved ownership claim — `ARCHITECTURE.md` §9 |
| `createdAt`, `updatedAt` | timestamp | |

**Removed 2026-08-18** (see the compliance rule above): `displayName`, `formattedAddress`, `rating`, `userRatingCount`, `priceLevel`, `primaryType`, `editorialSummary`, `internationalPhoneNumber`, and the 12 boolean amenity flags — all Google-sourced, all fetched live per request, none of them a column on this table. `primaryType` in particular is gone even though `cuisine` derives from it (see the table above) — the derivation now happens against the *live* Google response, not a stored value.

### `MenuItem` (1-N)

| Field | Type | Notes |
|---|---|---|
| `id` | PK | |
| `restaurantId` | FK → `Restaurant` | |
| `name` | string | |
| `price` | string (display) | **Not** a structured currency amount — `restaurant.md`'s own `MenuItem` entity already calls this out as "fine for a prototype, would need revisiting for a real ordering flow." Unchanged here; ordering is still out of scope everywhere. |

**Removed 2026-08-18**: `RestaurantPhoto` and `Review` are no longer entities in this model — both are 100% Google-sourced content with no persistence allowed under §3. Fetched live, formatted into their wire shape, never written to Postgres. Opening hours were never their own entity here either; same rule applies now that it's explicit.

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

**Removed 2026-08-18**: `OpeningHours` is no longer an entity here — 100% Google-sourced, live-only, same rule as `RestaurantPhoto`/`Review` above.

---

## Deferred entities (not this round)

Not modeled *in field-level detail* here yet — each is either low-priority/barely-specified today, or explicitly tied to a future decision already on record elsewhere. **Note (2026-08-18)**: `ARCHITECTURE.md` §8 now sketches all of these at the schema level (columns, FKs) as part of the full system design — this section's scope is narrower: the detailed *why* for each field, deferred until each entity's owning spec is actually picked up.

- **`User`** — `auth.md`'s own Out of Scope still says no real backend auth is built; `ARCHITECTURE.md` §5/§8 designs the target shape (`passwordHash`, argon2id) but nothing here is implemented. Field-level rationale deferred to whenever `auth.md` gets a real backend round.
- **`Favorite`** (`User`↔`Restaurant`) — `favorites.md`'s Architecture Mapping: "favorited restaurants will eventually belong to a user account once login/auth exists... don't build speculative auth scaffolding now." Sketched in `ARCHITECTURE.md` §8 (composite PK, no surrogate id) as part of the full schema; still not this document's detailed scope.
- **`Order`, `Reservation`, `PaymentMethod`, `NotificationSetting`** — all back `profile.md`'s User Stories 3-6, still P3 and not started (currently placeholder screens). Marked `provisional` in `ARCHITECTURE.md` §8 for the same reason — a shape to look at, not a design.
- **`instagramPhotos`** — no Google equivalent, no real Instagram integration planned (`restaurant.md`'s Out of Scope excludes real Instagram API/OAuth). Storage for it would be speculative ahead of any spec calling for real Instagram data.
- **`RestaurantClaim`** — new in `ARCHITECTURE.md` §9 (ownership + edit-tier system), out of this document's `Restaurant`-core-only scope from 2026-08-13.

## What this document does not include

No migrations, no repo scaffolding, no endpoints — this is entity/relationship design only. Backend framework (NestJS/Prisma/Postgres) is now confirmed in `ARCHITECTURE.md` §4; actual scaffolding is still a deliberately separate next step, once both documents are settled.

## Changelog

| Date | Change |
|------|--------|
| 2026-08-13 | Created. `Restaurant` entity family modeled (`Restaurant`, `RestaurantPhoto`, `MenuItem`, `Review`, `ThingToKnow`, `Highlight`, `OpeningHours`), persisted-vs-wire-contract distinction made explicit. `User`/`Order`/`Reservation`/`PaymentMethod`/`NotificationSetting`/`Favorite` deferred. |
| 2026-08-13 | Added "Data sourcing" section confirming real product intent (Google Places for core data + reviews; custom fields stay product-authored, source `[NEEDS CLARIFICATION]`). Added `Restaurant.googlePlaceId` + a freshness timestamp. |
| 2026-08-13 | Corrected sourcing pattern from proactive "sync" to **cache-aside** (check DB by `googlePlaceId`, call Google only on a miss/TTL expiry) — no background process needed. Renamed `lastSyncedAt` → `cachedAt`. Resolved the `Review` de-dup question: a cache refresh deletes + reinserts reviews wholesale, so Google's lack of a stable per-review ID isn't a problem. |
| 2026-08-18 | **Corrected for Google Maps Platform ToS compliance** (`ARCHITECTURE.md`, built from a review of Google's caching policy). The 24h cache-aside pattern above violates the Terms — only `place_id` (indefinite) and coordinates (≤30 days) may be cached, not the rest of `Restaurant`'s Google-sourced fields. Removed `RestaurantPhoto`, `Review`, `OpeningHours` as persisted entities (all live-only now); removed `Restaurant`'s Google-sourced display columns (`displayName`, `formattedAddress`, `rating`, `userRatingCount`, `priceLevel`, `primaryType`, `internationalPhoneNumber`, `editorialSummary`, the 12 amenity flags); renamed whole-row `cachedAt` → `coordsCachedAt`, scoped to `latitude`/`longitude` only. Added `Restaurant.ownerId`, resolving the "who authors custom fields" `[NEEDS CLARIFICATION]` via `ARCHITECTURE.md` §9's ownership-claim system. |
