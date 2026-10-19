import { vi } from "vitest";
import type { Task } from "../shared/types";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

/**
 * Installs a small in-memory fake of the task API. The tests deliberately
 * exercise the real App and API client rather than mocking those modules.
 */
export function installTaskApiMock(initialTasks: Task[]) {
  let tasks = initialTasks.map((task) => ({ ...task }));

  const fetchMock = vi.fn(
    async (
      input: RequestInfo | URL,
      init?: RequestInit,
    ): Promise<Response> => {
      const url =
        typeof input === "string"
          ? input
          : input instanceof URL
            ? input.toString()
            : input.url;
      const method = init?.method ?? "GET";

      if (method === "GET" && url.endsWith("/api/tasks")) {
        return jsonResponse({ tasks, total: tasks.length });
      }

      const match = url.match(/\/api\/tasks\/([^/?]+)$/);

      if (method === "PATCH" && match) {
        const id = decodeURIComponent(match[1] ?? "");
        const index = tasks.findIndex((task) => task.id === id);

        if (index === -1) {
          return jsonResponse({ error: `Task "${id}" was not found.` }, 404);
        }

        const patch = JSON.parse(String(init?.body ?? "{}")) as Record<
          string,
          unknown
        >;
        tasks[index] = {
          ...tasks[index],
          ...patch,
          updatedAt: "2026-10-21T12:00:00.000Z",
        } as Task;

        return jsonResponse({ task: tasks[index] });
      }

      return jsonResponse({ error: "Unexpected request in test." }, 500);
    },
  );

  vi.stubGlobal("fetch", fetchMock);

  return {
    fetchMock,
    getTasks: () => tasks,
  };
}
