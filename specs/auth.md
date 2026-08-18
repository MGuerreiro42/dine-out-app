# Feature Specification: Auth

**Feature**: `auth` — folder `src/features/auth/`
**Created**: 2026-07-23
**Status**: In Progress — User Stories 1, 3, 4 Implemented; User Story 2 true by construction; form validation (FR-010) and guest-default flip (FR-011) designed, not implemented
**Design reference**: `App Flow.dc.html`, frames "12a · Sidebar — Open" and "13 · Login"

## Summary

Optional login/signup: the app is fully browsable while logged out. Login exists only to save/personalize (favorites, orders, reservations) — nothing redirects to or requires it. Covers the Login/Signup screen and the navigation sidebar, whose header/footer change based on `isLoggedIn` — the second global store in this project, after `favorites.md`'s.

## User Stories

### User Story 1 - Log in or create an account (Priority: P1) — Implemented

A user toggles between "Log in" (login) and "Create account" (signup) modes on a single screen, and authenticates with email/password or a simulated Google/Apple flow.

**Independent test**: open the login screen, confirm login mode shows email + password + "Forgot your password?"; toggle to signup, confirm a name field appears and "Forgot your password?" disappears; tap the primary CTA, confirm `isLoggedIn` becomes true and the app navigates to Profile.

**Acceptance scenarios**:

1. **Given** login mode, **when** it renders, **then** it shows email, password, "Forgot your password?", and a primary "Log in" button.
2. **Given** the login screen, **when** the user taps the mode-switch link, **then** it switches to signup mode (name field added, "Forgot your password?" removed, button reads "Create account").
3. **Given** either mode, **when** the user taps the primary button and FR-010's validation passes, **then** `isLoggedIn` becomes true and the app navigates to Profile.
4. **Given** either mode, **when** the user taps "Google" or "Apple," **then** a simulated response occurs.
5. **Given** login mode, **when** the user taps "Forgot your password?," **then** a simulated response occurs.
6. **Given** the login screen, **when** the user taps back, **then** the app returns to Home.

---

### User Story 2 - Browse fully while logged out (Priority: P1) — True by construction

A logged-out user can use every part of the app without being asked to log in or blocked from anything. No screen checks `isLoggedIn` to gate rendering or redirect.

**Independent test**: without logging in, navigate Home, a restaurant detail, and the sidebar — confirm nothing redirects to login. Open Profile directly (logged out) — confirm it renders the logged-out state, not a forced redirect.

**Acceptance scenarios**:

1. **Given** a logged-out session, **when** the user navigates any screen, **then** it renders normally — no redirect, no blocking modal.
2. **Given** a logged-out session, **when** the sidebar opens, **then** its header shows "Log in or sign up" instead of a profile summary — the only UI difference from logged-in.

---

### User Story 3 - Open the navigation sidebar (Priority: P2) — Implemented

A user taps the menu icon (≡) and sees a slide-out drawer with navigation to every major part of the app, plus an identity-aware header/footer.

**Independent test**: open the sidebar, confirm the nav list (Home/Search/Categories/Favorites/My orders/My reservations/Notifications) each navigates correctly; confirm header/footer differ between logged-in/out; confirm close dismisses.

**Acceptance scenarios**:

1. **Given** `isLoggedIn` true, **when** the sidebar renders, **then** the header shows the user's avatar initial, name, and "Ver perfil," linking to Profile.
2. **Given** `isLoggedIn` false, **when** the sidebar renders, **then** the header shows a single "Log in or sign up" button linking to login.
3. **Given** the sidebar, **when** it renders, **then** a nav list shows Home, Search, Categories, Favorites, My orders, My reservations, Notifications, each navigating on tap.
4. **Given** `isLoggedIn` true, **when** the sidebar renders, **then** a "Log out" control (danger styling) shows at the bottom; given false, it doesn't render.
5. **Given** the sidebar open, **when** the user taps ✕ or the backdrop, **then** it dismisses.

---

### User Story 4 - Log out (Priority: P2) — Implemented

A logged-in user taps "Log out" and is immediately logged out — no confirmation step.

**Independent test**: while logged in, tap "Log out," confirm `isLoggedIn` immediately becomes false and the sidebar's header/footer update without reopening.

**Acceptance scenarios**:

1. **Given** `isLoggedIn` true, **when** the user taps "Log out," **then** `isLoggedIn` becomes false immediately — no dialog, no sheet.
2. **Given** logout just happened, **when** any screen reads `isLoggedIn`, **then** it reflects the logged-out state immediately.

---

### Edge Cases

- Sidebar omits "Payment methods" (a Profile-only account-menu option).
- No email/password strength or uniqueness validation — no real backend to check against.
- Sidebar's `«` collapse icon acts as a second close-affordance, identical to `✕` — no separate "collapsed" state.

## Functional Requirements

