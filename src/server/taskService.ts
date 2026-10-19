import { filterTasks } from "../shared/filterTasks";
import {
  isTaskStatus,
  type Task,
  type TaskFilters,
  type TaskUpdate,
} from "../shared/types";

export class TaskNotFoundError extends Error {
  constructor(id: string) {
    super(`Task "${id}" was not found.`);
    this.name = "TaskNotFoundError";
  }
}

export class InvalidTaskError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidTaskError";
  }
}

export class InvalidFilterError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidFilterError";
  }
}

export function listTasks(
  tasks: readonly Task[],
  filters: TaskFilters,
): Task[] {
  return filterTasks(tasks, filters);
}

export function updateTask(
  tasks: Task[],
  id: string,
  patch: TaskUpdate,
): Task {
  const task = tasks.find((candidate) => candidate.id === id);

  if (!task) {
    throw new TaskNotFoundError(id);
  }

  if (patch.title !== undefined) {
    task.title = patch.title;
  }

  if (patch.status !== undefined) {
    if (!isTaskStatus(patch.status)) {
      throw new InvalidTaskError(
        "Status must be one of: todo, in_progress, done.",
      );
    }

    task.status = patch.status;
  }

  task.updatedAt = new Date().toISOString();
  return task;
}

export function parseTaskFilters(
  raw: Record<string, unknown>,
): TaskFilters {
  const status =
    typeof raw.status === "string" && raw.status.length > 0
      ? raw.status
      : "all";

  if (status !== "all" && !isTaskStatus(status)) {
    throw new InvalidFilterError(`Unknown status "${status}".`);
  }

  return {
    query: typeof raw.q === "string" ? raw.q : "",
    status,
  };
}
