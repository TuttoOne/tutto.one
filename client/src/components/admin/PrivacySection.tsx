/**
 * The admin's Data tab: the data policy's admin side (server/data-routes.ts).
 *
 * - Work people shared from the tools: read it, open it in the tool, delete it.
 * - One person: everything we hold under an email address, a download of it,
 *   and "delete everything", which logs the deletion and can email them a confirmation.
 * - The deletion log: evidence that deletions happened, without the data.
 */
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, ExternalLink, Search, Trash2 } from "lucide-react";
import { SHARE_TOOLS, RETENTION_MONTHS, POLICY_PATH } from "@shared/data-policy";
import type { DeletionLogEntry, SharedRecord } from "@shared/schema";

type SharedRow = Omit<SharedRecord, "data">;

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

const when = (d: string | Date) =>
  new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(new Date(d));

const toolLabel = (t: string) => SHARE_TOOLS[t as keyof typeof SHARE_TOOLS]?.label ?? t;

// ── Shared work ──────────────────────────────────────────────────────────────

function SharedList() {
  const qc = useQueryClient();
  const { data: rows = [], isLoading } = useQuery<SharedRow[]>({ queryKey: ["/api/admin/shares"], queryFn: () => api("GET", "/api/admin/shares") });
  const [msg, setMsg] = useState<string | null>(null);

  const remove = useMutation({
    mutationFn: (id: number) => api<{ reference: string }>("DELETE", `/api/admin/shares/${id}`),
    onSuccess: (r) => { setMsg(`Deleted. Logged as ${r.reference}.`); qc.invalidateQueries({ queryKey: ["/api/admin/shares"] }); },
    onError: (e: Error) => setMsg(e.message),
  });

  // The tools read their work from localStorage, and admin is on the same site, so a
  // shared copy opens in the real tool by putting it where the tool looks.
  async function openInTool(r: SharedRow) {
    const tool = SHARE_TOOLS[r.tool as keyof typeof SHARE_TOOLS];
    if (!tool) return;
    if (!window.confirm(`This replaces any ${tool.label.toLowerCase()} work saved in this browser with ${r.name}'s copy. Carry on?`)) return;
    const full = await api<SharedRecord>("GET", `/api/admin/shares/${r.id}`);
    localStorage.setItem(tool.storageKey, JSON.stringify(full.data));
    window.open(tool.path, "_blank", "noopener");
  }

  async function download(r: SharedRow) {
    const full = await api<SharedRecord>("GET", `/api/admin/shares/${r.id}`);
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([JSON.stringify(full, null, 2)], { type: "application/json" }));
    a.download = `shared-${r.tool}-${r.id}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">Work shared with us</h2>
      <p className="text-sm text-muted-foreground">
        Copies people sent from the tools with "Share with Tutto". Each is deleted {RETENTION_MONTHS} months after the programme ends (or after it was sent, for people who aren't students).
      </p>
      {msg && <p className="text-sm text-primary">{msg}</p>}
      {isLoading ? <p className="text-sm text-muted-foreground">Loading...</p> : rows.length === 0 ? (
        <p className="text-sm text-muted-foreground/70">Nothing shared yet.</p>
      ) : (
        <div className="border rounded-md divide-y">
          {rows.map((r) => (
            <div key={r.id} className="p-3 text-sm grid gap-1 sm:grid-cols-[1fr_auto] items-start">
              <div className="min-w-0">
                <p className="font-medium truncate">{toolLabel(r.tool)}: {r.title || "Untitled"}</p>
                <p className="text-muted-foreground truncate">
                  {r.name} · {r.email}{r.organisation ? ` · ${r.organisation}` : ""}{r.studentId ? " · student" : ""} · {when(r.createdAt)}
                </p>
                {r.note && <p className="mt-1 whitespace-pre-wrap">{r.note}</p>}
              </div>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={() => openInTool(r)}><ExternalLink className="w-4 h-4 mr-1" />Open in the tool</Button>
                <Button size="sm" variant="outline" onClick={() => download(r)}><Download className="w-4 h-4 mr-1" />JSON</Button>
                <Button
                  size="sm" variant="ghost" className="text-destructive"
                  onClick={() => { if (window.confirm(`Delete ${r.name}'s ${toolLabel(r.tool).toLowerCase()}? This is logged.`)) remove.mutate(r.id); }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

// ── One person ───────────────────────────────────────────────────────────────

type Subject = {
  email: string;
  students: { id: number; name: string; cohort: string | null; createdAt: string }[];
  progress: unknown[];
  sharedRecords: { id: number; tool: string; title: string; createdAt: string }[];
  enquiries: { id: number; message: string; createdAt: string }[];
  leads: { id: number; source: string; createdAt: string }[];
  deletions: DeletionLogEntry[];
};

function PersonLookup() {
  const qc = useQueryClient();
  const [email, setEmail] = useState("");
  const [found, setFound] = useState<Subject | null>(null);
  const [note, setNote] = useState("");
  const [notify, setNotify] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);

  const look = useMutation({
    mutationFn: () => api<Subject>("GET", `/api/admin/privacy/subject?email=${encodeURIComponent(email.trim())}`),
    onSuccess: (d) => { setFound(d); setMsg(null); },
    onError: (e: Error) => setMsg(e.message),
  });

  const erase = useMutation({
    mutationFn: () => api<{ reference: string; emailed: boolean }>("POST", "/api/admin/privacy/subject/erase", { email: found!.email, note, notify }),
    onSuccess: (r) => {
      setMsg(`Deleted. Reference ${r.reference}.${notify ? (r.emailed ? " Confirmation emailed." : " The confirmation email didn't send: tell them the reference yourself.") : ""}`);
      setFound(null); setNote("");
      qc.invalidateQueries();
    },
    onError: (e: Error) => setMsg(e.message),
  });

  const total = found ? found.students.length + found.sharedRecords.length + found.enquiries.length + found.leads.length : 0;

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">One person</h2>
      <p className="text-sm text-muted-foreground">
        When someone asks what we hold about them, or asks us to delete it. This searches every table that holds an email address. It doesn't reach Gmail, Calendar, Drive or Meet: clear those by hand.
      </p>
      <form className="flex gap-2 max-w-lg" onSubmit={(e) => { e.preventDefault(); look.mutate(); }}>
        <Input type="email" placeholder="their@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Button type="submit" variant="outline" disabled={look.isPending}><Search className="w-4 h-4 mr-1" />Find</Button>
      </form>
      {msg && <p className="text-sm text-primary">{msg}</p>}
      {found && (
        <div className="border rounded-md p-4 space-y-3 text-sm">
          <ul className="space-y-1">
            <li>Learner accounts: {found.students.length ? found.students.map((s) => `${s.name} (${s.cohort ?? "no cohort"})`).join(", ") : "none"}</li>
            <li>Sessions ticked off: {found.progress.length}</li>
            <li>Shared work: {found.sharedRecords.length ? found.sharedRecords.map((r) => `${toolLabel(r.tool)} "${r.title || "Untitled"}"`).join(", ") : "none"}</li>
            <li>Enquiries: {found.enquiries.length}</li>
            <li>Mailing list sign-ups: {found.leads.length}</li>
            <li>Earlier deletions: {found.deletions.length ? found.deletions.map((d) => `${d.reference} (${when(d.createdAt)})`).join(", ") : "none"}</li>
          </ul>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" asChild>
              <a href={`/api/admin/privacy/subject/export?email=${encodeURIComponent(found.email)}`}><Download className="w-4 h-4 mr-1" />Download everything (JSON)</a>
            </Button>
          </div>
          {total > 0 && (
            <div className="border-t pt-3 space-y-2">
              <Label htmlFor="erase-note">Why (kept in the log, no personal details)</Label>
              <Input id="erase-note" placeholder="e.g. Asked by email on 7 Oct" value={note} onChange={(e) => setNote(e.target.value)} />
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={notify} onChange={(e) => setNotify(e.target.checked)} />
                Email them a confirmation with the reference
              </label>
              <Button
                size="sm" variant="destructive" disabled={erase.isPending}
                onClick={() => { if (window.confirm(`Delete everything held under ${found.email}? This can't be undone.`)) erase.mutate(); }}
              >
                <Trash2 className="w-4 h-4 mr-1" />Delete everything
              </Button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

// ── Deletion log ─────────────────────────────────────────────────────────────

function DeletionLog() {
  const { data: rows = [] } = useQuery<DeletionLogEntry[]>({ queryKey: ["/api/admin/privacy/log"], queryFn: () => api("GET", "/api/admin/privacy/log") });
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">Deletion log</h2>
      <p className="text-sm text-muted-foreground">Evidence that each deletion happened: a reference, the date and how many records went. The person's details aren't kept.</p>
      {rows.length === 0 ? <p className="text-sm text-muted-foreground/70">No deletions yet.</p> : (
        <div className="border rounded-md divide-y text-sm">
          {rows.map((d) => (
            <div key={d.id} className="p-2 grid sm:grid-cols-[180px_110px_90px_1fr] gap-2">
              <span className="font-mono">{d.reference}</span>
              <span>{when(d.createdAt)}</span>
              <span className="text-muted-foreground">{d.reason === "retention" ? "Retention" : "Request"}</span>
              <span className="text-muted-foreground">
                {Object.entries(d.counts as Record<string, number>).filter(([, n]) => n > 0).map(([k, n]) => `${k} ${n}`).join(", ") || "nothing found"}
                {d.note ? ` · ${d.note}` : ""}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export function PrivacySection() {
  return (
    <div className="space-y-10">
      <p className="text-sm">
        How this works for clients is in the <a href={POLICY_PATH} target="_blank" rel="noopener noreferrer" className="underline">data policy</a>.
      </p>
      <SharedList />
      <PersonLookup />
      <DeletionLog />
    </div>
  );
}
