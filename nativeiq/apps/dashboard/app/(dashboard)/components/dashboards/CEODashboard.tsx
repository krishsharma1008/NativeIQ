"use client";

import { useMemo } from "react";
import type { Insight, SlaMetric } from "@nativeiq/types";
import { GlassCard, MetricTile, Badge } from "@nativeiq/ui";

type CEODashboardProps = {
  insights: Insight[];
  slaMetrics: SlaMetric[];
  className?: string;
};

export function CEODashboard({ insights, slaMetrics, className }: CEODashboardProps) {
  const ceoMetrics = useMemo(
    () => [
      {
        label: "Monthly Revenue",
        value: "$45K",
        delta: "+12% vs last month",
        intent: "positive" as const
      },
      {
        label: "Cash Runway",
        value: "3.2mo",
        delta: "Critical - need action",
        intent: "warning" as const
      },
      {
        label: "Monthly Churn",
        value: "8%",
        delta: "Target <5%",
        intent: "warning" as const
      }
    ],
    [slaMetrics]
  );

  const strategicInsights = insights.filter(insight => 
    insight.impact === "critical" || insight.impact === "high"
  ).slice(0, 2);

  // AI-powered recommendations based on current metrics
  const recommendations = [
    {
      id: "rec-1",
      title: "🚨 Immediate Cash Flow Action Required",
      priority: "critical",
      description: "With only 3.2 months runway, consider immediate cost reduction or revenue acceleration.",
      actions: ["Cut non-essential expenses", "Accelerate collections", "Explore bridge financing"],
      impact: "Extends runway to 5+ months"
    },
    {
      id: "rec-2", 
      title: "💰 TechStart Retention Strategy",
      priority: "high",
      description: "30% of MRR at risk. Develop retention package with added value instead of price cuts.",
      actions: ["Offer premium support", "Add feature bundle", "Provide training credits"],
      impact: "Retain $13.5K MRR + strengthen relationship"
    },
    {
      id: "rec-3",
      title: "📈 Growth Acceleration Opportunity", 
      priority: "medium",
      description: "Strong 8.8:1 LTV:CAC ratio suggests room for increased marketing investment.",
      actions: ["Increase marketing spend", "Hire sales rep", "Launch referral program"],
      impact: "Potential +25% MRR growth"
    }
  ];

  const quickSignals = [
    { label: "MRR Growth", value: "+12%", delta: "This month", intent: "positive" as const },
    { label: "Burn Rate", value: "$12.8K/mo", delta: "Stable", intent: "neutral" as const }
  ];

  return (
    <div className={`ceo-dashboard ${className || ""}`}>
      {/* KPI Pulse */}
      <div className="ceo-dashboard__section">
        <GlassCard
          title="KPI Pulse"
          caption="Most important signals at a glance"
          className="ceo-dashboard__card"
        >
          <div className="ceo-metrics-grid">
            {ceoMetrics.map((metric) => (
              <MetricTile
                key={metric.label}
                label={metric.label}
                value={metric.value}
                delta={metric.delta}
                intent={metric.intent}
              />
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Strategic Overview */}
      <div className="ceo-dashboard__charts">
        <div className="ceo-dashboard__chart-row">
          <GlassCard title="Quick Signals" caption="Trends to watch" className="ceo-dashboard__card">
            <div className="ceo-metrics-grid">
              {quickSignals.map((metric) => (
                <MetricTile
                  key={metric.label}
                  label={metric.label}
                  value={metric.value}
                  delta={metric.delta}
                  intent={metric.intent}
                />
              ))}
            </div>
          </GlassCard>

          <GlassCard title="Cash Flow Alert" caption="Runway focus" className="ceo-dashboard__card ceo-dashboard__card--chart">
            <div className="cash-flow-chart">
              <div className="cash-flow-warning">
                <div className="cash-flow-warning__icon">⚠️</div>
                <div className="cash-flow-warning__content">
                  <div className="cash-flow-warning__title">Critical: 3.2mo runway</div>
                  <div className="cash-flow-warning__message">Burn: $12.8K/mo — target +$18K MRR or reduce costs.</div>
                </div>
              </div>
              <div className="cash-flow-actions">
                <button className="cash-flow-action">Review Expenses</button>
                <button className="cash-flow-action">Growth Plan</button>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Strategic Insights */}
      <div className="ceo-dashboard__insights">
        <GlassCard
          title="Strategic Priorities"
          caption="Critical decisions requiring CEO attention"
          className="ceo-dashboard__card"
        >
          <div className="strategic-insights-list">
            {strategicInsights.map((insight) => (
              <div key={insight.id} className="strategic-insight-item">
                <div className="strategic-insight-item__header">
                  <h4 className="strategic-insight-item__title">{insight.title}</h4>
                  <Badge className="strategic-insight-item__badge">
                    {insight.impact} priority
                  </Badge>
                </div>
                <p className="strategic-insight-item__summary">{insight.summary}</p>
                <div className="strategic-insight-item__actions">
                  {insight.suggestedActions?.map((action) => (
                    <button 
                      key={action.id} 
                      className={`strategic-action ${action.intent === 'primary' ? 'primary' : 'secondary'}`}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
