import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";

export default function About() {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-serif font-bold mb-8">About Me</h1>
        
        <div className="prose prose-lg prose-neutral max-w-none font-serif leading-relaxed text-muted-foreground">
          <p className="mb-6">
            Hello, we are HumanITy, an implementation consultancy focused on making businesses machine-readable and automation useful.
          </p>
          <p className="mb-6">
            For the past decade, we've worked at the intersection of operations and technology. We've seen firsthand that the biggest bottleneck to AI adoption isn't technology—it's <strong>information architecture</strong>.
          </p>
          <p className="mb-6">
            Most companies treat their internal knowledge like oral history. It lives in Slack threads, quick calls, and messy Docs. Humans can navigate this ambiguity. AI cannot.
          </p>
          <p className="mb-10">
            Our work is to help you structure that chaos, turning your implicit organizational knowledge into explicit, machine-consumable assets.
          </p>

          <h3 className="text-2xl font-bold text-foreground mb-4 mt-12">Why "Chat-First"?</h3>
          <p className="mb-6">
            We built this website as a chat interface because we believe conversational UI is the future of software. It's direct, personal, and efficient.
          </p>
        </div>

        <div className="mt-12 p-8 bg-secondary/30 rounded-2xl border border-border">
            <h3 className="text-xl font-bold mb-2">Ready to talk?</h3>
            <p className="text-muted-foreground mb-6">Let's discuss your AI readiness strategy.</p>
            <Button className="rounded-full px-8">Book a Consultation</Button>
        </div>
      </div>
    </Layout>
  );
}
