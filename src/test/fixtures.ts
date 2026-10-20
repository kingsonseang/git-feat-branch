import type { Task, TaskFilters } from "../shared/types";

const defaultTask: Task = {
  id: "task-1",
  title: "Test task",
  description: "A task used in automated tests.",
  status: "todo",
  priority: "medium",
  updatedAt: "2026-10-01T12:00:00.000Z",
};

export function makeTask(overrides: Partial<Task> = {}): Task {
  return { ...defaultTask, ...overrides };
}

export function makeFilters(
  overrides: Partial<TaskFilters> = {},
): TaskFilters {
  return { query: "", status: "all", priority: "all", ...overrides };
}
