# Feature Specification: Restaurant (detail)

**Feature**: `restaurant` — folder `src/features/restaurant/`
**Created**: 2026-07-23
**Status**: Implemented — User Stories 1–7, now against real `dine-out-backend-overture` data. Description, amenities, opening hours, and reviews sections have no backend field yet and render as correctly-empty/hidden — see 2026-08-26 Changelog entry and `PROJECT.md`'s decision log
**Design reference**: `App Flow.dc.html`, frame "2 · Restaurant Detail"

## Summary

The screen a user lands on after tapping a restaurant anywhere in the app. Shows what the place is, whether it fits the occasion, and what to do next: see the menu, order delivery, reserve a table, or save it for later.

## User Stories

### User Story 1 - View core restaurant details (Priority: P1) — Implemented

A user who tapped a restaurant card sees a photo gallery, the restaurant's name, a description, defining tags, and the essentials (address, price level, rating) needed to judge fit at a glance.

**Independent test**: navigate to `/restaurant/1`, confirm name/description/tags/address/price/rating render from mock data, swipe or tap through the photo gallery, confirm the photo counter updates.

**Acceptance scenarios**:

1. **Given** the user navigates to `/restaurant/[id]`, **when** the screen loads, **then** it shows that restaurant's name, description, tags, address, price level, and rating.
2. **Given** the restaurant has multiple photos, **when** the user taps the next/previous controls, **then** the displayed photo changes and the counter (e.g. "2/3") updates to match.
3. **Given** a description longer than the truncation threshold, **when** the screen first renders, **then** the description shows truncated with a "see more" affordance; tapping it expands to the full text and flips the affordance to "see less."
4. **Given** the user taps the back control, **when** a previous screen exists, **then** the app returns to it; **when** none exists (`router.canGoBack()` is `false`), **then** it navigates to Home.
5. **Given** the photo gallery header, **when** it renders, **then** it shows a share icon and a like/favorite icon (User Story 7).

---

### User Story 2 - Take a quick action on the restaurant (Priority: P1) — Implemented

A user who has decided this restaurant is worth pursuing can see the menu, order takeaway or delivery, or reserve a table, without leaving the app.

**Independent test**: on `/restaurant/[id]`, tap each of Menu/Takeaway/Delivery/Reserve independently, confirm each opens its own sheet with the right content, and confirm closing one doesn't affect the others.

**Acceptance scenarios**:

1. **Given** the detail screen, **when** the user taps "Menu," **then** a sheet opens listing menu items with prices.
2. **Given** the detail screen, **when** the user taps "Takeaway," **then** a sheet opens with delivery-partner options that simulate a redirect.
3. **Given** the detail screen, **when** the user taps "Delivery," **then** a sheet opens with delivery-app options that simulate a redirect.
4. **Given** the detail screen, **when** the user taps "Reserve," **then** a sheet opens with a reservation confirmation action that simulates completing a booking.
5. **Given** any of the four sheets is open, **when** the user taps outside it or its close control, **then** it closes without affecting the underlying screen's state.

---

### User Story 3 - See practical info before committing (Priority: P2) — Implemented

A user weighing whether to go can check what the place offers, when it's open, and any rules that might affect their visit.

**Independent test**: on `/restaurant/[id]`, confirm the amenities preview shows a subset with a "show all" control that opens the full list in a sheet; tap "Opening Hours," confirm a 7-day schedule renders.

**Acceptance scenarios**:

1. **Given** the detail screen, **when** it renders, **then** a preview of amenities (icon + label) shows, capped at a small number, with a control to see the full list.
2. **Given** the amenities preview, **when** the user taps "show all N amenities," **then** a sheet opens listing every amenity.
3. **Given** the detail screen, **when** the user taps "Opening Hours," **then** a sheet opens showing hours for every day of the week.
4. **Given** the detail screen, **when** it renders, **then** a "Things to know" section shows title+text pairs without requiring a tap.
5. **Given** the detail screen, **when** it renders, **then** a tappable address opens a sheet offering to open the location in a maps app.
6. **Given** the detail screen, **when** it renders, **then** a "Contact & socials" section shows every phone, WhatsApp, Instagram, website, and social link inline as its own row, each simulating a redirect on tap — no sheet required.

