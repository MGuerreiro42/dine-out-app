# Feature Specification: Favorites

**Feature**: `favorites` — folder `src/features/favorites/`
**Created**: 2026-07-23
**Status**: In Progress — User Stories 1 and 2 Implemented (`stores/favorites.ts`, the like icon per `restaurant.md` US7, the Profile favorites rail); User Story 3 (server-backed persistence) implemented and verified against the real `dine-out-backend`
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
4. **Given** the app is closed and reopened, **when** it restarts while logged out, **then** there is no favorited state to restore — guests cannot favorite at all (FR-011), so the question is moot rather than a restore that happens to yield empty. **Given** the same restart while logged in, **then** favorited state DOES survive, sourced from `GET /favorites` (User Story 3), not from any local cache.

---

### User Story 2 - Browse my favorites from Profile (Priority: P2) — Designed, not implemented

A user checks the Profile screen and sees the restaurants they've favorited, as a horizontal rail of cards, and can tap into any of them to revisit the detail screen.

**Why this priority**: the actual payoff of favoriting something is being able to find it again — but the store itself (User Story 1) has to exist first for this to have anything to show.

**Independent test**: with at least one restaurant favorited, open Profile, confirm the favorites rail shows that restaurant as a card (photo, name, rating, tags); tap it, confirm navigation to `/restaurant/[id]` for that restaurant.

**Acceptance scenarios**:

1. **Given** one or more restaurants are favorited, **when** the Profile screen renders, **then** the favorites rail shows a card per favorited restaurant.
2. **Given** the favorites rail, **when** the user taps a card, **then** the app navigates to that restaurant's detail screen.
3. **Given** zero restaurants are favorited, **when** the Profile screen renders, **then** the favorites rail area shows an explicit empty state: a muted outline heart icon (`Ionicons` `heart-outline`), "You don't have any favorites yet," a subtitle "Tap the heart icon on a restaurant to save it here," and an "Explore restaurants" link to Home.

---

### User Story 3 - Favorites persist server-side, per account (Priority: P1) — Designed, not implemented

Once a user is logged in, favoriting a restaurant is saved to their account on the backend, not just held in local memory — it survives app restarts and, if they log in on a second device, shows up there too.

**Why this priority**: this is the actual product capability real accounts are for — without it, "favorites" is indistinguishable from the current in-memory prototype.

**Independent test**: log in, favorite a restaurant, force-quit and reopen the app, log in again if the session didn't survive (`auth.md` US5) — confirm the restaurant is still favorited, sourced from the backend, not from anything cached client-side.

**Acceptance scenarios**:

1. **Given** a logged-in session starts (login success or cold-start hydration), **when** the session becomes active, **then** the app calls `GET /favorites` and populates `favoriteIds` from the response (FR-008).
2. **Given** a logged-in user taps the like icon, **when** the tap registers, **then** the local state updates optimistically and `PUT /favorites/:id` (add) or `DELETE /favorites/:id` (remove) fires (FR-009); a failed request rolls the local state back.
3. **Given** a logged-in user logs out, **when** the session clears, **then** `favoriteIds` resets to empty (FR-010).
4. **Given** a logged-out user, **when** they tap the like icon, **then** `toggleFavorite` shows an `Alert` prompting them to log in or sign up and returns without touching `favoriteIds` or calling any endpoint (FR-011).

---

### Edge Cases

- **A favorited restaurant's id no longer resolves** in the current result set: the favorites rail filters the id out silently rather than crashing or showing a broken entry.
- **Toggling the same restaurant rapidly** (double-tap the like icon): the local (optimistic) state's final value matches the actual number of taps (odd = favorited, even = not), not the number of renders. The corresponding `PUT`/`DELETE` calls fire in tap order but may resolve out of order; both endpoints are idempotent (`ARCHITECTURE.md` §6), so the server converges to the same end state as long as the last-sent request reflects the last tap.
- **A `toggleFavorite` call while logged out**: resolved (FR-011) — the store checks `isLoggedIn` itself before doing anything else, so every existing call site (`RestaurantCard`, `HomeRestaurantCard`, `MapResultCard`, `DetailHeaderActions`) is guarded without needing its own change.
- **`GET /favorites` fails** (network error, backend down) after login: `favoriteIds` stays empty; no retry loop beyond TanStack Query's default `retry: 1`.

