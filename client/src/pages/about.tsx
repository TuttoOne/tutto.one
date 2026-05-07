import { Layout } from "@/components/layout/Layout";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

export default function About() {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-serif font-bold mb-4">About Us</h1>
        <p className="text-xl text-muted-foreground mb-16 max-w-xl">
          A small team with laser focus on your problems.
        </p>

        <div className="text-[17px] space-y-6 text-muted-foreground leading-relaxed">
          <p>
            We're Tutto — a tight group of AI consultants and builders who work at the intersection of operations, data, and AI. We don't do slide decks and frameworks. We get into the detail of your actual problems, build the thing that solves them, and make sure it works in production.
          </p>
          <p>
            Our work spans the full range of what AI readiness actually requires. Sometimes that means building an{" "}
            <strong className="text-foreground font-semibold">MCP bridge</strong>{" "}
            that gives your team's AI assistant direct access to SharePoint or Salesforce — so they're asking instead of copy-pasting. Sometimes it means deploying a{" "}
            <strong className="text-foreground font-semibold">self-contained document intelligence platform</strong>{" "}
            on-premise so a legal team can run AI-powered review across 150,000 privileged documents without a single byte leaving the building. Sometimes it means helping a business understand why their AI pilot worked brilliantly in isolation and fails to scale — and fixing the information architecture underneath it.
          </p>
          <p>
            The common thread: most AI adoption problems aren't AI problems. They're{" "}
            <strong className="text-foreground font-semibold">information architecture problems</strong>. Your knowledge is buried in Slack threads, PDFs, institutional memory, and processes nobody has documented. Humans navigate that ambiguity. AI cannot. Our job is to structure the chaos — turning implicit organisational knowledge into explicit, machine-consumable assets.
          </p>

          <h2 className="text-2xl font-serif font-bold text-foreground pt-6">What we believe</h2>

          <p>
            AI is already being used most intensively in exactly the roles that drive the most value — software engineers, analysts, lawyers, researchers, writers. The gap isn't in the tools; it's between what AI can theoretically do for an organisation and what they're actually doing with it today. That gap is where we work.
          </p>
          <p>
            We believe the businesses that come out ahead won't be the ones who deployed AI first. They'll be the ones who understood their own operations clearly enough to know where AI would make the biggest difference — and had the information infrastructure in place to support it. Building that infrastructure is unglamorous work. It's also the most valuable work we do.
          </p>

          <h2 className="text-2xl font-serif font-bold text-foreground pt-6">How we work</h2>

          <p>
            We're small by design. That means every client gets direct access to the people doing the work — not a junior team briefed secondhand. We scope every engagement in a single call, move fast, and ship things that actually run in production. No handoffs to implementation partners. No shelfware.
          </p>
          <p>
            Most engagements start with a 30-minute conversation. We'll tell you honestly whether we think we can help, and what that looks like.
          </p>
        </div>

        <div className="mt-16 p-8 bg-secondary/30 rounded-2xl border border-border">
          <h3 className="text-xl font-serif font-bold mb-2">Ready to talk?</h3>
          <p className="text-muted-foreground mb-6">
            30 minutes. We'll tell you honestly what we think.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="https://cal.com/tuttoone/15min"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors"
            >
              Book a Call
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 border border-border rounded-full font-medium text-foreground hover:bg-muted/50 transition-colors"
            >
              Send a message <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
