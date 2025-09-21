"use client";

import { useState, useRef, useEffect } from "react";
import { GlassCard, Badge } from "@nativeiq/ui";

interface AssistantInsight {
  id: string;
  title: string;
  content: string;
  timestamp: Date;
  confidence: number;
  impact: "low" | "medium" | "high" | "critical";
  tags: string[];
  relatedTopic: string;
}

interface AssistantPaneProps {
  className?: string;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  userMessage?: string;
  onInsightGenerated?: (insight: any) => void;
}

// Mock initial insights for demonstration
const INITIAL_INSIGHTS: AssistantInsight[] = [
  {
    id: "insight-1",
    title: "Customer Churn Analysis",
    content: "Based on the recent conversation about churn rate jumping to 12%, I recommend implementing an automated customer health scoring system. The pattern suggests onboarding friction is the primary cause, affecting trial-to-paid conversion rates.",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    confidence: 0.89,
    impact: "high",
    tags: ["churn", "onboarding", "retention"],
    relatedTopic: "customer retention"
  },
  {
    id: "insight-2", 
    title: "Cash Flow Optimization",
    content: "With 2.5 months runway remaining, immediate actions are needed. Consider: 1) Delaying non-critical vendor payments by 30 days, 2) Implementing invoice financing for faster AR collection, 3) Reducing marketing spend by 40% temporarily while focusing on organic growth channels.",
    timestamp: new Date(Date.now() - 1000 * 60 * 10),
    confidence: 0.92,
    impact: "critical",
    tags: ["cash flow", "runway", "financial planning"],
    relatedTopic: "financial management"
  }
];

