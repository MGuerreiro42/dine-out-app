# Feature Specification: Auth

**Feature**: `auth` — folder `src/features/auth/`
**Created**: 2026-07-23
**Status**: In Progress — User Stories 1, 3, 4, 5, 6 Implemented (real backend); User Story 2 true by construction; form validation (FR-010) implemented; FR-011–FR-018 implemented and verified against the real `dine-out-backend`
**Design reference**: `App Flow.dc.html`, frames "12a · Sidebar — Open" and "13 · Login"

## Summary

Optional login/signup: the app is fully browsable while logged out. Login exists only to save/personalize (favorites, orders, reservations) — nothing redirects to or requires it. Covers the Login/Signup screen and the navigation sidebar, whose header/footer change based on `isLoggedIn` — the second global store in this project, after `favorites.md`'s.

## User Stories

### User Story 1 - Log in or create an account (Priority: P1) — Implemented (simulated); real backend call designed, not implemented

A user toggles between "Log in" (login) and "Create account" (signup) modes on a single screen, and authenticates with email/password or a simulated Google/Apple flow.

**Independent test**: open the login screen, confirm login mode shows email + password + "Forgot your password?"; toggle to signup, confirm a name field appears and "Forgot your password?" disappears; tap the primary CTA, confirm the session is set and the app navigates to Profile.

**Acceptance scenarios**:

1. **Given** login mode, **when** it renders, **then** it shows email, password, "Forgot your password?", and a primary "Log in" button.
2. **Given** the login screen, **when** the user taps the mode-switch link, **then** it switches to signup mode (name field added, "Forgot your password?" removed, button reads "Create account").
3. **Given** either mode, **when** the user taps the primary button and FR-010's validation passes, **then** the app calls `POST /auth/signup` or `POST /auth/login` (FR-012); success sets the session and navigates to Profile; failure surfaces per FR-014.
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

### User Story 4 - Log out (Priority: P2) — Implemented (local-only); server-side revocation designed, not implemented

A logged-in user taps "Log out" and is immediately logged out — no confirmation step.

**Independent test**: while logged in, tap "Log out," confirm `isLoggedIn` immediately becomes false and the sidebar's header/footer update without reopening.

**Acceptance scenarios**:

1. **Given** `isLoggedIn` true, **when** the user taps "Log out," **then** `isLoggedIn` becomes false immediately — no dialog, no sheet.
2. **Given** logout just happened, **when** any screen reads `isLoggedIn`, **then** it reflects the logged-out state immediately.
3. **Given** the user taps "Log out," **when** the local session clears, **then** `POST /auth/logout` fires in the background with the stored refresh token (FR-018) — its result does not block or reverse the local logout.

---

### User Story 5 - Session persists across app restart (Priority: P1) — Designed, not implemented

A user who logged in previously is still logged in the next time they open the app, without re-entering credentials, as long as their refresh token is still valid.

**Why this priority**: without this, every cold start forces a re-login — the app cannot ship real accounts without it.

**Independent test**: log in, force-quit the app, reopen it — confirm the app reaches an `isLoggedIn: true` state without visiting the login screen. Clear `expo-secure-store` (or let the refresh token expire/rotate-reuse), reopen — confirm the app reaches `isLoggedIn: false` with no error surfaced to the user.

**Acceptance scenarios**:

1. **Given** a valid refresh token in `expo-secure-store`, **when** the app cold-starts, **then** `useAuthStore.bootstrap()` (FR-015) calls `POST /auth/refresh`, then `GET /users/me`, and sets the session — no visible loading screen beyond the app's existing startup state.
2. **Given** no refresh token in `expo-secure-store`, **when** the app cold-starts, **then** the store resolves directly to `status: 'guest'`.
3. **Given** an expired or reuse-detected refresh token, **when** `bootstrap()` runs, **then** the store clears `expo-secure-store` and resolves to `status: 'guest'` — no error dialog.

---

### User Story 6 - Access token refreshes transparently mid-session (Priority: P2) — Designed, not implemented

A logged-in user never sees a spurious logged-out state because their 15-minute access token expired mid-session — the app silently refreshes it and retries.

**Why this priority**: without this, every user is forced to re-login every 15 minutes.

