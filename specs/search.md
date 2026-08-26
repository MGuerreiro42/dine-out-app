# Feature Specification: Search (restaurant discovery)

**Feature**: `search` — folder `src/features/search/`
**Created**: 2026-07-23
**Status**: In Progress — User Stories 1, 2, 3, 5, 6 Implemented against real `dine-out-backend-overture` data; User Story 4 (geolocation) and Features filter drill-down (FR-016, FR-017, FR-019) designed, not started; Price filter (FR-020) removed 2026-08-26, not just deferred — no price data exists in the real backend
**Design reference**: `App Flow.dc.html` — frames "1 · Home", "3 · Categories Overview", "4 · Category page", "4b · Occasion page". Frame "2 · Search & Map" is stale — the shipped screen has no map.

## Summary

Entry point for restaurant discovery: category rails on Home (cuisine, occasion, ambient), a dimension-agnostic detail page per category/occasion, and a filterable, sortable results list. No map.

## User Stories

### User Story 1 - Discover restaurants by category on Home (Priority: P1) — Implemented

The user opens the app, sees Home with restaurants grouped into cuisine/occasion/ambient rails, switches the active category per rail, and taps a restaurant to see its detail.

**Independent test**: open `/` (Home tab), tap a cuisine chip other than the default, confirm the rail changes; tap a card, confirm navigation to `/restaurant/[id]`.

**Acceptance scenarios**:

1. **Given** Home loads, **when** the screen opens, **then** the cuisine rail shows restaurants from the first cuisine by default.
2. **Given** a cuisine rail on one cuisine, **when** the user taps another cuisine's chip, **then** the rail updates to that cuisine's restaurants.
3. **Given** any rail, **when** the user taps a card, **then** the app navigates to `/restaurant/[id]`.
4. **Given** any rail, **when** the user taps its trailing "View more" tile, **then** the app navigates to `/type/{dimension}/{activeId}`.
5. **Given** a rail's section header, **when** the user taps "View all {dimension}", **then** the app navigates to `/type-overview/{dimension}`.
6. **Given** the "Best Deliveries & Takeaways" section, **when** it renders, **then** it shows only restaurants with `hasDelivery: true`; its "View all"/"View more" navigates to `/search?delivery=1`.
7. **Given** Home's search bar, **when** tapped, **then** the app navigates to `/search`.
8. **Given** the user taps the location header, **when** the tap happens, **then** a bottom sheet opens with placeholder content.
9. **Given** the user taps the menu icon (≡), **when** the tap happens, **then** the navigation sidebar opens (`auth.md` User Story 3).

---

### User Story 2 - Search and filter a restaurant list (Priority: P2) — Implemented

The user sees a filterable, sortable list of restaurants, optionally seeded by an incoming taxonomy/delivery filter, and taps a card to see its detail.

**Entry points**: bottom tab, Home's search bar, any rail/section's "View all"/"View more" link.

**Independent test**: open Search from any tab — confirm a result count and Sort control render, a Filters chip below, a scrollable list of restaurant cards; type in the search bar, confirm the list narrows (debounced); open Sort, pick an option, confirm list order changes; tap a card, confirm navigation to `/restaurant/[id]`.

**Acceptance scenarios**:

1. **Given** the Search screen, **when** it renders, **then** a debounced search bar filters the list by name or cuisine as the user types.
2. **Given** the Search screen, **when** it renders, **then** a result count and a Sort control show; Sort options are Top Rated, Trending, Price: Low to High, Price: High to Low.
3. **Given** the Search screen, **when** it renders, **then** a Filters chip opens a menu listing Cuisine, Ambient, Occasion, Features, Price, Delivery. Cuisine/Occasion/Ambient/Delivery filter the list when set via an incoming route param, shown as a dismissible chip. Tapping any of the six entries directly in the menu shows a placeholder response — none is settable from the menu itself.
4. **Given** any list card, **when** tapped, **then** the app navigates to that restaurant's detail screen; its heart icon toggles favorite; its share icon shows a placeholder response.

---

### User Story 3 - Browse a category or occasion detail page (Priority: P2) — Implemented

The user lands on a dedicated page for one cuisine, occasion, or ambient value and sees a hero or champion card, the best-rated places for that value, a refine or subtype row, a trending grid, and a near-you grid.