---

### User Story 4 - See reviews and highlights (Priority: P2) — Implemented

A user checks social proof — what other people say, and the standout qualities other diners flagged — before deciding.

**Independent test**: confirm one review preview renders with a "view all N reviews" control that opens the full list in a sheet; confirm the highlights row renders independent of the reviews section.

**Acceptance scenarios**:

1. **Given** the detail screen, **when** it renders, **then** the overall rating and one preview review (reviewer, time, star rating, text) show.
2. **Given** the review preview, **when** the user taps "view all N reviews," **then** a sheet opens listing every review.
3. **Given** the detail screen, **when** it renders, **then** a row of highlight badges shows without requiring interaction.
4. **Given** a restaurant with zero reviews, **when** the screen renders, **then** the reviews section shows a visible empty state (icon, "No reviews yet," muted subtext) and a non-functional "Add a review" control that shows a "Coming soon" alert on tap.

---

### User Story 5 - Browse the restaurant's Instagram (Priority: P3) — Implemented

A user curious about the vibe can see a preview of the restaurant's Instagram grid and toggle following it.

**Independent test**: confirm the Instagram handle and a photo grid render; tap "Follow," confirm the label flips to "Following" and back on a second tap.

**Acceptance scenarios**:

1. **Given** the detail screen, **when** it renders, **then** the restaurant's Instagram handle and a grid of preview photos show.
2. **Given** the Instagram section, **when** the user taps "Follow," **then** the button's label and style change to "Following"; tapping again reverts it. Local UI state only, no real Instagram integration.

---

### User Story 6 - Discover similar restaurants (Priority: P3) — Implemented

A user who isn't fully sold sees other restaurants like this one.

**Independent test**: confirm a "Similar Places" rail renders with restaurant cards; tap one, confirm the app navigates to that restaurant's own detail screen.

**Acceptance scenarios**:

1. **Given** the detail screen, **when** it renders, **then** a "Similar Places" rail shows other restaurants of the same cuisine as cards (photo, name, rating, price).
2. **Given** the Similar Places rail, **when** the user taps a card, **then** the app navigates to `/restaurant/[that restaurant's id]`, replacing the current screen.

---

### User Story 7 - Favorite a restaurant from its detail screen (Priority: P2) — Implemented

A user can mark a restaurant as a favorite, or remove it, directly from the detail screen.

**Independent test**: tap the heart/like icon, confirm it switches to the favorited visual state; confirm the same restaurant now appears in the Profile favorites rail (`favorites.md`); tap again, confirm both places reflect the removal.

**Acceptance scenarios**:

1. **Given** a restaurant not yet favorited, **when** the user taps the like icon, **then** it switches to its filled state and the restaurant is added to the global favorites store (contract owned by `favorites.md`).
2. **Given** a restaurant already favorited, **when** the user taps the like icon, **then** it reverts to its outline state and the restaurant is removed from the global favorites store.
3. **Given** the user navigates away and back to the same restaurant, **when** the detail screen re-renders, **then** the like icon reflects the current favorited state.

---

### Edge Cases

- Restaurant id doesn't exist in mock data: renders a "not found" message instead of crashing.
- No previous screen to go back to: back checks `router.canGoBack()` first, falls back to Home.
- Description shorter than the truncation threshold: "see more" doesn't render.
- Zero reviews: the reviews section renders a visible empty state with a non-functional "Add a review" control instead of hiding.
- Single photo: next/previous controls and counter hide or disable.
- Amenities list shorter than the preview cap: the "show all N amenities" control doesn't render.
- Rapid double-tap on the like icon: final state matches the actual number of taps, no desync from the global store.

## Functional Requirements

