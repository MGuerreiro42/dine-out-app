# Feature Specification: Search (restaurant discovery)

**Feature**: `search` — folder `src/features/search/`
**Created**: 2026-07-23 *(retroactive — spec written after the Home implementation, as a validation of `TEMPLATE.md`)*
**Status**: In Progress — User Stories 1, 2, 3, 5, and 6 Implemented; User Story 4 (geolocation) designed 2026-08-17, Not Started; real filter-picking and Features/Price filters (FR-030/FR-031) designed 2026-08-17, Not Started
**Design reference**: `App Flow.dc.html` — frame "1 · Home" (implemented, diverges from the design in several ways — see US1), frame "1b"/"1c" (address-popup/add-address-form overlays, see US4, not started), frame "2 · Search & Map" (**stale** — the shipped screen has no map, see US2), frame "3 · Categories Overview" (implemented as US5), frame "4 · Category page" (implemented as US3, now via a generalized dimension-agnostic architecture — see US6's note), frame "4b · Occasion page" (US6, implemented via that same generalization). *(Canvas frame numbers/labels have shifted more than once since this spec was first written — always re-check the live canvas rather than trusting a cached number.)*

## Summary

Entry point for restaurant discovery: browsing by category (cuisine, occasion, ambient) on the Home screen, and a filterable, sortable results list on a second screen (no map — see US2).

## User Stories

### User Story 1 - Discover restaurants by category on Home (Priority: P1) — **Implemented**

The user opens the app and sees Home with restaurants grouped by cuisine, occasion, and ambient, switches the active category per rail, and taps a restaurant to see its detail.

**Why this priority**: it's the app's first screen — without it there's no navigable product to show business partners.

**Independent test**: open `/` (Home tab), tap a cuisine chip other than the default, confirm the rail changes; tap a card, confirm navigation to `/restaurant/[id]`.

**Acceptance scenarios**:

1. **Given** Home loads, **when** the screen opens, **then** the "Choose your Cuisine" rail shows restaurants from the first cuisine by default.
2. **Given** the cuisine rail on "Churrasco", **when** the user taps "Italiana", **then** the rail updates to `cuisine: "italiana"` restaurants.
3. **Given** any rail, **when** the user taps a card, **then** the app navigates to `/restaurant/[id]`.
4. **Given** any rail (cuisine/occasion/ambient), **when** the user taps its trailing "View more" tile, **then** the app navigates to `/type/{dimension}/{activeId}`.
5. **Given** a rail's section header, **when** the user taps "View all {dimension}", **then** the app navigates to `/type-overview/{dimension}`.
6. **Given** the "Best Deliveries & Takeaways" section, **when** it renders, **then** it shows only restaurants with `hasDelivery: true`; **when** the user taps its "View all" or "View more", **then** the app navigates to `/search?delivery=1`.
7. **Given** Home's search bar, **when** tapped, **then** the app navigates to `/search` (not an inline filter on Home).
8. **Given** the user taps the location header, **when** the tap happens, **then** a bottom sheet opens with a simulated message (no real action yet).
9. **Given** the user taps the menu icon (≡), **when** the tap happens, **then** the real navigation sidebar opens — spec'd in `auth.md`'s User Story 3, not redefined here.

**Removed since last spec pass**: the 3 quick-navigation shortcuts (Dine-in/Bars/Takeout) and the static 4-item institutional benefits grid are no longer in `app/(tabs)/index.tsx` — confirmed absent, not just undocumented. `Benefit`/`BenefitSchema`/`BENEFITS` mock still exist but have zero consuming reads (dead code, same status as `CategorySubtype`).

---

### User Story 2 - Search and filter a restaurant list (Priority: P2) — **Implemented**

The user sees a filterable, sortable list of restaurants (no map), seeded from an optional incoming taxonomy/delivery filter, and taps a card to see its detail.

**Why this priority**: complements Home's category-based discovery with active text search + filters — important, but Home alone already delivers a navigable MVP.

**Entry point confirmed**: reached by tapping "Buscar" (bottom tab), Home's search bar, or any rail/section's "View all"/"View more" link (seeds `cuisine`/`occasion`/`ambient`/`delivery` query params) — all target `app/(tabs)/search.tsx`, a normal tab/push navigation.

**Independent test**: from any tab, tap "Buscar" — confirm a result count + Sort control render, a Filters chip row below, and a scrollable list of restaurant cards; type in the search bar, confirm the list narrows (debounced); open Sort, pick an option, confirm list order changes; tap a card, confirm navigation to `/restaurant/[id]`.

**Acceptance scenarios**:

1. **Given** the Search screen, **when** it renders, **then** a header search bar (real, debounced `TextInput`) filters the list by name or cuisine as the user types.
2. **Given** the Search screen, **when** it renders, **then** a result count and a "Sort" control show; tapping Sort opens a dropdown (Top Rated, Trending, Price: Low to High, Price: High to Low) and picking an option reorders the list.
3. **Given** the Search screen, **when** it renders, **then** a "Filters" chip opens a dropdown listing Cuisine, Ambient, Occasion, Features, Price, Delivery; tapping Cuisine/Ambient/Occasion/Price drills into that dimension's option list (single-select, taps set the value and return to the category list); tapping Features drills into a multi-select option list (checkable rows, a "Done" row returns to the category list); tapping Delivery toggles it directly on the category list, no drill-down — **design only, not yet implemented**, see the Filters note below.
4. **Given** the screen was entered via a rail/section's "View all"/"View more" link, **when** it renders, **then** the list is pre-filtered by that link's `cuisine`/`occasion`/`ambient`/`delivery` query param, shown as a dismissible chip; tapping a chip's "×" clears that filter. **Design addition, not yet implemented**: the same dismissible-chip treatment extends to `priceLevel` and each active feature, once FR-030/FR-031 are built.
5. **Given** any list card, **when** tapped, **then** the app navigates to that restaurant's detail screen; tapping its heart icon toggles favorite (via `useFavoritesStore`); tapping its share icon shows a simulated `Alert`.

**Filters menu — real design proposed 2026-08-17, not yet implemented (see FR-030/FR-031)**: the current shipped code still matches the previous note below as of this pass — all 6 `FILTER_CATEGORIES` entries call `Alert.alert(label, 'Em breve.')` and never write filter state; Cuisine/Occasion/Ambient/Delivery have working filter logic (`ActiveFilters`, `deliveryOnly`) reachable only via incoming route params, and Features/Price have no backing fields at all. This pass's design: extend the existing "Filters" `Modal` (currently a flat category list) with an internal `filterMenuView` state (`'root' | 'cuisine' | 'occasion' | 'ambient' | 'price' | 'features'`) instead of adding new anchored Modals — tapping a category row swaps the Modal's content to that dimension's option list (a back-chevron header + rows), avoiding re-measuring `measureInWindow` anchors for a nested popover. Cuisine/Occasion/Ambient (from `useDiscoveryTaxonomiesQuery`) and Price are single-select, mirroring the existing Sort dropdown's row style (checkmark/bold on the active value, tap sets it and returns to `root`). Features is multi-select (checkable rows, doesn't auto-return). Delivery stays a single boolean toggled straight from the `root` view, same as it conceptually is today, just wired for real instead of `Alert`.

**Map — removed from this screen, not paused in a reachable sense**: `app/(tabs)/search.tsx` was rebuilt (commit `02e9cb9`) from a full-screen `SearchMapView` + floating `MapSearchBar` + draggable `MapResultsSheet` into this plain filterable list; a code comment (`// Map view paused — filtering-only for now, see MapResultsSheet/SearchMapView.`) is the only trace. `SearchMapView`(`.web`)/`MapSearchBar`/`MapResultsSheet`/`MapPlaceholder` still exist as files and are still exported from `features/search/components/index.ts`, but nothing imports or renders them — dead code, not deleted.

---

### User Story 3 - Browse a cuisine category page (Priority: P2) — **Implemented**

The user lands on a dedicated page for one cuisine category (e.g. Churrasco) and sees a hero banner, the best-rated places in that category, a way to explore by sub-style, trending places, and places near them — all without leaving the category.

**Why this priority**: a richer, editorial way to browse one category in depth, complementing Home's lighter "a few cards per category" rails — but Home alone already provides a full discovery MVP without it.

**Independent test**: from Home, tap a cuisine chip then its rail's "view all" — confirm navigation to the Categorias tab with that cuisine preselected; confirm the hero banner, best-rated grid, subtype row, trending grid, and near-you grid all render for the active category; tap a different category tab, confirm the whole page's content switches; tap a restaurant card, confirm navigation to its detail.

**Acceptance scenarios**:

1. **Given** the category page, **when** it renders, **then** it shows a row of category tabs, with the active one visually distinguished.
2. **Given** the category tabs, **when** the user taps a different one, **then** the hero banner, best-rated grid, subtype row, trending grid, and near-you grid all update to that category.
3. **Given** the category page, **when** it renders, **then** a hero banner shows the active category's photo and label, plus a "View on map" link.
4. **Given** the category page, **when** it renders, **then** a "best rated" grid (2 columns) shows places in that category, each with photo, a rating badge overlaid on the photo, name, cuisine label + price, and an optional discount pill.
5. **Given** the category page, **when** it renders, **then** a prompt ("What's the flavour today? Explore by style") and a row of subtype icons show below the best-rated grid; tapping either opens a placeholder sheet (subtype filtering isn't real yet).
6. **Given** the category page, **when** it renders, **then** a "trending" grid and a "near you" grid (near-you cards additionally show distance) render below, same card shape as the best-rated grid.
7. **Given** any restaurant card on the page, **when** tapped, **then** the app navigates to that restaurant's detail screen — every card is backed by a real `Restaurant` record (champions/trending/near-you are all derived client-side from the same 30-restaurant mock, see Edge Cases).

---

### User Story 4 - Use my current location automatically (Priority: P3) — **Designed 2026-08-17, Not Started**

**Superseded design (confirmed with the PO 2026-08-17)**: no saved-address list, no manual add-address form. The app detects the device's real GPS location on open and uses it as the search anchor automatically, iFood-style — one location, always current, no address book.

**Acceptance scenarios**:

1. **Given** the app opens and location permission is granted, **when** the coordinate resolves, **then** `src/stores/location.ts` holds the real `{latitude, longitude}` and a reverse-geocoded label; `LocationHeader` displays that label instead of the static mock.
2. **Given** permission is denied, times out, or `getCurrentPositionAsync` errors, **when** that happens, **then** the app falls back to the existing static coordinate silently — no error dialog, no blocked screen (same "never gate the guest" principle as `auth.md`'s User Story 2).
3. **Given** `LocationHeader` is tapped, **when** the sheet opens, **then** it shows the resolved address (or "Localização indisponível" on fallback) and, only when permission was denied, a "Tentar novamente" button that re-requests it.

**Resolved (was `[NEEDS CLARIFICATION]`)**: "Selecionar no mapa"/manual entry — dropped, not built. Persistence — N/A, re-detected every app open, nothing saved. Whether map/distance math uses it — yes, once resolved, `src/stores/location.ts` becomes the single source every consumer reads (see Architecture Mapping).

---

### User Story 5 - Browse all cuisine categories from an overview grid (Priority: P3) — **Implemented**

The user taps the "Categorias" tab (or Home's new "view all cuisines" link) and sees a 2-column grid of every cuisine (square photo card + label), one per `CUISINES` taxonomy entry; tapping one navigates to that cuisine's existing Category page (US3).

**Why this priority**: US3's Category page is already reachable directly from Home (per-cuisine); this is a browsing convenience layer on top, not a new capability.

**Design source**: `App Flow.dc.html`, frame "3 · Categories Overview" (`#categories-overview-frame`). **Routing change**: the bottom tab bar's "Categorias" item and the Sidebar's "Categorias" item both now point here instead of directly at the Category page. `app/(tabs)/category.tsx` (the tab's file, unchanged registration) now renders this overview grid; the former per-cuisine content moved to a new **`app/category/[cuisine].tsx`** route, no longer a tab root — `cuisine` is now a required path segment instead of an optional query param, and the screen grew a real back button (same pattern as `app/restaurant/[id].tsx`) since it's reached by pushing, not by tab switching.

**Acceptance scenarios**:

1. **Given** the "Categorias" tab or the Sidebar's "Categorias" item, **when** tapped, **then** a 2-column grid renders, one square photo + label tile per cuisine in the `CUISINES` taxonomy.
2. **Given** the Categories Overview grid, **when** the user taps a tile, **then** the app navigates to `/category/{cuisineId}` — that cuisine's existing Category page (US3), with a working back control returning to the grid.
3. **Given** Home's cuisine rail, **when** it renders, **then** it shows two links: "view all cuisines" (→ Categories Overview) and "view {cuisine} page" (→ that cuisine's Category page) — replacing the old single `onViewAll` link.

**Status**: no Acceptance Scenarios/Functional Requirements detail yet — will be filled in when picked up.

---

### User Story 6 - Browse an occasion page (Priority: P3) — **Implemented**

The user taps Home's occasion rail's "View more" (or "View all occasions" → an occasion tile) and lands on a dedicated page for one occasion (e.g. Encontro): a Champion highlight, the best-rated places for that occasion, two ways to refine by another taxonomy (cuisine, ambient), trending places, and places near them — all without leaving the occasion.

**Why this priority**: same reasoning as US3 — a richer, editorial way to browse by occasion, complementing Home's lighter occasion rail; Home alone already provides a full discovery MVP without it.

**Design source**: `App Flow.dc.html`, frame "4b · Occasion page" (`#occasion-frame`). **Delivered differently than the frame describes**: this story shipped as a side effect of a later, undocumented-until-now refactor (commits `d2bb1c6`/`e1d90b7`, 2026-08-12, already merged to `main`) that generalized US3's bespoke cuisine-only Category page into a single dimension-agnostic pair — `TypeDetailScreen`/`useTypeDetail` (route `app/type/[dimension]/[id].tsx`) and `TypeOverviewScreen` (route `app/type-overview/[dimension].tsx`) — serving `cuisine`, `occasion`, and `ambient` from the same components. `useCategoryDiscovery`, `DiscoveryCard`, `CategoryTabsRow`, `SubtypeRow`, and `app/category/[cuisine].tsx` (the reuse targets this story was originally scoped against) no longer exist; they were deleted in that same refactor. US3's own spec text below (its Acceptance Scenarios, FR-011–FR-016, Architecture Mapping) still describes the pre-refactor implementation and needs its own correction pass — out of scope for this pass, flagged here because it's exactly what US6 now reuses.

**Entry point confirmed**: Home's occasion rail (`app/(tabs)/index.tsx`) has two live links — "View all occasions" → `/type-overview/occasion` (a 2-column grid of all 4 `OCCASIONS`, tap navigates to that occasion's detail page) and, next to the rail itself, a "View more" link → `/type/occasion/{activeOccasion.id}` — both replace the old simulated-message sheet this spec's Edge Cases previously noted for occasion's "view all".

**Independent test**: from Home, tap "View all occasions" — confirm a 4-tile icon+label grid renders, one per `OCCASIONS` entry; tap a tile, confirm navigation to `/type/occasion/{id}` and the page's Champion/Champions/refine/Trending/Near You sections all render for that occasion; tap a different refine option, confirm its grid updates; tap a restaurant card, confirm navigation to its detail.

**Acceptance scenarios**:

1. **Given** Home's occasion rail, **when** the user taps "View all occasions", **then** the app navigates to `/type-overview/occasion`, a 2-column grid of all 4 `OCCASIONS` taxonomy entries (icon + label, no photo — see Note below), each tappable.
2. **Given** the occasions overview grid, **when** the user taps a tile, **then** the app navigates to `/type/occasion/{occasionId}`.
3. **Given** Home's occasion rail's active occasion, **when** the user taps its "View more" link, **then** the app navigates directly to `/type/occasion/{activeOccasionId}`, skipping the overview grid.
4. **Given** the occasion detail page, **when** it renders, **then** it shows a back button and a search bar in the header — **no in-page occasion tabs**; switching occasion happens by going back to Home's rail or the overview grid, not on-page. *(Diverges from the original design frame's "occasion tabs at top" — corrected here rather than copied, same discipline already applied to US3's dropped back-arrow inconsistency.)*
5. **Given** the occasion detail page, **when** it renders, **then** a "Champion" card shows the top-rated restaurant for that occasion (photo, name, ★ rating + review count) — the page's closest analogue to the design's photo hero banner, using the restaurant's own photo rather than the occasion's, since `OCCASIONS` (unlike `CUISINES`) has no `photo` field (see Note below).
6. **Given** the occasion detail page, **when** it renders, **then** a "Champions - Best Rated" grid (top 4 by rating) renders — fulfilling "Best for {occasion}".
7. **Given** the occasion detail page, **when** it renders, **then** two refine rows render (icon+label options for `cuisine` and `ambient`, each with its own filtered restaurant grid below it) — **replacing** the design's single "Refine pelo estilo" subtype-icon row; `CATEGORY_SUBTYPES` (the mock backing that subtype row on the cuisine page) was never extended to occasions and has no occasion keys.
8. **Given** the occasion detail page, **when** it renders, **then** an "On Fire - Trending" grid (top 4, sorted by id asc) and a final grid titled "{occasion label} Near You" (e.g. "Encontro Near You") render — the latter's wording literally matches the design's "{occasion} Near You" requirement.
9. **Given** any section header's "View all" link, **when** tapped, **then** the app navigates to `/search` pre-filtered to that occasion (and, for a refine section, that refine taxonomy too) — the map + filterable list screen, standing in for the design's dedicated "View on map" hero-banner link, relocated per-section instead of one page-level link.
10. **Given** any restaurant card on the page, **when** tapped, **then** the app navigates to that restaurant's detail screen — every card is a real `Restaurant` record (same derivation as US3, via `useTypeDetail`/`deriveHomeCard`).

**Note — `OCCASIONS` taxonomy gap confirmed**: `src/mocks/discoveryTaxonomies.ts`'s `OCCASIONS` array has `id`/`label`/`icon` only, no `photo` field (`CUISINES` has both). A literal photo hero banner for occasions isn't possible without adding one. Not a blocker — the implemented Champion-card pattern (restaurant photo, not taxonomy photo) sidesteps the gap entirely and is shared with `ambient` (which also has no `photo`). Flagged here rather than silently worked around, in case a future round wants a truer photo-hero treatment and needs to add `photo` to `OCCASIONS`/`AMBIENTS`.

**Status**: Implemented, retroactively documented in this pass — no new code needed; Home's occasion rail was already wired into the generic `type`/`type-overview` routes before this spec was updated to say so.

---

### Edge Cases

- **Empty filtered rail**: falls back to the first 3 restaurants overall, so a rail is never empty (`useHomeDiscovery.ts`).
- **Before the mock resolves**: rails render empty momentarily — imperceptible today (synchronous mock), will matter with real API latency.
- **`restaurants[0]` missing**: `FeaturedBanner` doesn't render (guarded).
- **Category/Occasion/Ambient "view all" navigation**: resolved — every rail (cuisine, occasion, ambient) now shows both a "View all X" (→ `/type-overview/{dimension}`) and "View more" (→ `/type/{dimension}/{id}`) link, shipped via the 2026-08-12 `TypeDetailScreen`/`TypeOverviewScreen` refactor.
- **Category taxonomy coverage**: category tabs reuse Home's exact 5-cuisine `CUISINES` taxonomy — no coverage gap.
- **Category items' restaurant identity**: champions/trending/near-you all derive from the same 30-restaurant mock via `useRestaurantsQuery`, not separate editorial data — every card is a real, navigable `Restaurant`. With only 6 restaurants/cuisine, the same restaurant can appear in more than one grid — a mock-data scale limit, not a bug.
- **Design inconsistency corrected**: dropped the category/Search & Map frames' leftover `‹` back arrows (pre-dated the bottom tab bar) — redundant on a tab root.
- **Bottom tab bar confirmed real UI** across Home/Category/Profile/Search & Map (Buscar included on tab switch, per user confirmation — a design-canvas omission, not intentional).
- **`react-native-maps` has no web renderer at all** — `SearchMapView.web.tsx` swaps in a placeholder via Metro's platform-file resolution.
- **Native `MapView` crashed hard without a Google Maps API key** (uncatchable `IllegalStateException`) — blocked on Google Cloud billing/KYC. `SearchMapView.tsx` fell back to `MapPlaceholder` when the key was unset.
- **Design pass 2026-08-17, not implemented**: `SearchMapView` designed to migrate `react-native-maps` → `@maplibre/maplibre-react-native` (OSM tiles, no API key needed) to unblock the crash above — same props contract, coordinates flip to MapLibre's `LngLat` tuple. Confirmed compatible with this project's New-Architecture-only RN version. `SearchMapView` stays dead code either way (not re-wired into `app/(tabs)/search.tsx` — the map was already removed from that screen, see US2's Map note); this only makes the component itself work again, PO decides if/when it resurfaces.
- **`latitude`/`longitude`/`reviewCount` promoted to the core `Restaurant` type** (stable, non-contextual Google fields); `distance`/`tagline`/`tags`/`isOpenNow` stay feature-local, derived by `useSearchMapDiscovery` (same "derive, don't store" discipline as `DiscoveryCardData`).
- **Home's location header popup still shows placeholder content** — the design's real saved-address-list content is superseded by US4's geolocation redesign (see that story).

## Functional Requirements

- **FR-001**: The system MUST display restaurants grouped into horizontal rails by cuisine, occasion, and ambient.
- **FR-002**: The user MUST be able to switch the active cuisine, occasion, and ambient category independently of one another.
- **FR-003**: The system MUST visually highlight which category is active in each selector (different color/border from the inactive state).
- **FR-004**: The system MUST display a featured restaurant ("featured this week") above the category rails.
- **FR-005**: The user MUST be able to tap any restaurant card and navigate to that restaurant's detail.
- **FR-006 — Corrected 2026-08-17**: The "Best Deliveries & Takeaways" rail MUST show only restaurants with `hasDelivery: true` (deterministic mock, `id % 3 !== 0`) — no longer a static, unfiltered "all restaurants" rail.
- **FR-007**: The system MUST display the user's location (area + address) at the top of Home. *(Static mock at this stage — see Assumptions.)*
- **FR-008 — Removed (confirmed 2026-08-17)**: the 3 quick-navigation shortcuts (Dine-in, Bars, Takeout) no longer exist in `app/(tabs)/index.tsx`.
- **FR-009 — Removed (confirmed 2026-08-17)**: the static 4-item institutional benefits grid no longer exists in `app/(tabs)/index.tsx`; `Benefit`/`BenefitSchema`/`BENEFITS` mock is dead code.
- **FR-010 — Superseded 2026-08-17, rewritten**: the Search screen no longer shows a map. `app/(tabs)/search.tsx` is a real (debounced) text-filterable, sortable restaurant list (see FR-019–FR-021 below), seeded by optional `cuisine`/`occasion`/`ambient`/`delivery` query params from other screens' links.
- **FR-011–FR-016 — STALE, superseded by shipped code (flagged 2026-08-17, not yet rewritten)**: two undocumented 2026-08-12 commits replaced `DiscoveryCard`/`CategoryTabsRow`/`SubtypeRow`/`useCategoryDiscovery`/`app/category/[cuisine].tsx` with a generic `TypeDetailScreen`/`TypeOverviewScreen`/`useTypeDetail` covering cuisine, occasion, and ambient at `app/type/[dimension]/[id].tsx`/`app/type-overview/[dimension].tsx`. FR-014's "placeholder sheet" subtype row no longer exists — replaced by `TypeDetailScreen`'s `RefineSection`, real working cross-taxonomy filtering. `CategorySubtype`/`CATEGORY_SUBTYPES` is dead code. Text below kept as a historical record pending a full rewrite against `TypeDetailScreen.tsx`.
- **FR-011 — Implemented (superseded, see note above)**: The system MUST display a row of category tabs (the same 5-cuisine taxonomy as Home); tapping one MUST switch the entire page's content to that category.
- **FR-012 — Implemented (superseded, see note above)**: The system MUST display a hero banner (photo + label) for the active category, with a "View on map" link that navigates to the Search & Map tab.
- **FR-013 — Implemented (superseded, see note above)**: The system MUST display a "best rated" grid of category items (the cuisine's restaurants sorted by rating desc, top 4), each with photo, an overlaid rating badge, name, cuisine label + price, and an optional discount pill (derived at render time from `priceLevel`, not authored per restaurant — presentation-only, no wire-contract field).
- **FR-014 — Implemented (superseded, see note above)**: The system MUST display a subtype-exploration prompt and a row of subtype options; tapping either opens a placeholder sheet (subtype filtering isn't real).
- **FR-015 — Implemented (superseded, see note above)**: The system MUST display "trending" (sorted by `id` asc, top 4) and "near you" (top 4, with a deterministic mock `distance` per restaurant) grids for the active category, same card shape as FR-013.
- **FR-016 — Implemented (superseded, see note above)**: Tapping any grid card MUST navigate to that restaurant's detail screen — every card is backed by a real `Restaurant` record (see Edge Cases).
- **FR-017**: Tapping the menu icon (≡) MUST open the real navigation sidebar (`auth.md`'s User Story 3) — corrected from the earlier placeholder behavior (see User Story 1's Changelog-noted correction above).
- **FR-018 — Implemented**: On Home, Search & Map, Category page, and Profile, the system MUST display a bottom tab bar with 4 items — Home, Buscar, Categorias, Perfil — each navigating to its respective tab and visually highlighting whichever is active. Structural, cross-feature UI; owned/recorded in `PROJECT.md`'s Folder Structure and ADR log (same cross-reference treatment already used for `SideMenu` pointing at `auth.md`), not redefined per-feature here.
- **FR-019 — Superseded 2026-08-17, rewritten**: no map, no pins. `SearchMapView`/`MapSearchBar`/`MapResultsSheet`/`MapPlaceholder` still exist as unused files (still exported from `features/search/components/index.ts`) but nothing renders them.
- **FR-020 — Superseded 2026-08-17, rewritten**: no bottom sheet. Results render as a single flat `ScrollView` list on the screen itself; a result-count + Sort control sit above it.
- **FR-021 — Corrected 2026-08-17**: each list card MUST display photo, an open-status pill, favorite (heart, real toggle via `useFavoritesStore`) and share (`Alert`, simulated) icons, name, `rating · priceLevel`, `cuisineLabel`, and up to 2 tags — `distance`/`tagline`/review count dropped from the card in the `02e9cb9` redesign; tapping the card MUST navigate to that restaurant's detail screen.
- **FR-022 — Implemented**: the Search screen's search bar MUST be a real (debounced) text input filtering the visible restaurants by name or cuisine label, live as the user types. Home's search bar is not itself an inline filter — tapping it MUST navigate to `/search` instead (`editable={false}` + a wrapping `Pressable`). The restaurant detail screen's own reuse of `SearchBar` also stays non-interactive. *(The Category-page half of this FR's original wording is stale — see FR-011–FR-016's note; Category page no longer exists.)*
- **FR-029 (US2) — Implemented 2026-08-17 (new)**: the Search screen MUST offer a Sort control (Top Rated / Trending / Price: Low to High / Price: High to Low) that reorders the visible list; and a Filters chip that opens a dropdown of 6 entries (Cuisine, Ambient, Occasion, Features, Price, Delivery) — all 6 are decorative (`Alert.alert(label, 'Em breve.')`), none sets a real filter. Real `cuisine`/`occasion`/`ambient`/`delivery` filters exist (`ActiveFilters`, `deliveryOnly`) but are only settable via incoming route params, shown as dismissible chips.
- **FR-030 (US2) — Designed 2026-08-17, Not Started**: the Filters dropdown MUST let the user pick a Cuisine/Occasion/Ambient value from the Search screen itself, not just inherit one via route params. Tapping Cuisine/Ambient/Occasion in the Filters `Modal` MUST drill into that dimension's option list (from `useDiscoveryTaxonomiesQuery`, same source Home already uses), single-select, sourced from the same `ActiveFilters`/`setActiveFilters` state that already backs the incoming-route-param path — picking a value MUST behave identically (same `filteredResults` logic, same dismissible chip) whether it arrived via a route param or was picked here. A back-chevron header returns to the category list without closing the whole menu.
- **FR-031 (US2) — Designed 2026-08-17, Not Started**: Price and Features become real filters. Price: `Restaurant.priceLevel` gets a single-select option list (4 display values), `ActiveFilters` gains `priceLevel?: string`, applied like `cuisine`/`occasion`/`ambient`. Caveat: `src/mocks/restaurants.ts`'s `PRICE` constant only defines `low`/`mid`/`high` — no mock restaurant maps to `$$$$`, so that option is a guaranteed no-op until a real backend populates it. Features: 4 multi-select chips — Vegetarian options (`servesVegetarianFood`), Great for groups (`goodForGroups`), Family friendly (`goodForChildren`), Outdoor seating (`outdoorSeating`) — matches require *all* active flags, backed by 4 new derived booleans on `MapResultData`. Chosen from `GoogleAmenityFieldsSchema`'s 12 fields, excluding 5 hardcoded-`true`-for-every-mock-restaurant fields (would be no-ops) and `reservable`/`allowsDogs`/`liveMusic` (near-duplicates of Price/`outdoorSeating`/too narrow). Caveat: these 4 are themselves derived from `ambient`/`occasion`/`cuisine` today, so a Features pick is partially redundant with those filters under current mock data — acceptable since they read as distinct concrete amenities to a user; a real backend would give independent values.
- **FR-023 (US4) — Designed 2026-08-17, Not Started**: On app open, the system MUST request foreground location permission (`expo-location`) and, if granted, resolve the device's real coordinate into `src/stores/location.ts` with a guarded timeout (known Android hang on `getCurrentPositionAsync` — see sources below) falling back to the existing static coordinate on denial/timeout/error, never blocking any screen.
- **FR-024 (US4) — Designed 2026-08-17, Not Started**: `LocationHeader` MUST display the resolved label (reverse-geocoded via `expo-location`) or a fallback label, and its sheet MUST offer a retry action only when permission was denied.
- **FR-025 (US4) — Implemented (confirmed 2026-08-17)**: Home's rail cards MUST show a tags row (chips) — `HomeRestaurantCard` renders `tags[0]`, derived by `deriveHomeCard`.
- **FR-026 (US5) — Implemented**: The "Categorias" bottom tab and Sidebar item MUST navigate to a Categories Overview screen showing a 2-column grid of every cuisine (photo + label); tapping one MUST navigate to that cuisine's existing Category page (US3).
- **FR-027 (US5) — Implemented**: Home's cuisine rail MUST show two separate links — "view all cuisines" (→ Categories Overview) and "view {cuisine} page" (→ Category page for the active cuisine) — replacing today's single `onViewAll` link.
- **FR-028 (US6) — Implemented**: Home's Occasion rail MUST offer two real navigations, replacing the old simulated-message sheet: "View all occasions" → `/type-overview/occasion` (`TypeOverviewScreen`, a 2-column grid of all `OCCASIONS`), and the rail's own "View more" (next to the active occasion) → `/type/occasion/{id}` (`TypeDetailScreen`/`useTypeDetail`) showing a Champion highlight, a "Champions - Best Rated" grid, two refine-by-taxonomy rows (cuisine, ambient), an "On Fire - Trending" grid, and an "{occasion} Near You" grid. Delivered as a side effect of generalizing US3's Category page into a dimension-agnostic architecture — see US6 for the full reuse story and where this diverges from the original design frame's hero-banner/subtype-row specifics.

### Key Entities

- **Restaurant**: a listable restaurant — name, photo, rating, review count, price range, coordinates (`latitude`/`longitude`), and the 3 classification categories (cuisine/occasion/ambient) used for this feature's filters. Full shape in `src/types/restaurant.ts` (shared with the `restaurant` feature). `latitude`/`longitude`/`reviewCount` added for US2 — genuine, non-contextual Google Places fields, not presentation-only (see Architecture Mapping).
- **Cuisine / Occasion / Ambient**: category taxonomies — id, label, and a visual attribute (photo for cuisine, initial for occasion). Specific to this feature, not shared.
- **Category**: not a separate stored entity — a browsable category page's content (hero photo, three item lists) is derived at render time from `Cuisine` + the existing `Restaurant` list via `useCategoryDiscovery`. Its three item lists (champions/"best rated", trending, near-you) are plain `Restaurant` records (extended with a presentation-only `cuisineLabel`/`discount`/`distance`, see `DiscoveryCardData` in Architecture Mapping) — no separate editorial shape.
- **CategorySubtype — dead code (flagged 2026-08-17)**: `initial`/`label` (e.g. "R"/"Rodízio"), sourced from `discoveryTaxonomies`'s `categorySubtypes` map. The UI that read this (FR-014's subtype row) was removed by the 2026-08-12 `TypeDetailScreen` rewrite — type/schema/mock data still defined, zero consuming reads. `TypeDetailScreen`'s `RefineSection` already does real cross-taxonomy filtering without it.
- **MapResultData** (US2): a `Restaurant` extended with presentation-only `cuisineLabel`/`distance`/`tagline`/`tags`/`isOpenNow`/`hasDelivery`, derived at query time by `useSearchMapDiscovery` (same non-stored-derivation pattern as `DiscoveryCardData`). `distance`/`tagline` are computed but no longer rendered since the `02e9cb9` redesign. **Design addition, not yet implemented (FR-031)**: 4 more derived booleans (`outdoorSeating`, `goodForGroups`, `goodForChildren`, `servesVegetarianFood`), computed in the hook from the same `ambient`/`occasion`/`cuisine` fields, using the same predicates `restaurantDetails.ts`'s amenity builder uses — kept as independent inline expressions (mocks and feature hooks don't import each other).

## Success Criteria

- **SC-001**: The user can see at least 3 filterable restaurant sections without scrolling more than one screen's height.
- **SC-002**: Switching the active category (cuisine/occasion/ambient) updates the displayed rail with no perceptible loading state.
- **SC-003**: From the moment Home opens to reaching a restaurant's detail screen, the user needs at most 1 tap.
- **SC-004**: Switching the active category tab on the category page (US3) updates all four of its sections (hero, best-rated, trending, near-you) with no perceptible loading state — same standard as SC-002.
- **SC-005**: On the Search & Map screen (US2), dragging or tapping the bottom sheet's handle transitions between collapsed/expanded within one spring animation, with no intermediate stuck state.

## Architecture Mapping

- **Feature folder**: `src/features/search/{api,components,hooks,types}` — `stores/` exists as a placeholder but wasn't used (Home's state is local via `useState`, doesn't need to be Zustand or global).
- **Reuses from `src/components/ui/`**: `RestaurantCard`, `HorizontalRail`, `Chip` (used by `AmbientSelector`), `RatingBadge`, `BottomSheet`.
- **Reuses from `src/components/layout/`**: `SearchBar` — real controlled `TextInput` on the Search screen (FR-022); on Home it stays `editable={false}` (wrapped in a `Pressable` navigating to `/search`) and on the restaurant detail screen (no navigation there either); `SideMenu` — **its real content is spec'd and implemented in `auth.md`'s User Story 3**. `search.md` doesn't own or redefine that behavior, just reuses the component.
- **Global state — designed 2026-08-17, Not Started (US4)**: new `src/stores/location.ts` (Zustand) holds `{latitude, longitude, label, status: 'resolved' | 'fallback'}`. Consumers to update: `LocationHeader.tsx` (currently a hardcoded `USER_LOCATION` constant) and `SearchMapView.tsx` (currently imports `MOCK_LOCATION` from `useRestaurantsQuery.ts`, dead code today but should read the store once the map returns). `useRestaurantsQuery.ts`'s exported `MOCK_LOCATION` constant moves into the store as its fallback default and is removed from that file.
- **Types**: `Restaurant` shared (`src/types/restaurant.ts`); `Cuisine`/`Occasion`/`Ambient`/`Benefit` specific (`src/features/search/types/`).
- **Mocks**: `src/mocks/restaurants.ts` (30 places, 6 per cuisine — fixed the pre-existing gap where Indiana/Chinesa had zero mock restaurants), `src/mocks/discoveryTaxonomies.ts` — served over HTTP via `src/mocks/handlers/restaurants.ts` and `discoveryTaxonomies.ts` (MSW). **Corrected**: `useRestaurantsQuery` no longer calls a bare custom endpoint — it speaks the Google Places API (New) Nearby Search contract (`POST .../places:searchNearby`, `{ places: [...] }` response, two-hop photo resolution), normalized to the unchanged `Restaurant` shape at the hook boundary. Full rationale and the wire-vs-domain-type split in `PROJECT.md`'s ADR log. `useDiscoveryTaxonomiesQuery` is unaffected — taxonomies aren't part of Google's contract, still `apiClient.get('/discovery-taxonomies')` against the app's own mock base URL.
- **New dependency, designed 2026-08-17, not installed yet (US4)**: `expo-location` — `requestForegroundPermissionsAsync`, `getCurrentPositionAsync` (guard with a timeout; known to hang indefinitely on some Android devices per Expo's own GitHub issues #33981/#39851), `reverseGeocodeAsync` for the display label.
- **New dependencies**: `zod` and `msw` (added when the MSW/testing infrastructure round touched every existing `api/` hook, not specific to this feature — see `PROJECT.md`). US2 (Search & Map) already had `react-native-maps` installed ahead of time (decision recorded in `PROJECT.md`); `react-native-gesture-handler`/`react-native-reanimated` were also already installed but had zero real usage until US2 — see below. US3 (category page) needed none.
- **`DiscoveryCard`** (`features/search/components/DiscoveryCard.tsx`) — **Implemented**: the category page's grid card (rating badge overlaid on the photo, optional discount pill, grid layout), visually distinct enough from `RestaurantCard` (rail-context card, rating below photo, no overlay/discount) to warrant its own component. Lives in `features/search/components/`, not `components/ui/` — corrected from the earlier proposal to promote it to shared, since only `search` needs it right now (Architecture Principle #3: promote to shared only when a second feature actually needs it). `CategoryTabsRow` reuses the existing `Chip` directly, no new primitive needed there.
- **Route for US3**: a fixed tab route, `app/(tabs)/category.tsx`, no dynamic segment — **corrected**: previously guessed as `app/category/[id].tsx` matching `app/restaurant/[id].tsx`'s pattern, but the design's new bottom tab bar (see Edge Cases and `PROJECT.md`'s ADR log) links straight to the category page with no id. Switching category (Pizza/Churrasco/Indiana) happens *inside* the page via its own in-page tabs, already covered by FR-011/US3 scenario 2 — that's state, not routing.
- **Mocks for US3 — Implemented**: no new mock file. `src/mocks/discoveryTaxonomies.ts` extended with `CATEGORY_SUBTYPES` (3 per cuisine, 15 total), served via the existing `discoveryTaxonomies` handler's response. Champions/trending/near-you need no new mock data at all — derived client-side from the existing `useRestaurantsQuery` result inside `useCategoryDiscovery.ts`.
- **US2 (Search & Map) — Superseded 2026-08-17, kept as historical record**: `features/search/components/`: `SearchMapView.tsx` (native `MapView` + `Marker`) with a `SearchMapView.web.tsx` sibling (Metro's platform-extension resolution, `react-native-maps` has no web renderer); `MapSearchBar.tsx` (floating pill, first use of `react-native-safe-area-context`); `MapResultsSheet.tsx` (draggable two-snap-point panel, first use of `react-native-gesture-handler`/`reanimated` beyond the root wrapper); `MapResultCard.tsx`.
- **US2 rebuilt (2026-08-12, commit `02e9cb9`) — current state**: `app/(tabs)/search.tsx` no longer composes `SearchMapView`/`MapSearchBar`/`MapResultsSheet` (all 3 still exist, still exported from `features/search/components/index.ts`, zero renders — same for `MapPlaceholder`). Replaced by an inline header (back button, real search `TextInput`, profile icon), a result-count + Sort control, a Filters chip, dismissible filter chips, and a plain `ScrollView` of `MapResultCard`. Sort/Filters dropdowns are plain RN `Modal`s anchored via `measureInWindow`, not `react-native-gesture-handler`/`reanimated` — those libraries have no remaining use on this screen. New local state: `ActiveFilters` (`cuisine`/`occasion`/`ambient`) + `deliveryOnly`, seeded once from route params, filtered client-side against `MapResultData`; the Filters dropdown's 6 entries don't write to this state (see US2's Filters note). `MapResultCard` redesigned (favorite/share icon overlay via `useFavoritesStore`, dropped `distance`/`tagline`/review count from the visible card).
- **New hook `useSearchMapDiscovery`** (`features/search/hooks/`): mirrors `useCategoryDiscovery`'s existing "derive presentation fields at query time, don't store them" pattern — produces `MapResultData[]` (see Key Entities) from the same `useRestaurantsQuery`/`useDiscoveryTaxonomiesQuery` pair `useCategoryDiscovery` already uses, no new fetch.
- **Wire contract + core type changes for US2**: `GooglePlaceSchema` (`src/lib/googlePlaces/schema.ts`) gained `location: { latitude, longitude }` — a genuine Google Places field that was simply never modeled before US2 needed it. `RestaurantSchema` (`src/types/restaurant.ts`) gained `latitude`/`longitude`/`reviewCount` — promoted to the core type rather than kept feature-local, since (unlike `distance`/`tagline`/`tags`/`isOpenNow`) they're stable facts about the place itself, not viewer-relative or presentational. `mapPlaceToRestaurant` (`src/lib/googlePlaces/mappers.ts`) and all 30 entries in `src/mocks/restaurants.ts` updated accordingly (`useRestaurantsQuery`'s `MOCK_LOCATION` constant exported for reuse as the map's initial region, since it's the same "current user" coordinate).
- **FR-022 (real search filtering) — Implemented**: `useRestaurantsQuery` takes an optional `query` param and POSTs to `places:searchText` instead of `places:searchNearby` when non-empty — Google's Nearby Search has no free-text support, so this mirrors a genuinely separate real endpoint. New MSW handler filters the mock array case-insensitively by name/cuisine label. Added `placeholderData: keepPreviousData` so each debounced keystroke updates the list in place instead of flashing `isLoading`. New `useDebouncedValue` hook (~300ms). `SearchBar`/`MapSearchBar` became real controlled `TextInput`s. `useHomeDiscovery` does NOT take a `searchQuery` param — Home's search bar navigates to `/search` on tap instead.

## Out of Scope

- ~~Real text search~~ — **superseded** (2026-07-29): `SearchBar`/`MapSearchBar` now really filter by name/cuisine, see FR-022. Still out of scope: voice search, and any filter beyond name/cuisine text matching.
- ~~Real side menu content~~ — **corrected**: the side menu now has real content, spec'd in `auth.md`. What's still out of scope: the location popup, still a simulated-message sheet. *(Dine-in/Bars/Takeout no longer exist at all — see User Story 1.)*
- ~~Favorite state on Home cards~~ — **superseded (confirmed 2026-08-17)**: both `HomeRestaurantCard` and `MapResultCard` now have a real favorite toggle via `useFavoritesStore`.
- ~~Real geolocation~~ — **superseded 2026-08-17**: US4 now designs the real thing (see Architecture Mapping), not built yet. `distance` values stay relative to whatever `src/stores/location.ts` currently holds, real or fallback.
- Real subtype filtering on the category page (US3) — out of this pass's scope, see US3's own stale-flag note.
- **Any map on the Search screen (US2)** — removed 2026-08-12, see User Story 2's Map note. The dev-build/AVD-testing gap this bullet used to describe no longer applies to a screen that has no map.
- A working Filters dropdown on the Search screen (US2) — all 6 entries are decorative (`Alert`), see User Story 2's Filters note.

## Assumptions and Dependencies

- User location is a static mock (`"Sheetal Park"`) — doesn't reflect the device's real geolocation.
- Photos come from remote Unsplash URLs, no local asset bundling.
- ~~Home icons use emoji, not `react-native-svg`/`@expo/vector-icons`~~ — **superseded**: all emoji were replaced with `@expo/vector-icons` app-wide (see `PROJECT.md`'s ADR log).
- Depends on `app/restaurant/[id]` existing as a route (it does, still a placeholder — its own spec belongs to the `restaurant` feature).
- **Resolved**: the design's bottom tab bar (see Edge Cases) settles what was previously an open question here — `explore` (currently an empty placeholder) hosts US2 (Search & Map) only, renamed to the **Buscar** tab; US3 (Category page) gets its own new **Categorias** tab, not a sub-destination of `explore`. This is a naming/routing decision recorded now; the actual rename of `explore.tsx`, the new `category.tsx` route file, and the `app/(tabs)/_layout.tsx` update are implementation, deferred to whichever of US2/US3 is built first.
- **US2 dev-build/map history — moot since 2026-08-12**: `react-native-maps` is still installed and `SearchMapView`(`.web`)/`MapPlaceholder` still exist, but `app/(tabs)/search.tsx` no longer renders any of them (see User Story 2's Map note) — the AVD/API-key gap this used to describe doesn't block anything reachable today. **`react-native-maps` swap designed 2026-08-17, not yet implemented**: `SearchMapView`/`SearchMapView.web` migrate to `@maplibre/maplibre-react-native` (OSM tiles, no API key) — see the new Edge Cases entry above. `react-native-maps` itself isn't removed from `package.json` by this pass (nothing else in the codebase imports it, but that's a cleanup decision left to whoever actually re-wires the component, not this design pass).

## Notes for the AI Agent

- Verification: `npx tsc --noEmit` clean + bundle smoke test (route `/`, `search` tab, `/type/[dimension]/[id]` and `/type-overview/[dimension]` deep links, across web/ios/android per `CLAUDE.md`'s bundle-check recipe).
- Picking `SearchMapView`/`MapResultsSheet` back up would mean re-wiring them into `app/(tabs)/search.tsx` from scratch, not just un-commenting — `02e9cb9` removed the call sites, not just visually hid them.

## Changelog

| Date | Change |
|------|--------|
| 2026-07-23 | Spec created retroactively for US1 (Home, already implemented). US2 recorded pending. |
| 2026-07-23 | Migrated `useRestaurantsQuery`/`useDiscoveryTaxonomiesQuery` from direct mock import to `apiClient` + MSW. |
| 2026-07-23 | Design added US3 (Category page), not started. |
| 2026-07-23 | Design added the real bottom tab bar (Home/Buscar/Categorias/Perfil); new FR-018. Code not yet updated. |
| 2026-07-23 | Corrected US1: menu icon (≡) opens the real sidebar (`auth.md` US3), not a simulated sheet. |
| 2026-07-23 | Resolved tab-bar gap: Search & Map gets the tab bar too, reached by normal tab switch. |
| 2026-07-23 | FR-018 implemented (`feat/bottom-tab-bar`) — real 4-tab `_layout.tsx`. `search.tsx`/`category.tsx` still placeholders. |
| 2026-07-24 | Mock expanded to 30 restaurants (6/cuisine); wire contract rebuilt to mirror Google Places API (New) end-to-end. |
| 2026-07-24 | US3 implemented (`feat/category-page`): category tabs reuse Home's taxonomy, champions/trending/near-you derived via new `useCategoryDiscovery`, cuisine "view all" now real navigation. New `DiscoveryCard`/`CategoryTabsRow`/`SubtypeRow`. FR-011–FR-016 Implemented. |
| 2026-07-29 | US2 implemented (`feat/sidebar-auth`): map/pins/draggable list real, search bar stays decorative. `location`/`reviewCount` added to the wire contract and core `Restaurant` type. New `SearchMapView`(`.web`)/`MapSearchBar`/`MapResultsSheet`/`MapResultCard`. First use of `react-native-gesture-handler`/`reanimated`/`safe-area-context`. No dev build/AVD created this round — native map untested on device. FR-010, FR-019–FR-021 Implemented. |
| 2026-07-29 | Emoji icons replaced with `@expo/vector-icons` app-wide (see PROJECT.md). |
| 2026-07-29 | Reversed FR-010: `SearchBar`/`MapSearchBar` on Home/Category/Search&Map became real debounced filters. New `places:searchText` mock endpoint (mirrors Google's real API split, not a shortcut). New FR-022, `useDebouncedValue` hook. |
| 2026-07-29 | Corrected FR-022: Home's search bar reverts to a tap target → `/search`, doesn't filter in place. |
| 2026-07-29 | `MapResultsSheet` auto-expands when a search query is active (FR-020). |
| 2026-07-29 | Design-only pass (nothing implemented): added US4 (address management), US5 (Categories Overview), US6 (Occasion page). New FR-023–FR-028, all Not Started. |
| 2026-08-06 | US5 implemented: `category.tsx` now a cuisine grid; per-cuisine content moved to `app/category/[cuisine].tsx`. `RestaurantSection` gained dual view-all links (FR-027). FR-026/FR-027 Implemented. |
| 2026-08-12 | US3's Category page generalized into a dimension-agnostic `TypeDetailScreen`/`TypeOverviewScreen` (`d2bb1c6`, `e1d90b7`), replacing `useCategoryDiscovery`/`DiscoveryCard`/`CategoryTabsRow`/`SubtypeRow`/`app/category/[cuisine].tsx`. Not recorded in this spec until caught retroactively 2026-08-17. |
| 2026-08-17 | Found US6 (Occasion page) already shipped as a byproduct of the 2026-08-12 refactor — rewrote its Acceptance Scenarios/Status against actual `TypeDetailScreen` behavior. FR-028 Implemented. Flagged (not fixed): US3's own Acceptance Scenarios/FR-011–016/Architecture Mapping still describe the deleted pre-refactor components. |
| 2026-08-17 | Rewrote US1/US2 against shipped code (`02e9cb9`, `f85e4e3`, `bebeca5`): map removed from Search (now a plain filterable list, old map components unused dead code); Dine-in/Bars/Takeout and the benefits grid confirmed gone (FR-008/009 Removed); Best Deliveries rail really filters by `hasDelivery` (FR-006); Filters dropdown confirmed all-decorative except route-param-seeded taxonomy filters. New FR-029. |
| 2026-08-17 | Designed two pending gaps: real filter-picking for Cuisine/Occasion/Ambient/Price/Features in the Search screen (FR-030/031); US4 superseded — dropped saved-address list for GPS-only geolocation (`expo-location`, `src/stores/location.ts`). |
