# SEO and GEO plan

Goal: rank higher in Google for AI training searches (English and French), and
be the provider AI assistants name when someone asks how to get AI training
for their team.

Written 26 October 2026 from the code, not from the live site (the container
could not reach tutto.one). Step 0 checks the live state before anything is
built.

---

## 0. Fence: what this plan never touches

These are for students, trainers and admin. No file under them is edited, no
behaviour on them changes, and none of them goes into the sitemap.

| Area | Routes | Code |
|---|---|---|
| Admin | `/admin`, `/admin/login`, `/admin/setup`, `/api/admin/*` | `server/admin-routes.ts`, `client/src/pages/admin-*.tsx`, `client/src/components/admin/*` |
| Student area | `/learn`, `/learn/*`, `/api/learn/*` | `server/learn-routes.ts`, `server/data-routes.ts`, `client/src/pages/learn.tsx`, `client/src/components/learn/*` |
| Course reader | `/praxis/learn/:course`, `/praxis/learn/:course/:lesson`, `/api/courses*` | `client/src/pages/praxis-learn.tsx`, the course part of `server/routes.ts` |
| Student tools | `/agent-scorecard`, `/ai-charter`, `/handover-list`, `/use-case-card`, `/ai-files`, `/vscode-setup` | their folders in `client/public/` and their handlers in `server/routes.ts` |
| Course library | `/courses/**` | `client/public/courses/**` (see open question 1) |
| Booking cancel | `/rieuzal/annuler`, `/api/events` | `server/event-routes.ts` |

### How the fence is enforced

1. **Allowlist, not blocklist.** Server rendering, per-page head tags and the
   sitemap only ever act on an explicit list of public paths
   (`shared/public-pages.ts`, section 1). A path not on the list gets exactly
   what it gets today: the unchanged `index.html` shell, rendered in the
   browser. A new admin or student route added later is fenced by default.
2. **`index.html` stays as it is.** Every SPA route shares that file, so
   editing it would reach `/learn` and `/admin`. All new head tags are
   injected per request, for allowlisted paths only.
