import { useState, type ChangeEvent } from "react";
import {
  TASK_PRIORITIES,
  TASK_PRIORITY_LABELS,
  TASK_STATUSES,
  TASK_STATUS_LABELS,
  type Task,
  type TaskPriority,
  type TaskStatus,
  type TaskUpdate,
} from "../../shared/types";

interface TaskRowProps {
  task: Task;
  onUpdate: (id: string, patch: TaskUpdate) => Promise<void>;
}

export function TaskRow({ task, onUpdate }: TaskRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(task.title);
  const [formError, setFormError] = useState<string | null>(null);

  function beginEditing() {
    setDraftTitle(task.title);
    setFormError(null);
    setIsEditing(true);
  }

  function cancelEditing() {
    setDraftTitle(task.title);
    setFormError(null);
    setIsEditing(false);
  }

  async function saveTitle() {
    const nextTitle = draftTitle.trim();

    if (!nextTitle) {
      setFormError("Task title cannot be empty.");
      return;
    }

    try {
      await onUpdate(task.id, { title: nextTitle });
      setIsEditing(false);
      setFormError(null);
    } catch {
      // The board-level banner reports the API error; keep the editor open.
    }
  }

  async function updateStatus(event: ChangeEvent<HTMLSelectElement>) {
    try {
      await onUpdate(task.id, {
        status: event.target.value as TaskStatus,
      });
    } catch {
      // The board-level banner reports the API error.
    }
  }

  async function updatePriority(event: ChangeEvent<HTMLSelectElement>) {
    try {
      await onUpdate(task.id, {
        priority: event.target.value as TaskPriority,
      });
    } catch {
      // The board-level banner reports the API error.
    }
  }

  return (
    <li className="task-row">
      <div className="task-main">
        {isEditing ? (
          <form
            className="title-editor"
            onSubmit={(event) => {
              event.preventDefault();
              void saveTitle();
            }}
          >
            <label className="sr-only" htmlFor={`title-${task.id}`}>
              Task title
            </label>
            <input
              id={`title-${task.id}`}
              value={draftTitle}
              autoFocus
              onChange={(event) => setDraftTitle(event.target.value)}
            />
            <button type="submit" className="button-primary">
              Save
            </button>
            <button
              type="button"
              className="button-quiet"
              onClick={cancelEditing}
            >
              Cancel
            </button>
          </form>
        ) : (
          <button
            type="button"
            className="title-button"
            onClick={beginEditing}
          >
            {task.title}
          </button>
        )}

        {formError ? (
          <p className="inline-error" role="alert">
            {formError}
          </p>
        ) : null}

        <p className="task-description">{task.description}</p>
      </div>

      <div className="task-meta">
        <label className="field field-compact">
          <span>Status</span>
          <select
            aria-label={`Status for ${task.title}`}
            value={task.status}
            onChange={(event) => void updateStatus(event)}
          >
            {TASK_STATUSES.map((status) => (
              <option key={status} value={status}>
                {TASK_STATUS_LABELS[status]}
              </option>
            ))}
          </select>
        </label>

        <label className="field field-compact">
          <span>Priority</span>
          <select
            aria-label={`Priority for ${task.title}`}
            value={task.priority}
            onChange={(event) => void updatePriority(event)}
          >
            {TASK_PRIORITIES.map((priority) => (
              <option key={priority} value={priority}>
                {TASK_PRIORITY_LABELS[priority]}
              </option>
            ))}
          </select>
        </label>
      </div>
    </li>
  );
}