**Independent test**: with a stubbed 401 on one authenticated request, confirm the app calls `POST /auth/refresh`, retries the original request once with the new access token, and the caller never observes the intermediate 401.

**Acceptance scenarios**:

1. **Given** a logged-in session, **when** any authenticated request returns `401`, **then** `apiClient.ts` calls `POST /auth/refresh` once and retries the original request with the new access token (FR-017).
2. **Given** two authenticated requests fail with `401` at nearly the same time, **when** both trigger the retry path, **then** only one `POST /auth/refresh` call is made — both requests retry against its result.
3. **Given** the refresh call itself fails, **when** that happens, **then** the session clears (`status: 'guest'`) and the original request's `401` propagates to its caller — no automatic navigation to the login screen (FR-006/US2 still holds).

---

### Edge Cases

- Sidebar omits "Payment methods" (a Profile-only account-menu option).
- No email/password strength or uniqueness validation beyond FR-010/FR-013 — the backend is the source of truth for uniqueness (409 on signup).
- Sidebar's `«` collapse icon acts as a second close-affordance, identical to `✕` — no separate "collapsed" state.
- `bootstrap()` runs once per cold start; an app already running through a background/foreground cycle does not re-run it — only an in-session 401 (User Story 6) refreshes mid-session.
- A logout's background `POST /auth/logout` failing (e.g. offline) leaves the local session cleared regardless — the refresh token is already removed from `expo-secure-store`, so the stale server-side session simply expires on its own 30-day TTL.

## Functional Requirements

- **FR-001** — Implemented: single screen toggling login/signup modes.
- **FR-002** — Implemented: login mode shows email + password + "Forgot your password?", no name field.
- **FR-003** — Implemented: signup mode shows name + email + password, no "Forgot your password?".
- **FR-004** — Designed, not implemented: primary CTA calls `POST /auth/signup` or `POST /auth/login` (FR-012), gated by FR-010's validation; success sets the session (FR-016) and navigates to Profile; failure per FR-014.
- **FR-005** — Implemented: "Forgot your password?" and Google/Apple buttons produce a simulated response only (`Alert.alert`).
- **FR-006** — True by construction: no screen redirects to or requires login (User Story 2).
- **FR-007** — Implemented: sidebar header differs by `isLoggedIn` — profile summary linking to Profile (true) vs. "Log in or sign up" linking to login (false).
- **FR-008** — Implemented: sidebar lists Home, Search, Categories, Favorites, My orders, My reservations, Notifications — "Payment methods" excluded.
- **FR-009** — Implemented: sidebar shows "Log out" only when `isLoggedIn` true; tapping it sets `isLoggedIn` false immediately, no confirmation.
- **FR-010** — Not implemented: `AuthForm` MUST validate on submit, before FR-004's side effect:
  - Email (both modes): required, basic format check. Empty → "Enter your email." Malformed → "Invalid email."
  - Password (both modes): required, min 8 chars — matches the backend's `SignupDto` (FR-013). Empty → "Enter your password." Too short → "Password must be at least 8 characters."
  - Full name (signup only): required, non-empty after trim. Empty → "Enter your full name."
  - Error text uses the same danger color as "Log out"; field border switches to match.
  - Validates on submit, not per keystroke. A field's error clears when its value next changes.
  - Any failing field blocks submission and shows all failing messages at once.
