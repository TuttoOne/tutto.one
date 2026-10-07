/**
 * /data-policy: how we handle the data people put into /learn and the Praxis tools.
 *
 * Linked from the footer, the /learn sign-in and agreement screens, and the
 * consent box in every tool (client/public/praxis-data.js). The numbers come from
 * shared/data-policy.ts so the page and the code that enforces it can't disagree.
 * When the meaning changes, bump POLICY_VERSION there: everyone is asked to agree again.
 */
import { useEffect } from "react";
import { Header } from "@/components/layout/Layout";
import { SITE_TITLE } from "@/lib/i18n";
import { POLICY_VERSION, RETENTION_MONTHS, BROWSER_DAYS, BACKUP_DAYS, DATABASE_REGION } from "@shared/data-policy";

const ROBOTO: React.CSSProperties = { fontFamily: "'Roboto', -apple-system, sans-serif" };
const INTER: React.CSSProperties = { fontFamily: "'Inter', -apple-system, sans-serif" };
const CAPS: React.CSSProperties = { ...INTER, textTransform: "uppercase", letterSpacing: "0.12em" };
const BG = "#f6f1ea";
const INK = "#1a1a1a";
const AMBER = "#d97706";
const MUTED = "#6b645a";
const RULE = "#d8d0c5";

const H2: React.CSSProperties = { ...ROBOTO, fontSize: 22, fontWeight: 700, margin: "40px 0 12px" };
const P: React.CSSProperties = { margin: "0 0 14px", fontSize: 16, lineHeight: 1.65 };
const UL: React.CSSProperties = { margin: "0 0 14px", paddingLeft: 22, fontSize: 16, lineHeight: 1.65, listStyle: "disc", display: "grid", gap: 6 };
const A: React.CSSProperties = { color: AMBER };

const version = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(new Date(`${POLICY_VERSION}T12:00:00`));

