/**
 * Server-rendered HTML and head tags for the public pages
 * (docs/seo-geo-plan.md, sections 1 and 2).
 *
 * Only paths on the allowlist in shared/public-pages.ts come through here.
 * Everything else, the student, trainer and admin routes included, is sent
 * the index.html shell untouched, as before. Any error falls back to that
 * shell too: a page that can't be rendered on the server is still a working
 * page in the browser.
 */
import type { Request } from "express";
import { matchPublicPage, isKnownAppPath, SITE_URL, type PublicPage } from "@shared/public-pages";

type Renderer = {
  render: (input: { key: string; path: string; locale: "en" | "fr"; data: Record<string, unknown> }) => string;
  PAGE_QUERIES: Record<string, (slug?: string) => string[][]>;
};

export type LoadRenderer = () => Promise<Renderer>;

type Rendered = { status: number; html: string };

const CACHE_MS = 5 * 60 * 1000;
const cache = new Map<string, { at: number; value: Rendered }>();

/**
 * The page for a shell request: status and HTML. Allowlisted pages are
 * rendered, unknown paths get the shell with a 404, the rest the shell as is.
 */
export async function pageFor(
  req: Request,
  shell: string,
  loadRenderer: LoadRenderer,
  { useCache = true } = {},
): Promise<Rendered> {
  // originalUrl, since a handler mounted with app.use sees req.path without its mount.
  const pathname = new URL(req.originalUrl, "http://localhost").pathname;
  const match = matchPublicPage(pathname);
  if (!match) {
    return { status: isKnownAppPath(pathname) ? 200 : 404, html: shell };
  }

  const hit = useCache ? cache.get(pathname) : undefined;
  if (hit && Date.now() - hit.at < CACHE_MS) return hit.value;

  try {
    const value = await renderPage(req, shell, match.page, match.slug, await loadRenderer());
    if (useCache) cache.set(pathname, { at: Date.now(), value });
    return value;
  } catch (err) {
    console.error(`[ssr] ${pathname} fell back to the shell:`, err);
    return { status: 200, html: shell };
  }
}

