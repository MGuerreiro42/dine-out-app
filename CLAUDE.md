@AGENTS.md

# dine-out-app

A restaurant/bar discovery app. This file is the implicit context loaded on every prompt in this repo — keep it accurate as the project evolves, and keep it a *pointer* to `specs/`, not a second source of truth. Current phase, backend status, and feature status live in `specs/PROJECT.md`'s Vision and Feature Index — don't restate them here, they'll go stale the moment they change. If this file and `specs/PROJECT.md` ever disagree, `specs/PROJECT.md` wins for architecture/decisions; fix this file to match.

## Start here

- **Full architecture, tech stack, folder tree, feature index, and decision log**: `specs/PROJECT.md`.
- **Contract for writing/reading any feature spec**: `specs/TEMPLATE.md`.
- **Per-feature specs** (what's implemented, what's pending, functional requirements): `specs/<feature>.md`, one per feature in `src/features/`. See `specs/PROJECT.md`'s Feature Index for which ones exist and their status.
- **Cross-feature user flow inventory** (how screens chain together into end-to-end journeys, spanning multiple features): `specs/FLOWS.md`. An index over the per-feature specs, not a second source of truth — it cites the owning spec/User Story for every step rather than redefining requirements.
- **Persisted data model** (entities and relationships a real backend will store, as distinct from the wire contract in `src/lib/googlePlaces/schema.ts`): `specs/DATA_MODEL.md`. Same "index, not a second source of truth" rule as `FLOWS.md` — cites the owning feature spec for each field's requirement.

Read `specs/PROJECT.md` before making any architecture-level decision (new feature, new global store, new shared component, new dependency). This file only summarizes what you need for day-to-day work; it deliberately does not repeat the full decision log.

## Quick summary (see specs/PROJECT.md for the full version)

- **Stack**: Expo SDK 57, Expo Router (file-based, routes at `app/`), TypeScript, NativeWind v4 + Tailwind v3, TanStack Query (server state), Zustand (global client state only), `react-native-maps`.
- **Architecture**: bulletproof-react adapted for React Native. `src/features/<name>/{api,components,hooks,stores,types}` are isolated vertical modules — **features never import each other**. `src/components/ui/` = generic reusable primitives. `src/components/layout/` = structural app frame (search bar, side menu) present on most screens. `src/stores/` = state genuinely needed by more than one feature (see `favorites` in the decision log for why/when something graduates from a feature's own `stores/` to here).
- **Data**: everything currently reads from `src/mocks/` through a TanStack Query hook in each feature's `api/`. This is the seam for swapping in a real API later without touching components — never read a mock directly from a component.
- **Naming**: 100% English — folders, files, exports, variables, and the product name itself (`dine-out-app`, `app.json` scheme `dineoutapp`). No exception needed since the rename; before it, the product name (`restaurante-app`) was a deliberate one, kept in Portuguese as a product decision distinct from the code-naming convention. One exception that *does* remain: `app.json`'s `slug` stays `dine-out-discovery`, not `dine-out-app` — it must match the slug already registered on the linked EAS project (see `specs/PROJECT.md`'s ADR log); changing it locally without recreating that project just produces an `eas init` mismatch error.

## Working agreements

