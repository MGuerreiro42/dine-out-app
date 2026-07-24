# dine-out-app — Project Specification

**Status**: Navigable prototype (no backend) · **Last updated**: 2026-07-24

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
5. **Folder and code naming 100% in English**, including the product name itself (`dine-out-app` — renamed 2026-07-23 from `restaurante-app`, which had been a deliberate Portuguese exception until then; see the ADR log).
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
  (tabs)/{index,search,category,profile}.tsx  # 4 real tabs, matching the design's bottom tab bar (Home/Buscar/Categorias/Perfil) — category.tsx implemented (US3) and profile.tsx implemented (profile.md's US1-2); search.tsx still a placeholder (US2 not implemented), see ADR log
  restaurant/[id].tsx
  profile/{orders,reservations,payment,notifications}.tsx  # trivial PlaceholderScreen routes, pushed from the profile tab — real content is profile.md's US3-6
  login.tsx                  # trivial PlaceholderScreen route — real content is auth.md's User Story 1
src/
  components/
    ui/                      # generic primitives (RestaurantCard, BottomSheet, Chip, HorizontalRail, RatingBadge)
    layout/                  # app frame (SearchBar, SideMenu)
  features/
    search/                  # Home + category discovery + search + Search & Map
    restaurant/               # restaurant detail
    favorites/                 # favorites domain (no route of its own — consumed inside profile)
    profile/                   # profile header/stats/account menu (shares the profile route with favorites)
  mocks/                     # fixture data (restaurants.ts etc.) + handlers/ (MSW resolvers) + native.ts/browser.ts/enableMocking.ts
  stores/                    # global state (favorites.ts, auth.ts, location.ts — see Decisions below)
  lib/                       # queryClient.ts, apiClient.ts (fetch wrapper, MSW-intercepted), googlePlaces/ (wire-contract schemas/mappers, see ADR log)
  types/                     # entities shared across features (Restaurant — Zod schema + inferred type)
  theme/, hooks/, utils/     # placeholders, not yet specified
