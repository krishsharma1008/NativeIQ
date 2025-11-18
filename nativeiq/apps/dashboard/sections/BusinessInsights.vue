<script setup lang="ts">
import { computed } from "vue";
import type { Insight, SlaMetric } from "@nativeiq/types";

const props = defineProps<{
  company: string;
  insights: Insight[];
  metrics: SlaMetric[];
}>();

const highlightMetric = computed(() => {
  if (!props.metrics.length) {
    return null;
  }
  return [...props.metrics].sort((a, b) => Math.abs(b.value - b.target) - Math.abs(a.value - a.target))[0];
});

const cards = computed(() => {
  const topRisk = props.insights.find((insight) => insight.impact === "critical" || insight.type === "risk");
  const trending = props.insights.find((insight) => insight.type === "trend" || insight.type === "summary");
  const decision = props.insights.find((insight) => insight.type === "decision");

  return [
    {
      id: "card-risks",
      label: "Risk Radar",
      title: topRisk?.title ?? "No blockers detected",
      detail:
        topRisk?.summary ??
        "Native is not tracking active blockers right now. Keep an eye on finance + GTM velocity for early signals.",
      accent: "risk"
    },
    {
      id: "card-growth",
      label: "Growth Pulse",
      title: trending?.title ?? "Momentum steady",
      detail:
        trending?.summary ??
        "Acquisition is stable this week. Use this calm cycle to tidy onboarding experiments before next push.",
      accent: "growth"
    },
    {
      id: "card-experiment",
      label: "Next Move",
      title: decision?.title ?? "Put experimentation on autopilot",
      detail:
        decision?.summary ??
        "Queue two small experiments touching activation & retention. Native can auto-score outcomes overnight.",
      accent: "focus"
    },
    {
      id: "card-metric",
      label: highlightMetric.value ? highlightMetric.value.label : "Service Level",
      title: highlightMetric.value
        ? `${highlightMetric.value.value}${highlightMetric.value.unit} vs ${highlightMetric.value.target}${highlightMetric.value.unit}`
        : "No SLA variance",
      detail:
        highlightMetric.value && highlightMetric.value.value > highlightMetric.value.target
          ? "Performance slipped past target. Native suggests reinforcing owning pod with a health stand-up."
          : "You're beating target. Document what worked and ship it to the playbook."
    }
  ];
});
</script>

<template>
  <section class="card-surface section-block business-deck">
    <div class="section-heading">
      <div>
        <p class="eyebrow text-muted">Business Insights</p>
        <h3>One-screen pulse for {{ props.company || "Native" }}</h3>
      </div>
      <button class="ghost-button" type="button">Download briefing</button>
    </div>

    <div class="business-deck__grid" role="list">
      <article v-for="card in cards" :key="card.id" :class="['business-card', `business-card--${card.accent ?? 'neutral'}`]" role="listitem">
        <header>
          <span>{{ card.label }}</span>
        </header>
        <h4>{{ card.title }}</h4>
        <p>{{ card.detail }}</p>
      </article>
    </div>
  </section>
</template>
