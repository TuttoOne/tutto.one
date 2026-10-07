/**
 * /learn: where a student signs in, tells us about themselves and follows
 * their sessions.
 *
 * Private and unlisted. It is kept out of the nav, the sitemap and
 * client/src/webmcp/site-index.ts, and the server sends noindex for it.
 * The modules come from shared/learn-programmes.ts; the dates from the
 * student's cohort.
 */
import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/layout/Layout";
import { SITE_TITLE } from "@/lib/i18n";
import type { Material } from "@shared/learn-programmes";

const ROBOTO: React.CSSProperties = { fontFamily: "'Roboto', -apple-system, sans-serif" };
const INTER: React.CSSProperties = { fontFamily: "'Inter', -apple-system, sans-serif" };
const CAPS: React.CSSProperties = { ...INTER, textTransform: "uppercase", letterSpacing: "0.12em" };

const BG = "#f6f1ea";
const INK = "#1a1a1a";
const AMBER = "#d97706";
const RULE = "#d8d0c5";
const MUTED = "#6b645a";

const PAGE: React.CSSProperties = { minHeight: "100vh", background: BG, color: INK, ...INTER };
// The site header is fixed and 64px tall, so the page starts below it.
const WRAP: React.CSSProperties = { maxWidth: 760, margin: "0 auto", padding: "112px 16px 96px" };
const CARD: React.CSSProperties = { background: "#fff", border: `1px solid ${RULE}`, borderRadius: 10, padding: 24 };
const H1: React.CSSProperties = { ...ROBOTO, fontSize: 32, fontWeight: 700, lineHeight: 1.15, margin: "0 0 12px" };
const H2: React.CSSProperties = { ...ROBOTO, fontSize: 20, fontWeight: 700, margin: "0 0 8px" };
const LABEL: React.CSSProperties = { ...CAPS, fontSize: 10, color: MUTED, display: "block", marginBottom: 6 };
const INPUT: React.CSSProperties = {
  width: "100%", boxSizing: "border-box", background: "#fff", border: `1px solid ${RULE}`,
  borderRadius: 6, color: INK, padding: "10px 12px", fontSize: 14, outline: "none", ...INTER,
};
const BUTTON: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: 8, background: AMBER, color: "#fff",
  border: `1px solid ${AMBER}`, ...ROBOTO, fontSize: 13, fontWeight: 700, padding: "11px 22px",
  borderRadius: 6, textDecoration: "none", letterSpacing: "0.04em", cursor: "pointer",
};
const BUTTON_QUIET: React.CSSProperties = { ...BUTTON, background: "transparent", color: INK, borderColor: INK };

function useTitle(title: string) {
  useEffect(() => {
    document.title = `${title} | Tutto`;
    return () => { document.title = SITE_TITLE; };
  }, [title]);
}

// ── Types (as /api/learn/me sends them) ──────────────────────────────────────

type ProgressStatus = "not_started" | "in_progress" | "done";

type ModuleView = {
  number: number;
  title: string;
  what: string;
  leaveWith?: string;
  practice: string;
  materials: Material[];
  session: { startsAt: string; endsAt: string; status: string } | null;
  progress: { status: ProgressStatus; practiceNote: string | null };
};

type StudentView = {
  id: number;
  name: string;
  email: string;
  jobTitle: string | null;
  linkedinUrl: string | null;
  background: string | null;
  currentAccounts: string | null;
  taskToBring: string | null;
  setupNotes: string | null;
  altContactName: string | null;
  altContactEmail: string | null;
  altContactPhone: string | null;
  profileCompletedAt: string | null;
};

type Me = {
  student: StudentView;
  cohort: {
    name: string;
    organisation: string | null;
    programmeName: string;
    timezone: string;
    sessionMinutes: number;
    meetUrl: string | null;
  };
  spares: { startsAt: string; endsAt: string }[];
  modules: ModuleView[];
};

async function api<T>(method: string, url: string, body?: unknown): Promise<T> {
  const res = await fetch(url, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    credentials: "same-origin",
  });
  if (res.status === 401) throw new Error("UNAUTHORIZED");
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Something went wrong");
  return data as T;
}