public/                      # mockServiceWorker.js (generated via `npx msw init public/ --save`, don't hand-edit)
specs/                       # this directory — project and feature specs
jest.config.js, jest.setup.js
```

## Feature Index

| Feature | Spec | Status |
|---|---|---|
| `search` | `specs/search.md` | Home (US1) and Category page (US3) implemented (mock data); Search & Map (US2) pending |
| `restaurant` | `specs/restaurant.md` | US1+US2 implemented (mock data); US3–US7 not started |
| `favorites` | `specs/favorites.md` | Spec drafted (2 user stories), not implemented — but its global store (`stores/favorites.ts`) already exists, built ahead of schedule in `profile.md`'s round (see ADR log) |
| `profile` | `specs/profile.md` | US1+US2 implemented (mock data); US3-US6 not started |
| `auth` | `specs/auth.md` | Spec drafted (4 user stories), not implemented — but its global store (`stores/auth.ts`) and the `app/login.tsx` route (as a placeholder) already exist, built ahead of schedule in `profile.md`'s round (see ADR log); no `features/auth/` folder scaffolded yet |

**Note**: `profile` and `favorites` both compose the same route (`app/(tabs)/profile.tsx`) — `profile.md` covers the header/stats/account-menu (done), `favorites.md`'s User Story 2 covers the favorites rail (still pending — slots in between the stats and the account menu).

**Authentication is now a real, spec'd feature, not just a predicted future need.** The "Future direction" note that used to live here (written when `favorites.md` first deferred persistence) is concretized: `auth.md` defines `src/stores/auth.ts` (`isLoggedIn`, `login()`, `logout()`) — **implemented** ahead of `auth.md` itself, in `profile.md`'s round, see ADR log — and the real Sidebar Menu/Login screens, still pending. `favorites.md` still deliberately skips client-side persistence (see its Architecture Mapping) — building `AsyncStorage`-backed persistence today would just be replaced once real per-user data scoping exists, and `auth.md` itself is explicit that it's a client-side state flip only, no real backend/session persistence yet. Don't build speculative backend auth scaffolding ahead of its own spec.

## Architectural Decisions (ADR-lite)

<!-- Lightweight record of non-obvious decisions — the "why" that isn't in the code. -->

- **Favorites has no route of its own.** The design (the "Profile" frame) shows favorites only as a rail inside the profile, no dedicated tab. `features/favorites/` still exists as a domain (bulletproof-react separates by domain, not by route) — it just has no `app/(tabs)/favorites.tsx`.
- **"Favorited" state is global, not owned by the `favorites` feature.** The like button also appears in `restaurant` (detail). Under the isolation rule (#1/#3), it can't live only in `features/favorites/stores/` — it moves to `src/stores/favorites.ts`. **Implemented** — ahead of schedule, in `profile.md`'s round (`feat/profile-menu`), because Profile's favorites-count stat needed a real store from day one rather than a `0` placeholder. `favorites.md`'s own User Stories (the like icon, the rail) are still unbuilt.
- **`react-native-maps` instead of `expo-maps`.** `expo-maps` doesn't run on web (the official docs confirm an iOS/Android-only fallback) and is less mature. `react-native-maps` is the market standard, with `react-native-map-clustering` as a companion for scale. Trade-off: needs a dev build, doesn't run in Expo Go — gives real use to the KVM/AVD set up previously on this machine (the AVD itself hasn't been created yet).
- **`RestaurantCard` was born in `components/ui/`, not in `features/search/`.** `restaurant` also needs it (the "Similar Places" section), and features can't import each other.
- **`RestaurantDetail` extends the shared `Restaurant` type rather than duplicating its fields**, and lives in `src/features/restaurant/types/` (feature-specific), not `src/types/` — the extra detail-screen fields aren't needed by other features, only the base shape is.
- **A spec can drift internally, not just from the code.** Implementing `restaurant.md`'s US1/US2 surfaced that FR-017 and FR-018 were written into the Functional Requirements list without being referenced by any User Story's acceptance scenarios — a spec-authoring gap, not a code bug. Fixed by annotating both FRs in place rather than silently building or silently dropping them. Worth checking for on future specs before implementing, not just after.
- **`msw/node` doesn't work in this project, in the app or in tests — use `msw/native` for both.** MSW's own `package.json` sets its `"./node"` export to `null` under the `"react-native"` resolution condition. `jest-expo` applies that same condition to Jest itself (to accurately emulate what Metro would resolve), so even test-only code hits this. `jest.setup.js` imports the app's own `src/mocks/native.ts` (same `server` instance concept, re-evaluated fresh per Jest process) rather than standing up a separate `msw/node` setup.
- **MSW's ESM dependency tree needed explicit Jest config, and that required switching from `package.json`'s `"jest"` key to a real `jest.config.js`.** Two separate misses: (1) `transformIgnorePatterns` needed extending (not replacing — `jest-expo`'s own default already whitelists Expo/RN packages) to also allow `msw`, `@mswjs/*`, `rettime`, and a few of MSW's other transitive deps to be transformed; (2) `rettime` ships `.mjs`, and `jest-expo`'s default `transform` map only covers `.js/.jsx/.ts/.tsx` — needed an explicit `'\\.mjs$'` entry pointing at the same babel-jest transformer. Both require programmatic merging (spreading the preset's own arrays/objects), which a static JSON blob in `package.json` can't do — hence `jest.config.js` requiring `jest-expo/jest-preset` directly.
- **Expo Router's web target runs in two different JS contexts, and MSW needs to know which one it's in.** The initial request is server-rendered in an actual Node process (`resolver.environment=node` — no `document`, no real network stack), then the client hydrates in a real browser. `msw/browser`'s `setupWorker` throws outside a genuine browser, so `enableMocking()` can't gate on `Platform.OS === 'web'` alone — it also checks `typeof document !== 'undefined'` and skips mocking entirely during the Node/SSR pass (which never resolves queries itself anyway; only the hydrated client does).
- **`@testing-library/react-native` v14 made `render` and `renderHook` `async`** (part of its "drops React 18, async APIs by default" migration). Forgetting to `await` them doesn't error clearly — `render()` returns before the component tree mounts, so a synchronous `screen.getByText(...)` right after throws MSW-unrelated-looking `` `render` function has not been called `` from the library's own internals, not from your component.
- **Renamed the product from `restaurante-app` to `dine-out-app`** (2026-07-23) — local directory (`~/Projetos/dine-out-app`), `package.json` name, `app.json` name/scheme/bundle identifiers, GitHub repo (`MGuerreiro42/dine-out-app`) all consistently "dine-out" now. One deliberate exception: `app.json`'s `slug` stays `dine-out-discovery`, not `dine-out-app` — it's already registered against the linked EAS project (`extra.eas.projectId`), and EAS validates the slug on `eas init`/build; changing it locally would just produce a mismatch error without recreating that project, which wasn't judged worth the disruption for an internal-only identifier. The `restaurant`/`Restaurant` naming throughout `features/`, types, and specs is unrelated to this rename — that's the domain entity, always meant to be English regardless of the product's brand name.
- **`isLoggedIn` gets a second global store, `src/stores/auth.ts`, mirroring the `stores/favorites.ts` precedent (ADR above).** The Sidebar Menu (a `components/layout/` concern) needs to conditionally render its header/footer based on login state, and `profile.md`'s "Sair da conta" needs to trigger the same real logout — two independent consumers outside any single feature, same "global if >1 feature needs it" rule that promoted favorites. **Implemented** — ahead of schedule, in `profile.md`'s round: the Profile screen's own header turned out to have the same `isLoggedIn`-conditional layout the Sidebar does (found by re-reading the design's actual frame markup, not just the spec text), so the store was needed immediately, not just for the Sidebar. Default `isLoggedIn: true`, matching the design's own mock — `auth.md`'s own `[NEEDS CLARIFICATION]` about the real first-run default is untouched. `auth` itself still has no `features/auth/` folder yet (unlike `search`/`restaurant`/`favorites`/`profile`, all scaffolded upfront before any spec existed) — it's the first feature discovered entirely through design evolution, so its folder gets created when its own User Stories (Login/Signup, Sidebar) actually start.
- **`UserProfile` (and its `currentUser` mock) promoted from `features/profile/types/` to shared `src/types/`/`src/mocks/`**, same promotion pattern already used for `Restaurant` (needed by both `search` and `restaurant`). Trigger: the Sidebar Menu, owned by no single feature, needs to read the same current-user data `profile.md` defined to render its logged-in header. **Implemented**, in `profile.md`'s round.
- **New shared `src/components/ui/PlaceholderScreen.tsx`** (back-header + "Em breve" body). `profile.md`'s round needed real navigation targets for 4 account-menu destinations (US3-6, not yet built) plus `auth.md`'s login route — 5 call sites, enough to justify one shared component instead of 5 near-duplicate trivial screens. Each call site gets replaced with real content as its owning spec's User Story is picked up.
- **Logout must be one real action regardless of entry point.** Implementing the Sidebar Menu (`auth.md`) surfaced that `profile.md`'s existing "Sair da conta" (in the account-options list) had been specced as a purely simulated confirmation sheet — a second, different logout behavior from the Sidebar's real one. Corrected `profile.md`'s FR-007 to call the same real `stores/auth.ts` `logout()` instead of leaving two inconsistent logout behaviors on the books.
- **The design added a real bottom tab bar** — an identical 4-item bar (Home, Buscar, Categorias, Perfil) repeated across the "Home", "Category page", and "Profile" frames, only the active item's styling differing between copies. No "Favoritos" tab, consistent with the existing "favorites has no route of its own" ADR above. This resolves a question `search.md` had left open: the `explore` tab (currently an empty placeholder) hosts US2 (Search & Map) only, renamed conceptually to "Buscar" — US3 (Category page) gets its own new "Categorias" tab rather than sharing `explore`, and US3's route turned out to be a fixed tab (`app/(tabs)/category.tsx`), not a dynamic `category/[id]` route as originally guessed. **Implemented** (on `feat/bottom-tab-bar`): `app/(tabs)/_layout.tsx` now has the real 4 tabs (`index`/`search`/`category`/`profile`), `tabBarActiveTintColor`/`tabBarInactiveTintColor` set to `ink`/`muted` matching the design's exact hex values, icons follow the project's existing emoji-icon convention (no new icon library added — see `search.md`'s Assumptions precedent). `search.tsx`/`category.tsx` are still trivial placeholders, same as `explore.tsx` was — US2/US3 content is unrelated, separate work. **Resolved** (previously flagged): the "Search & Map" frame's own markup didn't repeat the tab bar, but the user confirmed it's reached via a normal tab switch ("Buscar" replaces Home) — so it gets the tab bar too, same as the other three; `search.md` updated.
- **The mocked restaurant data contract now mirrors Google Places API (New)** instead of an arbitrary custom shape — `src/lib/googlePlaces/` (`schema.ts`, `client.ts`, `mappers.ts`) holds Zod schemas and helpers checked against Google's current docs (via Context7, not training data): Nearby Search (New) (`POST .../places:searchNearby` → `{places:[...]}`) for the restaurant list, Place Details (New) (`GET .../places/{id}` → a single raw object) for the detail screen, and the real two-hop photo flow (`photos[].name` reference → `GET .../photos/{name}/media` → `photoUri`) instead of shortcutting photos to plain URLs. Why: this project's own principle #4 ("mocks-first with a real network seam") is only as good as how close the mocked contract is to the real one it'll eventually be swapped for — an arbitrary custom shape doesn't actually rehearse that swap.
  - **The wire contract and the internal domain types are deliberately different, on purpose.** `src/types/restaurant.ts`'s `RestaurantSchema` and `src/features/restaurant/types/`'s `RestaurantDetailSchema` are completely unchanged by this — normalization (Google's shape → ours) happens once, inside `useRestaurantsQuery`/`useRestaurantDetailQuery`, so no component anywhere in the app changed. Google's own place `id` is an opaque string; our mock's wire-format `id` is a stringified number purely for our own convenience, converted to a real `number` at that same normalization step — internal routing, the planned `favorites.ts` store (`Set<number>`), and `RESTAURANT_DETAILS`-style lookups all keep using plain numbers, untouched by Google's id scheme.
  - **`occasion`/`ambient`/`menu`/`tags` have no Google equivalent and stay custom** — confirmed with the user rather than force-mapped onto Google's real boolean amenity fields (`goodForGroups`, `liveMusic`, etc.), which would have distorted what those fields actually mean. Our mock's response bundles them as sibling fields alongside the real Google-shaped ones, the same way a real backend-for-frontend layer would enrich a proxied Google response with its own product data.
  - **Gotcha**: MSW's path matcher treats any `:` in a route pattern as a path-param marker, including Google's own `places:searchNearby` action-suffix convention — needs escaping (`places\\:searchNearby`) in the handler registration or it silently won't match.
  - **Out of scope, deliberately**: real geo-radius filtering (the mock accepts but ignores the request body's location), `X-Goog-FieldMask`/`X-Goog-Api-Key` headers (real Google requires them; simulating field-mask-based trimming adds mock complexity with no prototype value), and Google's boolean amenity fields for occasion/ambient.
  - **Extended for `restaurant.md`'s US3** (practical info): `regularOpeningHours.weekdayDescriptions`, `internationalPhoneNumber`, and a curated set of Google's real boolean amenity fields now back opening hours, the contact sheet, and the amenities list — same pattern, not a new decision. `whatsapp`/`instagramHandle`/`thingsToKnow` stay custom, same reasoning as `occasion`/`ambient` above.
  - **Extended again for US4** (reviews/highlights): Google's real `reviews[]` (`relativePublishTimeDescription`, `rating`, `text.text`, `authorAttribution.displayName`) backs the Reviews section — an exact field-for-field match, no adaptation needed. `highlights` stays custom. Also surfaced that `userRatingCount` (present since the first Google Places round) had never been mapped anywhere — now backs `RestaurantDetail.reviewCount`.

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
