import { filterTasks } from "../shared/filterTasks";
import {
  isTaskStatus,
  type Task,
  type TaskFilters,
  type TaskUpdate,
} from "../shared/types";

const MAX_TITLE_LENGTH = 120;

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

function normalizeTitle(value: unknown): string {
  if (typeof value !== "string") {
    throw new InvalidTaskError("Title must be text.");
  }

  const title = value.trim();

  if (title.length === 0) {
    throw new InvalidTaskError("Title must not be empty.");
  }

  if (title.length > MAX_TITLE_LENGTH) {
    throw new InvalidTaskError(
      `Title must be ${MAX_TITLE_LENGTH} characters or fewer.`,
    );
  }

  return title;
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

  // Validate every supplied field before mutating the task so a bad patch
  // cannot leave a partially applied update behind.
  const nextTitle =
    patch.title !== undefined ? normalizeTitle(patch.title) : undefined;

  if (patch.status !== undefined && !isTaskStatus(patch.status)) {
    throw new InvalidTaskError(
      "Status must be one of: todo, in_progress, done.",
    );
  }

  if (nextTitle !== undefined) {
    task.title = nextTitle;
  }

  if (patch.status !== undefined) {
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
