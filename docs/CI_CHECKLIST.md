# CI checklist

Required before requesting review. These checks describe outcomes, not an
implementation.

- [ ] Dependencies install from the lockfile with `npm ci`.
- [ ] `npm run typecheck` passes with no errors.
- [ ] `npm test` passes with no skipped tests.
- [ ] `npm run build` completes successfully.
- [ ] The API and client both start locally.
- [ ] The feature branch contains the latest `main`.
- [ ] No unresolved conflict markers exist in tracked source files.
- [ ] The regression scenario in `docs/SPEC.md` has been exercised.
- [ ] Active filters remain intact through an edit that removes a task from the
      filtered view.
- [ ] The pull request summary records the behavior preserved from both
      branches and the verification commands used.

The same install, typecheck, test, and build checks run in
`.github/workflows/ci.yml` on every push and pull request.
