# Feature Specification: Search (restaurant discovery)

**Feature**: `search` — folder `src/features/search/`
**Created**: 2026-07-23 *(retroactive — spec written after the Home implementation, as a validation of `TEMPLATE.md`)*
**Status**: In Progress — User Story 1 (Home) Implemented, User Story 2 (Search & Map) not started
**Design reference**: `App Flow.dc.html`, frame "1 · Home" (implemented) and frame "3 · Search & Map" (pending)

## Summary

Entry point for restaurant discovery: browsing by category (cuisine, occasion, ambient) on the Home screen, and search with a map on a second screen. Not free-text search at this stage — it's guided discovery by filter.

## User Stories

### User Story 1 - Discover restaurants by category on Home (Priority: P1) — **Implemented**

The user opens the app and sees the Home screen with restaurants grouped by cuisine, occasion, and ambient, able to switch the active category on each rail to see other restaurants, and tap a restaurant to see its detail.

**Why this priority**: it's the app's first screen — without it there's no navigable product to show business partners.

**Independent test**: open `/` (Home tab), tap a cuisine chip other than the default, confirm the restaurant rail below changes; tap a card, confirm navigation to `/restaurant/[id]`.

**Acceptance scenarios**:

1. **Given** the Home screen loaded, **when** the screen opens, **then** the "Choose your Cuisine" rail shows restaurants from the first cuisine category by default.
2. **Given** the cuisine rail showing the "Churrasco" category, **when** the user taps the "Italiana" chip, **then** the rail updates to show restaurants with `cuisine: "italiana"`.
3. **Given** any restaurant rail, **when** the user taps a card, **then** the app navigates to `/restaurant/[id]` with that restaurant's `id`.
4. **Given** the user taps the menu icon (≡), the location, or a "Dine-in/Bars/Takeout" item, **when** the tap happens, **then** a bottom sheet opens with a simulated message (no real action yet).

---

### User Story 2 - Search and see restaurants on a map (Priority: P2) — **Not Started**

The user searches by text/location and sees results both on a map (pins) and in a draggable list, able to tap a restaurant from either the map or the list to see its detail.

**Why this priority**: complements Home's category-based discovery with active search + geographic context — important, but Home alone already delivers a navigable MVP.

