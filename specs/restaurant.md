# Feature Specification: Restaurant (detail)

**Feature**: `restaurant` — folder `src/features/restaurant/`
**Created**: 2026-07-23
**Status**: In Progress — User Stories 1, 2, 3, 4, and 5 Implemented (mock data); User Stories 6–7 not started
**Design reference**: `App Flow.dc.html`, frame "2 · Restaurant Detail"

## Summary

The page a user lands on after tapping a restaurant anywhere in the app (Home rails, map results, similar-places, favorites). It's the single screen responsible for turning "this looks interesting" into a decision: what the place is, whether it fits the occasion, and what to do next (see the menu, order delivery, reserve a table, or just save it for later). This is the highest-intent screen in the product — everything else in the app exists to funnel a user here.

## User Stories

### User Story 1 - View core restaurant details (Priority: P1) — **Implemented**

A user who tapped a restaurant card sees a photo gallery, the restaurant's name, a description, defining tags, and the essentials (address, price level, rating) needed to judge fit at a glance.

**Why this priority**: this is the screen's reason to exist. Every other story on this page is an enhancement on top of "show me what this place is."

**Independent test**: navigate to `/restaurant/1`, confirm name/description/tags/address/price/rating render from mock data, swipe or tap through the photo gallery, confirm the photo counter updates.

**Acceptance scenarios**:

