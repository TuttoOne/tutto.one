import { defineTool } from "@nekuda/webmcp-sdk";
import { SITE_PAGES } from "../site-index";

type AskSiteInput = {
  query: string;
  limit?: number;
};

type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
};

type Match = {
  title: string;
  path: string;
  kind: "blog post" | "page";
  excerpt: string;
};

const STOPWORDS = new Set([
  "the", "and", "for", "you", "your", "with", "that", "this", "what", "how",
  "does", "can", "are", "was", "who", "why", "from", "have", "has", "about",
  "into", "not", "but", "its", "their", "they", "will", "would", "should",
]);

function terms(query: string): string[] {
  return Array.from(
    new Set(
      query
        .toLowerCase()
        .split(/[^a-z0-9]+/)
        .filter((t) => t.length >= 3 && !STOPWORDS.has(t)),
    ),
  );
}

function score(haystack: string, title: string, tokens: string[]): number {
  const body = haystack.toLowerCase();
  const head = title.toLowerCase();
  let total = 0;
  for (const token of tokens) {
    const hits = body.split(token).length - 1;
    if (hits > 0) total += Math.min(hits, 8);
    if (head.includes(token)) total += 5;
  }
  return total;
}

/** A window of the source text around the first matching term. */
function snippet(text: string, tokens: string[], width = 320): string {
  const plain = text.replace(/[#*_`>\[\]]/g, "").replace(/\s+/g, " ").trim();
  const lower = plain.toLowerCase();
  let at = -1;
  for (const token of tokens) {
    const i = lower.indexOf(token);
    if (i !== -1 && (at === -1 || i < at)) at = i;
  }
  if (at === -1) return plain.slice(0, width);
  const start = Math.max(0, at - Math.floor(width / 3));
  return (start > 0 ? "…" : "") + plain.slice(start, start + width).trim() + "…";
}

export const askSite = defineTool({
  stableKey: "tutto.ask_site",
  name: "ask_site",
  title: "Search Tutto's site content",
  description:
    "Search Tutto's own site content — published blog posts and the service, programme and product pages — and return the matching passages with their source paths. Use this to answer any question about what Tutto does, how Praxis works, Pythia and sovereign deployment, the Applied AI evenings, the GTM outreach engine, or anything published on the blog. Returns an array of matches, each with a title, a relevant excerpt and the page path; returns an empty list plus a note when nothing on the site matches.",
  inputSchema: {
    type: "object",
    properties: {
      query: {
        type: "string",
        description: "The visitor's question, or keywords from it.",
      },
      limit: {
        type: "integer",
        description: "Maximum number of matches to return.",
        minimum: 1,
        maximum: 20,
        default: 5,
      },
    },
    required: ["query"],
    additionalProperties: false,
  },
  annotations: { readOnlyHint: true },
  async execute({ query, limit }: AskSiteInput) {
    const tokens = terms(query);
    if (tokens.length === 0) {
      throw new Error("ask_site needs a query with at least one word of three or more letters");
    }

    const res = await fetch("/api/blog");
    if (!res.ok) throw new Error(`ask_site failed to read the blog: HTTP ${res.status}`);
    const posts = (await res.json()) as BlogPost[];

    const scored: { hit: Match; rank: number }[] = [];

    for (const post of posts) {
      const rank = score(`${post.title} ${post.excerpt} ${post.content}`, post.title, tokens);
      if (rank > 0) {
        scored.push({
          rank,
          hit: {
            title: post.title,
            path: `/blog/${post.slug}`,
            kind: "blog post",
            excerpt: snippet(post.content, tokens),
          },
        });
      }
    }

    for (const page of SITE_PAGES) {
      const rank = score(`${page.name} ${page.summary} ${page.detail}`, page.name, tokens);
      if (rank > 0) {
        scored.push({
          rank,
          hit: {
            title: page.name,
            path: page.path,
            kind: "page",
            excerpt: snippet(`${page.summary} ${page.detail}`, tokens),
          },
        });
      }
    }

    scored.sort((a, b) => b.rank - a.rank);
    const matches = scored.slice(0, limit ?? 5).map((s) => s.hit);

    return {
      query,
      matches,
      note:
        matches.length === 0
          ? "Nothing on tutto.one matches that query. Try different wording, or use browse_offerings to see what Tutto covers."
          : `${matches.length} of ${scored.length} matching sections from tutto.one.`,
    };
  },
});
