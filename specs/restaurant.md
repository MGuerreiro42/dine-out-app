# Feature Specification: Restaurant (detail)

**Feature**: `restaurant` — folder `src/features/restaurant/`
**Created**: 2026-07-23
**Status**: Implemented — User Stories 1–7, now against real `dine-out-backend-overture` data. Description, amenities, opening hours, and price still have no backend field and render as correctly-empty/hidden — see 2026-08-26 Changelog entry and `PROJECT.md`'s decision log. Reviews and rating are real again as of 2026-08-31, first-party this time (`reviews.md`), not Google-sourced. As of 2026-09-02: the share icon is removed, and Contact & socials is four fixed cards on-screen instead of a sheet — live-testing feedback, canonical design canvas not yet updated to match. As of 2026-10-05: contact cards, the Instagram button, the address, and Takeaway/Delivery open real external links (`deliveryLinks`, `whatsappUrl` from `dine-out-backend`); Reserve stays disabled. Verified on a physical Android device; iOS pending. Takeaway/Delivery confirm before opening when a resolved location is more than 15 km away (FR-024).
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
5. **Given** the photo gallery header, **when** it renders, **then** it shows a like/favorite icon (User Story 7). No share icon — see 2026-09-02 Changelog entry.

---

### User Story 2 - Take a quick action on the restaurant (Priority: P1) — Implemented

A user who has decided this restaurant is worth pursuing can see the menu, when one exists, and order through the restaurant's delivery platforms, when it lists any. Reserve stays disabled: no reservation system exists.

**Independent test**: on `/restaurant/[id]`, Menu is enabled only with menu items; Takeaway/Delivery are enabled only with at least one delivery link; Reserve is always disabled. One delivery link opens directly; several open a platform sheet. Tapping a disabled action does nothing.

**Acceptance scenarios**:

1. **Given** the detail screen, **when** the restaurant has at least one menu item, **then** "Menu" renders enabled and tapping it opens a sheet listing items with prices.
2. **Given** the detail screen, **when** the restaurant has no menu items, **then** "Menu" renders disabled and does not respond to a tap.
3. **Given** the detail screen, **when** it renders, **then** "Reserve" always renders disabled, regardless of restaurant.
4. **Given** the Menu sheet is open, **when** the user taps outside it or its close control, **then** it closes without affecting the underlying screen's state.
5. **Given** a restaurant with no delivery links, **when** the screen renders, **then** "Takeaway" and "Delivery" render disabled.
6. **Given** a restaurant with exactly one delivery link, **when** the user taps "Takeaway" or "Delivery," **then** that link opens in the platform's app or browser.
7. **Given** a restaurant with several delivery links, **when** the user taps "Takeaway" or "Delivery," **then** a sheet lists the platforms by name; tapping one opens its link and closes the sheet.
8. **Given** a link no installed app can open, **when** the user taps it, **then** an alert reports that it couldn't be opened.
9. **Given** a resolved (GPS or manual) location more than 15 km from the restaurant, **when** the user taps "Takeaway" or "Delivery," **then** an alert states the distance and offers "Cancel" (opens nothing) and "Open anyway" (continues the delivery flow); with a fallback or denied location, no alert is shown.

---

### User Story 3 - See practical info before committing (Priority: P2) — Implemented

A user weighing whether to go can check what the place offers, when it's open, and any rules that might affect their visit.

**Independent test**: on `/restaurant/[id]`, confirm the amenities preview shows a subset with a "show all" control that opens the full list in a sheet; tap "Opening Hours," confirm a 7-day schedule renders.

**Acceptance scenarios**:

