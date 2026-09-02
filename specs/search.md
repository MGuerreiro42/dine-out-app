# Feature Specification: Search (restaurant discovery)

**Feature**: `search` — folder `src/features/search/`
**Created**: 2026-07-23
**Status**: In Progress — User Stories 1, 2, 3, 4, 5, 6 Implemented against real `dine-out-backend-overture` data; Home's Occasion/Ambient sections replaced by two randomized cuisine spotlight sections; Home and Search gained empty-state UI; Home gained a loading skeleton; Features filter drill-down (FR-019) designed, not started; Price filter (FR-020) removed 2026-08-26, not just deferred — no price data exists in the real backend; cuisine-dimension Type Detail pages now render the subtype row FR-008 always specced but never built (2026-09-02); Home's "Explore by type" occasion-chip row hidden behind `SHOW_EXPLORE_BY_TYPE = false` (2026-09-02) — occasion data still isn't enriched enough to be useful, same root cause as the already-documented 2026-08-28 entry below; Cuisine chip row now defaults to a synthetic "All" chip (FR-030, 2026-09-02) instead of silently defaulting to the first real cuisine
**Design reference**: `App Flow.dc.html` — frames "1 · Home", "3 · Categories Overview", "4 · Category page", "4b · Occasion page". Frame "2 · Search & Map" is stale — the shipped screen has no map.

## Summary

Entry point for restaurant discovery: category rails on Home (cuisine, occasion, ambient), a dimension-agnostic detail page per category/occasion, and a filterable, sortable results list. No map.

## User Stories

### User Story 1 - Discover restaurants by category on Home (Priority: P1) — Implemented

The user opens the app, sees Home with a switchable cuisine rail plus two randomized cuisine spotlight rails, and taps a restaurant to see its detail.

**Independent test**: open `/` (Home tab), tap a cuisine chip other than the default, confirm the rail changes; tap a card, confirm navigation to `/restaurant/[id]`.

**Acceptance scenarios**:

1. **Given** Home loads, **when** the screen opens, **then** the cuisine chip row's first chip is "All" (active by default) and the rail shows a cuisine-diverse mix from the nearby pool, not one single cuisine.
2. **Given** the "All" chip is active, **when** the user taps a specific cuisine's chip, **then** that chip becomes active (the primary/selected cuisine) and the rail updates to that cuisine's restaurants alone; tapping "All" again returns to the diverse mix.
3. **Given** any rail, **when** the user taps a card, **then** the app navigates to `/restaurant/[id]`.
4. **Given** any rail, **when** the user taps its trailing "View more" tile, **then** the app navigates to `/type/cuisine/{id}` for that rail's cuisine.
5. **Given** the Cuisine section header, **when** the user taps "View all cuisines", **then** the app navigates to `/type-overview/cuisine`.
6. **Given** the "Best Deliveries & Takeaways" section, **when** it renders, **then** it shows only restaurants with `hasDelivery: true`; its "View all"/"View more" navigates to `/search?delivery=1`.
7. **Given** Home's search bar, **when** tapped, **then** the app navigates to `/search`.
8. **Given** the user taps the location header, **when** the tap happens, **then** a bottom sheet opens with placeholder content.
9. **Given** the user taps the menu icon (≡), **when** the tap happens, **then** the navigation sidebar opens (`auth.md` User Story 3).
10. **Given** Home's data has loaded, **when** it renders, **then** two spotlight sections show below the Cuisine rail, each for a distinct, randomly picked cuisine that is not the active cuisine chip, not the catch-all `restaurant` bucket, and has at least one matching restaurant, titled from a random template (e.g. "Best of Italian"); the pick is keyed to the current location/radius anchor — stable across a same-anchor re-render or refetch, re-picked against the new restaurant set when the anchor (latitude/longitude/radius) changes.
11. **Given** zero restaurants match the current location and radius, **when** Home renders, **then** an empty state replaces the section stack (the search-bar header and `LocationHeader` stay visible); below the max radius (100 km) it offers a CTA to expand to 100 km, at the max radius it shows "No restaurants found within 100 km" / "Try a different location." instead, with no CTA.
12. **Given** Home's restaurant/taxonomy queries are in flight, **when** the screen renders, **then** a skeleton placeholder shows in place of the section stack.
13. **Given** Home already has restaurants loaded and the user changes location/radius (radius pill, address search, map pick, or the empty-state CTA), **when** the resulting refetch is in flight and yields zero restaurants, **then** a lightweight loading indicator (spinner + "Searching a wider area...") shows in place of the empty state until the refetch resolves — the empty-state CTA disappearing on tap is never the only feedback.
14. **Given** the "All" chip is active, **when** the Cuisine section's "View more" tile is tapped, **then** the app navigates to `/search` (there is no `/type/cuisine/all` route); with a specific cuisine active, it navigates to `/type/cuisine/{id}` as before (scenario 4).

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
2. **Given** a cuisine, occasion, or ambient page, **when** it renders, **then** a Champion card carousel shows the top-rated restaurants for that value, with the same prev/next/dot controls as Home's featured carousel.
3. **Given** the detail page, **when** it renders, **then** a best-rated grid (top 4 by rating) shows, each card with photo, an overlaid rating badge, name, cuisine label and price, and an optional discount pill.
4. **Given** a cuisine page, **when** it renders, **then** a subtype row shows below the best-rated grid; tapping an entry opens a placeholder sheet. Occasion and ambient pages show two refine rows instead, each with its own filtered grid.
5. **Given** the detail page, **when** it renders, **then** a trending grid and a near-you grid render below, same card shape as the best-rated grid; near-you cards additionally show distance.
6. **Given** any section's "View all" link, **when** tapped, **then** the app navigates to `/search`, pre-filtered to that value.
7. **Given** any restaurant card on the page, **when** tapped, **then** the app navigates to that restaurant's detail screen.

