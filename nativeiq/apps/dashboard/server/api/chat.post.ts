import OpenAI from "openai";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface ChatRequest {
  message: string;
  history?: ChatMessage[];
  systemPrompt?: string;
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody<ChatRequest>(event);

  if (!body.message) {
    throw createError({
      statusCode: 400,
      statusMessage: "Message is required"
    });
  }

  const apiKey = config.openaiApiKey;

  if (!apiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: "OpenAI API key not configured"
    });
  }

  try {
    const openai = new OpenAI({
      apiKey
    });

    const systemPrompt = body.systemPrompt || `You are Native, an intelligent AI assistant for NativeIQ. 
You help team members with:
- Summarizing discussions and decisions
- Identifying action items and tasks
- Analyzing business metrics and trends
- Providing insights on team communication
- Answering questions about the organization's data

Be concise, helpful, and professional. When providing recommendations, explain your reasoning.
Respond in a friendly but professional tone. Use bullet points and structured formatting when appropriate.`;

    const messages: OpenAI.ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt }
    ];

    // Add conversation history
    if (body.history && body.history.length > 0) {
      for (const msg of body.history) {
        if (msg.role === "user" || msg.role === "assistant") {
          messages.push({
            role: msg.role,
            content: msg.content
          });
        }
      }
    }

    // Add current message
    messages.push({
      role: "user",
      content: body.message
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      temperature: 0.7,
      max_tokens: 1024
    });

    const responseMessage = completion.choices[0]?.message?.content || "I apologize, but I couldn't generate a response.";

    return {
      message: responseMessage,
      usage: completion.usage
    };
  } catch (error) {
    console.error("OpenAI API error:", error);

    if (error instanceof OpenAI.APIError) {
      throw createError({
        statusCode: error.status || 500,
        statusMessage: error.message
      });
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Failed to process AI request"
    });
  }
});

