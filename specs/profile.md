# Feature Specification: Profile

**Feature**: `profile` — folder `src/features/profile/`
**Created**: 2026-07-23
**Status**: In Progress — US1 and US2 Implemented; US3-6 not started
**Design reference**: `App Flow.dc.html`, frames "6 · Profile" (implemented), "8 · My Orders", "9 · My Reservations", "10 · Payment Methods", "11 · Notifications" (pending — real routes exist today as `PlaceholderScreen`)

## Summary

Everything on the Profile tab that isn't the favorites rail (`favorites.md`'s User Story 2 — this spec composes the same route but doesn't redefine that part). Covers identity (avatar, name, email, activity stats, with a logged-out "Visitante" alternative) and the account menu, which navigates to four routes (Orders, Reservations, Payment Methods, Notifications; currently placeholders, real content is US3-6). "Sair da conta" performs a real logout via `stores/auth.ts`.

## User Stories

### User Story 1 - View my profile (Priority: P1) — **Implemented**

A user opens the Profile tab and sees who they are (avatar, name, email) and a snapshot of their activity (favorites, orders, reservations counts) — or, if logged out, a "Visitante" placeholder and a way to log in.

**Why this priority**: the screen's baseline reason to exist.

**Independent test**: open Profile, confirm avatar/name/email render from the mocked current-user record and the three stat numbers render (favorites reflects the real global store; orders/reservations show `0` until US3-4 exist); log out, confirm the screen switches to "Visitante."

**Acceptance scenarios**:

1. **Given** `isLoggedIn` true, **when** Profile renders, **then** it shows the mocked current user's avatar initial, name, and email.
2. **Given** `isLoggedIn` true, **when** Profile renders, **then** it shows three stats: favorites, orders, reservations counts.
3. **Given** zero favorites, **when** the favorites stat renders, **then** it shows `0`.
4. **Given** favorites in `stores/favorites.ts`, **when** Profile renders, **then** the stat matches the store's actual count.
5. **Given** US3-4 aren't built, **when** the stats row renders, **then** orders/reservations show `0`.
6. **Given** `isLoggedIn` false, **when** Profile renders, **then** it shows a placeholder avatar, "Visitante," and a short subtitle instead.
7. **Given** the logged-out view, **when** it renders, **then** it shows an "Entrar ou criar conta" CTA and a "Descubra sem sair da conta" section with 3 links (Explorar restaurantes → Home, Buscar no mapa → Search tab, Preferências de notificação → Notifications placeholder).

---

### User Story 2 - Browse account options (Priority: P2) — **Implemented**

A user sees a list of account-related actions — four lead to a real screen (Orders, Reservations, Payment Methods, Notifications), one (Sair da conta) performs a real, immediate logout.

**Why this priority**: completes the screen and is the entry point for US3-6; the app is usable without it.

**Independent test**: tap each of the 4 navigation options, confirm each navigates to a screen (currently "Em breve" placeholders); tap Sair da conta, confirm `isLoggedIn` flips immediately (no navigation, no confirmation) and the screen switches to logged-out.

**Acceptance scenarios**:

1. **Given** `isLoggedIn` true, **when** Profile renders, **then** a list of 5 options shows: Meus pedidos, Minhas reservas, Formas de pagamento, Notificações, Sair da conta.
2. **Given** the option list, **when** the user taps any of the first four, **then** the app navigates to that option's screen (real navigation today, placeholder content).
3. **Given** the option list, **when** the user taps Sair da conta, **then** `stores/auth.ts`'s real `logout()` runs immediately, no navigation, no confirmation.
4. **Given** Sair da conta, **when** it renders, **then** it's visually styled as destructive/danger, distinct from the other four.

---

### User Story 3 - My Orders (Priority: P3)

A user taps "Meus pedidos" and sees a list of past orders — restaurant, delivery/takeaway, when, what was ordered, status, total — and can tap one to revisit that restaurant.

**Independent test**: navigate to My Orders, confirm each order shows photo/name, status badge, type + date, item summary, total; tap one, confirm navigation to the restaurant detail; tap back, confirm return to Profile.

**Acceptance scenarios**:

1. **Given** My Orders, **when** it renders, **then** each order shows restaurant photo/name, a status badge, order type + date, item summary, total price.
2. **Given** an order, **when** tapped, **then** the app navigates to that order's restaurant detail.
3. **Given** My Orders, **when** the user taps back, **then** the app returns to Profile.

---

### User Story 4 - My Reservations (Priority: P3)

A user taps "Minhas reservas" and sees a list of table reservations — restaurant, status, date/time, party size — and can tap one to revisit that restaurant.

