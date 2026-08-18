# Dine Out

A restaurant and bar discovery app — browse by cuisine, occasion, and ambient vibe, favorite places, dig into a menu and reviews, and find them on a map. Currently a navigable prototype for business partners: no backend yet, all data comes from a mock repository (`src/mocks/repository.ts`) shaped like the real API it'll eventually call, so swapping in a backend later won't touch any component.

Built with Expo (React Native + web from one codebase), TypeScript, and a bulletproof-react-inspired architecture. See [`specs/PROJECT.md`](./specs/PROJECT.md) for the full architecture, tech stack, and decision log — this README stays intentionally short.

## Getting started

```bash
npm install
npx expo start
```

Opens the dev server at `localhost:8081` — press `w` for web, or scan the QR code with [Expo Go](https://expo.dev/go) for a physical device. The Search & Map screen uses a native map module, so that screen needs a [development build](https://docs.expo.dev/develop/development-builds/introduction/) rather than Expo Go.

## Verification

```bash
npx tsc --noEmit   # typecheck
npx jest           # unit tests
npx biome lint .   # lint
```

See [`CLAUDE.md`](./CLAUDE.md) for the full verification pattern (bundle smoke tests per platform) and the project's working agreements.

## Project structure and process

This project follows a spec-driven workflow: every feature has a spec in [`specs/`](./specs) (user stories, functional requirements, an architecture mapping) before it's implemented. Start with [`specs/PROJECT.md`](./specs/PROJECT.md) for the architecture and feature index, and [`specs/TEMPLATE.md`](./specs/TEMPLATE.md) for the spec format itself.

## Deployment

Not deployed yet. EAS Build is configured (`eas.json`, `preview` profile for internal APK distribution) but no build has been triggered — see the [EAS Build workflow](./.github/workflows/eas-build.yml), manual-trigger only.
