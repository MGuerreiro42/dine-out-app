# Feature Specification: Auth

**Feature**: `auth` — folder `src/features/auth/` *(doesn't exist yet — see Notes for the AI Agent)*
**Created**: 2026-07-23
**Status**: In Progress — User Stories 1, 3, and 4 Implemented; User Story 2 confirmed true-by-construction (no code needed, see its own section)
**Design reference**: `App Flow.dc.html`, frames "12a · Sidebar — Open" (implemented) and "13 · Login" (implemented)

## Summary

Optional login/signup, confirmed with the user to be purely additive: the app is fully browsable while logged out, and logging in exists only to save/personalize (favorites, orders, reservations) — nothing redirects to or requires login. This spec covers the Login/Signup screen and the app's navigation sidebar, whose header and footer change based on `isLoggedIn` — the first piece of app-wide auth state, and the second global store this project needs (after `favorites.md`'s), for the same reason: state read by more than one feature can't live in any single feature's own `stores/`.

## User Stories

### User Story 1 - Log in or create an account (Priority: P1) — **Implemented**

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

### User Story 2 - Browse fully while logged out (Priority: P1) — **Confirmed true-by-construction, no code needed**

No screen in this codebase checks `isLoggedIn` to gate rendering or redirect — confirmed by inspection (`grep -rn "isLoggedIn"` across `app/` and `src/` only turns up the Sidebar's and Profile's own conditional *display* branches, never a navigation guard). This story doesn't need its own implementation; it's a property that already holds because nothing was ever built to violate it.

A user who has never logged in can use every part of the app — Home, search, category pages, restaurant detail — without ever being asked to log in or blocked from anything.

**Why this priority**: this is a deliberate product decision (confirmed with the user), not the absence of a requirement — worth its own story so it's testable and can't quietly regress into an accidental login wall later.