**Independent test**: from Home, tap a rail's "View more" — confirm the detail page renders a hero/champion card, best-rated grid, refine or subtype row, trending grid, and near-you grid for the active value; tap a restaurant card, confirm navigation to its detail.

**Acceptance scenarios**:

1. **Given** the detail page (`/type/{dimension}/{id}`), **when** it renders, **then** a back button and search bar show in the header. Switching value happens from Home's rail or the overview grid, not from an in-page tab.
2. **Given** a cuisine page, **when** it renders, **then** a hero banner shows the cuisine's photo and label. Occasion and ambient pages show a Champion card (the top-rated restaurant for that value) instead — those taxonomies have no `photo` field.
3. **Given** the detail page, **when** it renders, **then** a best-rated grid (top 4 by rating) shows, each card with photo, an overlaid rating badge, name, cuisine label and price, and an optional discount pill.
4. **Given** a cuisine page, **when** it renders, **then** a subtype row shows below the best-rated grid; tapping an entry opens a placeholder sheet. Occasion and ambient pages show two refine rows instead, each with its own filtered grid.
5. **Given** the detail page, **when** it renders, **then** a trending grid and a near-you grid render below, same card shape as the best-rated grid; near-you cards additionally show distance.
6. **Given** any section's "View all" link, **when** tapped, **then** the app navigates to `/search`, pre-filtered to that value.
7. **Given** any restaurant card on the page, **when** tapped, **then** the app navigates to that restaurant's detail screen.

---

### User Story 4 - Use my current location automatically (Priority: P3) — Designed, not started

The app detects the device's GPS location on open and uses it as the search anchor automatically. One location, always current, no address book.

**Acceptance scenarios**:

1. **Given** the app opens and location permission is granted, **when** the coordinate resolves, **then** `src/stores/location.ts` holds `{latitude, longitude}` and a reverse-geocoded label; `LocationHeader` displays that label.
2. **Given** permission is denied, times out, or errors, **when** that happens, **then** the app falls back to the existing static coordinate silently — no error dialog, no blocked screen.
3. **Given** `LocationHeader` is tapped, **when** the sheet opens, **then** it shows the resolved address or a fallback label, and, only when permission was denied, a retry button.

---

### User Story 5 - Browse all cuisine categories from an overview grid (Priority: P3) — Implemented

The user taps the Categories tab, or Home's "view all cuisines" link, and sees a 2-column grid of every cuisine; tapping one navigates to that cuisine's detail page.

**Acceptance scenarios**:

1. **Given** the Categories tab or Sidebar item, **when** tapped, **then** a 2-column grid renders, one tile per cuisine.
2. **Given** the grid, **when** the user taps a tile, **then** the app navigates to that cuisine's detail page, with a working back control.
3. **Given** Home's cuisine rail, **when** it renders, **then** it shows two links: "view all cuisines" and "view {cuisine} page".

---

### User Story 6 - Browse an occasion overview and detail page (Priority: P3) — Implemented

The user taps Home's occasion rail's "View all occasions" or "View more" and lands on an occasion overview grid or a specific occasion's detail page.

**Acceptance scenarios**:

1. **Given** Home's occasion rail, **when** the user taps "View all occasions", **then** the app navigates to `/type-overview/occasion`, a 2-column grid of all occasion entries.
2. **Given** the occasion overview grid, **when** the user taps a tile, **then** the app navigates to `/type/occasion/{id}`.
3. **Given** Home's occasion rail's active occasion, **when** the user taps "View more", **then** the app navigates directly to `/type/occasion/{activeId}`.

`/type/occasion/{id}` and `/type/cuisine/{id}` render the same component — behavior is described by User Story 3.

---

### Edge Cases

- Empty filtered rail: falls back to the first 3 restaurants overall.
- `restaurants[0]` missing: the featured banner doesn't render.
- Cuisine category tabs use the same 5-cuisine taxonomy as Home.
- Champions/trending/near-you derive from the same 30-restaurant mock; with 6 restaurants per cuisine, the same restaurant can appear in more than one grid.
- `react-native-maps` has no web renderer; `SearchMapView.web.tsx` swaps in a placeholder via Metro's platform-file resolution. Neither is rendered on the Search screen.
- Native `MapView` requires a Google Maps API key; without one, `SearchMapView.tsx` falls back to `MapPlaceholder`.

