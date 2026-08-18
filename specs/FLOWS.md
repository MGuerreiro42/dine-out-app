# App Flows

Cross-feature index, not a feature spec — shows how screens chain together for a user journey and points back to the spec/User Story that owns each step. When a flow diverges from the specs, the specs win; fix this file to match.

**Methodology**: User/Task Flow diagrams — distinct from a User Story's Given/When/Then (one screen in isolation) or the design canvas's frame numbers (unordered inventory). **Flow N** is one end-to-end journey; **Step Na, Nb, Nc...** are its screens/actions in sequence; a branch into a different journey cross-references that Flow's number rather than nesting letters indefinitely. Each step tagged `— <owning spec> <User Story> — <status>`.

**Status legend**: **Implemented** · **Partial** (some sub-steps implemented, others not) · **Not Started**.

---

## Flow 1 — First Launch & Guest Entry

**Status**: Implemented
**Entry point**: app cold start

1a. App opens → Home tab (`/`) — `search.md` US1 — **Implemented**. No login required or checked anywhere (`auth.md` US2, confirmed true-by-construction — the app never gates on `isLoggedIn`).
1b. *(optional branch)* Tap "Entrar ou criar conta" (Sidebar header or Profile) → **Flow 2** (Login/Signup).
1c. *(optional branch)* Tap Home's location header → **Flow 11** (Address management) — not started, currently opens a placeholder-message sheet.
1d. Home is fully usable regardless of 1b/1c — user proceeds into **Flow 3** (Home Discovery).

---

## Flow 2 — Login / Signup

**Status**: Implemented
**Entry points**: Sidebar header (logged out) → **Flow 8**; Profile's logged-out CTA → **Flow 10**

2a. Login screen, default mode (email, password, "Esqueceu a senha?") — `auth.md` US1 — **Implemented**.
2b. Tap the mode-switch link → Signup mode (name field appears, "Esqueceu a senha?" disappears) — **Implemented**.
2c. Tap the primary CTA (either mode) → sets `isLoggedIn: true`, navigates to **Flow 10** (Profile) — **Implemented**. No credential validation.
2d. *(branch)* Tap "Google"/"Apple" → simulated response, stays on screen — **Implemented**.
2e. *(branch, login mode only)* Tap "Esqueceu a senha?" → simulated response — **Implemented**.
2f. Tap the back control → returns to Home (fixed target, not a `canGoBack()` fallback) — **Implemented**.

---

## Flow 3 — Home Discovery

