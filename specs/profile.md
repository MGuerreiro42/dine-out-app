# Feature Specification: Profile

**Feature**: `profile` — folder `src/features/profile/`
**Created**: 2026-07-23
**Status**: In Progress — User Stories 1 and 2 Implemented; User Stories 3-6 not started
**Design reference**: `App Flow.dc.html`, frames "6 · Profile" (implemented), "8 · My Orders", "9 · My Reservations", "10 · Payment Methods", "11 · Notifications" (all four pending — reachable today as trivial placeholder screens, see Architecture Mapping)

<!--
Naming note: PROJECT.md's "Known gap" left this open between `profile` and `account`.
Chosen `profile` to match the existing route (`app/(tabs)/profile.tsx`) and this project's
established pattern of route name = feature name (`restaurant` → detail route, `search` →
Home/explore routes). Low-cost to rename later if it turns out wrong.
-->

## Summary

The screen fills the gap PROJECT.md flagged: everything on the Profile tab that isn't the favorites rail (that's `favorites.md`'s User Story 2 — this spec composes the same route but doesn't redefine that part). Covers who the user is (avatar, name, email, activity stats) — with a real logged-out "Visitante" alternative, per the design's own frame — and the account menu, which navigates to four real routes (Orders, Reservations, Payment Methods, Notifications; currently trivial placeholders, their real content is User Stories 3-6) rather than placeholder sheets. "Sair da conta" performs a real logout via `stores/auth.ts` (built as part of this spec, ahead of `auth.md` itself — see Architecture Mapping).

## User Stories

### User Story 1 - View my profile (Priority: P1) — **Implemented**

A user opens the Profile tab and sees who they are (avatar, name, email) and a snapshot of their activity (how many favorites, orders, and reservations they have) — or, if logged out, a "Visitante" placeholder and a way to log in.

**Why this priority**: the screen's baseline reason to exist — without it, Profile is an empty tab.

