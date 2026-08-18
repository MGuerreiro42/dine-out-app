# Feature Specification: Favorites

**Feature**: `favorites` — folder `src/features/favorites/`
**Created**: 2026-07-23
**Status**: In Progress — User Story 1 Implemented (`stores/favorites.ts`, the like icon per `restaurant.md` US7); User Story 2 (Profile rail) designed, not implemented
**Design reference**: `App Flow.dc.html`, frame "6 · Profile" (favorites rail) and frame "2 · Restaurant Detail" (like toggle, spec'd in `restaurant.md`, contract owned here)

## Summary

The mechanism by which a user marks restaurants as favorites and later finds them again. There's no dedicated Favorites screen in the current design — favorites surface as a rail inside Profile. This feature owns two things: the actual favorited/not-favorited state (a small piece of shared, cross-feature state), and the rail that displays it. The like *button* itself, where a user first taps it, physically lives on the restaurant detail screen and is specified there (`restaurant.md`, User Story 7) — this spec is the contract that button relies on.

## User Stories

### User Story 1 - Favorited state persists across the app (Priority: P1) — Implemented

Once a user favorites a restaurant from anywhere in the app, that fact is available everywhere else in the app that cares about it — the detail screen's heart icon, the Profile favorites rail, and any future entry point — without each place tracking its own separate copy.

**Why this priority**: this is the actual product capability being specified. Without a single source of truth for "what's favorited," the feature doesn't exist — it'd just be a button that looks like it does something.

**Independent test**: favorite a restaurant from its detail screen, background the interaction (navigate to Home, then to Profile), confirm the restaurant appears in the Profile favorites rail without any extra action; unfavorite it from the detail screen again, confirm it disappears from the rail.

**Acceptance scenarios**:

1. **Given** no restaurants are favorited, **when** the app starts, **then** the favorites store reports an empty set and the Profile favorites rail renders its empty state.
2. **Given** a restaurant is favorited from its detail screen, **when** the user opens Profile, **then** that restaurant appears in the favorites rail.
3. **Given** a restaurant is favorited, **when** the user unfavorites it (from wherever the toggle is exposed), **then** it's removed from the favorites rail on next render, and the detail screen's heart icon (if revisited) reflects the change.
4. **Given** the app is closed and reopened, **when** it restarts, **then** favorited state does NOT need to survive the restart — in-memory-only, no `AsyncStorage`/`persist` middleware.

---

### User Story 2 - Browse my favorites from Profile (Priority: P2) — Designed, not implemented

A user checks the Profile screen and sees the restaurants they've favorited, as a horizontal rail of cards, and can tap into any of them to revisit the detail screen.

**Why this priority**: the actual payoff of favoriting something is being able to find it again — but the store itself (User Story 1) has to exist first for this to have anything to show.

**Independent test**: with at least one restaurant favorited, open Profile, confirm the favorites rail shows that restaurant as a card (photo, name, rating, tags); tap it, confirm navigation to `/restaurant/[id]` for that restaurant.

**Acceptance scenarios**:

1. **Given** one or more restaurants are favorited, **when** the Profile screen renders, **then** the favorites rail shows a card per favorited restaurant.
2. **Given** the favorites rail, **when** the user taps a card, **then** the app navigates to that restaurant's detail screen.
3. **Given** zero restaurants are favorited, **when** the Profile screen renders, **then** the favorites rail area shows an explicit empty state: a muted outline heart icon (`Ionicons` `heart-outline`), "Você ainda não tem favoritos," a subtitle "Toque no coração de um restaurante para salvá-lo aqui," and an "Explorar restaurantes" link to Home.

---

### Edge Cases

- **A favorited restaurant's id no longer resolves** in the mock data: the favorites rail filters the id out silently rather than crashing or showing a broken entry.
- **Toggling the same restaurant rapidly** (double-tap the like icon): final state matches the actual number of taps (odd = favorited, even = not), not the number of renders.

## Functional Requirements

- **FR-001**: The system MUST maintain a single, shared record of which restaurant ids are currently favorited, readable and writable from any feature.
- **FR-002**: The system MUST provide a way to toggle a given restaurant id's favorited state.
- **FR-003**: The system MUST provide a way to check whether a given restaurant id is currently favorited.
- **FR-004**: The system MUST display, inside the Profile screen, a horizontal rail of the currently favorited restaurants as cards.
- **FR-005**: The user MUST be able to tap a favorited-restaurant card and navigate to its detail screen.
- **FR-006**: The system MUST show an explicit empty state in the favorites rail area when no restaurants are favorited — copy/visual defined in User Story 2's acceptance scenario 3.
- **FR-007**: Favorited state MUST NOT persist across app restarts — in-memory only, resettable on reload. Real persistence is tied to a user account once authentication exists (see Architecture Mapping).

### Key Entities

- **FavoriteId**: not a distinct domain entity — just a `Restaurant.id` reference held in the favorites store. There is no separate "Favorite" record with its own fields (no favorited-at timestamp, no notes, etc.) at this stage.

## Success Criteria

- **SC-001**: Favoriting a restaurant on the detail screen and checking Profile reflects the change with no manual refresh and no perceptible delay.
- **SC-002**: The favorited count shown anywhere in the app (e.g. a future profile stat) always matches the actual number of favorited restaurant ids in the store — never drifts out of sync.
- **SC-003**: A user can go from "see a restaurant I like" to "find it again later in Profile" in exactly 2 taps total (1 to favorite, 1 to open Profile — reaching the rail itself requires no extra taps once Profile is open).

## Architecture Mapping

- **Feature folder**: `src/features/favorites/{api,components,types}`. The scaffolded `stores/` placeholder stays empty — the actual state lives in `src/stores/favorites.ts` (global), read and written by `restaurant` too. `favorites` owns the contract for that global store, not the folder it lives in.
- **`src/stores/favorites.ts`** (global, Zustand), contract owned by this spec:
  ```ts
  type FavoritesStore = {
    favoriteIds: Set<number>;
    toggleFavorite: (id: number) => void;
    isFavorite: (id: number) => boolean;
  };
  ```
  Any feature needing favorited state (`restaurant` for the like icon, `favorites` for the rail) reads/writes this store directly — neither imports the other.
- **Reuses from `src/components/ui/`**: `RestaurantCard`, `HorizontalRail`.
- **Fetching favorited restaurants' full data**: `favoriteIds` only holds ids. `features/favorites/api/useFavoriteRestaurantsQuery.ts` calls `src/mocks/repository.ts`'s `getNearbyPlaces()` and filters the resolved `Restaurant[]` by `favoriteIds` — filtering by id resolves the "favorited id no longer resolves" edge case by construction.
- **Types**: no new type — reuses the shared `Restaurant` from `src/types/restaurant.ts`.
- **Mocks**: no new mock file — reuses `src/mocks/restaurants.ts`.
- **New dependencies**: none. `favoriteIds` is plain in-memory Zustand state, no `persist` middleware, no `AsyncStorage`.
- **Future direction**: once a login/auth system exists, `favoriteIds` moves from client-only Zustand state to server-backed, scoped per user. This spec's contract (`toggleFavorite`, `isFavorite`) can stay the same at the call-site level — only the internals change from reading a mock to calling an authenticated endpoint.

## Out of Scope

- A dedicated Favorites tab/screen — explicitly not in the current design (see `PROJECT.md`'s decision log: "Favorites has no route of its own").
- Favoriting from contexts other than the restaurant detail screen (e.g. a heart icon directly on Home cards) — not shown in the current design's Home frame.
- Any social/sharing feature around favorites (e.g. sharing a favorites list).
- Sorting, filtering, or organizing favorites (e.g. into custom lists/collections).
- The rest of the Profile screen (avatar, stats, account menu) — owned by `profile.md`.

## Assumptions and Dependencies

- Depends on `app/(tabs)/profile.tsx` (implemented) and `restaurant.md`'s User Story 7 for the UI trigger that writes to the store this spec defines.
- In-memory, non-persisted favorited state is acceptable for this prototype phase. Persistence is deferred to a future login/account system.

## Notes for the AI Agent

- `src/stores/favorites.ts` already exists — don't recreate it. The like icon (`restaurant.md`'s US7) is implemented. This spec's remaining job is the favorites rail on Profile (User Story 2).
- Do NOT add `persist` middleware or `AsyncStorage` — plain in-memory Zustand state only (FR-007).
- Verification: `npx tsc --noEmit` clean + bundle smoke test on `/profile` and `/restaurant/[id]`.

## Changelog

| Date | Change |
|------|--------|
| 2026-07-23 | Spec created. |
| 2026-07-23 | Resolved persistence `[NEEDS CLARIFICATION]`: none needed at this stage, in-memory only. Empty-state copy (FR-006) still open. |
| 2026-07-24 | `src/stores/favorites.ts` built in `profile.md`'s round, ahead of this spec — matches this spec's contract exactly, no drift. This spec's own User Stories (like icon, favorites rail) still not implemented. |
| 2026-08-17 | Design pass for US2 (favorites rail): resolved FR-006's empty-state `[NEEDS CLARIFICATION]` with a minimal default. Corrected the data-fetching note: the mock layer moved to `src/mocks/repository.ts` — `useFavoriteRestaurantsQuery.ts` calls `getNearbyPlaces()`. Confirmed `restaurant.md`'s US7 (the like icon) already shipped. |
| 2026-08-18 | Rewritten for tone — narrative/historical framing removed from body sections, consolidated into this Changelog. Status line and User Story headers corrected to reflect actual implementation state. |