export default function DataPolicy() {
  useEffect(() => {
    document.title = "How we handle your data | Tutto";
    return () => { document.title = SITE_TITLE; };
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: BG, color: INK, ...INTER }}>
      <Header />
      <main style={{ maxWidth: 760, margin: "0 auto", padding: "112px 16px 96px" }}>
        <span style={{ ...CAPS, fontSize: 11, color: AMBER }}>Data policy · version of {version}</span>
        <h1 style={{ ...ROBOTO, fontSize: 36, fontWeight: 700, lineHeight: 1.15, margin: "8px 0 16px" }}>How we handle your data</h1>
        <p style={{ ...P, fontSize: 18, color: MUTED }}>
          We teach with your real work, so the tools see real work. This page says what we keep, where we keep it, who sees it, how long we hold it and how to have it deleted. It covers the student area at tutto.one/learn, the Praxis tools (the use case card, the AI charter, the agent scorecard and the hand-over check) and the enquiries you send us.
        </p>

        <h2 style={H2}>What stays with you</h2>
        <p style={P}>
          The tools keep your work in your own browser. Nothing you type in them reaches us unless you press "Share with Tutto".
        </p>
        <ul style={UL}>
          <li>Your browser wipes the work after {BROWSER_DAYS} days if you don't open it. It doesn't follow you to another computer or browser, and clearing your browser data wipes it too.</li>
          <li>To keep it, open "Your work" and save it to a file (a CSV you can open in Excel). You can open that file in the tool later on any computer and carry on where you left off.</li>
          <li>Documents the tools make, like your AI charter or your printed card, are yours. We don't keep them. Save them where you keep your other work.</li>
          <li>On a shared computer, save your file and then choose "Clear from this browser" before you leave.</li>
        </ul>

        <h2 style={H2}>What we keep, and why</h2>
        <ul style={UL}>
          <li><strong>Your student account</strong> on /learn: your name, email, role, LinkedIn, background, the AI accounts you have, the task you'd like help with, your computer and, if you give one, someone else we can contact. We keep it so we can prepare for you and run your sessions. Please ask that other person first: we only contact them if a session moves and we can't reach you.</li>
          <li><strong>Our notes about you</strong>, written by your trainer to prepare your sessions. You can ask to see them.</li>
          <li><strong>Your progress</strong>: which sessions you've ticked off, and when you signed in.</li>
          <li><strong>Work you share with us</strong> from the tools: one copy each time you press "Share with Tutto", with your name, email and organisation, so we can read it before we meet.</li>
          <li><strong>Enquiries and mailing list sign-ups</strong> from the contact forms, so we can reply.</li>
          <li><strong>When you agreed to this policy</strong>, and which version, so we can show it later.</li>
        </ul>
        <p style={P}>We don't sell any of it, use it for advertising or put it into AI tools to train them.</p>

        <h2 style={H2}>How long we keep it</h2>
        <ul style={UL}>
          <li>Your student account, progress, our notes and anything you shared: for the length of your programme and {RETENTION_MONTHS} months after your last session. That covers the review period after the course and any questions about it. Then it's deleted automatically.</li>
          <li>If your organisation's contract sets a different period, the contract wins and we set that date on your programme.</li>
          <li>Work shared by someone who isn't on a programme: {RETENTION_MONTHS} months after it was sent.</li>
          <li>Sign-in links: a day after they're used or expire.</li>
          <li>Enquiries and mailing list sign-ups: until you ask us to delete them or unsubscribe.</li>
          <li>Deleted data can stay in our database host's backups for up to {BACKUP_DAYS} days, and then it's gone too.</li>
        </ul>

        <h2 style={H2}>Where it's kept and who sees it</h2>
        <p style={P}>
          Only Daniel and the trainers on your programme see your data. These services hold it for us, under their own data protection terms:
        </p>
        <ul style={UL}>
          <li>Replit runs the website, and its database partner Neon holds the data{DATABASE_REGION ? `, in ${DATABASE_REGION}` : ". We're confirming which region it's held in and will add it here"}.</li>
          <li>Resend sends the sign-in and welcome emails.</li>
          <li>Google Workspace holds our email, calendar invites, meeting notes and Google Meet calls.</li>
        </ul>
        <p style={P}>
          Some of these are in the United States. Where data leaves the UK or the European Union, it's covered by the standard contract clauses those services sign up to.
        </p>

        <h2 style={H2}>For organisations</h2>
        <ul style={UL}>
          <li>Until your organisation's AI rules say what may go into AI tools, use placeholders for client names, personal details and real figures. Writing those rules is session 1.</li>
          <li>What your team shares with us about your business is yours. We use it only to run your programme, and we follow your instructions about it. Your contract with us sets this out.</li>
          <li>At the end of the programme you can ask us to delete everything from your team straight away, and we send you confirmation.</li>
        </ul>

        <h2 style={H2}>During your programme, and at the end</h2>
        <ul style={UL}>
          <li>After each session, save your work from each tool to a file.</li>
          <li>When you'd like feedback before a session, share a copy with us from "Your work".</li>
          <li>At the end, keep your files and the documents you made, and clear the tools from your browser if the computer is shared.</li>
          <li>If you leave your organisation or switch computers, open your saved files on the new one. Anything left only in the old browser is lost.</li>
        </ul>

        <h2 style={H2}>Your rights</h2>
        <p style={P}>
          You can ask for a copy of everything we hold about you, ask us to correct it or ask us to delete it. Email <a href="mailto:daniel@tutto.one" style={A}>daniel@tutto.one</a> from the address we know you by. We reply within a month, usually much sooner.
        </p>
        <p style={P}>
          When we delete your data, we email you a confirmation with a reference number, the date and what kinds of record went. We keep a note that the deletion happened, with that reference, but not your details. We also clear what we hold about you in our email, calendar and meeting notes.
        </p>
        <p style={P}>
          If you're unhappy with how we've handled your data, tell us first so we can put it right. You can also complain to the data protection regulator where you live: the ICO in the UK, the CNIL in France or the Garante in Italy.
        </p>

        <h2 style={H2}>If something goes wrong</h2>
        <p style={P}>
          If your data is lost, stolen or seen by someone who shouldn't see it, we tell you as soon as we know and we tell the regulator within 72 hours where the law requires it.
        </p>

        <h2 style={H2}>Changes to this policy</h2>
        <p style={P}>
          When we change what this policy means, we change the version date at the top and ask you to agree again the next time you sign in or open a tool.
        </p>

        <p style={{ ...P, marginTop: 40, paddingTop: 24, borderTop: `1px solid ${RULE}`, fontSize: 14, color: MUTED }}>
          Tutto, Daniel Forsthofer · <a href="mailto:daniel@tutto.one" style={A}>daniel@tutto.one</a>
        </p>
      </main>
    </div>
  );
}
