# 03 — Frontend Spec

## Surfaces
1) Slack Home Tab
   - Sections: My Tasks, Today’s Insights, Nudges, Approvals
   - Actions: open thread viewers, approve automations, quick assign

2) Web Dashboard (Next.js)
   - AI Canvas (blocks): InsightCard, DecisionLog, TaskList, SLAHeatmap, RiskRadar, ThreadViewer, DocPreview, ActionPanel
   - Command Palette (⌘K): ask → act (MCP tools)
   - Explainability: “Why you see this” + source links (Slack deep links)
   - Realtime: WS push; optimistic updates

## UI/UX Rules
- Dark-first, 12-column grid, spacing 8/12/16
- Cards: rounded-2xl, subtle shadow, motion on hover (Framer Motion)
- Status colors via design tokens only (no hard-coding)
- Minimal clicks, keyboard-first (palette + shortcuts)

## Frontend Architecture
- Next.js 15 App Router, tRPC for type-safe RPC, WebSockets for live updates
- shadcn/ui + Tailwind design tokens; Framer Motion animations
- Feature modules: insights, tasks, approvals, settings
- State: server components + client islands; react-query for client cache where needed

## Accessibility
- WCAG AA; high-contrast theme option; reduced motion setting

## Telemetry
- Frontend spans for user actions; error boundary with user-safe reporting
