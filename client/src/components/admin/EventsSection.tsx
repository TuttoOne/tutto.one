/**
 * The admin's Events tab: the evenings people book at /rieuzal, who is coming
 * and who is waiting. Talks to /api/admin/events in server/event-routes.ts.
 *
 * More places, or reopening an evening, moves people up from the waiting list
 * and emails them. Cancelling a confirmed booking does the same.
 */
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronDown, ChevronRight, Copy, ExternalLink, Plus, UserPlus } from "lucide-react";
import type { Event } from "@shared/schema";

type AdminEvent = Event & { confirmedSeats: number; waitlistBookings: number; waitlistSeats: number };
type AdminBooking = {
  id: number; name: string; email: string; company: string | null; seats: number; status: string;
  promotedAt: string | null; reminderSentAt: string | null; cancelledAt: string | null; createdAt: string;
};

const KEY = ["/api/admin/events"];
const STATUSES = ["open", "closed", "hidden", "cancelled"] as const;

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

const paris = (d: string | Date) =>
  new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Paris", weekday: "short", day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(d));

/** "2026-11-05T18:30" in Paris time, for a datetime-local input. */
function toLocalInput(d: string | Date) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Paris", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
      .formatToParts(new Date(d)).map((p) => [p.type, p.value]),
  );
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
}

/** The reverse: a Paris wall-clock time from the input, as a real instant. */
function fromLocalInput(v: string) {
  const guess = new Date(`${v}:00Z`);
  const shown = toLocalInput(guess);
  const drift = new Date(`${shown}:00Z`).getTime() - guess.getTime();
  return new Date(guess.getTime() - drift).toISOString();
}

const STATUS_STYLE: Record<string, string> = {
  open: "bg-primary/15 text-primary",
  closed: "bg-secondary text-secondary-foreground",
  hidden: "bg-muted text-muted-foreground",
  cancelled: "bg-destructive/15 text-destructive",
  confirmed: "bg-primary/15 text-primary",
  waitlist: "bg-secondary text-secondary-foreground",
};

function Pill({ s }: { s: string }) {
  const label: Record<string, string> = { waitlist: "waiting list" };
  return <span className={`text-xs px-2 py-0.5 rounded ${STATUS_STYLE[s] ?? "bg-muted"}`}>{label[s] ?? s}</span>;
}

// ── One evening ──────────────────────────────────────────────────────────────

