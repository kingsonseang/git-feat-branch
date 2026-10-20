// @vitest-environment jsdom
import {
  cleanup,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
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
    priority: "high",
  }),
  makeTask({
    id: "task-2",
    title: "Draft release notes",
    description: "Summarize the release.",
    status: "todo",
    priority: "low",
  }),
  makeTask({
    id: "task-3",
    title: "Review dashboard",
    description: "Check the metrics.",
    status: "in_progress",
    priority: "high",
  }),
];

describe("priority filters and editing", () => {
  it("filters by priority and status together", async () => {
    installTaskApiMock(tasks);
    const user = userEvent.setup();

    render(<App />);

    await screen.findByText("Audit onboarding flow");
    await user.selectOptions(
      screen.getByLabelText("Priority filter"),
      "high",
    );
    await user.selectOptions(screen.getByLabelText("Status filter"), "todo");

    expect(screen.getByText("Audit onboarding flow")).toBeVisible();
    expect(screen.queryByText("Draft release notes")).not.toBeInTheDocument();
    expect(screen.queryByText("Review dashboard")).not.toBeInTheDocument();
    expect(screen.getByText("1 of 3 tasks")).toBeVisible();
  });

  it("keeps active filters when an edit removes the task from the view", async () => {
    installTaskApiMock(tasks);
    const user = userEvent.setup();

    render(<App />);

    await screen.findByText("Audit onboarding flow");
    await user.selectOptions(
      screen.getByLabelText("Priority filter"),
      "high",
    );
    await user.selectOptions(screen.getByLabelText("Status filter"), "todo");
    await user.type(screen.getByLabelText("Search"), "audit");

    expect(screen.getByText("1 of 3 tasks")).toBeVisible();

    await user.selectOptions(
      screen.getByLabelText("Priority for Audit onboarding flow"),
      "low",
    );

    await waitFor(() => {
      expect(
        screen.queryByText("Audit onboarding flow"),
      ).not.toBeInTheDocument();
    });

    expect(screen.getByLabelText<HTMLInputElement>("Search").value).toBe(
      "audit",
    );
    expect(screen.getByLabelText<HTMLSelectElement>("Status filter").value).toBe(
      "todo",
    );
    expect(
      screen.getByLabelText<HTMLSelectElement>("Priority filter").value,
    ).toBe("high");
    expect(screen.getByText("0 of 3 tasks")).toBeVisible();

    await user.click(screen.getByRole("button", { name: "Clear filters" }));

    expect(screen.getByText("Audit onboarding flow")).toBeVisible();
    expect(screen.getByText("Draft release notes")).toBeVisible();
    expect(screen.getByText("Review dashboard")).toBeVisible();
    expect(screen.getByLabelText<HTMLInputElement>("Search").value).toBe("");
    expect(screen.getByText("3 of 3 tasks")).toBeVisible();
  });
});