function useMe() {
  const [, navigate] = useLocation();
  const query = useQuery({
    queryKey: ["/api/learn/me"],
    queryFn: () => api<Me>("GET", "/api/learn/me"),
    retry: false,
  });
  useEffect(() => {
    if (query.error?.message === "UNAUTHORIZED") navigate("/learn");
  }, [query.error, navigate]);
  return query;
}

// ── Dates ────────────────────────────────────────────────────────────────────

const viewerZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

function formatWhen(iso: string, timeZone?: string): string {
  const d = new Date(iso);
  const day = new Intl.DateTimeFormat("en-GB", { timeZone, weekday: "long", day: "numeric", month: "long" }).format(d);
  const time = new Intl.DateTimeFormat("en-GB", { timeZone, hour: "2-digit", minute: "2-digit" }).format(d);
  return `${day}, ${time}`;
}

function zoneName(timeZone: string): string {
  return timeZone.split("/").pop()!.replace(/_/g, " ");
}

/** One .ics file with every session in it, so the whole run lands in one go. */
function calendarFile(me: Me): string {
  const stamp = (iso: string) => new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const esc = (t: string) => t.replace(/\\/g, "\\\\").replace(/[,;]/g, (m) => `\\${m}`).replace(/\n/g, "\\n");
  const events = me.modules.filter((m) => m.session).map((m) => [
    "BEGIN:VEVENT",
    `UID:tutto-learn-${me.student.id}-${m.number}@tutto.one`,
    `DTSTAMP:${stamp(new Date().toISOString())}`,
    `DTSTART:${stamp(m.session!.startsAt)}`,
    `DTEND:${stamp(m.session!.endsAt)}`,
    `SUMMARY:${esc(`${me.cohort.programmeName} ${m.number}: ${m.title}`)}`,
    ...(me.cohort.meetUrl ? [`LOCATION:${esc(me.cohort.meetUrl)}`, `URL:${me.cohort.meetUrl}`] : []),
    `DESCRIPTION:${esc(`${m.what}\n\nYour dashboard: https://tutto.one/learn/dashboard`)}`,
    "END:VEVENT",
  ].join("\r\n"));
  return ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Tutto//Learn//EN", ...events, "END:VCALENDAR"].join("\r\n");
}

function downloadCalendar(me: Me) {
  const blob = new Blob([calendarFile(me)], { type: "text/calendar" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "tutto-sessions.ics";
  a.click();
  URL.revokeObjectURL(a.href);
}

// ── /learn ───────────────────────────────────────────────────────────────────

export function LearnLogin() {
  useTitle("Sign in");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const send = useMutation({
    mutationFn: () => api("POST", "/api/learn/login", { email }),
    onSuccess: () => setSent(true),
  });

  return (
    <div style={PAGE}>
      <Header />
      <div style={{ ...WRAP, maxWidth: 480 }}>
        <span style={{ ...CAPS, fontSize: 11, color: AMBER }}>Praxis</span>
        <h1 style={{ ...H1, marginTop: 8 }}>Your sessions</h1>
        {sent ? (
          <div style={CARD}>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6 }}>
              If {email} is on one of our programmes, a sign-in link is on its way. It lasts 30 minutes. Check your spam folder if it hasn't arrived in a couple of minutes.
            </p>
          </div>
        ) : (
          <form
            style={CARD}
            onSubmit={(e) => { e.preventDefault(); send.mutate(); }}
          >
            <p style={{ margin: "0 0 20px", fontSize: 15, lineHeight: 1.6 }}>
              Enter the email address we enrolled you with and we'll send you a link to sign in. There's no password to remember.
            </p>
            <label style={LABEL} htmlFor="learn-email">Email</label>
            <input
              id="learn-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ ...INPUT, marginBottom: 16 }}
            />
            <button type="submit" style={BUTTON} disabled={send.isPending}>
              {send.isPending ? "Sending..." : "Send me a link"}
            </button>
            {send.error && <p style={{ color: "#b91c1c", fontSize: 13, marginTop: 12 }}>{send.error.message}</p>}
          </form>
        )}
      </div>
    </div>
  );
}