---

### User Story 4 - Use my current location, search an address, or pick a point on the map (Priority: P3) — Implemented

The app detects the device's GPS location on open and uses it as the search anchor automatically. The location sheet also lets the user override that anchor: type an address to forward-geocode, or pick a point on a full-screen map. A denied permission surfaces a visible action to enable location in OS settings, instead of failing silently. The location row also carries a radius selector controlling how far `getNearbyPlaces()` searches.

**Acceptance scenarios**:

1. **Given** the app opens and location permission is granted, **when** the coordinate resolves, **then** `src/stores/location.ts` holds `{latitude, longitude, label, address}` and `status: 'resolved'`, `source: 'gps'`; `LocationHeader` displays the label.
2. **Given** permission is denied, **when** that happens, **then** `status` becomes `'denied'` (distinct from `'fallback'`) and the store falls back to the static coordinate; a timeout or other error still falls back with `status: 'fallback'`. Neither case blocks any screen.
3. **Given** `LocationHeader` is tapped, **when** the sheet opens, **then** it shows a `CurrentLocationCard` (tap re-resolves via GPS), an `AddressSearchInput` and a "Pick on map" row (both native-only, hidden on web), and, only when `status === 'denied'` and not on web, an "Enable location" button deep-linking to OS settings.
4. **Given** the address search input (native only), **when** the user submits a query, **then** it forward-geocodes via `Location.geocodeAsync` and, on a match, calls `setManualLocation` with the first result and sets `source: 'manual'`.
5. **Given** "Pick on map" is tapped (native only), **when** the user navigates to `/location-picker`, **then** a full-screen MapLibre map renders with a fixed center pin; confirming reads the map's own center (`MapRef.getCenter()`) and calls `setManualLocation`, then returns to the previous screen.
6. **Given** the web platform, **when** `/location-picker` is opened directly, **then** it renders `MapPlaceholder` with "Manual map selection will be available soon." instead of a native map.
7. **Given** the location row, **when** the user taps the radius pill next to the location pill, **then** a dropdown lists 5/10/50/100 km; selecting one calls `setRadiusKm` and the next `getNearbyPlaces()` request uses that value.

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
- No restaurants: the featured banner doesn't render. Exactly one: it renders without chevrons/dots.
- Zero restaurants within Home's active location/radius, below the max radius: an empty state replaces the section stack instead of an empty screen; its CTA expands the radius to the max.
- Zero restaurants within Home's active location/radius, already at the max radius: the empty state's copy changes ("No restaurants found within {max} km" / "Try a different location.") and drops the CTA — there's nothing further to expand to.
- A location/radius change (radius pill, address search, map pick, or the empty-state CTA) that re-fetches and still finds zero restaurants: a loading indicator ("Searching a wider area...") shows while that refetch is in flight, distinct from the (stale) empty state disappearing with no feedback.
- Fewer than 2 cuisines eligible for Home's spotlight sections (excludes the active cuisine, the catch-all `restaurant` bucket, and any cuisine with zero matches): renders as many spotlight sections as are eligible — 0, 1, or 2.
- A location/radius change while spotlights are showing: the spotlight pick re-derives against the new restaurant set once the refetch resolves (not the stale pick from the previous anchor); `useRestaurantsQuery`'s `keepPreviousData` means the render immediately after the change still carries the previous anchor's data, so the re-pick waits for `isPlaceholderData` to clear.
- Zero results on Search after text/filter narrowing: an empty state replaces the results list, no CTA.
- Cuisine category tabs use the same 5-cuisine taxonomy as Home.
- Champions/trending/near-you derive from the same 30-restaurant mock; with 6 restaurants per cuisine, the same restaurant can appear in more than one grid.
- `react-native-maps` has no web renderer; `SearchMapView.web.tsx` swaps in a placeholder via Metro's platform-file resolution. Neither is rendered on the Search screen.
- Native `MapView` requires a Google Maps API key; without one, `SearchMapView.tsx` falls back to `MapPlaceholder`.

