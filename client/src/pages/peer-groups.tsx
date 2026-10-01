import { useEffect, useRef, useState } from "react";
import { usePageTr } from "@/lib/page-fr";
import { PEER_GROUPS_FR } from "@/lib/fr/peer-groups";
import { usePreferences } from "@/lib/preferences";
import { useTrainerCode, bookingHref } from "@/lib/trainer-code";
import { SITE_TITLE } from "@/lib/i18n";
import { price, praxisEconomics, FAST_TRACK_SESSIONS } from "@/lib/pricing";
import { PEER_GROUPS, PEER_GROUP_PAYMENT_LINKS, slotDay, slotHours, slotStart, slotSummary } from "@/lib/peer-groups";
import { Header } from "@/components/layout/Layout";

const ROBOTO: React.CSSProperties = { fontFamily: "'Roboto', -apple-system, sans-serif" };
const INTER: React.CSSProperties = { fontFamily: "'Inter', -apple-system, sans-serif" };
const MONO: React.CSSProperties = { fontFamily: "'JetBrains Mono','Fira Mono','Courier New',monospace" };
const CAPS: React.CSSProperties = { ...INTER, textTransform: "uppercase", letterSpacing: "0.12em" };

/* The readers here are mostly retired, so the form runs a size up from the
   other pages' 13px inputs and 9px labels. */
const INPUT: React.CSSProperties = {
  width: "100%", boxSizing: "border-box",
  background: "rgba(255,255,255,0.07)",
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: 6, color: "#f6f1ea",
  padding: "11px 13px", fontSize: 15,
  outline: "none",
  ...INTER,
};

const LABEL: React.CSSProperties = {
  ...CAPS, fontSize: 10, color: "rgba(246,241,234,0.55)", display: "block", marginBottom: 7,
};

const OPTIONAL: React.CSSProperties = {
  textTransform: "none", letterSpacing: 0, color: "rgba(246,241,234,0.35)",
};

const CTA_PRIMARY: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: 8,
  background: "#d97706", color: "#fff", border: "1px solid #d97706",
  ...ROBOTO, fontSize: 14, fontWeight: 700, padding: "13px 26px",
  borderRadius: 6, textDecoration: "none", letterSpacing: "0.04em",
};

const H2: React.CSSProperties = {
  ...ROBOTO, fontSize: 22, fontWeight: 800, color: "#1a1a1a", letterSpacing: "-0.2px", margin: 0,
};
const RULE: React.CSSProperties = { borderTop: "1.5px solid #1a1a1a", paddingTop: 14, marginBottom: 28 };
const CARD: React.CSSProperties = {
  border: "1px solid #d8d0c5", borderRadius: 10, padding: "22px 20px", background: "#faf8f5",
};
const BODY: React.CSSProperties = { ...INTER, fontSize: 14, lineHeight: 1.75, color: "#3d3d3d" };

/** Prefills the Cal.com booking with what the form already asked for. */
function withContact(href: string, name: string, email: string): string {
  const sep = href.includes("?") ? "&" : "?";
  return `${href}${sep}name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`;
}