// ── /learn/auth?token= ───────────────────────────────────────────────────────

export function LearnAuth() {
  useTitle("Signing in");
  const [, navigate] = useLocation();
  const qc = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");
    if (!token) { setError("This link is missing its code."); return; }
    api("POST", "/api/learn/auth", { token })
      .then(() => {
        qc.removeQueries({ queryKey: ["/api/learn/me"] });
        navigate("/learn/dashboard", { replace: true });
      })
      .catch((e: Error) => setError(e.message === "UNAUTHORIZED" ? "This link has expired or has already been used." : e.message));
  }, [navigate, qc]);

  return (
    <div style={PAGE}>
      <Header />
      <div style={{ ...WRAP, maxWidth: 480 }}>
        {error ? (
          <div style={CARD}>
            <p style={{ margin: "0 0 16px", fontSize: 15, lineHeight: 1.6 }}>{error}</p>
            <Link href="/learn" style={BUTTON}>Send me a new link</Link>
          </div>
        ) : (
          <p style={{ color: MUTED }}>Signing you in...</p>
        )}
      </div>
    </div>
  );
}

// ── /learn/dashboard ─────────────────────────────────────────────────────────

const STATUS_LABEL: Record<ProgressStatus, string> = {
  not_started: "Not started",
  in_progress: "In progress",
  done: "Done",
};

function StepCard({ n, title, done, children }: { n: number; title: string; done?: boolean; children: React.ReactNode }) {
  return (
    <div style={{ ...CARD, display: "flex", gap: 16 }}>
      <div style={{
        flex: "0 0 32px", height: 32, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center",
        background: done ? AMBER : "transparent", border: `1px solid ${done ? AMBER : RULE}`,
        color: done ? "#fff" : MUTED, ...ROBOTO, fontWeight: 700, fontSize: 14,
      }}>
        {done ? "✓" : n}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <h2 style={{ ...H2, fontSize: 17 }}>{title}</h2>
        {children}
      </div>
    </div>
  );
}

