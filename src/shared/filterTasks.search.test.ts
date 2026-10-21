import { describe, expect, it } from "vitest";
import { filterTasks } from "./filterTasks";
import { makeFilters, makeTask } from "../test/fixtures";

describe("search behavior", () => {
  const tasks = [
    makeTask({
      id: "task-1",
      title: "Audit onboarding flow",
      description: "Document drop-off points in the checklist for new hires.",
    }),
    makeTask({
      id: "task-2",
      title: "Prepare roadmap",
      description: "Outline milestones for the hiring plan.",
    }),
  ];

  it("matches text in the task description", () => {
    const results = filterTasks(tasks, makeFilters({ query: "checklist" }));

    expect(results.map((task) => task.id)).toEqual(["task-1"]);
  });

  it("requires every term in a multi-term query", () => {
    const results = filterTasks(
      tasks,
      makeFilters({ query: "onboarding checklist" }),
    );

    expect(results.map((task) => task.id)).toEqual(["task-1"]);
  });

  it("can match terms across the title and description", () => {
    const results = filterTasks(
      tasks,
      makeFilters({ query: "audit CHECKLIST" }),
    );

    expect(results.map((task) => task.id)).toEqual(["task-1"]);
  });

  it("returns no tasks when any query term is missing", () => {
    const results = filterTasks(
      tasks,
      makeFilters({ query: "onboarding missing" }),
    );

    expect(results).toEqual([]);
  });

  it("normalizes repeated and surrounding whitespace", () => {
    const results = filterTasks(
      tasks,
      makeFilters({ query: "  onboarding   checklist  " }),
    );

    expect(results.map((task) => task.id)).toEqual(["task-1"]);
  });

  it("combines description search with the status filter", () => {
    const results = filterTasks(
      tasks,
      makeFilters({ query: "checklist", status: "done" }),
    );

    expect(results).toEqual([]);
  });
});
