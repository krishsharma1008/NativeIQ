"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const authed = localStorage.getItem("nativeiq_authed");
    const onboarded = localStorage.getItem("nativeiq_onboarded");

    if (!authed) {
      router.replace("/login");
      return;
    }
    if (authed && !onboarded) {
      router.replace("/onboarding");
      return;
    }
    setReady(true);
  }, [router]);

  if (!ready) return null;
  return <>{children}</>;
}



