"use client";

import { useMemo, useState } from "react";
import type { Approval, Insight, Task, SlaMetric } from "@nativeiq/types";
import {
  CommandPalette,
  GlassCard,
  NavigationRail,
  ThemeControls,
  Button,
  MetricTile,
  InsightCard
} from "@nativeiq/ui";
import { formatRelativeTime, formatAsPercent } from "@nativeiq/utils";
import { DashboardHeader } from "./DashboardHeader";
import { TaskList } from "./TaskList";
import { ApprovalsPanel } from "./ApprovalsPanel";
import { RiskRadar } from "./RiskRadar";
import { SlaHeatmap } from "./SlaHeatmap";

const navItems = [
  { id: "nav-insights", label: "Insights", icon: "✨", active: true },
  { id: "nav-tasks", label: "Tasks", icon: "✅" },
  { id: "nav-approvals", label: "Approvals", icon: "⚡" },
  { id: "nav-sources", label: "Sources", icon: "🔗" },
  { id: "nav-settings", label: "Settings", icon: "⚙" }
];

type DashboardRootProps = {
  insights: Insight[];
  tasks: Task[];
  approvals: Approval[];
  slaMetrics: SlaMetric[];
};

export default function DashboardRoot({ insights, tasks, approvals, slaMetrics }: DashboardRootProps) {
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
        title: "Share latest risk insight",
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

  const kpiMetrics = useMemo(
    () => [
      {
        label: "Exec escalations stabilized",
        value: "-32%",
        delta: "vs last week",
        intent: "positive" as const
      },
      {
        label: "Average resolution",
        value: "11m",
        delta: "Target 8m",
        intent: "neutral" as const
      },
      {
        label: "Automation coverage",
        value: formatAsPercent(slaMetrics.find((m) => m.label === "Automation coverage")?.value ?? 0.64, 0),
        delta: "Goal 75%",
        intent: "warning" as const
      }
    ],
    [slaMetrics]
  );

  return (
    <div className="dashboard-shell" role="application">
      <NavigationRail items={navItems} className="dashboard-shell__rail" />
      <div className="dashboard-shell__canvas" role="main">
        <div className="canvas-span-12">
          <DashboardHeader onOpenPalette={() => setPaletteOpen(true)} />
        </div>

        <div className="canvas-span-8">
          <GlassCard
            title="Today’s Insights"
            caption="Smart summaries from Slack, MCP tools, and connected systems"
            actionSlot={<ThemeControls />}
          >
            <div className="insights-grid">
              {insights.map((insight) => (
                <InsightCard
                  key={insight.id}
                  insight={insight}
                  footer={<span>Why you see this: policy & activity signals</span>}
                />
              ))}
            </div>
          </GlassCard>
        </div>

        <div className="canvas-span-4">
          <GlassCard
            title="KPI Pulse"
            caption="Telemetry looks across policy, tasks, and insights"
          >
            <div className="kpi-grid">
              {kpiMetrics.map((metric) => (
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

        <div className="canvas-span-6">
          <TaskList tasks={tasks} />
        </div>

        <div className="canvas-span-6">
          <ApprovalsPanel approvals={approvals} />
        </div>

        <div className="canvas-span-6">
          <RiskRadar insights={insights} />
        </div>

        <div className="canvas-span-6">
          <SlaHeatmap metrics={slaMetrics} />
        </div>
      </div>

      <aside className="dashboard-shell__command-panel" aria-label="Action panel">
        <GlassCard
          title="Action Panel"
          caption="Every control has policy guardrails"
          actionSlot={
            <Button variant="primary" onClick={() => setPaletteOpen(true)}>
              Open Command Palette
            </Button>
          }
        >
          <ul className="action-panel__list">
            {approvals.slice(0, 3).map((approval) => (
              <li key={approval.id}>
                <div className="action-panel__item">
                  <span>{approval.summary}</span>
                  <span className="muted">{formatRelativeTime(approval.requestedAt)}</span>
                </div>
              </li>
            ))}
          </ul>
        </GlassCard>

        <GlassCard title="Explainability" caption="Grounding for the AI Canvas">
          <p className="muted">
            Every recommendation shows Slack threads, MCP tool outputs, and policy checks. Use ⌘K to inspect the
            underlying signals before acting.
          </p>
        </GlassCard>
      </aside>

      <CommandPalette
        open={paletteOpen}
        onOpenChange={setPaletteOpen}
        commands={commands}
        query={query}
        onQueryChange={setQuery}
      />
    </div>
  );
}
