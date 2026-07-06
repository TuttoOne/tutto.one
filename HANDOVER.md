# Tutto — Handover Document

*For transition to Claude Code / independent development*

---

## 1. Getting the code

The project lives on Replit. To work on it locally with Claude Code:

1. **Download**: In Replit, click the three-dot menu → "Download as zip". Unzip anywhere on your machine.
2. **Or clone via Git**: Replit exposes a Git remote. In Replit → Version Control → copy the remote URL, then `git clone <url>`.

Once local, open the folder in your terminal and run Claude Code from that directory.

---

## 2. What this project is

A personal site / consulting portfolio for Daniel Forsthofer at `tutto.one`.

- Built with **React + TypeScript** (frontend), **Express + Node** (backend), **PostgreSQL** (database)
- Bundled by **Vite**; routing via **Wouter**; styled with **Tailwind CSS v4** + inline styles
- Deployed on **Replit** (published via the Publish button)

---

## 3. Project structure

```
/
├── client/               # Frontend (React)
│   ├── src/
│   │   ├── App.tsx       # Route definitions — add new pages here
│   │   ├── pages/        # One file per page
│   │   ├── components/
│   │   │   ├── layout/Layout.tsx   # Header + nav — edit nav items here
│   │   │   ├── chat/     # Chat components (unused in current nav)
│   │   │   └── ui/       # shadcn/ui primitives (don't edit)
│   │   └── lib/
│   │       └── chat-data.ts  # ALL blog post content lives here
│   └── public/           # Static files served as-is
│       ├── cv.pdf         # CV — replace file to update
│       ├── profile.jpg    # Profile photo (homepage sidebar)
│       └── opengraph.jpg  # Social share image
├── server/
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API routes (/api/chat, /api/contact)
│   └── storage.ts        # Database layer
├── shared/
│   └── schema.ts         # Database schema (Drizzle ORM)
├── script/
│   └── build.ts          # Build script (Vite + esbuild)
└── tutto-content.md      # Archive of all content in markdown
```

---

## 4. All pages and URLs

### In the nav
| URL | Page file | Notes |
|-----|-----------|-------|
| `/` | `about.tsx` | Homepage — also at `/about` |
| `/blog` | `blog.tsx` | "Thinking" in nav |
| `/praxis` | `praxis.tsx` | Course landing page |
| `/pythia` | `pythia.tsx` | Product page |

### Unlisted (accessible by direct URL, not in nav)
| URL | Page file | Purpose |
|-----|-----------|---------|
| `/legalrag` | `legalrag.tsx` | LegalRAG product page |
| `/gtm-orchestrator` | `gtm-orchestrator.tsx` | GTM Orchestrator product page |
| `/second-brain` | `second-brain.tsx` | Second Brain infographic |
| `/become-a-trainer` | `become-a-trainer.tsx` | Trainer recruitment page |
| `/blog/:slug` | `blog-post.tsx` | Individual blog posts |
| `/cv.pdf` | `client/public/cv.pdf` | CV — served directly as PDF |

### Blog post slugs (all at `/blog/<slug>`)
All content is defined in `client/src/lib/chat-data.ts` in the `blogPosts` array.

| Slug | Title |
|------|-------|
| `the-best-combination` | The Best Combination |
| `machine-readable-knowledge` | Making Knowledge Machine-Readable |
| `praxis-closed-loop` | The Podcast That Clarified Why Praxis Exists |
| `glasswing-security-threshold` | AI Has Crossed the Security Threshold |
| `important-steps-ai-journey` | Important Steps in Any AI Journey |
| `anthropic-managed-agents-architecture` | The Harness Problem |
| `legalrag-on-premise-ai` | LegalRAG: On-Premise AI for Document-Heavy Litigation |
| `mcp-bridge-sharepoint` | How We Gave Claude Direct Access to SharePoint |
| `anthropic-labor-market-research` | What Anthropic's Labour Market Research Tells Us |
| `why-machine-readable-matters` | Why "Machine-Readable" is the New "Mobile-Friendly" |
| `the-messy-middle-of-automation` | The Messy Middle of Automation |
| `documentation-is-code` | Documentation is Code |
| `sharepoint-bridge` | Giving Claude Direct Access to Your SharePoint |

