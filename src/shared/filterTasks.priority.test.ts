import { describe, expect, it } from "vitest";
import { filterTasks } from "./filterTasks";
import { makeFilters, makeTask } from "../test/fixtures";

describe("priority filtering", () => {
  const tasks = [
    makeTask({
      id: "task-1",
      title: "Audit onboarding flow",
      status: "todo",
      priority: "high",
    }),
    makeTask({
      id: "task-2",
      title: "Prepare roadmap",
      status: "in_progress",
      priority: "high",
    }),
    makeTask({
      id: "task-3",
      title: "Draft release notes",
      status: "done",
      priority: "low",
    }),
    makeTask({
      id: "task-4",
      title: "Fix empty state",
      status: "todo",
      priority: "medium",
    }),
  ];

  it("filters by priority", () => {
    const results = filterTasks(tasks, makeFilters({ priority: "high" }));

    expect(results.map((task) => task.id)).toEqual(["task-1", "task-2"]);
  });

  it("combines priority and status filters", () => {
    const results = filterTasks(
      tasks,
      makeFilters({ priority: "high", status: "todo" }),
    );

    expect(results.map((task) => task.id)).toEqual(["task-1"]);
  });

  it("combines query, status, and priority filters", () => {
    const results = filterTasks(
      tasks,
      makeFilters({
        query: "roadmap",
        status: "in_progress",
        priority: "high",
      }),
    );

    expect(results.map((task) => task.id)).toEqual(["task-2"]);
  });

  it("returns all priorities when the priority filter is all", () => {
    const results = filterTasks(tasks, makeFilters({ status: "todo" }));

    expect(results.map((task) => task.id)).toEqual(["task-1", "task-4"]);
  });
});