function ModuleCard({ m, timezone, past }: { m: ModuleView; timezone: string; past: boolean }) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(!past && m.progress.status !== "done");
  const save = useMutation({
    mutationFn: (status: ProgressStatus) => api("PUT", `/api/learn/progress/${m.number}`, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/learn/me"] }),
  });
  const done = m.progress.status === "done";

  return (
    <div style={{ ...CARD, padding: 0, overflow: "hidden" }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        style={{
          width: "100%", textAlign: "left", background: "transparent", border: 0, padding: "18px 24px",
          display: "flex", gap: 16, alignItems: "baseline", cursor: "pointer", color: INK,
        }}
      >
        <span style={{ ...ROBOTO, fontWeight: 700, color: done ? AMBER : MUTED, fontSize: 14, minWidth: 24 }}>
          {String(m.number).padStart(2, "0")}
        </span>
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ ...ROBOTO, fontWeight: 700, fontSize: 17, display: "block" }}>{m.title}</span>
          <span style={{ fontSize: 13, color: MUTED }}>
            {m.session ? formatWhen(m.session.startsAt) : "Date to be agreed"}
            {m.session && viewerZone !== timezone ? ` (${zoneName(viewerZone)} time)` : ""}
          </span>
        </span>
        <span style={{ ...CAPS, fontSize: 10, color: done ? AMBER : MUTED, whiteSpace: "nowrap" }}>
          {STATUS_LABEL[m.progress.status]}
        </span>
      </button>

      {open && (
        <div style={{ padding: "0 24px 24px 64px" }}>
          <p style={{ margin: "0 0 12px", fontSize: 15, lineHeight: 1.6 }}>{m.what}</p>
          {m.leaveWith && (
            <p style={{ margin: "0 0 16px", fontSize: 14 }}>
              <span style={{ ...CAPS, fontSize: 10, color: AMBER, marginRight: 8 }}>You leave with</span>
              {m.leaveWith}
            </p>
          )}
          <div style={{ background: BG, borderRadius: 8, padding: "12px 16px", marginBottom: 16 }}>
            <span style={LABEL}>Before the next session</span>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6 }}>{m.practice}</p>
          </div>
          {m.materials.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <span style={LABEL}>Reading and tools</span>
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14, lineHeight: 1.8, listStyle: "disc" }}>
                {m.materials.map((mat) => (
                  <li key={mat.href}>
                    <a href={mat.href} target="_blank" rel="noopener noreferrer" style={{ color: INK }}>{mat.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {done ? (
              <button type="button" style={BUTTON_QUIET} onClick={() => save.mutate("in_progress")} disabled={save.isPending}>
                Mark as not done
              </button>
            ) : (
              <button type="button" style={BUTTON} onClick={() => save.mutate("done")} disabled={save.isPending}>
                Mark as done
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function LearnDashboard() {
  useTitle("Your dashboard");
  const [, navigate] = useLocation();
  const qc = useQueryClient();
  const { data: me, isLoading, error } = useMe();

  const logout = useMutation({
    mutationFn: () => api("POST", "/api/learn/logout"),
    onSuccess: () => { qc.clear(); navigate("/learn"); },
  });

  if (isLoading || (error && error.message === "UNAUTHORIZED")) {
    return <div style={PAGE}><Header /><div style={WRAP}><p style={{ color: MUTED }}>Loading...</p></div></div>;
  }
  if (!me) {
    return <div style={PAGE}><Header /><div style={WRAP}><p>{error?.message ?? "Something went wrong."}</p></div></div>;
  }

  const now = Date.now();
  const next = me.modules.find((m) => m.session && new Date(m.session.endsAt).getTime() > now);
  const doneCount = me.modules.filter((m) => m.progress.status === "done").length;
  const profileDone = !!me.student.profileCompletedAt;
  const first = me.student.name.split(" ")[0];

  return (
    <div style={PAGE}>
      <Header />
      <div style={WRAP}>
        <span style={{ ...CAPS, fontSize: 11, color: AMBER }}>
          {me.cohort.programmeName}{me.cohort.organisation ? ` · ${me.cohort.organisation}` : ""}
        </span>
        <h1 style={{ ...H1, marginTop: 8 }}>Hi {first}</h1>
        <p style={{ margin: "0 0 32px", fontSize: 16, lineHeight: 1.6, color: MUTED }}>
          Everything for your sessions is here: the dates, what we cover each time, the reading and a short task in between.
        </p>

        {/* Next session */}
        <div style={{ background: INK, color: BG, borderRadius: 10, padding: 24, marginBottom: 32 }}>
          <span style={{ ...CAPS, fontSize: 10, color: AMBER, display: "block", marginBottom: 8 }}>
            {next ? `Next session · ${next.number} of ${me.modules.length}` : "Sessions"}
          </span>
          {next ? (
            <>
              <p style={{ ...ROBOTO, fontSize: 22, fontWeight: 700, margin: "0 0 4px" }}>{next.title}</p>
              <p style={{ margin: "0 0 4px", fontSize: 15 }}>{formatWhen(next.session!.startsAt)}, {me.cohort.sessionMinutes} minutes</p>
              {viewerZone !== me.cohort.timezone && (
                <p style={{ margin: 0, fontSize: 13, color: "rgba(246,241,234,0.6)" }}>
                  That's {formatWhen(next.session!.startsAt, me.cohort.timezone)} {zoneName(me.cohort.timezone)} time.
                </p>
              )}
            </>
          ) : (
            <p style={{ margin: 0, fontSize: 15 }}>
              {me.modules.some((m) => m.session) ? "That was the last one. Keep sending a piece of work a week for review." : "We'll put your dates here as soon as they're agreed."}
            </p>
          )}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 20 }}>
            {me.cohort.meetUrl && next && (
              <a href={me.cohort.meetUrl} target="_blank" rel="noopener noreferrer" style={BUTTON}>Join the call</a>
            )}
            {me.modules.some((m) => m.session) && (
              <button type="button" onClick={() => downloadCalendar(me)} style={{ ...BUTTON_QUIET, color: BG, borderColor: "rgba(246,241,234,0.4)" }}>
                Add all sessions to my calendar
              </button>
            )}
          </div>
        </div>

        {/* Getting started */}
        <h2 style={H2}>Getting started</h2>
        <div style={{ display: "grid", gap: 12, marginBottom: 40 }}>
          <StepCard n={1} title="Tell us about you" done={profileDone}>
            <p style={{ margin: "0 0 12px", fontSize: 14, lineHeight: 1.6, color: MUTED }}>
              {profileDone
                ? "Thanks, we've got it. You can update it any time."
                : "Your role, your background and the task you'd like help with, so we can prepare for you before we meet. About 5 minutes."}
            </p>
            <Link href="/learn/profile" style={profileDone ? BUTTON_QUIET : BUTTON}>
              {profileDone ? "Edit my profile" : "Fill in my profile"}
            </Link>
          </StepCard>
          <StepCard n={2} title="Your use cases">
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: MUTED }}>
              Next, we write up the jobs you want AI to help with, one card each. We'll open this step once your profile is in.
            </p>
          </StepCard>
        </div>

        {/* Modules */}
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 16, marginBottom: 8 }}>
          <h2 style={{ ...H2, margin: 0 }}>Your sessions</h2>
          <span style={{ fontSize: 13, color: MUTED }}>{doneCount} of {me.modules.length} done</span>
        </div>
        <div style={{ height: 6, background: RULE, borderRadius: 3, marginBottom: 16, overflow: "hidden" }}>
          <div style={{ width: `${(doneCount / Math.max(me.modules.length, 1)) * 100}%`, height: "100%", background: AMBER }} />
        </div>
        <div style={{ display: "grid", gap: 12 }}>
          {me.modules.map((m) => (
            <ModuleCard
              key={m.number}
              m={m}
              timezone={me.cohort.timezone}
              past={!!m.session && new Date(m.session.endsAt).getTime() < now}
            />
          ))}
        </div>
        {me.spares.length > 0 && (
          <p style={{ fontSize: 13, color: MUTED, marginTop: 16 }}>
            Held spare in case a session moves: {me.spares.map((s) => formatWhen(s.startsAt)).join(" and ")}.
          </p>
        )}

        <div style={{ marginTop: 48, paddingTop: 24, borderTop: `1px solid ${RULE}`, display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap", fontSize: 13, color: MUTED }}>
          <span>Questions? Email <a href="mailto:daniel@tutto.one" style={{ color: INK }}>daniel@tutto.one</a></span>
          <button type="button" onClick={() => logout.mutate()} style={{ background: "none", border: 0, color: MUTED, cursor: "pointer", fontSize: 13, textDecoration: "underline" }}>
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}

// ── /learn/profile ───────────────────────────────────────────────────────────

const PROFILE_FIELDS = [
  "name", "jobTitle", "linkedinUrl", "background", "currentAccounts", "taskToBring", "setupNotes",
  "altContactName", "altContactEmail", "altContactPhone",
] as const;
type ProfileForm = Record<(typeof PROFILE_FIELDS)[number], string>;

function Field({ id, label, hint, value, onChange, multiline, type = "text", required }: {
  id: string; label: string; hint?: string; value: string; onChange: (v: string) => void;
  multiline?: boolean; type?: string; required?: boolean;
}) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label htmlFor={id} style={LABEL}>{label}</label>
      {hint && <p style={{ margin: "0 0 8px", fontSize: 13, color: MUTED, lineHeight: 1.5 }}>{hint}</p>}
      {multiline ? (
        <textarea id={id} value={value} onChange={(e) => onChange(e.target.value)} rows={5} style={{ ...INPUT, resize: "vertical" }} />
      ) : (
        <input id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)} required={required} style={INPUT} />
      )}
    </div>
  );
}

