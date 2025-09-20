import DashboardRoot from "./(dashboard)/components/DashboardRoot";
import { approvals, insights, slaMetrics, tasks } from "../lib/mock-data";

export default function Page() {
  return (
    <DashboardRoot
      insights={insights}
      tasks={tasks}
      approvals={approvals}
      slaMetrics={slaMetrics}
    />
  );
}
