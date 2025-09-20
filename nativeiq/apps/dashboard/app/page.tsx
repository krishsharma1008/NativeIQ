import SplitScreenLayout from "./(dashboard)/components/SplitScreenLayout";
import { approvals, insights, slaMetrics, tasks } from "../lib/mock-data";

export default function Page() {
  return (
    <SplitScreenLayout
      insights={insights}
      tasks={tasks}
      approvals={approvals}
      slaMetrics={slaMetrics}
    />
  );
}