function EventRow({ e }: { e: AdminEvent }) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: e.title, note: e.note ?? "", startsAt: toLocalInput(e.startsAt), capacity: String(e.capacity),
    venue: e.venue, address: e.address, status: e.status,
  });
  const [add, setAdd] = useState({ name: "", email: "", company: "", seats: "1", force: false, notify: true });
  const bookingsKey = ["/api/admin/events", e.id, "bookings"];
  const { data: bookings = [] } = useQuery<AdminBooking[]>({
    queryKey: bookingsKey, queryFn: () => api("GET", `/api/admin/events/${e.id}/bookings`), enabled: open,
  });
  const refresh = () => { qc.invalidateQueries({ queryKey: KEY }); qc.invalidateQueries({ queryKey: bookingsKey }); };
  const moved = (names: string[]) => (names?.length ? ` Moved up and emailed: ${names.join(", ")}.` : "");

  const save = useMutation({
    mutationFn: () => api("PATCH", `/api/admin/events/${e.id}`, {
      title: form.title, note: form.note, startsAt: fromLocalInput(form.startsAt), capacity: Number(form.capacity),
      venue: form.venue, address: form.address, status: form.status,
    }),
    onSuccess: (r) => { setMsg(`Saved.${moved(r.moved)}`); refresh(); },
    onError: (err: Error) => setMsg(err.message),
  });
  const addBooking = useMutation({
    mutationFn: () => api("POST", `/api/admin/events/${e.id}/bookings`, { ...add, seats: Number(add.seats) }),
    onSuccess: (r) => { setMsg(r.status === "confirmed" ? "Booked." : "Full, so they're on the waiting list."); setAdd({ ...add, name: "", email: "", company: "", seats: "1" }); refresh(); },
    onError: (err: Error) => setMsg(err.message),
  });
  const cancel = useMutation({
    mutationFn: (b: AdminBooking) => api("POST", `/api/admin/bookings/${b.id}/cancel`, { notify: true }),
    onSuccess: (r) => { setMsg(`Cancelled.${moved(r.moved)}`); refresh(); },
    onError: (err: Error) => setMsg(err.message),
  });
  const confirm = useMutation({
    mutationFn: (b: AdminBooking) => api("POST", `/api/admin/bookings/${b.id}/confirm`),
    onSuccess: () => { setMsg("Let in and emailed."); refresh(); },
    onError: (err: Error) => setMsg(err.message),
  });

  const active = bookings.filter((b) => b.status !== "cancelled");
  const confirmed = active.filter((b) => b.status === "confirmed");
  const waiting = active.filter((b) => b.status === "waitlist");
  const cancelled = bookings.filter((b) => b.status === "cancelled");
  const past = new Date(e.endsAt) < new Date();

  async function copyEmails() {
    const list = confirmed.map((b) => b.email).join(", ");
    try { await navigator.clipboard.writeText(list); setMsg("Emails copied."); } catch { setMsg(list); }
  }

  const bookingRow = (b: AdminBooking, i: number) => (
    <div key={b.id} className="py-2 text-sm grid gap-1 sm:grid-cols-[1fr_auto] items-center">
      <div className="min-w-0">
        <p className="truncate">
          {b.status === "waitlist" && <span className="text-muted-foreground mr-1">{i + 1}.</span>}
          <span className="font-medium">{b.name}</span>{b.seats > 1 ? ` +${b.seats - 1}` : ""} · {b.email}{b.company ? ` · ${b.company}` : ""}
        </p>
        <p className="text-xs text-muted-foreground">
          Booked {paris(b.createdAt)}{b.promotedAt ? ` · moved up ${paris(b.promotedAt)}` : ""}{b.reminderSentAt ? " · reminder sent" : ""}{b.cancelledAt ? ` · cancelled ${paris(b.cancelledAt)}` : ""}
        </p>
      </div>
      {b.status !== "cancelled" && !past && (
        <div className="flex gap-2">
          {b.status === "waitlist" && <Button size="sm" variant="outline" onClick={() => confirm.mutate(b)}>Let in</Button>}
          <Button size="sm" variant="ghost" className="text-destructive" onClick={() => { if (window.confirm(`Cancel ${b.name}'s booking? They get an email.`)) cancel.mutate(b); }}>Cancel</Button>
        </div>
      )}
    </div>
  );

  return (
    <div className="border rounded-md">
      <button className="w-full p-3 text-left flex items-center gap-3" onClick={() => setOpen(!open)}>
        {open ? <ChevronDown className="w-4 h-4 shrink-0" /> : <ChevronRight className="w-4 h-4 shrink-0" />}
        <div className="min-w-0 flex-1">
          <p className="font-medium truncate">{paris(e.startsAt)} · {e.title}</p>
          <p className="text-sm text-muted-foreground truncate">{e.note ? `${e.note} · ` : ""}{e.venue}</p>
        </div>
        <span className="text-sm tabular-nums whitespace-nowrap">{e.confirmedSeats}/{e.capacity}{e.waitlistBookings ? ` · ${e.waitlistBookings} waiting` : ""}</span>
        <Pill s={past ? "closed" : e.status} />
      </button>
      {open && (
        <div className="border-t p-4 space-y-5">
          {msg && <p className="text-sm text-primary">{msg}</p>}

          <section>
            <div className="flex items-center justify-between gap-2 mb-1">
              <h4 className="font-semibold text-sm">Coming ({confirmed.reduce((n, b) => n + b.seats, 0)} of {e.capacity})</h4>
              {confirmed.length > 0 && <Button size="sm" variant="outline" onClick={copyEmails}><Copy className="w-4 h-4 mr-1" />Copy emails</Button>}
            </div>
            {confirmed.length ? <div className="divide-y">{confirmed.map(bookingRow)}</div> : <p className="text-sm text-muted-foreground/70">Nobody yet.</p>}
          </section>

          {waiting.length > 0 && (
            <section>
              <h4 className="font-semibold text-sm mb-1">Waiting list, in order</h4>
              <div className="divide-y">{waiting.map(bookingRow)}</div>
            </section>
          )}

          {cancelled.length > 0 && (
            <details className="text-sm">
              <summary className="cursor-pointer text-muted-foreground">Cancelled ({cancelled.length})</summary>
              <div className="divide-y">{cancelled.map(bookingRow)}</div>
            </details>
          )}

          {!past && (
            <section className="space-y-2">
              <h4 className="font-semibold text-sm flex items-center gap-1"><UserPlus className="w-4 h-4" />Add someone who booked by email or phone</h4>
              <div className="grid gap-2 sm:grid-cols-[1fr_1fr_1fr_80px]">
                <Input placeholder="Name" value={add.name} onChange={(ev) => setAdd({ ...add, name: ev.target.value })} />
                <Input placeholder="Email" value={add.email} onChange={(ev) => setAdd({ ...add, email: ev.target.value })} />
                <Input placeholder="Company" value={add.company} onChange={(ev) => setAdd({ ...add, company: ev.target.value })} />
                <Input type="number" min={1} max={4} aria-label="Places" value={add.seats} onChange={(ev) => setAdd({ ...add, seats: ev.target.value })} />
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <label className="flex items-center gap-2"><input type="checkbox" checked={add.notify} onChange={(ev) => setAdd({ ...add, notify: ev.target.checked })} />Email them</label>
                <label className="flex items-center gap-2"><input type="checkbox" checked={add.force} onChange={(ev) => setAdd({ ...add, force: ev.target.checked })} />Give them a place even if it's full</label>
                <Button size="sm" onClick={() => addBooking.mutate()} disabled={addBooking.isPending || !add.name || !add.email}>Add</Button>
              </div>
            </section>
          )}

          <section className="space-y-2">
            <h4 className="font-semibold text-sm">The evening</h4>
            <div className="grid gap-2 sm:grid-cols-2">
              <div><Label>Title</Label><Input value={form.title} onChange={(ev) => setForm({ ...form, title: ev.target.value })} /></div>
              <div><Label>Theme or guest (one line)</Label><Input value={form.note} onChange={(ev) => setForm({ ...form, note: ev.target.value })} /></div>
              <div><Label>Starts (Paris time)</Label><Input type="datetime-local" value={form.startsAt} onChange={(ev) => setForm({ ...form, startsAt: ev.target.value })} /></div>
              <div><Label>Places</Label><Input type="number" min={1} value={form.capacity} onChange={(ev) => setForm({ ...form, capacity: ev.target.value })} /></div>
              <div><Label>Venue</Label><Input value={form.venue} onChange={(ev) => setForm({ ...form, venue: ev.target.value })} /></div>
              <div><Label>Address</Label><Input value={form.address} onChange={(ev) => setForm({ ...form, address: ev.target.value })} /></div>
              <div>
                <Label>Status</Label>
                <select className="w-full h-9 rounded-md border bg-background px-2 text-sm" value={form.status} onChange={(ev) => setForm({ ...form, status: ev.target.value })}>
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <p className="text-xs text-muted-foreground mt-1">Open: bookable. Closed: shown, not bookable. Hidden: not shown. Cancelled: shown as cancelled (email the people booked yourself).</p>
              </div>
            </div>
            <Button size="sm" onClick={() => save.mutate()} disabled={save.isPending}>Save</Button>
          </section>
        </div>
      )}
    </div>
  );
}