export function LearnProfile() {
  useTitle("Your profile");
  const [, navigate] = useLocation();
  const qc = useQueryClient();
  const { data: me } = useMe();
  const [form, setForm] = useState<ProfileForm | null>(null);

  useEffect(() => {
    if (me && !form) {
      setForm(Object.fromEntries(PROFILE_FIELDS.map((k) => [k, me.student[k] ?? ""])) as ProfileForm);
    }
  }, [me, form]);

  const save = useMutation({
    mutationFn: (data: ProfileForm) => api("PUT", "/api/learn/profile", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/learn/me"] });
      navigate("/learn/dashboard");
    },
  });

  if (!me || !form) {
    return <div style={PAGE}><Header /><div style={WRAP}><p style={{ color: MUTED }}>Loading...</p></div></div>;
  }
  const set = (k: keyof ProfileForm) => (v: string) => setForm({ ...form, [k]: v });
  const solo = !me.cohort.organisation;

  return (
    <div style={PAGE}>
      <Header />
      <div style={WRAP}>
        <Link href="/learn/dashboard" style={{ fontSize: 13, color: MUTED }}>Back to your dashboard</Link>
        <h1 style={{ ...H1, marginTop: 16 }}>Tell us about you</h1>
        <p style={{ margin: "0 0 32px", fontSize: 16, lineHeight: 1.6, color: MUTED }}>
          We read this before the first session, so we can work on your real tasks from the start. Only we see it.
        </p>

        <form onSubmit={(e) => { e.preventDefault(); save.mutate(form); }}>
          <div style={{ ...CARD, marginBottom: 16 }}>
            <h2 style={{ ...H2, fontSize: 17, marginBottom: 16 }}>You</h2>
            <Field id="name" label="Your name" value={form.name} onChange={set("name")} required />
            <Field id="jobTitle" label="Your role" value={form.jobTitle} onChange={set("jobTitle")} />
            <Field
              id="linkedinUrl" label="LinkedIn or a profile link" type="url"
              hint="Optional. Any page that says what you do."
              value={form.linkedinUrl} onChange={set("linkedinUrl")}
            />
            <Field
              id="background" label="Your background" multiline
              hint="What your work involves day to day, and how you use AI now, if at all."
              value={form.background} onChange={set("background")}
            />
          </div>

          <div style={{ ...CARD, marginBottom: 16 }}>
            <h2 style={{ ...H2, fontSize: 17, marginBottom: 16 }}>Your setup and your task</h2>
            <Field
              id="currentAccounts" label="Which AI accounts do you have?"
              hint="For example Claude Pro, ChatGPT free, Copilot through work."
              value={form.currentAccounts} onChange={set("currentAccounts")}
            />
            <Field
              id="taskToBring" label="One real task you'd like help with" multiline
              hint="Something from your own week that repeats. Leave out client names and personal data for now."
              value={form.taskToBring} onChange={set("taskToBring")}
            />
            <Field
              id="setupNotes" label="Your computer"
              hint={solo ? "Make, model and operating system, so we can check it's ready before we start." : "Mac or Windows, and whether it's a work laptop with restrictions on what you can install."}
              value={form.setupNotes} onChange={set("setupNotes")}
            />
          </div>

          <div style={{ ...CARD, marginBottom: 24 }}>
            <h2 style={{ ...H2, fontSize: 17, marginBottom: 4 }}>Someone else we can contact</h2>
            <p style={{ margin: "0 0 16px", fontSize: 13, color: MUTED, lineHeight: 1.5 }}>
              Optional. Who we should get in touch with if a session moves and we can't reach you{solo ? "" : ", such as a colleague or an assistant"}.
            </p>
            <Field id="altContactName" label="Name" value={form.altContactName} onChange={set("altContactName")} />
            <Field id="altContactEmail" label="Email" type="email" value={form.altContactEmail} onChange={set("altContactEmail")} />
            <Field id="altContactPhone" label="Phone" type="tel" value={form.altContactPhone} onChange={set("altContactPhone")} />
          </div>

          <button type="submit" style={BUTTON} disabled={save.isPending}>
            {save.isPending ? "Saving..." : "Save my profile"}
          </button>
          {save.error && <p style={{ color: "#b91c1c", fontSize: 13, marginTop: 12 }}>{save.error.message}</p>}
        </form>
      </div>
    </div>
  );
}
