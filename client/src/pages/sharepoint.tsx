import { Layout } from "@/components/layout/Layout";
import { usePageTr } from "@/lib/page-fr";
import { SHAREPOINT_FR } from "@/lib/fr/sharepoint";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { usePreferences } from "@/lib/preferences";
import { price } from "@/lib/pricing";
import {
  Github,
  CheckCircle,
  Copy,
  ArrowRight,
  Loader2,
  ExternalLink,
  Building2,
  Scale,
  Search,
  Sparkles,
  RefreshCw,
  Construction,
  Zap,
  Repeat,
} from "lucide-react";

const AUDIT_PROMPT = `You are an expert SharePoint consultant helping organisations prepare for AI integration. Audit my SharePoint Online environment and produce a structured report.

Please cover these five areas:

1. Site Architecture - map the current site structure, hub sites, and navigation patterns. Flag any structural issues that will complicate AI indexing or search.

2. Content & Metadata - inventory document libraries, lists, and content types. Identify missing or inconsistent metadata schemas that reduce machine-readability.

3. Permissions & Access - assess the permissions model, broken inheritance points, and access groups. Note any configurations that could expose sensitive content to an AI tool unintentionally.

4. Data Quality - flag stale content (not modified in 12+ months), duplicate files, orphaned sites, and naming inconsistencies that will degrade AI retrieval quality.

5. AI Readiness Score - rate the environment from 1–10 and list the top 5 prioritised actions to make it machine-readable, with estimated effort (Low / Medium / High) for each.

My SharePoint environment:
[Describe your setup here - number of sites, approximate document count, key teams that use it, and any existing metadata or content type work]`;

