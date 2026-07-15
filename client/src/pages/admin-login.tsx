import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, KeyRound, ShieldCheck } from "lucide-react";

type Step = "password" | "totp";

async function apiPost(url: string, body: unknown) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

export default function AdminLogin() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState<Step>("password");
  const [password, setPassword] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [tempToken, setTempToken] = useState("");
  const [error, setError] = useState("");

  const passwordMutation = useMutation({
    mutationFn: () => apiPost("/api/admin/login/password", { password }),
    onSuccess: (data) => {
      setTempToken(data.tempToken);
      setStep("totp");
      setError("");
      setPassword("");
    },
    onError: (err: Error) => setError(err.message),
  });

  const totpMutation = useMutation({
    mutationFn: () => apiPost("/api/admin/login/totp", { token: totpCode, tempToken }),
    onSuccess: () => navigate("/admin"),
    onError: (err: Error) => {
      setError(err.message);
      setTotpCode("");
    },
  });

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    passwordMutation.mutate();
  };

  const handleTotpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    totpMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 mb-4">
            <ShieldCheck className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-serif font-bold">Admin Access</h1>
          <p className="text-sm text-muted-foreground mt-1">Tutto Content Management</p>
        </div>

        <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-sm">
          {step === "password" ? (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Lock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Step 1 — Password</span>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  data-testid="input-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  required
                  autoFocus
                />
              </div>

              {error && (
                <p data-testid="text-error" className="text-sm text-destructive">{error}</p>
              )}

              <Button
                data-testid="button-submit-password"
                type="submit"
                className="w-full"
                disabled={passwordMutation.isPending || !password}
              >
                {passwordMutation.isPending ? "Checking..." : "Continue"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleTotpSubmit} className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <KeyRound className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Step 2 — Authenticator Code</span>
              </div>

              <div className="space-y-2">
                <Label htmlFor="totp">6-digit code</Label>
                <Input
                  id="totp"
                  data-testid="input-totp"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="000000"
                  className="text-center text-2xl tracking-widest font-mono"
                  required
                  autoFocus
                />
                <p className="text-xs text-muted-foreground">
                  Open Google Authenticator and enter the current code.
                </p>
              </div>

              {error && (
                <p data-testid="text-error" className="text-sm text-destructive">{error}</p>
              )}

              <Button
                data-testid="button-submit-totp"
                type="submit"
                className="w-full"
                disabled={totpMutation.isPending || totpCode.length !== 6}
              >
                {totpMutation.isPending ? "Verifying..." : "Sign In"}
              </Button>

              <button
                type="button"
                className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => { setStep("password"); setError(""); setTotpCode(""); }}
              >
                Back to password
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4">
          First time?{" "}
          <a href="/admin/setup" className="text-primary hover:underline">
            Set up admin access
          </a>
        </p>
      </div>
    </div>
  );
}
