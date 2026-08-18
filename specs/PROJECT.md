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

- **Favorites has no route of its own** — a rail inside Profile per the design. `features/favorites/` exists as a domain folder with no `app/(tabs)/favorites.tsx`.
- **"Favorited" state lives in `src/stores/favorites.ts` (global)**, not `features/favorites/stores/` — read and written by both `restaurant` and `favorites` (principle #3).
- **`react-native-maps` over `expo-maps`** — `expo-maps` has no web fallback and is less mature; `react-native-maps` is the market standard. Trade-off: no Expo Go, requires a dev build. No web renderer at all — `SearchMapView.web.tsx` substitutes a placeholder via Metro's platform-extension resolution.
- **Native `MapView` requires a Google Maps API key**; without one, `IllegalStateException` on mount. Blocked on Google Cloud billing/KYC. `SearchMapView.tsx` falls back to `MapPlaceholder` when `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY` is unset. A real key also needs wiring into `app.json`'s `android.config.googleMaps.apiKey`.
- **`RestaurantCard` lives in `components/ui/`, not `features/search/`** — `restaurant`'s Similar Places section needs it too; features cannot import each other.
- **`RestaurantDetail` extends the shared `Restaurant` type**, lives in `src/features/restaurant/types/` — only the base shape is needed elsewhere.
- **Specs can drift internally**, not just from the code — FRs written without any User Story referencing them. Check before implementing a spec, not only after.
- **`@testing-library/react-native` v14's `render`/`renderHook` are `async`** — an unawaited call produces a `` `render` function has not been called `` error unrelated to the component under test.
- **Product renamed `restaurante-app` → `dine-out-app`** (2026-07-23), across directory, `package.json`, `app.json`, GitHub repo. Exception: `app.json`'s `slug` stays `dine-out-discovery`, matching the registered EAS project.
- **`src/stores/auth.ts`** (`isLoggedIn`, `login()`, `logout()`) is the second global store — read by the Sidebar and Profile's header/logout, same promotion rule as favorites. Default `isLoggedIn: true`; `auth.md` FR-011 designs flipping it to `false`, not implemented.
- **`UserProfile`/`currentUser`** live in shared `src/types/`/`src/mocks/`, not `features/profile/types/` — the Sidebar (owned by no single feature) reads the same current-user data as `profile.md`.
- **Shared `src/components/ui/PlaceholderScreen.tsx`** (back-header + "Em breve") backs 5 routes (4 profile sub-routes, login) pending their owning User Stories.
- **`profile.md`'s "Sair da conta" calls the same real `stores/auth.ts` `logout()` the Sidebar uses** — one logout action regardless of entry point.
- **Bottom tab bar**: `app/(tabs)/_layout.tsx` has 4 real tabs — Home, Search, Categories, Profile. `search` hosts the Search & Map screen; `category` hosts Categories Overview.
- **The mocked restaurant data contract mirrors Google Places API (New)**, not an arbitrary custom shape — `src/lib/googlePlaces/` (`schema.ts`/`client.ts`/`mappers.ts`): Nearby Search (New) for the list, Place Details (New) for the detail screen, the real two-hop photo flow (`photos[].name` → `GET .../photos/{name}/media`).
  - Wire contract and internal domain types (`RestaurantSchema`, `RestaurantDetailSchema`) stay separate — normalization happens once, inside the query hooks. Google's `id` is opaque; the mock's wire `id` is a stringified number, converted to a real `number` at normalization.
  - `occasion`/`ambient`/`menu`/`tags`/`highlights`/`thingsToKnow`/`whatsapp`/`instagramHandle` have no Google equivalent — custom fields, not mapped onto Google's amenity fields.
  - Out of scope: real geo-radius filtering, `X-Goog-FieldMask`/`X-Goog-Api-Key` header simulation.
  - Extended with real Google fields as specs required them: `regularOpeningHours`, `internationalPhoneNumber`, curated boolean amenity fields (`restaurant.md` US3); `reviews[]`, `userRatingCount`→`reviewCount` (US4); `location`→`latitude`/`longitude` (`search.md` US2).
- **Search bars are real, debounced filters.** Google's Nearby Search (New) has no free-text query support — a separate `places:searchText` mock endpoint mirrors the real API split rather than bolting text search onto `searchNearby`. First uses of `useDebouncedValue` and TanStack Query's `placeholderData: keepPreviousData`.
- **MSW's network-level mocking replaced with a static in-process repository** (2026-08-05). Hermes lacks `MessageEvent`/`Event`/`EventTarget`/`BroadcastChannel`, which `msw/native` references internally — `setupServer(...).listen()` failed silently, including in EAS release builds. `src/mocks/repository.ts` holds plain async functions the query hooks call directly; `src/lib/apiClient.ts` deleted. A repository function's signature, not a URL, is the contract a real backend replaces. MSW is expected to return once a real backend exists, to test its actual HTTP contract.
- **The navigation Sidebar reuses `BottomSheet.tsx`'s `Modal` technique**, not a new shared primitive — `SideMenu.tsx` builds its own left-anchored overlay (`Modal transparent` + backdrop + stop-propagation content). Plain fade animation, no drawer library.
- **The Sidebar's `«` collapse icon links to a dangling anchor** in the design canvas (no `#sidebar-collapsed-frame` exists) — treated as a second close-affordance identical to `✕`, no separate collapsed state.
- **First real use of `react-native-gesture-handler`/`react-native-reanimated`** beyond the mandatory root wrapper. Reanimated 4's Worklets Babel plugin is auto-included by `babel-preset-expo` since SDK 50 — no config change needed.
- **NativeWind `className` silently no-ops when mixed with an explicit `style` array on the same `Animated.View`.** `cssInterop` registration doesn't fix precedence once a real `style` array is present. Pattern: the animated wrapper carries only the animated `style`, zero `className`; Tailwind styling moves to a plain inner `View`.
- **Emoji icons replaced with `@expo/vector-icons`, app-wide** — chosen over `lucide-react-native` for zero native config and identical web rendering. Shared primitives: `Icon.tsx` (`IconSpec = {set, name}` resolver across `Ionicons`/`MaterialCommunityIcons`/`MaterialIcons`), `StarRating.tsx`. Data-driven icon fields store `IconSpec`, not emoji or bare letters.
- **`location`/`reviewCount` are on the core `Restaurant` type**, not feature-local — stable, non-contextual facts about a place, unlike `distance`/`tagline`/`tags`/`isOpenNow`, which stay feature-local and derived.
- **Categories Overview (US5) repurposes the existing `category.tsx` tab route**, not a 5th tab — Expo Router tabs map 1:1 to files. Per-cuisine content moved to `app/category/[cuisine].tsx`, a required path segment with a back button. Superseded by the dimension-agnostic `type`/`type-overview` routes (`search.md`).
- **`specs/ARCHITECTURE.md`** (2026-08-18) — target-architecture design, not built: backend topology (NestJS, 7 modules), auth token design (JWT + rotating refresh, argon2id), API surface, request lifecycle, DB schema, a two-axis restaurant-ownership-claim system (CNPJ/CPF). Google Maps Platform's Terms don't allow caching most Places content — only `place_id` indefinitely, coordinates ≤30 days. The 24h cache-aside pattern `DATA_MODEL.md` described violates this; corrected to live pass-through (Google content fetched and merged per request, never persisted). `DATA_MODEL.md` and `auth.md` cross-reference it rather than duplicate.

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
