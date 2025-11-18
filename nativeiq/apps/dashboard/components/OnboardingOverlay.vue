<script setup lang="ts">
import { ref } from "vue";
type Invitee = {
  email: string;
  status: "pending" | "sent";
};

const props = defineProps<{
  company: string;
  seededEmails?: string[];
}>();

const emit = defineEmits<{
  (e: "complete", payload: string[]): void;
  (e: "skip"): void;
}>();

const emailInput = ref("");
const invitees = ref<Invitee[]>(
  props.seededEmails?.map((email) => ({ email, status: "pending" })) ?? []
);

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

const addInvite = () => {
  const value = emailInput.value.trim().toLowerCase();
  if (!value || !emailPattern.test(value)) {
    return;
  }
  if (invitees.value.some((invite) => invite.email === value)) {
    emailInput.value = "";
    return;
  }
  invitees.value.push({ email: value, status: "pending" });
  emailInput.value = "";
};

const removeInvite = (email: string) => {
  invitees.value = invitees.value.filter((invite) => invite.email !== email);
};

const completeOnboarding = () => {
  emit(
    "complete",
    invitees.value.map((invite) => invite.email)
  );
};

// TODO: Connect this placeholder to the actual invite API for transactional emails.
</script>

<template>
  <div class="onboarding-overlay" aria-live="assertive">
    <div class="onboarding-card card-surface">
      <p class="eyebrow text-muted">Onboarding</p>
      <h2>Invite teammates to {{ props.company || "Native" }}</h2>
      <p class="muted">
        We hold your dashboard until the core team arrives. Add emails and Native will send onboarding invites when you
        launch the space.
      </p>

      <form class="invite-form" @submit.prevent="addInvite">
        <input v-model="emailInput" type="email" placeholder="team@company.com" />
        <button type="submit">Add</button>
      </form>

      <ul class="invite-list">
        <li v-for="invite in invitees" :key="invite.email">
          <div>
            <strong>{{ invite.email }}</strong>
            <span class="text-muted">{{ invite.status }}</span>
          </div>
          <button class="ghost-button" type="button" @click="removeInvite(invite.email)">Remove</button>
        </li>
        <li v-if="invitees.length === 0" class="text-muted">Add at least one teammate so we know who to notify.</li>
      </ul>

      <div class="onboarding-card__footer">
        <button :disabled="invitees.length === 0" type="button" @click="completeOnboarding">
          Launch Native workspace
        </button>
        <button class="ghost-button" type="button" @click="emit('skip')">Skip for now</button>
      </div>
    </div>
  </div>
</template>