**Status**: awaiting its own spec (this story has no Acceptance Scenarios or detailed Functional Requirements yet — it'll be filled in when we get to this module. Will require a decision on Expo Go vs dev build, see `PROJECT.md` → Architectural Decisions.)

---

### Edge Cases

- **Empty filtered list** (a category with no matching restaurant in the mock): falls back to the first 3 restaurants in the overall list, so a rail is never empty. *(Implemented in `useHomeDiscovery.ts`.)*
- **Before the mock "resolves"** (first render before `useQuery` populates `data`): rails render empty momentarily — imperceptible in practice because the mock resolves synchronously, but the behavior exists and will matter once it's a real API with real latency.
- **`restaurants[0]` missing** (empty restaurant list): `FeaturedBanner` doesn't render (guard already implemented in the Home component).

## Functional Requirements

- **FR-001**: The system MUST display restaurants grouped into horizontal rails by cuisine, occasion, and ambient.
- **FR-002**: The user MUST be able to switch the active cuisine, occasion, and ambient category independently of one another.
- **FR-003**: The system MUST visually highlight which category is active in each selector (different color/border from the inactive state).
- **FR-004**: The system MUST display a featured restaurant ("featured this week") above the category rails.
- **FR-005**: The user MUST be able to tap any restaurant card and navigate to that restaurant's detail.
- **FR-006**: The system MUST display a static "Best Deliveries & Takeaways" rail with all restaurants, with no category filter.
- **FR-007**: The system MUST display the user's location (area + address) at the top of Home. *(Static mock at this stage — see Assumptions.)*
- **FR-008**: The system MUST display 3 quick-navigation shortcuts (Dine-in, Bars, Takeout); tapping any of them shows simulated feedback, with no real navigation.
- **FR-009**: The system MUST display a static grid of 4 institutional benefits (text only, no interaction).
- **FR-010**: The system MUST allow searching restaurants by text and viewing results on a map with a draggable list **[NEEDS CLARIFICATION: this story (US2) has no detailed requirement yet — free text? voice search? which filters combine with the map?]**

### Key Entities

- **Restaurant**: a listable restaurant — name, photo, rating, price range, and the 3 classification categories (cuisine/occasion/ambient) used for this feature's filters. Full shape in `src/types/restaurant.ts` (shared with the `restaurant` feature).
- **Cuisine / Occasion / Ambient**: category taxonomies — id, label, and a visual attribute (photo for cuisine, initial for occasion). Specific to this feature, not shared.

## Success Criteria

- **SC-001**: The user can see at least 3 filterable restaurant sections without scrolling more than one screen's height.
- **SC-002**: Switching the active category (cuisine/occasion/ambient) updates the displayed rail with no perceptible loading state.
- **SC-003**: From the moment Home opens to reaching a restaurant's detail screen, the user needs at most 1 tap.

## Architecture Mapping

- **Feature folder**: `src/features/search/{api,components,hooks,types}` — `stores/` exists as a placeholder but wasn't used (Home's state is local via `useState`, doesn't need to be Zustand or global).
- **Reuses from `src/components/ui/`**: `RestaurantCard`, `HorizontalRail`, `Chip` (used by `AmbientSelector`), `RatingBadge`, `BottomSheet`.
- **Reuses from `src/components/layout/`**: `SearchBar` (decorative), `SideMenu`.
- **Global state?** No, for this story. The user's location (`USER_LOCATION`) is hardcoded inside `LocationHeader.tsx` — once it becomes truly dynamic (real geolocation), it migrates to `src/stores/location.ts` (already planned in `PROJECT.md`, not implemented yet).
- **Types**: `Restaurant` shared (`src/types/restaurant.ts`); `Cuisine`/`Occasion`/`Ambient`/`Benefit` specific (`src/features/search/types/`).
- **Mocks**: `src/mocks/restaurants.ts`, `src/mocks/discoveryTaxonomies.ts` — fixture data, served over HTTP via `src/mocks/handlers/restaurants.ts` and `discoveryTaxonomies.ts` (MSW), not imported directly by hooks anymore (see `PROJECT.md` principle #4, updated when MSW/testing infra was added). `useRestaurantsQuery`/`useDiscoveryTaxonomiesQuery` call `apiClient.get(...)` and validate the response against the Zod schemas in `src/types/` / `features/search/types/`.
- **New dependencies**: `zod` and `msw` (added when the MSW/testing infrastructure round touched every existing `api/` hook, not specific to this feature — see `PROJECT.md`). US2 (Search & Map) already has `react-native-maps` installed ahead of time (decision recorded in `PROJECT.md`), but no map code has been written yet.

## Out of Scope

- Real text search (SearchBar is decorative).
- Real side menu content (SideMenu opens a sheet with a fixed message).
- The Search & Map screen (US2 above — becomes its own spec when it's its turn).
- Favorite state on Home cards (the Home design has no favorite icon on cards — that only appears on detail and profile).
- Real geolocation.

## Assumptions and Dependencies

- User location is a static mock (`"Sheetal Park"`) — doesn't reflect the device's real geolocation.
- Photos come from remote Unsplash URLs, no local asset bundling.
- Home icons use emoji, not `react-native-svg` (not installed) nor `@expo/vector-icons` — see the technical note in the project's memory.
- Depends on `app/restaurant/[id]` existing as a route (it does, still a placeholder — its own spec belongs to the `restaurant` feature).

## Notes for the AI Agent

- User Story 2 (Search & Map) requires a plan-mode decision before coding — it touches a native library (`react-native-maps`), and the Expo Go vs dev build trade-off needs to be confirmed with the user before the first line of code.
- Before creating a new component for US2: check whether `RestaurantCard`/`BottomSheet`/`HorizontalRail` already cover what's needed (the map's draggable list looks reusable).
- Verification: `npx tsc --noEmit` clean + bundle smoke test (route `/`, and later `/explore` once US2 exists).

## Changelog

| Date | Change |
|------|--------|
| 2026-07-23 | Spec created retroactively, documenting User Story 1 (Home) already implemented. User Story 2 (Search & Map) recorded as pending, with no detail yet. |
| 2026-07-23 | Architecture Mapping updated: `useRestaurantsQuery`/`useDiscoveryTaxonomiesQuery` migrated from direct mock import to `apiClient` + MSW (see `PROJECT.md`'s MSW/testing infrastructure entry). No behavior or requirement changed, only how the data gets from the mock file into the hook. |
