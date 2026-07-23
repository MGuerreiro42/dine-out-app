# restaurante-app — Project Specification

**Status**: Navigable prototype (no backend) · **Last updated**: 2026-07-23

<!--
This file plays the role of GitHub spec-kit's constitution.md (github.com/github/spec-kit) —
the principles every feature spec (see TEMPLATE.md) must follow by default, without repeating them.
Feature specs can deviate from a principle here, but must declare it explicitly and justify it.
-->

## Vision

An app for discovering bars and restaurants. Current phase: a navigable prototype to present to business partners, no backend — all data comes from local mocks structured so they can later become a real API without changing components.

## Architecture Principles

1. **Bulletproof-react adapted for React Native.** Every folder in `features/` is an isolated vertical module (`api/`, `components/`, `hooks/`, `stores/`, `types/`). Features NEVER import each other directly.
2. **`src/components/ui/` and `src/components/layout/` are different things.** `ui/` is a generic primitive reused as detail (card, chip, sheet). `layout/` is the structural frame present on (almost) every screen (search bar, side menu). Both live outside `features/` because more than one feature uses them.
3. **State only becomes global when it needs to.** Rule: if only one feature reads/writes a piece of state, it stays in `features/[name]/stores/`. If two or more features need the same state (e.g. "favorited" is read by both `restaurant` and `favorites`), it moves up to `src/stores/` — otherwise the isolation rule (#1) breaks.
4. **Mocks-first with a real network seam, not just an in-memory one.** Every data read in `features/*/api/` goes through a TanStack Query hook whose `queryFn` calls `apiClient` (a thin `fetch` wrapper) against contract-shaped endpoints (`GET /restaurants`, etc.) — MSW intercepts those calls today (`src/mocks/handlers/`), backed by the same fixture data that used to be imported directly. Once the real API exists, only the base URL changes (and MSW gets disabled) — components, hooks, and the endpoint contracts don't. Request/response shapes are Zod schemas (`src/types/`, `features/*/types/`) doing double duty as both the TS type and a runtime-checked contract, so a real backend drifting from what the frontend expects fails loudly instead of shipping broken data.
5. **Folder and code naming 100% in English.** The product name itself (`restaurante-app`) is the exception — a product decision, not a code convention.
6. **Scaffold with the tool's own defaults.** Architecture customization is a separate discussion, not bundled into initial setup.
7. **Don't implement business logic beyond what's explicitly requested.** Placeholder folders (empty `index.ts`) stay empty until a specific feature spec covers that module.

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Expo SDK 57 + Expo Router (file-based) | Current standard for the RN ecosystem |
| Language | TypeScript | — |
| Styling | NativeWind v4 + Tailwind v3 | NativeWind v4 doesn't support Tailwind v4 yet |
| Server state | TanStack Query | Mock→API seam without rewriting components. `staleTime` 5min, `retry` 1 (reduced from the default 3 — against MSW, failures are deterministic bugs, not transient blips; raise it once a real, occasionally-flaky backend exists) |
| Client state | Zustand | Only for genuinely global state (see principle #3) |
| Contracts | Zod | Request/response shapes are schemas, not plain types — `.parse()` on every response catches contract drift immediately instead of silently passing bad data downstream |
| API mocking | MSW (`msw/native` + `msw/browser`) | Intercepts real `fetch` calls so `queryFn` never special-cases "mock vs real" — swapping to a real backend later is a base-URL change, not a code change. Two separate setups because the app runs in genuinely different environments: native (Expo Go/dev build) and an actual browser tab. Does **not** run in `msw/node` under this project — see Testing row |
| Testing | Jest (`jest-expo` preset) + React Testing Library | Chosen over Vitest: `vitest-native` (the only way to run RN tests under Vitest) is beta with unconfirmed NativeWind/Expo Router support; `jest-expo` is Expo's own documented path and reuses this project's `babel.config.js`. **Gotcha**: MSW's package exports explicitly disable `msw/node` under the `"react-native"` resolution condition that `jest-expo` sets even for tests — use `msw/native` in `jest.setup.js` too, not `msw/node` |
| Maps | `react-native-maps` | More performant/scalable than `expo-maps`; accepted trade-off: doesn't run in Expo Go, needs a dev build |
| Import alias | `@/*` → `src/*` | Native to the SDK 57 template via `tsconfig.paths`, no `babel-plugin-module-resolver` needed |

## Folder Structure

```
app/                        # Expo Router routes — thin, delegates to features/
  (tabs)/{index,explore,profile}.tsx
  restaurant/[id].tsx
src/
  components/
    ui/                      # generic primitives (RestaurantCard, BottomSheet, Chip, HorizontalRail, RatingBadge)
    layout/                  # app frame (SearchBar, SideMenu)
  features/
    search/                  # Home + category discovery + search + Search & Map
    restaurant/               # restaurant detail
    favorites/                 # favorites domain (no route of its own — consumed inside profile)
  mocks/                     # fixture data (restaurants.ts etc.) + handlers/ (MSW resolvers) + native.ts/browser.ts/enableMocking.ts
  stores/                    # global state (favorites.ts, location.ts — see Decisions below)
  lib/                       # queryClient.ts, apiClient.ts (fetch wrapper, MSW-intercepted)
  types/                     # entities shared across features (Restaurant — Zod schema + inferred type)
  theme/, hooks/, utils/     # placeholders, not yet specified
public/                      # mockServiceWorker.js (generated via `npx msw init public/ --save`, don't hand-edit)
specs/                       # this directory — project and feature specs
jest.config.js, jest.setup.js
```

## Feature Index

| Feature | Spec | Status |
|---|---|---|
| `search` | `specs/search.md` | Home implemented (mock data); Search & Map pending |
| `restaurant` | `specs/restaurant.md` | US1+US2 implemented (mock data); US3–US7 not started |
| `favorites` | `specs/favorites.md` | Spec drafted (2 user stories), not implemented |

**Known gap**: the Profile screen's account content (avatar, stats, orders/reservations/payment/notifications/logout) has no owning feature — only its favorites rail is covered, by `favorites.md`. Needs its own feature (likely `profile` or `account`) and spec before that content is implemented.

**Future direction — authentication.** Confirmed (not yet specced): the app will eventually have a login system, and user-owned data (starting with favorites, likely extending to orders/reservations shown in the Profile account menu) will move from local/mock state to being scoped per authenticated user. This is why `favorites.md` deliberately skips client-side persistence now (see its Architecture Mapping) — building `AsyncStorage`-backed persistence today would just be replaced once auth exists. Don't build speculative auth scaffolding ahead of its own spec; this note exists so future feature specs (especially the `profile`/`account` gap above) account for it instead of re-discovering it.

## Architectural Decisions (ADR-lite)

<!-- Lightweight record of non-obvious decisions — the "why" that isn't in the code. -->

- **Favorites has no route of its own.** The design (the "Profile" frame) shows favorites only as a rail inside the profile, no dedicated tab. `features/favorites/` still exists as a domain (bulletproof-react separates by domain, not by route) — it just has no `app/(tabs)/favorites.tsx`.
- **"Favorited" state is global, not owned by the `favorites` feature.** The like button also appears in `restaurant` (detail). Under the isolation rule (#1/#3), it can't live only in `features/favorites/stores/` — it moves to `src/stores/favorites.ts` (not implemented yet).
- **`react-native-maps` instead of `expo-maps`.** `expo-maps` doesn't run on web (the official docs confirm an iOS/Android-only fallback) and is less mature. `react-native-maps` is the market standard, with `react-native-map-clustering` as a companion for scale. Trade-off: needs a dev build, doesn't run in Expo Go — gives real use to the KVM/AVD set up previously on this machine (the AVD itself hasn't been created yet).
- **`RestaurantCard` was born in `components/ui/`, not in `features/search/`.** `restaurant` also needs it (the "Similar Places" section), and features can't import each other.
- **`RestaurantDetail` extends the shared `Restaurant` type rather than duplicating its fields**, and lives in `src/features/restaurant/types/` (feature-specific), not `src/types/` — the extra detail-screen fields aren't needed by other features, only the base shape is.
- **A spec can drift internally, not just from the code.** Implementing `restaurant.md`'s US1/US2 surfaced that FR-017 and FR-018 were written into the Functional Requirements list without being referenced by any User Story's acceptance scenarios — a spec-authoring gap, not a code bug. Fixed by annotating both FRs in place rather than silently building or silently dropping them. Worth checking for on future specs before implementing, not just after.
- **`msw/node` doesn't work in this project, in the app or in tests — use `msw/native` for both.** MSW's own `package.json` sets its `"./node"` export to `null` under the `"react-native"` resolution condition. `jest-expo` applies that same condition to Jest itself (to accurately emulate what Metro would resolve), so even test-only code hits this. `jest.setup.js` imports the app's own `src/mocks/native.ts` (same `server` instance concept, re-evaluated fresh per Jest process) rather than standing up a separate `msw/node` setup.
- **MSW's ESM dependency tree needed explicit Jest config, and that required switching from `package.json`'s `"jest"` key to a real `jest.config.js`.** Two separate misses: (1) `transformIgnorePatterns` needed extending (not replacing — `jest-expo`'s own default already whitelists Expo/RN packages) to also allow `msw`, `@mswjs/*`, `rettime`, and a few of MSW's other transitive deps to be transformed; (2) `rettime` ships `.mjs`, and `jest-expo`'s default `transform` map only covers `.js/.jsx/.ts/.tsx` — needed an explicit `'\\.mjs$'` entry pointing at the same babel-jest transformer. Both require programmatic merging (spreading the preset's own arrays/objects), which a static JSON blob in `package.json` can't do — hence `jest.config.js` requiring `jest-expo/jest-preset` directly.
- **Expo Router's web target runs in two different JS contexts, and MSW needs to know which one it's in.** The initial request is server-rendered in an actual Node process (`resolver.environment=node` — no `document`, no real network stack), then the client hydrates in a real browser. `msw/browser`'s `setupWorker` throws outside a genuine browser, so `enableMocking()` can't gate on `Platform.OS === 'web'` alone — it also checks `typeof document !== 'undefined'` and skips mocking entirely during the Node/SSR pass (which never resolves queries itself anyway; only the hydrated client does).
- **`@testing-library/react-native` v14 made `render` and `renderHook` `async`** (part of its "drops React 18, async APIs by default" migration). Forgetting to `await` them doesn't error clearly — `render()` returns before the component tree mounts, so a synchronous `screen.getByText(...)` right after throws MSW-unrelated-looking `` `render` function has not been called `` from the library's own internals, not from your component.

## Standard Verification

Every implemented feature goes through this before being considered done (see also "Notes for the AI Agent" in each spec):

```bash
npx tsc --noEmit
npx jest
# the dev server is usually already running at localhost:8081 (npx expo start --web)
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8081/<route>
```

## Environment / Known Quirks

Full details in the project's memory (outside the repo). Summary of what affects development:
- npm 12 (on this machine) breaks `npm pack --dry-run --json` for tools like `create-expo-app` — worked around, not a project bug.
- `/home` is an HDD, not NVMe — the Next/Metro "slow filesystem" warning is cosmetic, not a real problem.
