# Feature Specification: Auth

**Feature**: `auth` — folder `src/features/auth/` *(doesn't exist yet — see Notes for the AI Agent)*
**Created**: 2026-07-23
**Status**: Draft
**Design reference**: `App Flow.dc.html`, frames "12 · Sidebar Menu" and "13 · Login"

## Summary

Optional login/signup, confirmed with the user to be purely additive: the app is fully browsable while logged out, and logging in exists only to save/personalize (favorites, orders, reservations) — nothing redirects to or requires login. This spec covers the Login/Signup screen and the app's navigation sidebar, whose header and footer change based on `isLoggedIn` — the first piece of app-wide auth state, and the second global store this project needs (after `favorites.md`'s), for the same reason: state read by more than one feature can't live in any single feature's own `stores/`.

## User Stories

### User Story 1 - Log in or create an account (Priority: P1)

A user taps into a single screen that toggles between "Entrar" (login) and "Criar conta" (signup) modes, and can authenticate with email/password or a simulated Google/Apple flow.

**Why this priority**: the actual capability being specified — without it, "log in" is just a sidebar button that goes nowhere real.

**Independent test**: open the login screen, confirm login mode shows email + password + "Esqueceu a senha?"; toggle to signup mode, confirm a name field appears and "Esqueceu a senha?" disappears; tap the primary CTA, confirm `isLoggedIn` becomes true and the app navigates to Profile.

**Acceptance scenarios**:

1. **Given** the login screen in login mode, **when** it renders, **then** it shows email and password fields, a "Esqueceu a senha?" link, and a primary button labeled "Entrar."
2. **Given** the login screen, **when** the user taps the mode-switch link at the bottom, **then** the screen switches to signup mode: title/subtitle change, a "Nome completo" field appears above email, "Esqueceu a senha?" disappears, and the primary button now reads "Criar conta."
3. **Given** either mode, **when** the user taps the primary button, **then** the app sets real `isLoggedIn` state to true (no credential validation — see Assumptions) and navigates to the Profile tab.
4. **Given** either mode, **when** the user taps "Google" or "Apple," **then** a simulated response occurs (e.g. an alert) — no real OAuth flow.
5. **Given** login mode only, **when** the user taps "Esqueceu a senha?," **then** a simulated response occurs — no real password-reset flow.
6. **Given** the login screen, **when** the user taps the back control, **then** the app returns to Home.

---

### User Story 2 - Browse fully while logged out (Priority: P1)

A user who has never logged in can use every part of the app — Home, search, category pages, restaurant detail — without ever being asked to log in or blocked from anything.

**Why this priority**: this is a deliberate product decision (confirmed with the user), not the absence of a requirement — worth its own story so it's testable and can't quietly regress into an accidental login wall later.