// ── A new evening ────────────────────────────────────────────────────────────

function NewEvent({ last }: { last?: AdminEvent }) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [f, setF] = useState({
    series: last?.series ?? "rieuzal", title: "Soirée IA avec Mistral", note: "", startsAt: "",
    capacity: String(last?.capacity ?? 15), venue: last?.venue ?? "", address: last?.address ?? "", status: "open",
  });
  const create = useMutation({
    mutationFn: () => api("POST", "/api/admin/events", { ...f, capacity: Number(f.capacity), startsAt: fromLocalInput(f.startsAt), minutes: 90 }),
    onSuccess: () => { setMsg("Added."); setOpen(false); qc.invalidateQueries({ queryKey: KEY }); },
    onError: (e: Error) => setMsg(e.message),
  });
  if (!open) return <Button size="sm" variant="outline" onClick={() => setOpen(true)}><Plus className="w-4 h-4 mr-1" />Add an evening</Button>;
  return (
    <div className="border rounded-md p-4 space-y-2">
      {msg && <p className="text-sm text-primary">{msg}</p>}
      <div className="grid gap-2 sm:grid-cols-2">
        <div><Label>Series (its page is /series)</Label><Input value={f.series} onChange={(e) => setF({ ...f, series: e.target.value })} /></div>
        <div><Label>Title</Label><Input value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} /></div>
        <div><Label>Theme or guest</Label><Input value={f.note} onChange={(e) => setF({ ...f, note: e.target.value })} /></div>
        <div><Label>Starts (Paris time, 90 minutes)</Label><Input type="datetime-local" value={f.startsAt} onChange={(e) => setF({ ...f, startsAt: e.target.value })} /></div>
        <div><Label>Places</Label><Input type="number" min={1} value={f.capacity} onChange={(e) => setF({ ...f, capacity: e.target.value })} /></div>
        <div><Label>Venue</Label><Input value={f.venue} onChange={(e) => setF({ ...f, venue: e.target.value })} /></div>
        <div className="sm:col-span-2"><Label>Address</Label><Input value={f.address} onChange={(e) => setF({ ...f, address: e.target.value })} /></div>
      </div>
      <div className="flex gap-2">
        <Button size="sm" onClick={() => create.mutate()} disabled={create.isPending || !f.startsAt}>Add</Button>
        <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
      </div>
    </div>
  );
}

