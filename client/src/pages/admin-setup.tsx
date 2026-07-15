import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, CheckCircle } from "lucide-react";

type Step = "password" | "qr" | "confirm";

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

export default function AdminSetup() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState<Step>("password");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [error, setError] = useState("");

  const setupMutation = useMutation({
    mutationFn: () => apiPost("/api/admin/setup", { password }),
    onSuccess: (data) => {
      setQrCode(data.qrCode);
      setStep("qr");
      setError("");
    },
    onError: (err: Error) => setError(err.message),
  });

  const confirmMutation = useMutation({
    mutationFn: () => apiPost("/api/admin/setup/confirm", { token: totpCode }),
    onSuccess: () => {
      setStep("confirm");
      setTimeout(() => navigate("/admin/login"), 2500);
    },
    onError: (err: Error) => {
      setError(err.message);
      setTotpCode("");
    },
  });

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setError("");
    setupMutation.mutate();
  };

  const handleConfirmSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    confirmMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 mb-4">
            <ShieldCheck className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-serif font-bold">Admin Setup</h1>
          <p className="text-sm text-muted-foreground mt-1">One-time configuration — done once, locked forever.</p>
        </div>

        <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-sm">
          {step === "password" && (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <p className="text-sm text-muted-foreground mb-4">
                Set a strong password for the admin account. You'll also set up two-factor authentication in the next step.
              </p>

              <div className="space-y-2">
                <Label htmlFor="password">Admin Password</Label>
                <Input
                  id="password"
                  data-testid="input-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  required
                  minLength={8}
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm">Confirm Password</Label>
                <Input
                  id="confirm"
                  data-testid="input-confirm"
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Re-enter password"
                  required
                />
              </div>

              {error && (
                <p data-testid="text-error" className="text-sm text-destructive">{error}</p>
              )}

              <Button
                data-testid="button-setup"
                type="submit"
                className="w-full"
                disabled={setupMutation.isPending || !password || !confirm}
              >
                {setupMutation.isPending ? "Setting up..." : "Continue to Authenticator"}
              </Button>
            </form>
          )}

          {step === "qr" && (
            <form onSubmit={handleConfirmSubmit} className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Scan with Google Authenticator</p>
                <p className="text-xs text-muted-foreground mb-4">
                  Open Google Authenticator (or any TOTP app), tap the + button, and scan the QR code below.
                </p>
                {qrCode && (
                  <div className="flex justify-center mb-4">
                    <img
                      src={qrCode}
                      alt="TOTP QR Code"
                      data-testid="img-qr-code"
                      className="w-48 h-48 rounded-xl border border-border/60"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="totp">Enter the 6-digit code to confirm</Label>
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
              </div>

              {error && (
                <p data-testid="text-error" className="text-sm text-destructive">{error}</p>
              )}

              <Button
                data-testid="button-confirm"
                type="submit"
                className="w-full"
                disabled={confirmMutation.isPending || totpCode.length !== 6}
              >
                {confirmMutation.isPending ? "Confirming..." : "Confirm & Lock Setup"}
              </Button>
            </form>
          )}

          {step === "confirm" && (
            <div className="text-center py-4">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h2 className="text-lg font-semibold mb-2">Setup Complete</h2>
              <p className="text-sm text-muted-foreground">
                Admin access is now configured. Redirecting to login...
              </p>
            </div>
          )}
        </div>

        {step !== "confirm" && (
          <p className="text-center text-xs text-muted-foreground mt-4">
            Already set up?{" "}
            <a href="/admin/login" className="text-primary hover:underline">
              Sign in
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
