import SplitScreenLayout from "./(dashboard)/components/SplitScreenLayout";
import AuthGate from "./(dashboard)/components/AuthGate";
import { approvals, insights, slaMetrics, tasks } from "../lib/mock-data";

export default function Page() {
  return (
    <AuthGate>
      <SplitScreenLayout
        insights={insights}
        tasks={tasks}
        approvals={approvals}
        slaMetrics={slaMetrics}
      />
    </AuthGate>
  );
}