export function EventsSection() {
  const { data: rows = [], isLoading } = useQuery<AdminEvent[]>({ queryKey: KEY, queryFn: () => api("GET", "/api/admin/events") });
  const [showPast, setShowPast] = useState(false);
  const now = new Date();
  const upcoming = rows.filter((e) => new Date(e.endsAt) >= now);
  const past = rows.filter((e) => new Date(e.endsAt) < now);
  const series = Array.from(new Set(rows.map((e) => e.series)));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold">Evenings</h2>
          <p className="text-sm text-muted-foreground">
            Public pages: {series.map((s) => <a key={s} href={`/${s}`} target="_blank" rel="noopener" className="text-primary inline-flex items-center gap-1 mr-2">/{s}<ExternalLink className="w-3 h-3" /></a>)}
          </p>
        </div>
        <NewEvent last={rows[rows.length - 1]} />
      </div>
      {isLoading ? <p className="text-sm text-muted-foreground">Loading...</p> : (
        <div className="space-y-2">{upcoming.map((e) => <EventRow key={e.id} e={e} />)}</div>
      )}
      {past.length > 0 && (
        <div>
          <Button size="sm" variant="ghost" onClick={() => setShowPast(!showPast)}>{showPast ? "Hide" : "Show"} past evenings ({past.length})</Button>
          {showPast && <div className="space-y-2 mt-2">{past.slice().reverse().map((e) => <EventRow key={e.id} e={e} />)}</div>}
        </div>
      )}
    </div>
  );
}
