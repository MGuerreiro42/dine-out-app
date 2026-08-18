# Contributing

This is currently a solo project, developed under a spec-driven workflow. This document describes that workflow for transparency and for anyone forking the project or proposing a change.

## Workflow

1. **No implementation without a spec.** Every feature has a specification in [`specs/<feature>.md`](./specs), written from [`specs/TEMPLATE.md`](./specs/TEMPLATE.md): user stories, functional requirements, an architecture mapping, and a changelog. A pull request that adds behavior without an updated spec will be asked to add one first.
2. **Ambiguity is marked, not assumed.** An unclear requirement is written as `[NEEDS CLARIFICATION: specific question]` in the spec rather than guessed at.
3. **Architecture-affecting changes require a plan first.** A new dependency, a new global store, or a change spanning more than a few files is proposed and discussed before implementation — see [`specs/PROJECT.md`](./specs/PROJECT.md) for existing architecture principles and precedent.
4. **The spec is updated when the implementation is.** A spec that no longer matches the shipped code is treated as a defect. `Status` and the Changelog are updated at the end of every implementation pass.

## Before opening a pull request

```bash
npm install
npx tsc --noEmit   # typecheck
npx jest           # unit tests
npx biome lint .   # lint
npx expo export --platform web   # bundle export — catches Metro errors tsc/lint don't
```

All four run in CI and must pass before merge (branch protection on `main` enforces this). The [PR template](./.github/PULL_REQUEST_TEMPLATE.md) includes a checklist covering spec updates and manual verification.

PR titles are checked against [Conventional Commits](https://www.conventionalcommits.org/) format in CI — the PR is squash-merged, so its title becomes the commit message on `main`.

`npm run format` (Biome) is available but not yet enforced in CI — the existing codebase predates the formatter being enabled and hasn't been reformatted yet. Run it on files you touch; don't reformat unrelated files in the same PR.

## Commit messages

[Conventional Commits](https://www.conventionalcommits.org/) — `type(scope): description`, e.g. `feat(restaurant): add reservation confirmation sheet`.

## Code style

Formatting and linting are enforced by [Biome](https://biomejs.dev/) (`npx biome lint .`) and TypeScript's strict mode. No separate style guide beyond what these tools already enforce.
