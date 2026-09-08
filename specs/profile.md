# Feature Specification: Profile

**Feature**: `profile` — folder `src/features/profile/`
**Created**: 2026-07-23
**Status**: In Progress — US1 and US2 Implemented (Orders/Reservations removed 2026-09-02, see US3/US4); US5-6 not started
**Design reference**: `App Flow.dc.html`, frames "6 · Profile" (implemented), "10 · Payment Methods", "11 · Notifications" (pending — real routes exist today as `PlaceholderScreen`). Frames "8 · My Orders"/"9 · My Reservations" no longer apply — see US3/US4.

## Summary

Everything on the Profile tab that isn't the favorites rail (`favorites.md`'s User Story 2 — this spec composes the same route but doesn't redefine that part). Covers identity (avatar, name, email, favorites count, with a logged-out "Guest" alternative) and the account menu, which navigates to two routes (Payment Methods, Notifications; currently placeholders, real content is US5-6). "Log out" performs a real logout via `stores/auth.ts`.

## User Stories

### User Story 1 - View my profile (Priority: P1) — **Implemented**

A user opens the Profile tab and sees who they are (avatar, name, email) and a snapshot of their activity (favorites count) — or, if logged out, a "Guest" placeholder and a way to log in.

**Why this priority**: the screen's baseline reason to exist.

**Independent test**: open Profile, confirm avatar/name/email render from the mocked current-user record and the favorites stat number renders (reflects the real global store); log out, confirm the screen switches to "Guest."

**Acceptance scenarios**:

1. **Given** `isLoggedIn` true, **when** Profile renders, **then** it shows the mocked current user's avatar initial, name, and email.
2. **Given** `isLoggedIn` true, **when** Profile renders, **then** it shows one stat: favorites count.
3. **Given** zero favorites, **when** the favorites stat renders, **then** it shows `0`.
4. **Given** favorites in `stores/favorites.ts`, **when** Profile renders, **then** the stat matches the store's actual count.
5. **Given** `isLoggedIn` false, **when** Profile renders, **then** it shows a placeholder avatar, "Guest," and a short subtitle instead.
6. **Given** the logged-out view, **when** it renders, **then** it shows an "Log in or sign up" CTA and a "Discover without an account" section with 3 links (Explore restaurants → Home, Search on the map → Search tab, Notification preferences → Notifications placeholder).

---

### User Story 2 - Browse account options (Priority: P2) — **Implemented**

A user sees a list of account-related actions — two lead to a real screen (Payment Methods, Notifications), one (Log out) performs a real, immediate logout.

**Why this priority**: completes the screen and is the entry point for US5-6; the app is usable without it.

**Independent test**: tap each of the 2 navigation options, confirm each navigates to a screen (currently "Coming soon" placeholders); tap Log out, confirm `isLoggedIn` flips immediately (no navigation, no confirmation) and the screen switches to logged-out.

**Acceptance scenarios**:

1. **Given** `isLoggedIn` true, **when** Profile renders, **then** a list of 3 options shows: Payment methods, Notifications, Log out.
2. **Given** the option list, **when** the user taps either of the first two, **then** the app navigates to that option's screen (real navigation today, placeholder content).
3. **Given** the option list, **when** the user taps Log out, **then** `stores/auth.ts`'s real `logout()` runs immediately, no navigation, no confirmation.
4. **Given** Log out, **when** it renders, **then** it's visually styled as destructive/danger, distinct from the other two.

---

### User Story 3 - My Orders (Priority: P3) — **Removed, 2026-09-02**

Previously planned: a user taps "My orders" and sees a list of past orders. **Removed before implementation** — live-device testing feedback identified this as a dead-end placeholder with no real backing capability (same category of problem as `restaurant.md`'s Takeaway/Delivery/Reserve actions, disabled for the same reason). The account-menu entry, its stat tile, and its `PlaceholderScreen` route are gone, not deferred. Revive as a new User Story if/when a real `Order` entity is specced and modeled (`dine-out-backend`'s `CLAUDE.md` placeholder-until-spec rule — no such entity exists there today).

---

### User Story 4 - My Reservations (Priority: P3) — **Removed, 2026-09-02**

Previously planned: a user taps "My reservations" and sees a list of table reservations. **Removed for the same reason as US3** — see above. Revive as a new User Story if/when a real `Reservation` entity is specced and modeled.

