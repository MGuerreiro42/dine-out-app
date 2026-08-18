@AGENTS.md

# dine-out-app

A restaurant/bar discovery app. This file is the implicit context loaded on every prompt — keep it a *pointer* to `specs/`, not a second source of truth. Current phase, backend status, and feature status live in `specs/PROJECT.md`'s Vision and Feature Index. If this file and `specs/PROJECT.md` disagree, `specs/PROJECT.md` wins for architecture/decisions; fix this file to match.

## Start here

- **Architecture, tech stack, folder tree, feature index, decision log**: `specs/PROJECT.md`.
- **Contract for writing/reading a feature spec**: `specs/TEMPLATE.md`.
- **Per-feature specs** (implemented/pending, functional requirements): `specs/<feature>.md`, one per feature in `src/features/`. See `specs/PROJECT.md`'s Feature Index.
- **Cross-feature user flow inventory**: `specs/FLOWS.md` — indexes the per-feature specs, cites the owning spec/User Story per step rather than redefining requirements.
- **Persisted data model** (as distinct from the wire contract in `src/lib/googlePlaces/schema.ts`): `specs/DATA_MODEL.md` — same index-not-source-of-truth rule.
- **Target backend architecture** (NestJS/Postgres/Prisma topology, Google Places live-merge/compliance rule, auth token design, API surface, DB schema): `specs/ARCHITECTURE.md` — a vision doc, nothing in it is built yet; diff against `specs/PROJECT.md`'s Feature Index for real state.

Read `specs/PROJECT.md` before any architecture-level decision (new feature, global store, shared component, dependency).

## Quick summary (see specs/PROJECT.md for the full version)

- **Stack**: Expo SDK 57, Expo Router (file-based, routes at `app/`), TypeScript, NativeWind v4 + Tailwind v3, TanStack Query (server state), Zustand (global client state only), `react-native-maps`.
- **Architecture**: bulletproof-react adapted for React Native. `src/features/<name>/{api,components,hooks,stores,types}` are isolated vertical modules — **features never import each other**. `src/components/ui/` = generic primitives. `src/components/layout/` = structural app frame (search bar, side menu). `src/stores/` = state needed by more than one feature (see `favorites` in PROJECT.md's decision log for the promotion rule).
- **Data**: everything reads from `src/mocks/` through a TanStack Query hook in each feature's `api/`. This is the seam for swapping in a real API later — never read a mock directly from a component.
- **Naming**: 100% English — folders, files, exports, variables, product name (`dine-out-app`, scheme `dineoutapp`). One exception: `app.json`'s `slug` stays `dine-out-discovery`, matching the registered EAS project (changing it locally breaks `eas init`).

## Working agreements

- New work happens on its own `feat/<description>` branch — create and check it out before writing any code or spec changes.
- Specs and docs stay terse: one-line FRs, one-line Given/When/Then acceptance scenarios, no rationale prose.
- No code comments unless asked.
- Commit messages: Conventional Commits (`type(scope): description`), never a `Co-Authored-By` trailer — every commit, by anyone or any agent.
- Scaffold with the tool's own defaults — no custom CLI flags at initial setup; customization is a separate, explicit step.
- Don't implement business logic ahead of a spec — placeholder folders stay empty (`export {};`) until a spec covers that module.
- Reuse before creating: check `src/components/ui/index.ts`/`layout/index.ts` before adding a component; a new store only if more than one feature needs it.
- Enter plan mode for new features, new architecture decisions, or changes touching more than ~3 files. Skip it for straightforward, already-specified work.
- Update the spec when code diverges: `Status`, Changelog, and PROJECT.md's decision log if it's a new decision.
- New library/API question? Check current docs (context7 or web), don't rely on training data — this stack moves fast.
- Delegate research spanning multiple files to an Explore agent; delegate settled-spec implementation to a general-purpose agent. Don't delegate architecture decisions or anything spec-mode-ambiguous.

## Verification (run before considering anything done)

```bash
npx tsc --noEmit
npx jest
```

`npx jest` runs once; `npm test` is watch mode. Tests hit the same `src/mocks/repository.ts` functions the app calls directly — no MSW, no network interception. To simulate a failure, `jest.spyOn` a `repository.ts` export and `mockRejectedValueOnce`/`mockResolvedValueOnce`, restoring with `jest.restoreAllMocks()` — see `useRestaurantsQuery-error-test.ts`.

The dev server is usually already running at `localhost:8081` (`npx expo start --web`). Confirm a route bundles clean:

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8081/<route>
```

For a full bundle sanity check, fetch the actual entry bundle (HTTP 200 on `/` doesn't guarantee the JS bundle compiled):

```bash
curl -s -o /dev/null -w "%{http_code}\n" "http://localhost:8081/node_modules/expo-router/entry.bundle?platform=ios&dev=true&hot=false&lazy=true&transform.engine=hermes&transform.bytecode=1&transform.routerRoot=app&transform.reactCompiler=true&unstable_transformProfile=hermes-stable"
```

Swap `platform=ios` for `android`/`web`. A bundling error still returns HTTP 200 with Metro's error payload instead of real JS — grep for `SyntaxError`/`Unable to resolve` with enough context to distinguish a real error from Metro's own error-formatting strings.

## Local environment notes

Machine-specific, not project bugs — kept here because they'll bite again:

- npm 12 breaks `npm pack --dry-run --json` for tools like `create-expo-app` (returns an object, not an array). Workaround: scoped `npm@10` in a temp prefix, prepended to `PATH` for the affected command only.
- `react-native-maps` doesn't run in Expo Go — needs a native dev build. AVD `dine_out_dev` (Android 36, Google Play x86_64) exists; boot with `npm run emulator` (`scripts/run-emulator.sh`), not directly.
- `avdmanager` AVDs live in `~/.config/.android/avd`, but `emulator` defaults to `~/.android/avd` — `scripts/run-emulator.sh` exports `ANDROID_AVD_HOME` to fix this automatically.
- Boot the emulator with `-gpu host`, not `swiftshader` — this machine's AMD/Mesa GPU works; `swiftshader` locked up the whole system under load. Already set in `scripts/run-emulator.sh`.
- New native/visual dependency? Get sign-off in the spec's Architecture Mapping first — don't add `react-native-svg`, `@expo/vector-icons`, etc. silently.

## Design source

Lives in a claude.ai/design project ("App de descoberta de restaurantes", file `App Flow.dc.html`), not in this repo. `projectId`: `742872a4-ac39-48e0-8cda-ba9f7fdde7d0` — a `PROJECT_TYPE_PROJECT`, so `list_projects` won't surface it; read via `DesignSync`'s `get_project`/`list_files`/`get_file` directly against that id. Source of truth for screen layout and copy — update the corresponding `specs/<feature>.md` when a frame changes, before touching implementation.

## Spec-driven workflow

Hand-written, lightweight Spec-Driven Development (structurally based on [GitHub's spec-kit](https://github.com/github/spec-kit), no CLI/lifecycle — revisit adopting the real tool if this project gains collaborators or parallel agents).

1. Check `specs/<feature>.md`. If it doesn't exist, create it from `specs/TEMPLATE.md`.
2. Ambiguous requirement? Mark `[NEEDS CLARIFICATION: ...]` rather than assume — resolve with the user before implementing that part.
3. Fill in the spec's Architecture Mapping — where spec meets `specs/PROJECT.md`'s principles. Unclear where something belongs? Pause and ask.
4. Implement only what's in Functional Requirements. Plan mode first if non-trivial.
5. Run verification. Update the spec's `Status`/Changelog. Update `specs/PROJECT.md`'s Feature Index and, if non-obvious, its decision log.
