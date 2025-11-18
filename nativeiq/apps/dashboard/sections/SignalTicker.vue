<script setup lang="ts">
import { computed } from "vue";
import type { Insight, SlaMetric } from "@nativeiq/types";

const props = defineProps<{
  insights: Insight[];
  metrics: SlaMetric[];
}>();

const formatDelta = (metric: SlaMetric) => {
  const diff = metric.value - metric.target;
  const prefix = diff >= 0 ? "+" : "";
  return `${prefix}${diff.toFixed(metric.unit === "%" ? 2 : 1)}${metric.unit}`;
};

const baseItems = computed(() => {
  const metricItems = props.metrics.slice(0, 2).map((metric) => ({
    id: metric.label,
    label: metric.label,
    detail: `${metric.value}${metric.unit} (${formatDelta(metric)})`,
    intent: metric.value > metric.target ? "alert" : "good"
  }));

  const insightItems = props.insights.slice(0, 3).map((insight) => ({
    id: insight.id,
    label: insight.type === "risk" ? "Risk" : "Insight",
    detail: insight.title,
    intent: insight.type === "risk" ? "alert" : "info"
  }));

  const fallback = [
    {
      id: "native-on",
      label: "Native",
      detail: "Monitoring revenue, retention, and SLA targets in real time.",
      intent: "info"
    }
  ];

  return [...metricItems, ...insightItems, ...fallback];
});

const tickerItems = computed(() => [...baseItems.value, ...baseItems.value]);
</script>

<template>
  <section class="card-surface signal-ticker" aria-label="Live signals">
    <div class="signal-ticker__mask">
      <div class="signal-ticker__track">
        <article
          v-for="(item, index) in tickerItems"
          :key="`${item.id}-${index}`"
          :class="['signal-pill', `signal-pill--${item.intent}`]"
        >
          <span>{{ item.label }}</span>
          <p>{{ item.detail }}</p>
        </article>
      </div>
    </div>
  </section>
</template>