1. **Given** the user navigates to `/restaurant/[id]`, **when** the screen loads, **then** it shows that restaurant's name, description, tags, address, price level, and rating — not another restaurant's.
2. **Given** the restaurant has multiple photos, **when** the user taps the next/previous controls, **then** the displayed photo changes and the counter (e.g. "2/3") updates to match.
3. **Given** a description longer than the truncation threshold, **when** the screen first renders, **then** the description shows truncated with a "see more" affordance; **when** the user taps it, **then** it expands to the full text and the affordance flips to "see less."
4. **Given** the user taps the back control, **when** the tap happens, **then** the app returns to wherever it came from (Home, map results, favorites, or similar-places on another restaurant's detail). **Corrected**: if there's no previous screen to return to (a fresh page load or deep link straight into `/restaurant/[id]`, with nothing before it in history), the back control navigates to Home instead of attempting an unhandled `GO_BACK` — found via a real dev-console warning ("The action 'GO_BACK' was not handled by any navigator"), reachable in practice via a browser hard-refresh while already on a detail screen.
5. **Given** the photo gallery header, **when** it renders, **then** it shows a location icon, a settings icon, a profile-link icon, and (lower on the same overlay) a share icon — a **corrected** addition: these were visible in the design from the start but had no FR or acceptance scenario anywhere in this spec until a design cross-reference caught the gap (see FR-019–FR-022). The like/favorite icon that shares this same overlay area is *not* part of this scenario — that one's FR-016/User Story 7, correctly gated on `stores/favorites.ts` existing.

---

### User Story 2 - Take a quick action on the restaurant (Priority: P1) — **Implemented**

A user who's decided this restaurant is worth pursuing can immediately see the menu, order takeaway or delivery, or reserve a table, without leaving the app.

**Why this priority**: this is the screen's actual conversion moment. A detail page that only informs, without a next step, is a brochure — for a discovery app this is core, not a nice-to-have.

**Independent test**: on `/restaurant/[id]`, tap each of Menu/Takeaway/Delivery/Reserve independently, confirm each opens its own sheet with the right content, and confirm closing one doesn't affect the others.

**Acceptance scenarios**:

1. **Given** the detail screen, **when** the user taps "Menu," **then** a sheet opens listing menu items with prices.
2. **Given** the detail screen, **when** the user taps "Takeaway," **then** a sheet opens with delivery-partner options (e.g. "Order on iFood," "Restaurant's website") that simulate a redirect.
3. **Given** the detail screen, **when** the user taps "Delivery," **then** a sheet opens with delivery-app options (e.g. iFood, Uber Eats) that simulate a redirect.
4. **Given** the detail screen, **when** the user taps "Reserve," **then** a sheet opens with a reservation confirmation action that simulates completing a booking.
5. **Given** any of the four sheets is open, **when** the user taps outside it or its close control, **then** it closes without affecting the underlying screen's state (e.g. photo index, description expansion).

---

### User Story 3 - See practical info before committing (Priority: P2) — **Implemented**

A user weighing whether to go can check what the place offers (wifi, parking, accessibility, etc.), when it's open, and any rules that might affect their visit (cancellation policy, dress code, safety notes).

**Why this priority**: reduces the chance of a wasted trip or an unpleasant surprise — real value, but the user can still act (via User Story 2) without reading this first.

**Independent test**: on `/restaurant/[id]`, confirm the amenities preview shows a subset with a "show all" control that opens the full list in a sheet; tap "Opening Hours," confirm a 7-day schedule renders.

**Acceptance scenarios**:

1. **Given** the detail screen, **when** it renders, **then** a preview of amenities (icon + label) shows, capped at a small number, with a control to see the full list.
2. **Given** the amenities preview, **when** the user taps "show all N amenities," **then** a sheet opens listing every amenity.
3. **Given** the detail screen, **when** the user taps "Opening Hours," **then** a sheet opens showing hours for every day of the week, plus any holiday-hours note.
4. **Given** the detail screen, **when** it renders, **then** a "Things to know" section shows title+text pairs (e.g. cancellation policy, house rules, safety & property) without needing a tap.

---

### User Story 4 - See reviews and highlights (Priority: P2) — **Implemented**

A user checks social proof — what other people say, and the standout qualities other diners flagged — before deciding.

**Why this priority**: a strong trust signal, on par with practical info, but not required to complete an action.

**Independent test**: confirm one review preview renders with a "view all N reviews" control that opens the full list in a sheet; confirm the highlights row renders independent of the reviews section.

**Acceptance scenarios**:

1. **Given** the detail screen, **when** it renders, **then** the overall rating and one preview review (reviewer, time, star rating, text) show.
2. **Given** the review preview, **when** the user taps "view all N reviews," **then** a sheet opens listing every review for that restaurant.
3. **Given** the detail screen, **when** it renders, **then** a row of highlight badges (e.g. "Fast service," "Big Portions," "Variety") shows without requiring interaction.

---

### User Story 5 - Browse the restaurant's Instagram (Priority: P3) — **Implemented**

A user curious about the vibe can see a preview of the restaurant's Instagram grid and toggle following it.

**Why this priority**: engagement/vibe-check value, clearly secondary to the decision-making stories above.

**Independent test**: confirm the Instagram handle and a photo grid render; tap "Follow," confirm the label flips to "Following" and back on a second tap.

**Acceptance scenarios**:

1. **Given** the detail screen, **when** it renders, **then** the restaurant's Instagram handle and a grid of preview photos show.
2. **Given** the Instagram section, **when** the user taps "Follow," **then** the button's label and style change to reflect a "Following" state; **when** tapped again, **then** it reverts.

---

### User Story 6 - Discover similar restaurants (Priority: P3)

A user who isn't fully sold sees other restaurants like this one, keeping them inside the discovery loop instead of bouncing.

**Why this priority**: retention/cross-sell value — good to have, doesn't block the core decision-making flow.

**Independent test**: confirm a "Similar Places" rail renders with restaurant cards; tap one, confirm the app navigates to that restaurant's own detail screen.

**Acceptance scenarios**:

1. **Given** the detail screen, **when** it renders, **then** a "Similar Places" rail shows other restaurants as cards (photo, name, rating, price).
2. **Given** the Similar Places rail, **when** the user taps a card, **then** the app navigates to `/restaurant/[that restaurant's id]` — replacing the current detail, not stacking indefinitely.

---

### User Story 7 - Favorite a restaurant from its detail screen (Priority: P2)

A user can mark a restaurant as a favorite (or remove it) directly from the detail screen, without navigating anywhere else.

**Why this priority**: low effort, high retention value — but the screen is fully usable without it.

**Independent test**: tap the heart/like icon, confirm it switches to the "favorited" visual state; confirm the same restaurant now appears in the Profile favorites rail (see `favorites.md`); tap again, confirm both places reflect the removal.

**Acceptance scenarios**:

1. **Given** a restaurant not yet favorited, **when** the user taps the like icon, **then** the icon switches to its filled/active state, and the restaurant is added to the global favorites store (contract owned by `favorites.md`, not redefined here).
2. **Given** a restaurant already favorited, **when** the user taps the like icon, **then** it reverts to its outline/inactive state and the restaurant is removed from the global favorites store.
3. **Given** the user navigates away and back to the same restaurant, **when** the detail screen re-renders, **then** the like icon reflects the current favorited state, not a per-visit local guess.

---

### Edge Cases

- **Restaurant id doesn't exist in mock data**: **Resolved during US1 implementation** — renders a plain "Restaurante não encontrado" message instead of crashing. Not a designed empty state (no illustration, no back-to-Home action) — revisit if this becomes reachable in practice rather than a theoretical guard.
- **No previous screen to go back to** (fresh page load or deep link directly into `/restaurant/[id]`): **Resolved** — the back control checks `router.canGoBack()` first and navigates to Home instead of an unhandled `GO_BACK` action. Real, not theoretical: caught via an actual dev-console warning after a browser hard-refresh on a detail screen.
- **Description shorter than the truncation threshold**: "see more" control should not render at all (nothing to expand).
- **Zero reviews**: **Resolved pragmatically during US4 implementation**: `ReviewsSection` renders nothing at all if `reviews.length === 0` (no preview, no rating header, no "view all" control) — same "hide if nothing to show" treatment already established for `AmenitiesSection`'s "show all N amenities" button. Every mock restaurant has reviews today, so this is a defensive guard, not a designed empty state; revisit if a real backend can ever return zero reviews for a place users can reach.
- **Single photo**: next/previous controls and the counter badge should either hide or be disabled — showing "1/1" with working-looking arrows that do nothing would be a bug.
- **Amenities list shorter than the preview cap**: the "show all N amenities" control should not render (nothing more to show).
- **Rapid double-tap on the like icon**: must not desync from the global store's actual state (no flicker between favorited/not across taps).

## Functional Requirements

- **FR-001**: The system MUST display, for the restaurant matching the route's `id`, its name, description, tags, address, price level, and rating.
- **FR-002**: The system MUST display a photo gallery with next/previous navigation and a position counter (e.g. "2/3"), when the restaurant has more than one photo.
- **FR-003**: The system MUST truncate long descriptions with a "see more" affordance that expands to the full text on tap, and collapses again on a second tap.
- **FR-004 — Corrected**: The user MUST be able to navigate back to the previous screen from the detail screen; if there is no previous screen (`router.canGoBack()` is `false`), it MUST navigate to Home instead of attempting a no-op back action.
- **FR-005**: The system MUST provide four quick actions — Menu, Takeaway, Delivery, Reserve — each opening a sheet with its own content.
- **FR-006**: The Menu sheet MUST list menu items with their prices.
- **FR-007**: The Takeaway and Delivery sheets MUST list simulated redirect options to third-party services (e.g. iFood, Uber Eats, the restaurant's own site).
- **FR-008**: The Reserve sheet MUST provide a single confirmation action that simulates completing a reservation.
- **FR-009**: The system MUST display a capped preview of amenities with an option to view the full list.
- **FR-010**: The system MUST display the restaurant's opening hours for all seven days of the week, plus any holiday-hours note, on request.
- **FR-011**: The system MUST display a "Things to know" section (title + text entries) without requiring a tap.
- **FR-012 — Implemented**: The system MUST display the overall rating and one preview review, with an option to view all reviews.
- **FR-013 — Implemented**: The system MUST display a row of highlight badges.
- **FR-014 — Implemented**: The system MUST display the restaurant's Instagram handle, a preview photo grid, and a toggleable Follow/Following control (local UI state only — no real Instagram integration). Unlike US3/US4, this has no Google Places mapping — Instagram isn't part of Google's Place contract at all, so `instagramPhotos` is genuinely custom, plain URLs (not routed through the photo-reference two-hop that mirrors Google's real photo contract, since there's no such contract to mirror here).
- **FR-015**: The system MUST display a "Similar Places" rail; tapping an entry MUST navigate to that restaurant's own detail screen.
- **FR-016**: The user MUST be able to toggle a restaurant's favorited state from the detail screen, reflecting and updating the shared favorites store defined in `favorites.md`.
- **FR-017 — Implemented**: The system MUST display contact options (phone, WhatsApp, Instagram) in a dedicated sheet, each simulating a redirect to the respective app. **Resolved**: the ownership gap flagged during US1/US2 (this FR wasn't referenced by any User Story) is closed by folding it into US3 — the design's own "📞 Contact & socials" button lives right next to "🕐 Opening Hours" in the same practical-info area. Built via `InfoActionsRow` reusing the existing `RedirectOptionsSheetContent`, no new sheet-content component needed.
- **FR-018 — Implemented**: The system MUST display a tappable address that opens a sheet offering to open the location in a maps app (simulated redirect). **Resolved** alongside FR-017, same reasoning — the address `Text` in the detail screen is now wrapped in a `Pressable` opening a one-option `RedirectOptionsSheetContent`.
- **FR-019 — Implemented**: The system MUST display a location icon over the photo gallery that opens a sheet offering to open the location in a maps app — the same simulated action as FR-018, reached from a second entry point. *(New: found via a design cross-reference after US3 shipped — this icon stack (FR-019–FR-022) existed in the design from the start but had no FR or User Story anywhere in this spec.)*
- **FR-020**: The system MUST display a settings icon over the photo gallery that shows a simulated placeholder response on tap. **[NEEDS CLARIFICATION: the design gives no indication of what "restaurant settings" actually means on a detail screen (notification preferences? reporting an issue? something else?) — implemented as a generic simulated message, not a guess at real functionality. Revisit if the design ever shows real content for this icon.]**
- **FR-021 — Implemented**: The system MUST display a profile-link icon over the photo gallery that navigates to the Profile tab — a real navigation, not a simulated action (matches the design's own `<a href="#profile-frame">`, not a `setDetailPopup(...)` call like its neighbors).
- **FR-022 — Implemented**: The system MUST display a share icon over the photo gallery, lower than the location/settings/profile icons, that shows simulated share feedback on tap. Shares its overlay area with the not-yet-built like/favorite icon (FR-016/US7) — positioned to leave room for it once `stores/favorites.ts` exists, not implemented yet.

### Key Entities

- **RestaurantDetail**: the full record for a single restaurant — extends the base `Restaurant` shape (id, name, photo, rating, priceLevel) used elsewhere in the app with everything the detail screen needs: `photos` (gallery, plural), `description`, `tags`, `addressShort`, `reviewCount`, `amenities`, `highlights`, `thingsToKnow`, `instagram` (handle), `reviews`, `openingHours`. **US3 added** `phone`, `whatsapp`, `instagramHandle` (scalar contact fields, resolving FR-017's data gap — `instagramHandle` is just the string here, the full grid+follow UI is still US5).
- **MenuItem**: a single line in the Menu sheet — name, price (display string, e.g. `"R$ 89"` — not a structured currency amount at this stage).
- **Review**: a single review — reviewer name, relative time, star rating, text. The avatar's "initial" isn't a stored field — components derive it from `name.charAt(0)`, avoiding a value that could drift out of sync with the name.
- **Amenity**: an icon + label pair (e.g. "📶 Wifi grátis").
- **ThingToKnow**: a title + text pair (e.g. "Cancellation policy" / the policy text).
- **OpeningHours**: a day + hours-range pair, one per day of the week.

## Success Criteria

- **SC-001**: From tapping a restaurant card anywhere in the app to seeing its name, photo, and rating on the detail screen, there is no perceptible loading state (mock data resolves instantly).
- **SC-002**: A user can reach any of the four quick actions (Menu/Takeaway/Delivery/Reserve) in exactly 1 tap from the detail screen.
- **SC-003**: Favoriting a restaurant from the detail screen and then opening the Profile screen shows that restaurant in the favorites rail without needing a manual refresh.
- **SC-004**: Tapping through the entire photo gallery and back never shows an incorrect counter value or a photo that doesn't match the counter.

## Architecture Mapping

- **Feature folder**: `src/features/restaurant/{api,components,hooks,types}`. No `stores/` needed — this feature has no state of its own; the one piece of cross-screen state it touches (favorited) is global and owned by `favorites.md`, not by this feature.
- **New shared `src/components/ui/` component required**: `PhotoCarousel` (gallery with next/previous + counter). This is genuinely reusable (already flagged as pending in earlier scaffolding notes) — build it in `ui/`, not inside `features/restaurant/components/`, even though it's only used here today.
- **US3 components** (`features/restaurant/components/`, none shared elsewhere): `InfoActionsRow` (the "Contact & socials"/"Opening Hours" button row, owns its own sheet state, reuses `RedirectOptionsSheetContent` for the Contact sheet — no new sheet-content component needed for FR-017), `OpeningHoursSheetContent`, `AmenitiesSection` (preview + "show all" trigger) + `AmenitiesSheetContent`, `ThingsToKnowSection` (always-visible, no sheet, per FR-011). The tappable address (FR-018) needed no new component — one more `useState` directly in `app/restaurant/[id].tsx`, consistent with how it already manages `descriptionExpanded`.
- **US4 components**: `ReviewsSection` (rating header + preview review + "view all N reviews" trigger, owns its own sheet state, same self-contained pattern as `AmenitiesSection`; returns `null` entirely when `reviews.length === 0`) + `ReviewsSheetContent` (full list), `HighlightsRow` (always-visible 3-badge row, no sheet, per FR-013).
- **US5 component**: `InstagramSection` — handle, Follow/Following toggle (local `useState`, both label and style change per FR-014's acceptance scenario 2), 3-column photo grid. The design's gradient-circle avatar is a solid brand-ish color instead — no gradient utility available without adding `expo-linear-gradient`, and it's purely decorative, not worth a new native dependency for.
- **Reuses from `src/components/ui/`**: `RestaurantCard` (Similar Places rail), `HorizontalRail` (Similar Places rail — still to decide at implementation time), `BottomSheet` (every quick-action and info sheet on this screen), `RatingBadge`. **Resolved** (US5): the Instagram photo grid is a static `features/restaurant/components/InstagramSection.tsx`, not `HorizontalRail` — the design's own layout is a fixed 3-column grid, not a horizontal-scrolling rail, so a rail component would be the wrong fit.
- **Reuses from `src/components/layout/`**: `SearchBar` (overlaid on the photo gallery, matching the design; its overlay width shrank from `right-3.5` to `right-12` once the icon stack needed room beside it). Does NOT reuse `SideMenu` — the header icon stack on this screen (location/settings/profile/share) is a different, screen-specific set of icons, not the Home hamburger menu. **Implemented**: `features/restaurant/components/DetailHeaderActions.tsx` (FR-019–FR-022) — location reuses `RedirectOptionsSheetContent` (same option as FR-018's address sheet), settings and share use a direct `Alert.alert` (no sheet needed for a single generic message), profile is a real `router.push('/profile')`.
- **Global state**: yes — reads and writes `src/stores/favorites.ts` (contract defined in `favorites.md`) for User Story 7. This is the first feature to actually consume that store; implementing it here is what turns `stores/favorites.ts` from a documented decision into real code — coordinate with `favorites.md`'s implementation, don't invent a second, divergent favorites API here.
- **Types**: `RestaurantDetail`, `MenuItem`, `Review`, `Amenity`, `ThingToKnow`, `OpeningHours` all live in `src/features/restaurant/types/` (detail-specific, not shared) and `RestaurantDetail` extends the shared `Restaurant` from `src/types/restaurant.ts` rather than duplicating its fields. `RestaurantDetail.reviewCount` (**added in US4**) turned out to already exist on the wire — it's Google's real `userRatingCount`, present since the very first Google Places round but never mapped to anything until now.
- **Mocks**: `src/mocks/restaurantDetails.ts`, string-keyed by place `id`, composed from `src/mocks/restaurants.ts`'s 30 base places plus detail-only fields (`editorialSummary`, `tags`, `menu`) — served over HTTP via `src/mocks/handlers/restaurantDetails.ts` (MSW), returning 404 for an unknown id. **Corrected**: `useRestaurantDetailQuery(id)` now calls the Google Places API (New) Place Details contract (`GET .../places/{id}`, single raw object, matching what this handler already did shape-wise), resolves every photo reference through the same two-hop flow as the list, and normalizes to the unchanged `RestaurantDetailSchema` — 404-to-`null` mapping via `ApiError` is unaffected. Full rationale in `PROJECT.md`'s ADR log.
- **US3 extends the wire contract with more real Google fields**: `regularOpeningHours.weekdayDescriptions` (opening hours), `internationalPhoneNumber` (contact), and a curated set of Google's real boolean amenity fields (`delivery`, `outdoorSeating`, `goodForGroups`, etc.) — mapped to `Amenity` icon+label pairs via a presentation-only lookup table inline in `useRestaurantDetailQuery.ts` (Google doesn't send icons). `whatsapp`, `instagramHandle`, and `thingsToKnow` stay custom, no Google equivalent, same treatment as `menu`/`tags`. Mock data for all 30 restaurants derives these from each place's existing `occasion`/`ambient`/`priceLevel`/`primaryType` rather than being hand-authored per restaurant.
- **US4 extends it further**: Google's real `reviews[]` (`relativePublishTimeDescription`, `rating`, `text.text`, `authorAttribution.displayName`) is an exact match for `Review` — mapped 1:1 in `useRestaurantDetailQuery.ts`. `highlights` has no Google equivalent and stays custom, same treatment as `thingsToKnow`. Mock reviews are composed from a small per-cuisine content pool (3 rating+text pairs per cuisine) combined with shared reviewer-name/relative-time pools cycled by restaurant `id`, not 90 hand-authored reviews; highlights are derived from the same signals `thingsToKnowFor`/`amenityFieldsFor` already use.
- **US5 has no Google mapping at all** — the first round in this feature without one. Instagram isn't part of Google's Place contract, so `instagramPhotos` (plain URLs, cycling the same 6-photo pool `restaurants.ts` already uses everywhere, offset by id) is entirely custom, same as `instagramHandle` already was. No `PROJECT.md` ADR entry for this round — nothing extends the wire contract.
- **New dependencies**: `zod` and `msw` (added when the MSW/testing infrastructure round touched every existing `api/` hook, not specific to this feature). `PhotoCarousel` itself needed none — built with a plain `ScrollView`/local state, no third-party carousel library.

## Out of Scope

- Real menu ordering / checkout flow — Menu is read-only, Takeaway/Delivery are simulated redirects only.
- A real reservation system (date/time picker, availability, confirmation email) — Reserve is a single simulated "confirm" action.
- Real Instagram API/OAuth integration — Follow is local UI state only, the photo grid is static mock data.
- Writing or submitting new reviews.
- Real distance-to-user calculation (depends on `src/stores/location.ts`, not yet implemented).
- A map preview on this screen (the design doesn't show one here — that's the separate Search & Map story in `search.md`).

## Assumptions and Dependencies

- All navigation sources (Home rails, Similar Places, favorites) always pass a valid, known restaurant `id` — see the Edge Case above for what happens if that assumption breaks.
- Menu prices are display strings (e.g. `"R$ 89"`), not structured currency values — fine for a prototype, would need revisiting for a real ordering flow.
- Depends on `src/stores/favorites.ts` existing with the contract `favorites.md` defines — this feature is what actually triggers building it, so sequence the implementation accordingly (favorites store contract first, or in the same pass).
- Depends on `app/restaurant/[id]` existing as a route (it did, as a placeholder, before US1/US2 replaced it with the real implementation).
- `app/restaurant/[id].tsx` now reads `id` from `useLocalSearchParams` and coerces it with `Number(id)` — no validation beyond that (see the resolved Edge Case above).
- **Deliberate, not built (US4)**: the design's top price/rating row is a link that jumps to the reviews section (`★ {{rating}} ({{reviewCount}})`). The shared `RatingBadge` (reused on Home cards, where `reviewCount` doesn't apply) is the wrong place to add this, RN's `ScrollView` has no trivial anchor-scroll equivalent, and no FR requires this specific link — FR-012's own "view all N reviews" button in `ReviewsSection` is the actual requirement and the only way to reach the full list. The top badge stays exactly as US1 built it.

## Notes for the AI Agent

- This is the largest feature spec in the project so far (18 functional requirements, 7 user stories) — do not attempt to implement all of it in a single pass. Enter plan mode and propose slicing it (e.g. US1+US2 first, since both are P1; US3/US4 next; US5/US6/US7 after).
- Building `src/stores/favorites.ts` is in scope for whichever of `restaurant.md` (US7) or `favorites.md` gets implemented first — check `favorites.md`'s status before starting US7, so the store's contract isn't defined twice.
- Before building `PhotoCarousel`, confirm it doesn't already exist in `src/components/ui/` (it may have been added by another spec's implementation in the meantime).
- Verification: `npx tsc --noEmit` clean + bundle smoke test on `/restaurant/1` (or any known mock id) across web/iOS/Android per the pattern in the root `CLAUDE.md`.

## Changelog

| Date | Change |
|------|--------|
| 2026-07-23 | Spec created. No implementation yet. |
| 2026-07-23 | User Story 1 and User Story 2 implemented (mock data: `src/mocks/restaurantDetails.ts`, all 6 restaurants). New shared `PhotoCarousel` added to `components/ui/`. Found and documented a story-ownership gap for FR-017/FR-018 (Contact sheet, tappable address) — deferred, not covered by this round. Resolved the "unknown id" edge case with a plain fallback message. User Stories 3–7 still not started. |
| 2026-07-23 | Architecture Mapping updated: `useRestaurantDetailQuery` migrated from direct mock import to `apiClient` + MSW, with a 404→`null` mapping added specifically to preserve the "restaurant not found" behavior from the entry above (see `PROJECT.md`'s MSW/testing infrastructure entry). No requirement changed. |
| 2026-07-24 | Mock data expanded to 30 restaurants and the wire contract rebuilt to mirror Google Places API (New)'s Place Details shape (`GET .../places/{id}`, two-hop photo resolution, `editorialSummary`→`description`). `RestaurantDetail`/the detail screen/every component are unchanged — normalized at the hook boundary. See `PROJECT.md`'s ADR log. |
| 2026-07-24 | User Story 3 implemented (amenities, opening hours, things to know), and FR-017/FR-018 (contact sheet, tappable address) resolved alongside it — both folded into US3 rather than left ownerless. New components `InfoActionsRow`, `OpeningHoursSheetContent`, `AmenitiesSection`, `AmenitiesSheetContent`, `ThingsToKnowSection`. Wire contract extended with real Google fields (`regularOpeningHours`, `internationalPhoneNumber`, curated boolean amenity fields) plus custom `whatsapp`/`instagramHandle`/`thingsToKnow`. User Stories 4–7 still not started. |
| 2026-07-24 | Design cross-reference (post-US3) found a real, previously-undetected spec gap: the photo gallery's header icon stack (location/settings/profile/share) had existed in the design since US1 but was never given an FR or acceptance scenario — worse than FR-017/FR-018's prior gap, which at least had FR numbers. Added acceptance scenario 5 to User Story 1 and new FR-019–FR-022, then implemented all four via `DetailHeaderActions.tsx`. FR-020 (settings icon) marked `[NEEDS CLARIFICATION]` — implemented as a generic simulated placeholder since the design gives no real content for it. |
| 2026-07-24 | User Story 4 implemented (reviews, highlights). New components `ReviewsSection` + `ReviewsSheetContent`, `HighlightsRow`. Resolved the "zero reviews" `[NEEDS CLARIFICATION]` pragmatically (hide the section entirely, same treatment as `AmenitiesSection`). `RestaurantDetail.reviewCount` maps to Google's real `userRatingCount`, present since the first Google Places round but unused until now. Wire contract extended with Google's real `reviews[]` shape plus custom `highlights`. Noted as a deliberate non-build: the top rating badge doesn't link to the reviews section. User Stories 5–7 still not started. |
| 2026-07-24 | User Story 5 implemented (Instagram handle, photo grid, Follow/Following toggle). New component `InstagramSection`. Resolved the Architecture Mapping's "decide at implementation time" note — a static 3-column grid, not `HorizontalRail`. First round in this feature with no Google Places mapping at all (Instagram isn't part of Google's contract), so no `PROJECT.md` ADR entry this time. Gradient avatar circle simplified to a solid color rather than adding `expo-linear-gradient`. User Stories 6–7 still not started. |
| 2026-07-24 | Fixed a real bug caught via a dev-console warning ("The action 'GO_BACK' was not handled by any navigator"): the back control's `router.back()` assumed a previous screen always exists, which breaks on a fresh page load or deep link straight into `/restaurant/[id]` (no history to go back to) — reachable in practice via a browser hard-refresh. Corrected FR-004 and acceptance scenario 4: the back control now checks `router.canGoBack()` first and falls back to Home. |
