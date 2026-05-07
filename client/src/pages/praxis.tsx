import { useEffect } from "react";
import { Link } from "wouter";
import { ArrowRight, Folder, FileText, Zap, Lock, RefreshCw, Terminal } from "lucide-react";

export default function Praxis() {
  useEffect(() => {
    document.title = "Praxis — The folder is the app";
    return () => { document.title = "Tutto | AI Consulting"; };
  }, []);

  return (
    <div style={{ background: "#f6f1ea", minHeight: "100vh", fontFamily: "'Inter', sans-serif", color: "#1a1a1a" }}>

      {/* Nav */}
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 40px", borderBottom: "1px solid #e0d8cd" }}>
        <Link href="/" style={{ fontFamily: "'Source Serif 4', serif", fontWeight: 600, fontSize: 18, color: "#1a1a1a", textDecoration: "none" }}>
          Tutto
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <span style={{ fontSize: 13, color: "#7a7568" }}>Early access</span>
          <a
            href="mailto:daniel@tutto.one"
            style={{ background: "#1a1a1a", color: "#f6f1ea", fontSize: 13, fontWeight: 500, padding: "8px 18px", borderRadius: 20, textDecoration: "none" }}
          >
            Get access →
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ maxWidth: 760, margin: "0 auto", padding: "80px 40px 60px", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#fff", border: "1px solid #e0d8cd", borderRadius: 20, padding: "4px 14px", marginBottom: 32 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#d97706", display: "inline-block" }} />
          <span style={{ fontSize: 11, fontFamily: "monospace", letterSpacing: 1, textTransform: "uppercase", color: "#7a7568" }}>Private beta</span>
        </div>

        <h1 style={{ fontFamily: "'Source Serif 4', serif", fontSize: "clamp(48px, 8vw, 80px)", fontWeight: 700, lineHeight: 1.05, marginBottom: 24, letterSpacing: "-1px" }}>
          The folder<br />is the app.
        </h1>

        <p style={{ fontSize: 19, lineHeight: 1.65, color: "#3d3d3d", maxWidth: 520, margin: "0 auto 40px" }}>
          Praxis turns a plain folder on your machine into a living, structured workspace. Drop files in. Everything else is handled.
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <a
            href="mailto:daniel@tutto.one"
            style={{ background: "#1a1a1a", color: "#f6f1ea", fontSize: 14, fontWeight: 600, padding: "13px 28px", borderRadius: 24, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}
          >
            Request early access <ArrowRight size={15} />
          </a>
          <Link
            href="/contact"
            style={{ background: "transparent", color: "#1a1a1a", fontSize: 14, fontWeight: 500, padding: "13px 28px", borderRadius: 24, textDecoration: "none", border: "1px solid #c8bfb3", display: "inline-flex", alignItems: "center", gap: 8 }}
          >
            Talk to us
          </Link>
        </div>
      </section>

      {/* UI mockup */}
      <section style={{ maxWidth: 860, margin: "0 auto 80px", padding: "0 40px" }}>
        <div style={{ border: "2px solid #1a1a1a", borderRadius: 10, overflow: "hidden", boxShadow: "0 8px 40px rgba(0,0,0,0.12)" }}>
          {/* Window chrome */}
          <div style={{ background: "#1a1a1a", padding: "10px 16px", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ display: "flex", gap: 6 }}>
              <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#ff5f56", display: "block" }} />
              <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#ffbd2e", display: "block" }} />
              <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#27c93f", display: "block" }} />
            </div>
            <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
              <span style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 6, padding: "3px 16px", fontSize: 11, fontFamily: "monospace", color: "rgba(255,255,255,0.5)" }}>
                ~/praxis/whitfield-matter
              </span>
            </div>
          </div>
          {/* Sidebar + content */}
          <div style={{ display: "flex", background: "#faf8f5", minHeight: 320 }}>
            {/* Sidebar */}
            <div style={{ width: 200, borderRight: "1px solid #e0d8cd", padding: "16px 0", flexShrink: 0 }}>
              {[
                { icon: "📁", label: "whitfield-matter", active: true },
                { icon: "📁", label: "mitchell-2026", active: false },
                { icon: "📁", label: "compliance", active: false },
                { icon: "📁", label: "templates", active: false },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "7px 16px", fontSize: 12,
                    background: item.active ? "rgba(217,119,6,0.08)" : "transparent",
                    borderLeft: item.active ? "2px solid #d97706" : "2px solid transparent",
                    color: item.active ? "#1a1a1a" : "#7a7568",
                    fontWeight: item.active ? 500 : 400,
                  }}
                >
                  <span>{item.icon}</span>
                  <span style={{ fontFamily: "monospace", fontSize: 11 }}>{item.label}</span>
                </div>
              ))}
            </div>
            {/* File list */}
            <div style={{ flex: 1, padding: 20 }}>
              <div style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 12, color: "#7a7568", fontFamily: "monospace" }}>4 files · indexed · ready</span>
                <span style={{ marginLeft: "auto", fontSize: 10, background: "#d1fae5", color: "#065f46", padding: "2px 8px", borderRadius: 8, fontWeight: 500 }}>✓ AI-ready</span>
              </div>
              {[
                { name: "engagement-letter.pdf", meta: "Contract · 2 Jan 2026", tag: "signed" },
                { name: "WHIT-2026-001-notes.md", meta: "Notes · updated 3h ago", tag: "live" },
                { name: "source-of-funds.docx", meta: "Compliance · pending review", tag: "pending" },
                { name: "timeline.json", meta: "Auto-generated · 47 events", tag: "auto" },
              ].map((file) => (
                <div
                  key={file.name}
                  style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 12px", borderRadius: 7, marginBottom: 4, border: "1px solid #e8e2d8", background: "#fff" }}
                >
                  <FileText size={14} color="#7a7568" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 500, fontFamily: "monospace", color: "#1a1a1a" }}>{file.name}</div>
                    <div style={{ fontSize: 10, color: "#a8a092", marginTop: 1 }}>{file.meta}</div>
                  </div>
                  <span style={{
                    fontSize: 9, fontFamily: "monospace", padding: "2px 7px", borderRadius: 6,
                    background: file.tag === "signed" ? "#eff6ff" : file.tag === "live" ? "#f0fdf4" : file.tag === "auto" ? "#fefce8" : "#fff7ed",
                    color: file.tag === "signed" ? "#1d4ed8" : file.tag === "live" ? "#15803d" : file.tag === "auto" ? "#854d0e" : "#9a3412",
                    border: `1px solid ${file.tag === "signed" ? "#bfdbfe" : file.tag === "live" ? "#bbf7d0" : file.tag === "auto" ? "#fef08a" : "#fed7aa"}`,
                  }}>{file.tag}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Bottom bar */}
          <div style={{ background: "#1a1a1a", padding: "8px 16px", display: "flex", alignItems: "center", gap: 8 }}>
            <Terminal size={11} color="rgba(255,255,255,0.4)" />
            <span style={{ fontFamily: "monospace", fontSize: 11, color: "rgba(255,255,255,0.35)" }}>
              praxis &gt; <span style={{ color: "#d97706" }}>summarise whitfield-matter</span>
              <span style={{ display: "inline-block", width: 1.5, height: 11, background: "#d97706", verticalAlign: "middle", marginLeft: 2, animation: "blink 1s step-end infinite" }} />
            </span>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ maxWidth: 860, margin: "0 auto 80px", padding: "0 40px" }}>
        <h2 style={{ fontFamily: "'Source Serif 4', serif", fontSize: 32, fontWeight: 700, marginBottom: 8 }}>How it works</h2>
        <p style={{ color: "#7a7568", fontSize: 15, marginBottom: 40 }}>No database. No dashboard. Just a folder you already have.</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
          {[
            { step: "01", title: "Point Praxis at a folder", body: "Any folder on your machine. A matter, a project, a client. It watches." },
            { step: "02", title: "Drop files in as normal", body: "PDFs, Word docs, emails, notes, spreadsheets. You don't change your workflow." },
            { step: "03", title: "Ask it anything", body: "Summarise, search, compare, extract. The folder answers back." },
          ].map((item) => (
            <div key={item.step} style={{ background: "#fff", border: "1px solid #e0d8cd", borderRadius: 10, padding: 24 }}>
              <div style={{ fontFamily: "monospace", fontSize: 11, color: "#d97706", fontWeight: 600, marginBottom: 12 }}>{item.step}</div>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>{item.title}</h3>
              <p style={{ fontSize: 13, color: "#7a7568", lineHeight: 1.6 }}>{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ maxWidth: 860, margin: "0 auto 80px", padding: "0 40px" }}>
        <h2 style={{ fontFamily: "'Source Serif 4', serif", fontSize: 32, fontWeight: 700, marginBottom: 40 }}>Built for sensitive work</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
          {[
            { icon: <Lock size={18} />, title: "Fully local", body: "Nothing leaves your machine. No cloud sync. No accounts." },
            { icon: <Zap size={18} />, title: "Instant indexing", body: "Files are indexed the moment they land. No waiting." },
            { icon: <RefreshCw size={18} />, title: "Always in sync", body: "Rename a file. Edit a doc. Praxis keeps up automatically." },
            { icon: <Folder size={18} />, title: "Any folder", body: "Works with your existing structure. No migration needed." },
          ].map((item) => (
            <div key={item.title} style={{ padding: 20, border: "1px solid #e0d8cd", borderRadius: 10, background: "#fff" }}>
              <div style={{ color: "#d97706", marginBottom: 10 }}>{item.icon}</div>
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>{item.title}</h3>
              <p style={{ fontSize: 12, color: "#7a7568", lineHeight: 1.6 }}>{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Who it's for */}
      <section style={{ maxWidth: 860, margin: "0 auto 80px", padding: "0 40px" }}>
        <div style={{ background: "#1a1a1a", borderRadius: 12, padding: "48px 48px" }}>
          <h2 style={{ fontFamily: "'Source Serif 4', serif", fontSize: 32, fontWeight: 700, color: "#f6f1ea", marginBottom: 16 }}>
            Built for professionals who work with files
          </h2>
          <p style={{ fontSize: 15, color: "rgba(246,241,234,0.65)", lineHeight: 1.7, marginBottom: 32, maxWidth: 520 }}>
            Solicitors. Investigators. Consultants. Anyone whose work lives in folders and needs to think clearly about what's inside them.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {["Legal practice", "Private investigation", "M&A due diligence", "Consulting engagements", "Research & analysis"].map((tag) => (
              <span key={tag} style={{ fontSize: 12, padding: "5px 14px", borderRadius: 14, border: "1px solid rgba(246,241,234,0.2)", color: "rgba(246,241,234,0.6)" }}>{tag}</span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ maxWidth: 860, margin: "0 auto 80px", padding: "0 40px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "'Source Serif 4', serif", fontSize: 40, fontWeight: 700, marginBottom: 16 }}>Join the waitlist</h2>
        <p style={{ fontSize: 15, color: "#7a7568", marginBottom: 32, maxWidth: 400, margin: "0 auto 32px" }}>
          Praxis is in private beta. We're working with a small number of teams now.
        </p>
        <a
          href="mailto:daniel@tutto.one?subject=Praxis early access"
          style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#1a1a1a", color: "#f6f1ea", fontSize: 15, fontWeight: 600, padding: "14px 32px", borderRadius: 28, textDecoration: "none" }}
        >
          Request access <ArrowRight size={16} />
        </a>
        <p style={{ marginTop: 16, fontSize: 12, color: "#a8a092" }}>No commitment. We'll be in touch.</p>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #e0d8cd", padding: "24px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <Link href="/" style={{ fontFamily: "'Source Serif 4', serif", fontWeight: 600, fontSize: 15, color: "#1a1a1a", textDecoration: "none" }}>Tutto</Link>
        <span style={{ fontSize: 12, color: "#a8a092" }}>Praxis is a Tutto product · <a href="mailto:daniel@tutto.one" style={{ color: "#7a7568" }}>daniel@tutto.one</a></span>
      </footer>

      <style>{`@keyframes blink { 50% { opacity: 0; } }`}</style>
    </div>
  );
}
