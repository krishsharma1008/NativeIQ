"use client";

import { useEffect, useState } from "react";
import { GlassCard, Button } from "@nativeiq/ui";

type Step = 1 | 2 | 3;

export default function OnboardingPage() {
  const [step, setStep] = useState<Step>(1);
  const [company, setCompany] = useState("");
  const [industry, setIndustry] = useState("food");
  const [role, setRole] = useState("Founder & CEO");

  useEffect(() => {
    const authed = typeof window !== 'undefined' && localStorage.getItem("nativeiq_authed");
    if (!authed) {
      window.location.href = "/(auth)/login";
    }
  }, []);

  const next = () => setStep((s) => (s === 3 ? 3 : ((s + 1) as Step)));
  const back = () => setStep((s) => (s === 1 ? 1 : ((s - 1) as Step)));

  const finish = () => {
    localStorage.setItem("nativeiq_onboarded", "true");
    localStorage.setItem("nativeiq_company", company);
    localStorage.setItem("nativeiq_industry", industry);
    localStorage.setItem("nativeiq_role", role);
    window.location.href = "/";
  };

  return (
    <div className="onboarding-shell" style={{minHeight:'100dvh'}}>
      <div className="auth-background" />
      <GlassCard title="Getting you set up" caption="Takes less than a minute" className="auth-card">
        {step === 1 && (
          <div className="onb-step">
            <label className="auth-label">Company name</label>
            <input
              className="auth-input"
              placeholder="Acme Foods"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
            <div className="onb-actions">
              <Button variant="primary" onClick={next} disabled={!company.trim()}>Continue</Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="onb-step">
            <label className="auth-label">Industry</label>
            <select className="auth-input" value={industry} onChange={(e) => setIndustry(e.target.value)}>
              <option value="food">Food & Beverage</option>
              <option value="retail">Retail</option>
              <option value="saas">SaaS</option>
              <option value="services">Services</option>
            </select>
            <div className="onb-actions">
              <Button variant="secondary" onClick={back}>Back</Button>
              <Button variant="primary" onClick={next}>Continue</Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="onb-step">
            <label className="auth-label">Your role</label>
            <select className="auth-input" value={role} onChange={(e) => setRole(e.target.value)}>
              <option>Founder & CEO</option>
              <option>Operations Lead</option>
              <option>Sales Manager</option>
              <option>Customer Success</option>
            </select>
            <div className="onb-actions">
              <Button variant="secondary" onClick={back}>Back</Button>
              <Button variant="primary" onClick={finish}>Finish</Button>
            </div>
          </div>
        )}
      </GlassCard>
    </div>
  );
}


