# Feature Specification: Restaurant (detail)

**Feature**: `restaurant` — folder `src/features/restaurant/`
**Created**: 2026-07-23
**Status**: In Progress — User Story 1 and User Story 2 Implemented (mock data); User Stories 3–7 not started
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
4. **Given** the user taps the back control, **when** the tap happens, **then** the app returns to wherever it came from (Home, map results, favorites, or similar-places on another restaurant's detail).

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

### User Story 3 - See practical info before committing (Priority: P2)

A user weighing whether to go can check what the place offers (wifi, parking, accessibility, etc.), when it's open, and any rules that might affect their visit (cancellation policy, dress code, safety notes).

**Why this priority**: reduces the chance of a wasted trip or an unpleasant surprise — real value, but the user can still act (via User Story 2) without reading this first.

**Independent test**: on `/restaurant/[id]`, confirm the amenities preview shows a subset with a "show all" control that opens the full list in a sheet; tap "Opening Hours," confirm a 7-day schedule renders.

**Acceptance scenarios**:

1. **Given** the detail screen, **when** it renders, **then** a preview of amenities (icon + label) shows, capped at a small number, with a control to see the full list.
2. **Given** the amenities preview, **when** the user taps "show all N amenities," **then** a sheet opens listing every amenity.
3. **Given** the detail screen, **when** the user taps "Opening Hours," **then** a sheet opens showing hours for every day of the week, plus any holiday-hours note.
4. **Given** the detail screen, **when** it renders, **then** a "Things to know" section shows title+text pairs (e.g. cancellation policy, house rules, safety & property) without needing a tap.

---

### User Story 4 - See reviews and highlights (Priority: P2)

A user checks social proof — what other people say, and the standout qualities other diners flagged — before deciding.

**Why this priority**: a strong trust signal, on par with practical info, but not required to complete an action.

**Independent test**: confirm one review preview renders with a "view all N reviews" control that opens the full list in a sheet; confirm the highlights row renders independent of the reviews section.

**Acceptance scenarios**:

1. **Given** the detail screen, **when** it renders, **then** the overall rating and one preview review (reviewer, time, star rating, text) show.
2. **Given** the review preview, **when** the user taps "view all N reviews," **then** a sheet opens listing every review for that restaurant.
3. **Given** the detail screen, **when** it renders, **then** a row of highlight badges (e.g. "Fast service," "Big Portions," "Variety") shows without requiring interaction.

---

### User Story 5 - Browse the restaurant's Instagram (Priority: P3)

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
- **Description shorter than the truncation threshold**: "see more" control should not render at all (nothing to expand).
- **Zero reviews**: the preview review + "view all N reviews" control should not render, or should render an explicit empty state — **[NEEDS CLARIFICATION: which? Not specified by the design, which only shows restaurants with reviews.]**
- **Single photo**: next/previous controls and the counter badge should either hide or be disabled — showing "1/1" with working-looking arrows that do nothing would be a bug.
- **Amenities list shorter than the preview cap**: the "show all N amenities" control should not render (nothing more to show).
- **Rapid double-tap on the like icon**: must not desync from the global store's actual state (no flicker between favorited/not across taps).

## Functional Requirements

- **FR-001**: The system MUST display, for the restaurant matching the route's `id`, its name, description, tags, address, price level, and rating.
- **FR-002**: The system MUST display a photo gallery with next/previous navigation and a position counter (e.g. "2/3"), when the restaurant has more than one photo.
- **FR-003**: The system MUST truncate long descriptions with a "see more" affordance that expands to the full text on tap, and collapses again on a second tap.
- **FR-004**: The user MUST be able to navigate back to the previous screen from the detail screen.
- **FR-005**: The system MUST provide four quick actions — Menu, Takeaway, Delivery, Reserve — each opening a sheet with its own content.
- **FR-006**: The Menu sheet MUST list menu items with their prices.
- **FR-007**: The Takeaway and Delivery sheets MUST list simulated redirect options to third-party services (e.g. iFood, Uber Eats, the restaurant's own site).
- **FR-008**: The Reserve sheet MUST provide a single confirmation action that simulates completing a reservation.
- **FR-009**: The system MUST display a capped preview of amenities with an option to view the full list.
- **FR-010**: The system MUST display the restaurant's opening hours for all seven days of the week, plus any holiday-hours note, on request.
- **FR-011**: The system MUST display a "Things to know" section (title + text entries) without requiring a tap.
- **FR-012**: The system MUST display the overall rating and one preview review, with an option to view all reviews.
- **FR-013**: The system MUST display a row of highlight badges.
- **FR-014**: The system MUST display the restaurant's Instagram handle, a preview photo grid, and a toggleable Follow/Following control (local UI state only — no real Instagram integration).
- **FR-015**: The system MUST display a "Similar Places" rail; tapping an entry MUST navigate to that restaurant's own detail screen.
- **FR-016**: The user MUST be able to toggle a restaurant's favorited state from the detail screen, reflecting and updating the shared favorites store defined in `favorites.md`.
- **FR-017**: The system MUST display contact options (phone, WhatsApp, Instagram) in a dedicated sheet, each simulating a redirect to the respective app. *(Ownership gap found during US1/US2 implementation: this FR isn't referenced by any User Story's acceptance scenarios. Deferred alongside Opening Hours — needs a home, likely a new User Story 3b or folded into US3, before it's built.)*
- **FR-018**: The system MUST display a tappable address that opens a sheet offering to open the location in a maps app (simulated redirect). *(Same gap as FR-017 — not covered by US1's acceptance scenarios despite address display being part of US1. The address currently renders as plain text, not tappable. Needs the same story-ownership fix before implementing the tap behavior.)*

### Key Entities

- **RestaurantDetail**: the full record for a single restaurant — extends the base `Restaurant` shape (id, name, photo, rating, priceLevel) used elsewhere in the app with everything the detail screen needs: `photos` (gallery, plural), `description`, `tags`, `addressShort`, `reviewCount`, `amenities`, `highlights`, `thingsToKnow`, `instagram` (handle), `reviews`, `openingHours`.
- **MenuItem**: a single line in the Menu sheet — name, price (display string, e.g. `"R$ 89"` — not a structured currency amount at this stage).
- **Review**: a single review — reviewer initial/name, relative time, star rating, text.
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
- **Reuses from `src/components/ui/`**: `RestaurantCard` (Similar Places rail), `HorizontalRail` (Similar Places rail, Instagram photo grid if a grid layout isn't a better fit — decide at implementation time), `BottomSheet` (every quick-action and info sheet on this screen), `RatingBadge`.
- **Reuses from `src/components/layout/`**: `SearchBar` (overlaid on the photo gallery, matching the design). Does NOT reuse `SideMenu` — the header icon stack on this screen (location/settings/profile/share) is a different, screen-specific set of icons, not the Home hamburger menu; implement it as `features/restaurant/components/DetailHeaderActions.tsx` unless/until another screen needs the same icon stack.
- **Global state**: yes — reads and writes `src/stores/favorites.ts` (contract defined in `favorites.md`) for User Story 7. This is the first feature to actually consume that store; implementing it here is what turns `stores/favorites.ts` from a documented decision into real code — coordinate with `favorites.md`'s implementation, don't invent a second, divergent favorites API here.
- **Types**: `RestaurantDetail`, `MenuItem`, `Review`, `Amenity`, `ThingToKnow`, `OpeningHours` all live in `src/features/restaurant/types/` (detail-specific, not shared) and `RestaurantDetail` extends the shared `Restaurant` from `src/types/restaurant.ts` rather than duplicating its fields.
- **Mocks**: new `src/mocks/restaurantDetails.ts`, keyed by restaurant `id`, distinct from `src/mocks/restaurants.ts` (which only carries the summary shape used by list/card contexts). `useRestaurantDetailQuery(id)` in this feature's `api/` reads from it.
- **New dependencies**: none required. `PhotoCarousel` should be built with a plain `ScrollView` (paged) or `FlatList`, not a third-party carousel library — this screen's interaction (next/prev buttons + swipe) doesn't need one.

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
