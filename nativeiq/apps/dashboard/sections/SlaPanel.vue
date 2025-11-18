<script setup lang="ts">
import type { SlaMetric } from "@nativeiq/types";

const props = defineProps<{ metrics: SlaMetric[] }>();

const delta = (metric: SlaMetric) => {
  const difference = metric.value - metric.target;
  const formatted = `${difference > 0 ? "+" : ""}${difference.toFixed(metric.unit === "%" ? 2 : 1)}${metric.unit}`;
  return {
    text: formatted,
    intent: difference > 0 ? "delta--negative" : "delta--positive"
  };
};

// TODO: Pull benchmarks from SLA service to render contextual warnings here.
</script>

<template>
  <section class="card-surface section-block">
    <div class="section-heading">
      <div>
        <p class="eyebrow text-muted">SLA pulse</p>
        <h3>Team promise tracking</h3>
      </div>
      <button class="ghost-button" type="button">Adjust targets</button>
    </div>

    <div class="sla-grid">
      <article v-for="metric in props.metrics" :key="metric.label" class="sla-tile">
        <p class="muted">{{ metric.label }}</p>
        <div class="sla-value">
          <strong>{{ metric.value }}{{ metric.unit }}</strong>
          <span :class="['delta-pill', delta(metric).intent]">
            {{ delta(metric).text }} vs target {{ metric.target }}{{ metric.unit }}
          </span>
        </div>
      </article>
    </div>
  </section>
</template>
