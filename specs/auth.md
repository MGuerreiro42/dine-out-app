# Feature Specification: Auth

**Feature**: `auth` — folder `src/features/auth/`
**Created**: 2026-07-23
**Status**: In Progress — US1, US3, US4 Implemented; US2 true-by-construction (no code needed); form validation (FR-010) and guest-default flip (FR-011) designed 2026-08-17, pending implementation
**Design reference**: `App Flow.dc.html`, frames "12a · Sidebar — Open" and "13 · Login" (both implemented)

## Summary

Optional login/signup: the app is fully browsable while logged out, login exists only to save/personalize (favorites, orders, reservations) — nothing redirects to or requires it. Covers the Login/Signup screen and the navigation sidebar, whose header/footer change based on `isLoggedIn` — the second global store this project needs (after `favorites.md`'s), for the same reason: state read by more than one feature can't live in a single feature's own `stores/`.

## User Stories

### User Story 1 - Log in or create an account (Priority: P1) — **Implemented**

A user taps into a single screen that toggles between "Entrar" (login) and "Criar conta" (signup) modes, and can authenticate with email/password or a simulated Google/Apple flow.

**Why this priority**: the actual capability being specified.

**Independent test**: open the login screen, confirm login mode shows email + password + "Esqueceu a senha?"; toggle to signup, confirm a name field appears and "Esqueceu a senha?" disappears; tap the primary CTA, confirm `isLoggedIn` becomes true and the app navigates to Profile.

**Acceptance scenarios**:

1. **Given** login mode, **when** it renders, **then** it shows email, password, "Esqueceu a senha?", and a primary "Entrar" button.
2. **Given** the login screen, **when** the user taps the mode-switch link, **then** it switches to signup mode (name field added, "Esqueceu a senha?" removed, button reads "Criar conta").
3. **Given** either mode, **when** the user taps the primary button, **then** `isLoggedIn` becomes true (no credential validation) and the app navigates to Profile.
4. **Given** either mode, **when** the user taps "Google" or "Apple," **then** a simulated response occurs — no real OAuth.
5. **Given** login mode, **when** the user taps "Esqueceu a senha?," **then** a simulated response occurs — no real password reset.
6. **Given** the login screen, **when** the user taps back, **then** the app returns to Home.

---

### User Story 2 - Browse fully while logged out (Priority: P1) — **True-by-construction, no code needed**

A logged-out user can use every part of the app without ever being asked to log in or blocked from anything. No screen checks `isLoggedIn` to gate rendering or redirect — confirmed by inspection.

**Why this priority**: a deliberate product decision, worth its own story so it can't quietly regress into a login wall.

**Reconfirmed 2026-08-17** against FR-011's guest-default flip: `SideMenu.tsx`, `ProfileHeader.tsx`, `profile.tsx` all branch on `isLoggedIn` at render time, not just after an explicit logout — flipping the default to `false` exercises the same already-correct branches, no new gap.

**Independent test**: without logging in, navigate Home, a restaurant detail, and the sidebar — confirm nothing redirects to login. Open Profile directly (logged out) — confirm it renders the logged-out state, not a forced redirect.

**Acceptance scenarios**:

1. **Given** a logged-out session, **when** the user navigates any screen, **then** it renders normally — no redirect, no blocking modal.
2. **Given** a logged-out session, **when** the sidebar opens, **then** its header shows "Entrar ou criar conta" instead of a profile summary — the only UI difference from logged-in.

---

### User Story 3 - Open the navigation sidebar (Priority: P2) — **Implemented**

A user taps the menu icon (≡) and sees a slide-out drawer with real navigation to every major part of the app, plus an identity-aware header/footer.

**Why this priority**: turns the hamburger icon into working navigation.

**Independent test**: open the sidebar, confirm the nav list (Home/Buscar/Categorias/Favoritos/Meus pedidos/Minhas reservas/Notificações) each navigates correctly; confirm header/footer differ between logged-in/out; confirm close dismisses.

**Acceptance scenarios**:

1. **Given** `isLoggedIn` true, **when** the sidebar renders, **then** the header shows the user's avatar initial + name + "Ver perfil," linking to Profile.
2. **Given** `isLoggedIn` false, **when** the sidebar renders, **then** the header shows a single "Entrar ou criar conta" button linking to login.
3. **Given** the sidebar, **when** it renders, **then** a nav list shows Home, Buscar, Categorias, Favoritos, Meus pedidos, Minhas reservas, Notificações, each navigating on tap.
4. **Given** `isLoggedIn` true, **when** the sidebar renders, **then** a "Sair da conta" control (danger styling) shows at the bottom; **given** false, **then** it doesn't render at all.
5. **Given** the sidebar open, **when** the user taps ✕ or the backdrop, **then** it dismisses.

---

### User Story 4 - Log out (Priority: P2) — **Implemented**

A logged-in user taps "Sair da conta" and is immediately logged out — no confirmation step.

**Why this priority**: completes the loop US1 starts; nothing else depends on it.

**Independent test**: while logged in, tap "Sair da conta," confirm `isLoggedIn` immediately becomes false and the sidebar's header/footer update without reopening.

**Acceptance scenarios**:

1. **Given** `isLoggedIn` true, **when** the user taps "Sair da conta," **then** `isLoggedIn` becomes false immediately — no dialog, no sheet.
2. **Given** logout just happened, **when** any screen reads `isLoggedIn`, **then** it reflects the logged-out state immediately (single store, not two flags).

---

### Edge Cases

- **Sidebar omits "Formas de pagamento"** (a Profile-only account-menu option) — confirmed intentional, not added.
- **No password/email validation in the design** — real client-side validation confirmed in scope 2026-08-17 anyway (FR-010); gates the form, not authentication (still no real credential check).
- **Signup has no unique-email check** — no real backend to check against, not a gap to fix here.
- **Sidebar's `«` collapse icon links to a nonexistent design-canvas id** — treated as a second close-affordance, identical to `✕`; no separate "collapsed" state built.

## Functional Requirements

- **FR-001 — Implemented**: single screen toggling login/signup modes.
- **FR-002 — Implemented**: login mode shows email + password + "Esqueceu a senha?", no name field.
- **FR-003 — Implemented**: signup mode shows name + email + password, no "Esqueceu a senha?".
- **FR-004 — Implemented, behavior changes under FR-010**: primary CTA sets `isLoggedIn: true` and navigates to Profile, no credential validation. Once FR-010 lands, only fires after validation passes.
- **FR-005 — Implemented**: "Esqueceu a senha?" and Google/Apple buttons produce a simulated response only (`Alert.alert`).
- **FR-006 — Confirmed, no code needed**: no screen redirects to or requires login (US2).
- **FR-007 — Implemented**: sidebar header differs by `isLoggedIn` — profile summary linking to Profile (true) vs. "Entrar ou criar conta" linking to login (false).
- **FR-008 — Implemented**: sidebar lists Home, Buscar, Categorias, Favoritos, Meus pedidos, Minhas reservas, Notificações — all existing routes, "Formas de pagamento" deliberately excluded.
- **FR-009 — Implemented**: sidebar shows "Sair da conta" only when `isLoggedIn` true; tapping it sets `isLoggedIn` false immediately, no confirmation.
- **FR-010 — Pending, designed 2026-08-17**: `AuthForm` validates on submit, before FR-004's side effect:
  - **E-mail** (both modes): required, basic format check (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`). Empty → "Informe seu e-mail." Malformed → "E-mail inválido."
  - **Senha** (both modes): required, min 6 chars. Empty → "Informe sua senha." Too short → "A senha deve ter pelo menos 6 caracteres."
  - **Nome completo** (signup only): required, non-empty after trim. Empty → "Informe seu nome completo."
  - Error text: `text-xs`, `#b23b3b` (same danger hex as the "Sair da conta" affordance), field border switches to that color too.
  - Validates on submit, not per keystroke; a field's error clears the instant its value next changes.
  - Any failing field blocks submission (no `isLoggedIn` flip, no navigation) and shows all failing messages at once.
- **FR-011 — Pending, designed 2026-08-17**: `useAuthStore`'s `isLoggedIn` MUST default to `false`.

### Key Entities

- **AuthState**: `isLoggedIn: boolean` + `login()`/`logout()`. No credentials, tokens, or session data anywhere in this prototype.
- **SidebarNavItem**: label, icon, navigation target — the 7 fixed entries in US3, static, not data-driven.

## Success Criteria

- **SC-001**: "Entrar ou criar conta" in the sidebar to a logged-in Profile in exactly 2 taps.
- **SC-002**: `isLoggedIn` never observably inconsistent between the sidebar and any other reader — true by construction (single store).
- **SC-003**: All 7 sidebar nav entries and both header states render correctly.

## Architecture Mapping

- **Feature folder — Implemented**: `src/features/auth/{components}` only. `AuthForm.tsx` is the only component — nothing crosses a wire boundary, no `types/`/`api/`/`hooks/`.
- **Global state — already implemented**: `src/stores/auth.ts`, `{isLoggedIn, login(), logout()}`. Built in `profile.md`'s round, ahead of this spec. Default flips to `false` under FR-011 — one-line change, no shape change.
- **`AuthForm` validation (FR-010) — Pending**: local component state only (per-field value + optional error string), converts the currently-uncontrolled `TextInput`s to controlled. A `validate()` step runs on submit; no error → calls existing `onSubmit` unchanged. No new dependency.
- **Sidebar drawer — not `BottomSheet`**: `SideMenu.tsx` builds its own overlay from the same `Modal transparent` + backdrop + stop-propagation technique, anchored left instead of bottom. Not promoted to a shared primitive — differs enough in edge/sizing. Plain fade, no animation library.
- **`components/layout/SideMenu.tsx` — Implemented** (US3): identity block, 7-item nav list, conditional logout footer. Single usage site (`app/(tabs)/index.tsx`).
- **`UserProfile`/`CURRENT_USER`** read directly from `src/mocks/currentUser.ts`, no query hook — consistent with this spec's "no `api/` folder" and `search.md`'s `USER_LOCATION` precedent.
- **Route**: `app/login.tsx` — **Implemented**. Back control navigates to Home unconditionally (`router.replace('/')`), a deliberate fixed target per the design, not the `canGoBack()`-fallback pattern used elsewhere.
- **New dependencies**: none.

## Out of Scope

- Real authentication — no backend, token, session, or credential validation exists yet. **The target design does now** (`ARCHITECTURE.md` §5/§7: JWT access + rotating refresh, argon2id, `expo-secure-store`) — still nothing built here, this bullet just no longer means "undesigned."
- Real OAuth (Google/Apple) and real password reset — simulated only. Real OAuth's target shape (authorization code + PKCE) is flagged as its own deferred diagram in `ARCHITECTURE.md` §10, not designed yet.
- Persisting `isLoggedIn` across app restarts.
- Gating any screen behind login (ruled out by US2).
- Adding "Formas de pagamento" to the sidebar.

## Assumptions and Dependencies

- Format/min-length validation exists (FR-010) but no strength or uniqueness validation — no real backend to check either against.
- Depends on `app/(tabs)/profile.tsx` (exists) as the login CTA's target, and the Home menu icon (already wired to `SideMenu`) as the sidebar's entry point.
- **Resolved 2026-08-17**: `isLoggedIn`'s default changes to `false` (FR-011) — confirmed with the PO as the real first-run default. Verified safe via US2's re-check: every `isLoggedIn` reader already branches correctly regardless of how it became `false`.

## Notes for the AI Agent

- `features/auth/` is `{components}` only — see Architecture Mapping for why.
- If `favorites.md`'s US2 lands after this, the favorites rail is reachable both from Profile and the sidebar's "Favoritos" entry (same route) — no extra wiring needed.
- Verification: `npx tsc --noEmit`, `npx jest`, bundle smoke test on `/` and `/login`.

## Changelog

| Date | Change |
|------|--------|
| 2026-07-23 | Spec created. |
| 2026-07-24 | `src/stores/auth.ts` and `app/login.tsx` (placeholder) built in `profile.md`'s round, ahead of this spec — matches this spec's contract, no drift. |
| 2026-07-24 | US1, US3, US4 implemented (`feat/sidebar-auth`). "Formas de pagamento" confirmed excluded from sidebar; `isLoggedIn` default stayed `true`. Sidebar's dangling `«` anchor resolved as a second close-affordance. US2 confirmed true-by-construction. |
| 2026-08-18 | `ARCHITECTURE.md` created — designs this feature's real backend (JWT access + rotating refresh tokens, argon2id, `expo-secure-store`, the request-lifecycle guard/refresh-interceptor flow). Out of Scope updated to point at it. Nothing implemented this round — still `isLoggedIn: boolean` only. |