export function AssistantPane({ 
  className, 
  isExpanded = false, 
  onToggleExpand,
  userMessage,
  onInsightGenerated 
}: AssistantPaneProps) {
  const [insights, setInsights] = useState<AssistantInsight[]>(INITIAL_INSIGHTS);
  const [isGenerating, setIsGenerating] = useState(false);
  const insightsEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    insightsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [insights]);

  // Generate new insight when user message changes
  useEffect(() => {
    if (userMessage && userMessage.trim()) {
      generateInsight(userMessage);
    }
  }, [userMessage]);

  const generateInsight = async (message: string) => {
    setIsGenerating(true);
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));
    
    try {
      // Call the AI API for insights
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: message, sender: "Alex Martinez" }],
          currentUser: { name: "Alex Martinez", designation: "Founder & CEO" },
          contextData: {
            monthlyRevenue: "$45K MRR",
            customerChurn: "12% monthly churn",
            cashFlow: "2.5 months runway",
            trialConversion: "18% trial-to-paid"
          },
          assistantMode: true // Flag for assistant-specific response
        }),
      });

      let insightContent = "";
      let insightTitle = "";
      
      if (response.ok) {
        const data = await response.json();
        insightContent = data.response || generateFallbackInsight(message);
        insightTitle = generateInsightTitle(data.response || message);
      } else {
        insightContent = generateFallbackInsight(message);
        insightTitle = generateInsightTitle(message);
      }

      const newInsight: AssistantInsight = {
        id: `insight-${Date.now()}`,
        title: insightTitle,
        content: insightContent,
        timestamp: new Date(),
        confidence: 0.85 + Math.random() * 0.1,
        impact: determineImpact(insightContent),
        tags: extractTags(message),
        relatedTopic: extractRelatedTopic(message)
      };

      setInsights(prev => [newInsight, ...prev.slice(0, 9)]); // Keep only 10 most recent
      
      // Notify parent component about new insight
      if (onInsightGenerated) {
        onInsightGenerated({
          title: newInsight.title,
          summary: newInsight.content.slice(0, 200) + "...",
          confidence: newInsight.confidence,
          impact: newInsight.impact,
          source: "AI Assistant Analysis"
        });
      }
      
    } catch (error) {
      console.error('Failed to generate insight:', error);
      
      // Fallback insight
      const fallbackInsight: AssistantInsight = {
        id: `insight-${Date.now()}`,
        title: generateInsightTitle(message),
        content: generateFallbackInsight(message),
        timestamp: new Date(),
        confidence: 0.75,
        impact: "medium",
        tags: extractTags(message),
        relatedTopic: extractRelatedTopic(message)
      };
      
      setInsights(prev => [fallbackInsight, ...prev.slice(0, 9)]);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateFallbackInsight = (message: string): string => {
    const businessTopics = {
      'revenue': 'Focus on revenue optimization through customer lifetime value improvement and pricing strategy refinement.',
      'churn': 'Implement proactive customer success measures including health scoring and automated outreach for at-risk accounts.',
      'growth': 'Prioritize sustainable growth channels with the highest ROI while maintaining healthy unit economics.',
      'team': 'Consider team efficiency improvements and workload distribution to prevent burnout and maintain productivity.',
      'funding': 'Explore funding options including revenue-based financing, grants, or strategic partnerships to extend runway.',
      'competition': 'Differentiate through unique value propositions and focus on customer success to reduce competitive pressure.',
      'cash': 'Implement cash flow management strategies including payment terms optimization and expense prioritization.',
      'customer': 'Enhance customer experience through feedback loops and personalized engagement strategies.'
    };

    for (const [topic, insight] of Object.entries(businessTopics)) {
      if (message.toLowerCase().includes(topic)) {
        return `Based on your message about ${topic}, I recommend: ${insight} This approach should help address the immediate concerns while building long-term strategic value.`;
      }
    }

    return `I've analyzed your message and recommend focusing on the key strategic priorities. Consider implementing data-driven decision making processes and establishing clear metrics to track progress on this initiative.`;
  };

  const generateInsightTitle = (content: string): string => {
    const titles = [
      "Strategic Business Analysis",
      "Growth Opportunity Assessment", 
      "Risk Mitigation Strategy",
      "Revenue Optimization Plan",
      "Operational Excellence Review",
      "Customer Success Initiative",
      "Financial Performance Insights",
      "Market Position Analysis"
    ];

    // Simple keyword-based title selection
    if (content.includes('churn')) return "Customer Retention Strategy";
    if (content.includes('revenue')) return "Revenue Growth Analysis";
    if (content.includes('cash')) return "Cash Flow Management";
    if (content.includes('team')) return "Team Performance Optimization";
    if (content.includes('growth')) return "Growth Strategy Recommendation";
    if (content.includes('competition')) return "Competitive Advantage Analysis";
    
    return titles[Math.floor(Math.random() * titles.length)];
  };

  const determineImpact = (content: string): "low" | "medium" | "high" | "critical" => {
    const criticalKeywords = ["critical", "urgent", "immediate", "crisis", "runway", "cash flow"];
    const highKeywords = ["important", "significant", "revenue", "churn", "growth"];
    const mediumKeywords = ["consider", "recommend", "improve", "optimize"];

    const lowerContent = content.toLowerCase();
    
    if (criticalKeywords.some(keyword => lowerContent.includes(keyword))) return "critical";
    if (highKeywords.some(keyword => lowerContent.includes(keyword))) return "high";
    if (mediumKeywords.some(keyword => lowerContent.includes(keyword))) return "medium";
    
    return "low";
  };

  const extractTags = (message: string): string[] => {
    const tagMap = {
      'revenue': 'revenue',
      'churn': 'churn', 
      'cash': 'cash-flow',
      'team': 'team',
      'growth': 'growth',
      'customer': 'customer',
      'competition': 'competitive',
      'pricing': 'pricing',
      'marketing': 'marketing',
      'sales': 'sales'
    };

    const tags: string[] = [];
    const lowerMessage = message.toLowerCase();
    
    for (const [keyword, tag] of Object.entries(tagMap)) {
      if (lowerMessage.includes(keyword)) {
        tags.push(tag);
      }
    }
    
    return tags.length > 0 ? tags : ['general', 'strategy'];
  };

  const extractRelatedTopic = (message: string): string => {
    const topics = ['revenue', 'churn', 'growth', 'team', 'customer', 'financial'];
    const lowerMessage = message.toLowerCase();
    
    for (const topic of topics) {
      if (lowerMessage.includes(topic)) {
        return topic;
      }
    }
    
    return 'strategic planning';
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'critical': return 'critical';
      case 'high': return 'warning';  
      case 'medium': return 'info';
      default: return 'muted';
    }
  };

  return (
    <div className={`assistant-pane ${isExpanded ? 'assistant-pane--expanded' : ''} ${className || ""}`}>
      <GlassCard
        className="assistant-pane__container"
        title="🤖 AI Assistant"
        caption="Real-time business insights for Alex Martinez"
        actionSlot={
          <div className="assistant-pane__actions">
            <Badge tone="info" className="assistant-pane__status">
              {insights.length} insights
            </Badge>
            {onToggleExpand && (
              <button
                onClick={onToggleExpand}
                className="assistant-pane__expand-btn"
                title={isExpanded ? "Collapse" : "Expand"}
              >
                {isExpanded ? "⊟" : "⊞"}
              </button>
            )}
          </div>
        }
      >

        {/* Insights List */}
        <div className="assistant-pane__content">
          {isGenerating && (
            <div className="assistant-insight assistant-insight--generating">
              <div className="assistant-insight__header">
                <div className="assistant-insight__meta">
                  <span className="assistant-insight__status">🧠 Analyzing...</span>
                  <span className="assistant-insight__timestamp">Now</span>
                </div>
              </div>
              <div className="assistant-thinking-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div className="assistant-insight__generating-text">
                Generating strategic insights based on your message...
              </div>
            </div>
          )}

          {insights.map((insight) => (
            <div key={insight.id} className="assistant-insight">
              <div className="assistant-insight__header">
                <div className="assistant-insight__meta">
                  <Badge tone={getImpactColor(insight.impact)} className="assistant-insight__impact">
                    {insight.impact}
                  </Badge>
                  <span className="assistant-insight__confidence">
                    {Math.round(insight.confidence * 100)}% confidence
                  </span>
                  <span className="assistant-insight__timestamp">
                    {formatTime(insight.timestamp)}
                  </span>
                </div>
              </div>
              
              <h4 className="assistant-insight__title">{insight.title}</h4>
              
              <div className="assistant-insight__content">
                {insight.content}
              </div>
              
              {insight.tags.length > 0 && (
                <div className="assistant-insight__tags">
                  {insight.tags.map((tag, index) => (
                    <span key={index} className="assistant-insight__tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
          
          {insights.length === 0 && !isGenerating && (
            <div className="assistant-pane__empty">
              <div className="assistant-pane__empty-icon">💡</div>
              <div className="assistant-pane__empty-text">
                <h4>Ready to assist</h4>
                <p>Send a message in the chat to get AI-powered business insights and recommendations.</p>
              </div>
            </div>
          )}
          
          <div ref={insightsEndRef} />
        </div>
      </GlassCard>
    </div>
  );
}

export default AssistantPane;

// Content spacing fix - no overlap with header
