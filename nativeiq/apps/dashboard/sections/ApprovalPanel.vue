<script setup lang="ts">
import type { Approval } from "@nativeiq/types";

const props = defineProps<{ approvals: Approval[] }>();

const minutesAgo = (timestamp: string) => {
  const diff = Date.now() - new Date(timestamp).getTime();
  return Math.max(1, Math.round(diff / (1000 * 60)));
};

// TODO: Wire approval actions (approve / reject) to the workflow API.
</script>

<template>
  <section class="card-surface section-block">
    <div class="section-heading">
      <div>
        <p class="eyebrow text-muted">Approvals</p>
        <h3>Items waiting for you</h3>
      </div>
      <button class="ghost-button" type="button">View history</button>
    </div>

    <ul class="stacked-list stacked-list--dense">
      <li v-for="approval in props.approvals" :key="approval.id">
        <div>
          <strong>{{ approval.summary }}</strong>
          <p class="muted">
            Requested by {{ approval.requester }} • {{ minutesAgo(approval.requestedAt) }}m ago • SLA
            {{ approval.slaMinutes }}m
          </p>
        </div>
        <div class="approval-actions">
          <button class="ghost-button" type="button">Approve</button>
          <button class="ghost-button destructive" type="button">Decline</button>
        </div>
      </li>
    </ul>
  </section>
</template>
