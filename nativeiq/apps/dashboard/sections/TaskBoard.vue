<script setup lang="ts">
import type { Task } from "@nativeiq/types";

const props = defineProps<{ tasks: Task[] }>();

const priorityLabel = (priority: Task["priority"]) => {
  switch (priority) {
    case "p0":
      return "P0";
    case "p1":
      return "P1";
    default:
      return "P2";
  }
};

const stateCopy: Record<Task["state"], string> = {
  open: "Open",
  in_progress: "In progress",
  blocked: "Blocked",
  done: "Done"
};

// TODO: Replace mock due dates with timeline data from the workflow service.
</script>

<template>
  <section class="card-surface section-block">
    <div class="section-heading">
      <div>
        <p class="eyebrow text-muted">Task queue</p>
        <h3>Coordinated moves</h3>
      </div>
      <button class="ghost-button" type="button">Export list</button>
    </div>

    <ul class="stacked-list">
      <li v-for="task in props.tasks" :key="task.id">
        <div>
          <strong>{{ task.title }}</strong>
          <p class="muted">
            {{ stateCopy[task.state] }} • Due
            {{ task.dueAt ? new Date(task.dueAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "TBD" }}
          </p>
        </div>
        <div class="task-meta">
          <span class="pill muted-pill">{{ task.assignee }}</span>
          <span class="pill pill--primary">{{ priorityLabel(task.priority) }}</span>
        </div>
      </li>
    </ul>
  </section>
</template>
