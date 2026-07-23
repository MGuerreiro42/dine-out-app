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
4. **Mocks-first with a seam ready for the real API.** Every data read in `features/*/api/` goes through a TanStack Query hook, even when reading from `src/mocks/` today. Once the real API exists, only the `queryFn` changes — UI components and hooks don't.
5. **Folder and code naming 100% in English.** The product name itself (`restaurante-app`) is the exception — a product decision, not a code convention.
6. **Scaffold with the tool's own defaults.** Architecture customization is a separate discussion, not bundled into initial setup.
7. **Don't implement business logic beyond what's explicitly requested.** Placeholder folders (empty `index.ts`) stay empty until a specific feature spec covers that module.

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Expo SDK 57 + Expo Router (file-based) | Current standard for the RN ecosystem |
| Language | TypeScript | — |
| Styling | NativeWind v4 + Tailwind v3 | NativeWind v4 doesn't support Tailwind v4 yet |
| Server state | TanStack Query | Mock→API seam without rewriting components |
| Client state | Zustand | Only for genuinely global state (see principle #3) |
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
  mocks/                     # the only thing swapped when the real API lands
  stores/                    # global state (favorites.ts, location.ts — see Decisions below)
  lib/                       # queryClient etc.
  types/                     # entities shared across features (Restaurant)
  theme/, hooks/, utils/     # placeholders, not yet specified
specs/                       # this directory — project and feature specs
```

## Feature Index

| Feature | Spec | Status |
|---|---|---|
| `search` | `specs/search.md` | Home implemented (mock data); Search & Map pending |
| `restaurant` | `specs/restaurant.md` | Spec drafted (7 user stories), not implemented |
| `favorites` | `specs/favorites.md` | Spec drafted (2 user stories), not implemented |

**Known gap**: the Profile screen's account content (avatar, stats, orders/reservations/payment/notifications/logout) has no owning feature — only its favorites rail is covered, by `favorites.md`. Needs its own feature (likely `profile` or `account`) and spec before that content is implemented.

**Future direction — authentication.** Confirmed (not yet specced): the app will eventually have a login system, and user-owned data (starting with favorites, likely extending to orders/reservations shown in the Profile account menu) will move from local/mock state to being scoped per authenticated user. This is why `favorites.md` deliberately skips client-side persistence now (see its Architecture Mapping) — building `AsyncStorage`-backed persistence today would just be replaced once auth exists. Don't build speculative auth scaffolding ahead of its own spec; this note exists so future feature specs (especially the `profile`/`account` gap above) account for it instead of re-discovering it.

## Architectural Decisions (ADR-lite)

<!-- Lightweight record of non-obvious decisions — the "why" that isn't in the code. -->

- **Favorites has no route of its own.** The design (the "Profile" frame) shows favorites only as a rail inside the profile, no dedicated tab. `features/favorites/` still exists as a domain (bulletproof-react separates by domain, not by route) — it just has no `app/(tabs)/favorites.tsx`.
- **"Favorited" state is global, not owned by the `favorites` feature.** The like button also appears in `restaurant` (detail). Under the isolation rule (#1/#3), it can't live only in `features/favorites/stores/` — it moves to `src/stores/favorites.ts` (not implemented yet).
- **`react-native-maps` instead of `expo-maps`.** `expo-maps` doesn't run on web (the official docs confirm an iOS/Android-only fallback) and is less mature. `react-native-maps` is the market standard, with `react-native-map-clustering` as a companion for scale. Trade-off: needs a dev build, doesn't run in Expo Go — gives real use to the KVM/AVD set up previously on this machine (the AVD itself hasn't been created yet).
- **`RestaurantCard` was born in `components/ui/`, not in `features/search/`.** `restaurant` also needs it (the "Similar Places" section), and features can't import each other.

## Standard Verification

Every implemented feature goes through this before being considered done (see also "Notes for the AI Agent" in each spec):

```bash
npx tsc --noEmit
# the dev server is usually already running at localhost:8081 (npx expo start --web)
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8081/<route>
```

## Environment / Known Quirks

Full details in the project's memory (outside the repo). Summary of what affects development:
- npm 12 (on this machine) breaks `npm pack --dry-run --json` for tools like `create-expo-app` — worked around, not a project bug.
- `/home` is an HDD, not NVMe — the Next/Metro "slow filesystem" warning is cosmetic, not a real problem.
