import { describe, expect, it } from "vitest";
import { filterTasks } from "./filterTasks";
import { makeFilters, makeTask } from "../test/fixtures";

describe("filterTasks", () => {
  const tasks = [
    makeTask({
      id: "task-1",
      title: "Audit onboarding flow",
      status: "todo",
    }),
    makeTask({
      id: "task-2",
      title: "Prepare roadmap",
      status: "in_progress",
    }),
    makeTask({
      id: "task-3",
      title: "Draft release notes",
      status: "done",
    }),
  ];

  it("returns every task when no filters are active", () => {
    expect(filterTasks(tasks, makeFilters())).toHaveLength(3);
  });

  it("matches title text case-insensitively", () => {
    const results = filterTasks(tasks, makeFilters({ query: "ROADMAP" }));

    expect(results.map((task) => task.id)).toEqual(["task-2"]);
  });

  it("filters by status", () => {
    const results = filterTasks(tasks, makeFilters({ status: "done" }));

    expect(results.map((task) => task.id)).toEqual(["task-3"]);
  });

  it("combines text and status filters", () => {
    const results = filterTasks(
      tasks,
      makeFilters({ query: "release", status: "todo" }),
    );

    expect(results).toEqual([]);
  });

  it("ignores surrounding whitespace in the query", () => {
    const results = filterTasks(tasks, makeFilters({ query: "  audit  " }));

    expect(results.map((task) => task.id)).toEqual(["task-1"]);
  });
});
