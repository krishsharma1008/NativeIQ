<script setup lang="ts">
import { computed } from "vue";
import type { Task } from "@nativeiq/types";

const props = defineProps<{ tasks: Task[] }>();

const actions = computed(() =>
  props.tasks.map((task) => ({
    id: task.id,
    label: task.title,
    intent: task.priority
  }))
);
</script>

<template>
  <section class="card-surface section-block quick-actions">
    <div class="section-heading">
      <div>
        <p class="eyebrow text-muted">Quick Actions</p>
        <h3>Common tasks and shortcuts</h3>
      </div>
      <button class="ghost-button" type="button">View library</button>
    </div>
    <div class="quick-actions__grid">
      <button v-for="action in actions" :key="action.id" type="button">
        {{ action.label }}
      </button>
    </div>
  </section>
</template>