## Functional Requirements

- **FR-001**: The system MUST display restaurants grouped into horizontal rails by cuisine, occasion, and ambient.
- **FR-002**: The user MUST be able to switch the active cuisine, occasion, and ambient category independently.
- **FR-003**: The system MUST visually highlight the active category in each selector.
- **FR-004**: The system MUST display a featured restaurant above the category rails.
- **FR-005**: The user MUST be able to tap any restaurant card and navigate to its detail.
- **FR-006**: The "Best Deliveries & Takeaways" rail MUST show only restaurants with `hasDelivery: true`.
- **FR-007**: The system MUST display the user's location (area and address) at the top of Home. Static mock — see User Story 4.
- **FR-008**: `/type/{dimension}/{id}` MUST render a hero or champion card, best-rated grid, refine or subtype row, trending grid, and near-you grid for the active value, per User Story 3.
- **FR-009**: The menu icon (≡) MUST open the navigation sidebar (`auth.md` User Story 3).
- **FR-010**: On Home, Search, category/occasion detail pages, and Profile, the system MUST display a bottom tab bar with 4 items — Home, Search, Categories, Profile — highlighting the active tab.
- **FR-011**: Each Search-screen list card MUST display photo, an open-status pill, favorite and share icons, name, `rating · priceLevel`, `cuisineLabel`, and up to 2 tags; tapping it MUST navigate to its detail screen.
- **FR-012**: The Search screen's search bar MUST filter the visible list by name or cuisine label, live and debounced. Home's search bar is a tap target only and MUST navigate to `/search`.
- **FR-013**: The Search screen MUST offer a Sort control (Top Rated / Trending / Price: Low to High / Price: High to Low) that reorders the visible list.
- **FR-014**: The Search screen MUST offer a Filters chip listing Cuisine, Ambient, Occasion, Features, Price, Delivery. Cuisine/Occasion/Ambient/Delivery filter the list when set via an incoming route param, shown as a dismissible chip.
- **FR-015**: Home's rail cards MUST show a tags row.
- **FR-016** — Not started: On app open, the system MUST request foreground location permission (`expo-location`) and, if granted, resolve the device's coordinate into `src/stores/location.ts`, guarded by a timeout, falling back to the static coordinate on denial/timeout/error, never blocking any screen.
- **FR-017** — Not started: `LocationHeader` MUST display the resolved label or a fallback label; its sheet MUST offer a retry action only when permission was denied.
- **FR-019** — Not started: The Filters menu MUST let the user pick a Cuisine/Occasion/Ambient value directly, not only inherit one via route param.
- **FR-020** — Not started: Price and Features MUST become real filters — Price as a single-select from `Restaurant.priceLevel`; Features as 4 multi-select flags (vegetarian options, good for groups, family friendly, outdoor seating), matching requires all active flags.

### Key Entities

- **Restaurant**: name, photo, rating, review count, price range, coordinates, cuisine/occasion/ambient. Full shape in `src/types/restaurant.ts`.
- **Cuisine / Occasion / Ambient**: taxonomy entries — id, label, and a visual attribute (photo for cuisine only).
- **MapResultData**: a `Restaurant` extended with `cuisineLabel`, `distance`, `tagline`, `tags`, `isOpenNow`, `hasDelivery` — derived at query time by `useSearchMapDiscovery`, not stored.

## Success Criteria

- **SC-001**: The user sees at least 3 filterable restaurant sections without scrolling more than one screen's height.
- **SC-002**: Switching the active category updates the displayed rail with no perceptible loading state.
- **SC-003**: From Home to a restaurant's detail screen, the user needs at most 1 tap.
- **SC-004**: Switching the active tab on a detail page updates all its sections with no perceptible loading state.

## Architecture Mapping