**Independent test**: without logging in, navigate through Home, a restaurant detail, and the sidebar; confirm nothing redirects to or requires the login screen. Open Profile directly (logged out): confirm it still renders (with `isLoggedIn: false` styling per `profile.md`/Sidebar's conditional header), not a forced redirect to login.

**Acceptance scenarios**:

1. **Given** a logged-out session, **when** the user navigates to any screen in the app (Home, restaurant detail, category page, Profile, Orders, Reservations, Payment Methods, Notifications), **then** the screen renders normally — no redirect to the login screen, no blocking modal.
2. **Given** a logged-out session, **when** the sidebar opens, **then** its header shows "Entrar ou criar conta" instead of a profile summary (see User Story 3) — this is the *only* UI difference logged-out browsing has versus logged-in, per this story.

---

### User Story 3 - Open the navigation sidebar (Priority: P2) — **Implemented**

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

### User Story 4 - Log out (Priority: P2) — **Implemented**

A logged-in user taps "Sair da conta" in the sidebar and is immediately logged out — no confirmation step.

**Why this priority**: completes the auth loop User Story 1 starts, but nothing else in the app depends on it working for the app to be usable.

**Independent test**: while logged in, open the sidebar, tap "Sair da conta," confirm `isLoggedIn` immediately becomes false and the sidebar's own header/footer update to the logged-out state (User Story 3, scenarios 1-2 and 4) without needing to reopen the drawer.

**Acceptance scenarios**:

1. **Given** the sidebar with `isLoggedIn` true, **when** the user taps "Sair da conta," **then** `isLoggedIn` immediately becomes false — no confirmation dialog, no sheet, matching the design exactly.
2. **Given** logout just happened, **when** any screen reads `isLoggedIn` (e.g. the sidebar header, or `profile.md`'s corrected "Sair da conta" — see that spec's Changelog), **then** it reflects the logged-out state immediately, by construction (single store, not two separately-tracked flags).

---

### Edge Cases

- **The sidebar's nav list omits "Formas de pagamento"**, which *is* one of Profile's own account-menu options (`profile.md` User Story 2). **Resolved**: confirmed intentional with the user — payment methods stay reachable only from Profile, not added to the sidebar's 7 items. Followed the design literally rather than treating the omission as a gap to fix.
- **No password/email validation of any kind exists in the design** (no error states shown for e.g. invalid email format, mismatched passwords, weak password). Not in scope to invent — see Assumptions.
- **Signup with no unique-email check**: since there's no real backend, "creating an account" can't actually fail for a duplicate email. Not a gap to fix here — consistent with the rest of this prototype's no-backend scope.
- **Design inconsistency found and resolved**: the sidebar's collapse icon (`«`) links to `#sidebar-collapsed-frame` in the design canvas — an id that doesn't exist anywhere in the design file. It's a dangling anchor, not a real second sidebar state. Treated as a second close-affordance, identical to `✕` — both dismiss the drawer, no separate "collapsed" variant was built.

## Functional Requirements

- **FR-001 — Implemented**: The system MUST provide a single screen that toggles between login and signup modes.
- **FR-002 — Implemented**: Login mode MUST show email and password fields, a "Esqueceu a senha?" link, and MUST NOT show a name field.
- **FR-003 — Implemented**: Signup mode MUST show name, email, and password fields, and MUST NOT show "Esqueceu a senha?".
- **FR-004 — Implemented**: The primary CTA on either mode MUST set real `isLoggedIn` state to true and navigate to Profile — no credential validation.
- **FR-005 — Implemented**: "Esqueceu a senha?" and the Google/Apple buttons MUST produce a simulated response only (`Alert.alert`, same pattern as `restaurant.md`'s `RedirectOptionsSheetContent`).
- **FR-006 — Confirmed, no code needed**: The system MUST NOT redirect to or require the login screen from any other screen in the app (see User Story 2).
- **FR-007 — Implemented**: The system MUST provide a navigation sidebar, opened via the existing menu icon (≡), with a header that differs based on `isLoggedIn`: a profile summary linking to Profile when true, an "Entrar ou criar conta" CTA linking to login when false.
- **FR-008 — Implemented**: The sidebar MUST list navigation entries for Home, Buscar, Categorias, Favoritos, Meus pedidos, Minhas reservas, and Notificações, each navigating correctly on tap — all 7 targets are existing routes (`/`, `/search`, `/category`, `/profile`, `/profile/orders`, `/profile/reservations`, `/profile/notifications`), no new routes needed. "Formas de pagamento" deliberately not added (see Edge Cases).
- **FR-009 — Implemented**: The sidebar MUST render a "Sair da conta" control only when `isLoggedIn` is true, and tapping it MUST immediately set `isLoggedIn` to false with no confirmation step.

### Key Entities

- **AuthState**: not a rich entity — just `isLoggedIn: boolean` plus `login()`/`logout()` actions. No credentials, tokens, or session data exist anywhere in this prototype.
- **SidebarNavItem**: label, icon, and navigation target — the 7 fixed entries in User Story 3. Static, not data-driven from anywhere else.

## Success Criteria

- **SC-001**: A user can go from tapping "Entrar ou criar conta" in the sidebar to a logged-in Profile screen in exactly 2 taps (open sidebar already counted separately; 1 tap to reach login, 1 tap to submit).
- **SC-002**: `isLoggedIn` state is never observably inconsistent between the sidebar and any other screen that reads it (e.g. `profile.md`'s corrected logout) — true by construction of a single global store, not by manually keeping two flags in sync.
- **SC-003**: Every one of the sidebar's 7 nav entries and both header states (logged in/out) render correctly — no dead entry, no missing conditional branch.

## Architecture Mapping

- **Feature folder — Implemented**: `src/features/auth/{components}` only — no `types/`, no `api/`, no `hooks/`. `AuthForm.tsx` is the only component; nothing here crosses a wire boundary or needs its own query hook, so those folders were never scaffolded, matching the project's precedent of only creating the subfolders a spec's own content actually needs (`restaurant`/`favorites` don't scaffold all 5 bulletproof-react subfolders either).
- **Global state — already implemented, don't recreate**: `src/stores/auth.ts` was built in `profile.md`'s round (`feat/profile-menu`), ahead of this spec, because Profile's own `isLoggedIn`-conditional header and its logout button both needed it first. Contract matches exactly what was planned here:
  ```ts
  type AuthStore = {
    isLoggedIn: boolean;
    login: () => void;
    logout: () => void;
  };
  ```
  Default `isLoggedIn: true` (matching the design's own mock default) — the `[NEEDS CLARIFICATION]` below about the "real" first-run default is still open, untouched by that implementation. Any feature needing login state (the Sidebar, `profile.md`'s logout) reads/writes this directly — no feature imports another's local state.
- **`BottomSheet` was not reused for the sidebar drawer, confirmed at implementation time** — instead, `SideMenu.tsx` builds its own overlay directly from the same primitive technique `BottomSheet.tsx` uses (`Modal transparent` + a backdrop `Pressable` + a content `Pressable` that stops propagation), just anchored left (`flex-row`, `w-[82%]`, full height) instead of bottom (`justify-end`, rounded top corners). Not promoted to a shared `components/ui/` primitive — `BottomSheet` and this drawer differ enough (edge, sizing, no rounded corners) that forcing one shape onto both would cost more than the small amount of duplicated `Modal` boilerplate. Animation is a plain fade, not a true slide — same simplified fidelity already accepted for `BottomSheet`, no animation library added.
- **`components/layout/SideMenu.tsx` got its real implementation here — Implemented.** Replaced the placeholder (opened a `BottomSheet` with a fixed message) with the real drawer (User Story 3): identity block, 7-item nav list, conditional logout footer. Single usage site (`app/(tabs)/index.tsx`), no other screen needed changes.
- **`UserProfile`/`CURRENT_USER` — read directly, not through a new query hook.** The sidebar imports `CURRENT_USER` straight from `src/mocks/currentUser.ts` (already promoted to shared `src/mocks/` in `profile.md`'s round). Consistent with this spec's own "no `api/` folder" decision above, and the same treatment `search.md`'s `LocationHeader.tsx` already gives its own static `USER_LOCATION` mock — a static, not-yet-dynamic value doesn't need a query/loading-state seam just because it's rendered inside a `components/layout/` component rather than a route.
- **Route**: `app/login.tsx` — **Implemented**. Was a placeholder from `profile.md`'s round (needed somewhere real for its "Entrar ou criar conta" CTA); this spec replaced the placeholder body with the real single-route, both-modes-via-`isSignup` content (`AuthForm`). Back control navigates to Home unconditionally (`router.replace('/')`) — a deliberate fixed target per the design's own hardcoded `href="#home-frame"` and acceptance scenario 6, not the `canGoBack()`-fallback pattern used elsewhere (e.g. `restaurant.md`'s detail screen).
- **New dependencies**: none.

## Out of Scope

- Real authentication of any kind — no backend, no token, no session, no credential validation. This is a state flip matching the design exactly.
- Real OAuth (Google/Apple) — simulated only.
- Real password reset — simulated only.
- Persisting `isLoggedIn` across app restarts — not shown in the design (no splash-screen "restoring session" state), and this project's precedent (`favorites.md`) already defers persistence generally until a real backend exists.
- Gating any screen behind login — explicitly ruled out by User Story 2.
- Adding "Formas de pagamento" to the sidebar — confirmed intentional with the user, not added (see Edge Cases).

## Assumptions and Dependencies

- No credential format, strength, or uniqueness validation exists or is expected at this stage.
- Depends on `app/(tabs)/profile.tsx` existing (it will, once `profile.md` is implemented) as the login CTA's navigation target.
- Depends on the Home screen's existing menu icon (already wired to open `SideMenu`, currently the placeholder) as the sidebar's entry point — no new trigger needs to be added there, just the component behind it changes.
- **Confirmed with the user this round**: `isLoggedIn`'s default stays `true` (matching the design's own demo-convenience mock default, and consistent with how `stores/auth.ts` was already built in `profile.md`'s round) — not changed to `false` now. The underlying product question — whether a real fresh install should actually default to logged-out — is still genuinely open; this was a "don't change working code without a reason" call for this round, not a resolution of that question. **[NEEDS CLARIFICATION still open: revisit the real first-run default before this app is ever shipped beyond a demo.]**

## Notes for the AI Agent

- `features/auth/` was scaffolded fresh this round, `{components}` only — see Architecture Mapping for why `types/`/`api/`/`hooks/` weren't needed.
- If `favorites.md`'s User Story 2 (the favorites rail) lands after this, note it's now technically reachable both from Profile and from the sidebar's "Favoritos" entry (which navigates to `/profile`, same route) — no extra wiring needed there, just confirm the rail still renders sensibly whichever way Profile is reached.
- Verification: `npx tsc --noEmit` clean, `npx jest`, bundle smoke test on `/` and `/login` per the pattern in the root `CLAUDE.md`. The sidebar itself has no dedicated route (it's an overlay), exercised via `/` (the only current `SideMenu` usage site).

## Changelog

| Date | Change |
|------|--------|
| 2026-07-23 | Spec created, alongside corrections to `profile.md` (FR-007's logout) and `search.md` (SideMenu's real content) — see their own Changelogs. No implementation yet. |
| 2026-07-24 | `src/stores/auth.ts` and `app/login.tsx` (as a placeholder) were built in `profile.md`'s round (`feat/profile-menu`), ahead of this spec — both match exactly what this spec already specified, no contract drift. Still no implementation of this spec's own User Stories (Login/Signup content, Sidebar). |
| 2026-07-24 | User Stories 1, 3, and 4 implemented on `feat/sidebar-auth`. Resolved both `[NEEDS CLARIFICATION]` items with the user: "Formas de pagamento" stays out of the sidebar, and `isLoggedIn`'s default stays `true` (its own deeper "real first-run default" question stays open). Found and resolved one new design inconsistency: the sidebar's `«` collapse icon links to a nonexistent `#sidebar-collapsed-frame` id in the design canvas — treated as a second close-affordance alongside `✕`, no separate collapsed state built. New `src/features/auth/components/AuthForm.tsx`. `SideMenu.tsx` rewritten with its own `Modal`-based left-drawer overlay (not `BottomSheet`, not a new shared primitive). User Story 2 confirmed true-by-construction, no code needed. |
