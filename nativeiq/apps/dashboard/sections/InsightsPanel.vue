<script setup lang="ts">
import { computed, ref } from "vue";
import type { Insight } from "@nativeiq/types";

const props = defineProps<{
  company: string;
  insights: Insight[];
}>();

const indicatorClass = (type: Insight["type"]) => {
  switch (type) {
    case "risk":
      return "insight-indicator insight-indicator--risk";
    case "decision":
      return "insight-indicator insight-indicator--decision";
    default:
      return "insight-indicator insight-indicator--neutral";
  }
};

const timeAgo = (timestamp?: string) => {
  if (!timestamp) return "just now";
  const diffMinutes = Math.round((Date.now() - new Date(timestamp).getTime()) / (1000 * 60));
  if (diffMinutes <= 1) return "just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const hours = Math.round(diffMinutes / 60);
  return `${hours}h ago`;
};

const pageSize = 2;
const currentPage = ref(0);

const pages = computed(() => {
  const chunks: Insight[][] = [];
  for (let i = 0; i < props.insights.length; i += pageSize) {
    chunks.push(props.insights.slice(i, i + pageSize));
  }
  return chunks;
});

const setPage = (index: number) => {
  currentPage.value = index;
};

const canPage = computed(() => pages.value.length > 1);

// TODO: Add filters once teams can slice insights by role or impact.
</script>

<template>
  <section class="card-surface section-block insights-panel">
    <div class="section-heading">
      <div>
        <p class="eyebrow text-muted">Key Insights</p>
        <h3>What {{ props.company || "your team" }} should know</h3>
      </div>
      <div class="insight-carousel__actions">
        <button class="ghost-button" type="button" :disabled="!canPage" @click="setPage((currentPage - 1 + pages.length) % pages.length)">
          ←
        </button>
        <button class="ghost-button" type="button" :disabled="!canPage" @click="setPage((currentPage + 1) % pages.length)">
          →
        </button>
      </div>
    </div>

    <div class="insight-carousel">
      <div class="insight-carousel__track" :style="{ transform: `translateX(-${currentPage * 100}%)` }">
        <div class="insight-carousel__page" v-for="(page, pageIndex) in pages" :key="`page-${pageIndex}`">
          <ul class="insight-stack">
            <li v-for="insight in page" :key="insight.id">
              <div :class="indicatorClass(insight.type)" aria-hidden="true" />
              <div class="insight-stack__content">
                <div class="insight-stack__header">
                  <h4>{{ insight.title }}</h4>
                  <span class="text-muted">{{ timeAgo(insight.sources?.[0]?.timestamp) }}</span>
                </div>
                <p>{{ insight.summary }}</p>
                <p class="muted">Owner: {{ insight.owner }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div v-if="canPage" class="insight-carousel__dots">
      <button
        v-for="(page, index) in pages"
        :key="`dot-${index}`"
        type="button"
        :class="['insight-carousel__dot', currentPage === index ? 'insight-carousel__dot--active' : '']"
        @click="setPage(index)"
        aria-label="Show more insights"
      />
    </div>
  </section>
</template>