## Functional Requirements

- **FR-001**: The system MUST maintain a single, shared record of which restaurant ids are currently favorited, readable and writable from any feature.
- **FR-002**: The system MUST provide a way to toggle a given restaurant id's favorited state.
- **FR-003**: The system MUST provide a way to check whether a given restaurant id is currently favorited.
- **FR-004**: The system MUST display, inside the Profile screen, a horizontal rail of the currently favorited restaurants as cards.
- **FR-005**: The user MUST be able to tap a favorited-restaurant card and navigate to its detail screen.
- **FR-006**: The system MUST show an explicit empty state in the favorites rail area when no restaurants are favorited — copy/visual defined in User Story 2's acceptance scenario 3.
- **FR-007**: Favorited state MUST persist server-side, per authenticated user (FR-008/FR-009), surviving app restart. No client-side persistence (`AsyncStorage`, Zustand `persist`) is used — the server is the source of truth, re-fetched via FR-008 on every session start. A logged-out session has no persisted favorites (see FR-011).
- **FR-008** — Designed, not implemented: the system MUST fetch the authenticated user's favorited restaurant ids from `GET /favorites` when a session becomes active (login success or `auth.md`'s cold-start hydration) and MUST populate `favoriteIds` from the response.
- **FR-009** — Designed, not implemented: `toggleFavorite(id)` MUST, when authenticated, call `PUT /favorites/:id` (add) or `DELETE /favorites/:id` (remove), updating local state optimistically before the request resolves, and MUST roll the local state back if the request fails.
- **FR-010** — Designed, not implemented: `favoriteIds` MUST reset to empty on logout.
- **FR-011** — Resolved, not implemented: `toggleFavorite(id)` MUST, when `useAuthStore.getState().isLoggedIn` is false, show an `Alert` prompting the user to log in or sign up (with a "Log in" action routing to `/login`) and MUST NOT change `favoriteIds` or call any endpoint. Guest favoriting is removed as a capability — there is no local guest-side favorite state to migrate on login.

### Key Entities

- **FavoriteId**: not a distinct domain entity — just a `Restaurant.id` reference held in the favorites store. There is no separate "Favorite" record with its own fields (no favorited-at timestamp, no notes, etc.) at this stage.

## Success Criteria

- **SC-001**: Favoriting a restaurant on the detail screen and checking Profile reflects the change with no manual refresh and no perceptible delay.
- **SC-002**: The favorited count shown anywhere in the app (e.g. a future profile stat) always matches the actual number of favorited restaurant ids in the store — never drifts out of sync.
- **SC-003**: A user can go from "see a restaurant I like" to "find it again later in Profile" in exactly 2 taps total (1 to favorite, 1 to open Profile — reaching the rail itself requires no extra taps once Profile is open).

## Architecture Mapping

