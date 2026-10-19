import {
  TASK_STATUSES,
  TASK_STATUS_LABELS,
  type TaskFilters,
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

      <p className="result-count" aria-live="polite">
        {resultCount} of {totalCount} tasks
      </p>
    </section>
  );
}
