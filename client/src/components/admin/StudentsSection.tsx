/**
 * The admin's Students tab: cohorts, their dates, the people in them and how
 * far each has got. Talks to /api/admin/learn/* in server/learn-routes.ts.
 *
 * A draft cohort is one that hasn't paid: it can be set up in full, but the
 * server refuses to invite anyone in it and its students get a read-only dashboard.
 */
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ExternalLink, Mail, Trash2, UserPlus, ChevronDown, ChevronRight, Plus, Search } from "lucide-react";
import type { Cohort, CohortSession, Student, StudentProgress } from "@shared/schema";
import { SHARE_TOOLS, RETENTION_MONTHS } from "@shared/data-policy";
import { PROGRAMMES, type Programme } from "@shared/learn-programmes";

type AdminShared = { id: number; tool: string; title: string; createdAt: string };
type AdminStudent = Student & { progress: StudentProgress[]; shared: AdminShared[] };
type AdminCohort = Cohort & { programme: Programme | null; sessions: CohortSession[]; students: AdminStudent[] };

const KEY = ["/api/admin/learn/cohorts"];

async function api(method: string, url: string, body?: unknown) {
  const res = await fetch(url, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

function inZone(d: string | Date, timeZone: string) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone, weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
  }).format(new Date(d));
}

function shortDate(d: string | Date | null) {
  return d ? new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" }).format(new Date(d)) : "";
}

function fullDate(d: string | Date) {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(new Date(d));
}

const STATUS_STYLE: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  active: "bg-primary/15 text-primary",
  done: "bg-secondary text-secondary-foreground",
};

// ── One student ──────────────────────────────────────────────────────────────

