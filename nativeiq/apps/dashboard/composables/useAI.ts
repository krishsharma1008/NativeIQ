import { ref } from "vue";

export interface AIMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export function useAI() {
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function sendToAI(
    message: string,
    conversationHistory: AIMessage[] = []
  ): Promise<string> {
    loading.value = true;
    error.value = null;

    try {
      const response = await $fetch<{ message: string; error?: string }>("/api/chat", {
        method: "POST",
        body: {
          message,
          history: conversationHistory.slice(-10) // Keep last 10 messages for context
        }
      });

      if (response.error) {
        throw new Error(response.error);
      }

      return response.message;
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Failed to get AI response";
      error.value = errorMessage;
      throw new Error(errorMessage);
    } finally {
      loading.value = false;
    }
  }

  function buildSystemPrompt(companyName?: string, userName?: string): string {
    return `You are Native, an intelligent AI assistant for ${companyName || "the organization"}. 
You help team members with:
- Summarizing discussions and decisions
- Identifying action items and tasks
- Analyzing business metrics and trends
- Providing insights on team communication
- Answering questions about the organization's data

Be concise, helpful, and professional. When providing recommendations, explain your reasoning.
${userName ? `You are currently assisting ${userName}.` : ""}

Respond in a friendly but professional tone. Use bullet points and structured formatting when appropriate.`;
  }

  return {
    loading,
    error,
    sendToAI,
    buildSystemPrompt
  };
}

