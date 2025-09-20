"use client";

import { useMemo } from "react";
import type { Insight, SlaMetric } from "@nativeiq/types";
import { GlassCard, MetricTile, Badge } from "@nativeiq/ui";

type SalesDashboardProps = {
  insights: Insight[];
  slaMetrics: SlaMetric[];
  className?: string;
};

export function SalesDashboard({ insights, slaMetrics, className }: SalesDashboardProps) {
  const salesMetrics = useMemo(
    () => [
      {
        label: "Monthly Sales",
        value: "$45K",
        delta: "+12% vs last month",
        intent: "positive" as const
      },
      {
        label: "Pipeline Value",
        value: "$135K",
        delta: "12 active deals",
        intent: "positive" as const
      },
      {
        label: "Conversion Rate",
        value: "18%",
        delta: "Target 25%",
        intent: "warning" as const
      },
      {
        label: "Avg Deal Size",
        value: "$3.8K",
        delta: "+$300 vs last month",
        intent: "positive" as const
      }
    ],
    [slaMetrics]
  );

  const pipelineData = [
    { stage: "Prospects", count: 28, value: "$135K", color: "#6366F1" },
    { stage: "Qualified", count: 15, value: "$78K", color: "#8B5CF6" },
    { stage: "Proposal", count: 6, value: "$28K", color: "#EC4899" },
    { stage: "Closing", count: 3, value: "$15K", color: "#10B981" }
  ];

  const topDeals = [
    { company: "TechStart Inc", value: "$13.5K", stage: "At Risk", priority: "critical" },
    { company: "LocalBiz Co", value: "$6.8K", stage: "Proposal", priority: "high" },
    { company: "StartupXYZ", value: "$4.2K", stage: "Qualified", priority: "medium" }
  ];

  const salesInsights = insights.filter(insight => 
    insight.title.toLowerCase().includes('sales') || 
    insight.title.toLowerCase().includes('customer') ||
    insight.title.toLowerCase().includes('revenue')
  ).slice(0, 2);

  return (
    <div className={`sales-dashboard ${className || ""}`}>
      {/* Sales Metrics */}
      <div className="sales-dashboard__section">
        <GlassCard
          title="Sales Performance"
          caption="Revenue and pipeline metrics"
          className="sales-dashboard__card"
        >
          <div className="sales-metrics-grid">
            {salesMetrics.map((metric) => (
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

      {/* Pipeline & Deals */}
      <div className="sales-dashboard__charts">
        <div className="sales-dashboard__chart-row">
          <GlassCard
            title="Sales Pipeline"
            caption="Deal progression and values"
            className="sales-dashboard__card sales-dashboard__card--chart"
          >
            <div className="pipeline-overview">
              {pipelineData.map((stage) => (
                <div key={stage.stage} className="pipeline-stage">
                  <div className="pipeline-stage__header">
                    <span className="pipeline-stage__name">{stage.stage}</span>
                    <span className="pipeline-stage__count">{stage.count}</span>
                  </div>
                  <div 
                    className="pipeline-stage__bar"
                    style={{ backgroundColor: stage.color }}
                  >
                    <span className="pipeline-stage__value">{stage.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard
            title="Top Deals"
            caption="Deals requiring attention"
            className="sales-dashboard__card sales-dashboard__card--chart"
          >
            <div className="top-deals-list">
              {topDeals.map((deal, index) => (
                <div key={index} className="deal-item">
                  <div className="deal-item__header">
                    <span className="deal-item__company">{deal.company}</span>
                    <Badge className={`deal-priority deal-priority--${deal.priority}`}>
                      {deal.priority}
                    </Badge>
                  </div>
                  <div className="deal-item__details">
                    <span className="deal-item__value">{deal.value}</span>
                    <span className="deal-item__stage">{deal.stage}</span>
                  </div>
                  {deal.priority === 'critical' && (
                    <div className="deal-item__alert">
                      🚨 Renewal at risk - needs immediate attention
                    </div>
                  )}
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Sales Insights */}
      <div className="sales-dashboard__insights">
        <GlassCard
          title="Sales Insights"
          caption="AI-powered recommendations for pipeline growth"
          className="sales-dashboard__card"
        >
          <div className="sales-insights-list">
            {salesInsights.length > 0 ? salesInsights.map((insight) => (
              <div key={insight.id} className="sales-insight-item">
                <div className="sales-insight-item__header">
                  <h4 className="sales-insight-item__title">{insight.title}</h4>
                  <Badge className="sales-insight-item__confidence">
                    {Math.round(insight.confidence * 100)}% confidence
                  </Badge>
                </div>
                <p className="sales-insight-item__summary">{insight.summary}</p>
                <div className="sales-insight-item__actions">
                  {insight.suggestedActions?.map((action) => (
                    <button 
                      key={action.id} 
                      className={`sales-action ${action.intent === 'primary' ? 'primary' : 'secondary'}`}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            )) : (
              <div className="sales-insight-item">
                <div className="sales-insight-item__header">
                  <h4 className="sales-insight-item__title">Focus on TechStart renewal</h4>
                  <Badge className="sales-insight-item__confidence">High Priority</Badge>
                </div>
                <p className="sales-insight-item__summary">
                  TechStart represents 30% of MRR and is requesting a 40% discount. Consider value-based negotiation strategy.
                </p>
                <div className="sales-insight-item__actions">
                  <button className="sales-action primary">Schedule Call</button>
                  <button className="sales-action secondary">Prepare Proposal</button>
                </div>
              </div>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