**Acceptance scenarios**:

1. **Given** My Reservations, **when** it renders, **then** each reservation shows restaurant photo/name, status badge, date, time, party size.
2. **Given** a reservation, **when** tapped, **then** the app navigates to that reservation's restaurant detail.
3. **Given** My Reservations, **when** the user taps back, **then** the app returns to Profile.

---

### User Story 5 - Payment Methods (Priority: P3)

A user taps "Formas de pagamento" and sees saved cards, and can tap to add a new one (simulated).

**Acceptance scenarios**:

1. **Given** Payment Methods, **when** it renders, **then** each saved card shows brand, last 4 digits, expiry.
2. **Given** the default card, **when** it renders, **then** it shows a "Padrão" badge; non-default cards don't.
3. **Given** Payment Methods, **when** the user taps "+ Adicionar cartão," **then** a simulated response occurs — no real card-entry form.

---

### User Story 6 - Notifications (Priority: P3)

A user taps "Notificações" and sees notification categories, each with a real, working toggle.

**Acceptance scenarios**:

1. **Given** Notifications, **when** it renders, **then** each category shows a label, description, and a toggle reflecting its current state.
2. **Given** a toggle, **when** tapped, **then** it flips state and the visual updates immediately.
3. **Given** toggled settings, **when** the user navigates away and back (same session), **then** the states persist — no requirement to survive an app restart.

---

### Edge Cases

- **Orders/reservations counts**: hardcoded `0` — US3-4's mock lists don't exist yet.
- **The 4 account-menu destinations are `PlaceholderScreen` routes today** — real routes exist (FR-006 is genuinely true) but content is still US3-6.
- **Long user name/email**: no truncation specified by the design — default to platform wrap/truncate unless it visibly breaks layout.
- **Empty orders/reservations lists**: not reachable today (mock always has 2-3 entries). `[NEEDS CLARIFICATION: should My Orders/My Reservations show an explicit empty state if the mock were empty?]`
- **Order/reservation referencing an unresolved restaurant id**: should behave the same as `restaurant.md`'s "restaurant not found" fallback, not a new one.

## Functional Requirements

