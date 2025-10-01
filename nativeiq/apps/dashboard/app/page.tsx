"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SplitScreenLayout from "./(dashboard)/components/SplitScreenLayout";
import AuthGate from "./(dashboard)/components/AuthGate";
import { approvals, insights, slaMetrics, tasks } from "../lib/mock-data";

export default function Page() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // Check if user has completed auth and onboarding
    const authed = localStorage.getItem("nativeiq_authed");
    const onboarded = localStorage.getItem("nativeiq_onboarded");
    const hasSeenLanding = sessionStorage.getItem("nativeiq_landing_seen");

    // If not seen landing yet, show it
    if (!hasSeenLanding) {
      sessionStorage.setItem("nativeiq_landing_seen", "true");
      router.push("/landing");
      return;
    }

    // If authenticated and onboarded, show dashboard
    if (authed && onboarded) {
      setCheckingAuth(false);
      return;
    }

    // Otherwise redirect to landing/login flow
    router.push("/landing");
  }, [router]);

  if (checkingAuth) {
    return null;
  }

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