---

### User Story 5 - Payment Methods (Priority: P3)

A user taps "Payment methods" and sees saved cards, and can tap to add a new one (simulated).

**Acceptance scenarios**:

1. **Given** Payment Methods, **when** it renders, **then** each saved card shows brand, last 4 digits, expiry.
2. **Given** the default card, **when** it renders, **then** it shows a "Default" badge; non-default cards don't.
3. **Given** Payment Methods, **when** the user taps "+ Add card," **then** a simulated response occurs — no real card-entry form.

---

### User Story 6 - Notifications (Priority: P3)

A user taps "Notifications" and sees notification categories, each with a real, working toggle.

**Acceptance scenarios**:

1. **Given** Notifications, **when** it renders, **then** each category shows a label, description, and a toggle reflecting its current state.
2. **Given** a toggle, **when** tapped, **then** it flips state and the visual updates immediately.
3. **Given** toggled settings, **when** the user navigates away and back (same session), **then** the states persist — no requirement to survive an app restart.

---

### Edge Cases

- **The 2 remaining account-menu destinations are `PlaceholderScreen` routes today** — real routes exist (FR-006 is genuinely true) but content is still US5-6.
- **Long user name/email**: no truncation specified by the design — default to platform wrap/truncate unless it visibly breaks layout.

## Functional Requirements

