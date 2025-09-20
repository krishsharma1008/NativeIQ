"use client";

import { Button } from "@nativeiq/ui";
import { useTheme } from "@nativeiq/ui";

export function DashboardHeader({ onOpenPalette }: { onOpenPalette: () => void }) {
  const { mode } = useTheme();
  return (
    <div className="dashboard-header">
      <div>
        <h1>NativeIQ Command Center</h1>
        <p className="muted">
          Operate faster with AI copilots that respect policy and explain every action. Current theme: {mode}.
        </p>
      </div>
      <div className="dashboard-header__actions">
        <Button variant="secondary" onClick={onOpenPalette}>
          ⌘K Command Palette
        </Button>
        <Button variant="ghost">Live Status</Button>
      </div>
    </div>
  );
}