- **FR-001** — Implemented: single screen toggling login/signup modes.
- **FR-002** — Implemented: login mode shows email + password + "Forgot your password?", no name field.
- **FR-003** — Implemented: signup mode shows name + email + password, no "Forgot your password?".
- **FR-004** — Implemented: primary CTA sets `isLoggedIn: true` and navigates to Profile, gated by FR-010's validation.
- **FR-005** — Implemented: "Forgot your password?" and Google/Apple buttons produce a simulated response only (`Alert.alert`).
- **FR-006** — True by construction: no screen redirects to or requires login (User Story 2).
- **FR-007** — Implemented: sidebar header differs by `isLoggedIn` — profile summary linking to Profile (true) vs. "Log in or sign up" linking to login (false).
- **FR-008** — Implemented: sidebar lists Home, Search, Categories, Favorites, My orders, My reservations, Notifications — "Payment methods" excluded.
- **FR-009** — Implemented: sidebar shows "Log out" only when `isLoggedIn` true; tapping it sets `isLoggedIn` false immediately, no confirmation.
- **FR-010** — Not implemented: `AuthForm` MUST validate on submit, before FR-004's side effect:
  - Email (both modes): required, basic format check. Empty → "Enter your email." Malformed → "Invalid email."
  - Password (both modes): required, min 6 chars. Empty → "Enter your password." Too short → "Password must be at least 6 characters."
  - Full name (signup only): required, non-empty after trim. Empty → "Enter your full name."
  - Error text uses the same danger color as "Log out"; field border switches to match.
  - Validates on submit, not per keystroke. A field's error clears when its value next changes.
  - Any failing field blocks submission and shows all failing messages at once.
- **FR-011** — Not implemented: `useAuthStore`'s `isLoggedIn` MUST default to `false`.

### Key Entities

- **AuthState**: `isLoggedIn: boolean` + `login()`/`logout()`. No credentials, tokens, or session data in this prototype — target backend design in `ARCHITECTURE.md` §5/§7.
- **SidebarNavItem**: label, icon, navigation target — 7 fixed entries, static, not data-driven.

## Success Criteria

- **SC-001**: "Log in or sign up" in the sidebar to a logged-in Profile in exactly 2 taps.
- **SC-002**: `isLoggedIn` never observably inconsistent between the sidebar and any other reader — single store.
- **SC-003**: All 7 sidebar nav entries and both header states render correctly.

## Architecture Mapping

- **Feature folder**: `src/features/auth/{components}` only. `AuthForm.tsx` is the only component.
- **Global state**: `src/stores/auth.ts`, `{isLoggedIn, login(), logout()}`. Default flips to `false` under FR-011.
- **`AuthForm` validation (FR-010)**: local component state (per-field value + optional error string), converts the `TextInput`s to controlled. A `validate()` step runs on submit; no error calls the existing `onSubmit` unchanged.
- **Sidebar drawer**: `SideMenu.tsx` builds its own overlay from `Modal transparent` + backdrop + stop-propagation, anchored left instead of bottom — not `BottomSheet`. Plain fade, no animation library.
- **`components/layout/SideMenu.tsx`**: identity block, 7-item nav list, conditional logout footer. Single usage site (`app/(tabs)/index.tsx`).
- **`UserProfile`/`CURRENT_USER`** read directly from `src/mocks/currentUser.ts`, no query hook.
- **Route**: `app/login.tsx`. Back control navigates to Home unconditionally (`router.replace('/')`), not `canGoBack()`.
- **New dependencies**: none.

## Out of Scope

- Real authentication — no backend, token, session, or credential validation exists yet. Target design in `ARCHITECTURE.md` §5/§7 (JWT access + rotating refresh, argon2id, `expo-secure-store`).
- Real OAuth (Google/Apple) and real password reset — simulated only. Real OAuth's target shape (authorization code + PKCE) is a deferred item in `ARCHITECTURE.md` §10.
- Persisting `isLoggedIn` across app restarts.
- Gating any screen behind login (User Story 2).
- Adding "Payment methods" to the sidebar.

## Assumptions and Dependencies

- Format/min-length validation exists (FR-010), no strength or uniqueness validation.
- Depends on `app/(tabs)/profile.tsx` and the Home menu icon (wired to `SideMenu`) as entry points.
- `isLoggedIn`'s default is `false` under FR-011 — every reader branches correctly regardless of how it became `false`.

## Notes for the AI Agent

- `features/auth/` is `{components}` only.
- `favorites.md`'s favorites rail is reachable both from Profile and the sidebar's "Favorites" entry (same route) — no extra wiring needed.
- Verification: `npx tsc --noEmit`, `npx jest`, bundle smoke test on `/` and `/login`.

## Changelog

| Date | Change |
|------|--------|
| 2026-07-23 | Spec created. |
| 2026-07-24 | `src/stores/auth.ts` and `app/login.tsx` (placeholder) built in `profile.md`'s round, ahead of this spec. |
| 2026-07-24 | US1, US3, US4 implemented (`feat/sidebar-auth`). US2 confirmed true by construction. |
| 2026-08-17 | FR-010 (form validation) and FR-011 (guest-default flip) designed. `isLoggedIn`'s default confirmed to change to `false` as the real first-run default. |
| 2026-08-18 | `ARCHITECTURE.md` created — designs this feature's real backend. Out of Scope updated to point at it. |
| 2026-08-18 | Rewritten for tone — narrative/historical framing removed from body sections, consolidated into this Changelog. |
