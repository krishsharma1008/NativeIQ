"use client";

import { useMemo } from "react";
import type { Insight, SlaMetric } from "@nativeiq/types";
import { GlassCard, MetricTile, Badge } from "@nativeiq/ui";

type OperationsDashboardProps = {
  insights: Insight[];
  slaMetrics: SlaMetric[];
  className?: string;
};

export function OperationsDashboard({ insights, slaMetrics, className }: OperationsDashboardProps) {
  const operationsMetrics = useMemo(
    () => [
      {
        label: "Monthly Costs",
        value: "$12.8K",
        delta: "vs $12K budget",
        intent: "warning" as const
      },
      {
        label: "Team Efficiency",
        value: "78%",
        delta: "Target 85%",
        intent: "warning" as const
      },
      {
        label: "Process Automation",
        value: "42%",
        delta: "Goal 60%",
        intent: "neutral" as const
      },
      {
        label: "Cost per Customer",
        value: "$101",
        delta: "-5% vs last month",
        intent: "positive" as const
      }
    ],
    [slaMetrics]
  );

  const costBreakdown = [
    { category: "Software & Tools", amount: "$3.8K", percentage: 30, color: "#6366F1" },
    { category: "Team Salaries", amount: "$6.2K", percentage: 48, color: "#8B5CF6" },
    { category: "Infrastructure", amount: "$1.6K", percentage: 13, color: "#EC4899" },
    { category: "Marketing", amount: "$1.2K", percentage: 9, color: "#10B981" }
  ];

  const processEfficiency = [
    { process: "Customer Onboarding", efficiency: 65, target: 85, status: "needs improvement" },
    { process: "Support Ticket Resolution", efficiency: 78, target: 80, status: "on track" },
    { process: "Sales Lead Processing", efficiency: 82, target: 75, status: "exceeding" },
    { process: "Invoice Processing", efficiency: 95, target: 90, status: "exceeding" }
  ];

  const operationsInsights = insights.filter(insight => 
    insight.title.toLowerCase().includes('onboarding') || 
    insight.title.toLowerCase().includes('process') ||
    insight.title.toLowerCase().includes('efficiency') ||
    insight.owner === 'Operations Lead'
  ).slice(0, 2);

  return (
    <div className={`operations-dashboard ${className || ""}`}>
      {/* Operations Metrics */}
      <div className="operations-dashboard__section">
        <GlassCard
          title="Operations Health"
          caption="Cost management and efficiency tracking"
          className="operations-dashboard__card"
        >
          <div className="operations-metrics-grid">
            {operationsMetrics.map((metric) => (
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

      {/* Cost & Process Analysis */}
      <div className="operations-dashboard__charts">
        <div className="operations-dashboard__chart-row">
          <GlassCard
            title="Cost Breakdown"
            caption="Monthly expense analysis"
            className="operations-dashboard__card operations-dashboard__card--chart"
          >
            <div className="cost-breakdown">
              {costBreakdown.map((cost) => (
                <div key={cost.category} className="cost-item">
                  <div className="cost-item__header">
                    <span className="cost-item__category">{cost.category}</span>
                    <span className="cost-item__percentage">{cost.percentage}%</span>
                  </div>
                  <div 
                    className="cost-item__bar"
                    style={{ 
                      backgroundColor: cost.color,
                      width: `${cost.percentage}%`
                    }}
                  >
                    <span className="cost-item__amount">{cost.amount}</span>
                  </div>
                </div>
              ))}
              <div className="cost-summary">
                <div className="cost-summary__item">
                  <span>Total Monthly Cost:</span>
                  <span className="cost-summary__total">$12.8K</span>
                </div>
                <div className="cost-summary__item cost-summary__item--warning">
                  <span>Over Budget:</span>
                  <span className="cost-summary__over">+$0.8K</span>
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard
            title="Process Efficiency"
            caption="Operational performance tracking"
            className="operations-dashboard__card operations-dashboard__card--chart"
          >
            <div className="process-efficiency">
              {processEfficiency.map((process) => (
                <div key={process.process} className="process-item">
                  <div className="process-item__header">
                    <span className="process-item__name">{process.process}</span>
                    <Badge className={`process-status process-status--${process.status.replace(' ', '-')}`}>
                      {process.status}
                    </Badge>
                  </div>
                  <div className="process-item__metrics">
                    <div className="process-item__current">{process.efficiency}%</div>
                    <div className="process-item__target">Target: {process.target}%</div>
                  </div>
                  <div className="process-item__bar">
                    <div 
                      className="process-item__progress"
                      style={{ 
                        width: `${(process.efficiency / 100) * 100}%`,
                        backgroundColor: process.efficiency >= process.target ? '#10B981' : '#F59E0B'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Operations Insights */}
      <div className="operations-dashboard__insights">
        <GlassCard
          title="Operations Insights"
          caption="Process improvements and cost optimization"
          className="operations-dashboard__card"
        >
          <div className="operations-insights-list">
            {operationsInsights.length > 0 ? operationsInsights.map((insight) => (
              <div key={insight.id} className="operations-insight-item">
                <div className="operations-insight-item__header">
                  <h4 className="operations-insight-item__title">{insight.title}</h4>
                  <Badge className="operations-insight-item__confidence">
                    {Math.round(insight.confidence * 100)}% confidence
                  </Badge>
                </div>
                <p className="operations-insight-item__summary">{insight.summary}</p>
                <div className="operations-insight-item__actions">
                  {insight.suggestedActions?.map((action) => (
                    <button 
                      key={action.id} 
                      className={`operations-action ${action.intent === 'primary' ? 'primary' : 'secondary'}`}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            )) : (
              <div className="operations-insight-item">
                <div className="operations-insight-item__header">
                  <h4 className="operations-insight-item__title">Cost optimization opportunity</h4>
                  <Badge className="operations-insight-item__confidence">High Impact</Badge>
                </div>
                <p className="operations-insight-item__summary">
                  Monthly costs are $2K over budget. Consider consolidating software tools and automating manual processes to reduce overhead.
                </p>
                <div className="operations-insight-item__actions">
                  <button className="operations-action primary">Review Tools</button>
                  <button className="operations-action secondary">Automation Plan</button>
                </div>
              </div>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
