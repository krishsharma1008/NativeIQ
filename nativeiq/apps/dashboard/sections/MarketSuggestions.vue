<script setup lang="ts">
import { computed } from "vue";
import type { Insight } from "@nativeiq/types";

const props = defineProps<{
  company: string;
  insights: Insight[];
}>();

const recommendations = computed(() =>
  props.insights.slice(0, 3).map((insight, index) => ({
    id: `${insight.id}-${index}`,
    title: `Hypothesis #${index + 1}`,
    summary: insight.summary,
    focus: insight.type,
    action: insight.suggestedActions?.[0]?.label ?? "Inspect idea",
    impact: insight.impact
  }))
);

// TODO: Replace derived suggestions with the market experimentation engine data.
</script>

<template>
  <section class="card-surface section-block">
    <div class="section-heading">
      <div>
        <p class="eyebrow text-muted">Market experiments</p>
        <h3>{{ props.company || "Native" }} opportunities</h3>
      </div>
      <button class="ghost-button" type="button">Add experiment</button>
    </div>

    <ul class="stacked-list">
      <li v-for="rec in recommendations" :key="rec.id">
        <div>
          <strong>{{ rec.title }}</strong>
          <p class="muted">{{ rec.summary }}</p>
        </div>
        <div class="market-meta">
          <span class="pill muted-pill">{{ rec.focus }}</span>
          <span class="pill pill--primary">{{ rec.impact }}</span>
          <button class="ghost-button" type="button">{{ rec.action }}</button>
        </div>
      </li>
    </ul>
  </section>
</template>
