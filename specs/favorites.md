# Feature Specification: Favorites

**Feature**: `favorites` — folder `src/features/favorites/`
**Created**: 2026-07-23
**Status**: Draft
**Design reference**: `App Flow.dc.html`, frame "6 · Profile" (favorites rail) and frame "2 · Restaurant Detail" (like toggle, spec'd in `restaurant.md`, contract owned here)

## Summary

The mechanism by which a user marks restaurants as favorites and later finds them again. There's no dedicated Favorites screen in the current design — favorites surface as a rail inside Profile. This feature owns two things: the actual favorited/not-favorited state (a small piece of shared, cross-feature state), and the rail that displays it. The like *button* itself, where a user first taps it, physically lives on the restaurant detail screen and is specified there (`restaurant.md`, User Story 7) — this spec is the contract that button relies on.

## User Stories

### User Story 1 - Favorited state persists across the app (Priority: P1)

Once a user favorites a restaurant from anywhere in the app, that fact is available everywhere else in the app that cares about it — the detail screen's heart icon, the Profile favorites rail, and any future entry point — without each place tracking its own separate copy.

**Why this priority**: this is the actual product capability being specified. Without a single source of truth for "what's favorited," the feature doesn't exist — it'd just be a button that looks like it does something.

**Independent test**: favorite a restaurant from its detail screen, background the interaction (navigate to Home, then to Profile), confirm the restaurant appears in the Profile favorites rail without any extra action; unfavorite it from the detail screen again, confirm it disappears from the rail.

**Acceptance scenarios**:

1. **Given** no restaurants are favorited, **when** the app starts, **then** the favorites store reports an empty set and the Profile favorites rail renders its empty state.
2. **Given** a restaurant is favorited from its detail screen, **when** the user opens Profile, **then** that restaurant appears in the favorites rail.
3. **Given** a restaurant is favorited, **when** the user unfavorites it (from wherever the toggle is exposed), **then** it's removed from the favorites rail on next render, and the detail screen's heart icon (if revisited) reflects the change.
4. **Given** the app is closed and reopened, **when** it restarts, **then** favorited state does NOT need to survive the restart at this stage — in-memory-only is acceptable. **Resolved** (was `[NEEDS CLARIFICATION]`): no local persistence (no `AsyncStorage`/`persist` middleware) for now. Favorites will eventually belong to the user account once login exists — see the Future Direction note in Architecture Mapping below — so persisting them client-side now would be throwaway work.

---

### User Story 2 - Browse my favorites from Profile (Priority: P2)

A user checks the Profile screen and sees the restaurants they've favorited, as a horizontal rail of cards, and can tap into any of them to revisit the detail screen.

**Why this priority**: the actual payoff of favoriting something is being able to find it again — but the store itself (User Story 1) has to exist first for this to have anything to show.

**Independent test**: with at least one restaurant favorited, open Profile, confirm the favorites rail shows that restaurant as a card (photo, name, rating, tags); tap it, confirm navigation to `/restaurant/[id]` for that restaurant.

**Acceptance scenarios**:

1. **Given** one or more restaurants are favorited, **when** the Profile screen renders, **then** the favorites rail shows a card per favorited restaurant.
2. **Given** the favorites rail, **when** the user taps a card, **then** the app navigates to that restaurant's detail screen.
3. **Given** zero restaurants are favorited, **when** the Profile screen renders, **then** the favorites rail area shows an explicit empty state rather than rendering nothing / an empty gap — **Resolved** (was `[NEEDS CLARIFICATION]`): no design mockup exists for this state, so a minimal default was chosen rather than blocking on it. A centered block replaces the rail's card row: a muted outline heart icon (`Icon`, reusing the same `Ionicons` `heart-outline` glyph the like button itself uses — no new asset), the line "Você ainda não tem favoritos," and a subtitle "Toque no coração de um restaurante para salvá-lo aqui." An "Explorar restaurantes" link to Home, matching `LoggedOutPrompt`'s existing link convention — added after PO review found the original "no CTA" reasoning left the user with no next step.

---

### Edge Cases

- **A favorited restaurant's id no longer resolves** in the mock data (e.g. mock data changes during development): the favorites rail's card-rendering must not crash — either filter the id out silently or show a broken-entry placeholder. Not specified by the design; default to filtering silently unless told otherwise.
- **Toggling the same restaurant rapidly** (double-tap the like icon): must not leave the store in an inconsistent state — the final state must match the actual number of taps (odd = favorited, even = not), not the number of renders.
- **Favoriting the same restaurant from two places "simultaneously"** (not really possible in this app's current single-screen-at-a-time navigation, but worth stating): the store is a single source of truth, so this isn't actually a race condition here — noted for completeness, not because it's a real risk yet.

## Functional Requirements

- **FR-001**: The system MUST maintain a single, shared record of which restaurant ids are currently favorited, readable and writable from any feature.
- **FR-002**: The system MUST provide a way to toggle a given restaurant id's favorited state.
- **FR-003**: The system MUST provide a way to check whether a given restaurant id is currently favorited.
- **FR-004**: The system MUST display, inside the Profile screen, a horizontal rail of the currently favorited restaurants as cards.
- **FR-005**: The user MUST be able to tap a favorited-restaurant card and navigate to its detail screen.
- **FR-006 — Resolved**: The system MUST show an explicit empty state in the favorites rail area when no restaurants are favorited — copy/visual defined above in User Story 2's acceptance scenario 3 (was `[NEEDS CLARIFICATION]`).
- **FR-007**: Favorited state does NOT need to persist across app restarts at this stage — in-memory only, resettable on reload. This is deliberate, not a shortcut: real persistence will be tied to the user account once authentication exists (see Architecture Mapping's Future Direction note), so a client-side persistence layer built now would be replaced, not extended.

### Key Entities

- **FavoriteId**: not a distinct domain entity — just a `Restaurant.id` reference held in the favorites store. There is no separate "Favorite" record with its own fields (no favorited-at timestamp, no notes, etc.) at this stage.

## Success Criteria

- **SC-001**: Favoriting a restaurant on the detail screen and checking Profile reflects the change with no manual refresh and no perceptible delay.
- **SC-002**: The favorited count shown anywhere in the app (e.g. a future profile stat) always matches the actual number of favorited restaurant ids in the store — never drifts out of sync.
- **SC-003**: A user can go from "see a restaurant I like" to "find it again later in Profile" in exactly 2 taps total (1 to favorite, 1 to open Profile — reaching the rail itself requires no extra taps once Profile is open).

## Architecture Mapping

- **Feature folder**: `src/features/favorites/{api,components,types}`. The scaffolded `stores/` placeholder in this folder **stays empty** — this is intentional, not an oversight: the actual state lives in `src/stores/favorites.ts` (global), because it's read and written by `restaurant` too, and features can't import each other's local stores. `favorites` is the feature that *owns the contract* for that global store, not the folder it physically lives in.
- **`src/stores/favorites.ts` (global, Zustand) — this spec is where its contract is defined, already implemented**: built in `profile.md`'s round (`feat/profile-menu`), ahead of this spec and ahead of `restaurant.md`'s US7 too — the user chose to build it early so Profile's favorites-count stat would be real from day one, rather than a `0` placeholder. Contract matches exactly what's defined below, no drift:
  ```ts
  type FavoritesStore = {
    favoriteIds: Set<number>;
    toggleFavorite: (id: number) => void;
    isFavorite: (id: number) => boolean;
  };
  ```
  Any feature needing favorited state (`restaurant` for the like icon, `favorites` for the rail) reads/writes this store directly — neither imports the other.
- **Reuses from `src/components/ui/`**: `RestaurantCard`, `HorizontalRail`.
- **Fetching favorited restaurants' full data**: `favoriteIds` in the store only holds ids, not full `Restaurant` records. `features/favorites/api/useFavoriteRestaurantsQuery.ts` calls `src/mocks/repository.ts`'s `getNearbyPlaces()` directly (same mock entry point `search`'s `useRestaurantsQuery` calls — the Google-Places-shaped repository, not `src/mocks/restaurants.ts`'s raw fixture directly, per the ADR log's Google Places mock rework) and filters the resolved `Restaurant[]` by the store's `favoriteIds`. This is intentional, small duplication of "a hook that fetches restaurants" rather than `favorites` importing `search`'s hook — keeps the features isolated at the cost of two thin query wrappers over the same mock, which stops mattering once this is a real API (each feature would legitimately call its own endpoint anyway). Filtering the resolved list by id, rather than fetching per-id, also resolves the "favorited id no longer resolves" edge case by construction — an id with no matching restaurant just doesn't appear, no special-case code needed.
- **Types**: no new type needed — reuses the shared `Restaurant` from `src/types/restaurant.ts`.
- **Mocks**: no new mock file — reuses `src/mocks/restaurants.ts`.
- **New dependencies**: none. No persistence middleware needed at this stage (see FR-007) — implement `favoriteIds` as plain in-memory Zustand state, no `persist` middleware, no `AsyncStorage`.
- **Future direction (not this spec's scope, recorded so it isn't lost)**: favorited restaurants will eventually belong to a user account once a login/auth system exists — at that point, `favoriteIds` stops being client-only Zustand state and becomes server-backed, scoped per user. When that happens, this spec's contract (`toggleFavorite`, `isFavorite`) can likely stay the same at the call-site level — only `useRestaurantsQuery`-style internals change from reading a mock to calling a real, authenticated endpoint. Don't build speculative auth scaffolding now; this is just so the next person (or agent) writing the login/account feature knows favorites is one of the things that'll need migrating.

## Out of Scope

- A dedicated Favorites tab/screen — explicitly not in the current design (see `PROJECT.md`'s decision log: "Favorites has no route of its own").
- Favoriting from contexts other than the restaurant detail screen (e.g. a heart icon directly on Home cards) — not shown in the current design's Home frame.
- Any social/sharing feature around favorites (e.g. sharing a favorites list).
- Sorting, filtering, or organizing favorites (e.g. into custom lists/collections).
- The rest of the Profile screen (avatar, stats, account menu with orders/reservations/payment/notifications/logout) — **flagging a real gap**: none of that Profile content maps to `search`, `restaurant`, or `favorites`. It has no owning feature yet in `PROJECT.md`'s Feature Index. Out of scope here; needs its own spec (likely a new `profile`/`account` feature) before it's implemented.

## Assumptions and Dependencies

- Depends on `app/(tabs)/profile.tsx` existing as a route (it does, currently a placeholder) and on `restaurant.md`'s User Story 7 for the actual UI trigger that writes to the store this spec defines.
- Confirmed: in-memory (non-persisted) favorited state is acceptable for this prototype phase. Persistence is intentionally deferred to a future login/account system, not an oversight — see the Future Direction note in Architecture Mapping.

## Notes for the AI Agent

- `src/stores/favorites.ts` already exists (built in `profile.md`'s round) — don't recreate it. This spec's remaining job is the actual UI: the favorite icon on the restaurant detail screen (`restaurant.md`'s US7) and the favorites rail on Profile (User Story 2 below).
- Persistence is resolved: do NOT add `persist` middleware or `AsyncStorage` — plain in-memory Zustand state only (see FR-007).
- Verification: `npx tsc --noEmit` clean + bundle smoke test on `/profile` per the pattern in the root `CLAUDE.md`. Since this feature has no route of its own, there's no dedicated URL to smoke-test beyond `/profile` and `/restaurant/[id]` (already covered by `restaurant.md`).

## Changelog

| Date | Change |
|------|--------|
| 2026-07-23 | Spec created. No implementation yet. |
| 2026-07-23 | Resolved the persistence `[NEEDS CLARIFICATION]`: no persistence needed at this stage, in-memory only — deferred to a future login/account system. Empty-state copy `[NEEDS CLARIFICATION]` (FR-006) still open. |
| 2026-07-24 | `src/stores/favorites.ts` was built in `profile.md`'s round (`feat/profile-menu`), ahead of this spec, so Profile's favorites-count stat would be real from day one — contract matches exactly what this spec already specified, no drift. This spec's own User Stories (the like icon, the favorites rail) are still not implemented. |
| 2026-08-17 | Design pass for User Story 2 (the favorites rail). Resolved FR-006's empty-state `[NEEDS CLARIFICATION]` with a minimal default (see acceptance scenario 3 above) rather than blocking on a design mockup that doesn't exist yet. Corrected the "fetching favorited restaurants' full data" note: the mock layer moved to the Google-Places-shaped `src/mocks/repository.ts` (`restaurant.md`'s US3/US4 rounds, see `PROJECT.md`'s ADR log) since this spec was drafted — `useFavoriteRestaurantsQuery.ts` calls `getNearbyPlaces()`, not `src/mocks/restaurants.ts` directly. Also surfaced, out of this spec's own drift but worth recording here since it directly unblocks User Story 2: `restaurant.md`'s User Story 7 (the like icon, FR-016) reads as not-started in that spec's Status line, but `DetailHeaderActions.tsx` and the shared `RestaurantCard` already wire up `stores/favorites.ts`'s `toggleFavorite`/`isFavorite` for real (commit `e3da6e0`, 2026-08-12, `feat/restaurant-detail-redesign`) — `restaurant.md` itself needs its own status/FR-016/FR-019-022 correction pass, not done here to keep this edit scoped to `favorites.md`. |
