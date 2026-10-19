import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import type { Task, TaskUpdate } from "../shared/types";
import {
  InvalidFilterError,
  InvalidTaskError,
  listTasks,
  parseTaskFilters,
  TaskNotFoundError,
  updateTask,
} from "./taskService";

export function createApp(tasks: Task[]) {
  const app = express();

  app.use(express.json());

  app.get("/api/health", (_request, response) => {
    response.json({ status: "ok" });
  });

  app.get("/api/tasks", (request, response, next) => {
    try {
      const filters = parseTaskFilters(
        request.query as Record<string, unknown>,
      );
      const visibleTasks = listTasks(tasks, filters);

      response.json({ tasks: visibleTasks, total: visibleTasks.length });
    } catch (error) {
      next(error);
    }
  });

  app.patch("/api/tasks/:id", (request, response, next) => {
    try {
      const updated = updateTask(
        tasks,
        request.params.id,
        request.body as TaskUpdate,
      );

      response.json({ task: updated });
    } catch (error) {
      next(error);
    }
  });

  app.use(
    (
      error: unknown,
      _request: Request,
      response: Response,
      _next: NextFunction,
    ) => {
      if (error instanceof InvalidFilterError) {
        response.status(400).json({ error: error.message });
        return;
      }

      if (error instanceof InvalidTaskError) {
        response.status(422).json({ error: error.message });
        return;
      }

      if (error instanceof TaskNotFoundError) {
        response.status(404).json({ error: error.message });
        return;
      }

      console.error(error);
      response.status(500).json({ error: "Unexpected server error." });
    },
  );

  return app;
}