- **FR-001 — Implemented**: display avatar initial/name/email when `isLoggedIn` true; placeholder avatar + "Visitante" + subtitle when false.
- **FR-002 — Implemented**: three stats (favorites/orders/reservations), only when `isLoggedIn` true.
- **FR-003 — Implemented**: favorites count reflects the actual `src/stores/favorites.ts` count.
- **FR-004 — Partially implemented**: orders/reservations counts equal this feature's own mock list lengths (US3-4) — `0` until those lists exist.
- **FR-005 — Implemented**: list of 5 account options, `isLoggedIn` true only.
- **FR-006 — Implemented**: tapping any of the first 4 options navigates to its own screen (placeholder today).
- **FR-007 — Implemented**: tapping Sair da conta performs the real logout (`stores/auth.ts`'s `logout()`), visually distinguished (danger styling) from the other four.
- **FR-016 — Implemented**: logged-out state shows "Entrar ou criar conta" + a "Descubra sem sair da conta" section with 3 links (Home, Search tab, Notifications placeholder).
- **FR-008**: My Orders lists restaurant photo/name, status badge, type, date, item summary, total.
- **FR-009**: tapping an order navigates to its restaurant detail.
- **FR-010**: My Reservations lists restaurant photo/name, status badge, date, time, party size.
- **FR-011**: tapping a reservation navigates to its restaurant detail.
- **FR-012**: Payment Methods lists each card's brand, last 4 digits, expiry, with a distinct default badge.
- **FR-013**: Payment Methods' "Adicionar cartão" simulates a response — no real form.
- **FR-014**: Notifications lists categories with label, description, toggle.
- **FR-015**: tapping a toggle flips state and updates the visual immediately — real, not simulated.

### Key Entities

- **UserProfile**: mocked "current user" — initial, name, email. One hardcoded record, no multi-user/auth concept.
- **AccountOption**: id, label, `danger` flag (true only for Sair da conta). No `href` on the entity — the `id → route` mapping lives in `app/(tabs)/profile.tsx`, keeping `features/profile/components` routing-agnostic. Plain TS type, not Zod (never crosses a wire boundary).
- **Order**: restaurant reference, status (+color), type (delivery/takeaway + provider), date, item summary text, total price (display string, not structured currency).
- **Reservation**: restaurant reference, status (+color), date, time, party size.
- **PaymentMethod**: brand, last 4 digits, expiry, `isDefault`.
- **NotificationSetting**: id, label, description, enabled.

## Success Criteria

- **SC-001**: Profile never shows placeholder text — real (mocked) identity/stats immediately, no loading state.
- **SC-002**: The favorites stat and `favorites.md`'s rail never disagree — same store, true by construction. Same guarantee for orders/reservations vs. their list screens.
- **SC-003**: All 5 account options produce a distinct, working response.
- **SC-004**: Profile to any order/reservation's restaurant detail in exactly 2 taps.

## Architecture Mapping

- **Feature folder — Implemented**: `src/features/profile/{api,components,types}`, no `stores/`/`hooks/` — navigation/press behavior lives in the route file.
- **Components**: `ProfileHeader` (branches on `isLoggedIn`), `ProfileStats`, `AccountOptionsList` (`options` + `onPress(id)`), `LoggedOutPrompt`. `app/(tabs)/profile.tsx` owns all navigation.
- **Shared `src/components/ui/PlaceholderScreen.tsx`**: back-header + "Em breve." — 5 call sites this round (4 account-menu destinations + `app/login.tsx`), replaced screen-by-screen as US3-6/`auth.md` land.
- **Global state**:
  - `src/stores/favorites.ts` — `{favoriteIds, toggleFavorite(id), isFavorite(id)}`, no persistence, contract owned by `favorites.md`.
  - `src/stores/auth.ts` — `{isLoggedIn, login(), logout()}`, contract owned by `auth.md`. Default `isLoggedIn: true`.
- **Types**: `UserProfile` in shared `src/types/userProfile.ts` (stat counts derived, not entity fields). `AccountOption` stays in `src/features/profile/types/`.
- **Mocks**: `src/mocks/currentUser.ts` (one `UserProfile` record), `useCurrentUserQuery.ts` mirrors `useDiscoveryTaxonomiesQuery.ts`. `orders.ts`/`reservations.ts`/`paymentMethods.ts`/`notificationSettings.ts` deferred to US3-6.
- **Routes — Implemented**: `app/(tabs)/profile.tsx` (US1-2). `app/profile/{orders,reservations,payment,notifications}.tsx` and `app/login.tsx` exist as real `PlaceholderScreen` routes.
- **Sequencing note**: `profile` and `favorites.md`'s US2 compose the same `app/(tabs)/profile.tsx` — the favorites rail slots between `ProfileStats` and `AccountOptionsList`.

## Out of Scope

- The favorites rail itself — `favorites.md`'s US2.
- Real orders/reservations backend, cancellation, rebooking, filtering — read-only mock lists.
- Real payment processing or card entry.
- Real push notifications — toggles are real local UI state only, nothing sends a notification.
- Real backend authentication — "Sair da conta" is a real client-side `logout()`, not a backend session teardown.
- Editing profile info — no edit affordance in the design.

## Assumptions and Dependencies

- Exactly one mocked "current user," no multi-account switching.
- Depends on `app/(tabs)/profile.tsx` (implemented) and `app/restaurant/[id]` (exists) for Orders/Reservations tap-through (pending US3-4).
- Notification toggle state resets on app reload — no persistence required.

## Notes for the AI Agent

- US3-6: replace each `PlaceholderScreen` call site with real content; update `favorites.md`/`auth.md` if their store contracts change (both already built here).
- Payment Methods' "Adicionar cartão": reuse `restaurant.md`'s `RedirectOptionsSheetContent`/`Alert.alert` pattern.
- US3-4 share a near-identical layout — consider one shared list-row component, don't force it if shapes diverge once built.
- Once US3-4 land, derive `ProfileStats`' `orderCount`/`reservationCount` from real list lengths (FR-004).
- Verification: `npx tsc --noEmit`, `npx jest`, bundle smoke test on `/profile`, `/profile/{orders,reservations,payment,notifications}`, `/login`.

## Changelog

| Date | Change |
|------|--------|
| 2026-07-23 | Spec created. |
| 2026-07-23 | Design update: 4 of 5 account options now navigate to real screens (not sheets); added US3-6. |
| 2026-07-23 | Design added Sidebar Menu + Login frames (`auth.md` created); corrected FR-007 — logout is real, not simulated. Promoted `UserProfile`/`currentUser` to shared `src/types/`/`src/mocks/`. |
| 2026-07-24 | US1-2 implemented (`feat/profile-menu`). Built `stores/favorites.ts` and `stores/auth.ts` this round, ahead of their owning specs. Orders/reservations stats hardcoded `0`. New shared `PlaceholderScreen.tsx`. |
| 2026-08-18 | Rewritten for tone — narrative/historical framing removed from body sections, consolidated into this Changelog. |
