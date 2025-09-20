"use client";

import { useMemo } from "react";
import type { Insight, SlaMetric } from "@nativeiq/types";
import { GlassCard, MetricTile, Badge } from "@nativeiq/ui";

type CustomerSuccessDashboardProps = {
  insights: Insight[];
  slaMetrics: SlaMetric[];
  className?: string;
};

export function CustomerSuccessDashboard({ insights, slaMetrics, className }: CustomerSuccessDashboardProps) {
  const customerMetrics = useMemo(
    () => [
      {
        label: "Customer Satisfaction",
        value: "4.2/5",
        delta: "Based on 23 surveys",
        intent: "positive" as const
      },
      {
        label: "Response Time",
        value: "4.2h",
        delta: "Target 2h",
        intent: "warning" as const
      },
      {
        label: "Monthly Churn",
        value: "8%",
        delta: "Target <5%",
        intent: "warning" as const
      },
      {
        label: "Ticket Resolution",
        value: "87%",
        delta: "Same day resolution",
        intent: "positive" as const
      }
    ],
    [slaMetrics]
  );

  const supportData = [
    { type: "Open Tickets", count: 23, priority: "high", color: "#EF4444" },
    { type: "In Progress", count: 8, priority: "medium", color: "#F59E0B" },
    { type: "Waiting Response", count: 12, priority: "low", color: "#6B7280" },
    { type: "Resolved Today", count: 15, priority: "success", color: "#10B981" }
  ];

  const customerHealth = [
    { company: "TechStart Inc", health: 25, status: "at risk", value: "$13.5K", issue: "Renewal concerns" },
    { company: "LocalBiz Co", health: 85, status: "healthy", value: "$6.8K", issue: null },
    { company: "StartupXYZ", health: 60, status: "warning", value: "$4.2K", issue: "Usage declining" },
    { company: "GrowthCorp", health: 90, status: "healthy", value: "$3.8K", issue: null }
  ];

  const customerInsights = insights.filter(insight => 
    insight.title.toLowerCase().includes('customer') || 
    insight.title.toLowerCase().includes('support') ||
    insight.title.toLowerCase().includes('churn') ||
    insight.owner === 'Customer Success'
  ).slice(0, 2);

  return (
    <div className={`customer-dashboard ${className || ""}`}>
      {/* Customer Metrics */}
      <div className="customer-dashboard__section">
        <GlassCard
          title="Customer Health"
          caption="Support and satisfaction metrics"
          className="customer-dashboard__card"
        >
          <div className="customer-metrics-grid">
            {customerMetrics.map((metric) => (
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

      {/* Support & Customer Health */}
      <div className="customer-dashboard__charts">
        <div className="customer-dashboard__chart-row">
          <GlassCard
            title="Support Queue"
            caption="Current ticket status"
            className="customer-dashboard__card customer-dashboard__card--chart"
          >
            <div className="support-overview">
              {supportData.map((item) => (
                <div key={item.type} className="support-item">
                  <div className="support-item__header">
                    <span className="support-item__type">{item.type}</span>
                    <span 
                      className="support-item__count"
                      style={{ color: item.color }}
                    >
                      {item.count}
                    </span>
                  </div>
                  <div 
                    className="support-item__bar"
                    style={{ backgroundColor: item.color }}
                  />
                  {item.type === "Open Tickets" && item.count > 20 && (
                    <div className="support-item__alert">
                      🚨 High volume - consider hiring support
                    </div>
                  )}
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard
            title="Customer Health Score"
            caption="Account risk assessment"
            className="customer-dashboard__card customer-dashboard__card--chart"
          >
            <div className="customer-health-list">
              {customerHealth.map((customer) => (
                <div key={customer.company} className="customer-health-item">
                  <div className="customer-health-item__header">
                    <span className="customer-health-item__company">{customer.company}</span>
                    <span className="customer-health-item__value">{customer.value}</span>
                  </div>
                  <div className="customer-health-item__metrics">
                    <div className="customer-health-item__score">
                      <span>Health: {customer.health}%</span>
                      <Badge className={`health-status health-status--${customer.status.replace(' ', '-')}`}>
                        {customer.status}
                      </Badge>
                    </div>
                    <div 
                      className="customer-health-item__bar"
                      style={{ 
                        width: `${customer.health}%`,
                        backgroundColor: customer.health > 70 ? '#10B981' : customer.health > 40 ? '#F59E0B' : '#EF4444'
                      }}
                    />
                  </div>
                  {customer.issue && (
                    <div className="customer-health-item__issue">
                      ⚠️ {customer.issue}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Customer Success Insights */}
      <div className="customer-dashboard__insights">
        <GlassCard
          title="Customer Success Insights"
          caption="Retention and satisfaction improvements"
          className="customer-dashboard__card"
        >
          <div className="customer-insights-list">
            {customerInsights.length > 0 ? customerInsights.map((insight) => (
              <div key={insight.id} className="customer-insight-item">
                <div className="customer-insight-item__header">
                  <h4 className="customer-insight-item__title">{insight.title}</h4>
                  <Badge className="customer-insight-item__confidence">
                    {Math.round(insight.confidence * 100)}% confidence
                  </Badge>
                </div>
                <p className="customer-insight-item__summary">{insight.summary}</p>
                <div className="customer-insight-item__actions">
                  {insight.suggestedActions?.map((action) => (
                    <button 
                      key={action.id} 
                      className={`customer-action ${action.intent === 'primary' ? 'primary' : 'secondary'}`}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            )) : (
              <>
                <div className="customer-insight-item">
                  <div className="customer-insight-item__header">
                    <h4 className="customer-insight-item__title">Support queue needs attention</h4>
                    <Badge className="customer-insight-item__confidence">High Priority</Badge>
                  </div>
                  <p className="customer-insight-item__summary">
                    23 open tickets with 4.2h average response time. Consider hiring part-time support or implementing chatbot for common issues.
                  </p>
                  <div className="customer-insight-item__actions">
                    <button className="customer-action primary">Hire Support</button>
                    <button className="customer-action secondary">Automate FAQ</button>
                  </div>
                </div>
                <div className="customer-insight-item">
                  <div className="customer-insight-item__header">
                    <h4 className="customer-insight-item__title">TechStart needs immediate attention</h4>
                    <Badge className="customer-insight-item__confidence">Critical</Badge>
                  </div>
                  <p className="customer-insight-item__summary">
                    25% health score indicates high churn risk. This customer represents 30% of MRR. Schedule retention call immediately.
                  </p>
                  <div className="customer-insight-item__actions">
                    <button className="customer-action primary">Schedule Call</button>
                    <button className="customer-action secondary">Send Survey</button>
                  </div>
                </div>
              </>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
