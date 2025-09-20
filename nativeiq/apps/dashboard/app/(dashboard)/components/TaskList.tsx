"use client";

import type { Task } from "@nativeiq/types";
import { GlassCard, Badge, Button } from "@nativeiq/ui";
import { formatRelativeTime } from "@nativeiq/utils";

const statusCopy: Record<Task["state"], { label: string; tone: "warning" | "muted" | "accent" | "critical" | "positive" }> = {
  open: { label: "Open", tone: "muted" },
  in_progress: { label: "In progress", tone: "accent" },
  done: { label: "Done", tone: "positive" as const },
  blocked: { label: "Blocked", tone: "critical" }
};

export function TaskList({ tasks }: { tasks: Task[] }) {
  return (
    <GlassCard
      title="My Tasks"
      caption="Synced from Slack, MCP Tasks, and connected systems"
      actionSlot={<Button variant="ghost">View all</Button>}
      footer={<span>Why you see this: assigned to you or automation fallback</span>}
    >
      <ul className="task-list" role="list">
        {tasks.map((task) => (
          <li key={task.id} className="task-list__item">
            <div>
              <div className="task-list__title">{task.title}</div>
              <div className="task-list__meta">
                <Badge tone={statusCopy[task.state].tone}>{statusCopy[task.state].label}</Badge>
                <span>Priority {task.priority.toUpperCase()}</span>
                {task.dueAt && <span>Due {formatRelativeTime(task.dueAt)}</span>}
              </div>
            </div>
            <Button variant="ghost">Open thread</Button>
          </li>
        ))}
      </ul>
    </GlassCard>
  );
}
