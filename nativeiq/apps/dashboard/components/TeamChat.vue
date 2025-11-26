<script setup lang="ts">
import { ref, watch, nextTick, computed } from "vue";
import type { Channel, Message } from "@/composables/useChat";

const props = defineProps<{
  channel: Channel | null;
  messages: Message[];
  members: { id: string; full_name: string | null }[];
  currentUserId?: string;
  loading?: boolean;
  sending?: boolean;
}>();

const emit = defineEmits<{
  (e: "send", content: string): void;
}>();

const inputValue = ref("");
const scroller = ref<HTMLElement | null>(null);

const channelTitle = computed(() => props.channel?.name || "Chat");
const channelDescription = computed(() => props.channel?.description || "");
const isAIChannel = computed(() => props.channel?.type === "ai-assistant");
const memberCount = computed(() => props.members.length);

const scrollToBottom = () => {
  if (!scroller.value) return;
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
  if (!inputValue.value.trim() || props.sending) return;
  emit("send", inputValue.value.trim());
  inputValue.value = "";
};

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    handleSubmit();
  }
};

const getInitials = (name: string | null | undefined): string => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

const formatTime = (timestamp: string): string => {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
};

const getAuthorName = (msg: Message): string => {
  if (msg.is_ai_response) return "Native AI";
  if (msg.author?.full_name) return msg.author.full_name;
  if (msg.author_id === props.currentUserId) return "You";
  return "Unknown";
};

const isOwnMessage = (msg: Message): boolean => {
  return msg.author_id === props.currentUserId && !msg.is_ai_response;
};

const bubbleClass = (msg: Message): string => {
  if (msg.is_ai_response) return "chat-bubble chat-bubble--ai";
  if (isOwnMessage(msg)) return "chat-bubble chat-bubble--own";
  return "chat-bubble";
};
</script>

<template>
  <section class="team-chat card-surface">
    <!-- Header -->
    <header class="team-chat__header">
      <div class="team-chat__meta">
        <span v-if="isAIChannel" class="team-chat__icon team-chat__icon--ai">✨</span>
        <span v-else class="team-chat__icon">#</span>
        <div>
          <h2>{{ channelTitle }}</h2>
          <span class="text-muted">
            {{ isAIChannel ? "AI-powered assistant" : `${memberCount} members` }}
          </span>
        </div>
      </div>
      <div class="team-chat__actions">
        <button class="ghost-button" type="button">Search</button>
        <button class="ghost-button" type="button">⋯</button>
      </div>
    </header>

    <!-- Messages -->
    <div ref="scroller" class="team-chat__messages">
      <!-- Loading state -->
      <div v-if="loading" class="team-chat__loading">
        <div class="loading-spinner" />
        <span>Loading messages...</span>
      </div>

      <!-- Empty state -->
      <div v-else-if="messages.length === 0" class="team-chat__empty">
        <div class="empty-icon">{{ isAIChannel ? "✨" : "💬" }}</div>
        <h3>{{ isAIChannel ? "Start a conversation with Native AI" : "No messages yet" }}</h3>
        <p class="text-muted">
          {{ isAIChannel 
            ? "Ask questions, get insights, or request help with tasks."
            : "Be the first to send a message in this channel."
          }}
        </p>
      </div>

      <!-- Messages list -->
      <template v-else>
        <article
          v-for="msg in messages"
          :key="msg.id"
          class="team-chat__message"
          :class="{ 'team-chat__message--own': isOwnMessage(msg) }"
        >
          <div class="team-chat__avatar" :class="{ 'team-chat__avatar--ai': msg.is_ai_response }">
            {{ msg.is_ai_response ? "N" : getInitials(msg.author?.full_name) }}
          </div>
          <div :class="bubbleClass(msg)">
            <header>
              <span class="chat-bubble__author">{{ getAuthorName(msg) }}</span>
              <span class="chat-bubble__time">{{ formatTime(msg.created_at) }}</span>
            </header>
            <p>{{ msg.content }}</p>
          </div>
        </article>
      </template>

      <!-- Typing indicator -->
      <article v-if="sending && isAIChannel" class="team-chat__message">
        <div class="team-chat__avatar team-chat__avatar--ai">N</div>
        <div class="chat-bubble chat-bubble--ai chat-bubble--typing">
          <span class="typing-dot" />
          <span class="typing-dot" />
          <span class="typing-dot" />
        </div>
      </article>
    </div>

    <!-- Input -->
    <form class="team-chat__form" @submit.prevent="handleSubmit">
      <textarea
        v-model="inputValue"
        rows="2"
        :placeholder="isAIChannel 
          ? 'Ask Native AI a question...' 
          : 'Type a message...'"
        :disabled="sending"
        @keydown="handleKeydown"
      />
      <div class="team-chat__form-actions">
        <span class="text-muted" style="font-size: 0.8rem">
          Press Enter to send, Shift+Enter for new line
        </span>
        <button type="submit" :disabled="!inputValue.trim() || sending">
          {{ sending ? "Sending..." : "Send" }}
        </button>
      </div>
    </form>
  </section>
