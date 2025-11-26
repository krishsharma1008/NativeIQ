import { ref, computed, onUnmounted } from "vue";
import type { RealtimeChannel } from "@supabase/supabase-js";

export interface Channel {
  id: string;
  organization_id: string;
  name: string;
  description: string | null;
  type: "team" | "ai-assistant" | "direct";
  created_at: string;
}

export interface Message {
  id: string;
  channel_id: string;
  author_id: string | null;
  content: string;
  is_ai_response: boolean;
  metadata: Record<string, unknown>;
  created_at: string;
  // Joined data
  author?: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  };
}

export interface ChatMember {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string;
}

export function useChat() {
  const supabase = useSupabaseClient();
  const user = useSupabaseUser();

  const channels = ref<Channel[]>([]);
  const currentChannel = ref<Channel | null>(null);
  const messages = ref<Message[]>([]);
  const members = ref<ChatMember[]>([]);
  const loading = ref(false);
  const sending = ref(false);
  const error = ref<string | null>(null);

  let realtimeSubscription: RealtimeChannel | null = null;

  const isAIChannel = computed(() => currentChannel.value?.type === "ai-assistant");
  const teamChannel = computed(() => channels.value.find((c) => c.type === "team"));
  const aiChannel = computed(() => channels.value.find((c) => c.type === "ai-assistant"));

  async function fetchChannels(organizationId: string) {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: fetchError } = await supabase
        .from("channels")
        .select("*")
        .eq("organization_id", organizationId)
        .order("created_at", { ascending: true });

      if (fetchError) throw fetchError;

      channels.value = data || [];
      return data;
    } catch (e) {
      error.value = e instanceof Error ? e.message : "Failed to fetch channels";
      return [];
    } finally {
      loading.value = false;
    }
  }

  async function fetchMessages(channelId: string, limit = 50) {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: fetchError } = await supabase
        .from("messages")
        .select(`
          *,
          author:profiles!author_id (
            id,
            full_name,
            avatar_url
          )
        `)
        .eq("channel_id", channelId)
        .order("created_at", { ascending: true })
        .limit(limit);

      if (fetchError) throw fetchError;

      messages.value = data || [];
      return data;
    } catch (e) {
      error.value = e instanceof Error ? e.message : "Failed to fetch messages";
      return [];
    } finally {
      loading.value = false;
    }
  }

  async function fetchMembers(organizationId: string) {
    try {
      const { data, error: fetchError } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url, role")
        .eq("organization_id", organizationId);

      if (fetchError) throw fetchError;

      members.value = data || [];
      return data;
    } catch (e) {
      console.error("Failed to fetch members:", e);
      return [];
    }
  }

  async function sendMessage(content: string, isAI = false) {
    if (!currentChannel.value || !content.trim()) return;

    sending.value = true;
    error.value = null;

    try {
      const { data, error: sendError } = await supabase
        .from("messages")
        .insert({
          channel_id: currentChannel.value.id,
          author_id: isAI ? null : user.value?.id,
          content: content.trim(),
          is_ai_response: isAI
        })
        .select(`
          *,
          author:profiles!author_id (
            id,
            full_name,
            avatar_url
          )
        `)
        .single();

      if (sendError) throw sendError;

      // The message will be added via realtime subscription
      return data;
    } catch (e) {
      error.value = e instanceof Error ? e.message : "Failed to send message";
      throw e;
    } finally {
      sending.value = false;
    }
  }

  function subscribeToChannel(channelId: string) {
    // Unsubscribe from previous channel
    unsubscribe();

    // Subscribe to new channel
    realtimeSubscription = supabase
      .channel(`messages:${channelId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `channel_id=eq.${channelId}`
        },
        async (payload) => {
          const newMessage = payload.new as Message;

          // Fetch author details if needed
          if (newMessage.author_id) {
            const { data: author } = await supabase
              .from("profiles")
              .select("id, full_name, avatar_url")
              .eq("id", newMessage.author_id)
              .single();

            if (author) {
              newMessage.author = author;
            }
          }

          // Add to messages if not already present
          if (!messages.value.find((m) => m.id === newMessage.id)) {
            messages.value = [...messages.value, newMessage];
          }
        }
      )
      .subscribe();
  }

  function unsubscribe() {
    if (realtimeSubscription) {
      supabase.removeChannel(realtimeSubscription);
      realtimeSubscription = null;
    }
  }

  async function selectChannel(channel: Channel) {
    currentChannel.value = channel;
    await fetchMessages(channel.id);
    subscribeToChannel(channel.id);
  }

  function getInitials(name: string | null | undefined): string {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  function formatTime(timestamp: string): string {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  // Cleanup on unmount
  onUnmounted(() => {
    unsubscribe();
  });

  return {
    channels,
    currentChannel,
    messages,
    members,
    loading,
    sending,
    error,
    isAIChannel,
    teamChannel,
    aiChannel,
    fetchChannels,
    fetchMessages,
    fetchMembers,
    sendMessage,
    selectChannel,
    subscribeToChannel,
    unsubscribe,
    getInitials,
    formatTime
  };
}

