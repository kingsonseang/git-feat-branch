// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import App from "./App";
import { installTaskApiMock } from "../test/mockApi";
import { makeTask } from "../test/fixtures";

afterEach(() => {
  cleanup();
});

const tasks = [
  makeTask({
    id: "task-1",
    title: "Audit onboarding flow",
    description: "Document the checklist.",
    status: "todo",
  }),
  makeTask({
    id: "task-2",
    title: "Draft release notes",
    description: "Summarize the release.",
    status: "done",
  }),
];

describe("App", () => {
  it("loads tasks and filters them by status", async () => {
    installTaskApiMock(tasks);
    const user = userEvent.setup();

    render(<App />);

    expect(await screen.findByText("Audit onboarding flow")).toBeVisible();
    expect(screen.getByText("Draft release notes")).toBeVisible();

    await user.selectOptions(screen.getByLabelText("Status filter"), "done");

    expect(screen.queryByText("Audit onboarding flow")).not.toBeInTheDocument();
    expect(screen.getByText("Draft release notes")).toBeVisible();
    expect(screen.getByText("1 of 2 tasks")).toBeVisible();
  });

  it("edits a task title", async () => {
    installTaskApiMock(tasks);
    const user = userEvent.setup();

    render(<App />);

    await user.click(
      await screen.findByRole("button", { name: "Audit onboarding flow" }),
    );
    const input = screen.getByLabelText("Task title");
    await user.clear(input);
    await user.type(input, "Audit the onboarding flow");
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(
      await screen.findByRole("button", {
        name: "Audit the onboarding flow",
      }),
    ).toBeVisible();
  });

  it("rejects a blank title before calling the API", async () => {
    const api = installTaskApiMock(tasks);
    const user = userEvent.setup();

    render(<App />);

    await user.click(
      await screen.findByRole("button", { name: "Audit onboarding flow" }),
    );
    await user.clear(screen.getByLabelText("Task title"));
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(
      screen.getByText("Task title cannot be empty."),
    ).toBeInTheDocument();
    expect(
      api.fetchMock.mock.calls.some(([, init]) => init?.method === "PATCH"),
    ).toBe(false);
  });

  it("shows an empty state when no tasks match", async () => {
    installTaskApiMock(tasks);
    const user = userEvent.setup();

    render(<App />);

    await screen.findByText("Audit onboarding flow");
    await user.type(screen.getByLabelText("Search"), "no such task");

    expect(
      screen.getByText("No tasks match the current filters."),
    ).toBeVisible();
  });
});
