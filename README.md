# Dine Out

A restaurant and bar discovery app — browse by cuisine, occasion, and ambient vibe, dig into a place's menu and reviews, and (soon) find it on a map. Currently a navigable prototype for business partners: no backend yet, all data comes from local mocks served over a mocked network layer (MSW) so the seam to a real API is already in place.

Built with Expo (React Native + web from one codebase), TypeScript, and a bulletproof-react-inspired architecture. See [`specs/PROJECT.md`](./specs/PROJECT.md) for the full architecture, tech stack, and decision log — this README stays intentionally short.

## Getting started

```bash
npm install
npx expo start
```

Opens the dev server at `localhost:8081` — press `w` for web, or scan the QR code with [Expo Go](https://expo.dev/go) for a physical device. Native (iOS/Android) works today; once the Search & Map feature lands (`react-native-maps`), that screen will require a [development build](https://docs.expo.dev/develop/development-builds/introduction/) instead of Expo Go.

## Verification

```bash
npx tsc --noEmit   # typecheck
npx jest           # unit tests
npx expo lint      # lint
```

See [`CLAUDE.md`](./CLAUDE.md) for the full verification pattern (bundle smoke tests per platform) and the project's working agreements.

## Project structure and process

This project follows a spec-driven workflow: every feature has a spec in [`specs/`](./specs) (user stories, functional requirements, an architecture mapping) before it's implemented. Start with [`specs/PROJECT.md`](./specs/PROJECT.md) for the architecture and feature index, and [`specs/TEMPLATE.md`](./specs/TEMPLATE.md) for the spec format itself.

## Deployment

Not deployed yet. EAS Build is configured (`eas.json`, `preview` profile for internal APK distribution) but no build has been triggered — see the [EAS Build workflow](./.github/workflows/eas-build.yml), manual-trigger only.
