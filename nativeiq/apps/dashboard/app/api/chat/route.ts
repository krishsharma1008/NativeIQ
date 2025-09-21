import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ChatMessage {
  id: string;
  content: string;
  sender: string;
  role: 'user' | 'assistant';
  designation?: string;
  timestamp: Date;
}

export interface UserProfile {
  id: string;
  name: string;
  designation: string;
  department: string;
  avatar?: string;
}

const SYSTEM_PROMPT = `You are Native IQ Assistant, an AI-powered business intelligence consultant for small and medium-sized businesses. You provide concise, actionable insights that drive growth.

**Response Style for Assistant Mode:**
- Keep responses under 150 words
- Focus on 1-2 key insights
- Provide immediate, actionable recommendations
- Use bullet points for clarity
- Include specific metrics and timelines
- Be direct and to-the-point

**Your Expertise:**
- Strategic business analysis and opportunity identification
- Financial modeling and cash flow optimization
- Customer acquisition and retention strategies
- Operational efficiency and process improvement
- Market positioning and competitive analysis
- Team productivity and organizational design

**Communication Style:**
- Professional yet approachable
- Concise and direct - like a senior consultant giving quick advice
- Focus on immediate value and actionable next steps
- Use business terminology appropriately
- Always include specific numbers, percentages, and timelines`;

export async function POST(request: NextRequest) {
  try {
    const { messages, currentUser, contextData } = await request.json();

    // Format conversation history for OpenAI
    const openaiMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.map((msg: ChatMessage) => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: `[${msg.designation || 'Team Member'} - ${msg.sender}]: ${msg.content}`
      }))
    ];

    // Add context about current business state if provided
    if (contextData) {
      openaiMessages.splice(1, 0, {
        role: 'system',
        content: `Current SMB Business Context:
- Monthly recurring revenue: ${contextData.monthlyRevenue || 'N/A'}
- Customer churn rate: ${contextData.customerChurn || 'N/A'}  
- Support tickets: ${contextData.supportTickets || 'N/A'}
- Cash flow runway: ${contextData.cashFlow || 'N/A'}
- Monthly burn rate: ${contextData.monthlyBurn || 'N/A'}
- Top business risks: ${contextData.topRisks?.join(', ') || 'N/A'}
- Recent insights: ${contextData.recentInsights?.map((i: any) => i.title).join(', ') || 'N/A'}`
      });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: openaiMessages,
      max_tokens: 200, // Concise responses for assistant mode
      temperature: 0.3, // Lower temperature for more focused, direct responses
    });

    const assistantResponse = completion.choices[0]?.message?.content || 
      "I'm analyzing the conversation and will provide insights shortly.";

    return NextResponse.json({ 
      response: assistantResponse,
      usage: completion.usage 
    });

  } catch (error) {
    console.error('OpenAI API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ status: 'Chat API is running' });
}