- **Feature folder**: `src/features/favorites/{api,components,types}`. The scaffolded `stores/` placeholder stays empty — the actual state lives in `src/stores/favorites.ts` (global), read and written by `restaurant` too. `favorites` owns the contract for that global store, not the folder it lives in. New file `features/favorites/api/useFavoriteIdsQuery.ts` (barrel export via the existing `api/index.ts`).
- **`src/stores/favorites.ts`** (global, Zustand), contract owned by this spec:
  ```ts
  type FavoritesStore = {
    favoriteIds: Set<number>;
    setFavoriteIds: (ids: number[]) => void;
    toggleFavorite: (id: number) => void;
    isFavorite: (id: number) => boolean;
  };
  ```
  `toggleFavorite`/`isFavorite` keep their exact signatures (FR-002/FR-003) — every existing call site (`RestaurantCard.tsx`, `HomeRestaurantCard.tsx`, `MapResultCard.tsx`, `DetailHeaderActions.tsx`, `useFavoriteRestaurantsQuery.ts`) needs no change; the guest-prompt logic (FR-011) lives entirely inside `toggleFavorite`. `setFavoriteIds` is new, internal-facing: called by `useFavoriteIdsQuery` on fetch and by `src/stores/auth.ts`'s `logout()`/failed-refresh path (`setFavoriteIds([])`) — this store imports `src/stores/auth.ts` (to read `isLoggedIn` inside `toggleFavorite`), `expo-router`'s imperative `router` (to navigate on the prompt's "Log in" action — usable outside components, no hook needed), `react-native`'s `Alert`, and `src/mocks/repository.ts` (`addFavorite`/`removeFavorite`); all non-feature modules, so the "features never import each other" rule is unaffected.
  `toggleFavorite`'s body: if `useAuthStore.getState().isLoggedIn` is false, call `Alert.alert('Log in to save favorites', 'Create an account or log in to save restaurants for later.', [{ text: 'Cancel', style: 'cancel' }, { text: 'Log in', onPress: () => router.push('/login') }])` and return — no state change, no request (FR-011). If true, flip `favoriteIds` optimistically, then call `addFavorite(id)`/`removeFavorite(id)`, rolling back the flip on rejection (FR-009).
- **`features/favorites/api/useFavoriteIdsQuery.ts`**: `useQuery({ queryKey: ['favorite-ids'], queryFn: getFavoriteIds, enabled: useAuthStore((s) => s.isLoggedIn) })`. TanStack Query v5 has no `onSuccess` callback on `useQuery` — the hook syncs `query.data` into `useFavoritesStore.getState().setFavoriteIds()` via a `useEffect` keyed on `query.data`. Mounted once, unconditionally, from `app/_layout.tsx` (alongside `auth.md`'s `bootstrap()` call) so favorited state is available app-wide, not only while Profile is open.
- **Reuses from `src/components/ui/`**: `RestaurantCard`, `HorizontalRail`.
- **Fetching favorited restaurants' full data**: unchanged — `features/favorites/api/useFavoriteRestaurantsQuery.ts` still calls `getNearbyPlaces()` and filters by `favoriteIds`, which now comes from the server instead of pure client state.
- **`src/mocks/repository.ts`** gains `getFavoriteIds(): Promise<number[]>` (`apiGet('/favorites')`), `addFavorite(id): Promise<void>` (`apiPut('/favorites/' + id)`), `removeFavorite(id): Promise<void>` (`apiDelete('/favorites/' + id)`) — same wrapper pattern as `auth.md`'s `signup`/`login`.
- **Types**: no new type — reuses the shared `Restaurant` from `src/types/restaurant.ts`.
- **New dependencies**: none for this spec — `expo-secure-store` (auth.md's dependency) is what makes the Bearer token available, not something `favorites.md` adds itself.
- **Future direction** (now current, per User Story 3): `favoriteIds` moves from client-only Zustand state to server-backed, scoped per user, exactly as this section previously anticipated.

## Out of Scope

- A dedicated Favorites tab/screen — explicitly not in the current design (see `PROJECT.md`'s decision log: "Favorites has no route of its own").
- Favoriting from contexts other than the restaurant detail screen (e.g. a heart icon directly on Home cards) — not shown in the current design's Home frame.
- Any social/sharing feature around favorites (e.g. sharing a favorites list).
- Sorting, filtering, or organizing favorites (e.g. into custom lists/collections).
- The rest of the Profile screen (avatar, stats, account menu) — owned by `profile.md`.
- Migrating a guest's locally-favorited restaurants to their account on login — moot: guests cannot favorite at all (FR-011), so there is nothing to migrate.

## Assumptions and Dependencies

- Depends on `app/(tabs)/profile.tsx` (implemented) and `restaurant.md`'s User Story 7 for the UI trigger that writes to the store this spec defines.
- Depends on `auth.md`'s real-backend integration (session/`isLoggedIn`, `bootstrap()`, `apiClient.ts`'s Bearer injection) — favorites has no independent auth mechanism.
- Depends on `dine-out-backend`'s `FavoritesModule` (`GET/PUT/DELETE /favorites`) already being implemented and reachable.
- FR-011 is resolved (prompt-to-login, no guest favoriting) — no remaining blocker to implementing User Story 3 in full.

## Notes for the AI Agent

- `src/stores/favorites.ts` already exists — extend it, don't recreate it. The like icon (`restaurant.md`'s US7) is implemented. This spec's remaining jobs: the favorites rail on Profile (User Story 2) and server-backed persistence (User Story 3, partially blocked on FR-011).
- Do NOT add `persist` middleware or `AsyncStorage` to `src/stores/favorites.ts` — the server is the persistence layer (FR-007).
- Verification: `npx tsc --noEmit` clean + bundle smoke test on `/profile` and `/restaurant/[id]`.

## Changelog

| Date | Change |
|------|--------|
| 2026-07-23 | Spec created. |
| 2026-07-23 | Resolved persistence `[NEEDS CLARIFICATION]`: none needed at this stage, in-memory only. Empty-state copy (FR-006) still open. |
| 2026-07-24 | `src/stores/favorites.ts` built in `profile.md`'s round, ahead of this spec — matches this spec's contract exactly, no drift. This spec's own User Stories (like icon, favorites rail) still not implemented. |
| 2026-08-17 | Design pass for US2 (favorites rail): resolved FR-006's empty-state `[NEEDS CLARIFICATION]` with a minimal default. Corrected the data-fetching note: the mock layer moved to `src/mocks/repository.ts` — `useFavoriteRestaurantsQuery.ts` calls `getNearbyPlaces()`. Confirmed `restaurant.md`'s US7 (the like icon) already shipped. |
| 2026-08-18 | Rewritten for tone — narrative/historical framing removed from body sections, consolidated into this Changelog. Status line and User Story headers corrected to reflect actual implementation state. |
| 2026-08-29 | Server-backed persistence designed (not implemented): User Story 3 added; FR-007 rewritten (server is the persistence layer, replacing "in-memory only, no persistence"); FR-008–FR-010 specify `GET /favorites` hydration, optimistic `PUT`/`DELETE` on toggle with rollback, and clearing on logout. `stores/favorites.ts` gains `setFavoriteIds`; `toggleFavorite`/`isFavorite` keep their existing signatures. FR-011 (guest-favoriting behavior once a Bearer token is required) marked `[NEEDS CLARIFICATION]` — blocks full User Story 3 implementation. |
| 2026-08-29 | `[NEEDS CLARIFICATION]` resolved: FR-011 — guest favoriting is removed as a capability; `toggleFavorite` shows a login-prompt `Alert` when logged out instead of touching state, so no call site needs to change and nothing migrates on login. Ready for implementation. |
| 2026-08-29 | FR-007–FR-011 implemented and verified end-to-end against the real `dine-out-backend`. `stores/favorites.ts` rewritten to the exact spec'd `FavoritesStore` shape (`setFavoriteIds`, auth-gated `toggleFavorite` with the specified `Alert`, optimistic `PUT`/`DELETE` with rollback on rejection); new `features/favorites/api/useFavoriteIdsQuery.ts`, mounted app-wide from `app/_layout.tsx`. `FavoritesRail.tsx` (User Story 2) turned out to already be fully implemented against `useFavoriteRestaurantsQuery`/`useFavoriteIdsQuery`'s output prior to this pass, despite the Status line — confirmed working in the E2E run (see `auth.md`'s 2026-08-29 entry), status line corrected. Noted, not fixed (out of scope for this pass): `useFavoriteRestaurantsQuery`'s cache key (`['favorite-restaurants-source']`) omits location/radius, so the rail can show a stale (possibly empty) list if the user expands the search radius after Profile's first render in the session — pre-existing, unrelated to server-backed persistence. Verified: `npx tsc --noEmit`/`npx jest`/`npx biome lint .` clean; real backend + `expo start --web` + Playwright — favorited a restaurant while logged in, confirmed `PUT /favorites/:id` fired and an independent `curl` login shows the id in `GET /favorites`; logged out, confirmed the heart icon reverted, tapping it again while logged out fired no network call, and a token-less `GET /favorites` 401s. |
