"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { GlassCard, Button } from "@nativeiq/ui";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const onboarded = typeof window !== 'undefined' && localStorage.getItem("nativeiq_onboarded");
    if (onboarded) {
      window.location.href = "/";
    }
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Demo auth: accept any non-empty email/pass
      if (!email || !password) {
        throw new Error("Enter email and password");
      }
      localStorage.setItem("nativeiq_authed", "true");
      window.location.href = "/onboarding";
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell" style={{minHeight:'100dvh'}}>
      <div className="auth-background" />
      <GlassCard title="Welcome to Native IQ" caption="Sign in to continue" className="auth-card">
        <form onSubmit={onSubmit} className="auth-form">
          <div className="auth-field">
            <label className="auth-label">Email</label>
            <input
              type="email"
              className="auth-input"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="auth-field">
            <label className="auth-label">Password</label>
            <input
              type="password"
              className="auth-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <div className="auth-error">{error}</div>}
          <Button type="submit" variant="primary" disabled={loading} className="auth-submit">
            {loading ? "Signing in..." : "Sign in"}
          </Button>
          <div className="auth-footer">
            <span className="auth-hint">No account? Use any email and password for demo.</span>
          </div>
        </form>
      </GlassCard>
    </div>
  );
}


