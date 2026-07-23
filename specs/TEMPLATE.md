# Feature Specification: [FEATURE NAME]

**Feature**: `[english-slug]` — folder `src/features/[english-slug]/`
**Created**: [DATE]
**Status**: Draft | In Progress | Implemented
**Design reference**: [link/frame from claude.ai/design, if any — e.g. "App Flow.dc.html, frame '3 · Search & Map'"]

<!--
HOW TO USE THIS TEMPLATE
- Based on the GitHub spec-kit spec-template.md (github.com/github/spec-kit), adapted for this project.
- Fill in every mandatory section. Remove sections that don't apply, but don't skip one silently — say why.
- Where something isn't clear, write [NEEDS CLARIFICATION: specific question] instead of assuming — neither you
  nor the AI agent should guess.
- This file is the feature's CONTRACT. Code that diverges from the spec without updating the spec is a process
  bug, not just a code bug.
-->

## Summary

[1-3 sentences: what this feature does, for whom, and why it exists. No implementation detail.]

## User Stories *(mandatory)*

<!--
Each story is an independently testable, demonstrable vertical slice — if only P1 ships, the app still
delivers real value (it's an MVP, not a broken fragment). Prioritize by real importance, not screen order.
-->

### User Story 1 - [Short title] (Priority: P1)

[Journey in plain language, from the user's point of view]

**Why this priority**: [the value, why it can't wait]

**Independent test**: [how to validate this on its own, without depending on another story — e.g. "open Home, tap a restaurant card, confirm navigation to /restaurant/[id]"]

**Acceptance scenarios**:

1. **Given** [initial state], **when** [action], **then** [expected outcome]
2. **Given** [initial state], **when** [action], **then** [expected outcome]

---

### User Story 2 - [Short title] (Priority: P2)

[...]

---

### Edge Cases

- What happens when [boundary condition — empty list, mock with no data, network error once it's a real API]?
- How does the system handle [error scenario]?

## Functional Requirements *(mandatory)*

<!-- Numbered so they're referenceable (by you, by me, by any future agent). MUST statements, verifiable. -->

- **FR-001**: The system MUST [specific capability]
- **FR-002**: The user MUST be able to [key interaction]
- **FR-003**: The system MUST [data rule/validation]

*Example of an ambiguous requirement, marked instead of assumed:*

- **FR-004**: The system MUST sort results by [NEEDS CLARIFICATION: sorting criterion not specified — distance, rating, relevance?]

### Key Entities *(if the feature involves data)*

- **[Entity]**: what it represents, key attributes — NO implementation shape (that goes in Architecture Mapping below)

## Success Criteria *(mandatory)*

<!-- Measurable, and technology-agnostic where possible. -->

- **SC-001**: [measurable metric — e.g. "user finds a restaurant and reaches the detail screen within 3 taps from Home"]
- **SC-002**: [...]

## Architecture Mapping *(mandatory — specific to this project, not standard spec-kit)*

<!--
Traditional spec-kit separates spec (the what) from plan (the how) because large teams have different people/tools
for each. Here both roles are the same person (you) + the same agent (me) — so mapping to architecture already in
the spec saves a round trip, AS LONG AS the decision is already made. If it isn't, mark [NEEDS CLARIFICATION] and
resolve it before /plan.
-->

- **Feature folder**: `src/features/[slug]/{api,components,hooks,stores,types}` — which subfolders does this feature actually use?
- **Reuses from `src/components/ui/`**: [e.g. RestaurantCard, BottomSheet — or "none new, check the existing list before creating one"]
- **Reuses from `src/components/layout/`**: [e.g. SearchBar]
- **Needs global state (`src/stores/`)?** [Yes/No + why. Rule: it only becomes global if more than one feature needs to read/write the same state — see the `favorites` case as precedent]
- **Types**: what's shared (`src/types/`) vs feature-specific (`features/[slug]/types/`)?
- **Mocks needed (`src/mocks/`)**: which files, and what changes once it becomes a real API?
- **New dependencies?** [package name + why it can't be solved with what's already installed — see the `react-native-maps` precedent in PROJECT.md]

## Out of Scope

[What this spec explicitly does NOT cover this round — becomes the next spec, doesn't become logic implemented ahead of time inside this feature]

## Assumptions and Dependencies

- [Assumption made in the absence of info — e.g. "user location is a static mock at this stage"]
- [Dependency on another already-existing feature/service]

## Notes for the AI Agent

<!-- This doesn't exist in the original spec-kit — it's the part designed specifically for "AI-driven software engineering." -->

- Before coding: if the change touches more than ~3 files or involves an architecture decision not covered in the Architecture Mapping above, enter plan mode and validate with the user first.
- Before creating a new component: check `src/components/ui/index.ts` and `src/components/layout/index.ts` — don't duplicate what already exists.
- Implement only what's listed in the Functional Requirements above. Adjacent folders (`mocks/`, `stores/`, `hooks/` of other features) don't get logic ahead of time — that's its own spec.
- Mandatory verification before reporting done: `npx tsc --noEmit` clean + bundle smoke test (web/iOS/Android via `curl` on the affected routes, the dev server is usually already running at `localhost:8081`).
- On completion: update `Status` at the top of this file, fill in the Changelog below, and update the project memory with what was implemented and any new decision made along the way.

## Changelog

| Date | Change |
|------|--------|
| [DATE] | Spec created |
