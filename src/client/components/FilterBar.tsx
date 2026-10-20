import {
  TASK_PRIORITIES,
  TASK_PRIORITY_LABELS,
  TASK_STATUSES,
  TASK_STATUS_LABELS,
  type TaskFilters,
  type TaskPriorityFilter,
  type TaskStatusFilter,
} from "../../shared/types";

interface FilterBarProps {
  filters: TaskFilters;
  resultCount: number;
  totalCount: number;
  onChange: (filters: TaskFilters) => void;
}

export function FilterBar({
  filters,
  resultCount,
  totalCount,
  onChange,
}: FilterBarProps) {
  const hasActiveFilters =
    filters.query.trim().length > 0 ||
    filters.status !== "all" ||
    filters.priority !== "all";

  return (
    <section className="filter-bar" aria-label="Task filters">
      <label className="field">
        <span>Search</span>
        <input
          type="search"
          value={filters.query}
          placeholder="Search tasks..."
          onChange={(event) =>
            onChange({ ...filters, query: event.target.value })
          }
        />
      </label>

      <label className="field">
        <span>Status</span>
        <select
          aria-label="Status filter"
          value={filters.status}
          onChange={(event) =>
            onChange({
              ...filters,
              status: event.target.value as TaskStatusFilter,
            })
          }
        >
          <option value="all">All statuses</option>
          {TASK_STATUSES.map((status) => (
            <option key={status} value={status}>
              {TASK_STATUS_LABELS[status]}
            </option>
          ))}
        </select>
      </label>

      <label className="field">
        <span>Priority</span>
        <select
          aria-label="Priority filter"
          value={filters.priority}
          onChange={(event) =>
            onChange({
              ...filters,
              priority: event.target.value as TaskPriorityFilter,
            })
          }
        >
          <option value="all">All priorities</option>
          {TASK_PRIORITIES.map((priority) => (
            <option key={priority} value={priority}>
              {TASK_PRIORITY_LABELS[priority]}
            </option>
          ))}
        </select>
      </label>

      {hasActiveFilters ? (
        <button
          type="button"
          className="button-quiet clear-filters"
          onClick={() =>
            onChange({ query: "", status: "all", priority: "all" })
          }
        >
          Clear filters
        </button>
      ) : null}

      <p className="result-count" aria-live="polite">
        {resultCount} of {totalCount} tasks
      </p>
    </section>
  );
}