- **FR-001**: The system MUST display, for the restaurant matching the route's `id`, its name, description, tags, address, price level, and rating.
- **FR-002**: The system MUST display a photo gallery with next/previous navigation and a position counter, when the restaurant has more than one photo.
- **FR-003**: The system MUST truncate long descriptions with a "see more" affordance that expands to the full text on tap, and collapses again on a second tap.
- **FR-004**: The user MUST be able to navigate back to the previous screen; if none exists, back MUST navigate to Home.
- **FR-005**: The system MUST provide four quick actions — Menu, Takeaway, Delivery, Reserve — each opening a sheet with its own content.
- **FR-006**: The Menu sheet MUST list menu items with their prices.
- **FR-007**: The Takeaway and Delivery sheets MUST list simulated redirect options to third-party services.
- **FR-008**: The Reserve sheet MUST provide a single confirmation action that simulates completing a reservation.
- **FR-009**: The system MUST display a capped preview of amenities with an option to view the full list.
- **FR-010**: The system MUST display the restaurant's opening hours for all seven days of the week on request.
- **FR-011**: The system MUST display a "Things to know" section without requiring a tap.
- **FR-012**: The system MUST display the overall rating and one preview review, with an option to view all reviews.
- **FR-013**: The system MUST display a row of highlight badges.
- **FR-014**: The system MUST display the restaurant's Instagram handle, a preview photo grid, and a toggleable Follow/Following control — local UI state only.
- **FR-015**: The system MUST display a "Similar Places" rail; tapping an entry MUST navigate to that restaurant's own detail screen, replacing the current screen (`router.replace`).
- **FR-016**: The user MUST be able to toggle a restaurant's favorited state from the detail screen, reading and writing the shared favorites store defined in `favorites.md`.
- **FR-017**: The system MUST display contact options (every phone number, WhatsApp, Instagram, every website, every social link) inline on the detail screen as individual rows, no sheet required, each simulating a redirect on tap. Social links show a human platform label (e.g. "Facebook"), not the raw URL.
- **FR-020**: The system MUST display a visible empty state (icon + "No reviews yet" + a non-functional "Add a review" control) when a restaurant has zero reviews, in place of hiding the section.
- **FR-021**: The system MUST display the restaurant's own category and any alternate categories as a humanized chip row (`snake_case` → `Title Case`), visually distinct from owner-authored tags.
- **FR-022**: The system MUST display a "Part of {brandName}" badge near the restaurant name when the restaurant has a non-null `brandName`.
- **FR-018**: The system MUST display a tappable address that opens a sheet offering to open the location in a maps app.
- **FR-019**: The system MUST display a share icon over the photo gallery that shows simulated share feedback on tap.

### Key Entities

- **RestaurantDetail**: extends the base `Restaurant` shape with `photos` (gallery), `description`, `tags`, `category`, `categoryAlternates`, `brandName`, `addressShort`, `reviewCount`, `amenities`, `highlights`, `thingsToKnow`, `instagramHandle`, `reviews`, `openingHours`, `phones`, `whatsapp`, `websites`, `socialLinks`.
- **MenuItem**: name, price (display string, not a structured currency amount).
- **Review**: reviewer name, relative time, star rating, text.
- **Amenity**: an icon + label pair.
- **ThingToKnow**: a title + text pair.
- **OpeningHours**: a day + hours-range pair, one per day of the week.

## Success Criteria

- **SC-001**: From tapping a restaurant card to seeing its name, photo, and rating on the detail screen, there is no perceptible loading state.
- **SC-002**: A user can reach any of the four quick actions in exactly 1 tap from the detail screen.
- **SC-003**: Favoriting a restaurant and opening Profile shows it in the favorites rail with no manual refresh.
- **SC-004**: Tapping through the entire photo gallery and back never shows an incorrect counter value.

## Architecture Mapping

