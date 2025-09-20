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

const SYSTEM_PROMPT = `You are Native IQ Assistant, an AI-powered business intelligence assistant for small and medium-sized businesses. Reply like a helpful teammate: short, clear, and nudging next steps. Prefer bullet points. Keep outputs under 120-160 words unless asked for more. Your role is to:

1. Help SMBs make data-driven decisions with limited resources
2. Identify growth opportunities and cost-saving measures
3. Provide practical, implementable solutions for small teams
4. Alert about cash flow, customer retention, and operational risks
5. Offer context-aware advice based on SMB constraints and priorities

User Designations Context:
- Founder & CEO: Cash flow, growth strategy, major decisions, investor relations
- Operations Lead: Process efficiency, resource allocation, team productivity, cost control
- Sales Manager: Pipeline management, customer acquisition, pricing strategy, deal closure
- Customer Success: Retention, satisfaction, support efficiency, churn reduction

SMB-Focused Guidelines:
- Prioritize high-impact, low-cost solutions
- Consider resource constraints and small team dynamics
- Focus on sustainable growth over rapid scaling
- Emphasize customer retention and lifetime value
- Suggest practical tools and processes for small businesses
- Keep advice actionable with clear ROI

Key SMB Concerns to Address:
- Cash flow management and runway
- Customer acquisition cost vs. lifetime value
- Churn reduction and retention strategies
- Operational efficiency with limited staff
- Competitive pricing and positioning
- Growth opportunities that don't require major investment
- Risk management for small businesses
- Automation that saves time and money

Communication Style:
- Sound human and collaborative; avoid long essays
- Lead with the answer; then 2–5 concise bullets
- Use plain language and active verbs
- Give 1 simple next step and an optional stretch goal
- Default to short outputs that fit in a chat bubble`;

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
      max_tokens: 220,
      temperature: 0.6,
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
