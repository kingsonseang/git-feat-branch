# Taskline

Taskline is a compact project task board. It is intentionally small: one API,
one shared task model, and a React client, with enough tests to demonstrate how
filtering and inline editing behave together.

## Stack

- React 18 and Vite for the client
- Express for the JSON API
- Shared TypeScript models and filtering logic
- Vitest, Testing Library, and Supertest for automated checks

## Quick start

Requires Node 20.11 or newer.

```bash
npm run setup
npm run dev
```

- Client: <http://localhost:5173>
- API: <http://localhost:3001>

`npm run dev` runs the Vite dev server and the API together. Vite proxies
`/api` requests to the API process.

For a production-style check:

```bash
npm run verify
npm start
```

`npm start` serves the built client from the Express process on port 3001 when
`dist/` exists.

## Scripts

| Command             | Purpose                                                   |
| ------------------- | --------------------------------------------------------- |
| `npm run setup`     | Install the locked dependency set                          |
| `npm run dev`       | Run the API and client in watch mode                       |
| `npm run test`      | Run all automated tests once                               |
| `npm run test:watch`| Run tests in watch mode                                    |
| `npm run typecheck` | Run strict TypeScript checks without emitting files        |
| `npm run build`     | Build the client into `dist/`                              |
| `npm run verify`    | Typecheck, test, build, and scan for conflict markers      |
| `npm start`         | Start the API (and serve `dist/` when it exists)           |

## API

Tasks are stored in memory and seeded on startup.

- `GET /api/health` returns a health response.
- `GET /api/tasks` lists tasks.
  - `q`: free-text query
  - `status`: `all`, `todo`, `in_progress`, or `done`
- `PATCH /api/tasks/:id` partially updates a task.
  - Body fields vary by the task model: `title`, `status`, and any fields added
    by the current feature.
  - Returns `{ "task": Task }` on success.
  - Returns `400` for invalid filters, `404` for an unknown task, and `422` for
    an invalid update.

## Project layout

```text
src/
  client/   React app, API client, and UI components
  server/   Express app, seed data, and task service
  shared/   Task types and filtering logic used by both sides
  test/     Shared fixtures and a small fake API for UI tests
docs/       Specification, task brief, checklist, and validation notes
scripts/    Setup, verification, and repository-state checks
```

See [docs/SPEC.md](docs/SPEC.md) for the expected behavior and acceptance
criteria.
