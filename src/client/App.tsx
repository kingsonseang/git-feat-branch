import { useEffect, useMemo, useState } from "react";
import { filterTasks } from "../shared/filterTasks";
import type { Task, TaskFilters, TaskUpdate } from "../shared/types";
import { fetchTasks, updateTask } from "./api";
import { FilterBar } from "./components/FilterBar";
import { TaskRow } from "./components/TaskRow";

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filters, setFilters] = useState<TaskFilters>({
    query: "",
    status: "all",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    let isCurrent = true;

    async function load() {
      try {
        const loadedTasks = await fetchTasks();
        if (isCurrent) {
          setTasks(loadedTasks);
          setLoadError(null);
        }
      } catch (error) {
        if (isCurrent) {
          setLoadError(
            error instanceof Error ? error.message : "Unable to load tasks.",
          );
        }
      } finally {
        if (isCurrent) {
          setIsLoading(false);
        }
      }
    }

    void load();
    return () => {
      isCurrent = false;
    };
  }, []);

  const visibleTasks = useMemo(
    () => filterTasks(tasks, filters),
    [tasks, filters],
  );

  async function handleUpdate(id: string, patch: TaskUpdate) {
    setActionError(null);

    try {
      const updated = await updateTask(id, patch);
      setTasks((current) =>
        current.map((task) => (task.id === updated.id ? updated : task)),
      );
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "Unable to save the task.",
      );
      throw error;
    }
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Release board</p>
          <h1>Taskline</h1>
          <p className="subtitle">
            Keep the release queue focused and the task details current.
          </p>
        </div>
      </header>

      <main>
        {loadError ? (
          <p className="banner banner-error" role="alert">
            {loadError}
          </p>
        ) : null}

        {actionError ? (
          <p className="banner banner-error" role="alert">
            {actionError}
          </p>
        ) : null}

        <FilterBar
          filters={filters}
          resultCount={visibleTasks.length}
          totalCount={tasks.length}
          onChange={setFilters}
        />

        {isLoading ? (
          <p className="empty-state">Loading tasks...</p>
        ) : visibleTasks.length === 0 ? (
          <p className="empty-state">
            No tasks match the current filters.
          </p>
        ) : (
          <ul className="task-list">
            {visibleTasks.map((task) => (
              <TaskRow key={task.id} task={task} onUpdate={handleUpdate} />
            ))}
          </ul>
        )}
      </main>

      <footer className="app-footer">
        <span>Taskline</span>
        <span>Local demo data</span>
      </footer>
    </div>
  );
}
