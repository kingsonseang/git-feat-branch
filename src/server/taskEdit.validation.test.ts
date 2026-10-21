import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "./app";
import { createSeedTasks } from "./seed";
import { InvalidTaskError, updateTask } from "./taskService";

function makeApp() {
  return createApp(createSeedTasks());
}

describe("task edit validation", () => {
  it("trims the title before storing it", async () => {
    const response = await request(makeApp())
      .patch("/api/tasks/task-101")
      .send({ title: "  Audit the onboarding flow  " })
      .expect(200);

    expect(response.body.task.title).toBe("Audit the onboarding flow");
  });

  it("rejects a whitespace-only title without changing the task", () => {
    const tasks = createSeedTasks();
    const original = { ...tasks[0] };

    expect(() =>
      updateTask(tasks, "task-101", { title: "   ", status: "done" }),
    ).toThrow(InvalidTaskError);

    expect(tasks[0]).toEqual(original);
  });

  it("does not apply a partial update when the status is invalid", () => {
    const tasks = createSeedTasks();
    const original = { ...tasks[0] };

    expect(() =>
      updateTask(tasks, "task-101", {
        title: "Renamed task",
        status: "blocked" as never,
      }),
    ).toThrow(InvalidTaskError);

    expect(tasks[0]).toEqual(original);
  });

  it("rejects titles longer than 120 characters", () => {
    const tasks = createSeedTasks();

    expect(() =>
      updateTask(tasks, "task-101", { title: "x".repeat(121) }),
    ).toThrow("120 characters or fewer");
  });

  it("returns 422 and preserves the previous title for a blank update", async () => {
    const app = makeApp();

    const updateResponse = await request(app)
      .patch("/api/tasks/task-101")
      .send({ title: "   " })
      .expect(422);

    expect(updateResponse.body.error).toContain("must not be empty");

    const listResponse = await request(app).get("/api/tasks").expect(200);
    const task = listResponse.body.tasks.find(
      (candidate: { id: string }) => candidate.id === "task-101",
    );

    expect(task.title).toBe("Audit onboarding flow");
    expect(task.updatedAt).toBe("2026-10-02T09:15:00.000Z");
  });
});
