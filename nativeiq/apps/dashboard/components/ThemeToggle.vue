<script setup lang="ts">
import { computed } from "vue";
import { useTheme } from "@/composables/useTheme";

const { theme, toggleTheme } = useTheme();

const label = computed(() => (theme.value === "dark" ? "Dark mode" : "Light mode"));
</script>

<template>
  <button class="theme-toggle" type="button" @click="toggleTheme">
    <span class="theme-toggle__icon" aria-hidden="true">
      <svg v-if="theme === 'dark'" viewBox="0 0 24 24" role="presentation">
        <path
          d="M21 14.5A9.4 9.4 0 0 1 9.5 3 9.5 9.5 0 1 0 21 14.5Z"
          fill="currentColor"
          opacity="0.86"
        />
      </svg>
      <svg v-else viewBox="0 0 24 24" role="presentation">
        <circle cx="12" cy="12" r="5" fill="currentColor" opacity="0.95" />
        <g stroke="currentColor" stroke-width="1.6">
          <line x1="12" y1="1.5" x2="12" y2="4.5" />
          <line x1="12" y1="19.5" x2="12" y2="22.5" />
          <line x1="1.5" y1="12" x2="4.5" y2="12" />
          <line x1="19.5" y1="12" x2="22.5" y2="12" />
          <line x1="4.2" y1="4.2" x2="6.4" y2="6.4" />
          <line x1="17.6" y1="17.6" x2="19.8" y2="19.8" />
          <line x1="4.2" y1="19.8" x2="6.4" y2="17.6" />
          <line x1="17.6" y1="6.4" x2="19.8" y2="4.2" />
        </g>
      </svg>
    </span>
    <span>{{ label }}</span>
  </button>
</template>