function StudentRow({ s, cohort, total }: { s: AdminStudent; cohort: AdminCohort; total: number }) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [blurb, setBlurb] = useState(s.aboutBlurb ?? "");
  const [msg, setMsg] = useState<string | null>(null);
  const refresh = () => qc.invalidateQueries({ queryKey: KEY });

  const saveBlurb = useMutation({
    mutationFn: () => api("PATCH", `/api/admin/learn/students/${s.id}`, { aboutBlurb: blurb }),
    onSuccess: () => { setMsg("Saved"); refresh(); },
    onError: (e: Error) => setMsg(e.message),
  });
  const invite = useMutation({
    mutationFn: () => api("POST", `/api/admin/learn/students/${s.id}/invite`),
    onSuccess: () => { setMsg("Invite sent"); refresh(); },
    onError: (e: Error) => setMsg(e.message),
  });
  const remove = useMutation({
    mutationFn: () => api("DELETE", `/api/admin/learn/students/${s.id}`),
    onSuccess: refresh,
  });

  const done = s.progress.filter((p) => p.status === "done").length;
  const profile: [string, string | null][] = [
    ["Role", s.jobTitle],
    ["LinkedIn", s.linkedinUrl],
    ["Background", s.background],
    ["AI accounts", s.currentAccounts],
    ["Task to bring", s.taskToBring],
    ["Computer", s.setupNotes],
    ["Other contact", [s.altContactName, s.altContactEmail, s.altContactPhone].filter(Boolean).join(" · ") || null],
  ];

  return (
    <div className="border-t border-border/60">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full grid grid-cols-[16px_1fr_auto] sm:grid-cols-[16px_1.4fr_1.6fr_repeat(4,auto)] gap-x-4 gap-y-1 items-center py-3 text-left text-sm"
      >
        {open ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        <span className="font-medium truncate">{s.name}</span>
        <span className="text-muted-foreground truncate hidden sm:block">{s.email}</span>
        <span className={s.profileCompletedAt ? "text-primary" : "text-muted-foreground"}>
          {s.profileCompletedAt ? "Profile in" : "No profile"}
        </span>
        <span className="text-muted-foreground hidden sm:block">{s.invitedAt ? `Invited ${shortDate(s.invitedAt)}` : "Not invited"}</span>
        <span className="text-muted-foreground hidden sm:block">{s.lastLoginAt ? `Seen ${shortDate(s.lastLoginAt)}` : "Never signed in"}</span>
        <span className="text-muted-foreground hidden sm:block">{done}/{total} · {s.shared.length} shared</span>
      </button>

      {open && (
        <div className="pl-8 pb-5 space-y-4">
          <dl className="grid sm:grid-cols-[140px_1fr] gap-x-4 gap-y-2 text-sm">
            {profile.map(([k, v]) => (
              <div key={k} className="contents">
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="whitespace-pre-wrap break-words">{v || <span className="text-muted-foreground/60">Not given</span>}</dd>
              </div>
            ))}
          </dl>
          <div className="space-y-1 text-sm">
            <p className="text-muted-foreground">Work shared with us (read it in the Data tab)</p>
            {s.shared.length
              ? s.shared.map((r) => (
                <p key={r.id}>
                  {SHARE_TOOLS[r.tool as keyof typeof SHARE_TOOLS]?.label ?? r.tool}: <span className="font-medium">{r.title || "Untitled"}</span>
                  <span className="text-xs text-muted-foreground"> · {shortDate(r.createdAt)}</span>
                </p>
              ))
              : <p className="text-muted-foreground/60">Nothing yet</p>}
          </div>
          <div>
            <Label htmlFor={`blurb-${s.id}`}>About {s.name.split(" ")[0]} (our notes, never shown to them)</Label>
            <Textarea id={`blurb-${s.id}`} rows={4} value={blurb} onChange={(e) => setBlurb(e.target.value)} className="mt-1" />
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <Button size="sm" variant="outline" onClick={() => saveBlurb.mutate()} disabled={saveBlurb.isPending}>Save notes</Button>
            <Button size="sm" variant="outline" asChild>
              <a href={`/api/admin/learn/students/${s.id}/welcome-preview`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-1" />Preview welcome
              </a>
            </Button>
            <Button
              size="sm"
              disabled={invite.isPending || cohort.status === "draft"}
              title={cohort.status === "draft" ? "Set the cohort to active first" : undefined}
              onClick={() => {
                if (window.confirm(`Send the welcome email to ${s.email}${s.invitedAt ? " again" : ""}?`)) invite.mutate();
              }}
            >
              <Mail className="w-4 h-4 mr-1" />{s.invitedAt ? "Send again" : "Send welcome"}
            </Button>
            <Button
              size="sm" variant="ghost" className="text-destructive"
              onClick={() => { if (window.confirm(`Remove ${s.name}? This deletes their profile, progress and shared work, and is logged as a deletion.`)) remove.mutate(); }}
            >
              <Trash2 className="w-4 h-4 mr-1" />Remove
            </Button>
            {msg && <span className="text-xs text-muted-foreground">{msg}</span>}
          </div>
        </div>
      )}
    </div>
  );
}

// ── One cohort ───────────────────────────────────────────────────────────────

function CohortCard({ c, open, onToggle }: { c: AdminCohort; open: boolean; onToggle: () => void }) {
  const qc = useQueryClient();
  const refresh = () => qc.invalidateQueries({ queryKey: KEY });
  const [meetUrl, setMeetUrl] = useState(c.meetUrl ?? "");
  const savedRetain = c.retainUntil ? new Date(c.retainUntil).toISOString().slice(0, 10) : "";
  const [retain, setRetain] = useState(savedRetain);
  const [lines, setLines] = useState("");
  const [addMsg, setAddMsg] = useState<string | null>(null);
  const [newSession, setNewSession] = useState({ moduleNumber: "", startsAt: "" });
  const modules = c.programme?.modules ?? [];
  const title = (n: number | null) => modules.find((m) => m.number === n)?.title ?? "";

  const patch = useMutation({
    mutationFn: (data: Partial<Omit<Cohort, "retainUntil">> & { retainUntil?: string | null }) => api("PATCH", `/api/admin/learn/cohorts/${c.id}`, data),
    onSuccess: refresh,
  });
  const addStudents = useMutation({
    mutationFn: () => api("POST", `/api/admin/learn/cohorts/${c.id}/students`, { lines }),
    onSuccess: (r: { added: number; skipped: string[] }) => {
      setLines("");
      setAddMsg(`Added ${r.added}.${r.skipped.length ? ` Couldn't read: ${r.skipped.join("; ")}` : ""}`);
      refresh();
    },
    onError: (e: Error) => setAddMsg(e.message),
  });
  const addSession = useMutation({
    mutationFn: () => {
      const startsAt = new Date(newSession.startsAt);
      const moduleNumber = newSession.moduleNumber ? Number(newSession.moduleNumber) : null;
      return api("POST", `/api/admin/learn/cohorts/${c.id}/sessions`, {
        moduleNumber,
        isSpare: moduleNumber === null,
        startsAt: startsAt.toISOString(),
        endsAt: new Date(startsAt.getTime() + c.sessionMinutes * 60000).toISOString(),
      });
    },
    onSuccess: () => { setNewSession({ moduleNumber: "", startsAt: "" }); refresh(); },
  });
  const sessionStatus = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => api("PATCH", `/api/admin/learn/sessions/${id}`, { status }),
    onSuccess: refresh,
  });
  const deleteSession = useMutation({
    mutationFn: (id: number) => api("DELETE", `/api/admin/learn/sessions/${id}`),
    onSuccess: refresh,
  });
  const inviteAll = useMutation({
    mutationFn: async () => {
      for (const s of c.students.filter((x) => !x.invitedAt)) {
        await api("POST", `/api/admin/learn/students/${s.id}/invite`);
      }
    },
    onSettled: refresh,
  });
  const uninvited = c.students.filter((s) => !s.invitedAt).length;

  return (
    <div id={`cohort-${c.id}`} className={`rounded-lg border border-border/60 bg-card scroll-mt-4 ${open ? "p-5 space-y-6" : "px-5 py-3"}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <button type="button" onClick={onToggle} aria-expanded={open} className="flex items-start gap-2 text-left min-w-0 flex-1">
          {open ? <ChevronDown className="w-4 h-4 mt-1.5 shrink-0" /> : <ChevronRight className="w-4 h-4 mt-1.5 shrink-0" />}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-serif font-bold text-lg truncate">{c.name}</h3>
              <span className={`text-xs px-2 py-0.5 rounded ${STATUS_STYLE[c.status] ?? ""}`}>{c.status}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {open
                ? <>{c.programme?.name ?? c.programmeKey} · {c.sessionMinutes} min · {c.timezone}</>
                : <>{c.organisation || "Solo"} · {c.programme?.name ?? c.programmeKey} · {c.students.length} {c.students.length === 1 ? "student" : "students"} · created {fullDate(c.createdAt)}</>}
            </p>
          </div>
        </button>
        <select
          value={c.status}
          onChange={(e) => {
            const status = e.target.value;
            if (status === "active" && c.status === "draft" && !window.confirm("Make this cohort active? It means they've paid: they can be invited and can tick sessions off.")) return;
            patch.mutate({ status });
          }}
          className="text-sm border border-border rounded px-2 py-1 bg-background"
        >
          <option value="draft">Draft (not signed)</option>
          <option value="active">Active</option>
          <option value="done">Done</option>
        </select>
      </div>

      {open && <>
      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <Label htmlFor={`meet-${c.id}`}>Call link</Label>
          <Input id={`meet-${c.id}`} value={meetUrl} onChange={(e) => setMeetUrl(e.target.value)} placeholder="https://meet.google.com/..." className="mt-1" />
        </div>
        <Button variant="outline" size="sm" onClick={() => patch.mutate({ meetUrl: meetUrl || null })} disabled={meetUrl === (c.meetUrl ?? "")}>Save</Button>
      </div>

      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <Label htmlFor={`retain-${c.id}`}>Keep personal data until (only if the contract sets a date)</Label>
          <Input id={`retain-${c.id}`} type="date" value={retain} onChange={(e) => setRetain(e.target.value)} className="mt-1" />
          <p className="text-xs text-muted-foreground mt-1">Empty means the policy: {RETENTION_MONTHS} months after the last session, then deleted automatically.</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => patch.mutate({ retainUntil: retain || null })} disabled={retain === savedRetain}>Save</Button>
      </div>

      <div>
        <h4 className="text-sm font-semibold mb-2">Sessions ({c.timezone})</h4>
        {c.sessions.length === 0 && <p className="text-sm text-muted-foreground">No dates yet.</p>}
        <ul className="text-sm divide-y divide-border/60">
          {c.sessions.map((s) => (
            <li key={s.id} className="flex flex-wrap items-center gap-3 py-1.5">
              <span className="w-44 tabular-nums">{inZone(s.startsAt, c.timezone)}</span>
              <span className={`flex-1 ${s.isSpare ? "text-muted-foreground" : ""}`}>
                {s.isSpare ? "Spare" : `${s.moduleNumber}. ${s.titleOverride || title(s.moduleNumber)}`}
              </span>
              <select
                value={s.status}
                onChange={(e) => sessionStatus.mutate({ id: s.id, status: e.target.value })}
                className="text-xs border border-border rounded px-1 py-0.5 bg-background"
              >
                <option value="scheduled">Scheduled</option>
                <option value="done">Done</option>
                <option value="moved">Moved</option>
              </select>
              <button type="button" className="text-muted-foreground hover:text-destructive" onClick={() => { if (window.confirm("Delete this date?")) deleteSession.mutate(s.id); }}>
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-2 items-end mt-3">
          <div>
            <Label className="text-xs">Session</Label>
            <select
              value={newSession.moduleNumber}
              onChange={(e) => setNewSession({ ...newSession, moduleNumber: e.target.value })}
              className="block mt-1 text-sm border border-border rounded px-2 h-9 bg-background"
            >
              <option value="">Spare date</option>
              {modules.map((m) => <option key={m.number} value={m.number}>{m.number}. {m.title}</option>)}
            </select>
          </div>
          <div>
            <Label className="text-xs">Starts (your local time)</Label>
            <Input type="datetime-local" value={newSession.startsAt} onChange={(e) => setNewSession({ ...newSession, startsAt: e.target.value })} className="mt-1" />
          </div>
          <Button size="sm" variant="outline" disabled={!newSession.startsAt || addSession.isPending} onClick={() => addSession.mutate()}>
            <Plus className="w-4 h-4 mr-1" />Add date
          </Button>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between gap-2 mb-1">
          <h4 className="text-sm font-semibold">Students ({c.students.length})</h4>
          {uninvited > 0 && c.status !== "draft" && (
            <Button
              size="sm" variant="outline" disabled={inviteAll.isPending}
              onClick={() => { if (window.confirm(`Send the welcome email to the ${uninvited} not yet invited?`)) inviteAll.mutate(); }}
            >
              <Mail className="w-4 h-4 mr-1" />Send welcome to {uninvited}
            </Button>
          )}
        </div>
        {c.students.map((s) => <StudentRow key={s.id} s={s} cohort={c} total={modules.length} />)}
        <div className="border-t border-border/60 pt-3 mt-1">
          <Label htmlFor={`add-${c.id}`} className="text-xs">Add people, one per line: Name, email</Label>
          <Textarea id={`add-${c.id}`} rows={2} value={lines} onChange={(e) => setLines(e.target.value)} className="mt-1" placeholder="Jane Smith, jane@example.com" />
          <div className="flex items-center gap-3 mt-2">
            <Button size="sm" variant="outline" disabled={!lines.trim() || addStudents.isPending} onClick={() => addStudents.mutate()}>
              <UserPlus className="w-4 h-4 mr-1" />Add
            </Button>
            {addMsg && <span className="text-xs text-muted-foreground">{addMsg}</span>}
          </div>
        </div>
      </div>
      </>}
    </div>
  );
}

// ── New cohort ───────────────────────────────────────────────────────────────

function NewCohort({ onDone }: { onDone: () => void }) {
  const qc = useQueryClient();
  const [f, setF] = useState({
    name: "", slug: "", organisation: "", programmeKey: "ai-fluent-team",
    timezone: "Europe/London", sessionMinutes: "90", meetUrl: "",
  });
  const [error, setError] = useState<string | null>(null);
  const create = useMutation({
    mutationFn: () => api("POST", "/api/admin/learn/cohorts", {
      ...f,
      organisation: f.organisation || null,
      meetUrl: f.meetUrl || null,
      sessionMinutes: Number(f.sessionMinutes),
      status: "draft",
    }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: KEY }); onDone(); },
    onError: (e: Error) => setError(e.message),
  });
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const v = e.target.value;
    setF((prev) => ({ ...prev, [k]: v }));
  };

  return (
    <div className="rounded-lg border border-dashed border-border p-5 grid sm:grid-cols-2 gap-4">
      <div><Label>Name</Label><Input className="mt-1" value={f.name} onChange={set("name")} placeholder="Acme Ltd" /></div>
      <div><Label>Slug</Label><Input className="mt-1" value={f.slug} onChange={set("slug")} placeholder="acme-2027" /></div>
      <div><Label>Organisation (leave empty for a solo student)</Label><Input className="mt-1" value={f.organisation} onChange={set("organisation")} /></div>
      <div>
        <Label>Programme</Label>
        <select value={f.programmeKey} onChange={set("programmeKey")} className="block w-full mt-1 text-sm border border-border rounded px-2 h-9 bg-background">
          {Object.values(PROGRAMMES).map((p) => <option key={p.key} value={p.key}>{p.name} ({p.key})</option>)}
        </select>
      </div>
      <div><Label>Timezone</Label><Input className="mt-1" value={f.timezone} onChange={set("timezone")} placeholder="Europe/Rome" /></div>
      <div><Label>Minutes per session</Label><Input className="mt-1" type="number" value={f.sessionMinutes} onChange={set("sessionMinutes")} /></div>
      <div className="sm:col-span-2"><Label>Call link</Label><Input className="mt-1" value={f.meetUrl} onChange={set("meetUrl")} /></div>
      <div className="sm:col-span-2 flex items-center gap-3">
        <Button disabled={!f.name || !/^[a-z0-9-]+$/.test(f.slug) || create.isPending} onClick={() => create.mutate()}>Create as draft</Button>
        <Button variant="ghost" onClick={onDone}>Cancel</Button>
        {error && <span className="text-sm text-destructive">{error}</span>}
      </div>
    </div>
  );
}

type SortKey = "created" | "name" | "organisation";

const byText = (a: string | null, b: string | null) => {
  // Empty last, so solo cohorts sit after the named organisations.
  if (!a) return b ? 1 : 0;
  if (!b) return -1;
  return a.localeCompare(b, "en-GB", { sensitivity: "base" });
};

const SORTS: Record<SortKey, (a: AdminCohort, b: AdminCohort) => number> = {
  created: (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  name: (a, b) => byText(a.name, b.name),
  organisation: (a, b) => byText(a.organisation, b.organisation) || byText(a.name, b.name),
};

function matches(c: AdminCohort, q: string) {
  const hay = [c.name, c.slug, c.organisation, ...c.students.flatMap((s) => [s.name, s.email])];
  return hay.some((v) => v?.toLowerCase().includes(q));
}

export function StudentsSection() {
  const [adding, setAdding] = useState(false);
  const [sort, setSort] = useState<SortKey>("created");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<Set<number>>(new Set());
  const { data, isLoading, error } = useQuery<AdminCohort[]>({
    queryKey: KEY,
    queryFn: () => api("GET", "/api/admin/learn/cohorts"),
  });

  const q = query.trim().toLowerCase();
  const shown = useMemo(
    () => [...(data ?? [])].filter((c) => !q || matches(c, q)).sort(SORTS[sort]),
    [data, q, sort],
  );

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading...</p>;
  if (error) return <p className="text-sm text-destructive">{(error as Error).message}</p>;

  const toggle = (id: number) => setOpen((prev) => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });
  const jumpTo = (id: number) => {
    setOpen((prev) => new Set(prev).add(id));
    requestAnimationFrame(() => document.getElementById(`cohort-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };
  const allOpen = shown.length > 0 && shown.every((c) => open.has(c.id));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Students sign in at <a href="/learn" target="_blank" rel="noopener noreferrer" className="underline">/learn</a> with a link we email them.
        </p>
        {!adding && <Button size="sm" variant="outline" onClick={() => setAdding(true)}><Plus className="w-4 h-4 mr-1" />New cohort</Button>}
      </div>
      {adding && <NewCohort onDone={() => setAdding(false)} />}

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            data-testid="input-cohort-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && shown[0]) jumpTo(shown[0].id);
              if (e.key === "Escape") setQuery("");
            }}
            placeholder="Find a cohort, organisation or student (Enter opens the first)"
            className="pl-9"
          />
        </div>
        <select
          data-testid="select-cohort-sort"
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="text-sm border border-border rounded px-2 h-9 bg-background"
          aria-label="Sort cohorts"
        >
          <option value="created">Newest first</option>
          <option value="name">Name A to Z</option>
          <option value="organisation">Organisation A to Z</option>
        </select>
        <Button
          size="sm" variant="outline"
          disabled={shown.length === 0}
          onClick={() => setOpen(allOpen ? new Set() : new Set(shown.map((c) => c.id)))}
        >
          {allOpen ? "Close all" : "Open all"}
        </Button>
      </div>

      {q && (
        <p className="text-xs text-muted-foreground -mt-3">
          {shown.length} of {data?.length ?? 0} cohorts match
        </p>
      )}
      {shown.length === 0 && (data?.length ?? 0) > 0 && (
        <p className="text-sm text-muted-foreground">Nothing matches "{query}".</p>
      )}
      <div className="space-y-3">
        {shown.map((c) => <CohortCard key={c.id} c={c} open={open.has(c.id)} onToggle={() => toggle(c.id)} />)}
      </div>
    </div>
  );
}