- **FR-011** — Resolved, not implemented: cold-start refresh-token hydration (FR-015) fully replaces the static `isLoggedIn` default. `status` MUST start `'hydrating'` and resolve to `'authenticated'` or `'guest'` before any screen reads it — there is no separate static default to flip; `'guest'` is simply what `bootstrap()` resolves to absent a stored refresh token.
- **FR-012** — Designed, not implemented: `AuthForm`'s `onSubmit` MUST call a new `src/features/auth/api/useSignupMutation.ts` (signup mode) or `useLoginMutation.ts` (login mode), each wrapping `POST /auth/signup`/`POST /auth/login` via `src/mocks/repository.ts`'s `signup()`/`login()`. `onSubmit`'s signature changes from `() => void` to `(values: { name?: string; email: string; password: string }) => void`.
- **FR-013** — Resolved, not implemented: client-side password validation MUST use the same 8-character minimum as the backend's `SignupDto` — FR-010's bullet list reflects this value.
- **FR-014** — Resolved, not implemented: signup `409` and login `401` MUST render as an inline per-field error, same visual treatment as FR-010 (danger color, field border). Signup `409` attaches "Email already registered." to the email field. Login `401` attaches "Invalid email or password." to the password field — the message itself names both fields so the placement doesn't leak which one was wrong (backend's no-enumeration guarantee, FR-006 in `dine-out-backend`'s `specs/auth.md`).
- **FR-015** — Designed, not implemented, contingent on FR-011: `useAuthStore.bootstrap()` MUST run once per cold start (called from `app/_layout.tsx`'s existing `useEffect`, alongside `useLocationStore.getState().resolveLocation()`). It reads the refresh token from `src/lib/secureTokenStorage.ts`; absent: `status: 'guest'`. Present: calls `POST /auth/refresh`, then `GET /users/me`; success sets the session; failure clears `expo-secure-store` and sets `status: 'guest'` — no error surfaced to the user.
- **FR-016** — Designed, not implemented: the access token MUST live only in memory (`apiClient.ts`'s module state, mirrored into `useAuthStore.accessToken` for reactivity). The refresh token MUST live only in `expo-secure-store` (new dependency, not yet installed — see Architecture Mapping). Neither token is written to `AsyncStorage` or a persisted Zustand store.
- **FR-017** — Designed, not implemented: `apiClient.ts` MUST attach `Authorization: Bearer <accessToken>` to every request when a token is set. On a `401` from a request that had a token attached, it MUST call `POST /auth/refresh` at most once, retry the original request once with the new access token, and dedupe concurrent 401s into a single in-flight refresh call (`ARCHITECTURE.md` §7). A failed refresh clears the session (FR-018's `clearSession`) and propagates the original `401` to the caller — no automatic navigation.
- **FR-018** — Designed, not implemented: `logout()` MUST clear the local session (access token, user, `status: 'guest'`, `expo-secure-store`'s refresh token) synchronously, preserving FR-009's no-confirmation behavior, then call `POST /auth/logout` in the background with the token that was stored — a failed call does not block or reverse the local logout.

### Key Entities

- **AuthState** (`src/stores/auth.ts`):
  ```ts
  type AuthUser = { id: number; name: string; email: string };
  type AuthStatus = 'hydrating' | 'authenticated' | 'guest';

  type AuthState = {
    status: AuthStatus;
    isLoggedIn: boolean; // derived, kept in lockstep with status for existing readers (SideMenu, profile.tsx)
    user: AuthUser | null;
    accessToken: string | null;
    bootstrap: () => Promise<void>;
    setSession: (session: { accessToken: string; refreshToken: string; user: AuthUser }) => Promise<void>;
    logout: () => void;
  };
  ```
  `login()` (no-arg) is removed — signing in now requires credentials, handled by FR-012's mutation hooks, which call `setSession` on success.
- **SidebarNavItem**: label, icon, navigation target — 7 fixed entries, static, not data-driven.

## Success Criteria

- **SC-001**: "Log in or sign up" in the sidebar to a logged-in Profile in exactly 2 taps.
- **SC-002**: `isLoggedIn` never observably inconsistent between the sidebar and any other reader — single store.
- **SC-003**: All 7 sidebar nav entries and both header states render correctly.

## Architecture Mapping

- **Feature folder**: `src/features/auth/{api,components}`. `components/AuthForm.tsx` unchanged in location; new `api/useSignupMutation.ts`, `api/useLoginMutation.ts` (barrel `api/index.ts` per the existing convention in `features/profile/api`, `features/favorites/api`).
- **Global state**: `src/stores/auth.ts` — new shape per Key Entities above (`status`, `user`, `accessToken`, `bootstrap()`, `setSession()`, `logout()`). Imports `src/lib/apiClient.ts` (to call `signup`/`login`/`refreshSession`/`logoutSession` via `src/mocks/repository.ts`, and to register the session-expired callback) and `src/lib/secureTokenStorage.ts`. `apiClient.ts` does NOT import `src/stores/auth.ts` — see below, one-directional to avoid a cycle.
- **`src/lib/apiClient.ts`** extended:
  - `apiPost<T>(path, body?)`, `apiPut<T>(path, body?)`, `apiDelete(path)` alongside the existing `apiGet`.
  - `setAccessToken(token: string | null)`: sets an internal module-level variable; `useAuthStore`'s `setSession`/`logout` call it to keep the network layer's token in sync with the store.
  - `setSessionExpiredHandler(handler: () => void)`: registered once by `src/stores/auth.ts` (calls `clearSession`); lets `apiClient.ts` signal "the session is no longer valid" without importing the store.
  - Every request attaches `Authorization: Bearer <token>` when the internal token is set.
  - A `401` on a request that had a token attached triggers one `POST /auth/refresh` (reading/writing the refresh token via `secureTokenStorage.ts`), deduped across concurrent 401s via a shared in-flight promise, then retries the original request once. Refresh failure calls the session-expired handler and propagates the original `401` (FR-017).
  - `ApiError` gains an optional `body?: unknown` — the parsed JSON error response (NestJS default `{statusCode, message, error}`), read by FR-014's error-display logic. A `204` response resolves to `undefined`, not `response.json()`.
- **New file `src/lib/secureTokenStorage.ts`**: wraps `expo-secure-store`'s `getItemAsync`/`setItemAsync`/`deleteItemAsync` for one key (the refresh token) — `getRefreshToken()`, `setRefreshToken(token)`, `clearRefreshToken()`. The only file that touches `expo-secure-store` directly.
- **`src/lib/api/schema.ts`** gains `AuthUserSchema`, `AuthTokensSchema` (`{accessToken, refreshToken}`), `AuthResponseSchema` (tokens + user) — same file that already holds `RestaurantSummarySchema`/`RestaurantDetailSchema`, per the existing wire-contract convention.
- **`src/mocks/repository.ts`** gains `signup()`, `login()`, `refreshSession()`, `logoutSession()` — thin wrappers around `apiPost`, matching how `getNearbyPlaces`/`getPlaceDetails` already wrap `apiGet`. `getCurrentUser()` switches from returning the `CURRENT_USER` fixture to `apiGet('/users/me')` — same signature, same call sites (`features/profile/api/useCurrentUserQuery.ts` untouched).
- **`src/mocks/currentUser.ts`** deleted — its only other reader, `SideMenu.tsx`, switches to `useAuthStore((s) => s.user)`.
- **`AuthForm.tsx`**: `onSubmit` signature changes per FR-012; min-length and error-display copy per FR-013/FR-014 once resolved.
- **`app/login.tsx`**: calls `useSignupMutation()`/`useLoginMutation()` instead of `useAuthStore((s) => s.login)`; navigates to `/profile` in each mutation's success path.
- **`app/_layout.tsx`**: its existing `useEffect` (currently only `useLocationStore.getState().resolveLocation()`) gains `useAuthStore.getState().bootstrap()`, same fire-and-forget pattern.
- **Sidebar drawer**: `SideMenu.tsx` builds its own overlay from `Modal transparent` + backdrop + stop-propagation, anchored left instead of bottom — not `BottomSheet`. Plain fade, no animation library. Unchanged by this pass except the `CURRENT_USER` → `user` swap above.
- **`components/layout/SideMenu.tsx`**: identity block, 7-item nav list, conditional logout footer. Single usage site (`app/(tabs)/index.tsx`).
- **Route**: `app/login.tsx`. Back control navigates to Home unconditionally (`router.replace('/')`), not `canGoBack()`.
- **New dependency**: `expo-secure-store` — NOT currently installed. Required by FR-016 for refresh-token storage; `ARCHITECTURE.md` §5 already designs this. Flagged here for explicit sign-off per this project's dependency policy — not installed by this spec pass.

## Out of Scope

- Real OAuth (Google/Apple) and real password reset — simulated only. Real OAuth's target shape (authorization code + PKCE) is a deferred item in `ARCHITECTURE.md` §10.
- Gating any screen behind login (User Story 2) — public routes stay public even once real tokens exist (`ARCHITECTURE.md` §7).
- Adding "Payment methods" to the sidebar.
- Migrating a guest's locally-favorited restaurants to their account on login — see `favorites.md`'s open guest-favoriting item.

## Assumptions and Dependencies

- Format/min-length validation exists (FR-010, pending FR-013's resolution), no strength or uniqueness validation beyond the backend's own `409` on signup.
- Depends on `app/(tabs)/profile.tsx` and the Home menu icon (wired to `SideMenu`) as entry points.
- Depends on `dine-out-backend`'s `AuthModule` (signup/login/refresh/logout/`GET /users/me`) already being implemented and reachable at `EXPO_PUBLIC_API_BASE_URL`.
- `isLoggedIn`'s guest default is fully determined by `bootstrap()` (FR-011/FR-015) — every reader branches correctly once hydration resolves, regardless of how the store reaches `'guest'`.

## Notes for the AI Agent

- `features/auth/` is `{api,components}` as of this pass.
- `favorites.md`'s favorites rail is reachable both from Profile and the sidebar's "Favorites" entry (same route) — no extra wiring needed.
- FR-011/FR-013/FR-014 are resolved (2026-08-29) — all of FR-011–FR-018 are implementable in any order.
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
| 2026-08-29 | Real-backend integration designed (not implemented): User Stories 5–6 added (cold-start hydration, transparent refresh); FR-012, FR-015–FR-018 specify `apiClient.ts`'s POST/PUT/DELETE + Bearer + 401-retry-once extensions, `useAuthStore`'s new `{status, user, accessToken, bootstrap, setSession, logout}` shape, `expo-secure-store` for the refresh token (new dependency, flagged for sign-off, not installed), and `src/lib/secureTokenStorage.ts`. `login()` (no-arg) removed from the store in favor of credentialed signup/login mutations. FR-011 (guest default), FR-013 (password min-length reconciliation), FR-014 (409/401 error display) marked `[NEEDS CLARIFICATION]`. |
| 2026-08-29 | `[NEEDS CLARIFICATION]` resolved: FR-011 — `bootstrap()`'s hydration fully replaces the static guest default, no separate flip. FR-013 — client-side password minimum raised to 8, matching the backend. FR-014 — inline per-field error (FR-010's visual pattern); signup `409` on the email field, login `401` on the password field with a two-field-naming message so placement doesn't leak which field was wrong. `expo-secure-store` sign-off granted. Ready for implementation. |
| 2026-08-29 | FR-011–FR-018 implemented and verified end-to-end against the real `dine-out-backend` (signup/login/refresh/logout, `GET /users/me`) — `expo-secure-store` installed; `secureTokenStorage.ts` wraps it and swallows errors (the module has no web implementation — `SecureStore.*Async` throw on `expo start --web`; treated as "no stored token" so cold-start hydration and login/logout stay crash-free on web, matching this project's existing native-only-persistence precedent for `react-native-maps`). `apiClient.ts` gained `apiPost`/`apiPut`/`apiDelete`, Bearer injection, deduped 401→refresh→retry-once, `ApiError.body`, 204 handling. `stores/auth.ts` rewritten to `{status, user, accessToken, bootstrap, setSession, logout}`; imports `stores/favorites.ts` for `setFavoriteIds([])` on logout/session-expiry (a require cycle with `stores/favorites.ts`, which imports `stores/auth.ts` back for `isLoggedIn` — both sides use lazy `.getState()` calls only, confirmed safe by the passing test suite and a clean web bundle). `features/profile/api/useCurrentUserQuery.ts` gained an `enabled: isLoggedIn` guard (not called out in this spec's Architecture Mapping, but required — `/users/me` now needs a Bearer token, and the unconditional call was breaking Profile's guest render, contradicting `auth.md`'s own User Story 2). `repository.ts`'s `getCurrentUser()` derives `initial` from `name` client-side, since `/users/me` returns `{id, name, email}` with no `initial` field but `UserProfileSchema` still requires one. Verified: `npx tsc --noEmit`/`npx jest`/`npx biome lint .` clean; real backend + `expo start --web` + Playwright — signup → session set → profile shows real user → favorite a restaurant → `PUT /favorites/:id` 204 → independent `curl` login confirms `GET /favorites` returns the id server-side → logout → Profile reverts to guest state, `GET /favorites` 401s again. |