- **Feature folder**: `src/features/restaurant/{api,components,hooks,types}`. No `stores/` — the one piece of cross-screen state this feature touches (favorited) is global, owned by `favorites.md`.
- **Shared `src/components/ui/` component**: `PhotoCarousel` (gallery with next/previous + counter).
- **US3 components** (`features/restaurant/components/`): `InfoActionsRow` (Contact & socials section, renders every phone/WhatsApp/Instagram/website/social-link row inline, no sheet — `Alert.alert('Demo', ...)` directly on tap, mirrors `InstagramSection`'s inline-redirect pattern rather than reusing `RedirectOptionsSheetContent`), `OpeningHoursSheetContent`, `AmenitiesSection` + `AmenitiesSheetContent`, `ThingsToKnowSection` (always visible, no sheet).
- **US4 components**: `ReviewsSection` (rating header, preview review, "view all N reviews" trigger; renders a visible empty state + non-functional "Add a review" control when `reviews.length === 0`) + `ReviewsSheetContent`, `HighlightsRow` (always visible, no sheet).
- **US5 component**: `InstagramSection` — handle, Follow/Following toggle (local `useState`), 3-column photo grid.
- **Reuses from `src/components/ui/`**: `RestaurantCard`, `HorizontalRail` (Similar Places rail), `BottomSheet` (every quick-action and info sheet), `RatingBadge`.
- **US6**: `app/restaurant/[id].tsx` reuses `useRestaurantsQuery` (from `features/search/api`) and filters client-side by cuisine, excluding the current id, capped at 3 — route-level composition, not a feature-to-feature import. `SimilarPlacesSection` returns `null` if zero candidates.
- **Reuses from `src/components/layout/`**: `SearchBar`, overlaid on the photo gallery. Does not reuse `SideMenu` — this screen's header icon stack (share, favorite) is screen-specific, built in `DetailHeaderActions.tsx`.
- **Global state**: reads and writes `src/stores/favorites.ts` (contract defined in `favorites.md`) for User Story 7.
- **Types**: `RestaurantDetail`, `MenuItem`, `Review`, `Amenity`, `ThingToKnow`, `OpeningHours` in `src/features/restaurant/types/`. `RestaurantDetail` extends the shared `Restaurant` from `src/types/restaurant.ts`.
- **Mocks**: `src/mocks/restaurantDetails.ts`, keyed by place id, composed from `src/mocks/restaurants.ts`'s 30 base places plus detail-only fields. `useRestaurantDetailQuery(id)` calls the Google Places API (New) Place Details contract, resolves photo references through the same two-hop flow as the list, normalizes to `RestaurantDetailSchema`.
- **US3 wire contract**: `regularOpeningHours.weekdayDescriptions`, `internationalPhoneNumber`, curated Google boolean amenity fields, mapped to `Amenity` icon+label pairs via a presentation-only lookup table. `whatsapp`/`instagramHandle`/`thingsToKnow` stay custom.
- **US4 wire contract**: Google's `reviews[]` maps 1:1 to `Review`. `highlights` stays custom.
- **US5**: Instagram has no Google Places equivalent — `instagramPhotos` (plain URLs) is fully custom.
- **Category/contact labeling**: `src/features/restaurant/lib/labels.ts` — `humanizeCategory` (`snake_case` → `Title Case`, mirrors the backend's own `humanizeCategory()` in `dine-out-backend-overture/src/restaurants/taxonomies.data.ts`), `getSocialLinkLabel`/`getSocialLinkIcon` (hostname → platform name/icon, `facebook.com`/`instagram.com` mapped explicitly, else bare hostname), `getWebsiteLabel` (bare hostname).
- **New dependencies**: `zod`. `PhotoCarousel` uses a plain `ScrollView` and local state, no third-party carousel library.

## Out of Scope

- Real menu ordering / checkout flow — Menu is read-only, Takeaway/Delivery are simulated redirects.
- A real reservation system — Reserve is a single simulated confirmation.
- Real Instagram API/OAuth integration.
- Writing or submitting new reviews.
- Real distance-to-user calculation (depends on `src/stores/location.ts`, not yet implemented).
- A map preview on this screen (`search.md`).

## Assumptions and Dependencies

- All navigation sources always pass a valid, known restaurant `id`.
- Menu prices are display strings, not structured currency values.
- Depends on `src/stores/favorites.ts` (`favorites.md`) and `app/restaurant/[id]` existing as a route.

## Notes for the AI Agent

- Verification: `npx tsc --noEmit` clean + bundle smoke test on `/restaurant/1` across web/iOS/Android.

## Changelog

| Date | Change |
|------|--------|
| 2026-07-23 | Spec created. US1+US2 implemented (mock: `src/mocks/restaurantDetails.ts`, 6 restaurants). New shared `PhotoCarousel`. |
| 2026-07-24 | Mock expanded to 30 restaurants; wire contract rebuilt to mirror Google Places API (New) Place Details. |
| 2026-07-24 | US3 implemented (amenities, opening hours, things to know, contact sheet, tappable address). New `InfoActionsRow`, `OpeningHoursSheetContent`, `AmenitiesSection`/`AmenitiesSheetContent`, `ThingsToKnowSection`. |
| 2026-07-24 | US4 implemented (reviews, highlights). New `ReviewsSection`/`ReviewsSheetContent`, `HighlightsRow`. `reviewCount` mapped to Google's `userRatingCount`. |
| 2026-07-24 | US5 implemented (Instagram handle, photo grid, Follow toggle). New `InstagramSection`. |
| 2026-07-24 | US6 implemented (Similar Places rail). New `SimilarPlacesSection`. |
| 2026-07-24 | Fixed a `GO_BACK`-not-handled crash on hard refresh: back control now checks `router.canGoBack()` first, falls back to Home. |
| 2026-08-12 | `feat/restaurant-detail-redesign` (`e3da6e0`) implemented US7 (like icon, `DetailHeaderActions.tsx`) and removed the header's location/settings/profile icons, leaving share + favorite only. |
| 2026-08-17 | Spec corrected to match shipped code — US7 marked Implemented, removed FRs for the location/settings/profile icons. |
| 2026-08-18 | Rewritten for tone — narrative/historical framing removed from body sections, consolidated into this Changelog. |
| 2026-08-26 | Wired to the real `dine-out-backend-overture` API (`feat/wire-real-backend`). `src/lib/googlePlaces/` replaced with `src/lib/api/`. The real backend has no rating, price level, photos, amenity flags, opening hours, editorial description, or reviews — `AmenitiesSection`/`AmenitiesSheetContent`/`OpeningHoursSheetContent` deleted, the description block removed from `app/restaurant/[id].tsx`, `InstagramSection`/`InfoActionsRow` made null-tolerant. US1's description/price/rating acceptance scenarios and US3's amenities/opening-hours scenarios are stale pending a fuller spec rewrite — the *screen* still renders correctly (empty states), but the FR text below still describes the old mock-only behavior. |
| 2026-08-26 | `ReviewsSection` now renders a visible empty state ("No reviews yet" + non-functional "Add a review" control) instead of returning `null` for zero reviews (FR-020). Surfaced previously-fetched-but-unused wire fields: `phones[]` (was `phones[0]` only), `websites[]`, `socialLinks[]` added to `InfoActionsRow`'s contact sheet with hostname-derived social labels (FR-017); `category`/`categoryAlternates` rendered as a humanized chip row distinct from owner-authored `tags` (FR-021); `brandName` rendered as a "Part of {brandName}" badge (FR-022). New `src/features/restaurant/lib/labels.ts`. No new API calls — same `getPlaceDetails` response, just threaded further into `RestaurantDetailSchema`/`useRestaurantDetailQuery`. |
| 2026-08-26 | `InfoActionsRow` no longer opens a sheet: contact & socials now render inline on the detail screen as individual rows (icon + label), each still simulating a redirect via `Alert.alert('Demo', ...)` on tap. Removes the `BottomSheet`/`RedirectOptionsSheetContent` dependency from this component (FR-017 updated). |
