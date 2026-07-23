# Feature Specification: Profile

**Feature**: `profile` — folder `src/features/profile/`
**Created**: 2026-07-23
**Status**: Draft
**Design reference**: `App Flow.dc.html`, frame "6 · Profile"

<!--
Naming note: PROJECT.md's "Known gap" left this open between `profile` and `account`.
Chosen `profile` to match the existing route (`app/(tabs)/profile.tsx`) and this project's
established pattern of route name = feature name (`restaurant` → detail route, `search` →
Home/explore routes). Low-cost to rename later if it turns out wrong.
-->

## Summary

The screen fills the gap PROJECT.md flagged: everything on the Profile tab that isn't the favorites rail (that's `favorites.md`'s User Story 2 — this spec composes the same route but doesn't redefine that part). Covers who the user is (avatar, name, email, activity stats) and the account menu (orders, reservations, payment, notifications, logout). Every account-menu action is a placeholder in this round, same treatment as `restaurant.md`'s Menu/Takeaway/Delivery/Reserve sheets — there's no orders, reservations, payment, or auth system anywhere in this project yet, and this spec doesn't invent one.

## User Stories

### User Story 1 - View my profile (Priority: P1)

A user opens the Profile tab and sees who they are (avatar, name, email) and a snapshot of their activity (how many favorites, orders, and reservations they have).

**Why this priority**: the screen's baseline reason to exist — without it, Profile is an empty tab.

**Independent test**: open the Profile tab, confirm avatar initial/name/email render from the mocked current-user record, confirm the three stat numbers render (favorites count reflects the real global favorites store if `favorites.md` is implemented, otherwise 0).

**Acceptance scenarios**:

1. **Given** the Profile tab, **when** it renders, **then** it shows the current user's avatar initial, name, and email from a mocked "current user" record — not placeholder text.
2. **Given** the Profile tab, **when** it renders, **then** it shows three stat numbers side by side: favorites count, orders count, reservations count.
3. **Given** zero restaurants are favorited, **when** the favorites stat renders, **then** it shows `0`, not a blank or an error.
4. **Given** one or more restaurants are favorited (via `stores/favorites.ts`, once `favorites.md` is implemented), **when** the Profile tab renders or re-renders, **then** the favorites stat matches the actual count in the store — no separate, potentially-stale counter.

---

### User Story 2 - Browse account options (Priority: P2)

A user can see a list of account-related actions (orders, reservations, payment methods, notifications, log out) and tap into any of them, even though none does anything real yet.

**Why this priority**: completes the screen visually and structurally: matches the design, gives every listed action a consistent, working (if simulated) tap target instead of dead UI — but the app is fully usable without it.

**Independent test**: tap each of the 5 account options independently, confirm each opens a sheet with a distinct, relevant placeholder message; confirm "Sair da conta" is visually distinguished (e.g. red/danger styling) from the other four.

**Acceptance scenarios**:

1. **Given** the Profile tab, **when** it renders, **then** a list of 5 account options shows: "Meus pedidos," "Minhas reservas," "Formas de pagamento," "Notificações," "Sair da conta."
2. **Given** the account option list, **when** the user taps any option other than "Sair da conta," **then** a sheet opens with a message specific to that option (not a generic "coming soon" for all five).
3. **Given** the account option list, **when** the user taps "Sair da conta," **then** a sheet opens with a distinct simulated-logout message — no real session exists to end, so nothing actually logs out.
4. **Given** "Sair da conta" in the list, **when** it renders, **then** its text is visually styled as a destructive/danger action (different color from the other four), matching the design.

---

### Edge Cases

- **Favorites count when `favorites.md`'s store doesn't exist yet**: if `stores/favorites.ts` isn't implemented when this feature is built, the favorites stat shows `0` rather than crashing or showing an error — treat a missing/empty store the same as an empty one.
- **Orders/reservations counts**: there's no orders or reservations data model anywhere in this project. These two stats are static mock numbers with nothing real behind them — **[NEEDS CLARIFICATION: is a fixed mock number (matching the prototype's 8 orders / 2 reservations) acceptable for this round, or should they just show 0 until those features exist, to avoid implying data that isn't real? Leaning toward keeping the prototype's mock numbers since this is explicitly a demo prototype, but flagging since "showing fake activity" is a product-trust question, not just a technical one.]**
- **Long user name/email**: no truncation behavior specified by the design — assume single-line, let it wrap or truncate per platform default unless it visibly breaks the layout at implementation time.

## Functional Requirements

- **FR-001**: The system MUST display the current user's avatar initial, name, and email at the top of the Profile screen, from a mocked current-user record (no login system exists — see Assumptions).
- **FR-002**: The system MUST display three stats side by side: favorites count, orders count, reservations count.
- **FR-003**: The favorites count MUST reflect the actual number of favorited restaurant ids in the shared global favorites store (`src/stores/favorites.ts`, contract owned by `favorites.md`), not a separately-tracked number.
- **FR-004**: The orders and reservations counts MUST be static mock values **[NEEDS CLARIFICATION: see Edge Cases — fixed nonzero mock, or 0]** — no orders/reservations feature exists to back them with real data.
- **FR-005**: The system MUST display a list of 5 account options: Meus pedidos, Minhas reservas, Formas de pagamento, Notificações, Sair da conta.
- **FR-006**: The user MUST be able to tap any account option and see a sheet with a message specific to that option.
- **FR-007**: "Sair da conta" MUST be visually distinguished from the other four options (danger/destructive styling) and MUST NOT perform a real logout (no session exists — see Assumptions).

