import type { Task } from "../shared/types";

export function createSeedTasks(): Task[] {
  return [
    {
      id: "task-101",
      title: "Audit onboarding flow",
      description:
        "Document drop-off points in the checklist for new hires.",
      status: "todo",
      priority: "high",
      updatedAt: "2026-10-02T09:15:00.000Z",
    },
    {
      id: "task-102",
      title: "Prepare Q3 roadmap",
      description:
        "Outline milestones for the onboarding checklist and hiring plan.",
      status: "in_progress",
      priority: "high",
      updatedAt: "2026-10-03T14:40:00.000Z",
    },
    {
      id: "task-103",
      title: "Draft release notes",
      description: "Summarize the 0.2 release for customers.",
      status: "done",
      priority: "low",
      updatedAt: "2026-10-05T11:05:00.000Z",
    },
    {
      id: "task-104",
      title: "Fix empty state layout",
      description: "Align the placeholder illustration on small screens.",
      status: "todo",
      priority: "medium",
      updatedAt: "2026-10-07T16:20:00.000Z",
    },
    {
      id: "task-105",
      title: "Review analytics dashboard",
      description: "Validate weekly active metrics with product.",
      status: "in_progress",
      priority: "medium",
      updatedAt: "2026-10-09T08:30:00.000Z",
    },
    {
      id: "task-106",
      title: "Archive legacy reports",
      description: "Move old exports to cold storage and verify access.",
      status: "done",
      priority: "low",
      updatedAt: "2026-10-10T13:00:00.000Z",
    },
  ];
}
