# Security Policy

## Supported versions

This project is a prototype under active development, tracked on `main` only. No versioned releases are currently maintained; security fixes apply to `main`.

## Scope

The application currently has no deployed backend and no user-facing production instance — all data is served from local mocks (see [`specs/PROJECT.md`](./specs/PROJECT.md)). Reports concerning the mobile/web client, its dependencies, or the CI/CD configuration are in scope. The target backend design (`specs/ARCHITECTURE.md`) is not yet implemented and is out of scope until it exists.

## Reporting a vulnerability

Report privately via [GitHub Security Advisories](https://github.com/MGuerreiro42/dine-out-app/security/advisories/new) rather than a public issue. Include:

- A description of the vulnerability and its potential impact
- Steps to reproduce
- Affected file(s) or dependency, if known

Expect an initial response within 5 business days. This project does not currently offer a bug bounty.

## Automated scanning

Dependency and static-analysis scanning run on every push and pull request to `main`:

- [CodeQL](./.github/workflows/codeql.yml) — static analysis, JavaScript/TypeScript
- [`npm audit`](./.github/workflows/security.yml) — dependency vulnerabilities, fails on high severity
- [Dependency review](./.github/workflows/security.yml) — flags newly introduced vulnerable dependencies on pull requests
- [Dependabot](./.github/dependabot.yml) — weekly dependency and GitHub Actions update checks