3. **The noindex headers stay as they are** (`server/index.ts`,
   `server/routes.ts`). robots.txt does **not** `Disallow` these areas: a
   blocked page is never fetched, so Google never sees its noindex and can
   still list the bare URL if something links to it
   ([Google: robots.txt is not a way to hide pages](https://developers.google.com/search/docs/crawling-indexing/robots/intro)).
   Only `/api/` is disallowed.
4. **Shared code is touched only where it must be, and has no effect on fenced
   routes:**
   - `client/src/App.tsx`: new `/fr/...` routes for public pages only. The
     existing routes, including all fenced ones, stay line for line.
   - `client/src/lib/preferences.tsx`: when the path starts with `/fr/`, the
     locale is French. Fenced paths never start with `/fr/`, so they keep
     today's behaviour (localStorage, then browser language).
   - `client/src/main.tsx`: unchanged in phase 1 (keeps `createRoot`, which
     simply replaces the server HTML).
5. **Regression test, run before every push** (`scripts/fence-check.mjs`):
   start the built server, request every fenced route, and compare status
   code, `X-Robots-Tag` and body against a snapshot taken before any change.
   Any difference fails the check.

---

## 1. Server-rendered HTML for public pages (the blocker)

**Problem.** Every URL returns an empty `<div id="root">` with the home
page's title. GPTBot, ClaudeBot and PerplexityBot don't run JavaScript
([Vercel/MERJ](https://vercel.com/blog/the-rise-of-the-ai-crawler)), so to them
the site has no content. Google renders it, later and less reliably
([Google JS SEO basics](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)).

**Approach: server-side rendering at request time, for allowlisted paths only.**

Why this rather than the alternatives:

| Option | Verdict |
|---|---|
| Prerender with a headless browser at build | Replit's build may not have Chromium, and blog posts published from admin would stay stale until the next deploy. |
| Static generation at build (no browser) | Same staleness problem for the blog. |
| **SSR in Express with a Vite SSR bundle** | **Chosen.** No browser needed, blog posts are current the moment they're published, and it falls back to today's shell on any error. |
| Rewrite in Next.js / Astro | Too large, and it would drag the fenced areas along with it. |

### Steps

1. **Public page list** `shared/public-pages.ts`: path, component key,
   priority, and whether it has a French version. Start from
   `client/src/webmcp/site-index.ts` (already the list of public pages) plus:

   `/`, `/applied`, `/about`, `/about/me`, `/services`, `/portfolio`,
   `/usecase/`, `/praxis`, `/praxis-programme`, `/calendar`, `/sovereign`,
   `/pythia`, `/blog`, `/blog/:slug`, `/contact`, `/peer-groups`,
   `/become-a-trainer`, `/gtm-orchestrator`, `/rieuzal`, `/data-policy`,
   and, pending open question 2, `/article-4`, `/souverainete`, `/sharepoint`,
   `/fiche-capacites`.

2. **SSR entry** `client/src/entry-server.tsx`: `render(url, locale, data)`
   returns HTML using `renderToString`, wouter's `ssrPath`, and a React Query
   client pre-filled with `data`. It imports the public page components only,
   so admin and learn code is not even in the server bundle.

3. **Make the public pages safe to render on the server.** Browser APIs used
   during render, not inside an effect, will throw. Known ones:
   - `client/src/lib/preferences.tsx`: `localStorage` and `navigator` in the
     initial state (already guarded, but needs a `locale` prop for SSR).
   - `client/src/lib/trainer-code.ts:66,77`: reads `window.location`; check
     whether it runs in render.
   - `client/src/pages/landing.tsx:199-333`: canvas and `matchMedia`; check
     they sit inside effects.
   - `client/src/hooks/use-mobile.tsx`.
   - Currency: the server renders EUR, the browser may switch to GBP after
     load. Fine with `createRoot`; matters only if we move to `hydrateRoot`
     later.

4. **Server data for the blog.** For `/blog` and `/blog/:slug`, read posts
   from `storage` on the server and pass them in, so the article text is in
   the HTML. An unknown slug returns HTTP **404**, not 200 (today every
   unknown URL returns 200, which Google treats as a "soft 404").

5. **Express wiring** in `server/static.ts` (production) and `server/vite.ts`
   (dev), *before* the catch-all: if the path is on the list, render, inject
   into the shell, cache in memory for 5 minutes (cleared when admin saves a
   post), and send. On any error, log it and send the plain shell exactly as
   today.

6. **Build**: add the SSR bundle to `script/build.ts` (`vite build --ssr`).

7. **Proper 404s.** Paths that match neither a public page nor a fenced route
   return HTTP 404 with the not-found page. Fenced routes keep returning what
   they return today.

**Done when:** `curl https://tutto.one/praxis-programme` shows the page's text
and its own `<title>`, the fence check passes, and Lighthouse SEO is 100 on
the five main pages.

---

## 2. Per-page head tags

Injected into the head of allowlisted pages only, from one source:
`shared/page-meta.ts` (title and description per path, EN and FR, plus blog
posts from the database).

- `<title>` and `<meta name="description">`, specific to each page.
- `<link rel="canonical">` pointing at `https://tutto.one/...`. This also
  stops the `.replit.app` address competing with the real domain. Better
  still, 301 that host to tutto.one if Replit allows it.
- Open Graph and Twitter tags for each page, with `og:image` as an absolute
  `https://tutto.one/...` URL. Today `vite-plugin-meta-images.ts` points it
  at the Replit domain.
- `hreflang` links (en, fr, x-default) once phase 4 is in.
- `<html lang>` set on the server.
- The client keeps setting `document.title` on navigation as now; the pages
  that edit the meta description by hand (`sharepoint.tsx`) move to the
  shared helper.
- Viewport: drop `maximum-scale=1` in the injected tag for public pages (it
  blocks zoom, an accessibility fail in Lighthouse). The shell keeps it, so
  fenced pages are unchanged; tell me if you want it gone there too.

### Structured data (JSON-LD)

| Where | Types |
|---|---|
| Every public page | `Organization` (name, logo, url, `sameAs`: LinkedIn, GitHub etc.), `WebSite` |
| `/about/me` | `Person` (Daniel: job title, `sameAs`, `knowsAbout`) |
| `/praxis`, `/praxis-programme`, `/peer-groups`, `/become-a-trainer`, `/article-4` | `Course` with `provider`, `offers` (price, currency), `hasCourseInstance` (`courseMode`: online / onsite, `courseWorkload`, `inLanguage`) ([Google Course info](https://developers.google.com/search/docs/appearance/structured-data/course-info)) |
| `/calendar`, `/rieuzal` | `Event` per date, with location and offers ([Google Event](https://developers.google.com/search/docs/appearance/structured-data/event)) |
| `/blog/:slug` | `BlogPosting` with author, dates, image |
| Pages with a Q&A block (`/praxis-programme` "Common Questions") | `FAQPage`. Google no longer shows FAQ rich results for most sites (Aug 2023), so this is for machine readers, not snippets. |
| All except home | `BreadcrumbList` |

Prices come from `client/src/lib/pricing.ts`, so the markup can't disagree
with the page. Validate each type with Google's Rich Results Test.

---

## 3. robots.txt, sitemap, AI crawlers

- **`/robots.txt`** (served by Express):
  ```
  User-agent: *
  Disallow: /api/
  Sitemap: https://tutto.one/sitemap.xml
  ```
  Plus explicit `Allow: /` lines for `GPTBot`, `OAI-SearchBot`, `ClaudeBot`,
  `Claude-SearchBot`, `PerplexityBot`, `Google-Extended`, `Applebot-Extended`,
  unless you'd rather keep content out of model *training* while staying in
  AI *search*: open question 4.
- **`/sitemap.xml`**: generated from `shared/public-pages.ts` plus published
  blog posts, with `lastmod` and the `xhtml:link` alternates for French.
  Fenced routes are never in it.
- **`/llms.txt`**: a short Markdown map of the site's offers and best pages.
  No major AI company has confirmed it reads the file, so this is cheap and
  speculative. Last in the queue.
- Check Cloudflare or Replit isn't blocking AI crawlers at the network level
  (Cloudflare blocks them by default on new zones since July 2025).

---

## 4. French on its own URLs

**Problem.** One URL serves both languages, picked in the browser. Google
indexes one version per URL, almost always English, so the French pages (the
ones aimed at "formation IA", OPCO funding, Article 4) are effectively not in
Google ([Google localized versions](https://developers.google.com/search/docs/specialty/international/localized-versions)).

**Plan.**
- French lives under `/fr/...` (`/fr/praxis`, `/fr/blog/<slug>`), English
  stays where it is, so no English URL changes.
- `/souverainete` and `/article-4` already exist; decide whether they become
  `/fr/...` with a 301 (open question 3).
- The language switch navigates between `/x` and `/fr/x` and still saves the
  choice.
- **No automatic redirects by browser language** on public pages: Googlebot
  must reach both versions. A French browser on an English page sees a small
  "Version française" link instead.
- Each page lists both versions with `hreflang` and `x-default` → English.
- Blog: the French overlay (`client/src/lib/blog-fr.ts`) covers listings
  only. Posts with a full French body (`client/src/lib/fr/posts/`) get a
  `/fr/blog/<slug>` page; posts without one are left out of the French
  sitemap and hreflang instead of serving English text at a French URL.
- Fenced routes get no `/fr/` versions and their behaviour doesn't change
  (section 0, point 4).

---

## 5. Titles and descriptions that match searches

The headlines stay in Daniel's voice. The `<title>`, meta description and one
H2 per page carry the words people type. Every proposal is written with
`VOICE.md` and run through `node scripts/voice-check.mjs` before it goes in.

### Target searches (to confirm with Search Console data after phase 3)

| English | French |
|---|---|
| AI training for teams / staff | formation IA entreprise |
| AI training for small business | formation IA PME / TPE |
| Claude training / Claude Code course | formation Claude / Claude Code |
| EU AI Act Article 4 AI literacy training | formation IA Article 4 AI Act / obligation de formation IA |
| AI training funded (UK) | formation IA financée OPCO |
| AI workshop Bordeaux/Paris *(wherever you teach in person)* | atelier IA *(ville)* |

### Pages and current titles

| Page | Today | Direction (wording to be written in voice) |
|---|---|---|
| `/praxis` | "Praxis: Brief it once. It works every time. \| Tutto" | AI training for teams, Praxis, Tutto |
| `/praxis-programme` | "The AI-Fluent Team \| Praxis \| Tutto" | 8-session AI training for a team, online or in person |
| `/article-4` | "Article 4: AI literacy training \| Tutto" (good, but not indexed: unlisted) | Keep; index it |
| `/peer-groups` | to check | small-group AI course |
| `/` | "Tutto \| AI that never leaves the building." | Mention both offers: AI training and private AI systems |
| Blog posts | post title only | post title + Tutto |

Rules: title under about 60 characters, main term first; description 140 to
160 characters, saying who it's for, the format and the next step.

---

## 6. Content AI assistants can cite

AI answers to "how do I get AI training for my team" mostly cite pages that
answer the question directly, with numbers and sources. A Princeton/IIT Delhi
study found adding statistics, quotations and cited sources raised visibility
in generated answers by up to about 40%
([Aggarwal et al. 2024, GEO](https://arxiv.org/abs/2311.09735)).

Pages to write (each EN + FR, in Daniel's voice, each with a short direct
answer near the top):

1. **How to train your team in AI: the options, what they cost, how long they
   take.** Self-paced courses, vendor certificates, workshops, coached
   programmes; where Praxis sits, honestly, including when it isn't the right
   choice.
2. **Article 4 of the EU AI Act: what AI literacy training you must provide.**
   In force since 2 February 2025. The existing `/article-4` page is the seed.
3. **Getting AI training funded through your OPCO** (FR first): steps,
   timings, the December deadline already in the copy. Only claim what
   Tutto's certification status allows (open question 5).
4. **Claude for small businesses: where to start.** Links into the public
   course library if it's public (open question 1).
5. **Case studies** from `/usecase` and `/portfolio` with named results and
   numbers where clients agree.

Each page gets a "last updated" date, an author box linking `/about/me`, and
sources.

---

## 7. Off the site

What AI tools and Google trust most is what others say about you.

- **Google Search Console** and **Bing Webmaster Tools**: verify, submit the
  sitemap. ChatGPT search draws heavily on Bing, so Bing is not optional.
- **Google Business Profile** if you teach in person anywhere fixed (Rieuzal).
- **Training directories**: in France, the Qualiopi/Mon Compte Formation
  listings if eligible, OPCO catalogues; in the UK, whatever directories your
  buyers use. Plus a consistent LinkedIn company page.
- **Anthropic-related**: if Praxis builds on Anthropic's course material, any
  partner or community listing is a strong, relevant link.
- **Mentions**: guest posts, podcasts, local press, a talk at a CCI or chamber
  event. Same name, URL and description everywhere.

---

## 8. Measuring it

- Before phase 1: record a baseline in Search Console (impressions, clicks,
  indexed pages) and run the target questions through ChatGPT, Claude,
  Perplexity and Google AI Overviews, in English and French. Save the answers.
- Monthly: the same questions, the same notes; Search Console queries and
  pages; server logs counted by crawler user agent (GPTBot, ClaudeBot,
  PerplexityBot, Googlebot, Bingbot) on public paths.
- Expect Google movement in weeks to a few months after phase 1 to 4. AI
  answers change more slowly and depend most on section 7.

---

## 9. Order and size

| # | Phase | Size | Risk to fenced areas |
|---|---|---|---|
| 0 | Live check, baseline, fence snapshot + `fence-check.mjs` | S | none |
| 1 | SSR for public pages, real 404s | L | low, guarded by the allowlist and fence check |
| 2 | Head tags, canonical, JSON-LD | M | none (allowlist only) |
| 3 | robots.txt, sitemap, crawler access | S | none |
| 4 | French URLs + hreflang | M/L | low (`preferences.tsx`, `App.tsx`, behaviour-neutral on fenced paths) |
| 5 | Titles and descriptions | S | none |
| 6 | New content | ongoing | none |
| 7 | Off-site | ongoing | none |

Phases 1 to 3 ship together on one branch; 4 on its own branch after; 5 can
go in alongside 2.

---

## 10. Open questions for Daniel

1. **`/courses/` library**: it's public, indexable, and linked from the blog,
   and it includes the `*-teaching-notes.html` files. Should search engines
   see the course pages (good for "Claude course" searches)? Should the
   teaching notes be noindex? This plan doesn't touch them until you say.
2. **Unlisted pages** (`/article-4`, `/souverainete`, `/sharepoint`,
   `/fiche-capacites`): indexed or not? `/article-4` is the best page on the
   site for "formation IA entreprise", so I'd index it.
3. **`/souverainete` and `/article-4`**: move under `/fr/` with redirects, or
   leave as they are?
4. **AI crawlers**: allow all (training and search), or allow search bots
   only and block training bots (`GPTBot`, `ClaudeBot`, `Google-Extended`)?
   Blocking training bots doesn't remove you from ChatGPT or Claude search
   results, but it reduces how much the models know about Tutto.
5. **Qualiopi / CPF**: is Praxis certified or listed? It decides what the
   funding page and the `Course` markup may claim.
6. **Where do you teach in person**, and should we target those towns?
7. **Domains**: is the `.replit.app` address reachable publicly, and is
   there a `www.` version? Both should 301 to `https://tutto.one`.
