import type { Insight, Task, Approval, SlaMetric } from "@nativeiq/types";

export const insights: Insight[] = [
  {
    id: "insight-ops-001",
    type: "decision",
    title: "Prioritize AI triage for Tier-2 escalations",
    summary:
      "Slack volume triggered risk thresholds for Tier-2 customers. Recommend routing through MCP Tasks with on-call override.",
    confidence: 0.94,
    impact: "high",
    owner: "OPS On-Call",
    sources: [
      {
        label: "#cs-escalations thread 11:24",
        url: "https://slack.com/app_redirect?channel=cs-escalations",
        timestamp: new Date().toISOString()
      },
      {
        label: "PagerDuty incident 9812",
        url: "https://pagerduty.com/incidents/9812",
        timestamp: new Date().toISOString()
      }
    ],
    suggestedActions: [
      { id: "action-approve", label: "Approve Auto-Triage", intent: "primary" },
      { id: "action-doc", label: "Open Playbook" }
    ]
  },
  {
    id: "insight-risk-014",
    type: "risk",
    title: "SLA breach risk: ACME renewal approvals slowing",
    summary:
      "Approvals median time moved to 48m (target 15m). 3 high-value renewals need director confirmation before cutoff.",
    confidence: 0.87,
    impact: "critical",
    owner: "Revenue Ops",
    sources: [
      {
        label: "Approvals queue",
        url: "https://nativeiq.ai/approvals",
        timestamp: new Date().toISOString()
      }
    ],
    suggestedActions: [
      { id: "action-ping", label: "Ping Approver", intent: "primary" },
      { id: "action-review", label: "Review Thread" }
    ]
  },
  {
    id: "insight-summary-022",
    type: "summary",
    title: "Summary: Week in AI Nudges",
    summary: "18 nudges auto-resolved. Average response time down 22%. Top topics: onboarding, billing visibility, Slack requests.",
    confidence: 0.78,
    impact: "medium",
    owner: "Automation Guild",
    sources: [
      {
        label: "Weekly digest",
        url: "https://nativeiq.ai/digest",
        timestamp: new Date().toISOString()
      }
    ]
  }
];

export const tasks: Task[] = [
  {
    id: "task-001",
    title: "Review ACME renewal blocker",
    assignee: "Jordan Quinn",
    state: "in_progress",
    dueAt: new Date(Date.now() + 1000 * 60 * 60 * 4).toISOString(),
    priority: "p0",
    sourceInsightId: "insight-risk-014",
    slackPermalink: "https://slack.com/app_redirect?channel=cs-acme&message=xyz"
  },
  {
    id: "task-002",
    title: "Ship explainability copy update",
    assignee: "Mira Patel",
    state: "open",
    dueAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
    priority: "p1",
    sourceInsightId: "insight-summary-022"
  },
  {
    id: "task-003",
    title: "Enable rollout flag for auto triage",
    assignee: "Feature Flag Bot",
    state: "blocked",
    dueAt: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString(),
    priority: "p0",
    sourceInsightId: "insight-ops-001"
  }
];

export const approvals: Approval[] = [
  {
    id: "approval-1001",
    summary: "Discount override for Nimbus Labs",
    requester: "Ivy Flores",
    requestedAt: new Date(Date.now() - 1000 * 60 * 34).toISOString(),
    status: "pending",
    slaMinutes: 15
  },
  {
    id: "approval-1002",
    summary: "Security review waiver — ACME renewal",
    requester: "Ben Holt",
    requestedAt: new Date(Date.now() - 1000 * 60 * 82).toISOString(),
    status: "pending",
    slaMinutes: 30
  }
];

export const slaMetrics: SlaMetric[] = [
  { label: "Median approval time", value: 18, target: 15, unit: "minutes" as const },
  { label: "Insight adoption", value: 0.82, target: 0.9, unit: "%" as const },
  { label: "Automation coverage", value: 0.64, target: 0.75, unit: "%" as const }
];
