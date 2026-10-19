# Validation procedure

## 1. Confirm the starting repository shape

Run:

```bash
git status --short --branch
git branch --all --verbose
git log --graph --all --decorate --oneline
bash scripts/check-start-state.sh
```

Expected start state:

- The checked-out branch is `feature/task-priority-filters`, and the working
  tree is clean.
- `main` and `feature/task-priority-filters` share a common base and both have
  commits after it.
- The branch check script attempts the integration in a temporary clone and
  confirms that the merge fails with conflicts in:
  - `src/shared/filterTasks.ts`
  - `src/server/taskService.ts`
- The original repository is not modified by the check.

## 2. Confirm each branch is independently healthy

Use a temporary worktree or clone, not the working repository:

```bash
git worktree add ../taskline-main-check main
cd ../taskline-main-check
npm ci
npm run verify
cd -
git worktree remove ../taskline-main-check
```

The same commands can be run against `feature/task-priority-filters`.
Both branch tips should typecheck, test, and build.

## 3. Integrate and resolve

Follow `docs/TASK_BRIEF.md`. After resolving, run:

```bash
npm run verify
git merge-base --is-ancestor main HEAD
git status --short
```

`npm run verify` runs the TypeScript check, the full test suite, the production
build, and a conflict-marker scan. `git merge-base` should exit successfully.

## 4. Exercise the application

Start the app:

```bash
npm run dev
```

Open <http://localhost:5173> and run the scenario in `docs/SPEC.md`:
combined search/status/priority filters, an edit that removes a task from the
filtered list, filter preservation, and the blank-title validation path.

## 5. Verify the API behavior

```bash
curl 'http://localhost:3001/api/tasks?q=onboarding%20checklist&status=todo&priority=high'
curl -X PATCH 'http://localhost:3001/api/tasks/task-101' \
  -H 'content-type: application/json' \
  -d '{"priority":"low"}'
curl -X PATCH 'http://localhost:3001/api/tasks/task-101' \
  -H 'content-type: application/json' \
  -d '{"title":"   "}'
```

The first request should return the matching seeded task. The valid patch
should return the updated task. The blank-title patch should return `422` and
must not change the stored task.

## 6. Reproduce the starting state

The generation fixture is kept outside Git history in `.scenario/` so that the
repository itself remains clean and realistic. Recreate a fresh copy with:

```bash
bash .scenario/generate.sh /tmp/taskline-reproduction
cd /tmp/taskline-reproduction
git branch --all
bash scripts/check-start-state.sh
```

The reproduced repository should have the same branches, commit messages,
conflicts, and clean feature checkout.
