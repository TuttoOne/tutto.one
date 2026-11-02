/**
 * The admin's Passkeys tab (server/admin-passkeys.ts): add a passkey for this
 * device, see which ones exist, remove one you no longer use.
 */
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { startRegistration, browserSupportsWebAuthn } from "@simplewebauthn/browser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Fingerprint, Trash2 } from "lucide-react";

type PasskeyRow = { id: number; name: string; createdAt: string; lastUsedAt: string | null };

async function api<T = any>(method: string, url: string, body?: unknown): Promise<T> {
  const res = await fetch(url, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data as T;
}

const when = (d: string) =>
  new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(new Date(d));

export function PasskeysSection() {
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const supported = browserSupportsWebAuthn();

  const { data: passkeys = [], isLoading } = useQuery<PasskeyRow[]>({
    queryKey: ["/api/admin/passkeys"],
    queryFn: () => api("GET", "/api/admin/passkeys"),
  });

  const add = useMutation({
    mutationFn: async () => {
      const { options, challengeToken } = await api("POST", "/api/admin/passkeys/register/options", {});
      const response = await startRegistration({ optionsJSON: options });
      return api("POST", "/api/admin/passkeys/register/verify", { response, challengeToken, name: name.trim() });
    },
    onSuccess: () => {
      setName("");
      setError("");
      qc.invalidateQueries({ queryKey: ["/api/admin/passkeys"] });
    },
    onError: (err: Error) => {
      if (err.name === "NotAllowedError" || err.name === "AbortError") return;
      if (err.name === "InvalidStateError") return setError("This device already has a passkey here.");
      setError(err.message);
    },
  });

  const remove = useMutation({
    mutationFn: (id: number) => api("DELETE", `/api/admin/passkeys/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/admin/passkeys"] }),
  });

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h2 className="text-lg font-semibold">Passkeys</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Sign in with Face ID, Touch ID or your device PIN instead of the password and authenticator code.
          The password and code still work if you lose a device.
        </p>
      </div>

      <form
        className="bg-card border border-border/60 rounded-2xl p-6 space-y-4"
        onSubmit={(e) => { e.preventDefault(); setError(""); add.mutate(); }}
      >
        <div className="space-y-2">
          <Label htmlFor="passkey-name">Name for this device</Label>
          <Input
            id="passkey-name"
            data-testid="input-passkey-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="MacBook, iPhone..."
            maxLength={60}
          />
        </div>
        {!supported && <p className="text-sm text-destructive">This browser doesn't support passkeys.</p>}
        {error && <p data-testid="text-passkey-error" className="text-sm text-destructive">{error}</p>}
        <Button type="submit" data-testid="button-add-passkey" disabled={!supported || !name.trim() || add.isPending}>
          <Fingerprint className="w-4 h-4 mr-2" />
          {add.isPending ? "Waiting for your device..." : "Add a passkey"}
        </Button>
      </form>

      <div className="space-y-2">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : passkeys.length === 0 ? (
          <p className="text-sm text-muted-foreground">No passkeys yet.</p>
        ) : (
          passkeys.map((p) => (
            <div
              key={p.id}
              data-testid={`row-passkey-${p.id}`}
              className="flex items-center justify-between bg-card border border-border/60 rounded-xl px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium">{p.name}</p>
                <p className="text-xs text-muted-foreground">
                  Added {when(p.createdAt)}
                  {p.lastUsedAt ? ` · last used ${when(p.lastUsedAt)}` : " · not used yet"}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                data-testid={`button-remove-passkey-${p.id}`}
                disabled={remove.isPending}
                onClick={() => remove.mutate(p.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
