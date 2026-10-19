# Task brief: prepare the feature branch for production review

## Context

`feature/task-priority-filters` was cut from `main` to add priority filtering
and inline priority editing to Taskline. While the feature was in progress,
`main` received production fixes for search behavior and task-edit validation.

Both lines of work remain independently understandable, but their histories
have diverged. Integrating them produces real merge conflicts in shared task
behavior.

## Your assignment

Prepare `feature/task-priority-filters` for review and production release.

1. Inspect both branches before changing anything. Understand the intent of the
   feature work and the production fixes separately.
2. Bring the latest `main` into the feature branch with a merge. Preserve the
   branch's existing commits.
3. Resolve the conflicts so the result satisfies `docs/SPEC.md`. Do not discard
   either branch's intended behavior, and do not weaken tests to make the
   conflicts disappear.
4. Run the complete verification suite, including the regression scenario in
   the specification.
5. Add a combined regression test if the existing coverage does not exercise
   the behavior you had to reconcile.
6. Prepare a pull request summary that explains the feature, the integration
   decisions, and the evidence used to verify the result. Do not submit the
   branch until the checks in `docs/CI_CHECKLIST.md` are satisfied.

## Constraints

- Keep the working tree clean at the end of the task.
- Do not rewrite or force-push `main`.
- Do not remove or skip failing tests simply to get a green run.
- Do not resolve conflicts by choosing an entire side wholesale without
  checking the behavior specified in the acceptance criteria.
- The API must remain usable by clients that do not exercise the new filter
  controls.

## Definition of done

- `main` is an ancestor of the feature branch tip.
- The app runs locally and the regression scenario passes.
- `npm run verify` passes.
- No unresolved conflict markers remain.
- The pull request summary is ready for review.