1. **Given** the detail screen, **when** it renders, **then** a preview of amenities (icon + label) shows, capped at a small number, with a control to see the full list.
2. **Given** the amenities preview, **when** the user taps "show all N amenities," **then** a sheet opens listing every amenity.
3. **Given** the detail screen, **when** the user taps "Opening Hours," **then** a sheet opens showing hours for every day of the week.
4. **Given** the detail screen, **when** it renders, **then** a "Things to know" section shows title+text pairs without requiring a tap.
5. **Given** the detail screen on Android, **when** the user taps the address, **then** a `geo:` link opens the OS app chooser for maps apps.
6. **Given** the detail screen on iOS, **when** the user taps the address, **then** a sheet lists Apple Maps plus each installed supported app (Google Maps, Waze); with Apple Maps as the only option, it opens directly.
7. **Given** the detail screen on web, **when** the user taps the address, **then** a Google Maps search opens in the browser.
8. **Given** the detail screen, **when** it renders, **then** a "How to reach them" section shows four cards directly on the screen — Phone, Website, Social, WhatsApp; tapping a card with data opens its target (dialer, browser, Instagram/social link, WhatsApp chat).

---

### User Story 4 - See reviews and highlights (Priority: P2) — Implemented

A user checks social proof — what other people say, and the standout qualities other diners flagged — before deciding.

**Independent test**: confirm one review preview renders with a "view all N reviews" control that opens the full list in a sheet; confirm the highlights row renders independent of the reviews section.

**Acceptance scenarios**:

1. **Given** the detail screen, **when** it renders, **then** the overall rating and one preview review (reviewer, time, star rating, text) show.
2. **Given** the review preview, **when** the user taps "view all N reviews," **then** a sheet opens listing every review.
3. **Given** the detail screen, **when** it renders, **then** a row of highlight badges shows without requiring interaction.
4. **Given** a restaurant with zero reviews, **when** the screen renders, **then** the reviews section shows a visible empty state (icon, "No reviews yet," muted subtext) and an "Add a review" control that opens the review submission sheet (mechanism owned by `reviews.md`); logged-out, it prompts to log in instead, matching User Story 7's favorite-icon guard.

---

### User Story 5 - Browse the restaurant's Instagram (Priority: P3) — Implemented

A user curious about the vibe can open the restaurant's Instagram profile.

**Independent test**: confirm the Instagram handle renders; tap "Open on Instagram," confirm the profile opens in the Instagram app or browser.

**Acceptance scenarios**:

1. **Given** a restaurant with an Instagram handle, **when** the screen renders, **then** the handle and an "Open on Instagram" button show; without a handle, the section is hidden.
2. **Given** the Instagram section, **when** the user taps "Open on Instagram," **then** `https://www.instagram.com/<handle>` opens (leading `@` stripped).

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

