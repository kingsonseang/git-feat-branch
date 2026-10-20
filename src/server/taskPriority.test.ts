import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "./app";
import { createSeedTasks } from "./seed";

function makeApp() {
  return createApp(createSeedTasks());
}

describe("priority API support", () => {
  it("filters tasks by priority", async () => {
    const response = await request(makeApp())
      .get("/api/tasks?priority=high")
      .expect(200);

    expect(response.body.tasks.map((task: { id: string }) => task.id)).toEqual([
      "task-101",
      "task-102",
    ]);
  });

  it("combines priority with another filter", async () => {
    const response = await request(makeApp())
      .get("/api/tasks?priority=low&status=done&q=archive")
      .expect(200);

    expect(response.body.tasks.map((task: { id: string }) => task.id)).toEqual([
      "task-106",
    ]);
  });

  it("rejects an unknown priority filter", async () => {
    const response = await request(makeApp())
      .get("/api/tasks?priority=urgent")
      .expect(400);

    expect(response.body.error).toContain("Unknown priority");
  });

  it("updates only the priority when that is all that is supplied", async () => {
    const response = await request(makeApp())
      .patch("/api/tasks/task-101")
      .send({ priority: "low" })
      .expect(200);

    expect(response.body.task).toMatchObject({
      id: "task-101",
      title: "Audit onboarding flow",
      status: "todo",
      priority: "low",
    });
  });

  it("rejects an invalid priority without changing the task", async () => {
    const app = makeApp();

    await request(app)
      .patch("/api/tasks/task-101")
      .send({ title: "Renamed task", priority: "urgent" })
      .expect(422);

    const response = await request(app).get("/api/tasks").expect(200);
    const task = response.body.tasks.find(
      (candidate: { id: string }) => candidate.id === "task-101",
    );

    expect(task).toMatchObject({
      title: "Audit onboarding flow",
      priority: "high",
    });
  });
});
