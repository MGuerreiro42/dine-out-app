# Feature Specification: Profile

**Feature**: `profile` — folder `src/features/profile/`
**Created**: 2026-07-23
**Status**: Draft
**Design reference**: `App Flow.dc.html`, frames "6 · Profile", "8 · My Orders", "9 · My Reservations", "10 · Payment Methods", "11 · Notifications"

<!--
Naming note: PROJECT.md's "Known gap" left this open between `profile` and `account`.
Chosen `profile` to match the existing route (`app/(tabs)/profile.tsx`) and this project's
established pattern of route name = feature name (`restaurant` → detail route, `search` →
Home/explore routes). Low-cost to rename later if it turns out wrong.
-->

## Summary

The screen fills the gap PROJECT.md flagged: everything on the Profile tab that isn't the favorites rail (that's `favorites.md`'s User Story 2 — this spec composes the same route but doesn't redefine that part). Covers who the user is (avatar, name, email, activity stats), and the account menu, which now leads to four real screens — Orders, Reservations, Payment Methods, Notifications — rather than placeholder sheets. Only "Sair da conta" stays a sheet, since there's no screen to navigate to for logging out and no real auth system to log out of.

## User Stories

### User Story 1 - View my profile (Priority: P1)

A user opens the Profile tab and sees who they are (avatar, name, email) and a snapshot of their activity (how many favorites, orders, and reservations they have).

**Why this priority**: the screen's baseline reason to exist — without it, Profile is an empty tab.

