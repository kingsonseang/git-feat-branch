export const TASK_STATUSES = ["todo", "in_progress", "done"] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];
export type TaskStatusFilter = TaskStatus | "all";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  updatedAt: string;
}

export interface TaskFilters {
  query: string;
  status: TaskStatusFilter;
}

export interface TaskUpdate {
  title?: string;
  status?: TaskStatus;
}

export interface TaskListResponse {
  tasks: Task[];
  total: number;
}

export interface TaskResponse {
  task: Task;
}

export interface ApiErrorResponse {
  error: string;
}

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  todo: "To do",
  in_progress: "In progress",
  done: "Done",
};

export function isTaskStatus(value: unknown): value is TaskStatus {
  return (
    typeof value === "string" &&
    (TASK_STATUSES as readonly string[]).includes(value)
  );
}
