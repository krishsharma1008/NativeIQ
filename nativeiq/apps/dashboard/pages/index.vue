<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import type { Insight, SlaMetric, Task, Approval } from "@nativeiq/types";
import { insights as insightSeed, slaMetrics as slaSeed, tasks as taskSeed, approvals as approvalSeed } from "@/lib/mock-data";

definePageMeta({
  middleware: "auth"
});

// Auth & User
const { profile, organization, initialize: initAuth, signOut } = useAuth();
const user = useSupabaseUser();

// Chat
const {
  channels,
  currentChannel,
  messages,
  members,
  loading: chatLoading,
  sending,
  fetchChannels,
  fetchMembers,
  sendMessage,
  selectChannel
} = useChat();

// AI
const { sendToAI, loading: aiLoading, buildSystemPrompt } = useAI();

// Dashboard data (keeping existing mock data for other sections)
const insights = ref<Insight[]>([...insightSeed]);
const tasks = ref<Task[]>([...taskSeed]);
const approvals = ref<Approval[]>([...approvalSeed]);
const metrics = ref<SlaMetric[]>([...slaSeed]);

// UI State
const showInviteModal = ref(false);
const inviteEmail = ref("");
const inviteLoading = ref(false);
const inviteError = ref<string | null>(null);

// Computed
const companyName = computed(() => organization.value?.name || "Your Organization");
const quickActions = computed(() => tasks.value.slice(0, 4));
const isAIChannel = computed(() => currentChannel.value?.type === "ai-assistant");

const formattedDate = computed(() =>
  new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric"
  }).format(new Date())
);

// Initialize
onMounted(async () => {
  await initAuth();
  
  if (profile.value?.organization_id) {
    await Promise.all([
      fetchChannels(profile.value.organization_id),
      fetchMembers(profile.value.organization_id)
    ]);
    
    // Select AI channel by default
    if (channels.value.length > 0) {
      const aiChan = channels.value.find((c) => c.type === "ai-assistant");
      const defaultChannel = aiChan || channels.value[0];
      await selectChannel(defaultChannel);
    }
  }
});

// Watch for organization changes
watch(
  () => profile.value?.organization_id,
  async (orgId) => {
    if (orgId) {
      await Promise.all([
        fetchChannels(orgId),
        fetchMembers(orgId)
      ]);
    }
  }
);

// Handlers
const handleChannelSelect = async (channel: typeof currentChannel.value) => {
  if (channel) {
    await selectChannel(channel);
  }
};

const handleSendMessage = async (content: string) => {
  if (!content.trim() || !currentChannel.value) return;

  try {
    // Send user message to Supabase
    await sendMessage(content, false);

    // If AI channel, get AI response
    if (isAIChannel.value) {
      // Build conversation history for AI context
      const history = messages.value.slice(-10).map((m) => ({
        role: m.is_ai_response ? "assistant" as const : "user" as const,
        content: m.content
      }));

      const aiResponse = await sendToAI(content, history);
      
      // Save AI response to Supabase
      await sendMessage(aiResponse, true);
    }
  } catch (error) {
    console.error("Failed to send message:", error);
  }
};

const handleInvite = () => {
  showInviteModal.value = true;
};

const supabase = useSupabaseClient();

const sendInvite = async () => {
  if (!inviteEmail.value.trim() || !profile.value?.organization_id) return;

  inviteLoading.value = true;
  inviteError.value = null;

  try {
    const { error } = await supabase
      .from("organization_invites")
      .insert({
        organization_id: profile.value.organization_id,
        email: inviteEmail.value.trim(),
        invited_by: user.value?.id
      });

    if (error) throw error;

    inviteEmail.value = "";
    showInviteModal.value = false;
    // TODO: Send invite email via edge function
  } catch (e) {
    inviteError.value = e instanceof Error ? e.message : "Failed to send invite";
  } finally {
    inviteLoading.value = false;
  }
};

const handleSignOut = async () => {
  await signOut();
};
</script>

<template>
  <div class="dashboard-layout">
    <!-- Channel Sidebar -->
    <ChannelSidebar
      :channels="channels"
      :current-channel="currentChannel"
      :members="members"
      :organization-name="companyName"
      @select="handleChannelSelect"
      @invite="handleInvite"
    />

    <!-- Main Content -->
    <div class="dashboard-main">
      <!-- Header -->
      <header class="dashboard-header">
        <div class="dashboard-header__left">
          <span class="eyebrow">{{ formattedDate }}</span>
          <h1>Welcome back, {{ profile?.full_name || "there" }}</h1>
        </div>
        <div class="dashboard-header__right">
          <ThemeToggle />
          <button class="ghost-button" @click="handleSignOut">Sign out</button>
        </div>
      </header>

      <!-- Signal Ticker -->
      <SignalTicker :insights="insights" :metrics="metrics" />

      <!-- Main Grid -->
      <div class="dashboard-grid dashboard-grid--chat">
        <!-- Chat Column -->
        <div class="chat-column">
          <TeamChat
            :channel="currentChannel"
            :messages="messages"
            :members="members"
            :current-user-id="user?.id"
            :loading="chatLoading"
            :sending="sending || aiLoading"
            @send="handleSendMessage"
          />
        </div>

        <!-- Intel Column -->
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

    <!-- Invite Modal -->
    <Teleport to="body">
      <Transition name="fade-scale">
        <div v-if="showInviteModal" class="modal-overlay" @click.self="showInviteModal = false">
          <div class="modal-card card-surface">
            <header class="modal-header">
              <h2>Invite team member</h2>
              <button class="ghost-button" @click="showInviteModal = false">×</button>
            </header>
            <form class="modal-body" @submit.prevent="sendInvite">
              <div class="form-group">
                <label for="invite-email">Email address</label>
                <input
                  id="invite-email"
                  v-model="inviteEmail"
                  type="email"
                  placeholder="colleague@company.com"
                  required
                />
              </div>
              <div v-if="inviteError" class="auth-error">
                {{ inviteError }}
              </div>
              <div class="modal-actions">
                <button type="button" class="ghost-button" @click="showInviteModal = false">
                  Cancel
                </button>
                <button type="submit" :disabled="inviteLoading || !inviteEmail.trim()">
                  {{ inviteLoading ? "Sending..." : "Send invite" }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.dashboard-layout {
  display: flex;
  min-height: 100vh;
  margin: -2rem -1.5rem -3rem;
}

.dashboard-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 2rem 1.5rem 3rem;
  overflow: hidden;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.dashboard-header__left h1 {
  margin: 0.25rem 0 0;
  font-size: 1.5rem;
}

.dashboard-header__right {
  display: flex;
  gap: 0.75rem;
}

/* Chat column adjustments */
.chat-column {
  height: calc(100vh - 220px);
  min-height: 500px;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 1rem;
}

.modal-card {
  width: 100%;
  max-width: 420px;
  padding: 0;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--color-border);
}

.modal-header h2 {
  margin: 0;
  font-size: 1.15rem;
}

.modal-header .ghost-button {
  width: 32px;
  height: 32px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.modal-body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--color-muted);
}

.auth-error {
  padding: 0.875rem 1rem;
  background: rgba(255, 138, 138, 0.1);
  border: 1px solid rgba(255, 138, 138, 0.3);
  border-radius: 0.75rem;
  color: var(--color-danger);
  font-size: 0.9rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

/* Responsive */
@media (max-width: 1100px) {
  .dashboard-layout {
    flex-direction: column;
  }

  .dashboard-main {
    min-height: auto;
  }

  .chat-column {
    height: 500px;
  }
}
</style>
