<script setup lang="ts">
import { computed } from "vue";
import type { SlaMetric } from "@nativeiq/types";

const props = defineProps<{ metrics: SlaMetric[] }>();

const decorated = computed(() =>
  props.metrics.map((metric) => {
    const delta = metric.value - metric.target;
    const positive = delta >= 0;
    return {
      ...metric,
      delta,
      label: metric.label,
      formattedValue: `${metric.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}${metric.unit}`,
      trend: positive ? "up" : "down",
      deltaLabel: `${positive ? "+" : ""}${delta.toFixed(metric.unit === "%" ? 2 : 1)}${metric.unit}`
    };
  })
);
</script>

<template>
  <section class="metrics-row">
    <article v-for="metric in decorated" :key="metric.label" class="metric-card card-surface">
      <div class="metric-card__header">
        <p class="eyebrow text-muted">{{ metric.label }}</p>
        <span :class="['metric-card__trend', metric.trend === 'up' ? 'metric-card__trend--up' : 'metric-card__trend--down']">
          {{ metric.trend === "up" ? "↑" : "↓" }} {{ metric.deltaLabel }}
        </span>
      </div>
      <strong class="metric-card__value">{{ metric.formattedValue }}</strong>
    </article>
  </section>
</template>
