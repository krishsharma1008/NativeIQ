"use client";

import { useState } from "react";
import type { Approval, Insight, Task, SlaMetric } from "@nativeiq/types";
import { CommandPalette } from "@nativeiq/ui";
import { ChatInterface } from "./ChatInterface";
import { RoleDashboard } from "./RoleDashboard";
import { GlassCard } from "@nativeiq/ui";
import MarketSuggestions from "./market/MarketSuggestions";

interface UserProfile {
  id: string;
  name: string;
  designation: string;
  department: string;
  avatar?: string;
  color: string;
}

// User profiles for SMB demonstration
const USER_PROFILES: UserProfile[] = [
  {
    id: "user1",
    name: "Alex Martinez",
    designation: "Founder & CEO",
    department: "Leadership",
    avatar: "👨‍💼",
    color: "#3B82F6"
  },
  {
    id: "user2",
    name: "Jamie Wilson",
    designation: "Operations Lead",
    department: "Operations",
    avatar: "👩‍💼",
    color: "#8B5CF6"
  },
  {
    id: "user3",
    name: "Taylor Brooks",
    designation: "Customer Success",
    department: "Support",
    avatar: "👩‍💻",
    color: "#06B6D4"
  },
  {
    id: "user4",
    name: "Jordan Lee",
    designation: "Sales Manager",
    department: "Sales",
    avatar: "👨‍🚀",
    color: "#0EA5E9"
  }
];

type SplitScreenLayoutProps = {
  insights: Insight[];
  tasks: Task[];
  approvals: Approval[];
  slaMetrics: SlaMetric[];
};

export default function SplitScreenLayout({ insights, tasks, approvals, slaMetrics }: SplitScreenLayoutProps) {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [liveInsights, setLiveInsights] = useState(insights);
  const [currentUser, setCurrentUser] = useState<UserProfile>(USER_PROFILES[0]);

  const handleInsightGenerated = (newInsight: any) => {
    const insight: Insight = {
      id: `insight-chat-${Date.now()}`,
      type: "summary" as const,
      title: newInsight.title,
      summary: newInsight.summary,
      confidence: newInsight.confidence,
      impact: "medium" as const,
      owner: "AI Analysis",
      sources: [{
        label: newInsight.source || "Team Chat",
        url: "#",
        timestamp: new Date().toISOString()
      }],
      suggestedActions: []
    };
    
    setLiveInsights(prev => [insight, ...prev.slice(0, 4)]); // Keep only 5 most recent
  };

  const commands = [
    {
      id: "command-open-command-center",
      title: "Run automation",
      subtitle: "Trigger a policy-approved MCP workflow",
      shortcut: "g+a"
    },
    {
      id: "command-share-insight",
      title: "Share latest risk insight",
      subtitle: liveInsights[0]?.title ?? "",
      shortcut: "s+i"
    },
    {
      id: "command-open-approvals",
      title: "Jump to approvals queue",
      shortcut: "g+q"
    }
  ];

  return (
    <div className="magical-shell" role="application">
      {/* Magical Background Effects */}
      <div className="magical-bg">
        <div className="magical-orb magical-orb--1"></div>
        <div className="magical-orb magical-orb--2"></div>
        <div className="magical-orb magical-orb--3"></div>
        <div className="magical-particles"></div>
      </div>

      {/* Header with Navigation */}
      <header className="magical-header">
        <div className="magical-header__brand">
          <div className="magical-logo">✨ NativeIQ</div>
          <div className="magical-tagline">Intelligent Business Insights</div>
        </div>
        <div className="magical-header__user">
          <div className="magical-user-selector">
            <select
              value={currentUser.id}
              onChange={(e) => {
                const user = USER_PROFILES.find(u => u.id === e.target.value);
                if (user) setCurrentUser(user);
              }}
              className="magical-select"
            >
              {USER_PROFILES.map(user => (
                <option key={user.id} value={user.id}>
                  {user.avatar} {user.name} - {user.designation}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="magical-content three-pane">
        <div className="magical-content__left">
          <ChatInterface
            className="magical-chat"
            onInsightGenerated={handleInsightGenerated}
            onUserChange={setCurrentUser}
            currentUser={currentUser}
          />
        </div>

        <div className="magical-content__right three-pane__right">
          <div className="three-pane__top">
            <RoleDashboard
              insights={liveInsights}
              slaMetrics={slaMetrics}
              currentUser={currentUser}
              className="magical-dashboard"
            />
          </div>
          <div className="three-pane__bottom">
            <GlassCard title="Market Suggestions" caption="Industry-aware nudges">
              <MarketSuggestions />
            </GlassCard>
          </div>
        </div>
      </main>

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
