<script setup lang="ts">
import type { Channel, ChatMember } from "@/composables/useChat";

const props = defineProps<{
  channels: Channel[];
  currentChannel: Channel | null;
  members: ChatMember[];
  organizationName?: string;
}>();

const emit = defineEmits<{
  (e: "select", channel: Channel): void;
  (e: "invite"): void;
}>();

const getChannelIcon = (type: Channel["type"]) => {
  switch (type) {
    case "ai-assistant":
      return "✨";
    case "team":
      return "#";
    case "direct":
      return "→";
    default:
      return "#";
  }
};

const getInitials = (name: string | null) => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};
</script>

<template>
  <aside class="channel-sidebar">
    <header class="channel-sidebar__header">
      <div class="channel-sidebar__org">
        <span class="channel-sidebar__org-icon">N</span>
        <div class="channel-sidebar__org-info">
          <h3>{{ organizationName || "NativeIQ" }}</h3>
          <span class="text-muted">{{ members.length }} members</span>
        </div>
      </div>
    </header>

    <nav class="channel-sidebar__nav">
      <div class="channel-section">
        <h4 class="channel-section__title">Channels</h4>
        <ul class="channel-list">
          <li
            v-for="channel in channels"
            :key="channel.id"
            class="channel-item"
            :class="{ 'channel-item--active': currentChannel?.id === channel.id }"
            @click="emit('select', channel)"
          >
            <span class="channel-item__icon" :class="`channel-item__icon--${channel.type}`">
              {{ getChannelIcon(channel.type) }}
            </span>
            <span class="channel-item__name">{{ channel.name }}</span>
            <span v-if="channel.type === 'ai-assistant'" class="channel-item__badge">AI</span>
          </li>
        </ul>
      </div>

      <div class="channel-section">
        <div class="channel-section__header">
          <h4 class="channel-section__title">Team Members</h4>
          <button class="channel-section__action" title="Invite member" @click="emit('invite')">
            +
          </button>
        </div>
        <ul class="member-list">
          <li v-for="member in members" :key="member.id" class="member-item">
            <span class="member-item__avatar">{{ getInitials(member.full_name) }}</span>
            <span class="member-item__name">{{ member.full_name || "Unknown" }}</span>
            <span v-if="member.role === 'owner'" class="member-item__role">Owner</span>
          </li>
        </ul>
      </div>
    </nav>
  </aside>
</template>

<style scoped>
.channel-sidebar {
  width: 260px;
  min-width: 260px;
  background: var(--color-card);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  height: 100%;
}

.channel-sidebar__header {
  padding: 1.25rem;
  border-bottom: 1px solid var(--color-border);
}

.channel-sidebar__org {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.channel-sidebar__org-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--color-accent), var(--color-secondary));
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.1rem;
  color: #0f1514;
}

.channel-sidebar__org-info h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}

.channel-sidebar__org-info span {
  font-size: 0.8rem;
}

.channel-sidebar__nav {
  flex: 1;
  overflow-y: auto;
  padding: 1rem 0;
}

.channel-section {
  margin-bottom: 1.5rem;
}

.channel-section__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1.25rem;
  margin-bottom: 0.5rem;
}

.channel-section__title {
  padding: 0 1.25rem;
  margin: 0 0 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-muted);
}

.channel-section__header .channel-section__title {
  padding: 0;
  margin: 0;
}

.channel-section__action {
  width: 24px;
  height: 24px;
  padding: 0;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.08);
  color: var(--color-muted);
  font-size: 1.1rem;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.channel-section__action:hover {
  background: rgba(255, 255, 255, 0.12);
  color: var(--color-text);
  box-shadow: none;
}

.channel-list,
.member-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.channel-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.6rem 1.25rem;
  cursor: pointer;
  transition: background 0.15s;
}

.channel-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.channel-item--active {
  background: rgba(147, 182, 180, 0.15);
  border-right: 2px solid var(--color-accent);
}

.channel-item__icon {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  color: var(--color-muted);
}

.channel-item__icon--ai-assistant {
  background: rgba(147, 182, 180, 0.2);
  color: var(--color-accent);
}

.channel-item__name {
  flex: 1;
  font-size: 0.9rem;
  font-weight: 500;
}

.channel-item__badge {
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  background: rgba(147, 182, 180, 0.2);
  color: var(--color-accent);
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
}

.member-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.5rem 1.25rem;
}

.member-item__avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 600;
}

.member-item__name {
  flex: 1;
  font-size: 0.85rem;
  color: var(--color-muted);
}

.member-item__role {
  font-size: 0.7rem;
  color: var(--color-accent);
  text-transform: uppercase;
}
</style>