- **FR-001 — Implemented**: display avatar initial/name/email when `isLoggedIn` true; placeholder avatar + "Guest" + subtitle when false.
- **FR-002 — Implemented**: one stat (favorites), only when `isLoggedIn` true.
- **FR-003 — Implemented**: favorites count reflects the actual `src/stores/favorites.ts` count.
- **FR-005 — Implemented**: list of 3 account options, `isLoggedIn` true only.
- **FR-006 — Implemented**: tapping either of the first 2 options navigates to its own screen (placeholder today).
- **FR-007 — Implemented**: tapping Log out performs the real logout (`stores/auth.ts`'s `logout()`), visually distinguished (danger styling) from the other two.
- **FR-016 — Implemented**: logged-out state shows "Log in or sign up" + a "Discover without an account" section with 3 links (Home, Search tab, Notifications placeholder).
- **FR-012**: Payment Methods lists each card's brand, last 4 digits, expiry, with a distinct default badge.
- **FR-013**: Payment Methods' "Add card" simulates a response — no real form.
- **FR-014**: Notifications lists categories with label, description, toggle.
- **FR-015**: tapping a toggle flips state and updates the visual immediately — real, not simulated.

FR-004, FR-008–FR-011 removed 2026-09-02 alongside US3/US4 — numbers retired, not reused.

### Key Entities

- **UserProfile**: mocked "current user" — initial, name, email. One hardcoded record, no multi-user/auth concept.
- **AccountOption**: id, label, `danger` flag (true only for Log out). No `href` on the entity — the `id → route` mapping lives in `app/(tabs)/profile.tsx`, keeping `features/profile/components` routing-agnostic. Plain TS type, not Zod (never crosses a wire boundary).
- **PaymentMethod**: brand, last 4 digits, expiry, `isDefault`.
- **NotificationSetting**: id, label, description, enabled.

`Order`/`Reservation` entities removed 2026-09-02 alongside US3/US4 — see `dine-out-backend`'s data model for the current status of these entities (not modeled there either).

## Success Criteria

- **SC-001**: Profile never shows placeholder text — real (mocked) identity/stats immediately, no loading state.
- **SC-002**: The favorites stat and `favorites.md`'s rail never disagree — same store, true by construction.
- **SC-003**: All 3 account options produce a distinct, working response.

## Architecture Mapping

- **Feature folder — Implemented**: `src/features/profile/{api,components,types}`, no `stores/`/`hooks/` — navigation/press behavior lives in the route file.
- **Components**: `ProfileHeader` (branches on `isLoggedIn`), `ProfileStats`, `AccountOptionsList` (`options` + `onPress(id)`), `LoggedOutPrompt`. `app/(tabs)/profile.tsx` owns all navigation.
- **Shared `src/components/ui/PlaceholderScreen.tsx`**: back-header + "Coming soon." — 3 call sites (2 account-menu destinations + `app/login.tsx`), replaced screen-by-screen as US5-6/`auth.md` land.
- **Global state**:
  - `src/stores/favorites.ts` — `{favoriteIds, toggleFavorite(id), isFavorite(id)}`, no persistence, contract owned by `favorites.md`.
  - `src/stores/auth.ts` — `{isLoggedIn, login(), logout()}`, contract owned by `auth.md`. Default `isLoggedIn: true`.
- **Types**: `UserProfile` in shared `src/types/userProfile.ts` (stat count derived, not an entity field). `AccountOption` stays in `src/features/profile/types/`.
- **Mocks**: `src/mocks/currentUser.ts` (one `UserProfile` record), `useCurrentUserQuery.ts` mirrors `useDiscoveryTaxonomiesQuery.ts`. `paymentMethods.ts`/`notificationSettings.ts` deferred to US5-6.
- **Routes — Implemented**: `app/(tabs)/profile.tsx` (US1-2). `app/profile/{payment,notifications}.tsx` and `app/login.tsx` exist as real `PlaceholderScreen` routes. `app/profile/{orders,reservations}.tsx` deleted 2026-09-02 alongside US3/US4.
- **Sequencing note**: `profile` and `favorites.md`'s US2 compose the same `app/(tabs)/profile.tsx` — the favorites rail slots between `ProfileStats` and `AccountOptionsList`.

## Out of Scope

- The favorites rail itself — `favorites.md`'s US2.
- Orders/reservations entirely — see US3/US4 above (removed, not deferred).
- Real payment processing or card entry.
- Real push notifications — toggles are real local UI state only, nothing sends a notification.
- Real backend authentication — "Log out" is a real client-side `logout()`, not a backend session teardown.
- Editing profile info — no edit affordance in the design.

## Assumptions and Dependencies

- Exactly one mocked "current user," no multi-account switching.
- Depends on `app/(tabs)/profile.tsx` (implemented) for Payment Methods/Notifications tap-through (pending US5-6).
- Notification toggle state resets on app reload — no persistence required.

## Notes for the AI Agent

- US5-6: replace each remaining `PlaceholderScreen` call site with real content; update `favorites.md`/`auth.md` if their store contracts change (both already built here).
- Payment Methods' "Add card": reuse `restaurant.md`'s `RedirectOptionsSheetContent`/`Alert.alert` pattern.
- Verification: `npx tsc --noEmit`, `npx jest`, bundle smoke test on `/profile`, `/profile/{payment,notifications}`, `/login`.

## Changelog

| Date | Change |
|------|--------|
| 2026-07-23 | Spec created. |
| 2026-07-23 | Design update: 4 of 5 account options now navigate to real screens (not sheets); added US3-6. |
| 2026-07-23 | Design added Sidebar Menu + Login frames (`auth.md` created); corrected FR-007 — logout is real, not simulated. Promoted `UserProfile`/`currentUser` to shared `src/types/`/`src/mocks/`. |
| 2026-07-24 | US1-2 implemented (`feat/profile-menu`). Built `stores/favorites.ts` and `stores/auth.ts` this round, ahead of their owning specs. Orders/reservations stats hardcoded `0`. New shared `PlaceholderScreen.tsx`. |
| 2026-08-18 | Rewritten for tone — narrative/historical framing removed from body sections, consolidated into this Changelog. |
| 2026-09-02 | US3 (My Orders) and US4 (My Reservations) removed, not deferred — live-device testing feedback flagged both as dead-end placeholders with zero real backing capability, same category of problem as `restaurant.md`'s already-disabled Takeaway/Reserve actions. Removed the "My orders"/"My reservations" entries from Profile's `ACCOUNT_OPTIONS` and from `SideMenu.tsx`'s `NAV_ITEMS` (same two placeholder routes, same reasoning), the `orderCount`/`reservationCount` stat tiles from `ProfileStats` (now favorites-only), and deleted the now-fully-unreachable `app/profile/orders.tsx`/`reservations.tsx` route files. FR-004, FR-008–FR-011 retired (not reused). `Order`/`Reservation` stay unspecced in `dine-out-backend` too, per that repo's own placeholder-until-spec rule — this isn't a divergence between the two, just this repo catching up to it. Revive as new User Stories if/when those entities get modeled. |