### Key Entities

- **UserProfile**: the mocked "current user" — initial (avatar letter), name, email. A single hardcoded record, not a list — this project has no multi-user or auth concept yet.
- **AccountOption**: id, label, and a `danger` flag (true only for "Sair da conta") — drives both the tap-to-message mapping and the danger styling.

## Success Criteria

- **SC-001**: The Profile tab never shows placeholder text ("Profile") once this is implemented — it shows real (mocked) identity and stats immediately, no loading state needed (mock resolves instantly, same as every other feature).
- **SC-002**: The favorites stat and the Profile favorites rail (`favorites.md`) never disagree with each other — both read the same store, so this is true by construction, not by syncing two counters.
- **SC-003**: Every one of the 5 account options produces a distinct, relevant response when tapped — none is a dead tap target.

## Architecture Mapping

- **Feature folder**: `src/features/profile/{api,components,types}`. No `stores/` needed — this feature reads the global favorites store (owned by `favorites.md`) but doesn't own any state of its own; which account-menu sheet is open is local `useState`, not global.
- **Reuses from `src/components/ui/`**: `BottomSheet` (every account-option tap).
- **Reuses from `src/components/layout/`**: none — the Profile screen's header (avatar/name/email) is bespoke to this feature, not the app-wide `SearchBar`/`SideMenu` chrome used on Home/detail.
- **Global state**: reads (does not write) `src/stores/favorites.ts` for FR-003 — depends on `favorites.md` being implemented first, or at least having its store contract in place, for the favorites count to be anything other than 0. If `favorites.md` hasn't landed yet when this feature is picked up, either implement `stores/favorites.ts` as part of this work (coordinate so the contract isn't defined twice, same rule as `restaurant.md`/`favorites.md`) or ship with a hardcoded 0 and revisit.
- **Types**: `UserProfile`, `AccountOption` live in `src/features/profile/types/` — neither is shared with another feature.
- **Mocks**: new `src/mocks/currentUser.ts` — one hardcoded `UserProfile` record, and the static orders/reservations count values (pending the FR-004 clarification).
- **New dependencies**: none.
- **Route**: `app/(tabs)/profile.tsx` — currently a placeholder. This feature and `favorites.md`'s User Story 2 (the favorites rail) compose the *same* screen; sequence or coordinate the two so the route isn't half-implemented by one and then awkwardly retrofitted by the other. Whichever lands first should still leave a sensible layout for the second to slot into (stats/menu above or below the favorites rail, matching the design's actual order: header → stats → favorites rail → account menu).

## Out of Scope

- The favorites rail itself — that's `favorites.md`'s User Story 2, not redefined here.
- Any real orders, reservations, or payment system — those sections are placeholder sheets only, matching FR-004/FR-006.
- Real authentication/login/logout — "Sair da conta" is simulated; see PROJECT.md's "Future direction — authentication" note for why this is deliberate, not deferred by oversight.
- Editing profile info (name, email, avatar) — the design doesn't show an edit affordance on this frame.
- Push notification preferences actually doing anything — "Notificações" opens a placeholder sheet like the rest.

## Assumptions and Dependencies

- Exactly one mocked "current user" exists; there's no login, so there's no concept of switching users or an empty/logged-out state.
- Depends on `app/(tabs)/profile.tsx` existing as a route (it does, currently a placeholder).
- Depends on `src/stores/favorites.ts` for a meaningful (non-zero) favorites count — see Architecture Mapping.
- Assumes the orders/reservations mock numbers, once the FR-004 clarification resolves, don't need to correspond to any real, inspectable list of orders/reservations anywhere else in the app — they're display-only stats with no drill-down.

## Notes for the AI Agent

- Resolve FR-004's `[NEEDS CLARIFICATION]` with the user before implementing the stats row — it's a one-line difference (mock numbers vs. zeros) but changes what the demo visually claims.
- Check `favorites.md`'s `Status` before starting: if its store isn't implemented yet, decide with the user whether to build `stores/favorites.ts` as part of this work or ship with a 0 placeholder.
- Before building the account-option sheet content, check `restaurant.md`'s `RedirectOptionsSheetContent`-style components for a reusable pattern — "tap an option, see a simulated message" is the same shape already built for Takeaway/Delivery.
- Verification: `npx tsc --noEmit` clean, `npx jest`, bundle smoke test on `/profile` per the pattern in the root `CLAUDE.md`.

## Changelog

| Date | Change |
|------|--------|
| 2026-07-23 | Spec created. No implementation yet. |