export default function Sharepoint() {
  const tr = usePageTr(SHAREPOINT_FR);
  const [email, setEmail] = useState("");
  const [copied, setCopied] = useState(false);
  const [, navigate] = useLocation();
  const { locale, currency } = usePreferences();
  const p = (k: Parameters<typeof price>[0]) => price(k, currency, locale);
  const FROM = locale === "fr" ? "À partir de" : "From";
  const PER_MONTH = locale === "fr" ? "/mois" : "/month";

  useEffect(() => {
    const prevTitle = document.title;
    document.title = "SharePoint Bridge for Claude - Free AI-Powered SharePoint Management | Tutto.one";

    const SEO_DESCRIPTION =
      "Connect Claude to your SharePoint with our free, open-source MCP server. Audit, restructure, and build AI-powered business systems. 15 tools, MIT licensed.";

    let metaDesc = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const hadMeta = !!metaDesc;
    const prevDesc = metaDesc?.getAttribute("content") ?? "";

    if (metaDesc) {
      metaDesc.setAttribute("content", SEO_DESCRIPTION);
    } else {
      metaDesc = document.createElement("meta");
      metaDesc.name = "description";
      metaDesc.content = SEO_DESCRIPTION;
      document.head.appendChild(metaDesc);
    }

    return () => {
      document.title = prevTitle;
      const el = document.querySelector<HTMLMetaElement>('meta[name="description"]');
      if (el) {
        if (hadMeta) {
          el.setAttribute("content", prevDesc);
        } else {
          el.parentNode?.removeChild(el);
        }
      }
    };
  }, []);

  const submitLead = useMutation({
    mutationFn: async (data: { email: string; source: string }) => {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to submit");
      }
      return response.json();
    },
    onSuccess: () => {
      navigate("/contact");
    },
  });

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitLead.mutate({ email, source: "sharepoint-landing" });
  };

  const handleCopyPrompt = async () => {
    await navigator.clipboard.writeText(AUDIT_PROMPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scrollToHowItWorks = () => {
    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-6">

        {/* 1. Hero */}
        <section className="py-20 text-center">
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-6">{tr("Open Source · MCP Server · Free Forever")}</p>
          <h1 className="text-4xl md:text-6xl font-serif font-bold leading-tight mb-6 max-w-4xl mx-auto">{tr("Give AI direct access to your SharePoint")}</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-4 leading-relaxed">{tr("The SharePoint Bridge connects Claude directly to your SharePoint Online environment - search documents, read pages, and surface institutional knowledge without copy-pasting or manual lookups. Just ask.")}</p>
          <p className="text-sm text-muted-foreground/70 mb-10">{tr("Free and open source. Used by legal, finance, and operations teams.")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={scrollToHowItWorks}
              className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors"
              data-testid="button-get-started"
            >{tr("Get Started Free")}</button>
            <a
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 border border-border rounded-full font-medium text-foreground hover:bg-muted/50 transition-colors"
              data-testid="link-book-walkthrough-hero"
            >{tr("Book a Walkthrough")}</a>
            <a
              href="https://github.com/TuttoOne/sp-mcp"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 border border-border rounded-full font-medium text-foreground hover:bg-muted/50 transition-colors"
              data-testid="link-github-hero"
            >
              <Github className="w-4 h-4" />{tr("View on GitHub")}</a>
          </div>
        </section>

        {/* 2. Interactive Demo */}
        <section className="mb-20">
          <iframe
            src="/sp-demo.html"
            className="w-full rounded-2xl border border-border/60"
            style={{ height: "540px", display: "block" }}
            title="SharePoint MCP Bridge - Interactive Demo"
            data-testid="iframe-sp-demo"
          />
        </section>

        {/* 3. What It Does */}
        <section className="mb-20">
          <h2 className="text-3xl font-serif font-bold mb-4 text-center">{tr("What It Does")}</h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12 leading-relaxed">{tr("Three capabilities that transform how your organisation interacts with SharePoint knowledge.")}</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Search,
                title: "Audit",
                description:
                  "Claude analyses your SharePoint structure, surfaces stale content, broken permissions, and metadata gaps - producing a prioritised AI-readiness report in minutes.",
              },
              {
                icon: RefreshCw,
                title: "Restructure",
                description:
                  "Use Claude's findings to rationalise libraries, align content types, and fix site architecture so your SharePoint becomes truly machine-readable.",
              },
              {
                icon: Construction,
                title: "Build",
                description:
                  "Once your SharePoint is clean and structured, the Bridge lets Claude query it in real time - powering custom AI agents and knowledge workflows for your team.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-card border border-border/60 rounded-2xl p-6 shadow-sm"
                data-testid={`card-feature-${item.title.toLowerCase()}`}
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                  <item.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{tr(item.title)}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{tr(item.description)}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 4. How It Works */}
        <section id="how-it-works" className="mb-20 scroll-mt-20">
          <h2 className="text-3xl font-serif font-bold mb-4 text-center">{tr("How It Works")}</h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12 leading-relaxed">{tr("Set up in under 15 minutes. No infrastructure, no middleware, no data exports required.")}</p>
          <div className="space-y-6">
            {[
              {
                step: "01",
                title: "Register & Configure",
                description:
                  "Create an Azure AD application with Sites.Read.All permissions, clone the repo, and add your tenant ID, client ID, and client secret to a .env file. Full instructions in the README.",
              },
              {
                step: "02",
                title: "Connect to Claude",
                description:
                  "Add one entry to your Claude Desktop MCP config pointing at the server. Restart Claude - your SharePoint is now available as a live tool in every conversation.",
              },
              {
                step: "03",
                title: "Ask and Act",
                description:
                  "Ask Claude to find a document, summarise a page, or run the audit prompt below. The Bridge queries SharePoint in real time and returns the answer in seconds.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="flex gap-6 items-start"
                data-testid={`div-step-${item.step}`}
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-mono text-sm font-bold">
                  {item.step}
                </div>
                <div className="flex-1 bg-card border border-border/60 rounded-xl p-5 shadow-sm">
                  <h3 className="font-semibold mb-1">{tr(item.title)}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{tr(item.description)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <a
              href="https://github.com/TuttoOne/sp-mcp"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors"
              data-testid="link-github-how-it-works"
            >
              <Github className="w-4 h-4" />{tr("View on GitHub")}<ExternalLink className="w-3 h-3 opacity-70" />
            </a>
          </div>
        </section>

        {/* 5. Free Audit */}
        <section className="mb-20">
          <div className="bg-card border border-border/60 rounded-2xl p-8 md:p-12 shadow-sm">
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-3">{tr("Free tool")}</p>
            <h2 className="text-3xl font-serif font-bold mb-4">{tr("Run a free SharePoint audit with Claude")}</h2>
            <p className="text-muted-foreground leading-relaxed mb-8 max-w-2xl">{tr("Not sure if your SharePoint is AI-ready? Paste this prompt into Claude to get an instant structural audit - no MCP setup required. Claude will work through five key areas and give you a prioritised action plan with an AI-readiness score.")}</p>

            <div className="relative rounded-xl overflow-hidden border border-zinc-700 mb-8">
              <div className="flex items-center justify-between px-4 py-2 bg-zinc-800 border-b border-zinc-700">
                <span className="text-xs font-mono text-zinc-400">{tr("sharepoint-audit-prompt.txt")}</span>
                <button
                  onClick={handleCopyPrompt}
                  className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-zinc-700"
                  data-testid="button-copy-prompt"
                >
                  {copied ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                      <span className="text-green-400">{tr("Copied!")}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />{tr("Copy prompt")}</>
                  )}
                </button>
              </div>
              <pre className="bg-zinc-900 text-zinc-200 text-sm p-6 overflow-x-auto whitespace-pre-wrap leading-relaxed font-mono">
                {AUDIT_PROMPT}
              </pre>
            </div>

            <div className="border-t border-border/60 pt-8">
              <h3 className="font-semibold mb-1">{tr("Want us to run the audit for you?")}</h3>
              <p className="text-sm text-muted-foreground mb-4">{tr("Leave your email and we'll be in touch about a free, personalised SharePoint audit for your environment.")}</p>
              <form
                onSubmit={handleEmailSubmit}
                className="flex flex-col sm:flex-row gap-3 max-w-md"
                data-testid="form-email-capture"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={tr("you@company.com")}
                  className="flex-1 px-3 py-2 border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                  data-testid="input-email-capture"
                />
                <Button
                  type="submit"
                  disabled={submitLead.isPending}
                  className="rounded-full whitespace-nowrap"
                  data-testid="button-email-submit"
                >
                  {submitLead.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />{tr("Sending...")}</>
                  ) : (
                    "Get My Free Audit"
                  )}
                </Button>
              </form>
              {submitLead.isError && (
                <p className="text-sm text-destructive mt-2" data-testid="text-email-error">{tr("Something went wrong. Please try again.")}</p>
              )}
            </div>
          </div>
        </section>

        {/* 6. Industry Templates */}
        <section className="mb-20">
          <h2 className="text-3xl font-serif font-bold mb-4 text-center">{tr("Industry Templates")}</h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12 leading-relaxed">{tr("Pre-built query templates and audit prompts tailored to SharePoint patterns common in your sector.")}</p>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                icon: Search,
                industry: "Private Investigation",
                status: "LIVE",
                examples: ["Case file search", "Evidence document lookup", "Chain of custody"],
              },
              {
                icon: Scale,
                industry: "Legal Practice",
                status: "Coming Soon",
                examples: ["Contract clause lookup", "Matter file search", "Policy retrieval"],
              },
              {
                icon: Building2,
                industry: "Property Management",
                status: "Coming Soon",
                examples: ["Lease document search", "Maintenance records", "Compliance docs"],
              },
              {
                icon: Sparkles,
                industry: "Professional Services",
                status: "Coming Soon",
                examples: ["Client file retrieval", "Project knowledge base", "Invoice history"],
              },
            ].map((item) => (
              <div
                key={item.industry}
                className="bg-card border border-border/60 rounded-xl p-5 shadow-sm"
                data-testid={`card-industry-${item.industry.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <item.icon className="w-4 h-4" />
                  </div>
                  <span
                    className={`text-xs font-mono px-2 py-0.5 rounded-full ${
                      item.status === "LIVE"
                        ? "bg-green-100 text-green-700"
                        : "bg-muted text-muted-foreground"
                    }`}
                    data-testid={`badge-status-${item.industry.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    {item.status}
                  </span>
                </div>
                <h3 className="font-semibold mb-2">{item.industry}</h3>
                <ul className="space-y-1">
                  {item.examples.map((ex) => (
                    <li key={ex} className="text-xs text-muted-foreground flex items-start gap-1.5">
                      <ArrowRight className="w-3 h-3 mt-0.5 text-primary flex-shrink-0" />
                      {ex}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* 7. Custom Solutions */}
        <section className="mb-20">
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 md:p-12">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-xs font-mono text-primary uppercase tracking-widest">{tr("Tutto Services")}</span>
            </div>
            <h2 className="text-3xl font-serif font-bold mb-4">{tr("Need a custom SharePoint integration?")}</h2>
            <p className="text-muted-foreground leading-relaxed mb-8 max-w-2xl">{tr("The open-source bridge handles the common case. For teams that need write-back capabilities, multi-tenant support, on-premises SharePoint, or a fully managed AI workflow built on their document estate - we build it.")}</p>
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {[
                {
                  icon: Search,
                  title: "Data Audit & Knowledge Mapping",
                  price: `${FROM} ${p("spAuditFrom")}`,
                  description:
                    "Understand what you have before you build. We map your SharePoint structure, metadata gaps, and AI-readiness - and hand you a prioritised action plan.",
                },
                {
                  icon: Construction,
                  title: "Custom MCP Bridge Build",
                  price: `${FROM} ${p("spBuildFrom")}`,
                  description:
                    "A bespoke MCP server tailored to your SharePoint environment - custom tools, schemas, permissions model, and end-to-end testing.",
                },
                {
                  icon: Zap,
                  title: "AI Agent Architecture",
                  price: `${FROM} ${p("spBuildFrom")}`,
                  description:
                    "We design and build the AI agents that sit on top of your SharePoint Bridge - automating workflows, surfacing knowledge, and acting on your behalf.",
                },
                {
                  icon: Repeat,
                  title: "Ongoing Support & Training",
                  price: `${FROM} ${p("spRetainerMonthly")}${PER_MONTH}`,
                  description:
                    "Monthly retainer covering template updates, model upgrades, usage monitoring, and team training as your SharePoint and AI stack evolve.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="bg-card border border-border/60 rounded-xl p-5 shadow-sm"
                  data-testid={`card-service-${item.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <item.icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-mono text-primary font-semibold">{item.price}</span>
                  </div>
                  <h3 className="font-semibold mb-1 text-sm">{tr(item.title)}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{tr(item.description)}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mb-6">{tr("First bridge setup includes a free consultation to scope your integration needs.")}</p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors"
              data-testid="link-book-discovery"
            >{tr("Book a Discovery Call")}</a>
          </div>
        </section>

        {/* 8. Footer */}
        <section className="mb-20 text-center border-t border-border/40 pt-16">
          <h2 className="text-3xl font-serif font-bold mb-4">{tr("Ready to connect Claude to your SharePoint?")}</h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed">{tr("The bridge is free, open source, and takes 15 minutes to set up. If you'd rather have us walk you through it, book a call.")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <a
              href="https://github.com/TuttoOne/sp-mcp"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors"
              data-testid="link-github-footer"
            >
              <Github className="w-4 h-4" />{tr("View on GitHub")}</a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3 border border-border rounded-full font-medium text-foreground hover:bg-muted/50 transition-colors"
              data-testid="link-book-walkthrough-footer"
            >{tr("Book a Walkthrough")}</a>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground mb-6">
            <a
              href="https://github.com/TuttoOne/sp-mcp"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
              data-testid="link-footer-github"
            >
              GitHub
            </a>
            <a
              href="/contact"
              className="hover:text-foreground transition-colors"
              data-testid="link-footer-contact"
            >{tr("Contact")}</a>
            <a
              href="/"
              className="hover:text-foreground transition-colors"
              data-testid="link-footer-home"
            >{tr("tutto.one")}</a>
          </div>
          <p className="text-xs text-muted-foreground/60">
            © {new Date().getFullYear()} Tutto. Released under the{" "}
            <a
              href="https://github.com/TuttoOne/sp-mcp/blob/main/LICENSE"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors underline"
              data-testid="link-footer-license"
            >{tr("MIT License")}</a>
            {" "}· Built by{" "}
            <a
              href="/"
              className="hover:text-foreground transition-colors underline"
              data-testid="link-footer-tutto"
            >
              Tutto
            </a>
            {" "}·{" "}
            <a
              href="mailto:daniel@tutto.one"
              className="hover:text-foreground transition-colors underline"
              data-testid="link-footer-email"
            >{tr("daniel@tutto.one")}</a>
          </p>
        </section>

      </div>
    </Layout>
  );
}
