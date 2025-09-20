"use client";

import type { Approval } from "@nativeiq/types";
import { GlassCard, Badge, Button } from "@nativeiq/ui";
import { formatRelativeTime } from "@nativeiq/utils";

export function ApprovalsPanel({ approvals }: { approvals: Approval[] }) {
  return (
    <GlassCard
      title="Approvals"
      caption="Policy-backed human approvals with SLA tracking"
      actionSlot={<Button variant="ghost">Open queue</Button>}
    >
      <ul className="approvals-list" role="list">
        {approvals.map((approval) => (
          <li key={approval.id} className="approvals-list__item">
            <div>
              <div className="approvals-list__summary">{approval.summary}</div>
              <div className="approvals-list__meta">
                <Badge tone="warning">SLA {approval.slaMinutes}m</Badge>
                <span>Requested by {approval.requester}</span>
                <span>{formatRelativeTime(approval.requestedAt)}</span>
              </div>
            </div>
            <div className="approvals-list__actions">
              <Button variant="primary">Approve</Button>
              <Button variant="ghost">View rationale</Button>
            </div>
          </li>
        ))}
      </ul>
    </GlassCard>
  );
}
