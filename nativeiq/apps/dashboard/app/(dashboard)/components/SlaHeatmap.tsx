"use client";

import type { SlaMetric } from "@nativeiq/types";
import { GlassCard } from "@nativeiq/ui";
import { clamp } from "@nativeiq/utils";

export function SlaHeatmap({ metrics }: { metrics: SlaMetric[] }) {
  return (
    <GlassCard
      title="SLA Heatmap"
      caption="Realtime pulse across approvals, insights, and nudges"
    >
      <div className="sla-heatmap" role="list">
        {metrics.map((metric) => {
          const ratio = clamp(metric.value / metric.target, 0, 2);
          return (
            <div key={metric.label} role="listitem" className="sla-heatmap__tile">
              <div
                className="sla-heatmap__swatch"
                style={{
                  background: `linear-gradient(135deg, rgba(255,62,165,${0.3 * ratio}), rgba(255,138,91,${0.2 * ratio}))`
                }}
              />
              <div className="sla-heatmap__body">
                <span className="sla-heatmap__label">{metric.label}</span>
                <span className="sla-heatmap__value">
                  {typeof metric.value === "number" ? metric.value.toLocaleString() : metric.value}
                  <small>{metric.unit}</small>
                </span>
                <span className="sla-heatmap__target">Target {metric.target}</span>
              </div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
