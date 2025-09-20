"use client";

import type { Insight } from "@nativeiq/types";
import { GlassCard } from "@nativeiq/ui";
import { useMemo } from "react";

const axes: Insight["type"][] = ["risk", "blocker", "decision", "trend", "summary"];

function polarToCartesian(angle: number, radius: number) {
  const rads = (Math.PI / 180) * angle;
  const x = 0.5 + radius * Math.sin(rads);
  const y = 0.5 - radius * Math.cos(rads);
  return { x, y };
}

export function RiskRadar({ insights }: { insights: Insight[] }) {
  const series = useMemo(() => {
    const totals = Object.fromEntries(axes.map((axis) => [axis, 0])) as Record<Insight["type"], number>;
    insights.forEach((insight) => {
      totals[insight.type] += insight.confidence;
    });
    return axes.map((axis) => totals[axis] / Math.max(insights.length, 1));
  }, [insights]);

  const polygon = series
    .map((value, index) => {
      const angle = (360 / axes.length) * index;
      const { x, y } = polarToCartesian(angle, 0.35 + value * 0.25);
      return `${x * 100},${y * 100}`;
    })
    .join(" ");

  return (
    <GlassCard
      title="Risk Radar"
      caption="Confidence-weighted signal mix across live insights"
    >
      <div className="risk-radar">
        <svg viewBox="0 0 100 100" role="presentation" aria-hidden>
          <defs>
            <radialGradient id="radarGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(255, 62, 165, 0.35)" />
              <stop offset="100%" stopColor="rgba(10, 12, 16, 0.1)" />
            </radialGradient>
          </defs>
          {[0.2, 0.35, 0.5].map((radius) => (
            <circle key={radius} cx="50" cy="50" r={radius * 100} fill="none" stroke="rgba(255,255,255,0.08)" />
          ))}
          {axes.map((axis, index) => {
            const angle = (360 / axes.length) * index;
            const { x, y } = polarToCartesian(angle, 0.5);
            return (
              <g key={axis}>
                <line x1="50" y1="50" x2={x * 100} y2={y * 100} stroke="rgba(255,255,255,0.08)" />
                <text x={x * 100} y={y * 100} className="risk-radar__label">
                  {axis.toUpperCase()}
                </text>
              </g>
            );
          })}
          <polygon points={polygon} fill="url(#radarGradient)" stroke="var(--color-accent-primary)" strokeWidth="1.2" fillOpacity="0.7" />
        </svg>
      </div>
    </GlassCard>
  );
}
