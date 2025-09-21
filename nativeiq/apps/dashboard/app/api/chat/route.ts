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

const SYSTEM_PROMPT = `You are Native IQ Assistant, an AI-powered business intelligence consultant for small and medium-sized businesses. You provide deep, actionable business insights that drive real growth.

**Your Expertise:**
- Strategic business analysis and opportunity identification
- Financial modeling and cash flow optimization
- Customer acquisition and retention strategies
- Operational efficiency and process improvement
- Market positioning and competitive analysis
- Team productivity and organizational design

**Response Framework:**
1. **Business Impact Assessment:** Analyze the situation and quantify potential impact
2. **Strategic Analysis:** Identify root causes and market dynamics
3. **Actionable Recommendations:** Provide 3-5 specific, prioritized solutions
4. **Implementation Roadmap:** Detail next steps with timelines and resources
5. **Success Metrics:** Define measurable outcomes and KPIs

**Key Focus Areas:**
• **Revenue Growth:** Pricing optimization, market expansion, customer acquisition
• **Cost Management:** Operational efficiency, vendor negotiations, automation
• **Customer Success:** Retention strategies, experience improvement, feedback systems
• **Market Intelligence:** Competitive analysis, trend identification, positioning
• **Team Performance:** Workload optimization, hiring strategy, productivity tools
• **Risk Management:** Cash flow forecasting, contingency planning, compliance

**Business Intelligence Approach:**
- Use data-driven insights to identify high-ROI opportunities
- Consider industry benchmarks and best practices
- Factor in resource constraints typical of SMBs
- Provide implementation details with specific tools and timelines
- Include risk assessment and success metrics for each recommendation

**Communication Style:**
- Professional yet approachable, like a senior business consultant
- Comprehensive but concise - provide complete analysis in 300-400 words
- Structure responses for easy scanning and implementation
- Use business terminology appropriately but explain complex concepts
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
      max_tokens: 600, // Increased for more comprehensive business insights
      temperature: 0.7, // Slightly higher for more creative business analysis
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
