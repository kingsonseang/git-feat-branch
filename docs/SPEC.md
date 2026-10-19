# Task board specification

## Summary

Taskline tracks project tasks. A task has a title, description, status,
priority, and last-updated timestamp. Users can filter the board and edit task
details inline without losing their place.

This document describes the behavior expected of the completed feature. It is
the source of truth when behavior must be reconciled.

## Task model

| Field         | Values                                      |
| ------------- | ------------------------------------------- |
| `id`          | Stable string identifier                    |
| `title`       | Required text, 1-120 characters after trim  |
| `description` | Supporting text                             |
| `status`      | `todo`, `in_progress`, or `done`            |
| `priority`    | `low`, `medium`, or `high`                  |
| `updatedAt`   | ISO timestamp for the latest successful edit |

## Filtering

- The search query is case-insensitive.
- Search covers both the task title and description.
- A query containing several whitespace-separated terms requires every term to
  be present across the combined title and description. Terms may appear in
  any order and in either field.
- Status filtering accepts `all`, `todo`, `in_progress`, and `done`.
- Priority filtering accepts `all`, `low`, `medium`, and `high`.
- Text, status, and priority filters combine with AND semantics.
- The result count reports visible tasks over the complete task count.
- Clearing filters restores the unfiltered board.
- Editing a task while filters are active must not reset or otherwise alter the
  active filters. If an edit means the task no longer matches, it leaves the
  filtered list immediately.

## Editing

- Task titles can be edited inline. Save applies the change; Cancel discards it.
- Titles are trimmed before storage. A blank or whitespace-only title is
  rejected with a visible error and the previous title remains intact.
- Status and priority can be changed inline.
- Edits are partial updates: fields omitted from a request keep their current
  values.
- An invalid request is atomic. If any supplied field is invalid, no field is
  changed and the task's `updatedAt` does not move.
- Successful edits refresh the task's `updatedAt` value.

## API contract

### `GET /api/tasks`

Query parameters:

- `q`: optional free-text query
- `status`: optional; defaults to `all`
- `priority`: optional; defaults to `all`

Unknown `status` or `priority` values return `400` with an `{ error }` body.
The response is:

```json
{ "tasks": [], "total": 0 }
```

### `PATCH /api/tasks/:id`

Accepts a JSON object containing any subset of `title`, `status`, and
`priority`.

- Returns `200` with `{ "task": Task }` after a successful edit.
- Returns `404` when the task does not exist.
- Returns `422` when a supplied field is invalid. No fields are mutated.
- Unknown task ids never create a new task.

## Acceptance criteria

1. Search finds matching text in titles and descriptions.
2. Multi-term search requires every term and ignores extra whitespace.
3. Status and priority filters work alone and together with search.
4. The visible count updates whenever the query, status, or priority changes.
5. Clear filters resets the search, status, and priority controls.
6. A title edit trims surrounding whitespace.
7. A blank title is rejected visibly; the existing title remains.
8. Priority-only and status-only patches leave the title and other fields alone.
9. Invalid updates leave the entire task unchanged, including `updatedAt`.
10. Active filters and their values survive task edits.
11. A task that no longer matches after an edit disappears from the filtered
    view without clearing the filters.
12. Type checking, automated tests, and the production build pass.

## Regression scenario

Seed data supports this end-to-end exercise:

1. Set the search query to `onboarding checklist`.
2. Set status to `To do`.
3. Set priority to `High`.
4. Confirm exactly one task is visible: the one whose title supplies
   "onboarding" and whose description supplies "checklist".
5. Change that task's priority to `Low`.
6. Confirm the task disappears, the result count drops, and all three filter
   values are unchanged.
7. Clear the filters and confirm the full board returns.
8. Edit a title to whitespace only and confirm the previous title and error
   message remain visible.
9. Submit an invalid priority through the API and confirm the task's title,
   status, priority, and timestamp are unchanged.
