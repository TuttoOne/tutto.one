import { Layout } from "@/components/layout/Layout";
import { Link, useParams } from "wouter";
import { ArrowLeft } from "lucide-react";
import { BLOG_POSTS } from "@/lib/chat-data";
import capabilityGapImg from "@assets/c1952c81bca02a7c8cc05ef7801e67ca60831c55-4096x4096_1773827088246.webp";

// ── Visual components ────────────────────────────────────────────────────────

function TaskBreakdownChart() {
  const bars = [
    { label: "Software & Coding", pct: 37, color: "bg-primary" },
    { label: "Writing & Editing", pct: 17, color: "bg-primary/75" },
    { label: "Data & Analysis", pct: 12, color: "bg-primary/60" },
    { label: "Research & Learning", pct: 11, color: "bg-primary/50" },
    { label: "Creative Work", pct: 8, color: "bg-primary/40" },
    { label: "Business & Finance", pct: 7, color: "bg-primary/35" },
    { label: "Other", pct: 8, color: "bg-muted-foreground/40" },
  ];

  return (
    <div className="my-8 rounded-2xl border border-border/60 bg-secondary/20 p-6 not-prose">
      <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-5">
        Share of Claude conversations by task category
      </p>
      <div className="space-y-3">
        {bars.map((b) => (
          <div key={b.label} className="flex items-center gap-3">
            <span className="w-40 shrink-0 text-sm text-muted-foreground text-right leading-tight">
              {b.label}
            </span>
            <div className="flex-1 h-6 bg-muted/40 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${b.color} transition-all`}
                style={{ width: `${(b.pct / 37) * 100}%` }}
              />
            </div>
            <span className="w-10 shrink-0 text-sm font-mono font-medium text-foreground">
              {b.pct}%
            </span>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-5 italic">
        Source: Anthropic Economic Index — approximate shares based on published research
      </p>
    </div>
  );
}

function WageExposureChart() {
  const bands = [
    { label: "Top 25%\n(>$80k)", score: 88, example: "Software engineers, lawyers, analysts" },
    { label: "50–75%\n($50–80k)", score: 64, example: "Nurses, technicians, educators" },
    { label: "25–50%\n($30–50k)", score: 42, example: "Admin assistants, sales reps" },
    { label: "Bottom 25%\n(<$30k)", score: 24, example: "Retail, food service, manual labour" },
  ];

  return (
    <div className="my-8 rounded-2xl border border-border/60 bg-secondary/20 p-6 not-prose">
      <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-5">
        AI exposure index by wage quartile (higher = more exposure)
      </p>
      <div className="space-y-5">
        {bands.map((b) => (
          <div key={b.label}>
            <div className="flex items-end gap-3 mb-1">
              <span className="w-32 shrink-0 text-sm text-muted-foreground whitespace-pre-line leading-tight text-right">
                {b.label}
              </span>
              <div className="flex-1 h-8 bg-muted/40 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${b.score}%` }}
                />
              </div>
              <span className="w-8 shrink-0 text-sm font-mono font-semibold text-foreground">
                {b.score}
              </span>
            </div>
            <p className="text-xs text-muted-foreground pl-36">{b.example}</p>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-5 italic">
        Source: Anthropic Economic Index — index values are illustrative of relative ordering reported in research
      </p>
    </div>
  );
}

function AugmentationSplitChart() {
  const augPct = 57;
  const autoPct = 43;

  return (
    <div className="my-8 rounded-2xl border border-border/60 bg-secondary/20 p-6 not-prose">
      <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-5">
        How AI is being used: augmentation vs automation
      </p>
      <div className="flex gap-4 items-stretch">
        <div className="flex-1 rounded-xl bg-primary/15 border border-primary/30 p-5 text-center">
          <p className="text-4xl font-serif font-bold text-primary mb-2">{augPct}%</p>
          <p className="text-sm font-semibold text-foreground mb-1">Augmentation</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            AI assists the human — the person remains in control and directs the output
          </p>
        </div>
        <div className="flex-1 rounded-xl bg-muted/40 border border-border/60 p-5 text-center">
          <p className="text-4xl font-serif font-bold text-muted-foreground mb-2">{autoPct}%</p>
          <p className="text-sm font-semibold text-foreground mb-1">Automation</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            AI handles the task end-to-end with minimal ongoing human direction
          </p>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-5 italic">
        Source: Anthropic Economic Index — based on task classification across sampled conversations
      </p>
    </div>
  );
}

function CapabilityGapImage() {
  return (
    <div className="my-8 rounded-2xl border border-border/60 bg-secondary/20 p-4 not-prose">
      <img
        src={capabilityGapImg}
        alt="Radar chart: Theoretical AI capability vs observed AI usage by occupational category"
        className="w-full rounded-xl"
      />
      <p className="text-xs text-muted-foreground mt-3 italic text-center">
        Source: Anthropic Economic Index — theoretical AI coverage (blue) vs observed AI usage (red) by occupational category
      </p>
    </div>
  );
}

const VISUALS: Record<string, Record<string, React.ReactNode>> = {
  "anthropic-labor-market-research": {
    "task-breakdown": <TaskBreakdownChart />,
    "wage-exposure": <WageExposureChart />,
    "augmentation-split": <AugmentationSplitChart />,
    "capability-gap": <CapabilityGapImage />,
  },
};

// ── Markdown renderer ────────────────────────────────────────────────────────

function renderMarkdown(content: string, visuals?: Record<string, React.ReactNode>) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let key = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (visuals) {
      const visualMatch = line.match(/^\[VISUAL:(.+?)\]$/);
      if (visualMatch) {
        const visualKey = visualMatch[1];
        if (visuals[visualKey]) {
          elements.push(<div key={key++}>{visuals[visualKey]}</div>);
          continue;
        }
      }
    }

    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={key++} className="text-2xl font-serif font-bold text-foreground mt-12 mb-4">
          {line.slice(3)}
        </h2>
      );
    } else if (line.startsWith("### ")) {
      elements.push(
        <h3 key={key++} className="text-xl font-serif font-semibold text-foreground mt-8 mb-3">
          {line.slice(4)}
        </h3>
      );
    } else if (line.startsWith("- ")) {
      const items: string[] = [];
      let j = i;
      while (j < lines.length && lines[j].startsWith("- ")) {
        items.push(lines[j].slice(2));
        j++;
      }
      elements.push(
        <ul key={key++} className="list-disc list-outside pl-6 space-y-2 my-4">
          {items.map((item, idx) => (
            <li key={idx} className="text-muted-foreground leading-relaxed">
              {renderInline(item)}
            </li>
          ))}
        </ul>
      );
      i = j - 1;
    } else if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];
      let j = i;
      while (j < lines.length && /^\d+\.\s/.test(lines[j])) {
        items.push(lines[j].replace(/^\d+\.\s/, ""));
        j++;
      }
      elements.push(
        <ol key={key++} className="list-decimal list-outside pl-6 space-y-2 my-4">
          {items.map((item, idx) => (
            <li key={idx} className="text-muted-foreground leading-relaxed">
              {renderInline(item)}
            </li>
          ))}
        </ol>
      );
      i = j - 1;
    } else if (line.trim() === "") {
      continue;
    } else {
      elements.push(
        <p key={key++} className="text-muted-foreground leading-relaxed mb-6">
          {renderInline(line)}
        </p>
      );
    }
  }

  return elements;
}

function renderInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /\*\*(.+?)\*\*/g;
  let lastIndex = 0;
  let match;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(<span key={key++}>{text.slice(lastIndex, match.index)}</span>);
    }
    parts.push(
      <strong key={key++} className="text-foreground font-semibold">
        {match[1]}
      </strong>
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(<span key={key++}>{text.slice(lastIndex)}</span>);
  }

  return parts.length > 0 ? parts : [text];
}

// ── Page component ───────────────────────────────────────────────────────────

export default function BlogPost() {
  const params = useParams<{ slug: string }>();
  const post = BLOG_POSTS.find((p) => p.slug === params.slug);

  if (!post) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto px-6 py-12 text-center">
          <h1 className="text-4xl font-serif font-bold mb-4">Article Not Found</h1>
          <p className="text-muted-foreground mb-8">This article doesn't exist.</p>
          <Link href="/blog" className="text-primary font-medium hover:underline">
            Back to Blog
          </Link>
        </div>
      </Layout>
    );
  }

  const visuals = VISUALS[post.slug];

  return (
    <Layout>
      <article className="max-w-3xl mx-auto px-6 py-12">
        <Link href="/blog" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Blog
        </Link>

        <header className="mb-12">
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4 font-mono">
            <span>{post.date}</span>
            <span className="text-border">|</span>
            <span>{post.readTime}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold leading-tight mb-4">
            {post.title}
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            {post.excerpt}
          </p>
        </header>

        <div className="border-t border-border/40 pt-10 font-serif text-[17px]">
          {renderMarkdown(post.content, visuals)}
        </div>

        <footer className="mt-16 pt-8 border-t border-border/40">
          <div className="bg-secondary/30 rounded-2xl p-8 text-center">
            <h3 className="text-xl font-serif font-bold mb-2">Want to discuss this?</h3>
            <p className="text-muted-foreground mb-6">Book a free 15-minute intro call.</p>
            <a
              href="https://cal.com/tuttoone/15min"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors"
            >
              Book a Call
            </a>
          </div>
        </footer>
      </article>
    </Layout>
  );
}
