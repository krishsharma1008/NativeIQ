"use client";

import { useMemo } from "react";
import type { Insight, SlaMetric } from "@nativeiq/types";
import { GlassCard, MetricTile, Badge } from "@nativeiq/ui";
import { formatAsPercent } from "@nativeiq/utils";
import { RiskRadar } from "./RiskRadar";
import { SlaHeatmap } from "./SlaHeatmap";

type CondensedDashboardProps = {
  insights: Insight[];
  slaMetrics: SlaMetric[];
  className?: string;
};

export function CondensedDashboard({ insights, slaMetrics, className }: CondensedDashboardProps) {
  const keyMetrics = useMemo(
    () => [
      {
        label: "Monthly Revenue",
        value: "$45K",
        delta: "+12% vs last month",
        intent: "positive" as const
      },
      {
        label: "Customer Churn",
        value: "8%",
        delta: "Target <5%",
        intent: "warning" as const
      },
      {
        label: "Cash Runway",
        value: "3.2mo",
        delta: "Need to extend",
        intent: "warning" as const
      }
    ],
    [slaMetrics]
  );

  const topInsights = insights.slice(0, 2);

  return (
    <div className={`condensed-dashboard ${className || ""}`}>
      <div className="condensed-dashboard__metrics">
        <GlassCard
          title="Business Health"
          caption="Key metrics for growth and sustainability"
          className="condensed-dashboard__card"
        >
          <div className="condensed-metrics-grid">
            {keyMetrics.map((metric) => (
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

      <div className="condensed-dashboard__charts">
        <div className="condensed-dashboard__chart-row">
          <GlassCard
            title="Growth Opportunities"
            caption="Areas needing attention"
            className="condensed-dashboard__card condensed-dashboard__card--chart"
          >
            <div className="condensed-chart-container">
              <RiskRadar insights={insights} />
            </div>
          </GlassCard>

          <GlassCard
            title="Performance Tracking"
            caption="Customer and operational metrics"
            className="condensed-dashboard__card condensed-dashboard__card--chart"
          >
            <div className="condensed-chart-container">
              <SlaHeatmap metrics={slaMetrics.slice(0, 3)} />
            </div>
          </GlassCard>
        </div>
      </div>

      <div className="condensed-dashboard__insights">
        <GlassCard
          title="Action Items"
          caption="Priority insights from team discussions"
          className="condensed-dashboard__card"
        >
          <div className="condensed-insights-list">
            {topInsights.map((insight) => (
              <div key={insight.id} className="condensed-insight-item">
                <div className="condensed-insight-item__header">
                  <h4 className="condensed-insight-item__title">{insight.title}</h4>
                  <Badge variant="accent">{insight.confidence}% confidence</Badge>
                </div>
                <p className="condensed-insight-item__summary">{insight.summary}</p>
                <div className="condensed-insight-item__meta">
                  <span className="condensed-insight-item__source">
                    {insight.sources[0]?.name || "Internal"}
                  </span>
                  <span className="condensed-insight-item__priority">
                    {insight.priority} priority
                  </span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
