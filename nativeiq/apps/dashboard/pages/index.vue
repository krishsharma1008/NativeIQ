<script setup lang="ts">
import { computed, ref } from "vue";
import type { Approval, Insight, SlaMetric, Task } from "@nativeiq/types";
import { approvals as approvalSeed, insights as insightSeed, slaMetrics as slaSeed, tasks as taskSeed } from "@/lib/mock-data";
import { useTheme } from "@/composables/useTheme";

type ParticipantRole = "native" | "user" | "teammate";

type AssistantMessage = {
  id: string;
  role: ParticipantRole;
  authorName: string;
  initials: string;
  text: string;
  timestamp: string;
  highlight?: boolean;
};

useTheme();

const companyName = ref("Acme Labs");
const showOnboarding = ref(true);
const pendingEmails = ref<string[]>(["ops@acme.com"]);
const insights = ref<Insight[]>([...insightSeed]);
const tasks = ref<Task[]>([...taskSeed]);
const approvals = ref<Approval[]>([...approvalSeed]);
const metrics = ref<SlaMetric[]>([...slaSeed]);

const computeInitials = (label: string) =>
  label
    .split(" ")
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 3)
    .toUpperCase();

// TODO: Replace mock arrays with live data coming from MCP connectors.
const assistantMessages = ref<AssistantMessage[]>([
  {
    id: "highlight-note",
    role: "native",
    authorName: "Native",
    initials: "N",
    text: "However, I noticed your conversion rate dipped slightly to 3.24% (down 2.1%). Might be linked to the checkout updates Sarah deployed.",
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    highlight: true
  },
  {
    id: "mike-reply",
    role: "teammate",
    authorName: "Mike Torres",
    initials: "MT",
    text: "Hmm, that conversion dip is concerning. Any ideas what's causing it?",
    timestamp: new Date(Date.now() - 4 * 60 * 1000).toISOString()
  },
  {
    id: "sarah-reply",
    role: "teammate",
    authorName: "Sarah Chen",
    initials: "SC",
    text: "Could be the new payment modal? Users might be confused by the layout shift.",
    timestamp: new Date(Date.now() - 4 * 60 * 1000).toISOString()
  },
  {
    id: "alex-reply",
    role: "teammate",
    authorName: "Alex Kim",
    initials: "AK",
    text: "Native, what do you recommend we focus on?",
    timestamp: new Date(Date.now() - 3 * 60 * 1000).toISOString()
  },
  {
    id: "native-summary",
    role: "native",
    authorName: "Native",
    initials: "N",
    text: `Here are the top 3 recommendations: 1) A/B test the current checkout vs. the old flow. 2) Check mobile traffic — 68% of the drop is from mobile. 3) Monitor the next 2 hours and prep a rollback option.`,
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString()
  }
]);
const isAssistantTyping = ref(false);

const formattedDate = computed(() =>
  new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric"
  }).format(new Date())
);

const pendingInviteCount = computed(() => pendingEmails.value.length);
const quickActions = computed(() => tasks.value.slice(0, 4));

const updateCompanyName = (value: string) => {
  companyName.value = value;
};

const handleOnboardingComplete = (emails: string[]) => {
  pendingEmails.value = emails;
  showOnboarding.value = false;
  // TODO: Persist onboarding completion server-side once sessions API is available.
};

const skipOnboardingOverlay = () => {
  showOnboarding.value = false;
};

const sendAssistantMessage = (content: string) => {
  const trimmed = content.trim();
  if (!trimmed) {
    return;
  }
  const outbound: AssistantMessage = {
    id: `user-${crypto.randomUUID?.() ?? Date.now()}`,
    role: "user",
    authorName: "You",
    initials: computeInitials("You"),
    text: trimmed,
    timestamp: new Date().toISOString()
  };
  assistantMessages.value = [...assistantMessages.value, outbound];
  isAssistantTyping.value = true;

  // TODO: Stream assistant responses from NativeIQ once orchestration endpoint is wired up.
  setTimeout(() => {
    assistantMessages.value = [
      ...assistantMessages.value,
      {
        id: `native-${Date.now()}`,
        role: "native",
        authorName: "Native",
        initials: "N",
        text: `Logged your note for ${companyName.value || "the team"}. I'll sync with RevOps and send a summary.`,
        timestamp: new Date().toISOString()
      }
    ];
    isAssistantTyping.value = false;
  }, 900);
};
</script>

<template>
  <div class="page-shell">
    <Transition name="fade-scale">
      <OnboardingOverlay
        v-if="showOnboarding"
        :company="companyName"
        :seeded-emails="pendingEmails"
        @complete="handleOnboardingComplete"
        @skip="skipOnboardingOverlay"
      />
    </Transition>

    <DashboardHeader
      :company-name="companyName"
      :pending-invites="pendingInviteCount"
      :date-label="formattedDate"
      @update:company-name="updateCompanyName"
    />

    <SignalTicker :insights="insights" :metrics="metrics" />

    <div class="dashboard-grid dashboard-grid--chat">
      <div class="chat-column">
        <AssistantPane
          :company="companyName"
          :messages="assistantMessages"
          :is-generating="isAssistantTyping"
          channel-name="Team Chat"
          channel-meta="@Native for AI updates"
          :member-count="4"
          @send="sendAssistantMessage"
        />
      </div>
      <div class="intel-column">
        <KpiRow :metrics="metrics" />
        <div class="intel-scroll">
          <InsightsPanel :insights="insights" :company="companyName" />
          <BusinessInsights :company="companyName" :insights="insights" :metrics="metrics" />
          <QuickActions :tasks="quickActions" />
          <ApprovalPanel :approvals="approvals" />
          <MarketSuggestions :company="companyName" :insights="insights" />
        </div>
      </div>
    </div>
  </div>
</template>
