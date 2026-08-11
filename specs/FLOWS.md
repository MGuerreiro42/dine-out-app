# App Flows

This is a cross-feature index, not a feature spec — it doesn't redefine any FR or acceptance scenario, it just shows how screens chain together for a real user journey and points back to the spec/User Story that actually owns each step. When a flow diverges from what's in the specs, the specs win; fix this file to match.

**Methodology**: User/Task Flow diagrams — the standard UX deliverable for "how do screens connect toward a goal," as distinct from a User Story's own Given/When/Then (one screen's behavior in isolation) or the design canvas's frame numbers (an unordered screen inventory). Notation: **Flow N** is one end-to-end journey; **Step Na, Nb, Nc...** are its screens/actions in sequence; a branch that leads into a different journey cross-references that Flow's number instead of nesting letters indefinitely (keeps this navigable instead of a combinatorial tree). Each step is tagged `— <owning spec> <User Story> — <status>`.

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

3a. Home renders — cuisine/occasion/ambient rails, featured banner, quick-nav icons, benefits grid, "Best Deliveries" rail — `search.md` US1 — **Implemented**.
3b. Switch the active cuisine/occasion/ambient chip → the corresponding rail updates — **Implemented**.
3c. Tap any restaurant card (any rail) → **Flow 6** (Restaurant Detail).
3d. Tap the cuisine rail's "view {cuisine} page" link → **Flow 4** (Category Page), that cuisine preselected — **Implemented**.
3e. Tap the cuisine rail's "view all cuisines" link → **Flow 4b** (Categories Overview) — **Not Started** (`search.md` US5; today there's only the single link from 3d, not this second one).
3f. Tap the occasion rail's "view all" link → **Flow 5** (Occasion Page) — **Not Started** (`search.md` US6; today this opens a simulated-message sheet instead).
3g. Tap a Dine-in/Bars/Takeout quick-nav icon → simulated-message sheet, no real navigation — **Implemented**.
3h. Tap the location header → **Flow 11** (Address management) — **Not Started** (`search.md` US4; today the sheet that opens has placeholder content).
3i. Tap the search bar → navigates to **Flow 7** (Search & Map) — **Implemented** (the bar itself is a non-editable tap target here, not an inline filter — see `search.md`'s FR-022 correction).
3j. Tap the ≡ menu icon → **Flow 8** (Sidebar).

---

## Flow 4 — Category Page (per cuisine)

**Status**: Implemented
**Entry points**: **Flow 3** step 3d; **Flow 4b** step 4b-ii (once built)

4a. Category page loads with the active cuisine (hero banner, best-rated/trending/near-you grids) — `search.md` US3 — **Implemented**.
4b. Switch the in-page cuisine tab → all four sections update — **Implemented**.
4c. Tap "View on map" → **Flow 7** (Search & Map) — **Implemented**.
4d. Tap a subtype icon → placeholder sheet, subtype filtering isn't real — **Implemented**.
4e. Tap any restaurant card (any grid) → **Flow 6** (Restaurant Detail) — **Implemented**.

---

## Flow 4b — Categories Overview

**Status**: Not Started (`search.md` US5, documented from a design expansion)
**Entry points**: bottom tab "Categorias", Sidebar "Categorias" (both currently point straight at **Flow 4** instead — see below), **Flow 3** step 3e

4b-i. Categories Overview grid loads — one square photo card per cuisine — **Not Started**.
4b-ii. Tap a cuisine card → **Flow 4** (Category Page) for that cuisine — **Not Started**.

*Routing note*: once this ships, the bottom tab bar's and Sidebar's "Categorias" items both need to repoint here instead of directly at Flow 4 — today they still go straight to the Category page.

---

## Flow 5 — Occasion Page

**Status**: Not Started (`search.md` US6, documented from a design expansion)
**Entry point**: **Flow 3** step 3f

5a. Occasion page loads with the active occasion (hero banner, "Best for {occasion}" grid) — **Not Started**.
5b. Switch the in-page occasion tab → content updates — **Not Started**.
5c. Tap "View on map" → **Flow 7** — **Not Started**.
5d. Tap "Refine pelo estilo" subtype row → (behavior TBD, likely a placeholder sheet as in Flow 4d) — **Not Started**.
5e. Tap any restaurant card → **Flow 6** — **Not Started**.

---

## Flow 6 — Restaurant Detail Engagement

**Status**: Partial — US1–US6 implemented, US7 (favorite) not started
**Entry point**: any restaurant card anywhere in the app (Home rails, Category/Occasion pages, Search & Map, Similar Places, Favorites rail, Orders/Reservations once built)

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
6p. Tap the header location icon → same sheet as 6l — **Implemented**.
6q. Tap the header settings icon → simulated placeholder — **Implemented** *(`[NEEDS CLARIFICATION]` in `restaurant.md`: real meaning of "restaurant settings" here is undefined by the design)*.
6r. Tap the header profile icon → **Flow 10** (Profile) — **Implemented**.
6s. Tap the header share icon → simulated feedback — **Implemented**.
6t. Tap the like/favorite icon → toggles the global favorites store, reflected in **Flow 9** — **Not Started** (`restaurant.md` US7; the store itself already exists, only this UI trigger is missing).

---

## Flow 7 — Search & Map

**Status**: Implemented
**Entry points**: bottom tab "Buscar", **Flow 3** step 3i, **Flow 4** step 4c, **Flow 5** step 5c

7a. Screen loads — full-screen map + pins, floating search bar, collapsed results sheet — `search.md` US2 — **Implemented**.
7b. Type in the search bar → live (debounced) filter by name/cuisine on both the pins and the sheet's list — **Implemented**.
7c. Sheet auto-expands while a query is active; drag or tap the handle to expand/collapse manually otherwise — **Implemented**.
7d. Tap a map pin or a list card → **Flow 6** (Restaurant Detail) — **Implemented**.

---

## Flow 8 — Sidebar Navigation

**Status**: Implemented
**Entry point**: ≡ icon (currently only on Home — `auth.md` notes this is the sidebar's single usage site)

8a. Tap ≡ → sidebar drawer opens — `auth.md` US3 — **Implemented**.
8b. Header shows a profile summary (logged in, → **Flow 10**) or "Entrar ou criar conta" (logged out, → **Flow 2**) — **Implemented**.
8c. Tap a nav item (Home / Buscar → **Flow 7** / Categorias → **Flow 4** / Favoritos → **Flow 10** / Meus pedidos, Minhas reservas, Notificações → **Flow 10**'s placeholders) → navigates, drawer closes — **Implemented**.
8d. *(logged in only)* Tap "Sair da conta" → immediate logout, no confirmation — **Implemented**.
8e. Tap ✕ or the backdrop → closes without navigating — **Implemented**.

---

## Flow 9 — Favorites

**Status**: Not Started (`favorites.md`; the global store exists, but both of this flow's UI triggers are unbuilt)
**Entry point**: **Flow 6** step 6t

9a. Favorite a restaurant from its detail screen (6t) — **Not Started**.
9b. Open **Flow 10** (Profile) → the favorites rail shows it (between stats and the account menu) — **Not Started**.
9c. Tap a favorited card → **Flow 6** — **Not Started**.
9d. Unfavorite it (6t again) → disappears from the rail on next render — **Not Started**.

*(Zero favorites → the rail's empty state is itself `[NEEDS CLARIFICATION]` in `favorites.md` — exact copy/visual isn't specified by the design.)*

---

## Flow 10 — Profile & Account

**Status**: Partial — US1–US2 implemented, US3–US6 not started
**Entry points**: bottom tab "Perfil", **Flow 8** step 8b/8c, **Flow 6** step 6r, **Flow 2** step 2c

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

## Flow 11 — Address Management

**Status**: Not Started (`search.md` US4, documented from a design expansion)
**Entry point**: **Flow 3** step 3h / **Flow 1** step 1c

11a. Tap the location header → address list sheet (saved addresses, checkmark on the current one) — **Not Started**.
11b. Tap a saved address → selects it, closes the sheet — **Not Started**.
11c. Tap "+ Adicionar novo endereço" → add-address form sheet — **Not Started**.
11d. Tap "Selecionar no mapa" → `[NEEDS CLARIFICATION: real pin-drop or simulated, like this prototype's other redirect affordances?]` — **Not Started**.
11e. Fill the form, tap "Salvar endereço" → `[NEEDS CLARIFICATION: does this persist to a store, or simulate like the rest of the prototype?]` — **Not Started**.

---

## Coverage summary

| Flow | Status |
|---|---|
| 1 — First Launch & Guest Entry | Implemented |
| 2 — Login / Signup | Implemented |
| 3 — Home Discovery | Partial (3e, 3f, 3h not started) |
| 4 — Category Page | Implemented |
| 4b — Categories Overview | Not Started |
| 5 — Occasion Page | Not Started |
| 6 — Restaurant Detail Engagement | Partial (6t not started) |
| 7 — Search & Map | Implemented |
| 8 — Sidebar Navigation | Implemented |
| 9 — Favorites | Not Started |
| 10 — Profile & Account | Partial (10d–10h not started) |
| 11 — Address Management | Not Started |

Every "Not Started" step above already has an owning spec/User Story (cited inline) — this document adds no new requirements, it just makes the gaps visible as *journeys* instead of a flat FR list.