## Functional Requirements

- **FR-001**: The system MUST display restaurants grouped into horizontal rails by cuisine, occasion, and ambient.
- **FR-002**: The user MUST be able to switch the active cuisine, occasion, and ambient category independently.
- **FR-003**: The system MUST visually highlight the active category in each selector.
- **FR-004**: The system MUST display a carousel of featured restaurants above the category rails, auto-advancing with manual prev/next controls and dot indicators.
- **FR-005**: The user MUST be able to tap any restaurant card and navigate to its detail.
- **FR-006**: The "Best Deliveries & Takeaways" rail MUST show only restaurants with `hasDelivery: true`.
- **FR-007**: The system MUST display the user's location (area and address) at the top of Home, resolved from the device's real GPS coordinate (US4).
- **FR-008**: `/type/{dimension}/{id}` MUST render a hero or champion card, best-rated grid, refine or subtype row, trending grid, and near-you grid for the active value, per User Story 3.
- **FR-009**: The menu icon (≡) MUST open the navigation sidebar (`auth.md` User Story 3).
- **FR-010**: On Home, Search, category/occasion detail pages, and Profile, the system MUST display a bottom tab bar with 4 items — Home, Search, Categories, Profile — highlighting the active tab.
- **FR-011**: Each Search-screen list card MUST display photo, an open-status pill, favorite and share icons, name, `rating · priceLevel`, `cuisineLabel`, and up to 2 tags; tapping it MUST navigate to its detail screen.
- **FR-012**: The Search screen's search bar MUST filter the visible list by name or cuisine label, live and debounced. Home's search bar is a tap target only and MUST navigate to `/search`.
- **FR-013**: The Search screen MUST offer a Sort control (Top Rated / Trending / Price: Low to High / Price: High to Low) that reorders the visible list.
- **FR-014**: The Search screen MUST offer a Filters chip listing Cuisine, Ambient, Occasion, Features, Price, Delivery. Cuisine/Occasion/Ambient/Delivery filter the list when set via an incoming route param, shown as a dismissible chip.
- **FR-015**: Home's rail cards MUST show a tags row.
- **FR-016**: On app open, the system MUST request foreground location permission (`expo-location`) and, if granted, resolve the device's coordinate into `src/stores/location.ts`, guarded by a timeout; permission denial sets `status: 'denied'`, a timeout or other error sets `status: 'fallback'` — both fall back to the static coordinate, neither blocks any screen.
- **FR-017**: `LocationHeader`'s sheet MUST offer a `CurrentLocationCard` showing the resolved label/address that re-resolves via GPS on tap.
- **FR-019** — Not started: The Filters menu MUST let the user pick a Cuisine/Occasion/Ambient value directly, not only inherit one via route param.
- **FR-020** — Not started: Price and Features MUST become real filters — Price as a single-select from `Restaurant.priceLevel`; Features as 4 multi-select flags (vegetarian options, good for groups, family friendly, outdoor seating), matching requires all active flags.
- **FR-021**: `LocationHeader`'s sheet MUST offer an `AddressSearchInput` (hidden on web) that forward-geocodes a typed address via `Location.geocodeAsync` on submit and sets it as the search anchor via `setManualLocation`.
- **FR-022**: `LocationHeader`'s sheet MUST offer a "Pick on map" row (hidden on web) navigating to `/location-picker`, a full-screen MapLibre map with a fixed center pin; confirming reads the map's center (`MapRef.getCenter()`) and calls `setManualLocation`. The web platform renders `MapPlaceholder` instead of a native map.
- **FR-023**: When `status === 'denied'` (native only), `LocationHeader`'s sheet MUST show an "Enable location" button that deep-links to OS settings (`Linking.openSettings()`).
- **FR-024**: The location row MUST offer a radius pill (`{radiusKm} km`) next to the location pill; tapping it opens a 4-option dropdown (5/10/50/100 km, default 10) that calls `setRadiusKm` on selection, threading the chosen value into `getNearbyPlaces()`'s `radiusKm` param.
- **FR-025**: Home MUST render two spotlight sections below the Cuisine rail, each for one randomly selected cuisine that is not the active cuisine chip, not the catch-all `restaurant` bucket, and has at least one matching restaurant; the selection MUST be keyed to the current location/radius anchor (stable across a same-anchor re-render/refetch, re-picked when the anchor changes) and paired with a random title template interpolating that cuisine's label. Every template MUST read as a natural section title against every real cuisine label, not only adjectival ones (`GET /taxonomies`).
- **FR-026**: Home MUST render an empty state in place of the section stack when zero restaurants match the current location/radius, keeping the search-bar header and `LocationHeader` visible. Below the max radius (100 km, `LocationHeader`'s `RADIUS_OPTIONS_KM`), it MUST offer a CTA to expand to that max; at the max radius, it MUST show radius-specific copy ("No restaurants found within {max} km" / "Try a different location.") instead, with no CTA. While a location/radius-triggered refetch is in flight and still yields zero restaurants, a loading indicator MUST show instead of the empty state or its CTA.
- **FR-027**: Home MUST render a skeleton placeholder in place of the section stack while its restaurant/taxonomy queries are loading.
- **FR-028**: The Search screen MUST render an empty state in place of the results list when zero restaurants match the current filters/search text.
- **FR-029**: Home MUST render a "Nearby You" section below the Cuisine rail, showing the pool's nearest restaurants (already distance-sorted server-side) in large photo-first cards distinct from the rest of Home's small-card rails — deliberately, to give the top of Home visual variety, per a design canvas the user reviewed and approved (`nearby-you-directions` artifact). Each card: real photo (fallback placeholder), distance badge, favorite toggle, an optional first tag, name, and cuisine label. "View all" navigates to Search. Hidden entirely when the pool is empty.
- **FR-030**: The Cuisine chip row MUST show a synthetic "All" chip first, active by default. While active, the Cuisine rail MUST reuse the already-fetched nearby pool (no additional request) reordered by round-robin across cuisines (one restaurant per cuisine per pass) instead of raw distance order, so the rail reads as a diverse mix rather than a run of same-cuisine results. Tapping a real cuisine chip makes it the active/primary cuisine (unchanged single-cuisine filtering behavior); tapping "All" again returns to the diverse mix. "All" being active MUST NOT exclude any cuisine from spotlight eligibility (FR-025) — the exclusion only applies once a specific cuisine chip is active. Switching to a specific cuisine chip MUST show the Cuisine rail's skeleton placeholder while that cuisine's dedicated request is in flight, not silently keep showing the previously active cuisine's cards with no feedback.

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
- **Reuses from `src/components/ui/`**: `RestaurantCard`, `HorizontalRail`, `Chip`, `RatingBadge`, `BottomSheet`, `EmptyState`, `Skeleton`.
- **Reuses from `src/components/layout/`**: `SearchBar` (controlled on Search, non-interactive tap target elsewhere), `SideMenu` (content owned by `auth.md`).
- **Global state (US4)**: `src/stores/location.ts` (Zustand) — `{latitude, longitude, label, address, status: 'resolved' | 'fallback' | 'denied', source: 'gps' | 'manual', radiusKm}`, `resolveLocation()`, `setManualLocation()`, `setRadiusKm()`. Consumers: `LocationHeader.tsx`, `CurrentLocationCard.tsx`, `AddressSearchInput.tsx`, `LocationPickerScreen.tsx`, `SearchMapView.tsx`, `src/mocks/repository.ts`'s `getNearbyPlaces()`.
- **Types**: `Restaurant` shared (`src/types/restaurant.ts`); `Cuisine`/`Occasion`/`Ambient` feature-specific (`src/features/search/types/`).
- **Mocks**: `src/mocks/restaurants.ts` (30 places, 6 per cuisine), `src/mocks/discoveryTaxonomies.ts`. `useRestaurantsQuery` mirrors the Google Places API (New) Nearby Search / Text Search contract; `useDiscoveryTaxonomiesQuery` reads the app's own mock endpoint.
- **Shared map style**: `src/features/search/lib/mapStyle.ts` exports `OSM_RASTER_STYLE`, reused by `SearchMapView.tsx` and `LocationPickerMap.tsx`.
- **`TypeDetailScreen`/`useTypeDetail`** (`app/type/[dimension]/[id].tsx`) and **`TypeOverviewScreen`** (`app/type-overview/[dimension].tsx`) serve cuisine, occasion, and ambient from the same components — User Story 3.
- **`DiscoveryCard`** (`features/search/components/`): the detail page's grid card. Feature-local, not `components/ui/`.
- **Route for the Categories tab**: `app/(tabs)/category.tsx`, fixed, no dynamic segment. Per-cuisine content lives at `app/category/[cuisine].tsx`.
- **`useSearchMapDiscovery`** (`features/search/hooks/`): produces `MapResultData[]` from `useRestaurantsQuery`/`useDiscoveryTaxonomiesQuery`, derived at query time.
- **`pickSpotlights`** (`features/search/lib/pickSpotlights.ts`): pure helper selecting Home's two spotlight cuisines and title templates. `useHomeDiscovery` owns the memoization (`useRef`, computed once).
- **`HomeSkeleton`** (`features/search/components/`): Home's loading placeholder, composed from `components/ui/Skeleton` blocks shaped like the banner/chip-row/card-row layout.

## Out of Scope

- Voice search, and any filter beyond name/cuisine text matching.
- Real subtype filtering on cuisine detail pages.
- A map on the Search screen.
- Full Filters menu functionality (FR-019, FR-020).

## Assumptions and Dependencies

- Photos come from remote Unsplash URLs, no local asset bundling.
- Depends on `app/restaurant/[id]` existing as a route.

## Notes for the AI Agent

- Verification: `npx tsc --noEmit` clean + bundle smoke test (`/`, `search` tab, `/type/[dimension]/[id]`, `/type-overview/[dimension]`, across web/iOS/Android).
- `SearchMapView`/`MapResultsSheet`/`MapSearchBar`/`MapPlaceholder` exist as unused files, exported from `features/search/components/index.ts`. Re-wiring them means new call sites, not un-commenting.
- `HomeCardData.isOpenNow`/`hasDelivery` (`useHomeDiscovery.ts`'s `deriveHomeCard`) are synthetic (`id % 4 !== 0` / `id % 3 !== 0`), not real backend fields. Known limitation, not a bug.
- Cuisine-bucket photo pools are capped at 5 curated stock photos per bucket (`dine-out-backend`'s `src/restaurants/taxonomies.data.ts`), shared across every restaurant in that bucket, assigned once at ingestion. Visible photo repetition within a single cuisine-filtered rail/carousel is expected until the pool is expanded and a backfill migration re-assigns `photoUrl` for already-ingested rows. Flagged as future work, not scheduled.

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
| 2026-08-27 | Home's featured banner and the category detail page's Champion card became real carousels (`useCarouselIndex`) instead of always showing a single static restaurant — auto-advance every 5s plus tap chevrons/dots, cycling through 5 featured restaurants on Home and each category's top 4 champions. Verified `/type-overview/{dimension}` and `/type/{dimension}/{id}` are fully wired to the real backend and navigable end-to-end. |
| 2026-08-27 | Both carousels gained a directional slide transition (`useSlideAnimation`, RN `Animated`, no new dependency) — the incoming photo slides in from the right on forward advances (manual or auto) and from the left on `goPrev`. |
| 2026-08-27 | User Story 4 revived from an orphaned, never-merged branch (`feat/address-modal-expansion`, built 2026-08-18) and merged onto `feat/wire-real-backend`: `LocationHeader`'s sheet gained `CurrentLocationCard`, `AddressSearchInput` (native-only, forward-geocodes via `Location.geocodeAsync`), a "Pick on map" row (native-only, `/location-picker` route, full-screen MapLibre picker with a fixed center pin, confirms via `MapRef.getCenter()`), and an "Enable location" button (native-only) for the newly distinct `status: 'denied'` case. `src/stores/location.ts` gained `address`, `source: 'gps' \| 'manual'`, the `'denied'` status, and `setManualLocation()`. All copy translated from the original branch's Portuguese to English. FR-024 added: the location row gains a radius pill (5/10/50/100 km, default 10) opening a `Modal`+`measureInWindow` dropdown (same pattern as Search's Sort control), threading the selection into `getNearbyPlaces()`'s `radiusKm` param. Backend cap for `radiusKm` raised from 25 to 100 in `dine-out-backend-overture` (separate repo) to support the 100 km option. |
| 2026-08-28 | A manual walkthrough against the real backend surfaced 5 problems, all fixed except the fifth (documentation only): (1) Home rendered an empty screen, no UI, when `GET /restaurants` legitimately returned `200 []`; (2) Home showed one full-screen spinner and nothing else until every section's data arrived, no skeleton; (3) Search's result list had the same empty-state gap for zero matches; (4) Home's Occasion/Ambient sections were structurally dead — only 3 of 41,205 DB rows have `occasion`/`ambient` set, so both always fell back to `restaurants.slice(0, 3)`; (5) featured/carousel cards visibly repeat photos because each cuisine bucket's photo pool has only 5 curated stock photos, assigned once at ingestion. Fixed: new `EmptyState` primitive (`src/components/ui/EmptyState.tsx`, FR-026/FR-028) used by Home (zero restaurants nearby, with a "Expand to 100 km" CTA gated on `radiusKm < 100`) and Search (zero filtered results, no CTA). New `Skeleton` primitive (`src/components/ui/Skeleton.tsx`, RN `Animated` opacity pulse) and `HomeSkeleton` (`features/search/components/HomeSkeleton.tsx`) replace Home's `ActivityIndicator` (FR-027). Home's Occasion/Ambient sections (`OccasionSelector.tsx`/`AmbientSelector.tsx`, both deleted; `useHomeDiscovery` no longer exposes `occasions`/`ambients`/`occasionList`/`ambientList`/`setActiveOccasion`/`setActiveAmbient`) replaced by two randomized cuisine spotlight sections (FR-025) — selection and title-template pairing in the new pure `features/search/lib/pickSpotlights.ts`, memoized once per screen session via `useRef` in `useHomeDiscovery`. Not fixed, documentation only (item 5): the photo-pool-size limitation is noted below and cross-referenced in `dine-out-backend`'s `specs/restaurants.md`; `isOpenNow`/`hasDelivery` being synthetic is also newly documented, both under Notes for the AI Agent — neither is scheduled work this round. New tests: `src/features/search/lib/__tests__/pickSpotlights-test.ts`, `src/components/ui/__tests__/EmptyState-test.tsx`, `app/(tabs)/__tests__/index-test.tsx` (Home's empty and loading branches against a mocked `src/mocks/repository.ts`). `npx tsc --noEmit`, `npx jest` (48 tests), `npx biome lint .` clean; bundle smoke test clean on web/iOS/Android; verified live against the real backend (`localhost:3000`) via Playwright — empty state, its radius-expansion CTA, and the normal state with real spotlight sections (e.g. "Top Rated in Fast Food & Burgers") all confirmed working end to end. |
| 2026-08-28 | A UX-heuristics review of the above round found 3 bugs, all fixed same-day: (1) the spotlight pick (`useHomeDiscovery`'s `useRef` memo) was keyed on "ever computed," so a location/radius change silently kept showing the previous anchor's cuisines filtered against the new (often non-matching) restaurant set — re-keyed to `` `${latitude}:${longitude}:${radiusKm}` ``, guarded on `!restaurantsQuery.isPlaceholderData` so the render right after an anchor change (still carrying the previous anchor's data under `keepPreviousData`) doesn't lock in a stale pick before the real refetch resolves. (2) The "Expand to 100 km" CTA gave no feedback: `keepPreviousData` means a radius-triggered refetch sets `isFetching`, not `isLoading`, so `HomeSkeleton` never showed, and the CTA disappeared the instant `radiusKm` flipped to 100 with no acknowledgment a fetch was in flight; worse, hitting the max radius with still-zero results left no CTA and no explanation. Fixed: `useHomeDiscovery` now exposes `isFetching`; Home shows a spinner + "Searching a wider area..." whenever `isFetching && restaurants.length === 0`; at the max radius (`LocationHeader`'s now-exported `RADIUS_OPTIONS_KM`) with zero results, the empty state's copy changes to "No restaurants found within 100 km" / "Try a different location." with no CTA (FR-026, US1 scenarios 11/13). (3) Spotlight title templates read wrong against real taxonomy labels pulled live via `curl localhost:3000/taxonomies` (11 buckets: Bars, Restaurants, Pizza & Italian, Brazilian, Fast Food & Burgers, Barbecue & Grill, Cafés & Coffee, Asian, Latin American, Buffet, Vegetarian & Vegan) — the catch-all `restaurant` bucket produced "Best of Restaurants" in an app that's entirely restaurants, and "in {cuisine}" broke for non-adjectival labels ("Trending in Buffet"). Fixed in `pickSpotlights.ts`: `restaurant` excluded from eligibility; all 4 templates dropped the preposition (`Best of {cuisine}`, `Trending {cuisine}`, `Top Rated {cuisine}`, `Popular {cuisine}`), verified against all 10 remaining labels. Also softened Search's empty-state title from "No restaurants match your filters" to "No restaurants found" — it showed even for a plain zero-match text search with no filters active. New tests: `src/features/search/hooks/__tests__/useHomeDiscovery-test.ts` (anchor-change re-pick, same-anchor refetch stability), extended `pickSpotlights-test.ts` (catch-all exclusion) and `app/(tabs)/__tests__/index-test.tsx` (max-radius empty state, no CTA). `npx tsc --noEmit`, `npx jest` (52 tests), `npx biome lint .` clean; bundle smoke test clean; verified live against the real backend/frontend via Playwright — throttling `/restaurants` confirmed "Searching a wider area..." shows immediately after tapping the CTA and resolves into real spotlight sections ("Popular Brazilian", "Popular Barbecue & Grill" — no "Restaurants" spotlight). |
| 2026-08-28 | User-reported bug, found live and fixed same-day: Home's featured carousel and the category detail page's Champion card carousel showed a plain gray box instead of the restaurant photo — not a backend/data issue (`photoUrl` confirmed present and loading with HTTP 200 via Playwright network inspection). Root cause: `FeaturedBanner.tsx`/`TypeDetailScreen.tsx` wrap the sliding photo in a core RN `Animated.View` with a `className` prop, but NativeWind only auto-intercepts `className` on components it recognizes at the JSX call site — `Animated.View` isn't one of them without an explicit `cssInterop(Animated.View, { className: 'style' })` registration (the pattern `MapResultsSheet.tsx` already uses, there for `react-native-reanimated`'s `Animated.View`, a different import). Without it, the className was silently dropped, collapsing the wrapper to zero height (confirmed via `getComputedStyle` — `height: 0px` through the whole `Animated.View` chain, `725px` on the sibling `absolute inset-0` overlay that renders fine). Fixed by adding the same `cssInterop` registration to both files. While investigating, found the identical bug independently broke `Skeleton.tsx` (this same day's own new component) — its pulsing blocks were rendering with no size/color at all, silently, since its first commit; fixed with the same registration. `src/components/ui/__tests__/`-adjacent `app/(tabs)/__tests__/index-test.tsx`'s skeleton test was inadvertently relying on the bug (asserting the literal, unprocessed `"bg-sand-light"` string in the `toJSON()` tree) and had to be rewritten to count `Animated.View` pulse nodes by their `style.opacity` value instead — `className` on a *dynamically built* string (a template literal, not a static one) doesn't reliably resolve through NativeWind's native-test-renderer style registry even with `cssInterop` correctly registered, unlike on real web/native where it resolves via the platform's own compiled stylesheet; this is a known Jest-environment limitation documented here rather than treated as a further bug. `npx tsc --noEmit`, `npx jest` (52 tests, same count — one assertion rewritten, not added), `npx biome lint .` clean; verified live via Playwright — `clientHeight` went from `0` to `725`/`623` on the two carousels, real photos visible in screenshots, and the loading skeleton's `bg-sand-light` blocks (22 of them, matching `HomeSkeleton`'s expected count) now have a real, non-transparent computed background color for the first time. |
| 2026-09-02 | New "Nearby You" section (FR-029) added below the Cuisine rail: `NearbySection.tsx`, large photo-first cards (photo + dark scrim, text overlaid) deliberately distinct from the rest of Home's small horizontal-scroll cards, per the user's request to give the top of Home visual variety. Reuses the same distance-sorted restaurant pool `useHomeDiscovery` already fetches for the Cuisine rail/spotlights/brand rail — no new query. Design settled via 3 directions mocked in a `/design` canvas (photo rail, editorial stack, warm list with a serif pairing), user picked the photo rail with the editorial stack's title+subtitle treatment; the serif-pairing direction was not chosen, so no new font dependency. `npx tsc --noEmit`, `npx biome lint .`, `npx jest` (71 tests) clean; verified live on a physical Android device. |
| 2026-09-02 | Live device-testing feedback, three changes. (1) Home's "Explore by type" occasion-chip row hidden behind a local `SHOW_EXPLORE_BY_TYPE = false` in `app/(tabs)/index.tsx` — occasion data still isn't enriched enough to be useful (same root cause as the 2026-08-28 entry above), and this section wasn't itself covered by that fix. (2) `useTypeDetail.ts`/`TypeDetailScreen.tsx` now implement the subtype row FR-008/US3 point 4 always specced but never built: cuisine-dimension Type Detail pages render one ranked subtype row (new `SubtypeRow` component, tap opens a placeholder `BottomSheet`) instead of the two Occasion/Ambient refine rows every dimension incorrectly got before — occasion/ambient-dimension pages are unchanged, still two refine rows, per the same FR text. Subtypes are ranked by how many restaurants in the page's already region-scoped pool actually match, since `DiscoveryTaxonomies.categorySubtypes` carries no machine key, only a label; matching is done by mirroring the backend's `humanizeCategory()` into a new `src/features/search/lib/humanizeCategory.ts` (same "mirrored, not shared" cross-repo convention `categorySubtypes` itself already uses) and comparing against each restaurant's raw `category` — which required adding `category: string` to the shared `Restaurant` type (`src/types/restaurant.ts`) and `mapSummaryToRestaurant`, since it was being dropped on the floor before (only the coarser `cuisineId` survived the wire→domain mapping). Caught and fixed on live-device re-verification: `TypeDetailScreen.tsx`'s shared `SectionHeader` always renders a "View all" link regardless of whether `onViewAll` is passed, so `SubtypeRow` (which has nowhere to send it — Search doesn't filter by subtype yet) was rendering a dead button; `SubtypeRow` now uses its own plain header instead of `SectionHeader`. (3) `src/features/search/lib/mapStyle.ts`'s two consumers (`SearchMapView.tsx`, `LocationPickerMap.tsx`) switched from raw OpenStreetMap raster tiles to a minimal light basemap, first attempted with CARTO's "light_all" raster tiles (their URL responds 200 without any key) and caught wrong on the same live-device re-verification: CARTO now watermarks every tile "API KEY REQUIRED" without an account, invisible to an HTTP-status-only check — confirmed by downloading and actually viewing a tile, not just checking `%{http_code}`. Replaced with OpenFreeMap's `positron` style (`https://tiles.openfreemap.org/styles/positron`), a genuinely keyless, actively maintained vector style — `MapLibreMap`'s `mapStyle` prop accepts a style URL string directly, no raster `StyleSpecification` object needed. `mapStyle.ts`'s export renamed `OSM_RASTER_STYLE` → `MAP_STYLE_URL` to match. New test: `useTypeDetail-test.ts`'s subtype-ranking case. `npx tsc --noEmit`, `npx biome lint .`, `npx jest` (71 tests) clean; verified live on a physical Android device via `eas build --local`, including the corrected map style and subtype row without a dead "View all". |
| 2026-09-02 | "All" chip added to Home's Cuisine chip row (FR-030), per the user's original request: a synthetic `{id:'all', label:'All'}` entry, prepended and active by default, replacing the previous silent "defaults to the first real cuisine" behavior. Implementation entirely in `useHomeDiscovery.ts`: `activeCuisine`'s existing `null` initial state is now the actual, intentional "All" representation (previously an implicit "not yet chosen" that immediately fell back via `?? cuisines[0]?.id`); the public `setActiveCuisine(id)` translates the chip list's `'all'` id back to `null` so `CuisineSelector` (unchanged, still a pure `{id,label,photos,isActive}[]` + `onSelect(id)` consumer) needs no awareness of what "All" means internally. While "All" is active, the Cuisine rail derives from the already-fetched nearby pool (`cuisineListQuery` stays disabled, no new request) reordered by a new pure `src/features/search/lib/interleaveByCuisine.ts` (round-robin across cuisine groups) instead of raw distance order, so the rail visibly mixes cuisines instead of reading as one cluster (`cuisineListLoading` is `false` in this mode — synchronous derivation, nothing in flight). Added an `all` entry to `CUISINE_ICONS` (`taxonomyIcons.ts`, grid icon) so it doesn't collide visually with the real "Restaurants" bucket's icon via the default fallback. Fixed a navigation bug this introduces: the Cuisine section's "View more" (`app/(tabs)/index.tsx`) now falls back to `/search` when `activeCuisine.id === 'all'` instead of building an invalid `/type/cuisine/all` route (US1 scenario 14), mirroring `NearbySection`'s existing "View all" fallback. Side effect, deliberate: `pickSpotlights`'s cuisine-exclusion param is `currentCuisine`, so with "All" active (`null`) no cuisine is excluded from spotlight eligibility — previously the silently-defaulted first cuisine was always excluded. New test: `src/features/search/lib/__tests__/interleaveByCuisine-test.ts`; `useHomeDiscovery-test.ts` extended with an "All"-default case and its fixture adjusted (`ANCHOR_A_RESULTS` no longer includes an 'italian' restaurant, so 'italian' stays a selectable taxonomy entry but is never spotlight-eligible, keeping the no-exclusion default deterministic) — one existing test updated to explicitly select 'italian' first, since it's no longer the implicit default. Live-device follow-up same day: tapping a specific cuisine chip visibly did nothing until the new cuisine's cards silently swapped in — `cuisineListQuery` (`useRestaurantsQuery`) uses `keepPreviousData`, so `isLoading` stays `false` and the previous cuisine's cards keep rendering across a chip switch, only `isPlaceholderData`/`isFetching` flip. Fixed by widening `cuisineListLoading`'s derivation to also cover `isFetching && isPlaceholderData` (FR-030), so the Cuisine rail's skeleton now shows during the switch. New test: `useHomeDiscovery-test.ts`'s "shows a loading state while switching..." case, using a controllable deferred mock to assert `cuisineListLoading` actually flips `true` mid-switch (not just eventually `false`, which the naive fix would have passed vacuously). `npx tsc --noEmit`, `npx biome lint .`, `npx jest` (76 tests) clean. |