- **FR-001**: The system MUST display, for the restaurant matching the route's `id`, its name, description, tags, address, price level, and rating. The "X km from you" chip renders only for a `resolved` location (`search.md` FR-034).
- **FR-002**: The system MUST display a photo gallery with next/previous navigation and a position counter, when the restaurant has more than one photo.
- **FR-003**: The system MUST truncate long descriptions with a "see more" affordance that expands to the full text on tap, and collapses again on a second tap.
- **FR-004**: The user MUST be able to navigate back to the previous screen; if none exists, back MUST navigate to Home.
- **FR-005**: The system MUST provide four quick actions — Menu, Takeaway, Delivery, Reserve. Menu is enabled (opens a sheet) only when the restaurant has at least one menu item. Takeaway and Delivery are enabled only when `deliveryLinks` is non-empty and share the same links: one link opens directly, several open a sheet listing platforms by name. Reserve is always disabled.
- **FR-006**: The Menu sheet MUST list menu items with their prices.
- **FR-007**: Superseded 2026-10-05 by FR-005 (delivery-platform sheet).
- **FR-008**: Removed 2026-09-02 — Reserve no longer opens a sheet; see FR-005.
- **FR-009**: The system MUST display a capped preview of amenities with an option to view the full list.
- **FR-010**: The system MUST display the restaurant's opening hours for all seven days of the week on request.
- **FR-011**: The system MUST display a "Things to know" section without requiring a tap.
- **FR-012**: The system MUST display the overall rating and one preview review, with an option to view all reviews.
- **FR-013**: The system MUST display a row of highlight badges.
- **FR-014**: The system MUST display the restaurant's Instagram handle and an "Open on Instagram" control that opens the profile URL derived from the handle.
- **FR-015**: The system MUST display a "Similar Places" rail; tapping an entry MUST navigate to that restaurant's own detail screen, replacing the current screen (`router.replace`).
- **FR-016**: The user MUST be able to toggle a restaurant's favorited state from the detail screen, reading and writing the shared favorites store defined in `favorites.md`.
- **FR-017**: The system MUST display four fixed contact cards directly on the screen — Phone (`tel:` of `phones[0]`), Website (`websites[0]`), Social (Instagram profile URL if `instagramHandle`, else `socialLinks[0]`), WhatsApp (`whatsappUrl`) — each showing a readable value and opening its URL on tap, or "Not provided" and disabled when that channel is absent. Social shows a human platform label (e.g. "Facebook"). The app does not classify links; `websites`/`socialLinks`/`deliveryLinks`/`whatsappUrl` arrive classified from the backend.
- **FR-020**: The system MUST display a visible empty state (icon + "No reviews yet" + an "Add a review" control that opens the review submission sheet) when a restaurant has zero reviews, in place of hiding the section. Also present, not conditional on the empty state, in the populated view (US4, scenario 2's "view all N reviews" trigger sits alongside it) — submission itself is `reviews.md`'s contract.
- **FR-021**: The system MUST display the restaurant's own category and any alternate categories as a humanized chip row (`snake_case` → `Title Case`), visually distinct from owner-authored tags.
- **FR-022**: The system MUST display a "Part of {brandName}" badge near the restaurant name when the restaurant has a non-null `brandName`.
- **FR-023**: The system MUST show an alert when an external URL cannot be opened.
- **FR-018**: The system MUST display a tappable address that opens the location in a maps app: Android via a `geo:<lat>,<lng>?q=<lat>,<lng>(<name>)` URL (OS chooser; coordinates in the path, since Waze geocodes the label when the path is `0,0`); iOS via a sheet of Apple Maps plus installed Google Maps/Waze, opening directly when only one option exists; web via a Google Maps search URL.
- **FR-019**: Removed 2026-09-02 — the share icon was a fully fake action (`Alert.alert` only); removed rather than kept as a non-functional placeholder. Real sharing is deferred, not scheduled.
- **FR-024**: The system MUST confirm before the Takeaway/Delivery flow when a `resolved` location is more than `FAR_DELIVERY_THRESHOLD_KM` (15 km) away, stating the distance; "Open anyway" continues, "Cancel" opens nothing; skipped for `fallback`/`denied`; actions stay enabled.

### Key Entities

- **RestaurantDetail**: extends the base `Restaurant` shape with `photos` (gallery), `description`, `tags`, `category`, `categoryAlternates`, `brandName`, `addressShort`, `reviewCount`, `amenities`, `highlights`, `thingsToKnow`, `instagramHandle`, `reviews`, `openingHours`, `phones`, `whatsappUrl`, `websites`, `socialLinks`, `deliveryLinks`.
- **DeliveryLink**: `platform` (`ifood` | `anota_ai` | `goomer` | `rappi`) + `url`. Classified server-side.
- **whatsappUrl**: a ready-to-open `wa.me`/`api.whatsapp.com` URL resolved server-side (owner field > explicit link > BR mobile phone), or `null`. The raw wire `whatsapp` field is not mapped into `RestaurantDetail`.
- **MenuItem**: name, price (display string, not a structured currency amount).
- **Review**: a first-party review — reviewer's account name, star rating, text, submission timestamp. Contract owned by `reviews.md`; this spec only displays it.
- **Amenity**: an icon + label pair.
- **ThingToKnow**: a title + text pair.
- **OpeningHours**: a day + hours-range pair, one per day of the week.

## Success Criteria

- **SC-001**: From tapping a restaurant card to seeing its name, photo, and rating on the detail screen, there is no perceptible loading state.
- **SC-002**: A user can reach the Menu sheet, when it's enabled, in exactly 1 tap from the detail screen.
- **SC-003**: Favoriting a restaurant and opening Profile shows it in the favorites rail with no manual refresh.
- **SC-004**: Tapping through the entire photo gallery and back never shows an incorrect counter value.

## Architecture Mapping

- **Feature folder**: `src/features/restaurant/{api,components,hooks,types}`. No `stores/` — the one piece of cross-screen state this feature touches (favorited) is global, owned by `favorites.md`.
- **Shared `src/components/ui/` component**: `PhotoCarousel` (gallery with next/previous + counter).
- **US3 components** (`features/restaurant/components/`): `InfoActionsRow` ("How to reach them" — four fixed contact cards rendered directly on screen, no sheet; see 2026-09-02 Changelog entry), `ThingsToKnowSection` (always visible, no sheet).
- **US4 components**: `ReviewsSection` (rating header, preview review, "view all N reviews" trigger, an `onAddReview` callback prop for the "Add a review" trigger — guards logged-out taps itself via `useAuthStore`, same `Alert` pattern as `favorites.md`'s toggle; renders a visible empty state when `reviews.length === 0`) + `ReviewsSheetContent`, `HighlightsRow` (always visible, no sheet). `ReviewsSection` does not import `reviews.md`'s submission form directly — same "features never import each other" rule as US6 below; `app/restaurant/[id].tsx` owns the sheet and passes `onAddReview` down.
- **US5 component**: `InstagramSection` — handle and an "Open on Instagram" button.
- **External links**: `src/features/restaurant/lib/externalLinks.ts` — `openExternalUrl` (`expo-linking`'s `openURL`; resolves `false` and shows an `Alert` on rejection), `toTelUrl`, `toInstagramUrl`, `resolveMapOptions` (sole `Platform.OS` branch for map targets; iOS filters Google Maps/Waze via `canOpenURL`, a rejected check counting as not installed), `LinkOption` type.
- **Far-delivery confirmation**: `lib/deliveryDistance.ts` — `FAR_DELIVERY_THRESHOLD_KM`, `confirmFarDelivery(distanceKm)` (`Alert` wrapped in a promise; `globalThis.confirm` on web, where `Alert.alert` is a no-op). `app/restaurant/[id].tsx` computes the distance once (`haversineKm`) for the "from you" label and passes it to `ActionGrid` as `distanceKm`, `null` unless the location `status` is `resolved`; `ActionGrid` reads no store. The confirmation runs inside `useLinkChooser`'s loader, so its re-entry guard covers the open alert.
- **Link chooser**: `hooks/useLinkChooser.ts` — one option opens directly, several are exposed for a sheet; ignores taps while resolving and skips opening after unmount. `components/LinkChooserSheet.tsx` (`BottomSheet` + `RedirectOptionsSheetContent`, closes after a successful open) serves both `ActionGrid`'s delivery sheet and `AddressLink` (address → maps, US3).
- **iOS query schemes**: `app.json`'s `expo.ios.infoPlist.LSApplicationQueriesSchemes` = `comgooglemaps`, `waze`, required for `canOpenURL`. Takes effect only in a new native build.
- **Reuses from `src/components/ui/`**: `RestaurantCard`, `HorizontalRail` (Similar Places rail), `BottomSheet` (every quick-action and info sheet), `RatingBadge`.
- **US6**: `app/restaurant/[id].tsx` reuses `useRestaurantsQuery` (from `features/search/api`) and filters client-side by cuisine, excluding the current id, capped at 3 — route-level composition, not a feature-to-feature import. `SimilarPlacesSection` returns `null` if zero candidates.
- **Reuses from `src/components/layout/`**: `SearchBar`, overlaid on the photo gallery. Does not reuse `SideMenu` — this screen's header icon stack (favorite only, since 2026-09-02) is screen-specific, built in `DetailHeaderActions.tsx`.
- **Global state**: reads and writes `src/stores/favorites.ts` (contract defined in `favorites.md`) for User Story 7.
- **Types**: `RestaurantDetail`, `MenuItem`, `Review`, `Amenity`, `ThingToKnow`, `OpeningHours` in `src/features/restaurant/types/`. `RestaurantDetail` extends the shared `Restaurant` from `src/types/restaurant.ts`.
- **Mocks**: `src/mocks/restaurantDetails.ts`, keyed by place id, composed from `src/mocks/restaurants.ts`'s 30 base places plus detail-only fields. `useRestaurantDetailQuery(id)` calls the Google Places API (New) Place Details contract, resolves photo references through the same two-hop flow as the list, normalizes to `RestaurantDetailSchema`.
- **US3 wire contract**: `regularOpeningHours.weekdayDescriptions`, `internationalPhoneNumber`, curated Google boolean amenity fields, mapped to `Amenity` icon+label pairs via a presentation-only lookup table. `whatsappUrl` (backend-resolved)/`instagramHandle`/`thingsToKnow` stay custom.
- **US4 wire contract**: `reviews[]`/`averageRating`/`reviewCount` come from `dine-out-backend`'s first-party `Review` model (`reviews.md`, capped at the 20 most recent), not Google. `highlights` stays custom.
- **US5**: `instagramHandle` only; no Google Places equivalent.
- **Category/contact labeling**: `src/features/restaurant/lib/labels.ts` — `humanizeCategory` (`snake_case` → `Title Case`, mirrors the backend's own `humanizeCategory()` in `dine-out-backend-overture/src/restaurants/taxonomies.data.ts`), `getSocialLinkLabel`/`getSocialLinkIcon` (hostname → platform name/icon, `facebook.com`/`instagram.com` mapped explicitly, else bare hostname), `getWebsiteLabel` (bare hostname), `DELIVERY_PLATFORM_LABELS` (`Record<DeliveryPlatform, string>`; a new backend platform is a compile error until labeled).
- **New dependencies**: `zod`. `PhotoCarousel` uses a plain `ScrollView` and local state, no third-party carousel library.

## Out of Scope

- Real menu ordering / checkout flow — Menu is read-only.
- In-app ordering or partner API integration — Takeaway/Delivery only link out to the platform.
- Separate takeaway links — Takeaway reuses `deliveryLinks`.
- A real reservation system — Reserve stays disabled until one exists (2026-09-02).
- Real Instagram API/OAuth integration.
- Client-side link classification — owned by the backend.
- Writing or submitting new reviews — mechanism owned by `reviews.md`; this spec owns only the display surfaces (`ReviewsSection`, `ReviewsSheetContent`) and the trigger that opens the submission sheet, mirroring how `favorites.md` owns the favorite toggle's actual mechanism while this spec owns the like icon (User Story 7).
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
| 2026-08-26 | `InfoActionsRow` briefly moved to an inline (no-sheet) contact list; reverted the same day after checking the design canvas (`App Flow.dc.html`'s `screenshots/02-detail.png`) — "Contact & socials" is a single tappable button opening a sheet in the actual design, sitting alongside an "Opening Hours" button (the latter stays unbuilt, no data source exists). FR-017 restored to the sheet-based wording; `phones[]`/`websites[]`/`socialLinks[]` still populate that sheet's list, per the entry above. |
| 2026-08-27 | `photos` no longer hardcoded to `[]`: `useRestaurantDetailQuery.ts` now threads the wire's `photoUrl` into `photos: [wire.photoUrl]` (`dine-out-backend-overture`'s `Restaurant.photoUrl`, FR-028–FR-031 there). `PhotoCarousel` needed zero code changes — its truthy/falsy branch on `photos.length` already handled this correctly. Verified live against the real backend: `PhotoCarousel` renders an actual stock photo instead of "No photos available" for restaurants that previously showed the empty state. |
| 2026-08-31 | US4's `Review`/rating/reviews are real again, first-party this time (not Google): `useRestaurantDetailQuery.ts` threads `wire.reviews`/`wire.averageRating`/`wire.reviewCount` (`dine-out-backend`'s new `specs/reviews.md`) instead of the hardcoded `reviews: []`. FR-020's "Add a review" control is functional — opens the submission form specced in `reviews.md` (mechanism there; this spec keeps only the display + an `onAddReview` trigger prop, threaded from `app/restaurant/[id].tsx`). `ReviewsSection`/`ReviewsSheetContent` updated from the old `{name, time}` shape to `{userName, createdAt}`. Verified live. |
| 2026-09-02 | Live device-testing feedback, three deliberate changes (FR-005–FR-008, FR-017, FR-019): (1) `ActionGrid` — Takeaway/Delivery/Reserve have no real per-restaurant data by design (same simulated options for every restaurant) and now render permanently disabled instead of opening a sheet that simulates a capability the app doesn't have; Menu stays gated on `menu.length > 0`. `ReserveSheetContent` deleted (no longer reachable); `RedirectOptionsSheetContent` stays (still used by the address sheet). (2) `DetailHeaderActions` — removed the fully-fake share icon (`Alert.alert` only); favorite stays. (3) `InfoActionsRow` rebuilt from a single "Contact & socials" button-that-opens-a-sheet into a "How to reach them" section with four fixed cards (Phone/Website/Social/WhatsApp) rendered directly on screen — missing channels show "Not provided" and render disabled rather than being omitted. This supersedes the 2026-08-26 revert of the same inline-layout idea, which was reverted that day for contradicting the canonical design canvas (`App Flow.dc.html`'s `screenshots/02-detail.png`); this time the direction is confirmed by a session mockup, but the canonical canvas itself has not been updated to match — do that before trusting the canvas over this spec for this screen. `npx tsc --noEmit`, `npx biome lint .`, `npx jest` (71 tests) clean; verified live on a physical Android device via `eas build --local`. |
| 2026-10-05 | Deep links (FR-005, FR-014, FR-017, FR-018, FR-023). Depends on `dine-out-backend` FR-032–FR-036: `deliveryLinks`, `whatsappUrl`, `instagramHandle` fallback from an instagram.com link, delivery/WhatsApp links removed from `websites`/`socialLinks`. New `lib/externalLinks.ts`, `hooks/useLinkChooser.ts`, `components/LinkChooserSheet.tsx`, `components/AddressLink.tsx`; `DELIVERY_PLATFORM_LABELS` in `lib/labels.ts`. Contact cards, Instagram button, address, Takeaway/Delivery open real URLs; demo `Alert`s removed. `RestaurantDetail.whatsapp` replaced by `whatsappUrl`. `app.json` gains `LSApplicationQueriesSchemes` (`comgooglemaps`, `waze`). `npx tsc --noEmit`, `npx biome lint .`, `npx jest` (96 tests) clean. Device verification (Android chooser, iOS sheet, new native build) pending. |
| 2026-10-05 | Device verification on a physical Android (Xiaomi): iFood, WhatsApp, dialer, Waze, and Google Maps links open correctly. FR-018's Android `geo:` URI changed from `geo:0,0?q=…` to `geo:<lat>,<lng>?q=…`: with a `0,0` path Waze geocoded the label instead of routing to the coordinates. Instagram handle truncated so its open button stays on screen. iOS sheet unverified. |
| 2026-10-05 | FR-024 (US2 scenario 9): Takeaway/Delivery ask for confirmation when a resolved location is more than 15 km away. New `lib/deliveryDistance.ts`; `ActionGrid` gains `distanceKm: number \| null`. `npx tsc --noEmit`, `npx biome lint .`, `npx jest` clean. |
| 2026-10-06 | FR-001 distance chip hidden unless the location is `resolved`; FR-024 reads the shared `useLocationOrigin` hook instead of an inline `status` check. `npx tsc --noEmit`, `npx biome lint .`, `npx jest` (105 tests) clean. |