async function renderPage(
  req: Request,
  shell: string,
  page: PublicPage,
  slug: string | undefined,
  renderer: Renderer,
): Promise<Rendered> {
  // The page's data, read from the site's own API so the server sees exactly
  // what the browser would.
  const base = `http://127.0.0.1:${req.socket.localPort}`;
  const data: Record<string, unknown> = {};
  for (const key of renderer.PAGE_QUERIES[page.key]?.(slug) ?? []) {
    const res = await fetch(base + key.join("/"));
    if (res.status === 404 && page.key === "blog-post") return { status: 404, html: shell };
    if (res.ok) data[JSON.stringify(key)] = await res.json();
  }

  const body = renderer.render({ key: page.key, path: page.path, locale: "en", data });
  const post = page.key === "blog-post" ? (Object.values(data)[0] as BlogPostData | undefined) : undefined;

  const title = post
    ? `${post.title} | Tutto`
    : page.title?.en ?? `${textOf(firstTag(body, "h1")) || "Tutto"} | Tutto`;
  const description = post?.excerpt ?? page.description?.en ?? describe(body);
  const url = SITE_URL + page.path;

  const head = [
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<script type="application/ld+json">${jsonLd(page, title, description, url, data, post)}</script>`,
  ].join("\n    ");

  let html = shell
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*/, `$1${esc(description)}`)
    .replace(/(<meta property="og:title" content=")[^"]*/, `$1${esc(title)}`)
    .replace(/(<meta property="og:description" content=")[^"]*/, `$1${esc(description)}`)
    .replace(/(<meta name="twitter:title" content=")[^"]*/, `$1${esc(title)}`)
    .replace(/(<meta name="twitter:description" content=")[^"]*/, `$1${esc(description)}`)
    .replace(/(<meta (?:property|name)="(?:og|twitter):image" content=")[^"]*/g, `$1${SITE_URL}/opengraph.jpg`)
    // Zoom stays on for the public pages; the shell keeps its own setting.
    .replace(/, maximum-scale=1/, "")
    .replace("</head>", `  ${head}\n  </head>`)
    .replace(`<div id="root"></div>`, `<div id="root">${body}</div>`);
  if (page.lang === "fr") html = html.replace(`<html lang="en">`, `<html lang="fr">`);

  return { status: 200, html };
}

type BlogPostData = { slug: string; title: string; excerpt: string; date: string };
type EventData = { events: { slug: string; title: string; startsAt: string; endsAt: string; venue: string; address: string; placesLeft: number; status: string }[] };

const ORGANIZATION = {
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "Tutto",
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.png`,
  founder: { "@id": `${SITE_URL}/about/me#person` },
};

const PERSON = {
  "@type": "Person",
  "@id": `${SITE_URL}/about/me#person`,
  name: "Daniel Forsthofer",
  url: `${SITE_URL}/about/me`,
  image: `${SITE_URL}/profile.jpg`,
  worksFor: { "@id": `${SITE_URL}/#organization` },
  sameAs: ["https://www.linkedin.com/in/daniel-forsthofer/"],
};

function jsonLd(
  page: PublicPage,
  title: string,
  description: string,
  url: string,
  data: Record<string, unknown>,
  post: BlogPostData | undefined,
): string {
  const name = title.replace(/\s*\|\s*Tutto$/, "");
  const graph: Record<string, unknown>[] = [
    ORGANIZATION,
    { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: "Tutto", url: SITE_URL, publisher: { "@id": ORGANIZATION["@id"] } },
  ];

  if (page.path !== "/") {
    const crumbs = [{ name: "Tutto", item: SITE_URL + "/" }];
    if (post) crumbs.push({ name: "Blog", item: `${SITE_URL}/blog` });
    crumbs.push({ name, item: url });
    graph.push({
      "@type": "BreadcrumbList",
      itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, ...c })),
    });
  }

  if (post) {
    const published = new Date(post.date);
    graph.push({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      url,
      mainEntityOfPage: url,
      ...(isNaN(published.getTime()) ? {} : { datePublished: published.toISOString().slice(0, 10) }),
      author: { "@id": PERSON["@id"] },
      publisher: { "@id": ORGANIZATION["@id"] },
      image: `${SITE_URL}/opengraph.jpg`,
    });
    graph.push(PERSON);
  }

  switch (page.schema) {
    case "Course":
      graph.push({ "@type": "Course", name, description, url, provider: { "@id": ORGANIZATION["@id"] } });
      break;
    case "Service":
      graph.push({ "@type": "Service", name, description, url, provider: { "@id": ORGANIZATION["@id"] } });
      break;
    case "AboutPage":
    case "ContactPage":
    case "ProfilePage":
      graph.push({
        "@type": page.schema,
        name,
        url,
        ...(page.schema === "ProfilePage" ? { mainEntity: { "@id": PERSON["@id"] } } : {}),
      });
      if (page.schema === "ProfilePage") graph.push(PERSON);
      break;
    case "Blog":
      graph.push({ "@type": "Blog", name, description, url, publisher: { "@id": ORGANIZATION["@id"] } });
      break;
    case "EventSeries": {
      const series = Object.values(data)[0] as EventData | undefined;
      for (const e of series?.events ?? []) {
        graph.push({
          "@type": "Event",
          name: e.title,
          startDate: e.startsAt,
          endDate: e.endsAt,
          eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
          eventStatus: "https://schema.org/EventScheduled",
          location: { "@type": "Place", name: e.venue, address: e.address },
          organizer: { "@id": ORGANIZATION["@id"] },
          inLanguage: "fr",
          isAccessibleForFree: true,
          offers: {
            "@type": "Offer",
            price: 0,
            priceCurrency: "EUR",
            url,
            availability: e.placesLeft > 0 ? "https://schema.org/InStock" : "https://schema.org/SoldOut",
          },
          url,
        });
      }
      break;
    }
  }

  // `<` is escaped so no string in the data can close the script tag.
  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c");
}

/** The first paragraph long enough to describe the page, cut to about 160 characters. */
function describe(html: string): string {
  const paragraphs = html.match(/<p[\s>][\s\S]*?<\/p>/g) ?? [];
  const text = paragraphs.map(textOf).find((t) => t.length >= 60) ?? "";
  if (text.length <= 160) return text;
  const cut = text.slice(0, 160);
  const sentence = cut.lastIndexOf(". ");
  if (sentence >= 80) return cut.slice(0, sentence + 1);
  return cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:]$/, "") + "…";
}

function firstTag(html: string, tag: string): string {
  return new RegExp(`<${tag}[\\s>][\\s\\S]*?</${tag}>`).exec(html)?.[0] ?? "";
}

function textOf(html: string): string {
  return html
    .replace(/<br\s*\/?>/g, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&nbsp;|&#160;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
