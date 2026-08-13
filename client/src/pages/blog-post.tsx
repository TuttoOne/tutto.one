import { Layout } from "@/components/layout/Layout";
import { Link, useParams } from "wouter";
import { ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { usePreferences } from "@/lib/preferences";
import { BLOG_FR } from "@/lib/blog-fr";
import { POST_FR } from "@/lib/fr/posts";
import { BLOG_VISUALS_FR } from "@/lib/fr/blog-visuals";
import { usePageTr } from "@/lib/page-fr";
import { copy, useT } from "@/lib/i18n";
import type { BlogPost } from "@shared/schema";
import capabilityGapImg from "@assets/c1952c81bca02a7c8cc05ef7801e67ca60831c55-4096x4096_1773827088246.webp";

// ── Visual components ────────────────────────────────────────────────────────

function TaskBreakdownChart() {
  const tr = usePageTr(BLOG_VISUALS_FR);
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
      <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-5">{tr("Share of Claude conversations by task category")}</p>
      <div className="space-y-3">
        {bars.map((b) => (
          <div key={tr(b.label)} className="flex items-center gap-3">
            <span className="w-40 shrink-0 text-sm text-muted-foreground text-right leading-tight">
              {tr(b.label)}
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
      <p className="text-xs text-muted-foreground mt-5 italic">{tr("Source: Anthropic Economic Index - approximate shares based on published research")}</p>
    </div>
  );
}

function WageExposureChart() {
  const tr = usePageTr(BLOG_VISUALS_FR);
  const bands = [
    { label: "Top 25%\n(>$80k)", score: 88, example: "Software engineers, lawyers, analysts" },
    { label: "50–75%\n($50–80k)", score: 64, example: "Nurses, technicians, educators" },
    { label: "25–50%\n($30–50k)", score: 42, example: "Admin assistants, sales reps" },
    { label: "Bottom 25%\n(<$30k)", score: 24, example: "Retail, food service, manual labour" },
  ];

  return (
    <div className="my-8 rounded-2xl border border-border/60 bg-secondary/20 p-6 not-prose">
      <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-5">{tr("AI exposure index by wage quartile (higher = more exposure)")}</p>
      <div className="space-y-5">
        {bands.map((b) => (
          <div key={tr(b.label)}>
            <div className="flex items-end gap-3 mb-1">
              <span className="w-32 shrink-0 text-sm text-muted-foreground whitespace-pre-line leading-tight text-right">
                {tr(b.label)}
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
            <p className="text-xs text-muted-foreground pl-36">{tr(b.example)}</p>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-5 italic">{tr("Source: Anthropic Economic Index - index values are illustrative of relative ordering reported in research")}</p>
    </div>
  );
}

function AugmentationSplitChart() {
  const tr = usePageTr(BLOG_VISUALS_FR);
  const augPct = 57;
  const autoPct = 43;

  return (
    <div className="my-8 rounded-2xl border border-border/60 bg-secondary/20 p-6 not-prose">
      <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-5">{tr("How AI is being used: augmentation vs automation")}</p>
      <div className="flex gap-4 items-stretch">
        <div className="flex-1 rounded-xl bg-primary/15 border border-primary/30 p-5 text-center">
          <p className="text-4xl font-serif font-bold text-primary mb-2">{augPct}%</p>
          <p className="text-sm font-semibold text-foreground mb-1">{tr("Augmentation")}</p>
          <p className="text-xs text-muted-foreground leading-relaxed">{tr("AI assists the human - the person remains in control and directs the output")}</p>
        </div>
        <div className="flex-1 rounded-xl bg-muted/40 border border-border/60 p-5 text-center">
          <p className="text-4xl font-serif font-bold text-muted-foreground mb-2">{autoPct}%</p>
          <p className="text-sm font-semibold text-foreground mb-1">{tr("Automation")}</p>
          <p className="text-xs text-muted-foreground leading-relaxed">{tr("AI handles the task end-to-end with minimal ongoing human direction")}</p>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-5 italic">{tr("Source: Anthropic Economic Index - based on task classification across sampled conversations")}</p>
    </div>
  );
}

function CapabilityGapImage() {
  const tr = usePageTr(BLOG_VISUALS_FR);
  return (
    <div className="my-8 rounded-2xl border border-border/60 bg-secondary/20 p-4 not-prose">
      <img
        src={capabilityGapImg}
        alt={tr("Radar chart: Theoretical AI capability vs observed AI usage by occupational category")}
        width={3840}
        height={3840}
        loading="lazy"
        decoding="async"
        className="w-full rounded-xl"
      />
      <p className="text-xs text-muted-foreground mt-3 italic text-center">{tr("Source: Anthropic Economic Index - theoretical AI coverage (blue) vs observed AI usage (red) by occupational category")}</p>
    </div>
  );
}

function McpArchitectureDiagram() {
  const tr = usePageTr(BLOG_VISUALS_FR);
  const tools = ["SharePoint", "Power Automate", "Salesforce", "GitHub", "PostgreSQL", "Slack"];
  return (
    <div className="my-8 rounded-2xl border border-border/60 bg-secondary/20 p-6 not-prose">
      <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-6">{tr("How MCP connects AI to your business tools")}</p>
      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-0">
        <div className="flex flex-col gap-2 w-full md:w-auto">
          {["Claude", "ChatGPT", "Other AI"].map((ai) => (
            <div key={tr(ai)} className="flex items-center justify-center rounded-lg border border-primary/40 bg-primary/8 px-4 py-2 text-sm font-semibold text-primary w-36 mx-auto md:mx-0">
              {tr(ai)}
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center mx-6 w-full md:w-auto">
          <div className="hidden md:block w-16 h-px bg-border/60" />
          <div className="rounded-xl border-2 border-primary/60 bg-primary/10 px-5 py-3 text-center my-3 md:my-0">
            <p className="text-xs font-mono text-muted-foreground mb-0.5">{tr("open standard")}</p>
            <p className="text-base font-bold text-primary">MCP</p>
            <p className="text-xs text-muted-foreground">{tr("Model Context Protocol")}</p>
          </div>
          <div className="hidden md:block w-16 h-px bg-border/60" />
        </div>

        <div className="grid grid-cols-2 gap-2 w-full md:w-auto">
          {tools.map((tool) => (
            <div key={tool} className="flex items-center justify-center rounded-lg border border-border/60 bg-muted/30 px-3 py-2 text-xs text-muted-foreground font-medium">
              {tool}
            </div>
          ))}
          <div className="col-span-2 flex items-center justify-center rounded-lg border border-dashed border-border/40 px-3 py-2 text-xs text-muted-foreground/60 italic">
            + 500 more platforms
          </div>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-5 italic">{tr("One standard protocol - one bridge - works across all MCP-compatible AI platforms")}</p>
    </div>
  );
}

function LegalRagArchitectureDiagram() {
  const tr = usePageTr(BLOG_VISUALS_FR);
  const layers = [
    {
      label: "Interface",
      items: ["Chat Q&A", "Semantic Search", "Interactive Timeline"],
      color: "border-primary/40 bg-primary/8 text-primary",
    },
    {
      label: "AI & Search",
      items: ["Local LLM (Ollama)", "Vector Search (pgvector)", "OCR Engine"],
      color: "border-border/60 bg-secondary/30 text-foreground",
    },
    {
      label: "Data",
      items: ["Document Corpus", "PostgreSQL", "Embeddings Store"],
      color: "border-border/60 bg-muted/30 text-muted-foreground",
    },
    {
      label: "Hardware",
      items: ["NVIDIA DGX Spark", "128GB Unified Memory", "NVMe Storage"],
      color: "border-border/40 bg-muted/20 text-muted-foreground",
    },
  ];

  return (
    <div className="my-8 rounded-2xl border border-border/60 bg-secondary/20 p-6 not-prose">
      <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2">{tr("System architecture - everything runs on-premise")}</p>
      <div className="flex items-center gap-2 mb-5">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 rounded-full px-3 py-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />{tr("Zero data leaves the device")}</span>
      </div>
      <div className="space-y-2">
        {layers.map((layer, i) => (
          <div key={layer.label}>
            <div className={`rounded-xl border p-4 ${layer.color}`}>
              <p className="text-xs font-mono uppercase tracking-wider opacity-60 mb-2">{layer.label}</p>
              <div className="flex flex-wrap gap-2">
                {layer.items.map((item) => (
                  <span key={item} className="text-xs font-medium bg-background/50 border border-current/20 rounded-lg px-3 py-1.5">
                    {item}
                  </span>
                ))}
              </div>
            </div>
            {i < layers.length - 1 && (
              <div className="flex justify-center my-1">
                <div className="w-px h-4 bg-border/60" />
              </div>
            )}
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-5 italic">{tr("Each client receives their own DGX Spark unit, deployed and configured on-premises by Tutto")}</p>
    </div>
  );
}

const VISUALS: Record<string, Record<string, React.ReactNode>> = {
  "legalrag-on-premise-ai": {
    "legalrag-architecture": <LegalRagArchitectureDiagram />,
  },
  "mcp-bridge-sharepoint": {
    "mcp-architecture": <McpArchitectureDiagram />,
  },
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
  const regex = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)]+)\)|`([^`]+)`/g;
  let lastIndex = 0;
  let match;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(<span key={key++}>{text.slice(lastIndex, match.index)}</span>);
    }
    if (match[1] !== undefined) {
      parts.push(
        <strong key={key++} className="text-foreground font-semibold">
          {match[1]}
        </strong>
      );
    } else if (match[2] !== undefined) {
      const href = match[3];
      const isExternal = href.startsWith("http");
      parts.push(
        <a
          key={key++}
          href={href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className="text-primary underline underline-offset-2 hover:opacity-80 transition-opacity"
        >
          {match[2]}
        </a>
      );
    } else if (match[4] !== undefined) {
      parts.push(
        <code key={key++} className="font-mono text-sm bg-secondary/60 px-1.5 py-0.5 rounded text-foreground">
          {match[4]}
        </code>
      );
    }
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

  const { locale } = usePreferences();
  const t = useT();
  const { data: post, isLoading, isError } = useQuery<BlogPost>({
    queryKey: [`/api/blog/${params.slug}`],
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto px-6 py-12 animate-pulse">
          <div className="h-4 bg-muted rounded w-24 mb-8" />
          <div className="h-8 bg-muted rounded w-3/4 mb-4" />
          <div className="h-4 bg-muted rounded w-1/2 mb-12" />
          <div className="space-y-4">
            {[1,2,3,4,5].map(i => <div key={i} className="h-4 bg-muted rounded" />)}
          </div>
        </div>
      </Layout>
    );
  }

  if (isError || !post) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto px-6 py-12 text-center">
          <h1 className="text-4xl font-serif font-bold mb-4">{t(copy.blogPost.notFound)}</h1>
          <p className="text-muted-foreground mb-8">{t(copy.blogPost.notFoundBody)}</p>
          <Link href="/blog" className="text-primary font-medium hover:underline">
            {t(copy.blogPost.back)}
          </Link>
        </div>
      </Layout>
    );
  }

  // Title, standfirst, date and read time come from the listing overlay; the
  // article body and intro card come from the per-post overlay. Either may be
  // absent, in which case that part falls back to the English from the database.
  const fr = locale === "fr" ? BLOG_FR[post.slug] : undefined;
  const frPost = locale === "fr" ? POST_FR[post.slug] : undefined;

  const introCard = (() => {
    if (!post.introCard) return null;
    try {
      const parsed = JSON.parse(post.introCard);
      return frPost?.introCard ? { ...parsed, ...frPost.introCard } : parsed;
    } catch {
      return null;
    }
  })();
  const visuals = VISUALS[post.slug];

  const ROBOTO = "'Roboto', -apple-system, sans-serif";
  const INTER = "'Inter', -apple-system, sans-serif";

  return (
    <Layout>
      <article className="max-w-3xl mx-auto px-6 py-12">
        <Link href="/blog" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
          <ArrowLeft className="w-4 h-4 mr-1" />
          {t(copy.blogPost.back)}
        </Link>

        {introCard ? (
          <>
            <div style={{ borderRadius: 12, background: "#1a1a1a", padding: "clamp(28px, 5vw, 52px)", marginBottom: 40 }}>
              {introCard.tagline && (
                <p style={{ fontFamily: INTER, fontSize: 9, textTransform: "uppercase", letterSpacing: "0.14em", color: "#d97706", marginBottom: 18 }}>
                  {introCard.tagline}
                </p>
              )}
              <h1 style={{ fontFamily: ROBOTO, fontSize: "clamp(24px, 4.5vw, 44px)", fontWeight: 900, lineHeight: 1.15, color: "#f6f1ea", letterSpacing: "-0.3px", marginBottom: introCard.sub ? 16 : 0 }}>
                {introCard.headline}
              </h1>
              {introCard.sub && (
                <p style={{ fontFamily: INTER, fontSize: 15, lineHeight: 1.8, color: "rgba(246,241,234,0.65)", marginTop: 16, maxWidth: 520 }}>
                  {introCard.sub}
                </p>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-10 font-mono">
              <span>{fr?.date ?? post.date}</span>
              <span className="text-border">|</span>
              <span>{fr?.readTime ?? post.readTime}</span>
            </div>
          </>
        ) : (
          <header className="mb-12">
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4 font-mono">
              <span>{fr?.date ?? post.date}</span>
              <span className="text-border">|</span>
              <span>{fr?.readTime ?? post.readTime}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold leading-tight mb-4">
              {fr?.title ?? post.title}
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              {fr?.excerpt ?? post.excerpt}
            </p>
          </header>
        )}

        <div className="border-t border-border/40 pt-10 font-serif text-[17px]">
          {renderMarkdown(frPost?.content ?? post.content, visuals)}
        </div>

      </article>
    </Layout>
  );
}