- **Feature folder**: `src/features/search/{api,components,hooks,types}`. `stores/` unused — Home's state is local `useState`.
- **Reuses from `src/components/ui/`**: `RestaurantCard`, `HorizontalRail`, `Chip`, `RatingBadge`, `BottomSheet`.
- **Reuses from `src/components/layout/`**: `SearchBar` (controlled on Search, non-interactive tap target elsewhere), `SideMenu` (content owned by `auth.md`).
- **Global state, not started (US4)**: `src/stores/location.ts` (Zustand) — `{latitude, longitude, label, status: 'resolved' | 'fallback'}`. Consumers: `LocationHeader.tsx`, `SearchMapView.tsx`.
- **Types**: `Restaurant` shared (`src/types/restaurant.ts`); `Cuisine`/`Occasion`/`Ambient` feature-specific (`src/features/search/types/`).
- **Mocks**: `src/mocks/restaurants.ts` (30 places, 6 per cuisine), `src/mocks/discoveryTaxonomies.ts`. `useRestaurantsQuery` mirrors the Google Places API (New) Nearby Search / Text Search contract; `useDiscoveryTaxonomiesQuery` reads the app's own mock endpoint.
- **New dependency, not installed (US4)**: `expo-location`.
- **`TypeDetailScreen`/`useTypeDetail`** (`app/type/[dimension]/[id].tsx`) and **`TypeOverviewScreen`** (`app/type-overview/[dimension].tsx`) serve cuisine, occasion, and ambient from the same components — User Story 3.
- **`DiscoveryCard`** (`features/search/components/`): the detail page's grid card. Feature-local, not `components/ui/`.
- **Route for the Categories tab**: `app/(tabs)/category.tsx`, fixed, no dynamic segment. Per-cuisine content lives at `app/category/[cuisine].tsx`.
- **`useSearchMapDiscovery`** (`features/search/hooks/`): produces `MapResultData[]` from `useRestaurantsQuery`/`useDiscoveryTaxonomiesQuery`, derived at query time.

## Out of Scope

- Voice search, and any filter beyond name/cuisine text matching.
- Real subtype filtering on cuisine detail pages.
- A map on the Search screen.
- Full Filters menu functionality (FR-016, FR-017, FR-019, FR-020).

## Assumptions and Dependencies

- User location is a static mock, not the device's real geolocation, until User Story 4.
- Photos come from remote Unsplash URLs, no local asset bundling.
- Depends on `app/restaurant/[id]` existing as a route.

## Notes for the AI Agent

- Verification: `npx tsc --noEmit` clean + bundle smoke test (`/`, `search` tab, `/type/[dimension]/[id]`, `/type-overview/[dimension]`, across web/iOS/Android).
- `SearchMapView`/`MapResultsSheet`/`MapSearchBar`/`MapPlaceholder` exist as unused files, exported from `features/search/components/index.ts`. Re-wiring them means new call sites, not un-commenting.

## Changelog

| Date | Change |
|------|--------|
| 2026-07-23 | Spec created retroactively for US1 (Home, already implemented). US2 recorded pending. |
| 2026-07-23 | US3 (Category page) designed. Bottom tab bar designed. |
| 2026-07-24 | Wire contract rebuilt to mirror Google Places API (New). US3 implemented. |
| 2026-07-29 | US2 implemented as a full-screen map with a draggable results sheet. Search bars became real debounced filters. |
| 2026-08-06 | US5 implemented — Categories tab became an overview grid; per-cuisine content moved to `app/category/[cuisine].tsx`. |
| 2026-08-12 | US3's Category page rebuilt into the dimension-agnostic `TypeDetailScreen`/`TypeOverviewScreen` (`d2bb1c6`, `e1d90b7`), superseding the prior per-cuisine components. US6 (Occasion page) shipped as a byproduct of this change. Search screen rebuilt from map+sheet into a plain filterable list (`02e9cb9`); `SearchMapView`/`MapSearchBar`/`MapResultsSheet` unused since. |
| 2026-08-17 | Spec corrected against shipped code. Removed two FRs describing Home shortcuts (Dine-in/Bars/Takeout) and a benefits grid, both deleted. Filters drill-down and geolocation designed, not started. |
| 2026-08-18 | Rewritten for tone — narrative/historical framing removed from body sections, consolidated into this Changelog. |
| 2026-08-26 | Wired to the real `dine-out-backend-overture` API (`feat/wire-real-backend`). The Price filter category and the two price-based sort options were removed (not left inert) — the real backend has no price data, so they could never match anything. FR-011's `rating · priceLevel` card text now renders only the segments that exist (both are null for every restaurant today). |