**Independent test**: open the Profile tab, confirm avatar initial/name/email render from the mocked current-user record, confirm the three stat numbers render (favorites count reflects the real global favorites store; orders/reservations show `0` until User Stories 3-4 exist); flip `isLoggedIn` to false (via the account menu's logout), confirm the screen switches to the "Visitante" view.

**Acceptance scenarios**:

1. **Given** the Profile tab with `isLoggedIn` true, **when** it renders, **then** it shows the current user's avatar initial, name, and email from a mocked "current user" record — not placeholder text.
2. **Given** the Profile tab with `isLoggedIn` true, **when** it renders, **then** it shows three stat numbers side by side: favorites count, orders count, reservations count.
3. **Given** zero restaurants are favorited, **when** the favorites stat renders, **then** it shows `0`, not a blank or an error.
4. **Given** one or more restaurants are favorited (via `stores/favorites.ts`), **when** the Profile tab renders or re-renders, **then** the favorites stat matches the actual count in the store — no separate, potentially-stale counter.
5. **Given** User Stories 3-4 aren't implemented yet, **when** the stats row renders, **then** orders/reservations show `0` — same treatment as the favorites-count-when-store-missing edge case, applied to these two not-yet-built lists (see Edge Cases). Revisit once their real mock lists exist.
6. **Given** the Profile tab with `isLoggedIn` false, **when** it renders, **then** it shows a 👤 placeholder avatar, "Visitante," and a short subtitle instead of real identity/stats.
7. **Given** the logged-out view, **when** it renders, **then** it shows an "Entrar ou criar conta" CTA (navigates to `auth.md`'s login screen — a placeholder route for now, see Architecture Mapping) and a "Descubra sem sair da conta" section with 3 links (Explorar restaurantes → Home, Buscar no mapa → Search tab, Preferências de notificação → the Notifications placeholder).

---

### User Story 2 - Browse account options (Priority: P2) — **Implemented**

A user sees a list of account-related actions and can get to each one — four lead to a real screen (Orders, Reservations, Payment Methods, Notifications), one (Sair da conta) performs a real, immediate logout.

**Why this priority**: completes the screen visually and structurally, and is the entry point for User Stories 3-6 — but the app is fully usable without it (Home and restaurant detail don't depend on it).

**Independent test**: tap each of Meus pedidos / Minhas reservas / Formas de pagamento / Notificações, confirm each navigates (with a working back control) to a screen — currently a trivial "Em breve" placeholder, see Edge Cases; tap Sair da conta, confirm `isLoggedIn` immediately flips to false (no navigation, no confirmation step) and the screen switches to the logged-out view; Sair da conta is visually distinguished (red/danger styling) from the other four.

**Acceptance scenarios**:

1. **Given** the Profile tab with `isLoggedIn` true, **when** it renders, **then** a list of 5 account options shows: "Meus pedidos," "Minhas reservas," "Formas de pagamento," "Notificações," "Sair da conta."
2. **Given** the account option list, **when** the user taps "Meus pedidos," "Minhas reservas," "Formas de pagamento," or "Notificações," **then** the app navigates to that option's dedicated screen — real navigation today, to a placeholder screen pending User Stories 3-6's actual content.
3. **Given** the account option list, **when** the user taps "Sair da conta," **then** `stores/auth.ts`'s real `logout()` runs immediately — `isLoggedIn` becomes false, no navigation, no confirmation sheet, and the Profile tab re-renders as the logged-out view (User Story 1).
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

- **Favorites count, resolved**: `stores/favorites.ts` was built as part of this round (ahead of `favorites.md` itself — see Architecture Mapping), so the favorites stat is real from day one, not a `0` placeholder as originally anticipated.
- **Orders/reservations counts, still `0`**: US3-4's mock lists don't exist yet, so `orderCount`/`reservationCount` are hardcoded `0` for now — same "treat a missing list the same as an empty one" logic originally reserved for the favorites count, applied here instead since favorites resolved first. Revisit once US3-4 land.
- **The 4 account-menu destinations are trivial placeholders, not their real content**: `app/profile/{orders,reservations,payment,notifications}.tsx` exist as real routes (a shared `PlaceholderScreen` component, back button + "Em breve") so FR-006's navigation requirement is genuinely true today — but their actual list/content (FR-008 through FR-015) is still User Stories 3-6, not started.
- **Long user name/email**: no truncation behavior specified by the design — assume single-line, let it wrap or truncate per platform default unless it visibly breaks the layout at implementation time.
- **Empty orders/reservations lists**: not shown in the design (the mock always has 2-3 entries) — **[NEEDS CLARIFICATION: should My Orders/My Reservations show an explicit empty state if the mock list were empty? Not currently reachable since the mock is hardcoded non-empty, but worth deciding before this becomes reachable (e.g. if the mock data changes).]**
- **Order/reservation referencing a restaurant id that doesn't resolve**: same failure mode as `restaurant.md`'s "restaurant not found" case — should behave the same way (that screen's existing fallback), not a new one invented here.
- **Design inconsistency found and corrected**: the "6 · Profile" frame still shows a `‹` back arrow to Home, leftover from before the bottom tab bar existed. Dropped, same as the category page's identical leftover arrow — Profile is a tab-bar root, not a stack-pushed screen.
- **`app/login.tsx` is a placeholder, not `auth.md`'s real login screen**: the "Entrar ou criar conta" CTA needed somewhere real to navigate to before `auth.md`'s own round builds the actual Login/Signup content — scaffolded now as the same `PlaceholderScreen`, at the exact route `auth.md`'s own Architecture Mapping already reserves.

## Functional Requirements

- **FR-001 — Implemented**: The system MUST display the current user's avatar initial, name, and email at the top of the Profile screen when `isLoggedIn` is true, from a mocked current-user record; when `isLoggedIn` is false, it MUST instead display a placeholder avatar, "Visitante," and a short subtitle — **corrected**: the design's own frame branches on `isLoggedIn` for this exact header, so rendering the logged-out state is this screen's concern after all (see Assumptions).
- **FR-002 — Implemented**: The system MUST display three stats side by side (favorites/orders/reservations counts), only when `isLoggedIn` is true.
- **FR-003 — Implemented**: The favorites count MUST reflect the actual number of favorited restaurant ids in the shared global favorites store (`src/stores/favorites.ts`).
- **FR-004 — Partially implemented**: The orders and reservations counts MUST equal the length of this feature's own mock `orders`/`reservations` lists (User Stories 3-4) — until those lists exist, both show `0` (see Edge Cases).
- **FR-005 — Implemented**: The system MUST display a list of 5 account options: Meus pedidos, Minhas reservas, Formas de pagamento, Notificações, Sair da conta — only when `isLoggedIn` is true.
- **FR-006 — Implemented**: Tapping Meus pedidos, Minhas reservas, Formas de pagamento, or Notificações MUST navigate to that option's own screen — currently a placeholder (see Edge Cases).
- **FR-007 — Implemented**: Tapping Sair da conta MUST perform the real logout (`stores/auth.ts`'s `logout()`) — **corrected**: previously specified as a purely simulated sheet, but the design's Sidebar Menu frame gives logout real, immediate effect with no confirmation, and having two different logout behaviors depending on entry point would be a real inconsistency, not a defensible design choice. It MUST still be visually distinguished (danger/destructive styling) from the other four options.
- **FR-016 — Implemented, new**: When `isLoggedIn` is false, the system MUST display an "Entrar ou criar conta" CTA (navigates to the login placeholder route) and a "Descubra sem sair da conta" section with 3 links to Home, the Search tab, and the Notifications placeholder.
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
- **AccountOption**: id, label, a `danger` flag (true only for Sair da conta) — **corrected**: no `href`/route field on the entity itself; the `id → route` mapping (and the logout special-case) lives in `app/(tabs)/profile.tsx`, keeping `features/profile/components` routing-agnostic, same convention as `DiscoveryCard`/`RestaurantCard`. Plain TS type, not Zod — local static config, never crosses a wire boundary.
- **Order**: restaurant reference, status (+ status color/bg), type (delivery/takeaway + provider), date, item summary text, total price (display string, same "not a structured currency amount" treatment as `restaurant.md`'s `MenuItem`).
- **Reservation**: restaurant reference, status (+ status color/bg), date, time, party size.
- **PaymentMethod**: brand, last 4 digits, expiry, `isDefault` flag.
- **NotificationSetting**: id, label, description, enabled (boolean).

## Success Criteria

- **SC-001**: The Profile tab never shows placeholder text ("Profile") once this is implemented — it shows real (mocked) identity and stats immediately, no loading state needed (mock resolves instantly, same as every other feature).
- **SC-002**: The favorites stat and the Profile favorites rail (`favorites.md`) never disagree with each other — both read the same store, so this is true by construction, not by syncing two counters. Same construction-level guarantee for orders/reservations stats vs. their own list screens (FR-004).
- **SC-003**: All 5 account options produce a distinct, working response when tapped — 4 real screens, 1 real logout action, none is a dead tap target.
- **SC-004**: A user can go from Profile to any order/reservation's restaurant detail in exactly 2 taps (1 to open My Orders/My Reservations, 1 to tap the specific entry).

## Architecture Mapping

- **Feature folder — Implemented**: `src/features/profile/{api,components,types}`, exactly as planned, no `stores/`/`hooks/` — which sub-screen to push and each option's press behavior are handled by the route file, not local feature state.
- **Components**: `ProfileHeader` (branches on `isLoggedIn`), `ProfileStats`, `AccountOptionsList` (takes `options` + a single `onPress(id)` callback — no `BottomSheet` involved anymore, matches the corrected FR-007), `LoggedOutPrompt` (CTA + the 3 alternate-discovery links). The route (`app/(tabs)/profile.tsx`) owns all navigation — features stay routing-agnostic, same convention as `DiscoveryCard`/`RestaurantCard`.
- **Reuses from `src/components/layout/`**: none — the Profile screen's header (avatar/name/email) is bespoke to this feature, not the app-wide `SearchBar`/`SideMenu` chrome used on Home/detail.
- **New shared `src/components/ui/PlaceholderScreen.tsx`**: back-header (`‹` + title, `router.canGoBack()`-guarded) + "Em breve." body. 5 call sites this round (the 4 account-menu destinations + `app/login.tsx`) — justifies a shared component now rather than 5 near-duplicate files. Will be replaced call-site-by-call-site as US3-6 and `auth.md`'s login get their real content.
- **Global state — both built this round**:
  - `src/stores/favorites.ts` — built here, ahead of `favorites.md` itself, per the user's explicit choice (favorites.md's own spec already anticipates "whichever spec is picked up first defines the contract"). Contract matches `favorites.md`'s spec exactly: `{ favoriteIds: Set<number>, toggleFavorite(id), isFavorite(id) }`, no persistence.
  - `src/stores/auth.ts` — built here too, ahead of `auth.md`, for the same reason (this screen's own `isLoggedIn` branching and FR-007's logout both need it). Contract matches `auth.md`'s spec exactly: `{ isLoggedIn, login(), logout() }`. Default `isLoggedIn: true` — matches the design's own mock default; `auth.md`'s own `[NEEDS CLARIFICATION]` about the "real" first-run default is untouched, still open.
- **Types**: `UserProfile` in shared `src/types/userProfile.ts` (`initial`/`name`/`email` only — stat counts are derived, not entity fields). `AccountOption` stays in `src/features/profile/types/`.
- **Mocks**: `src/mocks/currentUser.ts` (one `UserProfile` record) + `src/mocks/handlers/currentUser.ts` (`GET /current-user`), same MSW pattern as `discoveryTaxonomies`. `src/features/profile/api/useCurrentUserQuery.ts` mirrors `useDiscoveryTaxonomiesQuery.ts`. `orders.ts`/`reservations.ts`/`paymentMethods.ts`/`notificationSettings.ts` not built yet — deferred to US3-6.
- **Routes — Implemented**: `app/(tabs)/profile.tsx` for User Stories 1-2. `app/profile/{orders,reservations,payment,notifications}.tsx` and `app/login.tsx` exist as real routes (one-line `PlaceholderScreen` usages) so FR-006/the login CTA have somewhere real to navigate today. Confirmed empirically (bundle smoke test): the tab route and the same-named stack folder coexist without conflict, as `auth.md` anticipated.
- **Sequencing note (unchanged from the previous draft)**: `profile` (this spec) and `favorites.md`'s User Story 2 (the favorites rail) compose the *same* `app/(tabs)/profile.tsx` screen. The favorites rail itself is still not built (Out of Scope this round) — whoever picks up `favorites.md` next slots it in between `ProfileStats` and `AccountOptionsList`, matching the design's actual order.

## Out of Scope

- The favorites rail itself — that's `favorites.md`'s User Story 2, not redefined here.
- Any real orders/reservations backend, cancellation, rebooking, or filtering — Orders/Reservations are read-only mock lists, display only.
- Real payment processing or card entry — "Adicionar cartão" is simulated, no PCI-relevant form exists or should be built here.
- Real push notifications — the Notifications screen's toggles are real local UI state, but nothing in the app actually sends a notification based on them.
- Real backend authentication (credential validation, session persistence, OAuth) — that's `auth.md`'s explicit Out of Scope too; "Sair da conta" performs a real client-side state flip (`stores/auth.ts`'s `logout()`), not a real backend session teardown. **Corrected**: an earlier draft of this bullet said "Sair da conta" itself was simulated — it isn't, only the backend behind it is out of scope.
- Editing profile info (name, email, avatar) — the design doesn't show an edit affordance on this frame.

## Assumptions and Dependencies

- Exactly one mocked "current user" exists — there's no multi-account switching.
- **Corrected (this round)**: the previous draft assumed the Profile screen didn't need to render its own logged-out state ("not this screen's concern"). Re-reading the design's actual "6 · Profile" frame markup found that's wrong — the frame has a full `isLoggedIn`-conditional layout right on this screen (see User Story 1, scenarios 6-7), not just in the Sidebar. Both states are implemented here.
- Depends on `app/(tabs)/profile.tsx` existing as a route (it does, now implemented).
- Depends on `src/stores/favorites.ts` for a meaningful (non-zero) favorites count — resolved, built this round.
- Depends on `app/restaurant/[id]` existing (it does) for Orders/Reservations tap-through navigation (still pending — US3-4 not started).
- Notification toggle state resets on app reload — no persistence requirement stated by the design, consistent with `favorites.md`'s own "in-memory is fine for this prototype phase" precedent.

## Notes for the AI Agent

- When starting User Stories 3-6: replace each `PlaceholderScreen` call site with the real screen content, and update `favorites.md`/`auth.md`'s own docs if you touch their store contracts (both already built here — don't recreate them, see Architecture Mapping).
- Before building Payment Methods' "Adicionar cartão" simulated response, reuse `restaurant.md`'s `RedirectOptionsSheetContent`/`Alert.alert` pattern rather than inventing a new one.
- User Stories 3-4 (Orders, Reservations) share a near-identical layout (photo + name + status badge + a couple of detail lines) — consider one shared list-row component parametrized by content, rather than two near-duplicate ones, but don't force it if the shapes diverge enough once actually built.
- Once US3-4's mock lists exist, update `ProfileStats`' `orderCount`/`reservationCount` props (currently hardcoded `0` in `app/(tabs)/profile.tsx`) to derive from those lists' real lengths (FR-004).
- Verification: `npx tsc --noEmit` clean, `npx jest`, bundle smoke test on `/profile`, `/profile/orders`, `/profile/reservations`, `/profile/payment`, `/profile/notifications`, `/login` per the pattern in the root `CLAUDE.md`.

## Changelog

| Date | Change |
|------|--------|
| 2026-07-23 | Spec created. No implementation yet. |
| 2026-07-23 | Design updated (`App Flow.dc.html` grew from ~66KB to ~89KB) — corrected User Story 2 (4 of 5 account options now navigate to real screens, not sheets) and added User Stories 3-6 (My Orders, My Reservations, Payment Methods, Notifications) plus their FRs/types/mocks/routes. Resolved the previous FR-004 `[NEEDS CLARIFICATION]` about orders/reservations counts — they now derive from real (mock) lists instead of being arbitrary numbers. Still no implementation. |
| 2026-07-23 | Design added Sidebar Menu + Login frames (`auth.md` created). Corrected FR-007, the Summary, User Story 2, its independent test, acceptance scenario 3, the AccountOption entity, and the Architecture Mapping's `BottomSheet`-reuse bullet: the fifth account option ("Sair da conta") performs a real, immediate logout via `stores/auth.ts`, not a simulated confirmation sheet. Promoted `UserProfile`/`currentUser` from feature-local to shared `src/types/`/`src/mocks/` — the Sidebar needs the same current-user data. Corrected the Out of Scope and Assumptions bullets that had described logout and the logged-out state as not existing. Still no implementation. |
| 2026-07-24 | User Stories 1-2 implemented on `feat/profile-menu`. Re-reading the design's actual "6 · Profile" frame markup found a real gap: the frame has a full `isLoggedIn`-conditional layout (a "Visitante" logged-out view) directly on this screen, not just in the Sidebar — the previous draft's Assumptions bullet saying this wasn't this screen's concern was wrong, corrected. Built both global stores this round, ahead of their owning specs: `stores/favorites.ts` (ahead of `favorites.md`) and `stores/auth.ts` (ahead of `auth.md`), both matching the exact contracts those specs already define. Orders/reservations stats hardcoded to `0` pending US3-4. New shared `src/components/ui/PlaceholderScreen.tsx` gives the 4 account-menu destinations and `app/login.tsx` real (if content-less) navigation targets. Dropped the frame's leftover back arrow — Profile is a tab-bar root, not a stack-pushed screen, same correction already applied to the category page. |
