"use client";

import { useMemo, useState } from "react";
import type { Approval, Insight, Task, SlaMetric } from "@nativeiq/types";
import {
  CommandPalette,
  GlassCard,
  ThemeControls,
  Button,
  MetricTile,
  InsightCard,
  Badge
} from "@nativeiq/ui";
import { formatRelativeTime, formatAsPercent } from "@nativeiq/utils";

type LiquidDashboardProps = {
  insights: Insight[];
  tasks: Task[];
  approvals: Approval[];
  slaMetrics: SlaMetric[];
};

export default function LiquidDashboard({ insights, tasks, approvals, slaMetrics }: LiquidDashboardProps) {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [query, setQuery] = useState("");

  const commands = useMemo(
    () => [
      {
        id: "command-open-command-center",
        title: "Run automation",
        subtitle: "Trigger a policy-approved MCP workflow",
        shortcut: "g+a"
      },
      {
        id: "command-share-insight",
        title: "Share latest insight",
        subtitle: insights[0]?.title ?? "",
        shortcut: "s+i"
      },
      {
        id: "command-open-approvals",
        title: "Jump to approvals queue",
        shortcut: "g+q"
      }
    ],
    [insights]
  );

  // Strategic Metrics (Top Row)
  const strategicMetrics = useMemo(
    () => [
      {
        label: "Revenue Growth",
        value: "+24%",
        delta: "vs last quarter",
        intent: "positive" as const
      },
      {
        label: "Customer Satisfaction",
        value: "94%",
        delta: "Target 95%",
        intent: "positive" as const
      },
      {
        label: "System Uptime",
        value: "99.8%",
        delta: "SLA 99.5%",
        intent: "positive" as const
      },
      {
        label: "Response Time",
        value: "1.2s",
        delta: "Target <2s",
        intent: "positive" as const
      }
    ],
    [slaMetrics]
  );

  // Growth Metrics (Separate Row)
  const growthMetrics = useMemo(
    () => [
      {
        label: "New Customers",
        value: "47",
        delta: "+18% this month",
        intent: "positive" as const
      },
      {
        label: "Conversion Rate",
        value: "12.4%",
        delta: "vs 9.8% last month",
        intent: "positive" as const
      },
      {
        label: "Churn Rate",
        value: "3.2%",
        delta: "Target <5%",
        intent: "positive" as const
      },
      {
        label: "LTV/CAC Ratio",
        value: "4.2x",
        delta: "Healthy >3x",
        intent: "positive" as const
      }
    ],
    [slaMetrics]
  );

  // Recommendations based on current metrics and insights
  const recommendations = useMemo(() => [
    {
      id: "rec-1",
      title: "Optimize Customer Onboarding",
      description: "Implement automated welcome sequence to improve first-week engagement by 25%",
      priority: "high" as const,
      impact: "revenue",
      estimatedValue: "+$15K/month",
      action: "Review Flow"
    },
    {
      id: "rec-2", 
      title: "Scale Support Operations",
      description: "Add 2 support agents to handle 40% increase in ticket volume",
      priority: "medium" as const,
      impact: "satisfaction",
      estimatedValue: "+8% CSAT",
      action: "Plan Hiring"
    },
    {
      id: "rec-3",
      title: "Infrastructure Optimization",
      description: "Migrate to serverless architecture to reduce costs by 30%",
      priority: "medium" as const,
      impact: "cost",
      estimatedValue: "-$8K/month",
      action: "Technical Review"
    }
  ], [insights, slaMetrics]);

  return (
    <div className="liquid-dashboard">
      {/* Floating Header */}
      <div className="liquid-dashboard__header">
        <div className="liquid-header-content">
          <div className="liquid-header__title-section">
            <h1 className="liquid-header__title">NativeIQ Dashboard</h1>
            <p className="liquid-header__subtitle">Intelligent business insights powered by AI</p>
          </div>
          <div className="liquid-header__actions">
            <ThemeControls />
            <Button 
              variant="primary" 
              onClick={() => setPaletteOpen(true)}
              className="liquid-command-button"
            >
              ⌘K Command
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="liquid-dashboard__content">
        
        {/* Strategic Metrics Row */}
        <section className="liquid-section liquid-section--metrics">
          <div className="liquid-section__header">
            <h2 className="liquid-section__title">Strategic Overview</h2>
            <p className="liquid-section__subtitle">Key performance indicators</p>
          </div>
          <div className="liquid-metrics-grid liquid-metrics-grid--strategic">
            {strategicMetrics.map((metric) => (
              <div key={metric.label} className="liquid-metric-card">
                <MetricTile
                  label={metric.label}
                  value={metric.value}
                  delta={metric.delta}
                  intent={metric.intent}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Growth Metrics Row */}
        <section className="liquid-section liquid-section--growth">
          <div className="liquid-section__header">
            <h2 className="liquid-section__title">Growth Metrics</h2>
            <p className="liquid-section__subtitle">Customer acquisition & retention</p>
          </div>
          <div className="liquid-metrics-grid liquid-metrics-grid--growth">
            {growthMetrics.map((metric) => (
              <div key={metric.label} className="liquid-metric-card">
                <MetricTile
                  label={metric.label}
                  value={metric.value}
                  delta={metric.delta}
                  intent={metric.intent}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Main Content Area */}
        <div className="liquid-main-grid">
          
          {/* Insights Panel */}
          <section className="liquid-panel liquid-panel--insights">
            <GlassCard
              title="AI Insights"
              caption="Real-time analysis from connected systems"
              className="liquid-glass-card"
            >
              <div className="liquid-insights-grid">
                {insights.slice(0, 3).map((insight) => (
                  <InsightCard
                    key={insight.id}
                    insight={insight}
                    footer={<span className="liquid-insight-footer">AI-powered analysis</span>}
                  />
                ))}
              </div>
            </GlassCard>
          </section>

          {/* Recommendations Panel */}
          <section className="liquid-panel liquid-panel--recommendations">
            <GlassCard
              title="AI Recommendations"
              caption="Actionable insights to drive growth"
              className="liquid-glass-card"
            >
              <div className="liquid-recommendations-list">
                {recommendations.map((rec) => (
                  <div key={rec.id} className="liquid-recommendation-item">
                    <div className="liquid-recommendation__header">
                      <h4 className="liquid-recommendation__title">{rec.title}</h4>
                      <Badge 
                        className={`liquid-recommendation__priority liquid-recommendation__priority--${rec.priority}`}
                      >
                        {rec.priority} priority
                      </Badge>
                    </div>
                    <p className="liquid-recommendation__description">
                      {rec.description}
                    </p>
                    <div className="liquid-recommendation__footer">
                      <div className="liquid-recommendation__impact">
                        <span className="liquid-recommendation__impact-label">Impact:</span>
                        <span className="liquid-recommendation__impact-value">{rec.estimatedValue}</span>
                      </div>
                      <Button 
                        variant="secondary" 
                        size="sm"
                        className="liquid-recommendation__action"
                      >
                        {rec.action}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </section>

          {/* Tasks & Approvals */}
          <section className="liquid-panel liquid-panel--tasks">
            <GlassCard
              title="Active Tasks"
              caption={`${tasks.length} pending items`}
              className="liquid-glass-card"
            >
              <div className="liquid-tasks-list">
                {tasks.slice(0, 5).map((task) => (
                  <div key={task.id} className="liquid-task-item">
                    <div className="liquid-task__content">
                      <h5 className="liquid-task__title">{task.title}</h5>
                      <p className="liquid-task__meta">
                        Due {formatRelativeTime(task.dueDate)} • {task.owner}
                      </p>
                    </div>
                    <Badge className={`liquid-task__priority liquid-task__priority--${task.priority}`}>
                      {task.priority}
                    </Badge>
                  </div>
                ))}
              </div>
            </GlassCard>
          </section>

          {/* Approvals Panel */}
          <section className="liquid-panel liquid-panel--approvals">
            <GlassCard
              title="Pending Approvals"
              caption={`${approvals.length} items need attention`}
              className="liquid-glass-card"
            >
              <div className="liquid-approvals-list">
                {approvals.slice(0, 4).map((approval) => (
                  <div key={approval.id} className="liquid-approval-item">
                    <div className="liquid-approval__content">
                      <h5 className="liquid-approval__summary">{approval.summary}</h5>
                      <p className="liquid-approval__meta">
                        Requested {formatRelativeTime(approval.requestedAt)} by {approval.requestedBy}
                      </p>
                    </div>
                    <div className="liquid-approval__actions">
                      <Button variant="primary" size="sm">Approve</Button>
                      <Button variant="secondary" size="sm">Review</Button>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </section>

        </div>
      </div>

      {/* Command Palette */}
      <CommandPalette
        open={paletteOpen}
        onOpenChange={setPaletteOpen}
        commands={commands}
        query={query}
        onQueryChange={setQuery}
      />

      {/* Liquid Glass Background Effects */}
      <div className="liquid-background">
        <div className="liquid-orb liquid-orb--1"></div>
        <div className="liquid-orb liquid-orb--2"></div>
        <div className="liquid-orb liquid-orb--3"></div>
      </div>
    </div>
  );
}
