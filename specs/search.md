# Feature Specification: Search (restaurant discovery)

**Feature**: `search` — folder `src/features/search/`
**Created**: 2026-07-23 *(retroactive — spec written after the Home implementation, as a validation of `TEMPLATE.md`)*
**Status**: In Progress — User Story 1 (Home) Implemented, User Stories 2-3 not started
**Design reference**: `App Flow.dc.html`, frame "1 · Home" (implemented), frame "3 · Search & Map" (pending), frame "7 · Category page" (pending)

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
4. **Given** the user taps the location or a "Dine-in/Bars/Takeout" item, **when** the tap happens, **then** a bottom sheet opens with a simulated message (no real action yet).
5. **Given** the user taps the menu icon (≡), **when** the tap happens, **then** the real navigation sidebar opens — spec'd in `auth.md`'s User Story 3, not redefined here. *(Corrected: previously this also opened a simulated-message sheet like the other icons; the design's "12 · Sidebar Menu" frame replaces that with real navigation.)*

---

### User Story 2 - Search and see restaurants on a map (Priority: P2) — **Not Started**

The user searches by text/location and sees results both on a map (pins) and in a draggable list, able to tap a restaurant from either the map or the list to see its detail.

**Why this priority**: complements Home's category-based discovery with active search + geographic context — important, but Home alone already delivers a navigable MVP.

**Entry point confirmed**: reached by tapping "Buscar" (the bottom tab, and/or Home's decorative search bar — both target the same screen), which replaces the currently visible tab with the full Search & Map screen — a normal tab switch, not a modal/sheet. See FR-018 and the Edge Cases bottom-tab-bar note.

**Status**: awaiting its own spec (this story has no Acceptance Scenarios or detailed Functional Requirements yet — it'll be filled in when we get to this module. Will require a decision on Expo Go vs dev build, see `PROJECT.md` → Architectural Decisions.)

---

### User Story 3 - Browse a cuisine category page (Priority: P2) — **Not Started**

The user lands on a dedicated page for one cuisine category (e.g. Pizza) and sees a hero banner, the best-rated places in that category, a way to explore by sub-style, trending places, and places near them — all without leaving the category.

**Why this priority**: a richer, editorial way to browse one category in depth, complementing Home's lighter "a few cards per category" rails — but Home alone already provides a full discovery MVP without it.

**Independent test**: open a category page directly (no entry point is wired yet — see Edge Cases), confirm the hero banner, best-rated grid, subtype row, trending grid, and near-you grid all render for the active category; tap a different category tab, confirm the whole page's content switches; tap a restaurant card, confirm navigation to its detail.

**Acceptance scenarios**:

1. **Given** the category page, **when** it renders, **then** it shows a row of category tabs, with the active one visually distinguished.
2. **Given** the category tabs, **when** the user taps a different one, **then** the hero banner, best-rated grid, subtype row, trending grid, and near-you grid all update to that category.
3. **Given** the category page, **when** it renders, **then** a hero banner shows the active category's photo and label, plus a "View on map" link.
4. **Given** the category page, **when** it renders, **then** a "best rated" grid (2 columns) shows places in that category, each with photo, a rating badge overlaid on the photo, name, cuisine label + price, and an optional discount pill.
5. **Given** the category page, **when** it renders, **then** a prompt ("What's the flavour today? Explore by style") and a row of subtype icons show below the best-rated grid; tapping either opens a placeholder sheet (subtype filtering isn't real yet).
6. **Given** the category page, **when** it renders, **then** a "trending" grid and a "near you" grid (near-you cards additionally show distance) render below, same card shape as the best-rated grid.
7. **Given** any restaurant card on the page, **when** tapped, **then** the app navigates to that restaurant's detail screen — **for cards backed by a real restaurant record only, see Edge Cases for the ones that aren't.**

---

### Edge Cases

- **Empty filtered list** (a category with no matching restaurant in the mock): falls back to the first 3 restaurants in the overall list, so a rail is never empty. *(Implemented in `useHomeDiscovery.ts`.)*
- **Before the mock "resolves"** (first render before `useQuery` populates `data`): rails render empty momentarily — imperceptible in practice because the mock resolves synchronously, but the behavior exists and will matter once it's a real API with real latency.
- **`restaurants[0]` missing** (empty restaurant list): `FeaturedBanner` doesn't render (guard already implemented in the Home component).
- **No entry point to the category page (US3) exists in the current design**: Home's cuisine "view all" still opens a placeholder sheet (`setHomePopup('view-all-cuisine')`), it doesn't navigate to the category page. The category page's own back control goes to Home, implying that *is* the intended entry point, but nothing currently triggers the navigation. **[NEEDS CLARIFICATION: should Home's cuisine "view all" be wired to open the matching category page once US3 is implemented? Not resolving here — this is a design-completeness gap, not an implementation detail to guess at.]**
- **Category taxonomy is incomplete relative to Home's**: the design's category data only covers 3 categories (Pizza, Churrasco, Indiana). "Pizza" isn't in the `Cuisine` taxonomy Home's `CuisineSelector` uses (5 cuisines: churrasco/mediterraneo/italiana/indiana/chinesa) — 3 of those 5 have no category page yet, and Home has a cuisine with no matching category page content. **[NEEDS CLARIFICATION: should "Pizza" be added to the base cuisine taxonomy, and should every cuisine eventually get a category page, or is category-page coverage intentionally partial?]**
- **Two of three categories' mock items have no restaurant `id`**: Pizza's and Indiana's category items are separate mock objects (`name`, `photo`, `rating`, etc.) that don't correspond to any real `Restaurant` record's `id` — tapping them can't actually navigate to a real detail screen as the design currently models it. Churrasco's category items are fine (derived from real `RESTAURANTS` entries). **[NEEDS CLARIFICATION: should every category's items become real `Restaurant` records (giving them ids), or is a separate, non-navigable "editorial" item shape intentional for category pages? Affects FR/Key Entity design, not resolving by assumption.]**
- **Bottom tab bar is confirmed real UI**: the design repeats an identical 4-item tab bar (Home, Buscar, Categorias, Perfil — no Favoritos, consistent with `favorites.md`'s "no route of its own" decision) across three frames: "1 · Home", "7 · Category page", "6 · Profile" — only the active item's styling differs between copies. The "3 · Search & Map" frame's own markup doesn't happen to include it, but the user confirmed the real behavior: tapping "Buscar" on Home replaces Home with the map, i.e. Search & Map is a normal tab destination reached through the same tab switch as Category page/Profile — **resolved**: it gets the tab bar too (with "Buscar" as the active item), same as the other three; the frame's missing copy was a design-canvas omission, not an intentional tab-chrome-free screen.

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
- **FR-011**: The system MUST display a row of category tabs; tapping one MUST switch the entire page's content to that category.
- **FR-012**: The system MUST display a hero banner (photo + label) for the active category, with a "View on map" link.
- **FR-013**: The system MUST display a "best rated" grid of category items, each with photo, an overlaid rating badge, name, cuisine label + price, and an optional discount pill.
- **FR-014**: The system MUST display a subtype-exploration prompt and a row of subtype options; tapping either opens a placeholder sheet.
- **FR-015**: The system MUST display "trending" and "near you" grids for the active category, same card shape as FR-013 (near-you additionally shows distance).
- **FR-016**: Tapping a grid card backed by a real restaurant record MUST navigate to that restaurant's detail screen **[NEEDS CLARIFICATION: see Edge Cases — what happens for the category items that currently have no real restaurant id]**.
- **FR-017**: Tapping the menu icon (≡) MUST open the real navigation sidebar (`auth.md`'s User Story 3) — corrected from the earlier placeholder behavior (see User Story 1's Changelog-noted correction above).
- **FR-018 — Implemented**: On Home, Search & Map, Category page, and Profile, the system MUST display a bottom tab bar with 4 items — Home, Buscar, Categorias, Perfil — each navigating to its respective tab and visually highlighting whichever is active. Structural, cross-feature UI; owned/recorded in `PROJECT.md`'s Folder Structure and ADR log (same cross-reference treatment already used for `SideMenu` pointing at `auth.md`), not redefined per-feature here.

### Key Entities

- **Restaurant**: a listable restaurant — name, photo, rating, price range, and the 3 classification categories (cuisine/occasion/ambient) used for this feature's filters. Full shape in `src/types/restaurant.ts` (shared with the `restaurant` feature).
- **Cuisine / Occasion / Ambient**: category taxonomies — id, label, and a visual attribute (photo for cuisine, initial for occasion). Specific to this feature, not shared.
- **Category**: a browsable category page's content — id, label, hero photo, a list of subtypes (initial + label), and three item lists (champions/"best rated", trending, near-you). Whether its items are full `Restaurant` records or a separate shape is an open question — see Edge Cases.
- **CategorySubtype**: initial (icon letter) + label, e.g. "R" / "Rodízio" under the Churrasco category. Not navigable yet (opens a placeholder sheet).

## Success Criteria

- **SC-001**: The user can see at least 3 filterable restaurant sections without scrolling more than one screen's height.
- **SC-002**: Switching the active category (cuisine/occasion/ambient) updates the displayed rail with no perceptible loading state.
- **SC-003**: From the moment Home opens to reaching a restaurant's detail screen, the user needs at most 1 tap.
- **SC-004**: Switching the active category tab on the category page (US3) updates all four of its sections (hero, best-rated, trending, near-you) with no perceptible loading state — same standard as SC-002.

## Architecture Mapping

- **Feature folder**: `src/features/search/{api,components,hooks,types}` — `stores/` exists as a placeholder but wasn't used (Home's state is local via `useState`, doesn't need to be Zustand or global).
- **Reuses from `src/components/ui/`**: `RestaurantCard`, `HorizontalRail`, `Chip` (used by `AmbientSelector`), `RatingBadge`, `BottomSheet`.
- **Reuses from `src/components/layout/`**: `SearchBar` (decorative), `SideMenu` — **its real content is now spec'd in `auth.md`'s User Story 3** (navigation drawer with a login-aware header/footer), superseding the placeholder sheet built during the Home round. `search.md` doesn't own or redefine that behavior, just reuses the component.
- **Global state?** No, for this story. The user's location (`USER_LOCATION`) is hardcoded inside `LocationHeader.tsx` — once it becomes truly dynamic (real geolocation), it migrates to `src/stores/location.ts` (already planned in `PROJECT.md`, not implemented yet).
- **Types**: `Restaurant` shared (`src/types/restaurant.ts`); `Cuisine`/`Occasion`/`Ambient`/`Benefit` specific (`src/features/search/types/`).
- **Mocks**: `src/mocks/restaurants.ts`, `src/mocks/discoveryTaxonomies.ts` — fixture data, served over HTTP via `src/mocks/handlers/restaurants.ts` and `discoveryTaxonomies.ts` (MSW), not imported directly by hooks anymore (see `PROJECT.md` principle #4, updated when MSW/testing infra was added). `useRestaurantsQuery`/`useDiscoveryTaxonomiesQuery` call `apiClient.get(...)` and validate the response against the Zod schemas in `src/types/` / `features/search/types/`.
- **New dependencies**: `zod` and `msw` (added when the MSW/testing infrastructure round touched every existing `api/` hook, not specific to this feature — see `PROJECT.md`). US2 (Search & Map) already has `react-native-maps` installed ahead of time (decision recorded in `PROJECT.md`), but no map code has been written yet. US3 (category page) needs none.
- **New shared `src/components/ui/` component likely needed for US3**: the category page's grid cards (rating badge overlaid on the photo, optional discount pill, grid layout) are visually distinct from the existing `RestaurantCard` (rail-context card with rating below the photo, no overlay, no discount concept). Proposing a new component (e.g. `DiscoveryCard`) rather than overloading `RestaurantCard` with a rarely-used display mode — confirm at implementation time once the shape is fully settled (depends on how the Edge Cases' `[NEEDS CLARIFICATION]` about item data shape resolves).
- **Route for US3**: a fixed tab route, `app/(tabs)/category.tsx`, no dynamic segment — **corrected**: previously guessed as `app/category/[id].tsx` matching `app/restaurant/[id].tsx`'s pattern, but the design's new bottom tab bar (see Edge Cases and `PROJECT.md`'s ADR log) links straight to the category page with no id. Switching category (Pizza/Churrasco/Indiana) happens *inside* the page via its own in-page tabs, already covered by FR-011/US3 scenario 2 — that's state, not routing.
- **Mocks for US3**: new `src/mocks/categories.ts`.

## Out of Scope

- Real text search (SearchBar is decorative).
- ~~Real side menu content~~ — **corrected**: the side menu now has real content, spec'd in `auth.md`. What's still out of scope here: the location and Dine-in/Bars/Takeout popups, which remain simulated-message sheets.
- The Search & Map screen (US2 above — becomes its own spec when it's its turn).
- Favorite state on Home cards (the Home design has no favorite icon on cards — that only appears on detail and profile).
- Real geolocation.
- Real subtype filtering on the category page (US3) — subtype taps open a placeholder sheet, same treatment as "view all" elsewhere in this spec.

## Assumptions and Dependencies

- User location is a static mock (`"Sheetal Park"`) — doesn't reflect the device's real geolocation.
- Photos come from remote Unsplash URLs, no local asset bundling.
- Home icons use emoji, not `react-native-svg` (not installed) nor `@expo/vector-icons` — see the technical note in the project's memory.
- Depends on `app/restaurant/[id]` existing as a route (it does, still a placeholder — its own spec belongs to the `restaurant` feature).
- **Resolved**: the design's bottom tab bar (see Edge Cases) settles what was previously an open question here — `explore` (currently an empty placeholder) hosts US2 (Search & Map) only, renamed to the **Buscar** tab; US3 (Category page) gets its own new **Categorias** tab, not a sub-destination of `explore`. This is a naming/routing decision recorded now; the actual rename of `explore.tsx`, the new `category.tsx` route file, and the `app/(tabs)/_layout.tsx` update are implementation, deferred to whichever of US2/US3 is built first.

## Notes for the AI Agent

- User Story 2 (Search & Map) requires a plan-mode decision before coding — it touches a native library (`react-native-maps`), and the Expo Go vs dev build trade-off needs to be confirmed with the user before the first line of code.
- Before creating a new component for US2 or US3: check whether `RestaurantCard`/`BottomSheet`/`HorizontalRail` already cover what's needed (US2's map result list looks reusable; US3's grid cards likely don't fit `RestaurantCard`'s existing shape — see Architecture Mapping).
- Before starting US3, resolve its `[NEEDS CLARIFICATION]` items (entry point, taxonomy coverage, item data shape) with the user — they change what the Key Entities and FRs actually mean, not just cosmetic details.
- Verification: `npx tsc --noEmit` clean + bundle smoke test (route `/`, and later the `search` tab once US2 exists, the `category` tab once US3 exists — **corrected**: US3's route is a fixed tab, not `/category/[id]`, see Architecture Mapping).

## Changelog

| Date | Change |
|------|--------|
| 2026-07-23 | Spec created retroactively, documenting User Story 1 (Home) already implemented. User Story 2 (Search & Map) recorded as pending, with no detail yet. |
| 2026-07-23 | Architecture Mapping updated: `useRestaurantsQuery`/`useDiscoveryTaxonomiesQuery` migrated from direct mock import to `apiClient` + MSW (see `PROJECT.md`'s MSW/testing infrastructure entry). No behavior or requirement changed, only how the data gets from the mock file into the hook. |
| 2026-07-23 | Design updated — added User Story 3 (category page, frame "7 · Category page"), not started. Flagged three real design gaps as `[NEEDS CLARIFICATION]` rather than assumed: no wired entry point to the category page yet, category taxonomy doesn't cover all of Home's cuisines, and two of three categories' mock items lack real restaurant ids. |
| 2026-07-23 | Design added a real bottom tab bar (Home/Buscar/Categorias/Perfil) across Home, Category page, and Profile. Resolved US3's route (fixed tab route, not a dynamic id route) and the previously-open `explore`-tab assignment question (`explore` → Buscar/US2 only, Categorias is a new, separate tab for US3). New FR-018. Flagged one new gap: Search & Map's frame doesn't include the tab bar, unlike the other three. No code changed — `app/(tabs)/_layout.tsx` still has its original 3 stock tabs. |
| 2026-07-23 | Corrected User Story 1: the menu icon (≡) now opens the real navigation sidebar (`auth.md`'s User Story 3), not a simulated-message sheet — the design added frame "12 · Sidebar Menu". Location and Dine-in/Bars/Takeout taps are unaffected, still simulated. |
| 2026-07-23 | Resolved the previous round's `[NEEDS CLARIFICATION]` about the tab bar's absence on Search & Map: user confirmed tapping "Buscar" replaces Home with the map as a normal tab switch, so Search & Map gets the tab bar too — the frame's missing copy in the design canvas was an omission, not deliberate. FR-018 and User Story 2 updated accordingly. |
| 2026-07-23 | FR-018 implemented on `feat/bottom-tab-bar`: `app/(tabs)/_layout.tsx` now has the real 4 tabs (`index`/`search`/`category`/`profile`), styled with the design's exact `ink`/`muted` active/inactive colors, icons following the project's existing emoji convention. `search.tsx` (renamed from `explore.tsx`) and the new `category.tsx` remain trivial placeholders — US2/US3 content is separate, unstarted work. |
