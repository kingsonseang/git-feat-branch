import type { Task, TaskFilters } from "./types";

/**
 * Applies the board's filters. The API and the client both use this function so
 * a task is filtered the same way regardless of where the list is rendered.
 */
export function filterTasks(
  tasks: readonly Task[],
  filters: TaskFilters,
): Task[] {
  const terms = filters.query
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter((term) => term.length > 0);

  return tasks.filter((task) => {
    const searchable = `${task.title} ${task.description}`.toLowerCase();
    const matchesQuery = terms.every((term) => searchable.includes(term));
    const matchesStatus =
      filters.status === "all" || task.status === filters.status;

    return matchesQuery && matchesStatus;
  });
}