**Independent test**: open the Profile tab, confirm avatar initial/name/email render from the mocked current-user record, confirm the three stat numbers render (favorites count reflects the real global favorites store if `favorites.md` is implemented, otherwise 0; orders/reservations counts match the length of this feature's own mock lists — see User Stories 3-4).

**Acceptance scenarios**:

1. **Given** the Profile tab, **when** it renders, **then** it shows the current user's avatar initial, name, and email from a mocked "current user" record — not placeholder text.
2. **Given** the Profile tab, **when** it renders, **then** it shows three stat numbers side by side: favorites count, orders count, reservations count.
3. **Given** zero restaurants are favorited, **when** the favorites stat renders, **then** it shows `0`, not a blank or an error.
4. **Given** one or more restaurants are favorited (via `stores/favorites.ts`, once `favorites.md` is implemented), **when** the Profile tab renders or re-renders, **then** the favorites stat matches the actual count in the store — no separate, potentially-stale counter.
5. **Given** the orders and reservations mock lists (User Stories 3-4), **when** the stats row renders, **then** the orders/reservations counts equal those lists' actual lengths — not an independently-hardcoded number that could drift from what "Meus pedidos"/"Minhas reservas" actually show.

---

### User Story 2 - Browse account options (Priority: P2)

A user sees a list of account-related actions and can get to each one — four lead to a real screen (Orders, Reservations, Payment Methods, Notifications), one (Sair da conta) opens a sheet.

**Why this priority**: completes the screen visually and structurally, and is the entry point for User Stories 3-6 — but the app is fully usable without it (Home and restaurant detail don't depend on it).

**Independent test**: tap each of Meus pedidos / Minhas reservas / Formas de pagamento / Notificações, confirm each navigates to its own screen with a working back control; tap Sair da conta, confirm a sheet opens instead (no navigation); confirm Sair da conta is visually distinguished (red/danger styling) from the other four.

**Acceptance scenarios**:

1. **Given** the Profile tab, **when** it renders, **then** a list of 5 account options shows: "Meus pedidos," "Minhas reservas," "Formas de pagamento," "Notificações," "Sair da conta."
2. **Given** the account option list, **when** the user taps "Meus pedidos," "Minhas reservas," "Formas de pagamento," or "Notificações," **then** the app navigates to that option's dedicated screen (User Stories 3-6).
3. **Given** the account option list, **when** the user taps "Sair da conta," **then** a sheet opens with a simulated-logout message — no navigation, no real session exists to end.
4. **Given** "Sair da conta" in the list, **when** it renders, **then** its text is visually styled as a destructive/danger action (different color from the other four), matching the design.

---

### User Story 3 - My Orders (Priority: P3)

A user taps "Meus pedidos" and sees a list of past orders — which restaurant, delivery or takeaway, when, what was ordered, status, and total — and can tap one to revisit that restaurant.

**Why this priority**: read-only history view, useful but not blocking any other flow in the app.

**Independent test**: navigate to My Orders from Profile, confirm the list renders with restaurant photo/name, a status badge, type + date, an item summary, and a total per order; tap an order, confirm navigation to that restaurant's detail screen; tap back, confirm return to Profile.

**Acceptance scenarios**:

1. **Given** the My Orders screen, **when** it renders, **then** each order shows the restaurant's photo and name, a status badge (e.g. "Entregue," "Cancelado," each with distinct badge coloring), the order type ("Delivery · iFood," "Takeaway," etc.) and date, an item summary, and a total price.
2. **Given** the order list, **when** the user taps an order, **then** the app navigates to that order's restaurant detail screen (reuses the existing restaurant-detail navigation, real restaurant `id`).
3. **Given** the My Orders screen, **when** the user taps back, **then** the app returns to the Profile tab.

---

### User Story 4 - My Reservations (Priority: P3)

A user taps "Minhas reservas" and sees a list of table reservations — restaurant, status, date/time, party size — and can tap one to revisit that restaurant.

**Why this priority**: same as User Story 3 — read-only history, not blocking.

**Independent test**: navigate to My Reservations from Profile, confirm each reservation shows restaurant, status badge, date/time, and party size; tap one, confirm navigation to that restaurant's detail.

**Acceptance scenarios**:

1. **Given** the My Reservations screen, **when** it renders, **then** each reservation shows the restaurant's photo and name, a status badge (e.g. "Confirmada," "Concluída," distinct coloring per status), the date and time, and the number of people.
2. **Given** the reservation list, **when** the user taps a reservation, **then** the app navigates to that reservation's restaurant detail screen.
3. **Given** the My Reservations screen, **when** the user taps back, **then** the app returns to the Profile tab.

---

### User Story 5 - Payment Methods (Priority: P3)

A user taps "Formas de pagamento" and sees their saved cards, and can tap to add a new one (simulated).

**Why this priority**: read-only-plus-one-simulated-action, lowest urgency of the four new screens — no purchase flow in the app actually needs a selected payment method yet.

**Independent test**: navigate to Payment Methods from Profile, confirm each saved card shows brand, last 4 digits, expiry, and a "Padrão" (default) badge on the default card only; tap "+ Adicionar cartão," confirm a simulated response (no real card-entry form).

**Acceptance scenarios**:

1. **Given** the Payment Methods screen, **when** it renders, **then** each saved card shows its brand, last 4 digits, and expiry date.
2. **Given** a card marked as default, **when** it renders, **then** it shows a "Padrão" badge; non-default cards don't.
3. **Given** the Payment Methods screen, **when** the user taps "+ Adicionar cartão," **then** a simulated response occurs (e.g. an alert) — no real card-entry form, no real payment processor integration.

---

### User Story 6 - Notifications (Priority: P3)

A user taps "Notificações" and sees a list of notification categories, each with a toggle they can actually switch on and off.

**Why this priority**: lowest urgency — a preferences screen with no downstream effect on the rest of the app (nothing currently sends notifications).

**Independent test**: navigate to Notifications from Profile, confirm each row shows a label, a description, and a toggle reflecting its current on/off state; tap a toggle, confirm it flips and the visual state updates (unlike everything else on this screen and its siblings, this is real local state, not a simulated no-op).

**Acceptance scenarios**:

1. **Given** the Notifications screen, **when** it renders, **then** each notification category shows a label, a short description, and a toggle switch reflecting whether it's currently enabled.
2. **Given** a toggle in its current state, **when** the user taps it, **then** it flips to the opposite state and the switch's visual position/color updates immediately.
3. **Given** the user has toggled some settings, **when** they navigate away and back to the Notifications screen (without leaving the app / reloading), **then** the toggled states persist for the session (local component state is enough — see Architecture Mapping; no requirement to persist across app restarts).

---

### Edge Cases

- **Favorites count when `favorites.md`'s store doesn't exist yet**: if `stores/favorites.ts` isn't implemented when this feature is built, the favorites stat shows `0` rather than crashing or showing an error — treat a missing/empty store the same as an empty one.
- **Long user name/email**: no truncation behavior specified by the design — assume single-line, let it wrap or truncate per platform default unless it visibly breaks the layout at implementation time.
- **Empty orders/reservations lists**: not shown in the design (the mock always has 2-3 entries) — **[NEEDS CLARIFICATION: should My Orders/My Reservations show an explicit empty state if the mock list were empty? Not currently reachable since the mock is hardcoded non-empty, but worth deciding before this becomes reachable (e.g. if the mock data changes).]**
- **Order/reservation referencing a restaurant id that doesn't resolve**: same failure mode as `restaurant.md`'s "restaurant not found" case — should behave the same way (that screen's existing fallback), not a new one invented here.

## Functional Requirements

- **FR-001**: The system MUST display the current user's avatar initial, name, and email at the top of the Profile screen, from a mocked current-user record (no login system exists — see Assumptions).
- **FR-002**: The system MUST display three stats side by side: favorites count, orders count, reservations count.
- **FR-003**: The favorites count MUST reflect the actual number of favorited restaurant ids in the shared global favorites store (`src/stores/favorites.ts`, contract owned by `favorites.md`), not a separately-tracked number.
- **FR-004**: The orders and reservations counts MUST equal the length of this feature's own mock `orders`/`reservations` lists (User Stories 3-4) — resolved: previously these were going to be arbitrary static numbers with nothing behind them; now that real (mock) lists exist, deriving the count from them avoids a second source of truth that could drift.
- **FR-005**: The system MUST display a list of 5 account options: Meus pedidos, Minhas reservas, Formas de pagamento, Notificações, Sair da conta.
- **FR-006**: Tapping Meus pedidos, Minhas reservas, Formas de pagamento, or Notificações MUST navigate to that option's own screen.
- **FR-007**: Tapping Sair da conta MUST open a sheet with a simulated-logout message and MUST NOT perform a real logout (no session exists — see Assumptions). It MUST be visually distinguished (danger/destructive styling) from the other four options.
- **FR-008**: The My Orders screen MUST list each order's restaurant photo/name, status badge, type, date, item summary, and total.
- **FR-009**: Tapping an order MUST navigate to that order's restaurant detail screen.
- **FR-010**: The My Reservations screen MUST list each reservation's restaurant photo/name, status badge, date, time, and party size.
- **FR-011**: Tapping a reservation MUST navigate to that reservation's restaurant detail screen.
- **FR-012**: The Payment Methods screen MUST list each saved card's brand, last 4 digits, and expiry, with a distinct badge on whichever card is marked default.
- **FR-013**: The Payment Methods screen MUST provide an "Adicionar cartão" action that simulates a response — no real card-entry form.
- **FR-014**: The Notifications screen MUST list notification categories with a label, description, and a toggle reflecting current enabled state.
- **FR-015**: Tapping a notification toggle MUST flip its enabled state and update the visual immediately — real local interactivity, not a simulated message.

### Key Entities

- **UserProfile**: the mocked "current user" — initial (avatar letter), name, email. A single hardcoded record, not a list — this project has no multi-user or auth concept yet.
- **AccountOption**: id, label, a `danger` flag (true only for Sair da conta), and either an `href`-equivalent (which screen it navigates to) or an "opens a sheet" marker for the logout case.
- **Order**: restaurant reference, status (+ status color/bg), type (delivery/takeaway + provider), date, item summary text, total price (display string, same "not a structured currency amount" treatment as `restaurant.md`'s `MenuItem`).
- **Reservation**: restaurant reference, status (+ status color/bg), date, time, party size.
- **PaymentMethod**: brand, last 4 digits, expiry, `isDefault` flag.
- **NotificationSetting**: id, label, description, enabled (boolean).

## Success Criteria

- **SC-001**: The Profile tab never shows placeholder text ("Profile") once this is implemented — it shows real (mocked) identity and stats immediately, no loading state needed (mock resolves instantly, same as every other feature).
- **SC-002**: The favorites stat and the Profile favorites rail (`favorites.md`) never disagree with each other — both read the same store, so this is true by construction, not by syncing two counters. Same construction-level guarantee for orders/reservations stats vs. their own list screens (FR-004).
- **SC-003**: All 5 account options produce a distinct, working response when tapped — 4 real screens, 1 sheet, none is a dead tap target.
- **SC-004**: A user can go from Profile to any order/reservation's restaurant detail in exactly 2 taps (1 to open My Orders/My Reservations, 1 to tap the specific entry).

## Architecture Mapping

- **Feature folder**: `src/features/profile/{api,components,types}`. No `stores/` needed — this feature reads the global favorites store (owned by `favorites.md`) but doesn't own any global state; which sheet is open, and each notification's toggle state, are local `useState`.
- **Reuses from `src/components/ui/`**: `BottomSheet` (Sair da conta only, now — the other four moved off the sheet pattern).
- **Reuses from `src/components/layout/`**: none — the Profile screen's header (avatar/name/email) is bespoke to this feature, not the app-wide `SearchBar`/`SideMenu` chrome used on Home/detail. The four new sub-screens use a simple back-button-plus-title header, not `SearchBar`/`SideMenu` either.
- **Global state**: reads (does not write) `src/stores/favorites.ts` for FR-003 — depends on `favorites.md` being implemented first, or at least having its store contract in place, for the favorites count to be anything other than 0. If `favorites.md` hasn't landed yet when this feature is picked up, either implement `stores/favorites.ts` as part of this work (coordinate so the contract isn't defined twice, same rule as `restaurant.md`/`favorites.md`) or ship with a hardcoded 0 and revisit.
- **Types**: `UserProfile`, `AccountOption`, `Order`, `Reservation`, `PaymentMethod`, `NotificationSetting` all live in `src/features/profile/types/` — none shared with another feature.
- **Mocks**: new `src/mocks/currentUser.ts` (one `UserProfile` record), `src/mocks/orders.ts`, `src/mocks/reservations.ts`, `src/mocks/paymentMethods.ts`, `src/mocks/notificationSettings.ts`. Orders/reservations mocks reference real entries from `src/mocks/restaurants.ts`, same cross-mock reference pattern already used by the design (not a new pattern to invent).
- **New dependencies**: none.
- **Routes**: `app/(tabs)/profile.tsx` (currently a placeholder) for User Stories 1-2, plus four new nested routes for User Stories 3-6: `app/profile/orders.tsx`, `app/profile/reservations.tsx`, `app/profile/payment.tsx`, `app/profile/notifications.tsx`. A tab route (`app/(tabs)/profile.tsx`) and a same-named stack folder (`app/profile/`) coexist without conflict in Expo Router — the four new screens are pushed onto the stack from the tab, not tabs themselves.
- **Sequencing note (unchanged from the previous draft)**: `profile` (this spec) and `favorites.md`'s User Story 2 (the favorites rail) compose the *same* `app/(tabs)/profile.tsx` screen. Whichever lands first should leave a sensible layout for the second to slot into (header → stats → favorites rail → account menu, matching the design's actual order).

## Out of Scope

- The favorites rail itself — that's `favorites.md`'s User Story 2, not redefined here.
- Any real orders/reservations backend, cancellation, rebooking, or filtering — Orders/Reservations are read-only mock lists, display only.
- Real payment processing or card entry — "Adicionar cartão" is simulated, no PCI-relevant form exists or should be built here.
- Real push notifications — the Notifications screen's toggles are real local UI state, but nothing in the app actually sends a notification based on them.
- Real authentication/login/logout — "Sair da conta" is simulated; see PROJECT.md's "Future direction — authentication" note for why this is deliberate, not deferred by oversight.
- Editing profile info (name, email, avatar) — the design doesn't show an edit affordance on this frame.

## Assumptions and Dependencies

- Exactly one mocked "current user" exists; there's no login, so there's no concept of switching users or an empty/logged-out state.
- Depends on `app/(tabs)/profile.tsx` existing as a route (it does, currently a placeholder).
- Depends on `src/stores/favorites.ts` for a meaningful (non-zero) favorites count — see Architecture Mapping.
- Depends on `app/restaurant/[id]` existing (it does) for Orders/Reservations tap-through navigation.
- Notification toggle state resets on app reload — no persistence requirement stated by the design, consistent with `favorites.md`'s own "in-memory is fine for this prototype phase" precedent.

## Notes for the AI Agent

- Check `favorites.md`'s `Status` before starting User Story 1: if its store isn't implemented yet, decide with the user whether to build `stores/favorites.ts` as part of this work or ship with a 0 placeholder.
- Before building Payment Methods' "Adicionar cartão" simulated response, reuse `restaurant.md`'s `RedirectOptionsSheetContent`/`Alert.alert` pattern rather than inventing a new one.
- User Stories 3-4 (Orders, Reservations) share a near-identical layout (photo + name + status badge + a couple of detail lines) — consider one shared list-row component parametrized by content, rather than two near-duplicate ones, but don't force it if the shapes diverge enough once actually built.
- Verification: `npx tsc --noEmit` clean, `npx jest`, bundle smoke test on `/profile`, `/profile/orders`, `/profile/reservations`, `/profile/payment`, `/profile/notifications` per the pattern in the root `CLAUDE.md`.

## Changelog

| Date | Change |
|------|--------|
| 2026-07-23 | Spec created. No implementation yet. |
| 2026-07-23 | Design updated (`App Flow.dc.html` grew from ~66KB to ~89KB) — corrected User Story 2 (4 of 5 account options now navigate to real screens, not sheets) and added User Stories 3-6 (My Orders, My Reservations, Payment Methods, Notifications) plus their FRs/types/mocks/routes. Resolved the previous FR-004 `[NEEDS CLARIFICATION]` about orders/reservations counts — they now derive from real (mock) lists instead of being arbitrary numbers. Still no implementation. |
