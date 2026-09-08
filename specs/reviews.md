# Feature Specification: Reviews

**Feature**: `reviews` — folder `src/features/reviews/`
**Created**: 2026-08-31
**Status**: Implemented
**Design reference**: none — new territory. Visual reference for the submission sheet's four states (default, filled, validation errors, already-reviewed) prototyped at https://claude.ai/code/artifact/88947f19-e75a-44bb-a500-a8274319c3f3, built against this app's real `BottomSheet`/`AuthForm` conventions.

## Summary

The mechanism by which a logged-in user submits a star rating and text review for a restaurant —
one review per user per restaurant, enforced server-side. This spec owns the submission mutation,
the form, and the one-review-per-user handling; `restaurant.md` owns the display surfaces
(`ReviewsSection`, `ReviewsSheetContent`) that show the result, exactly mirroring the existing
split between this repo's `favorites.md` (owns the favorite mechanism) and `restaurant.md` (owns
the like icon that triggers it).

These are first-party reviews — our own users' content, persisted in `dine-out-backend`'s own
Postgres via a new `Review` table (`dine-out-backend`'s `specs/reviews.md`). This is unrelated to,
and not blocked by, the deferred Google Places review layer this app's `ARCHITECTURE.md` §3/
`DATA_MODEL.md` describe: that prohibition covers *Google*-sourced content specifically (their
Terms restrict caching it), not content our own users write.

## User Stories

### User Story 1 - Submit a review from the restaurant detail screen (Priority: P1)

A logged-in user who has an opinion about a restaurant can rate it and write about their
experience, from either the empty-state prompt or the always-present trigger once other reviews
exist.

**Why this priority**: this is the actual capability being specified — without it, `restaurant.md`'s
"Add a review" control is decoration.

**Independent test**: from `/restaurant/[id]`, open the review form, pick a star rating, enter
text, submit; confirm the sheet closes and the new review appears in `ReviewsSection`/
`ReviewsSheetContent` along with an updated average rating and count, without a manual refresh.

**Acceptance scenarios**:

1. **Given** a logged-in user with a rating selected and non-empty text, **when** they submit the form, **then** the review is created, the sheet closes, and the restaurant-detail data refetches to show it.
2. **Given** no star rating selected, **when** the user attempts to submit, **then** a field-level error shows and no request is sent.
3. **Given** empty review text, **when** the user attempts to submit, **then** a field-level error shows and no request is sent.
4. **Given** a user who has already reviewed this restaurant, **when** they submit again, **then** the backend's 409 is surfaced as a clear, specific message ("You already reviewed this restaurant") — not a generic error, not a crash.
5. **Given** a logged-out user, **when** they tap "Add a review," **then** they see the same login-prompt alert `favorites.md`'s favorite toggle already uses, and the form does not open.
6. **Given** a submission in flight, **when** the user taps submit again before it resolves, **then** the button is disabled — no duplicate request.

---

### Edge Cases

- Logged-out user reaching the trigger: guarded before the sheet opens (scenario 5), not after a failed submission.
- Rapid double-submit: prevented by disabling the submit control while pending (scenario 6), same convention as `auth.md`'s `AuthForm`.
- The restaurant detail response caps its embedded review list at 20 (`dine-out-backend`'s `specs/reviews.md`) — a successful submission always appears immediately after refetch regardless of that cap, since it's the newest.

## Functional Requirements

- **FR-001**: The user MUST be able to open a review submission form from the restaurant detail screen's reviews section, from either the empty-state prompt or a trigger present when reviews already exist (US1, scenario 1).
- **FR-002**: The form MUST require a star rating (1-5) and non-empty text before allowing submission, validated on submit (US1, scenarios 2-3).
- **FR-003**: On successful submission, the system MUST invalidate/refetch the restaurant-detail query so the new review, average rating, and review count appear without a manual screen refresh (US1, scenario 1).
- **FR-004**: On a 409 response, the form MUST surface a specific "already reviewed" message rather than a generic error (US1, scenario 4).
- **FR-005**: A logged-out user tapping the "Add a review" trigger MUST see a login-prompt alert instead of the form opening, matching `favorites.md`'s existing guard (US1, scenario 5).
- **FR-006**: The submit control MUST be disabled while a submission is in flight (US1, scenario 6).

### Key Entities

- **Review**: `id`, the authoring user's account name, `rating` (1-5), `text`, `createdAt` — wire
  contract owned by `dine-out-backend`'s `specs/reviews.md`.

## Success Criteria

- **SC-001**: A successful submission is visible in both `ReviewsSection`'s preview and `ReviewsSheetContent`'s full list without navigating away from the detail screen.
- **SC-002**: The detail screen's rating/review-count header reflects a new submission within the same screen session, no app restart needed.

## Architecture Mapping

- **Feature folder**: `src/features/reviews/{api,components,types}`.
- **Reuses from `src/components/ui/`**: `BottomSheet` (no new sheet primitive). New export: `StarRatingInput` (tappable 5-star input — the existing `StarRating` is display-only and stays unchanged).
- **Composition**: `ReviewFormSheetContent` is mounted from `app/restaurant/[id].tsx`, not imported by `restaurant.md`'s `ReviewsSection` — same "features never import each other" rule `restaurant.md`'s US6 (Similar Places) already follows. `ReviewsSection` exposes an `onAddReview` callback prop; the route owns the `BottomSheet`/open-state and passes `restaurantId`.
- **Needs global state (`src/stores/`)?**: No — a submitted review isn't cross-screen state like favorites; the mutation's success just invalidates the existing `useRestaurantDetailQuery` cache entry.
- **Types**: `Review` re-exported from `src/features/restaurant/types/` (the wire/display contract restaurant.md already defines) rather than a third parallel definition.
- **New dependencies?**: none.

## Out of Scope

- Editing or deleting a submitted review.
- Any review moderation or reporting.
- A dedicated reviews list screen — reviews are viewed only inside the restaurant detail screen's existing sections (`restaurant.md`).

## Assumptions and Dependencies

- Depends on `restaurant.md`'s `ReviewsSection`/`ReviewsSheetContent` existing as the display surfaces this spec's form is triggered from.
- Depends on `useRestaurantDetailQuery`'s query key staying `['restaurant', id]` — the invalidation target for FR-003.
- Depends on `dine-out-backend`'s `POST /restaurants/:id/reviews` (`dine-out-backend`'s `specs/reviews.md`).

## Notes for the AI Agent

- Before coding: if the change touches more than ~3 files or involves an architecture decision not covered in the Architecture Mapping above, enter plan mode and validate with the user first.
- Implement only what's listed in the Functional Requirements above.
- Mandatory verification: `npx tsc --noEmit` clean + bundle smoke test on `/restaurant/[id]`. Check `src/components/ui/index.ts` before adding a component.
- On completion: update `Status` at the top of this file and fill in the Changelog below, and update `specs/PROJECT.md`'s Feature Index.

## Changelog

| Date | Change |
|------|--------|
| 2026-08-31 | Spec created. |
| 2026-08-31 | Implemented and verified end to end against the real `dine-out-backend`. New `src/features/reviews/` (`useSubmitReviewMutation`, `ReviewFormSheetContent`), new `src/components/ui/StarRatingInput.tsx`. `ReviewFormSheetContent` is mounted from `app/restaurant/[id].tsx` (not imported by `ReviewsSection`) — `ReviewsSection` gained an `onAddReview` callback prop instead, per the "features never import each other" rule. `useRestaurantDetailQuery` now threads real `reviews`/`averageRating`/`reviewCount` instead of the old hardcoded `reviews: []`. `npx tsc --noEmit`, `npx biome lint .`, `npx jest` (65 tests) clean. Verified live via Playwright: submit a review → sheet closes → header rating and the reviews list update without a manual refresh; a second submission for the same restaurant surfaces the 409 as an in-sheet banner ("You already reviewed this restaurant"), not a crash; logged-out tap on "Add a review" shows the login-prompt alert without opening the form. |