</template>

<style scoped>
.team-chat {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0;
  overflow: hidden;
}

.team-chat__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--color-border);
}

.team-chat__meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.team-chat__icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: var(--color-muted);
}

.team-chat__icon--ai {
  background: rgba(147, 182, 180, 0.2);
  color: var(--color-accent);
}

.team-chat__meta h2 {
  margin: 0;
  font-size: 1.15rem;
}

.team-chat__meta span {
  font-size: 0.85rem;
}

.team-chat__actions {
  display: flex;
  gap: 0.5rem;
}

.team-chat__messages {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.team-chat__loading,
.team-chat__empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 1rem;
  padding: 2rem;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top-color: var(--color-accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.empty-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
}

.team-chat__empty h3 {
  margin: 0;
  font-size: 1.1rem;
}

.team-chat__message {
  display: grid;
  grid-template-columns: 40px 1fr;
  gap: 0.75rem;
  align-items: flex-start;
}

.team-chat__message--own {
  direction: rtl;
}

.team-chat__message--own > * {
  direction: ltr;
}

.team-chat__avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 600;
}

.team-chat__avatar--ai {
  background: linear-gradient(135deg, var(--color-accent), var(--color-secondary));
  color: #0f1514;
}

.chat-bubble {
  border-radius: 1rem;
  padding: 0.875rem 1rem;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid var(--color-border);
  max-width: 75%;
}

.chat-bubble--own {
  background: rgba(147, 182, 180, 0.15);
  border-color: rgba(147, 182, 180, 0.3);
}

.chat-bubble--ai {
  background: rgba(84, 162, 255, 0.1);
  border-color: rgba(84, 162, 255, 0.25);
}

.chat-bubble header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.35rem;
  font-size: 0.85rem;
}

.chat-bubble__author {
  font-weight: 600;
}

.chat-bubble__time {
  color: var(--color-muted);
}

.chat-bubble p {
  margin: 0;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;
}

.chat-bubble--typing {
  display: flex;
  gap: 0.35rem;
  align-items: center;
  padding: 1rem;
}

.typing-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-accent);
  animation: pulse 1s infinite ease-in-out;
}

.typing-dot:nth-child(2) {
  animation-delay: 0.15s;
}

.typing-dot:nth-child(3) {
  animation-delay: 0.3s;
}

@keyframes pulse {
  0%,
  100% {
    transform: translateY(0);
    opacity: 0.4;
  }
  50% {
    transform: translateY(-4px);
    opacity: 1;
  }
}

.team-chat__form {
  padding: 1rem 1.5rem 1.5rem;
  border-top: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.team-chat__form textarea {
  background: var(--color-card-alt);
  resize: none;
}

.team-chat__form textarea:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px rgba(147, 182, 180, 0.15);
}

.team-chat__form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>