**Independent test**: without logging in, navigate through Home, a restaurant detail, and the sidebar; confirm nothing redirects to or requires the login screen. Open Profile directly (logged out): confirm it still renders (with `isLoggedIn: false` styling per `profile.md`/Sidebar's conditional header), not a forced redirect to login.

**Acceptance scenarios**:

1. **Given** a logged-out session, **when** the user navigates to any screen in the app (Home, restaurant detail, category page, Profile, Orders, Reservations, Payment Methods, Notifications), **then** the screen renders normally — no redirect to the login screen, no blocking modal.
2. **Given** a logged-out session, **when** the sidebar opens, **then** its header shows "Entrar ou criar conta" instead of a profile summary (see User Story 3) — this is the *only* UI difference logged-out browsing has versus logged-in, per this story.

---

### User Story 3 - Open the navigation sidebar (Priority: P2)

A user taps the menu icon (≡) anywhere it appears and sees a slide-out drawer with real navigation to every major part of the app, plus an identity-aware header and footer.

**Why this priority**: this is what makes the hamburger menu icon (already present on Home) a working piece of navigation instead of a placeholder — but Home, search, and detail all work via their own direct navigation without it.

**Independent test**: open the sidebar, confirm the nav list shows Home/Buscar/Categorias/Favoritos/Meus pedidos/Minhas reservas/Notificações, each navigating correctly on tap; confirm the header/footer differ between logged-in and logged-out states (User Story 2); confirm the close control dismisses the drawer.

**Acceptance scenarios**:

1. **Given** the sidebar, **when** `isLoggedIn` is true, **then** the header shows the current user's avatar initial and name plus a "Ver perfil" label, linking to Profile.
2. **Given** the sidebar, **when** `isLoggedIn` is false, **then** the header instead shows a single "Entrar ou criar conta" button, linking to the login screen (User Story 1).
3. **Given** the sidebar, **when** it renders, **then** a nav list shows: Home, Buscar, Categorias, Favoritos, Meus pedidos, Minhas reservas, Notificações — each navigating to its respective screen on tap.
4. **Given** the sidebar, **when** `isLoggedIn` is true, **then** a "Sair da conta" control renders at the bottom (danger styling); **when** `isLoggedIn` is false, **then** it does not render at all (not just disabled).
5. **Given** the sidebar open, **when** the user taps the close (✕) control or the backdrop, **then** the drawer dismisses.

---

### User Story 4 - Log out (Priority: P2)

A logged-in user taps "Sair da conta" in the sidebar and is immediately logged out — no confirmation step.

**Why this priority**: completes the auth loop User Story 1 starts, but nothing else in the app depends on it working for the app to be usable.

**Independent test**: while logged in, open the sidebar, tap "Sair da conta," confirm `isLoggedIn` immediately becomes false and the sidebar's own header/footer update to the logged-out state (User Story 3, scenarios 1-2 and 4) without needing to reopen the drawer.

**Acceptance scenarios**:

1. **Given** the sidebar with `isLoggedIn` true, **when** the user taps "Sair da conta," **then** `isLoggedIn` immediately becomes false — no confirmation dialog, no sheet, matching the design exactly.
2. **Given** logout just happened, **when** any screen reads `isLoggedIn` (e.g. the sidebar header, or `profile.md`'s corrected "Sair da conta" — see that spec's Changelog), **then** it reflects the logged-out state immediately, by construction (single store, not two separately-tracked flags).

---

### Edge Cases

- **The sidebar's nav list omits "Formas de pagamento"**, which *is* one of Profile's own account-menu options (`profile.md` User Story 2). **[NEEDS CLARIFICATION: is this intentional (payment methods reached only from Profile, not the global sidebar) or a design oversight? Not resolved here — don't add it to the sidebar nor treat its absence as confirmed-intentional without asking.]**
- **No password/email validation of any kind exists in the design** (no error states shown for e.g. invalid email format, mismatched passwords, weak password). Not in scope to invent — see Assumptions.
- **Signup with no unique-email check**: since there's no real backend, "creating an account" can't actually fail for a duplicate email. Not a gap to fix here — consistent with the rest of this prototype's no-backend scope.

## Functional Requirements

- **FR-001**: The system MUST provide a single screen that toggles between login and signup modes.
- **FR-002**: Login mode MUST show email and password fields, a "Esqueceu a senha?" link, and MUST NOT show a name field.
- **FR-003**: Signup mode MUST show name, email, and password fields, and MUST NOT show "Esqueceu a senha?".
- **FR-004**: The primary CTA on either mode MUST set real `isLoggedIn` state to true and navigate to Profile — no credential validation.
- **FR-005**: "Esqueceu a senha?" and the Google/Apple buttons MUST produce a simulated response only.
- **FR-006**: The system MUST NOT redirect to or require the login screen from any other screen in the app.
- **FR-007**: The system MUST provide a navigation sidebar, opened via the existing menu icon (≡), with a header that differs based on `isLoggedIn`: a profile summary linking to Profile when true, an "Entrar ou criar conta" CTA linking to login when false.
- **FR-008**: The sidebar MUST list navigation entries for Home, Buscar, Categorias, Favoritos, Meus pedidos, Minhas reservas, and Notificações, each navigating correctly on tap.
- **FR-009**: The sidebar MUST render a "Sair da conta" control only when `isLoggedIn` is true, and tapping it MUST immediately set `isLoggedIn` to false with no confirmation step.

### Key Entities

- **AuthState**: not a rich entity — just `isLoggedIn: boolean` plus `login()`/`logout()` actions. No credentials, tokens, or session data exist anywhere in this prototype.
- **SidebarNavItem**: label, icon, and navigation target — the 7 fixed entries in User Story 3. Static, not data-driven from anywhere else.

## Success Criteria

- **SC-001**: A user can go from tapping "Entrar ou criar conta" in the sidebar to a logged-in Profile screen in exactly 2 taps (open sidebar already counted separately; 1 tap to reach login, 1 tap to submit).
- **SC-002**: `isLoggedIn` state is never observably inconsistent between the sidebar and any other screen that reads it (e.g. `profile.md`'s corrected logout) — true by construction of a single global store, not by manually keeping two flags in sync.
- **SC-003**: Every one of the sidebar's 7 nav entries and both header states (logged in/out) render correctly — no dead entry, no missing conditional branch.

## Architecture Mapping

- **Feature folder**: `src/features/auth/{components,types}` — doesn't exist yet, needs scaffolding when this is implemented (see Notes for the AI Agent). No `api/` — nothing here calls `apiClient`, it's pure local/global state. No `hooks/` unless a thin wrapper around the store proves useful at implementation time.
- **Global state**: new `src/stores/auth.ts` (Zustand, mirroring `src/stores/favorites.ts`'s shape):
  ```ts
  type AuthStore = {
    isLoggedIn: boolean;
    login: () => void;
    logout: () => void;
  };
  ```
  Any feature needing login state (the Sidebar, `profile.md`'s corrected logout) reads/writes this directly — no feature imports another's local state.
- **Reuses from `src/components/ui/`**: `BottomSheet` is *not* used for the sidebar (it's a side-anchored drawer, not a bottom sheet) — likely needs its own primitive if nothing suitable exists yet; confirm at implementation time rather than forcing `BottomSheet` into a shape it wasn't built for.
- **`components/layout/SideMenu.tsx` gets its real implementation here.** It already exists as a placeholder (built during the Home round, opens a `BottomSheet` with a fixed message) — this spec is what replaces that placeholder with the real drawer (User Story 3). `search.md` is corrected to point here instead of re-describing the placeholder behavior.
- **`UserProfile` promotion**: the sidebar's logged-in header needs the same current-user data `profile.md` already mocks. Rather than the Sidebar (a `components/layout/` concern owned by no single feature) importing from `features/profile/`, `UserProfile` and its mock get promoted to shared `src/types/` and `src/mocks/` — see the correction recorded in `profile.md`'s own Changelog, not re-specified here.
- **Route**: new `app/login.tsx` — a single route handling both modes via local `isSignup` state, matching the design's single `login-frame`.
- **New dependencies**: none.

## Out of Scope

- Real authentication of any kind — no backend, no token, no session, no credential validation. This is a state flip matching the design exactly.
- Real OAuth (Google/Apple) — simulated only.
- Real password reset — simulated only.
- Persisting `isLoggedIn` across app restarts — not shown in the design (no splash-screen "restoring session" state), and this project's precedent (`favorites.md`) already defers persistence generally until a real backend exists.
- Gating any screen behind login — explicitly ruled out by User Story 2.
- Adding "Formas de pagamento" to the sidebar — flagged as `[NEEDS CLARIFICATION]`, not decided here.

## Assumptions and Dependencies

- No credential format, strength, or uniqueness validation exists or is expected at this stage.
- Depends on `app/(tabs)/profile.tsx` existing (it will, once `profile.md` is implemented) as the login CTA's navigation target.
- Depends on the Home screen's existing menu icon (already wired to open `SideMenu`, currently the placeholder) as the sidebar's entry point — no new trigger needs to be added there, just the component behind it changes.
- Assumes `isLoggedIn` starting false (logged out) is the correct default for a fresh app launch — the design's own mock state defaults to `isLoggedIn: true`, which is a demo convenience (so reviewers see the logged-in sidebar immediately), not necessarily the real intended default. **[NEEDS CLARIFICATION: should the app default to logged-out on a fresh install, matching a real product's actual first-run state, even though the design's own mock defaults to logged-in for demo convenience?]**

## Notes for the AI Agent

- `features/auth/` has no scaffolded placeholder folder, unlike every other feature in this project — create `api/`(if needed)/`components/`/`types/` fresh when implementation starts, following the same subfolder convention as the others, not a special case.
- Implementing this spec requires touching `profile.md` (FR-007's logout correction) and `search.md` (SideMenu's real content) — both already corrected at the spec level in this same round; keep the implementation consistent with those corrections, don't re-litigate them mid-implementation.
- Resolve both `[NEEDS CLARIFICATION]` items (sidebar's missing payment-methods entry, and the logged-out-by-default question) with the user before implementing User Story 3 and User Story 1 respectively — both are one-line differences in code but change what the demo actually shows on first launch / in the drawer.
- Verification: `npx tsc --noEmit` clean, `npx jest`, bundle smoke test on `/login` per the pattern in the root `CLAUDE.md`. The sidebar itself has no dedicated route (it's an overlay), so it's exercised via whichever screen renders `SideMenu` (Home, at minimum).

## Changelog

| Date | Change |
|------|--------|
| 2026-07-23 | Spec created, alongside corrections to `profile.md` (FR-007's logout) and `search.md` (SideMenu's real content) — see their own Changelogs. No implementation yet. |
