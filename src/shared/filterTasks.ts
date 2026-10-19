import type { Task, TaskFilters } from "./types";

/**
 * Applies the board's filters. The API and the client both use this function so
 * a task is filtered the same way regardless of where the list is rendered.
 */
export function filterTasks(
  tasks: readonly Task[],
  filters: TaskFilters,
): Task[] {
  const query = filters.query.trim().toLowerCase();

  return tasks.filter((task) => {
    const matchesQuery =
      query.length === 0 || task.title.toLowerCase().includes(query);
    const matchesStatus =
      filters.status === "all" || task.status === filters.status;

    return matchesQuery && matchesStatus;
  });
}
