# Dine Out

[![CI](https://github.com/MGuerreiro42/dine-out-app/actions/workflows/ci.yml/badge.svg)](https://github.com/MGuerreiro42/dine-out-app/actions/workflows/ci.yml)
[![CodeQL](https://github.com/MGuerreiro42/dine-out-app/actions/workflows/codeql.yml/badge.svg)](https://github.com/MGuerreiro42/dine-out-app/actions/workflows/codeql.yml)
[![Security](https://github.com/MGuerreiro42/dine-out-app/actions/workflows/security.yml/badge.svg)](https://github.com/MGuerreiro42/dine-out-app/actions/workflows/security.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)](./tsconfig.json)

Restaurant and bar discovery app for iOS, Android, and web from a single Expo/React Native codebase. Users browse by cuisine, occasion, and ambient, favorite restaurants, review menus and ratings, and locate places on a map.

## Status

Navigable app backed by a real NestJS backend (`dine-out-backend-overture`, PostgreSQL, JWT authentication, Overture Maps restaurant catalog). The app reads it through `src/lib/api/`: domain modules of plain async functions over a fetch client, with Zod wire contracts. Target backend architecture: [`specs/ARCHITECTURE.md`](./specs/ARCHITECTURE.md).

## Engineering notes

- **Spec-driven development.** Every feature is specified before implementation — user stories, functional requirements, an architecture mapping, a changelog — in [`specs/`](./specs). No code ships without a written requirement behind it.
- **Validated wire contract.** Backend responses are parsed against Zod schemas in `src/lib/api/schema.ts` and normalized to domain types in `src/lib/api/mappers.ts`; feature hooks call `src/lib/api/` domain modules and never fetch directly.
- **Backend design accounts for third-party compliance constraints.** [`specs/ARCHITECTURE.md`](./specs/ARCHITECTURE.md) documents that Google Maps Platform's Terms of Service prohibit caching most Places content. The persistence model was corrected from an initial cache-aside design to a live pass-through pattern before any backend code was written.
- **A runtime incompatibility diagnosed and resolved.** The original network-mocking layer (MSW) failed silently in release builds — Hermes lacks the WebSocket-related globals MSW's internals reference. Root cause was isolated via device logs from a release build; the layer was replaced with plain in-process async functions, which now call the real backend from `src/lib/api/`.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Expo SDK 57, Expo Router (file-based routing) |
| Language | TypeScript |
| Styling | NativeWind v4 (Tailwind CSS for React Native) |
| Server state | TanStack Query |
| Client state | Zustand |
| Validation | Zod |
| Maps | react-native-maps |
| Testing | Jest, React Testing Library |

Full stack rationale and trade-offs: [`specs/PROJECT.md`](./specs/PROJECT.md#tech-stack).

## Architecture

Feature-vertical modules (`src/features/<name>/{api,components,hooks,stores,types}`), adapted from the bulletproof-react pattern; features do not import each other. Shared primitives live outside `features/` — generic components in `src/components/ui`, structural components in `src/components/layout`. Client state is promoted from a feature's own store to `src/stores/` only when more than one feature requires it.

Full architecture, folder structure, and decision log: [`specs/PROJECT.md`](./specs/PROJECT.md).

## Getting started

```bash
npm install
npx expo start
```

Opens the Metro dev server at `localhost:8081`. Press `w` for web, or scan the QR code with [Expo Go](https://expo.dev/go) for a physical device. The map screen depends on a native module and requires a [development build](https://docs.expo.dev/develop/development-builds/introduction/) rather than Expo Go.

## Verification

```bash
npx tsc --noEmit   # typecheck
npx jest           # unit tests
npx biome lint .   # lint
```

Full verification procedure, including per-platform bundle checks: [`CLAUDE.md`](./CLAUDE.md).

## Documentation

| Document | Contents |
|---|---|
| [`specs/PROJECT.md`](./specs/PROJECT.md) | Architecture principles, tech stack, folder structure, feature index, decision log |
| [`specs/ARCHITECTURE.md`](./specs/ARCHITECTURE.md) | Target backend design — NestJS topology, authentication, API surface, database schema |
| [`specs/DATA_MODEL.md`](./specs/DATA_MODEL.md) | Persisted entity schema |
| [`specs/FLOWS.md`](./specs/FLOWS.md) | End-to-end user journeys across features |
| `specs/<feature>.md` | Per-feature specification — user stories, functional requirements, architecture mapping |
| [`specs/TEMPLATE.md`](./specs/TEMPLATE.md) | Specification format |

## Deployment

Not deployed. EAS Build is configured (`eas.json`, `preview` profile) for manual internal APK distribution via [a GitHub Actions workflow](./.github/workflows/eas-build.yml); no build has been triggered.

## Contributing

Solo project, developed under the spec-driven workflow described above. [`CONTRIBUTING.md`](./CONTRIBUTING.md) documents the process for anyone forking the project or proposing a change. Participation is governed by the [Code of Conduct](./CODE_OF_CONDUCT.md). Report vulnerabilities per [`SECURITY.md`](./SECURITY.md).

## License

[MIT](./LICENSE)
