<script setup lang="ts">
import { computed } from "vue";
import ThemeToggle from "./ThemeToggle.vue";

const props = defineProps<{
  companyName: string;
  dateLabel: string;
  pendingInvites: number;
}>();

const emit = defineEmits<{ (e: "update:companyName", payload: string): void }>();

const heading = computed(() => `Native ${props.companyName.trim() || "Team"}`);

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit("update:companyName", target.value);
};

// TODO: Replace static helper text with live summary pulled from the assistant context window.
</script>

<template>
  <header class="dashboard-header card-surface">
    <div class="header-copy">
      <p class="eyebrow text-muted">{{ props.dateLabel }}</p>
      <div class="title-row">
        <h1>{{ heading }}</h1>
        <span v-if="props.pendingInvites" class="pill muted-pill">Invites pending: {{ props.pendingInvites }}</span>
      </div>
      <p class="muted">
        {{ heading }} command center keeps approvals, insights, and assistant moves stitched together.
      </p>
    </div>
    <div class="header-actions">
      <label class="company-field">
        <span>Company name</span>
        <input
          :value="props.companyName"
          name="company-name"
          maxlength="42"
          placeholder="Acme Labs"
          @input="handleInput"
        />
      </label>
      <ThemeToggle />
    </div>
  </header>
</template>
