import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "./app";
import { createSeedTasks } from "./seed";

function makeApp() {
  return createApp(createSeedTasks());
}

describe("GET /api/tasks", () => {
  it("returns all seeded tasks", async () => {
    const response = await request(makeApp()).get("/api/tasks").expect(200);

    expect(response.body.total).toBe(6);
    expect(response.body.tasks).toHaveLength(6);
  });

  it("filters by status", async () => {
    const response = await request(makeApp())
      .get("/api/tasks?status=done")
      .expect(200);

    expect(response.body.total).toBe(2);
    expect(
      response.body.tasks.every(
        (task: { status: string }) => task.status === "done",
      ),
    ).toBe(true);
  });

  it("filters by query", async () => {
    const response = await request(makeApp())
      .get("/api/tasks?q=roadmap")
      .expect(200);

    expect(response.body.tasks.map((task: { id: string }) => task.id)).toEqual([
      "task-102",
    ]);
  });

  it("rejects an unknown status filter", async () => {
    const response = await request(makeApp())
      .get("/api/tasks?status=blocked")
      .expect(400);

    expect(response.body.error).toContain("Unknown status");
  });
});

describe("PATCH /api/tasks/:id", () => {
  it("updates the title and status of a task", async () => {
    const app = makeApp();
    const response = await request(app)
      .patch("/api/tasks/task-101")
      .send({ title: "Audit the onboarding flow", status: "in_progress" })
      .expect(200);

    expect(response.body.task).toMatchObject({
      id: "task-101",
      title: "Audit the onboarding flow",
      status: "in_progress",
    });
  });

  it("rejects an invalid status", async () => {
    const response = await request(makeApp())
      .patch("/api/tasks/task-101")
      .send({ status: "blocked" })
      .expect(422);

    expect(response.body.error).toContain("Status must be one of");
  });

  it("returns 404 for an unknown task", async () => {
    const response = await request(makeApp())
      .patch("/api/tasks/missing")
      .send({ title: "Nothing" })
      .expect(404);

    expect(response.body.error).toContain("was not found");
  });
});
