import type {
  Task,
  TaskListResponse,
  TaskResponse,
  TaskUpdate,
} from "../shared/types";

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);

  if (!response.ok) {
    let message = `Request failed with status ${response.status}.`;

    try {
      const payload = (await response.json()) as { error?: string };
      if (payload.error) {
        message = payload.error;
      }
    } catch {
      // Keep the status-based message when the body is not JSON.
    }

    throw new Error(message);
  }

  return (await response.json()) as T;
}

export async function fetchTasks(): Promise<Task[]> {
  const response = await request<TaskListResponse>("/api/tasks");
  return response.tasks;
}

export async function updateTask(
  id: string,
  patch: TaskUpdate,
): Promise<Task> {
  const response = await request<TaskResponse>(
    `/api/tasks/${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(patch),
    },
  );

  return response.task;
}