**Status**: Partial (core browsing implemented; several branch destinations not started)
**Entry point**: Home tab (also **Flow 1**'s landing point)

3a. Home renders — cuisine/occasion/ambient rails, featured banner, "Best Deliveries" rail — `search.md` US1 — **Implemented**. *(The old Dine-in/Bars/Takeout quick-nav icons and institutional benefits grid no longer exist — removed, see `search.md` FR-008/FR-009.)*
3b. Switch the active cuisine/occasion/ambient chip → the corresponding rail updates — **Implemented**.
3c. Tap any restaurant card (any rail) → **Flow 6** (Restaurant Detail).
3d. Tap the cuisine rail's "view {cuisine} page" link → **Flow 4** (Category Page), that cuisine preselected — **Implemented**.
3e. Tap the cuisine rail's "view all cuisines" link → **Flow 4b** (Categories Overview) — **Implemented**.
3f. Tap the occasion rail's "View all occasions" or "View more" link → **Flow 5** (Occasion Page) — **Implemented**.
3h. Tap the location header → **Flow 11** (Location) — **Not Started** (`search.md` US4; today the sheet shows placeholder content).
3i. Tap the search bar → navigates to **Flow 7** (Search) — **Implemented** (the bar itself is a non-editable tap target here, not an inline filter — see `search.md`'s FR-022 correction).
3j. Tap the ≡ menu icon → **Flow 8** (Sidebar).

---

## Flow 4 — Category Page (per cuisine)

**Status**: Implemented, at `/type/cuisine/{id}` — **note**: this flow's steps still describe US3's original per-cuisine implementation, which `search.md` itself flags as stale (deleted 2026-08-12, replaced by the dimension-agnostic `TypeDetailScreen` also serving Flow 5/occasion — see that spec's own not-yet-done correction note)
**Entry points**: **Flow 3** step 3d; **Flow 4b** step 4b-ii

4a. Category page loads with the active cuisine (hero banner, best-rated/trending/near-you grids) — `search.md` US3 — **Implemented**.
4b. Switch the in-page cuisine tab → all four sections update — **Implemented**.
4c. Tap "View on map" → **Flow 7** (Search) — **Implemented**.
4d. Tap a subtype icon → placeholder sheet, subtype filtering isn't real — **Implemented**.
4e. Tap any restaurant card (any grid) → **Flow 6** (Restaurant Detail) — **Implemented**.

---

## Flow 4b — Categories Overview

**Status**: Implemented
**Entry points**: bottom tab "Categorias", Sidebar "Categorias", **Flow 3** step 3e

4b-i. Categories Overview grid loads — one square photo card per cuisine — **Implemented**.
4b-ii. Tap a cuisine card → **Flow 4** (Category Page) for that cuisine, at `/type/cuisine/{id}` — **Implemented**.

---

## Flow 5 — Occasion Page

**Status**: Implemented (`search.md` US6, shipped as a byproduct of generalizing US3's Category page into the dimension-agnostic `TypeDetailScreen`)
**Entry point**: **Flow 3** step 3f

5a. Occasion page loads (`/type/occasion/{id}`) — Champion card, "Champions - Best Rated" grid — **Implemented**.
5b. Two refine rows (cuisine, ambient), each with its own filtered grid — no in-page occasion tabs — **Implemented**.
5c. "Trending" and "{occasion} Near You" grids — **Implemented**.
5d. Any section's "View all" → **Flow 7** (Search), pre-filtered to that occasion — **Implemented**.
5e. Tap any restaurant card → **Flow 6** — **Implemented**.

---

## Flow 6 — Restaurant Detail Engagement

**Status**: Implemented — US1–US7 all implemented
**Entry point**: any restaurant card anywhere in the app (Home rails, Category/Occasion pages, Search, Similar Places, Favorites rail, Orders/Reservations once built)

6a. Detail screen loads — photo gallery, name, description, tags, address, price, rating — `restaurant.md` US1 — **Implemented**.
6b. Swipe/tap the photo gallery's next/previous controls → photo + counter update — **Implemented**.
6c. Tap "ver mais"/"ver menos" → description expands/collapses — **Implemented**.
6d. Tap the back control → previous screen, or Home if there is none (`canGoBack()` guard) — **Implemented**.
6e. Tap "Menu" → sheet listing items + prices — **Implemented**.
6f. Tap "Takeaway" → sheet, simulated redirect options — **Implemented**.
6g. Tap "Delivery" → sheet, simulated redirect options — **Implemented**.
6h. Tap "Reserve" → sheet, simulated confirm action — **Implemented**.
6i. Tap "show all N amenities" → sheet — **Implemented**.
6j. Tap "Opening Hours" → sheet, 7-day schedule — **Implemented**.
6k. Tap "Contact & socials" → sheet (call/WhatsApp/Instagram, simulated redirects) — **Implemented**.
6l. Tap the address → sheet, simulated "open in maps" — **Implemented**.
6m. Tap "view all N reviews" → sheet — **Implemented**.
6n. Tap Instagram "Follow" → toggles Following (local state only) — **Implemented**.
6o. Tap a Similar Places card → back to **Flow 6** for that restaurant, replacing the current screen (not stacking) — **Implemented**.
6s. Tap the header share icon → simulated feedback — **Implemented**.
6t. Tap the like/favorite icon → toggles the global favorites store, reflected in **Flow 9** — **Implemented** (`restaurant.md` US7, via `DetailHeaderActions.tsx`).

*(The header's location/settings/profile icons, 6p-6r in an earlier version of this flow, were dropped from the shipped header overlay by the `feat/restaurant-detail-redesign` round — the address row (6l) still covers the location action; settings/profile-link have no remaining entry point on this screen.)*

---

## Flow 7 — Search

**Status**: Implemented (no map — removed 2026-08-12, see `search.md` US2)
**Entry points**: bottom tab "Buscar", **Flow 3** step 3i, **Flow 4** step 4c, **Flow 5** step 5d

7a. Screen loads — result count, Sort control, Filters chip, a scrollable list of restaurant cards — `search.md` US2 — **Implemented**.
7b. Type in the search bar → live (debounced) filter by name/cuisine — **Implemented**.
7c. Open Sort, pick an option → list reorders — **Implemented**. Open Filters → all 6 entries are decorative (`Alert`), except cuisine/occasion/ambient/delivery when seeded via an incoming route param (dismissible chip).
7d. Tap a list card → **Flow 6** (Restaurant Detail) — **Implemented**.

---

## Flow 8 — Sidebar Navigation

**Status**: Implemented
**Entry point**: ≡ icon (currently only on Home — `auth.md` notes this is the sidebar's single usage site)

8a. Tap ≡ → sidebar drawer opens — `auth.md` US3 — **Implemented**.
8b. Header shows a profile summary (logged in, → **Flow 10**) or "Entrar ou criar conta" (logged out, → **Flow 2**) — **Implemented**.
8c. Tap a nav item (Home / Buscar → **Flow 7** / Categorias → **Flow 4b** / Favoritos → **Flow 10** / Meus pedidos, Minhas reservas, Notificações → **Flow 10**'s placeholders) → navigates, drawer closes — **Implemented**.
8d. *(logged in only)* Tap "Sair da conta" → immediate logout, no confirmation — **Implemented**.
8e. Tap ✕ or the backdrop → closes without navigating — **Implemented**.

---

## Flow 9 — Favorites

**Status**: Partial — favoriting itself works (`restaurant.md` US7); the Profile rail that surfaces it (`favorites.md` US2) is unbuilt
**Entry point**: **Flow 6** step 6t

9a. Favorite a restaurant from its detail screen (6t) — **Implemented**.
9b. Open **Flow 10** (Profile) → the favorites rail shows it (between stats and the account menu) — **Not Started**.
9c. Tap a favorited card → **Flow 6** — **Not Started** (blocked on 9b).
9d. Unfavorite it (6t again) → disappears from the rail on next render — **Not Started** (blocked on 9b).

*(Zero favorites → the rail's empty state is itself `[NEEDS CLARIFICATION]` in `favorites.md` — exact copy/visual isn't specified by the design.)*

---

## Flow 10 — Profile & Account

**Status**: Partial — US1–US2 implemented, US3–US6 not started
**Entry points**: bottom tab "Perfil", **Flow 8** step 8b/8c, **Flow 2** step 2c

10a. Profile loads — identity + 3 stats (logged in) or "Visitante" + CTA (logged out) — `profile.md` US1 — **Implemented**.
10b. *(logged out)* Tap "Entrar ou criar conta" → **Flow 2** — **Implemented**.
10c. *(logged out)* Tap "Explorar restaurantes" / "Buscar no mapa" / "Preferências de notificação" → Home / **Flow 7** / 10h's placeholder — **Implemented**.
10d. *(logged in)* Favorites rail renders here → **Flow 9** — **Not Started** (`favorites.md` US2).
10e. Tap "Meus pedidos" → placeholder screen today ("Em breve"); real order list is `profile.md` US3 — **Not Started**.
10f. Tap "Minhas reservas" → placeholder today; real list is US4 — **Not Started**.
10g. Tap "Formas de pagamento" → placeholder today; real list + "Adicionar cartão" is US5 — **Not Started**.
10h. Tap "Notificações" → placeholder today; real toggles are US6 — **Not Started**.
10i. Tap "Sair da conta" → immediate logout, screen re-renders as 10a's logged-out state — **Implemented**.

---

## Flow 11 — Location

**Status**: Not Started (`search.md` US4 — superseded 2026-08-17 design: no saved-address list/form, GPS-only)
**Entry point**: **Flow 3** step 3h / **Flow 1** step 1c

11a. App opens, location permission granted → real GPS coordinate resolves into `src/stores/location.ts`, `LocationHeader` shows the reverse-geocoded label — **Not Started**.
11b. Permission denied/timeout/error → falls back silently to the existing static coordinate, no error dialog — **Not Started**.
11c. Tap the location header → sheet shows the resolved (or fallback) address, with a "Tentar novamente" retry only when permission was denied — **Not Started**.

---

## Coverage summary

| Flow | Status |
|---|---|
| 1 — First Launch & Guest Entry | Implemented |
| 2 — Login / Signup | Implemented |
| 3 — Home Discovery | Partial (3h not started) |
| 4 — Category Page | Implemented |
| 4b — Categories Overview | Implemented |
| 5 — Occasion Page | Implemented |
| 6 — Restaurant Detail Engagement | Implemented |
| 7 — Search | Implemented |
| 8 — Sidebar Navigation | Implemented |
| 9 — Favorites | Partial (9b–9d not started) |
| 10 — Profile & Account | Partial (10d–10h not started) |
| 11 — Location | Not Started |

Every "Not Started" step above already has an owning spec/User Story (cited inline) — this document adds no new requirements, it just makes the gaps visible as *journeys* instead of a flat FR list.