export default function PeerGroups() {
  const tr = usePageTr(PEER_GROUPS_FR);
  const { locale, currency } = usePreferences();
  const seat = price("peerGroupSeat", currency, locale);
  const deposit = price("peerGroupDeposit", currency, locale);
  const econ = praxisEconomics(currency, locale);
  const fastTrack = econ.specialActive ? econ.fastTrack : econ.fastTrackRegular;
  /** Figures go into the sentence at render, so the French stays in the dictionary. */
  const fill = (en: string, subs: Record<string, string>) =>
    Object.entries(subs).reduce((acc, [k, v]) => acc.replace(`{${k}}`, v), tr(en));
  const terms = {
    seat,
    deposit,
    size: String(PEER_GROUPS.size),
    minimum: String(PEER_GROUPS.minimum),
    weeks: String(PEER_GROUPS.formWeeks),
    sessions: String(FAST_TRACK_SESSIONS),
  };

  useEffect(() => {
    document.title = "Peer Groups | Praxis | Tutto";
    return () => { document.title = SITE_TITLE; };
  }, []);

  const [form, setForm] = useState({
    name: "", email: "", background: "", goal: "", slots: [] as string[], proposed: "", withWhom: "", trainerCode: "",
  });
  /* Proposing a time sits beside the standing slots rather than replacing
     them: somebody can take Tuesday and still say Friday would suit better. */
  const [proposing, setProposing] = useState(false);
  const proposedRef = useRef<HTMLInputElement>(null);
  const trainerCode = useTrainerCode();
  // Seed the field from the visit's attribution once it is known, but never
  // overwrite something the visitor has typed themselves.
  useEffect(() => {
    if (trainerCode) setForm(f => (f.trainerCode ? f : { ...f, trainerCode }));
  }, [trainerCode]);
  const [formState, setFormState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [slotMissing, setSlotMissing] = useState(false);
  const call = bookingHref(PEER_GROUPS.callLink, trainerCode);
  /* The deposit is taken in the currency the visitor is reading the page in,
     so the amount on the button and the amount Stripe charges are the same.
     The email is passed on so the payment can be matched to the enquiry. */
  const depositHref = `${PEER_GROUP_PAYMENT_LINKS[currency].deposit}?prefilled_email=${encodeURIComponent(form.email)}`;

  const toggleSlot = (id: string) => {
    setSlotMissing(false);
    setForm(f => ({ ...f, slots: f.slots.includes(id) ? f.slots.filter(s => s !== id) : [...f.slots, id] }));
  };

  /** The card under the standing times: opens the field in the form and goes to it. */
  const proposeFromSchedule = () => {
    setSlotMissing(false);
    setProposing(true);
    // The field mounts on the next render, so wait for it before focusing.
    setTimeout(() => {
      proposedRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      proposedRef.current?.focus({ preventScroll: true });
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const proposed = proposing ? form.proposed.trim() : "";
    if (form.slots.length === 0 && !proposed) {
      setSlotMissing(true);
      return;
    }
    setFormState("sending");
    const times = PEER_GROUPS.slots.filter(s => form.slots.includes(s.id)).map(slotSummary).join(" | ");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: [
            "Peer group list: Solo Fast Track in a group of four",
            `Last role and sector: ${form.background || "-"}`,
            `Times that suit: ${times || "None of the current times"}`,
            `Proposed time: ${proposed || "-"}`,
            `Would like to learn with: ${form.withWhom || "-"}`,
            "",
            `What they want to use AI for: ${form.goal || "-"}`,
          ].join("\n"),
          trainerCode: form.trainerCode.trim() || null,
        }),
      });
      if (!res.ok) throw new Error();
      setFormState("sent");
    } catch {
      setFormState("error");
    }
  };

  const slotButton = (id: string, label: string, on: boolean, onClick: () => void) => {
    return (
      <button
        key={id}
        type="button"
        aria-pressed={on}
        onClick={onClick}
        style={{
          ...INTER, fontSize: 15, padding: "11px 16px", borderRadius: 6, cursor: "pointer", textAlign: "left",
          background: on ? "rgba(217,119,6,0.18)" : "rgba(255,255,255,0.07)",
          border: `1px solid ${on ? "#d97706" : "rgba(255,255,255,0.15)"}`,
          color: "#f6f1ea",
        }}
      >{label}</button>
    );
  };

  return (
    <div style={{ background: "#f6f1ea", minHeight: "100vh", ...INTER }}>
      <Header />
      <style>{`
        .pg-wrap { padding: 64px 20px 80px; }
        @media (min-width: 600px) { .pg-wrap { padding: 64px 32px 80px; } }

        .pg-cols-2 { display: grid; grid-template-columns: 1fr; gap: 14px; }
        @media (min-width: 680px) { .pg-cols-2 { grid-template-columns: 1fr 1fr; gap: 16px; } }

        .pg-form-row { display: grid; grid-template-columns: 1fr; gap: 14px; margin-bottom: 14px; }
        @media (min-width: 520px) { .pg-form-row { grid-template-columns: 1fr 1fr; } }

        .pg-footer-bar { display: flex; justify-content: space-between; align-items: center; border-top: 1.5px solid #1a1a1a; margin-top: 48px; padding-top: 14px; gap: 8px; flex-wrap: wrap; }

        .pg-input::placeholder { color: rgba(246,241,234,0.3); }
        .pg-input:focus { border-color: rgba(217,119,6,0.6) !important; }
      `}</style>
      <div className="pg-wrap" style={{ maxWidth: 900, margin: "0 auto" }}>

        {/* Dark intro card */}
        <div style={{ borderRadius: 12, background: "#1a1a1a", padding: "clamp(28px, 5vw, 52px)", marginBottom: 56, marginTop: 32 }}>
          <p style={{ ...CAPS, fontSize: 10, color: "#d97706", letterSpacing: "0.14em", marginBottom: 18 }}>{tr("Praxis Peer Groups")}</p>
          <h1 style={{ ...ROBOTO, fontSize: "clamp(24px, 4.2vw, 38px)", fontWeight: 800, lineHeight: 1.2, color: "#f6f1ea", marginBottom: 24, letterSpacing: "-0.3px" }}>{tr("Learn it with three people like you.")}</h1>
          <p style={{ ...INTER, fontSize: 16, lineHeight: 1.8, color: "rgba(246,241,234,0.75)", marginBottom: 16, maxWidth: 580 }}>{tr("You ran a company. Now you work on your own, and you want to use AI properly. We put you in a group of four people with a similar background, so you work through your own tasks and hear how the others are thinking about theirs.")}</p>
          <p style={{ ...INTER, fontSize: 16, lineHeight: 1.8, color: "rgba(246,241,234,0.75)", marginBottom: 28, maxWidth: 580 }}>{tr("Put your name on the list and tell us which times suit you. When your group has its four people, we set the start date.")}</p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
            <a href="#join" style={CTA_PRIMARY}>{tr("Put your name on the list")} →</a>
          </div>
          <p style={{ ...INTER, fontSize: 13, color: "rgba(246,241,234,0.45)", marginTop: 16 }}>
            {fill("Groups of {size} · {sessions} sessions of 90 minutes · Online", terms)}
          </p>
        </div>

        {/* How a group comes together */}
        <div style={{ marginBottom: 56 }}>
          <div style={RULE}><h2 style={H2}>{tr("How a Group Comes Together")}</h2></div>
          <div style={{ maxWidth: 700 }}>
            {[
              {
                label: tr("Put your name down"),
                body: tr("Tell us what you did, what you want to use AI for and which times suit you. If there's someone you'd like to learn with, name them."),
              },
              {
                label: tr("A deposit holds your seat"),
                body: fill("{deposit} holds your seat while the group fills. It comes off the price. If no group forms within {weeks} weeks you get it back in full.", terms),
              },
              {
                label: tr("A 15-minute call"),
                body: tr("We say hello and check the fit, and I tell you which group I have in mind for you."),
              },
              {
                label: tr("We set the date"),
                body: fill("When your group has its {size} people we confirm the start date and the balance is due. If the last seat is still open by then, we start with {minimum} at the same price.", terms),
              },
            ].map((item, i, all) => (
              <div key={item.label} style={{ display: "flex", gap: 20, marginBottom: i < all.length - 1 ? 26 : 0 }}>
                <div style={{ ...MONO, fontSize: 12, color: "#d97706", fontWeight: 700, flexShrink: 0, marginTop: 3, width: 22 }}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div>
                  <p style={{ ...ROBOTO, fontSize: 16, fontWeight: 700, color: "#1a1a1a", marginBottom: 6 }}>{item.label}</p>
                  <p style={BODY}>{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* The standing times, read from peer-groups.ts */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ ...RULE, marginBottom: 12 }}><h2 style={H2}>{tr("When the Groups Meet")}</h2></div>
          <p style={{ ...BODY, color: "#7a7568", marginBottom: 24, maxWidth: 580 }}>
            {fill("One session a week for {sessions} weeks, 90 minutes each, online. The times are fixed, so you choose the ones you can do and we match the people.", terms)}
          </p>
          <div className="pg-cols-2">
            {PEER_GROUPS.slots.map((slot) => {
              const start = slotStart(slot, locale);
              return (
                <div key={slot.id} style={CARD}>
                  <p style={{ ...CAPS, fontSize: 10, color: "#a8a092", marginBottom: 10 }}>{slotDay(slot, locale)}</p>
                  <p style={{ ...ROBOTO, fontSize: 26, fontWeight: 900, color: "#1a1a1a", marginBottom: 6, letterSpacing: "-0.5px" }}>{slotHours(slot, locale)}</p>
                  <p style={{ ...INTER, fontSize: 13, color: "#7a7568", marginBottom: 10 }}>{PEER_GROUPS.timezone[locale]}</p>
                  <p style={{ ...INTER, fontSize: 13, fontWeight: 600, color: "#d97706", margin: 0 }}>
                    {start ? fill("Next group starts {date}", { date: start }) : tr("Next start date to be confirmed")}
                  </p>
                </div>
              );
            })}
          </div>
          {/* The third option: a time that is not on offer yet. */}
          <div style={{ ...CARD, borderStyle: "dashed", marginTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <div style={{ maxWidth: 520 }}>
              <p style={{ ...ROBOTO, fontSize: 16, fontWeight: 700, color: "#1a1a1a", marginBottom: 6 }}>{tr("Neither time suits you?")}</p>
              <p style={{ ...BODY, margin: 0 }}>{tr("Propose the day and time that would. We plan the next groups around the people on the list.")}</p>
            </div>
            <button
              type="button"
              onClick={proposeFromSchedule}
              style={{ ...ROBOTO, fontSize: 14, fontWeight: 700, background: "transparent", color: "#1a1a1a", border: "1px solid #1a1a1a", borderRadius: 6, padding: "12px 22px", cursor: "pointer", letterSpacing: "0.04em", whiteSpace: "nowrap" }}
            >{tr("Propose a different time")} →</button>
          </div>
        </div>

        {/* Why four */}
        <div style={{ marginBottom: 56 }}>
          <div style={RULE}><h2 style={H2}>{tr("Why a Group of Four")}</h2></div>
          <div className="pg-cols-2">
            {[
              { label: "People like you", body: "We match you on what you did and what you want to do now, so the examples around the table are ones you recognise." },
              { label: "You hear how others think", body: "Each person brings their own tasks. You see three other ways of using the same tools, on work that matters to someone." },
              { label: "Small enough for your own work", body: "Four people and 90 minutes. Everybody's own task gets worked on in every session." },
              { label: "Bring your own table", body: "Know one or two people you'd like to learn with? Name them on the form and we build the group around you." },
            ].map((item) => (
              <div key={item.label} style={CARD}>
                <p style={{ ...ROBOTO, fontSize: 16, fontWeight: 700, color: "#1a1a1a", marginBottom: 8 }}>{tr(item.label)}</p>
                <p style={BODY}>{tr(item.body)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* What happens in the sessions, and what it costs */}
        <div style={{ marginBottom: 56 }}>
          <div style={RULE}><h2 style={H2}>{tr("What You Do, and What It Costs")}</h2></div>
          <div className="pg-cols-2">
            <div style={CARD}>
              <p style={{ ...CAPS, fontSize: 10, color: "#a8a092", marginBottom: 12 }}>{tr("The sessions")}</p>
              <p style={BODY}>{tr("The same four sessions as The Solo Fast Track, on your own work. You leave with your AI Use Charter, your scorecard, your hand-over list, your briefs and your checks.")}</p>
              <p style={{ ...BODY, marginTop: 12 }}>
                {tr("No coding background needed.")}{" "}
                <a href="/praxis-programme" style={{ color: "#d97706" }}>{tr("See the programme in full")}</a>.
              </p>
            </div>
            <div style={CARD}>
              <p style={{ ...CAPS, fontSize: 10, color: "#a8a092", marginBottom: 12 }}>{tr("A seat in a group")}</p>
              <p style={{ ...ROBOTO, fontSize: 32, fontWeight: 900, color: "#1a1a1a", marginBottom: 10, letterSpacing: "-1px" }}>{seat}</p>
              <p style={BODY}>
                {fill("Per person, for all {sessions} sessions. {deposit} of it is the deposit, and the balance is due when your group is confirmed. Invoiced, ex VAT.", terms)}
              </p>
              <p style={{ ...BODY, fontSize: 13, color: "#7a7568", marginTop: 12 }}>
                {fill("Prefer one to one? The Solo Fast Track is the same sessions in private, at {price}.", { price: fastTrack })}
              </p>
            </div>
          </div>
        </div>

        {/* The list */}
        <div id="join" style={{ marginTop: 64, borderRadius: 12, background: "#1a1a1a", padding: "clamp(28px, 5vw, 48px)" }}>
          <p style={{ ...CAPS, fontSize: 10, color: "#d97706", letterSpacing: "0.14em", marginBottom: 18 }}>{tr("Join the list")}</p>
          <h2 style={{ ...ROBOTO, fontSize: "clamp(20px, 3.5vw, 30px)", fontWeight: 800, lineHeight: 1.2, color: "#f6f1ea", marginBottom: 16, letterSpacing: "-0.2px" }}>{tr("Tell me about you. Then I find your group.")}</h2>
          <p style={{ ...INTER, fontSize: 15, lineHeight: 1.75, color: "rgba(246,241,234,0.7)", marginBottom: 32, maxWidth: 520 }}>{tr("A few details so I can match you with the right people. Once they're in, you pay the deposit to hold your seat and book a 15-minute call.")}</p>

          {formState === "sent" && form.slots.length > 0 ? (
            /* A time is chosen, so there is a seat to hold: the deposit comes
               first and the call sits beside it. */
            <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 8, padding: "28px 24px", textAlign: "center" }}>
              <p style={{ ...ROBOTO, fontSize: 18, fontWeight: 700, color: "#f6f1ea", marginBottom: 6 }}>{tr("You're on the list. Now hold your seat.")}</p>
              <p style={{ ...INTER, fontSize: 15, lineHeight: 1.7, color: "rgba(246,241,234,0.7)", margin: "0 auto 20px", maxWidth: 520 }}>
                {fill("The {deposit} deposit holds your seat and comes off the price. If no group forms within {weeks} weeks you get it back in full.", terms)}
              </p>
              <a href={depositHref} target="_blank" rel="noopener noreferrer" style={CTA_PRIMARY}>{fill("Pay the {deposit} deposit", terms)} →</a>
              <p style={{ ...INTER, fontSize: 14, color: "rgba(246,241,234,0.6)", marginTop: 22 }}>
                {tr("Then pick a time for the 15-minute call, so we can say hello and I can tell you which group I have in mind:")}{" "}
                <a href={withContact(call, form.name, form.email)} target="_blank" rel="noopener noreferrer" style={{ color: "#d97706" }}>{tr("Book the 15-minute call")}</a>
              </p>
            </div>
          ) : formState === "sent" ? (
            /* Only a proposed time: nothing to hold yet, so it is the call alone. */
            <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 8, padding: "28px 24px", textAlign: "center" }}>
              <p style={{ ...ROBOTO, fontSize: 18, fontWeight: 700, color: "#f6f1ea", marginBottom: 6 }}>{tr("You're on the list. One step left.")}</p>
              <p style={{ ...INTER, fontSize: 15, color: "rgba(246,241,234,0.7)", marginBottom: 20 }}>{tr("Pick a time for the 15-minute call: we say hello, check the fit and I tell you which group I have in mind.")}</p>
              <a href={withContact(call, form.name, form.email)} target="_blank" rel="noopener noreferrer" style={CTA_PRIMARY}>{tr("Book the 15-minute call")} →</a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "24px" }}>
              <div className="pg-form-row">
                <div>
                  <label htmlFor="pg-name" style={LABEL}>{tr("Name")}</label>
                  <input
                    id="pg-name"
                    className="pg-input"
                    style={INPUT}
                    required
                    autoComplete="name"
                    placeholder={tr("Jane Smith")}
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  />
                </div>
                <div>
                  <label htmlFor="pg-email" style={LABEL}>{tr("Email")}</label>
                  <input
                    id="pg-email"
                    className="pg-input"
                    type="email"
                    style={INPUT}
                    required
                    autoComplete="email"
                    placeholder={tr("jane@example.com")}
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  />
                </div>
              </div>
              <div style={{ marginBottom: 14 }}>
                <label htmlFor="pg-background" style={LABEL}>{tr("Your last role and sector")}</label>
                <input
                  id="pg-background"
                  className="pg-input"
                  style={INPUT}
                  required
                  placeholder={tr("e.g. Managing director, logistics")}
                  value={form.background}
                  onChange={e => setForm(f => ({ ...f, background: e.target.value }))}
                />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label htmlFor="pg-goal" style={LABEL}>{tr("What you want to use AI for")}</label>
                <textarea
                  id="pg-goal"
                  className="pg-input"
                  style={{ ...INPUT, resize: "vertical", minHeight: 90 }}
                  required
                  placeholder={tr("e.g. I sit on two boards and want to get through the papers faster. I'm also writing a book...")}
                  value={form.goal}
                  onChange={e => setForm(f => ({ ...f, goal: e.target.value }))}
                />
              </div>
              <div style={{ marginBottom: 14 }}>
                <span style={LABEL}>
                  {tr("Times that suit you")}{" "}
                  <span style={OPTIONAL}>{tr("(choose all that work)")}</span>
                </span>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {PEER_GROUPS.slots.map((slot) =>
                    slotButton(
                      slot.id,
                      `${slotDay(slot, locale)}, ${slotHours(slot, locale)}`,
                      form.slots.includes(slot.id),
                      () => toggleSlot(slot.id),
                    ),
                  )}
                  {slotButton("propose", tr("Propose a different time"), proposing, () => {
                    setSlotMissing(false);
                    setProposing(p => !p);
                  })}
                </div>
                {proposing && (
                  <input
                    ref={proposedRef}
                    className="pg-input"
                    style={{ ...INPUT, marginTop: 10 }}
                    aria-label={tr("The day and time that would suit you")}
                    placeholder={tr("e.g. Friday mornings, or any weekday after 17:00")}
                    value={form.proposed}
                    onChange={e => { setSlotMissing(false); setForm(f => ({ ...f, proposed: e.target.value })); }}
                  />
                )}
                {slotMissing && (
                  <p role="alert" style={{ ...INTER, fontSize: 13, color: "#f87171", marginTop: 8 }}>{tr("Choose a time or propose one, so I know where to put you.")}</p>
                )}
              </div>
              <div style={{ marginBottom: 14 }}>
                <label htmlFor="pg-with" style={LABEL}>
                  {tr("Anyone you'd like to learn with?")}{" "}
                  <span style={OPTIONAL}>{tr("(optional)")}</span>
                </label>
                <input
                  id="pg-with"
                  className="pg-input"
                  style={INPUT}
                  placeholder={tr("Their names, and I'll get in touch with them")}
                  value={form.withWhom}
                  onChange={e => setForm(f => ({ ...f, withWhom: e.target.value }))}
                />
              </div>
              <div style={{ marginBottom: 22 }}>
                <label htmlFor="pg-trainer" style={LABEL}>
                  {tr("Trainer code")}{" "}
                  <span style={OPTIONAL}>{tr("(optional)")}</span>
                </label>
                {/* Prefilled from ?trainer= on any page of this visit. Left
                    editable so somebody handed a code on paper can type it. */}
                <input
                  id="pg-trainer"
                  className="pg-input"
                  style={INPUT}
                  placeholder={tr("If a trainer sent you here")}
                  value={form.trainerCode}
                  onChange={e => setForm(f => ({ ...f, trainerCode: e.target.value }))}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                <p style={{ ...INTER, fontSize: 12, color: "rgba(246,241,234,0.4)", maxWidth: 360 }}>{tr("No marketing. Your details are used only to put your group together and reply to you.")}</p>
                <button
                  type="submit"
                  disabled={formState === "sending"}
                  style={{ ...ROBOTO, fontSize: 14, fontWeight: 700, background: formState === "sending" ? "rgba(255,255,255,0.1)" : "#d97706", color: "#fff", border: "none", borderRadius: 6, padding: "12px 24px", cursor: formState === "sending" ? "default" : "pointer", whiteSpace: "nowrap" }}
                >
                  {formState === "sending" ? tr("Sending...") : tr("Next: hold your seat →")}
                </button>
              </div>
              {formState === "error" && (
                <p role="alert" style={{ ...INTER, fontSize: 13, color: "#f87171", marginTop: 10 }}>{tr("Something went wrong - please try again or email daniel@tutto.one")}</p>
              )}
            </form>
          )}

          <p style={{ ...INTER, fontSize: 13, color: "rgba(246,241,234,0.45)", marginTop: 20 }}>{tr("Or email directly: daniel@tutto.one")}</p>
        </div>

        {/* Doc footer */}
        <div className="pg-footer-bar">
          <span style={{ ...CAPS, fontSize: 9, color: "#1a1a1a" }}>{tr("Praxis Peer Groups · tutto.one/peer-groups")}</span>
          <span style={{ ...CAPS, fontSize: 9, color: "#1a1a1a" }}>{fill("Groups of {size} · {sessions} sessions", terms)}</span>
        </div>

      </div>
    </div>
  );
}
