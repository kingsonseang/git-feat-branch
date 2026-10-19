#!/usr/bin/env bash
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

feature_branch="feature/task-priority-filters"
integration_branch="main"

if ! git show-ref --verify --quiet "refs/heads/${integration_branch}"; then
  echo "Missing branch: ${integration_branch}" >&2
  exit 1
fi

if ! git show-ref --verify --quiet "refs/heads/${feature_branch}"; then
  echo "Missing branch: ${feature_branch}" >&2
  exit 1
fi

merge_base="$(git merge-base "${integration_branch}" "${feature_branch}")"
integration_tip="$(git rev-parse "${integration_branch}")"
feature_tip="$(git rev-parse "${feature_branch}")"

if [[ "${merge_base}" == "${integration_tip}" || "${merge_base}" == "${feature_tip}" ]]; then
  echo "Branches have not diverged from a common base." >&2
  exit 1
fi

tmp_dir="$(mktemp -d "${TMPDIR:-/tmp}/taskline-start.XXXXXX")"
cleanup() {
  rm -rf "${tmp_dir}"
}
trap cleanup EXIT

git clone --quiet "$(pwd)" "${tmp_dir}/repo"
cd "${tmp_dir}/repo"
git config user.name "Taskline Team"
git config user.email "team@taskline.local"

if git show-ref --verify --quiet "refs/heads/${feature_branch}"; then
  git switch --quiet "${feature_branch}"
else
  git switch --quiet -c "${feature_branch}" --track "origin/${feature_branch}"
fi

set +e
merge_output="$(git merge --no-commit --no-ff "origin/${integration_branch}" 2>&1)"
merge_status=$?
set -e

if [[ ${merge_status} -eq 0 ]]; then
  echo "Expected the integration to conflict, but it merged cleanly." >&2
  git merge --abort || true
  exit 1
fi

conflicted_files="$(git diff --name-only --diff-filter=U)"
printf '%s\n' "${conflicted_files}"

for expected in "src/shared/filterTasks.ts" "src/server/taskService.ts"; do
  if ! grep -qx "${expected}" <<<"${conflicted_files}"; then
    echo "Expected a conflict in ${expected}, but it was not present." >&2
    echo "Merge output:" >&2
    printf '%s\n' "${merge_output}" >&2
    git merge --abort || true
    exit 1
  fi
done

git merge --abort
echo "Start state verified: the branches diverge and the integration conflicts."
