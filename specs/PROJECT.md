# dine-out-app — Project Specification

**Status**: Navigable prototype (no backend) · **Last updated**: 2026-08-18

<!--
Plays the role of GitHub spec-kit's constitution.md (github.com/github/spec-kit) — the principles
every feature spec (see TEMPLATE.md) follows by default without repeating them. A feature spec can
deviate, but must declare it explicitly and justify it.
-->

## Vision

An app for discovering bars and restaurants. Current phase: a navigable prototype to present to business partners, no backend — all data comes from local mocks structured so they can later become a real API without changing components.

## Architecture Principles

1. **Bulletproof-react adapted for React Native.** Every folder in `features/` is an isolated vertical module (`api/`, `components/`, `hooks/`, `stores/`, `types/`). Features NEVER import each other directly.
2. **`src/components/ui/` vs `src/components/layout/`.** `ui/` is a generic primitive reused as detail (card, chip, sheet). `layout/` is the structural frame present on (almost) every screen (search bar, side menu). Both live outside `features/` because more than one feature uses them.
3. **State only becomes global when it needs to.** If only one feature reads/writes it, it stays in `features/[name]/stores/`. If two or more need it (e.g. "favorited," read by both `restaurant` and `favorites`), it moves to `src/stores/` — otherwise principle #1 breaks.
4. **Mocks-first with a real network seam, not just an in-memory one.** Every data read in `features/*/api/` goes through a TanStack Query hook whose `queryFn` calls a plain async function in `src/mocks/repository.ts`, backed by fixture data. Once a real API exists, each repository function's body becomes a real `fetch` call — components/hooks/contracts don't change. Request/response shapes are Zod schemas doing double duty as TS type + runtime-checked contract.
5. **Folder and code naming 100% in English**, including the product name (`dine-out-app`, renamed 2026-07-23 — see decision log).
6. **Scaffold with the tool's own defaults.** Architecture customization is a separate discussion.
7. **Don't implement business logic beyond what's explicitly requested.** Placeholder folders stay empty until a feature spec covers that module.

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Expo SDK 57 + Expo Router (file-based) | Current RN ecosystem standard |
| Language | TypeScript | — |
| Styling | NativeWind v4 + Tailwind v3 | NativeWind v4 doesn't support Tailwind v4 yet |
| Server state | TanStack Query | Mock→API seam without rewriting components. `staleTime` 5min, `retry` 1 (a static mock's failures are deterministic, not transient — raise once a real backend exists) |
| Client state | Zustand | Only for genuinely global state (principle #3) |
| Contracts | Zod | `.parse()` on every response catches contract drift instead of silently passing bad data downstream |
| API mocking | Static repository (`src/mocks/repository.ts`) | Plain async functions the query hooks call directly — no `fetch`, no request interception. Was MSW until 2026-08-05 (see decision log); MSW is expected to return once a real backend exists, to test *its* real HTTP contract |
| Testing | Jest (`jest-expo` preset) + React Testing Library | Chosen over Vitest: `vitest-native` is beta with unconfirmed NativeWind/Expo Router support; `jest-expo` is Expo's documented path |
| Maps | `react-native-maps` | More performant/scalable than `expo-maps`; trade-off: doesn't run in Expo Go, needs a dev build |
| Import alias | `@/*` → `src/*` | Native to the SDK 57 template via `tsconfig.paths` |

## Folder Structure

```
app/                        # Expo Router routes — thin, delegates to features/
  (tabs)/{index,search,category,profile}.tsx  # 4 tabs (Home/Buscar/Categorias/Perfil), all implemented
  restaurant/[id].tsx
  type/[dimension]/[id].tsx           # dimension-agnostic Type Detail (cuisine/occasion/ambient)
  type-overview/[dimension].tsx       # dimension-agnostic Type Overview
  category/[cuisine].tsx              # legacy per-cuisine route, superseded by type/[dimension] — see search.md
  profile/{orders,reservations,payment,notifications}.tsx  # PlaceholderScreen routes — real content is profile.md's US3-6
  login.tsx                  # PlaceholderScreen route — real content is auth.md's US1
src/
  components/
    ui/                      # generic primitives (RestaurantCard, BottomSheet, Chip, HorizontalRail, RatingBadge, Icon, StarRating, PlaceholderScreen, PhotoCarousel)
    layout/                  # app frame (SearchBar, SideMenu)
  features/
    search/                  # Home + category/type discovery + search list
    restaurant/               # restaurant detail
    favorites/                 # favorites domain (no route of its own — consumed inside profile)
    profile/                   # profile header/stats/account menu (shares the profile route with favorites)
    auth/                      # login/signup form
  mocks/                     # fixture data + repository.ts (plain async functions the query hooks call)
  stores/                    # global state (favorites.ts, auth.ts, location.ts — see decision log)
  lib/                       # queryClient.ts, googlePlaces/ (wire-contract schemas/mappers, see decision log)
  types/                     # entities shared across features (Restaurant, UserProfile — Zod + inferred type)
  theme/, hooks/, utils/     # placeholders, not yet specified
specs/                       # this directory — project and feature specs
jest.config.js
```

## Feature Index

| Feature | Spec | Status |
|---|---|---|
| `search` | `specs/search.md` | Home (US1), Search list (US2, map removed), Category page (US3, superseded by dimension-agnostic Type Detail/Overview), Categories Overview (US5), Occasion page (US6) implemented; address/geolocation (US4) and Features/Price filters (FR-030/031) designed, not started |
| `restaurant` | `specs/restaurant.md` | US1–US7 implemented (mock data) |
| `favorites` | `specs/favorites.md` | Global store (`stores/favorites.ts`) implemented; User Story 2 (Profile rail) not implemented |
| `profile` | `specs/profile.md` | US1+US2 implemented (mock data); US3-US6 not started |
| `auth` | `specs/auth.md` | US1, US3, US4 implemented; US2 true-by-construction; form validation (FR-010) and guest-default flip (FR-011) designed, not implemented |

**Note**: `profile` and `favorites` compose the same route (`app/(tabs)/profile.tsx`) — `profile.md` covers header/stats/account-menu (done), `favorites.md`'s US2 covers the favorites rail (pending, slots between stats and account menu).

## Architectural Decisions (ADR-lite)

<!-- One-line-to-a-few-sentences per decision: what, why. Not a narrative of how it was found. -->

- **Favorites has no route of its own** — it's a rail inside Profile per the design; `features/favorites/` exists as a domain folder with no `app/(tabs)/favorites.tsx`.
- **"Favorited" state lives in `src/stores/favorites.ts` (global)**, not `features/favorites/stores/`, since both `restaurant` and `favorites` read/write it (principle #3). Built ahead of schedule in `profile.md`'s round, since Profile's stat needed a real store from day one.
- **`react-native-maps` over `expo-maps`** — `expo-maps` has no web fallback and is less mature; `react-native-maps` is the market standard (`react-native-map-clustering` for scale). Trade-off: needs a dev build, no Expo Go. It also has zero web renderer at all — `SearchMapView.web.tsx` swaps in a placeholder via Metro's platform-extension resolution so the native module never enters the web bundle. (Moot on the Search screen since 2026-08-12 — the map was removed there, see `search.md`.)
- **Native `MapView` crashes hard without a Google Maps API key** (uncatchable `IllegalStateException`) — blocked on Google Cloud billing/KYC, not a code issue. `SearchMapView.tsx` falls back to a `MapPlaceholder` when `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY` is unset. Once a real key exists, also needs wiring into `app.json`'s `android.config.googleMaps.apiKey`.
- **`RestaurantCard` lives in `components/ui/`, not `features/search/`** — `restaurant`'s Similar Places section also needs it, and features can't import each other.
- **`RestaurantDetail` extends the shared `Restaurant` type** and lives in `src/features/restaurant/types/` (feature-specific) — only the base shape is needed elsewhere.
- **Specs can drift internally**, not just from the code (FRs written without any User Story referencing them) — worth checking before implementing a spec, not just after.
- **`@testing-library/react-native` v14's `render`/`renderHook` are `async`** — forgetting to `await` produces a confusing `` `render` function has not been called `` error from the library's own internals, unrelated to your component.
- **Renamed `restaurante-app` → `dine-out-app`** (2026-07-23), across directory/`package.json`/`app.json`/GitHub repo. One exception: `app.json`'s `slug` stays `dine-out-discovery` — already registered on the linked EAS project; changing it locally without recreating that project breaks `eas init`.
- **`src/stores/auth.ts`** (`isLoggedIn`, `login()`, `logout()`) is the second global store, needed by both the Sidebar and Profile's header/logout — same promotion rule as favorites. Built ahead of `auth.md` itself, in `profile.md`'s round. Default `isLoggedIn: true` at the time (design's demo default); `auth.md` FR-011 later designed flipping it to `false` as the real first-run default, not yet implemented.
- **`UserProfile`/`currentUser`** promoted from `features/profile/types/` to shared `src/types/`/`src/mocks/` — the Sidebar (owned by no single feature) needs the same current-user data `profile.md` renders.
- **Shared `src/components/ui/PlaceholderScreen.tsx`** (back-header + "Em breve") — 5 call sites (4 profile sub-routes + login) needed a real navigation target before their owning User Stories were built; each gets replaced with real content as its spec is picked up.
- **Logout is one real action regardless of entry point** — `profile.md`'s "Sair da conta" was corrected to call the same real `stores/auth.ts` `logout()` the Sidebar uses, instead of a separately-specified simulated confirmation.
- **Real bottom tab bar added** (Home/Buscar/Categorias/Perfil) — `app/(tabs)/_layout.tsx` has the 4 real tabs; `search` hosts Search & Map (US2), `category` hosts Categories Overview (US5), both confirmed reachable via normal tab switch, not a dynamic route.
- **The mocked restaurant data contract mirrors Google Places API (New)** instead of an arbitrary custom shape (`src/lib/googlePlaces/`: `schema.ts`/`client.ts`/`mappers.ts`, checked against current docs via Context7) — Nearby Search (New) for the list, Place Details (New) for the detail screen, and the real two-hop photo flow (`photos[].name` → `GET .../photos/{name}/media`). This makes principle #4's "real network seam" actually rehearse the eventual swap.
  - The wire contract and internal domain types (`RestaurantSchema`, `RestaurantDetailSchema`) stay deliberately separate — normalization happens once, inside the query hooks. Google's `id` is opaque; our mock's wire `id` is a stringified number, converted to a real `number` at normalization (used by routing/`favorites.ts`/lookups).
  - `occasion`/`ambient`/`menu`/`tags`/`highlights`/`thingsToKnow`/`whatsapp`/`instagramHandle` have no Google equivalent and stay custom, confirmed with the user rather than force-mapped onto Google's real amenity fields.
  - Out of scope, deliberately: real geo-radius filtering, `X-Goog-FieldMask`/`X-Goog-Api-Key` header simulation.
  - Extended over time with more real Google fields as specs needed them: `regularOpeningHours`, `internationalPhoneNumber`, curated boolean amenity fields (restaurant.md US3); `reviews[]`, `userRatingCount`→`reviewCount` (US4); `location`→`latitude`/`longitude` (search.md US2).
- **Search bars became real (debounced) filters.** Google's Nearby Search (New) has no free-text query support — confirmed via Context7 — so a separate `places:searchText` mock endpoint was added rather than bolting text search onto `searchNearby`, mirroring the real API split. First uses of `useDebouncedValue` and TanStack Query's `placeholderData: keepPreviousData`.
- **Replaced MSW's network-level mocking with a static in-process repository** (2026-08-05) after MSW's native-runtime quirks (Hermes lacks `MessageEvent`/`Event`/`EventTarget`/`BroadcastChannel`, which `msw/native` references internally) cost most of a session and failed silently in EAS release builds. `src/mocks/repository.ts` now holds plain async functions the query hooks call directly; `src/lib/apiClient.ts` deleted. This doesn't abandon principle #4's network seam — a repository function's *signature*, not a URL, is now the contract a real backend replaces. MSW is expected to return once a real backend exists, to test *that* backend's actual HTTP contract.
- **The real navigation Sidebar reuses `BottomSheet.tsx`'s underlying `Modal` technique** rather than a new shared primitive — `SideMenu.tsx` builds its own left-anchored overlay (`Modal transparent` + backdrop + stop-propagation content), different enough in edge/sizing that forcing a shared abstraction wasn't worth it. Plain fade animation, no slide/drawer library added.
- **The Sidebar's `«` collapse icon links to a dangling anchor** in the design canvas (no `#sidebar-collapsed-frame` exists) — treated as a second close-affordance identical to `✕`, no separate collapsed state built.
- **First real use of `react-native-gesture-handler`/`react-native-reanimated`** beyond the mandatory root wrapper (the since-removed draggable Search & Map sheet) — confirmed Reanimated 4's Worklets Babel plugin is auto-included by `babel-preset-expo` since SDK 50, no config change needed.
- **Gotcha: NativeWind `className` silently no-ops when mixed with an explicit `style` array on the same `Animated.View`.** Registering `cssInterop` doesn't fix precedence once a real `style` array is present. Fix/pattern: the animated wrapper carries only the animated `style`, zero `className`; real Tailwind styling moves to a plain inner `View`.
- **All emoji icons replaced with `@expo/vector-icons`, app-wide** — chosen over `lucide-react-native` because it needs no native config and works identically on web. New shared primitives: `Icon.tsx` (`IconSpec = {set, name}` resolver across `Ionicons`/`MaterialCommunityIcons`/`MaterialIcons`) and `StarRating.tsx`. Data-driven icon fields (taxonomies, amenity rules) store `IconSpec` instead of emoji/bare letters.
- **`location`/`reviewCount` promoted to the core `Restaurant` type**, not kept feature-local — both are stable, non-contextual facts about a place (unlike `distance`/`tagline`/`tags`/`isOpenNow`, which stay feature-local/derived).
- **Categories Overview (US5) repurposed the existing `category.tsx` tab route** instead of adding a 5th tab (Expo Router tabs map 1:1 to files) — the per-cuisine content moved to a new pushed route, `app/category/[cuisine].tsx`, with `cuisine` as a required path segment and a real back button. Later itself superseded by the dimension-agnostic `type`/`type-overview` routes (see `search.md`).
- **`specs/ARCHITECTURE.md` created** (2026-08-18) — a target-architecture vision doc, not a status report: full backend topology (NestJS, 7 modules), the auth token design (JWT + rotating refresh, argon2id), API surface, request lifecycle, DB schema, and a two-axis restaurant-ownership-claim system (CNPJ/CPF). Its one load-bearing finding: Google Maps Platform's Terms don't allow caching most Places content (only `place_id` indefinitely, coordinates ≤30 days) — the 24h cache-aside pattern `DATA_MODEL.md` originally described would violate that, corrected there to a live-pass-through pattern instead (Google content fetched and merged per request, never persisted). `DATA_MODEL.md` and `auth.md` both updated to cross-reference it rather than duplicate. Nothing here is built — still a design-only round, same as `DATA_MODEL.md`'s own status.

Every implemented feature goes through this before being considered done:

```bash
npx tsc --noEmit
npx jest
# dev server usually already running at localhost:8081 (npx expo start --web)
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8081/<route>
```

## Environment / Known Quirks

Full details in the project's memory (outside the repo). Summary:
- npm 12 (this machine) breaks `npm pack --dry-run --json` for tools like `create-expo-app` — worked around, not a project bug.
- `/home` is an HDD, not NVMe — the Metro "slow filesystem" warning is cosmetic.