---

## 5. Environment variables

These must be set wherever you deploy. On Replit they are already configured.

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string |
| `AI_INTEGRATIONS_ANTHROPIC_API_KEY` | Anthropic API key (for /api/chat) |
| `AI_INTEGRATIONS_ANTHROPIC_BASE_URL` | Anthropic base URL |
| `RESEND_API_KEY` | Email sending (contact form) |

If you move off Replit, you will need to set these in your new hosting environment.

---

## 6. Running locally

```bash
npm install
npm run dev        # Starts at http://localhost:5000
```

Requires Node 18+ and a running PostgreSQL instance pointed to by `DATABASE_URL`.

To push the database schema:
```bash
npx drizzle-kit push
```

---

## 7. Building for production

```bash
npm run build      # Builds client (Vite) + server (esbuild) into /dist
npm start          # Runs the production build
```

---

## 8. How to add a new page

1. Create `client/src/pages/mypage.tsx` — copy the structure from `legalrag.tsx` as a template (same style constants, same `Header` import, same warm background)
2. Register the route in `client/src/App.tsx`:
   ```tsx
   import MyPage from "@/pages/mypage";
   // ...
   <Route path="/mypage" component={MyPage} />
   ```
3. To add it to the nav, edit the `navItems` array in `client/src/components/layout/Layout.tsx`

---

## 9. How to add a blog post

All blog content lives in `client/src/lib/chat-data.ts` in the `blogPosts` array. Each post is an object:

```ts
{
  slug: "my-post-slug",
  title: "Post Title",
  date: "2026-07-01",
  readTime: "5 min read",
  introCard: "Optional dark header card text",
  content: `Full markdown-ish content...`
}
```

- Use `[VISUAL:key-name]` in content to embed a diagram component
- Register diagram components at the top of `blog-post.tsx` in the `visuals` map
- **Do not use template literal backticks inside the content string** — this has caused crashes previously. Use regular quote strings or escape carefully.

---

## 10. Design system

All pages use the same constants (copy from any existing page):

```ts
const ROBOTO = { fontFamily: "'Roboto', -apple-system, sans-serif" }
const INTER  = { fontFamily: "'Inter', -apple-system, sans-serif" }
const AMBER  = "#d97706"   // accent
const DARK   = "#1a1a1a"   // dark cards
const BG     = "#f6f1ea"   // page background
const CARD   = "#faf8f5"   // card background
const BORDER = "#d8d0c5"   // card borders
const TEXT   = "#3d3d3d"
const MUTED  = "#7a7266"
```

Dark section headers use `background: "#2a2a2a"`. Hero cards use `background: DARK`.

---

## 11. Deploying

Currently hosted on Replit. To publish a new version:
- On Replit: click the **Publish** button (top right) — it builds and deploys automatically
- The live domain is configured in Replit's deployment settings

To move to another host (Vercel, Railway, Fly.io, etc.):
1. Export the project from Replit
2. Set the five environment variables above
3. Run `npm run build` then `npm start` (port 5000 by default)
4. The server handles both the API routes and the SPA fallback — no separate static host needed

---

## 12. Known gotchas

- **Tailwind CSS v4** — uses `@tailwindcss/vite` plugin, not the old PostCSS setup. Config is minimal. Most page styling is done with inline styles anyway.
- **No template literals in chat-data.ts** — the content strings there caused crashes when they contained backticks. Keep to single/double quotes.
- **Nav is in Layout.tsx only** — the `navItems` array is the single source of truth.
- **Profile photo** is at `client/public/profile.jpg` and referenced as `/profile.jpg`
- **CV** is at `client/public/cv.pdf` — to update, just replace the file at that path
- **Database schema changes** require `npx drizzle-kit push` to apply to the live DB

---

*Built by Humanity³ — a division of Tutto Products and Services*