- **New work happens on its own `feat/<description>` branch, never committed directly to `main`.** Create and check out the branch before writing any code or spec changes for a new task.
- **Specs and docs stay terse.** One-line FRs, one-line acceptance scenarios, no rationale prose. This reverses the verbose house style used before 2026-08-17 — don't imitate old entries when editing a spec, just correct them.
- **No code comments unless asked.** Don't add explanatory comments to source files. If a codebase pass surfaces comments worth adding, ask first.
- **Commit messages follow Conventional Commits** (`type(scope): description`, matching this repo's actual history — e.g. `feat(favorites): add Profile favorites rail`) **and never carry a `Co-Authored-By` trailer**, regardless of the harness's own default commit-signing behavior. Applies to every commit in this repo, made directly or by any agent.
- **Scaffold with the tool's own defaults.** Don't customize CLI flags/options during initial setup — architecture customization is its own separate step, discussed and decided explicitly.
- **Don't implement business logic ahead of a spec.** Placeholder folders (empty `index.ts` with `export {};`) stay empty until a feature spec in `specs/` explicitly covers that module. If you're about to write logic that isn't backed by a spec, stop and either write the spec first or ask.
- **Reuse before creating.** Before adding a component, check `src/components/ui/index.ts` and `src/components/layout/index.ts` first. Before adding a store, check whether the state really needs to be global (rule: only if more than one feature needs to read/write it — see Architecture Principles in `specs/PROJECT.md`).
- **Enter plan mode for anything non-trivial.** New features, new architecture-affecting decisions (new dependency, new global store, changes touching more than ~3 files) go through plan mode for sign-off before code. Straightforward, already-specified work doesn't need it.
- **Update the spec when the implementation diverges from it.** A spec that doesn't match the code is a process bug. When a feature is implemented, update its `Status`, fill in its Changelog, and add any new decision to `specs/PROJECT.md`'s decision log.
- **New library/API question? Check current docs first**, don't rely on training data — this stack moves fast (see `AGENTS.md` import above, which is Expo-specific; the same caution applies to NativeWind, TanStack Query, and any other fast-moving dependency).
- **Delegate to subagents when the task fits, don't default to doing everything inline.** Use an Explore agent for research spanning multiple files or features (e.g. finding every usage of a shared component, auditing where a spec and the code have drifted) instead of manual grepping. Once a feature spec's Functional Requirements and Architecture Mapping are settled, consider delegating the implementation itself to a general-purpose agent — pass it the spec file path, it's meant to be self-contained context. Don't delegate architecture decisions or anything ambiguous enough that it should go through plan mode first.

## Verification (run before considering anything done)

```bash
npx tsc --noEmit
npx jest
```

`npx jest` runs the suite once; `npm test` (`jest --watchAll`) is the watch-mode version for active development. Tests run against the same `src/mocks/repository.ts` functions the running app calls directly — no MSW, no network interception, no `jest.setup.js` (removed along with MSW; see `specs/PROJECT.md`'s ADR log). To simulate a failure, `jest.spyOn` a `repository.ts` export and `mockRejectedValueOnce`/`mockResolvedValueOnce` it, restoring with `jest.restoreAllMocks()` afterward — see `useRestaurantsQuery-error-test.ts` for the pattern.

The dev server is usually already running at `localhost:8081` (`npx expo start --web`). Confirm a route bundles clean with:

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8081/<route>
```

For a full bundle sanity check across platforms, fetch the actual entry bundle per platform rather than just the HTML shell (HTTP 200 on `/` doesn't guarantee the JS bundle itself compiled):

```bash
curl -s -o /dev/null -w "%{http_code}\n" "http://localhost:8081/node_modules/expo-router/entry.bundle?platform=ios&dev=true&hot=false&lazy=true&transform.engine=hermes&transform.bytecode=1&transform.routerRoot=app&transform.reactCompiler=true&unstable_transformProfile=hermes-stable"
```

Swap `platform=ios` for `android` or `web`. If a bundling error is happening, the response is still HTTP 200 but contains Metro's error payload instead of real JS — grep the response for `SyntaxError`/`Unable to resolve` with enough surrounding context to tell an actual error from Metro's own error-formatting code (which contains those same words as string literals).

## Local environment notes

These are specific to this developer's machine, not the project itself — kept here because they'll bite again if forgotten:

- **npm 12 on this machine breaks `npm pack --dry-run --json`** for tools that parse it (e.g. `create-expo-app`) — it returns an object instead of the expected array. Workaround: install a scoped `npm@10` in a temp prefix and prepend its `bin/` to `PATH` just for the affected command. Not a project bug — don't try to "fix" it in the repo.
- **`react-native-maps` does not run in Expo Go** — testing any screen that uses it requires a native dev build. An AVD now exists (`dine_out_dev`, Android 36, Google Play x86_64) — boot it with `npm run emulator` (`scripts/run-emulator.sh`), not directly.
- **`avdmanager`-created AVDs live in `~/.config/.android/avd`, but the `emulator` binary defaults to the legacy `~/.android/avd`** — without exporting `ANDROID_AVD_HOME` to the former, the emulator reports the AVD as not existing even though `avdmanager list avd` sees it fine. `scripts/run-emulator.sh` sets this automatically.
- **Boot the emulator with `-gpu host`, not the default `swiftshader` (software rendering)** — this machine has a real, working GPU (AMD, Mesa/radeonsi); `swiftshader` was observed to lock up the whole system under load. `scripts/run-emulator.sh` already passes this flag — don't boot the emulator any other way.
- **New native/visual dependency? Get sign-off in the spec first.** Icons, for instance, may or may not be backed by an icon library depending on what a given spec's Architecture Mapping decided — check it, don't assume, and don't add a dependency like `react-native-svg` or `@expo/vector-icons` silently.

## Design source

The product design lives in a claude.ai/design project ("App de descoberta de restaurantes", file `App Flow.dc.html`), not in this repo. `projectId`: `742872a4-ac39-48e0-8cda-ba9f7fdde7d0`. It's a `PROJECT_TYPE_PROJECT`, not a design-system project, so `list_projects` won't surface it — read it with the `DesignSync` tool's `get_project`/`list_files`/`get_file` methods directly against that `projectId`. Treat it as the source of truth for screen layout and copy; when a design frame changes, the corresponding `specs/<feature>.md` should be updated to match before implementation changes.

## Spec-driven workflow

This project uses a lightweight, hand-written form of Spec-Driven Development, structurally based on [GitHub's spec-kit](https://github.com/github/spec-kit) but without its CLI/lifecycle (`specify`, `/speckit.*`) — adopted because a solo project doesn't yet need the multi-agent consistency tooling (`/clarify`, `/analyze`) that justifies the full tool. Revisit adopting the real spec-kit if this project gains more collaborators or parallel AI agents; the hand-written content would carry over, only the format would change.

When starting work on a feature:

1. Check `specs/<feature>.md`. If it doesn't exist, create it from `specs/TEMPLATE.md`.
2. If a requirement is ambiguous, mark it `[NEEDS CLARIFICATION: ...]` in the spec rather than assuming — resolve it with the user before implementing that part.
3. Fill in the spec's "Architecture Mapping" section — this is where spec meets `specs/PROJECT.md`'s principles. If it's unclear where something belongs, that's itself a sign to pause and ask.
4. Implement only what's in the spec's Functional Requirements. Enter plan mode first if the change is non-trivial (see Working Agreements above).
5. Run verification. Update the spec's `Status` and Changelog. Update `specs/PROJECT.md`'s Feature Index and, if a new non-obvious decision was made, its ADR-lite decision log.
