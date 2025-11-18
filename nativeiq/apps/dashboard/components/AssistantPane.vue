<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";

type Message = {
  id: string;
  role: "native" | "user" | "teammate";
  authorName: string;
  initials: string;
  text: string;
  timestamp: string;
  highlight?: boolean;
};

const props = withDefaults(
  defineProps<{
    company?: string;
    messages: Message[];
    isGenerating?: boolean;
    channelName?: string;
    channelMeta?: string;
    memberCount?: number;
  }>(),
  {
    channelName: "Team Chat",
    channelMeta: "@Native updates",
    memberCount: 4
  }
);

const emit = defineEmits<{ (e: "send", payload: string): void }>();

const inputValue = ref("");
const scroller = ref<HTMLElement | null>(null);

const subtitle = computed(() => `${props.memberCount} members · ${props.channelMeta}`);

const scrollToBottom = () => {
  if (!scroller.value) {
    return;
  }
  scroller.value.scrollTo({
    top: scroller.value.scrollHeight,
    behavior: "smooth"
  });
};

watch(
  () => props.messages.length,
  () => {
    nextTick(scrollToBottom);
  },
  { immediate: true }
);

const handleSubmit = () => {
  if (!inputValue.value.trim()) {
    return;
  }
  emit("send", inputValue.value.trim());
  inputValue.value = "";
};

const bubbleClass = (message: Message) => {
  if (message.highlight) {
    return "assistant-pane__bubble assistant-pane__bubble--highlight";
  }
  if (message.role === "native") {
    return "assistant-pane__bubble assistant-pane__bubble--native";
  }
  if (message.role === "user") {
    return "assistant-pane__bubble assistant-pane__bubble--user";
  }
  return "assistant-pane__bubble";
};

const timeLabel = (timestamp: string) =>
  new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

// TODO: Support attachments + commands once MCP actions ship for Vue dashboard.
</script>

<template>
  <section class="assistant-pane card-surface">
    <header class="assistant-pane__header">
      <div class="assistant-pane__meta">
        <div class="assistant-pane__badge">Native</div>
        <h2>{{ props.channelName || `Native Copilot for ${props.company || "your org"}` }}</h2>
        <span>{{ subtitle }}</span>
      </div>
      <div class="assistant-pane__actions">
        <button class="ghost-button" type="button" aria-label="Search channel">Search</button>
        <button class="ghost-button" type="button" aria-label="Channel settings">⋯</button>
      </div>
    </header>

    <div ref="scroller" class="assistant-pane__messages">
      <article v-for="message in props.messages" :key="message.id" class="assistant-pane__message">
        <div class="assistant-pane__avatar">{{ message.initials }}</div>
        <div :class="bubbleClass(message)">
          <header>
            <span>{{ message.authorName }}</span>
            <span class="text-muted">{{ timeLabel(message.timestamp) }}</span>
          </header>
          <p>{{ message.text }}</p>
        </div>
      </article>
      <article v-if="props.isGenerating" class="assistant-pane__message">
        <div class="assistant-pane__avatar">N</div>
        <div class="assistant-pane__bubble assistant-pane__message--typing">
          <span class="typing-dot" />
          <span class="typing-dot" />
          <span class="typing-dot" />
        </div>
      </article>
    </div>

    <form class="assistant-pane__form" @submit.prevent="handleSubmit">
      <textarea
        v-model="inputValue"
        rows="3"
        placeholder="Ask Native to prep an update, route a task, or explain a risk…"
      />
      <div class="assistant-pane__form-actions">
        <button class="ghost-button" type="button">Insert context</button>
        <button type="submit">Send to Native</button>
      </div>
    </form>
  </section>
</template>
