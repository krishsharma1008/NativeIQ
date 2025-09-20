"use client";

import { useMemo } from "react";
import type { Insight, SlaMetric } from "@nativeiq/types";
import { CEODashboard } from "./dashboards/CEODashboard";
import { SalesDashboard } from "./dashboards/SalesDashboard";
import { OperationsDashboard } from "./dashboards/OperationsDashboard";
import { CustomerSuccessDashboard } from "./dashboards/CustomerSuccessDashboard";

interface UserProfile {
  id: string;
  name: string;
  designation: string;
  department: string;
  avatar?: string;
  color: string;
}

type RoleDashboardProps = {
  insights: Insight[];
  slaMetrics: SlaMetric[];
  currentUser: UserProfile;
  className?: string;
};

export function RoleDashboard({ insights, slaMetrics, currentUser, className }: RoleDashboardProps) {
  const DashboardComponent = useMemo(() => {
    switch (currentUser.designation) {
      case "Founder & CEO":
        return CEODashboard;
      case "Sales Manager":
        return SalesDashboard;
      case "Operations Lead":
        return OperationsDashboard;
      case "Customer Success":
        return CustomerSuccessDashboard;
      default:
        return CEODashboard;
    }
  }, [currentUser.designation]);

  const dashboardTitle = useMemo(() => {
    switch (currentUser.designation) {
      case "Founder & CEO":
        return "Executive Dashboard";
      case "Sales Manager":
        return "Sales Dashboard";
      case "Operations Lead":
        return "Operations Dashboard";
      case "Customer Success":
        return "Customer Success Dashboard";
      default:
        return "Dashboard";
    }
  }, [currentUser.designation]);

  return (
    <div className={`role-dashboard ${className || ""}`}>
      <div className="role-dashboard__header">
        <div className="role-dashboard__title-section">
          <h2 className="role-dashboard__title">{dashboardTitle}</h2>
          <div className="role-dashboard__user-info">
            <span className="role-dashboard__user-avatar">{currentUser.avatar}</span>
            <div className="role-dashboard__user-details">
              <span className="role-dashboard__user-name">{currentUser.name}</span>
              <span className="role-dashboard__user-role">{currentUser.designation}</span>
            </div>
          </div>
        </div>
      </div>
      
      <DashboardComponent 
        insights={insights}
        slaMetrics={slaMetrics}
        className="role-dashboard__content"
      />
    </div>
  );
}
