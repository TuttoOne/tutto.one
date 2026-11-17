/**
 * Diagrams for the blog versions of the Praxis handouts (server/blog-handouts.ts).
 * Each one redraws a diagram from the handout page in the blog's own style,
 * with nothing client-specific in it. Keyed by slug, then by the name used in
 * `[VISUAL:name]` in the post.
 */
import type { ReactNode } from "react";
import {
  ArrowRight, ArrowDown, Laptop, Users, PenLine, Store, RotateCcw, Check, X, FileText, Tags,
  Folder, User, Building2, Cloud, Globe, Lock, Search, MapPin, ScanText, Image as ImageIcon,
  Settings, MessageSquare, AppWindow, Code2, Copy, Link2,
} from "lucide-react";

type Tone = "plain" | "lead" | "gate" | "go" | "eu" | "stop";

const TONE: Record<Tone, string> = {
  plain: "border-border/60 bg-background/60",
  lead: "border-amber-200 bg-amber-50",
  gate: "border-2 border-dashed border-primary/70 bg-background",
  go: "border-green-200 bg-green-50",
  eu: "border-slate-200 bg-slate-50",
  stop: "border-red-200 bg-red-50",
};
const ICON_TONE: Record<Tone, string> = {
  plain: "text-muted-foreground",
  lead: "text-amber-700",
  gate: "text-primary",
  go: "text-green-700",
  eu: "text-slate-600",
  stop: "text-red-700",
};

function Frame({ title, caption, children }: { title: string; caption?: string; children: ReactNode }) {
  return (
    <div className="my-8 rounded-2xl border border-border/60 bg-secondary/20 p-5 sm:p-6 not-prose">
      <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-5">{title}</p>
      {children}
      {caption && <p className="text-xs text-muted-foreground mt-5 italic">{caption}</p>}
    </div>
  );
}

type Node = { icon: typeof Laptop; title: string; sub?: string; tone?: Tone };

function NodeBox({ n }: { n: Node }) {
  const tone = n.tone ?? "plain";
  const Icon = n.icon;
  return (
    <div className={`flex-1 min-w-0 rounded-xl border p-3 flex sm:flex-col items-center sm:text-center gap-3 sm:gap-1.5 ${TONE[tone]}`}>
      <Icon className={`w-6 h-6 shrink-0 ${ICON_TONE[tone]}`} strokeWidth={1.8} />
      <div className="min-w-0">
        <p className="text-sm font-semibold text-foreground leading-snug">{n.title}</p>
        {n.sub && <p className="text-xs text-muted-foreground leading-snug mt-0.5">{n.sub}</p>}
      </div>
    </div>
  );
}

/** Left to right on a wide screen, top to bottom on a phone. */
function Flow({ nodes }: { nodes: Node[] }) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch gap-1.5">
      {nodes.map((n, i) => (
        <div key={n.title} className="contents">
          {i > 0 && (
            <div className="flex items-center justify-center text-primary shrink-0">
              <ArrowRight className="hidden sm:block w-5 h-5" />
              <ArrowDown className="sm:hidden w-5 h-5" />
            </div>
          )}
          <NodeBox n={n} />
        </div>
      ))}
    </div>
  );
}

function Pros({ items }: { items: { ok: boolean; text: string }[] }) {
  return (
    <ul className="mt-3 space-y-1.5">
      {items.map((it) => (
        <li key={it.text} className="flex gap-2 text-xs leading-relaxed text-muted-foreground">
          {it.ok
            ? <Check className="w-4 h-4 shrink-0 text-green-700 mt-px" />
            : <X className="w-4 h-4 shrink-0 text-red-700 mt-px" />}
          <span>{it.text}</span>
        </li>
      ))}
    </ul>
  );
}

function Card({ icon: Icon, title, tone = "plain", children }: { icon?: typeof Laptop; title: string; tone?: Tone; children?: ReactNode }) {
  return (
    <div className={`min-w-0 rounded-xl border p-4 ${TONE[tone]}`}>
      <div className="flex items-center gap-2">
        {Icon && <Icon className={`w-5 h-5 shrink-0 ${ICON_TONE[tone]}`} strokeWidth={1.8} />}
        <p className="text-sm font-semibold text-foreground">{title}</p>
      </div>
      {children}
    </div>
  );
}

/** A folder tree. `d` marks a folder, `c` a comment after the name. */
function Tree({ lines }: { lines: { t: string; d?: boolean; c?: string; i?: number }[] }) {
  return (
    <div className="rounded-xl bg-background/70 border border-border/60 p-4 overflow-x-auto">
      <pre className="font-mono text-[13px] leading-7 text-foreground m-0">
        {lines.map((l, k) => (
          <div key={k} style={{ paddingLeft: `${(l.i ?? 0) * 1.25}rem` }}>
            <span className={l.d ? "font-bold text-amber-700" : ""}>{l.t}</span>
            {l.c && <span className="text-muted-foreground">{"  "}{l.c}</span>}
          </div>
        ))}
      </pre>
    </div>
  );
}

function Steps({ steps }: { steps: { title: string; text: string; tag?: string; tone?: "us" | "go" }[] }) {
  return (
    <ol className="divide-y divide-border/50">
      {steps.map((s, i) => (
        <li key={s.title} className="py-3 grid grid-cols-[2.25rem_1fr] sm:grid-cols-[2.25rem_1fr_auto] gap-x-3 gap-y-1 items-start">
          <span className={`w-8 h-8 rounded-full grid place-items-center text-sm font-bold ${s.tone === "us" ? "bg-primary text-primary-foreground" : s.tone === "go" ? "bg-green-700 text-white" : "bg-secondary text-foreground"}`}>{i + 1}</span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">{s.title}</p>
            <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{s.text}</p>
          </div>
          {s.tag && (
            <span className={`col-start-2 sm:col-start-3 justify-self-start text-xs font-medium rounded-full px-2.5 py-1 whitespace-nowrap ${s.tone === "us" ? "bg-amber-50 text-amber-800 border border-amber-200" : s.tone === "go" ? "bg-green-50 text-green-800 border border-green-200" : "bg-secondary text-muted-foreground"}`}>{s.tag}</span>
          )}
        </li>
      ))}
    </ol>
  );
}

// ── From your sandbox to something customers use ────────────────────────────

function FourPlaces() {
  return (
    <Frame title="The four places a tool lives">
      <div className="hidden sm:flex gap-1.5 mb-1.5 text-[10px] font-bold uppercase tracking-widest">
        <span className="flex-[3] rounded-md bg-amber-50 text-amber-800 text-center py-1.5">Building and trying</span>
        <span className="flex-[1.4] rounded-md bg-green-50 text-green-800 text-center py-1.5">In use</span>
      </div>
      <Flow nodes={[
        { icon: Laptop, title: "My sandbox", sub: "your own computer, only you", tone: "lead" },
        { icon: Users, title: "Team sandbox", sub: "shared, inside the organisation", tone: "lead" },
        { icon: PenLine, title: "The check", sub: "signed off by IT, or by us", tone: "gate" },
        { icon: Store, title: "Live", sub: "customers, colleagues, real work", tone: "go" },
      ]} />
      <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
        <RotateCcw className="w-4 h-4 text-primary shrink-0" />
        <span>A change to a live tool goes back through the team sandbox and the check. Nobody edits the live version directly.</span>
      </div>
    </Frame>
  );
}

function RoadToLive() {
  return (
    <Frame title="Step by step, from idea to live">
      <Steps steps={[
        { title: "Build in your own sandbox", text: "Your folders, your rules file and Claude on your computer.", tag: "In the programme" },
        { title: "Set up the team sandbox", text: "GitHub organisation, shared server or office machine, a login each, data rules.", tag: "Set-up, quoted once", tone: "us" },
        { title: "Build and test together", text: "One repository. The people who'll use it try it on real examples and score it.", tag: "Your team, with support" },
        { title: "The check", text: "The sign-off pack, five questions, a specialist if needed, a signature.", tag: "Quoted per tool", tone: "us" },
        { title: "Go live", text: "The signed-off version moves across. We watch the first week closely.", tag: "Part of the check", tone: "go" },
        { title: "Look after it", text: "Every change goes back to step 3. A short monthly look at what's live.", tag: "Monthly, if you want it" },
      ]} />
    </Frame>
  );
}

// ── Define good ─────────────────────────────────────────────────────────────

function MiniBars({ good }: { good: boolean }) {
  const data = [6.5, 5.8, 4.1, 3.0, 2.6, 2.2];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const base = good ? 0 : 2;
  const max = 7;
  const palette = ["#6366f1", "#ec4899", "#f59e0b", "#10b981", "#06b6d4", "#8b5cf6"];
  return (
    <svg viewBox="0 0 240 140" className="w-full h-auto" role="img" aria-label={good ? "Grey bars for before, green for after, values on each bar, axis from zero" : "Six colours, no values, axis starting at 2"}>
      {data.map((v, i) => {
        const h = ((v - base) / (max - base)) * 100;
        const x = 18 + i * 37;
        const fill = good ? (i < 3 ? "#9ca3af" : "#15803d") : palette[i];
        return (
          <g key={i}>
            <rect x={x} y={110 - h} width="26" height={h} rx="2" fill={fill} />
            {good && <text x={x + 13} y={106 - h} textAnchor="middle" fontSize="10" fill="currentColor">{v}</text>}
            <text x={x + 13} y="124" textAnchor="middle" fontSize="9" fill="#6b7280">{months[i]}</text>
          </g>
        );
      })}
      <line x1="12" y1="110" x2="236" y2="110" stroke="#d1d5db" />
      {!good && <text x="4" y="113" fontSize="8" fill="#6b7280">2</text>}
      {good && <text x="12" y="138" fontSize="8" fill="#6b7280">Source: output/run-log.xlsx</text>}
    </svg>
  );
}

function SameChartTwice() {
  return (
    <Frame title="The same chart, twice" caption="Same data and request. The second one had the brand file and five rules. Made-up example.">
      <div className="grid gap-3 sm:grid-cols-2">
        <Card title="First try: “Chart 1”" tone="stop">
          <div className="mt-3 text-muted-foreground"><MiniBars good={false} /></div>
          <Pros items={[{ ok: false, text: "Axis starts at 2, so June looks 24 times shorter than January" }, { ok: false, text: "Six colours mean nothing" }]} />
        </Card>
        <Card title="Report time down from 6.5 to 2.2 hours" tone="go">
          <div className="mt-3 text-foreground"><MiniBars good /></div>
          <Pros items={[{ ok: true, text: "Grey before, green after, values on the bars" }, { ok: true, text: "Axis from zero, and a source line" }]} />
        </Card>
      </div>
    </Frame>
  );
}

function ScorecardTable() {
  const rows = [
    ["No invented facts", "Open 3 cited pages and find the number", "All 3 match"],
    ["Complete", "Compare with last month's summary", "Every section there, gaps marked"],
    ["Totals add up", "Click the totals in the workbook", "Formulas, matching the accounts"],
    ["On brand", "Put it next to a past report", "Same colours, fonts and logo"],
    ["Sounds like us", "Read the first paragraph aloud", "You'd send it without rewording"],
  ];
  return (
    <Frame title="A scorecard for the monthly client summary" caption="Four out of five is a fail. Fix the brief or the brand file, then run it again.">
      <div className="divide-y divide-border/50">
        {rows.map(([check, how, pass], i) => (
          <div key={check} className="py-3 grid gap-1 sm:grid-cols-[1.75rem_9rem_1fr_1fr] sm:gap-4 sm:items-start">
            <span className="text-sm font-bold text-primary">{i + 1}</span>
            <p className="text-sm font-semibold text-foreground">{check}</p>
            <p className="text-xs text-muted-foreground">{how}</p>
            <p className="text-xs text-green-800 flex gap-1.5"><Check className="w-3.5 h-3.5 shrink-0 mt-px" />{pass}</p>
          </div>
        ))}
      </div>
    </Frame>
  );
}

// ── Getting your training content ready ─────────────────────────────────────

function ContentThreeSteps() {
  return (
    <Frame title="From the guide as it is to parts the AI can work with">
      <Flow nodes={[
        { icon: FileText, title: "The guide as it is", sub: "Word, with headings, tables, activities" },
        { icon: ScanText, title: "Clean text", sub: "same words, no layout, one heading per unit", tone: "eu" },
        { icon: Tags, title: "Tagged parts", sub: "where it sits, what it teaches, what it's worth", tone: "lead" },
      ]} />
    </Frame>
  );
}

function TaggedPart() {
  const tags: [string, string, boolean?][] = [
    ["module", "old 02 (Basic) to new 02"],
    ["unit", "Handling a customer complaint"],
    ["outcome", "Log a complaint and agree the next step with the customer"],
    ["assessment", "MISSING: not in this guide", true],
    ["credits", "8 (was 4)"],
    ["hours", "80 (was 40)"],
    ["source", "Resource guide, p. 14 to 16"],
  ];
  return (
    <Frame title="What a tagged part looks like" caption="Made-up example to show the shape. MISSING is good: it means the AI didn't guess.">
      <div className="rounded-xl border border-border/60 bg-background/70 overflow-hidden">
        {tags.map(([k, v, missing]) => (
          <div key={k} className="grid grid-cols-[6.5rem_1fr] border-b border-border/50 last:border-b-0">
            <span className="px-3 py-2 text-xs font-mono text-muted-foreground bg-secondary/40">{k}</span>
            <span className={`px-3 py-2 text-sm ${missing ? "text-red-700 font-semibold" : "text-foreground"}`}>{v}</span>
          </div>
        ))}
        <p className="px-3 py-3 text-xs italic text-muted-foreground border-t border-border/50">The text of the section follows here, exactly as it is in the guide.</p>
      </div>
    </Frame>
  );
}

// ── Write it down once ──────────────────────────────────────────────────────

function OneFolderPerJob() {
  return (
    <Frame title="One folder per job, one copy of everything else" caption="The case folder changes every time. Starting context and design system are linked in, never copied.">
      <div className="grid gap-3 sm:grid-cols-2">
        <Tree lines={[
          { t: "case-folder/", d: true, c: "one per job" },
          { t: "CLAUDE.md", i: 1, c: "read first, every chat" },
          { t: "sources/", d: true, i: 1, c: "PDF + its .md text" },
          { t: "output/", d: true, i: 1, c: "what Claude writes" },
        ]} />
        <Tree lines={[
          { t: "starting-context/", d: true, c: "linked in" },
          { t: "INSTRUCTIONS.md", i: 1, c: "the standing brief" },
          { t: "VOICE.md", i: 1, c: "how you write" },
          { t: "SCORECARD.md", i: 1, c: "the checks" },
          { t: "examples/", d: true, i: 1, c: "a good past report" },
          { t: "design-system/", d: true, c: "your brand, linked" },
        ]} />
      </div>
    </Frame>
  );
}

function ScorecardLadder() {
  const rungs = [
    { level: "Simple", title: "A list in SCORECARD.md", eg: "No invented facts. Every finding has its source.", tone: "plain" as Tone },
    { level: "Measured", title: "Checks with a number", eg: "Every document in sources/ is cited at least once.", tone: "eu" as Tone },
    { level: "Assessment", title: "A table it fills in first", eg: "Documents 1 to 5 in sequence. Document 4 is missing.", tone: "lead" as Tone },
  ];
  return (
    <Frame title="Scorecards, from simple to measured" caption="The more you want it to run on its own, the more exact the scorecard has to be.">
      <div className="grid gap-3 sm:grid-cols-3">
        {rungs.map((r) => (
          <div key={r.level} className={`rounded-xl border p-4 ${TONE[r.tone]}`}>
            <p className="text-xs font-bold uppercase tracking-wider text-amber-800">{r.level}</p>
            <p className="text-sm font-semibold text-foreground mt-1">{r.title}</p>
            <p className="text-sm font-serif italic text-foreground mt-2">{r.eg}</p>
          </div>
        ))}
      </div>
    </Frame>
  );
}

// ── Where Claude looks for your rules ───────────────────────────────────────

function RuleLevels() {
  return (
    <Frame title="Where Claude looks for your rules" caption="A folder above reaches down. Folders side by side don't see each other. Keep each rule at the highest level it's true for.">
      <div className="grid gap-3 sm:grid-cols-[1fr_1.6fr]">
        <Card icon={AppWindow} title="The Claude app" tone="eu">
          <p className="text-xs text-muted-foreground mt-1">claude.ai and the desktop app</p>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {["Chats", "Projects", "Skills", "Artifacts", "Scheduled tasks"].map((c) => (
              <span key={c} className="text-xs bg-background border border-border/60 rounded-full px-2.5 py-0.5">{c}</span>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3 leading-relaxed">A separate place from your folders. Same account, so skills can show up in both.</p>
        </Card>
        <Card icon={Code2} title="Claude in VS Code" tone="lead">
          <p className="text-xs text-muted-foreground mt-1">works on the folder you open</p>
          <div className="mt-3 rounded-lg border border-border/60 bg-background/70 p-3">
            <p className="text-xs font-semibold text-foreground flex items-center gap-1.5"><User className="w-3.5 h-3.5" />You, in every folder <span className="font-normal text-muted-foreground">~/.claude/CLAUDE.md</span></p>
            <div className="mt-2 rounded-lg border border-border/60 bg-secondary/30 p-3">
              <p className="text-xs font-semibold text-foreground flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" />All the team's work <span className="font-normal text-muted-foreground">team/CLAUDE.md</span></p>
              <div className="mt-2 grid gap-2 grid-cols-3">
                {["Question bank", "Gap analysis", "Proofreader"].map((j) => (
                  <div key={j} className="rounded-md border border-border/60 bg-background p-2">
                    <p className="text-[11px] font-semibold text-foreground leading-tight">{j}</p>
                    <p className="text-[10px] text-muted-foreground">CLAUDE.md</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
        <span>Open a job folder and Claude reads</span>
        <span className="rounded-full bg-background border border-border/60 px-2 py-0.5 text-foreground">your rules</span>
        <ArrowRight className="w-3.5 h-3.5 text-primary" />
        <span className="rounded-full bg-background border border-border/60 px-2 py-0.5 text-foreground">team rules</span>
        <ArrowRight className="w-3.5 h-3.5 text-primary" />
        <span className="rounded-full bg-background border border-border/60 px-2 py-0.5 text-foreground">the job's rules</span>
      </div>
    </Frame>
  );
}

function RequestVsRule() {
  return (
    <Frame title="A request in CLAUDE.md, a rule in settings" caption="Use both: CLAUDE.md says which sources are good, the setting makes sure you see each one.">
      <div className="grid gap-3 sm:grid-cols-2">
        <Card icon={MessageSquare} title="In CLAUDE.md" tone="plain">
          <p className="text-sm font-serif italic text-foreground mt-2">“Use official sources and tell me when you do.”</p>
          <Pros items={[{ ok: true, text: "Flexible: Claude can still settle a contradiction" }, { ok: false, text: "A request. In a long chat Claude can drift" }]} />
        </Card>
        <Card icon={Settings} title="In .claude/settings.json" tone="lead">
          <pre className="mt-2 text-[12px] font-mono bg-background/70 border border-border/60 rounded-lg p-2 whitespace-pre-wrap break-words">{`{ "permissions": { "ask": ["WebSearch", "WebFetch"] } }`}</pre>
          <Pros items={[{ ok: true, text: "Enforced every time, in that folder only" }, { ok: true, text: "Change ask to deny for a hard stop" }]} />
        </Card>
      </div>
    </Frame>
  );
}

// ── Share it, schedule it ───────────────────────────────────────────────────

function WhichPlace() {
  return (
    <Frame title="Which place for which job" caption="Same Claude, same account. The difference is what the work is for.">
      <div className="grid gap-3 sm:grid-cols-2">
        <Card icon={Folder} title="VS Code, in a folder" tone="lead">
          <p className="text-xs text-muted-foreground mt-1">For content you build up and keep in files</p>
          <Pros items={[{ ok: true, text: "Guides, question banks, reports" }, { ok: true, text: "Rules in CLAUDE.md and skills" }, { ok: true, text: "Many files read together" }]} />
        </Card>
        <Card icon={AppWindow} title="The Claude app" tone="eu">
          <p className="text-xs text-muted-foreground mt-1">For things you show people and things that repeat</p>
          <Pros items={[{ ok: true, text: "Artifacts: pages and charts shared by link" }, { ok: true, text: "Projects: files and instructions for one area" }, { ok: true, text: "Scheduled tasks: a job that runs on its own" }]} />
        </Card>
      </div>
    </Frame>
  );
}

function RiskHeatMap() {
  // [likelihood 1-3, impact 1-3, number]
  const dots: [number, number, number][] = [[3, 3, 1], [2, 3, 2], [3, 2, 3], [1, 3, 4], [2, 1, 5]];
  const names = ["Venues fully booked in peak months", "New curriculum not approved in time", "System move runs late", "Key author unavailable", "Test questions shared"];
  const cell = (l: number, i: number) => {
    const s = l + i;
    return s >= 6 ? "bg-red-100" : s >= 5 ? "bg-amber-100" : s >= 4 ? "bg-amber-50" : "bg-green-50";
  };
  return (
    <Frame title="A risk register as an artifact" caption="Made-up example to show the shape. Yours comes from your own register.">
      <div className="grid gap-4 sm:grid-cols-[minmax(0,15rem)_1fr] items-start">
        <div>
          <div className="grid grid-cols-3 gap-1">
            {[3, 2, 1].map((l) => [1, 2, 3].map((i) => (
              <div key={`${l}-${i}`} className={`aspect-square rounded-md ${cell(l, i)} flex flex-wrap items-center justify-center gap-1 p-1`}>
                {dots.filter(([dl, di]) => dl === l && di === i).map(([, , n]) => (
                  <span key={n} className="w-6 h-6 rounded-full bg-foreground text-background text-xs font-bold grid place-items-center">{n}</span>
                ))}
              </div>
            )))}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1.5 text-center">Impact, low to high. Likelihood, bottom to top.</p>
        </div>
        <ol className="space-y-1.5">
          {names.map((n, i) => (
            <li key={n} className="flex gap-2 text-sm text-foreground"><span className="font-bold text-primary w-4">{i + 1}</span>{n}</li>
          ))}
        </ol>
      </div>
    </Frame>
  );
}

// ── Which AI for which specialist job ───────────────────────────────────────

function SpecialistToolMap() {
  const jobs: { icon: typeof Laptop; job: string; tools: string[]; watch: string; tone: Tone }[] = [
    { icon: FileText, job: "Reports, translation, your folders", tools: ["Claude in VS Code"], watch: "Works with your files, CLAUDE.md and scorecards", tone: "lead" },
    { icon: Search, job: "Where else a picture appears", tools: ["Google Lens", "Yandex", "Bing", "TinEye"], watch: "One engine finding nothing proves nothing", tone: "plain" },
    { icon: MapPin, job: "Where a photo was taken", tools: ["ChatGPT", "Gemini", "Picarta"], watch: "A guess is a lead to check, never a finding", tone: "plain" },
    { icon: ScanText, job: "Scans, tables, text in images", tools: ["Mistral", "Gemini"], watch: "Check the text against the original", tone: "plain" },
    { icon: ImageIcon, job: "Images for a proposal or a post", tools: ["ChatGPT", "Gemini"], watch: "Never real people, nothing that could pass as evidence", tone: "plain" },
    { icon: Globe, job: "Sensitive documents kept in Europe", tools: ["Mistral"], watch: "More setup than Claude", tone: "eu" },
    { icon: Lock, job: "Personal data you can't send anywhere", tools: ["A model on your own machine"], watch: "Needs its own machine", tone: "go" },
  ];
  return (
    <Frame title="Which AI for which job">
      <div className="grid gap-3 sm:grid-cols-2">
        {jobs.map((j) => (
          <div key={j.job} className={`rounded-xl border p-4 flex gap-3 ${TONE[j.tone]}`}>
            <j.icon className={`w-6 h-6 shrink-0 ${ICON_TONE[j.tone]}`} strokeWidth={1.8} />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">{j.job}</p>
              <div className="flex flex-wrap gap-1 my-2">
                {j.tools.map((t) => <span key={t} className="text-xs bg-background border border-border/60 rounded-full px-2 py-0.5">{t}</span>)}
              </div>
              <p className="text-xs text-muted-foreground">{j.watch}</p>
            </div>
          </div>
        ))}
      </div>
    </Frame>
  );
}

function CloudEuropeOffice() {
  return (
    <Frame title="Personal data: names stay in the office" caption="The key that turns the codes back into names never leaves the office machine.">
      <div className="hidden sm:flex gap-1.5 mb-1.5 text-[10px] font-bold uppercase tracking-widest">
        <span className="flex-[2.2] rounded-md bg-green-50 text-green-800 text-center py-1.5">Never leaves the office</span>
        <span className="flex-[2] rounded-md bg-amber-50 text-amber-800 text-center py-1.5">Safe to send</span>
      </div>
      <Flow nodes={[
        { icon: FileText, title: "The sensitive list", sub: "names, addresses", tone: "stop" },
        { icon: Lock, title: "Office machine", sub: "names out, codes in, no internet", tone: "go" },
        { icon: Check, title: "Clean version", sub: "no one can be identified", tone: "lead" },
        { icon: Cloud, title: "Claude", sub: "the analysis and the chart", tone: "lead" },
      ]} />
    </Frame>
  );
}

// ── One set of files the whole team uses ────────────────────────────────────

function TeamLibrary() {
  return (
    <Frame title="One team library, pointed to from every case" caption="The case folders point to the library. The library never holds client documents.">
      <div className="grid gap-3 sm:grid-cols-[1fr_auto_1.4fr] items-center">
        <div className="space-y-2">
          {["Case A", "Case B", "Case C"].map((c) => (
            <div key={c} className="rounded-xl border border-slate-200 bg-slate-50 p-3 flex items-center gap-2">
              <Folder className="w-5 h-5 text-slate-600" /><span className="text-sm font-semibold">{c}</span>
              <span className="text-xs text-muted-foreground ml-auto">client documents</span>
            </div>
          ))}
        </div>
        <div className="flex justify-center text-primary"><Link2 className="w-6 h-6 rotate-90 sm:rotate-0" /></div>
        <Tree lines={[
          { t: "team-library/", d: true },
          { t: "README.md", i: 1, c: "who looks after what" },
          { t: "VOICE.md", i: 1, c: "how you write" },
          { t: "design-system/", d: true, i: 1 },
          { t: "jobs/", d: true, i: 1 },
          { t: "report-review/", d: true, i: 2 },
          { t: "INSTRUCTIONS.md", i: 3 },
          { t: "SCORECARD.md", i: 3 },
          { t: "LOG.md", i: 3, c: "what changed, why" },
          { t: "examples/", d: true, i: 3 },
        ]} />
      </div>
    </Frame>
  );
}

function CopyVsPoint() {
  return (
    <Frame title="Copy it, or point to it">
      <div className="grid gap-3 sm:grid-cols-2">
        <Card icon={Copy} title="Copy into every case" tone="stop">
          <div className="flex flex-wrap gap-1.5 mt-3">
            {["v1", "v2", "v2b", "final?", "final-2"].map((v) => (
              <span key={v} className="font-mono text-xs bg-background border border-red-200 rounded px-2 py-0.5">{v}</span>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">A fix made in one case never reaches the others.</p>
        </Card>
        <Card icon={Link2} title="Point to the library" tone="go">
          <div className="flex gap-1.5 mt-3">
            <span className="font-mono text-xs bg-background border border-green-200 rounded px-2 py-0.5">one</span>
          </div>
          <p className="text-xs text-muted-foreground mt-3">Fix it once and every case gets the fix.</p>
        </Card>
      </div>
    </Frame>
  );
}

// ── One GitHub repository or several ────────────────────────────────────────

function OneOrSeveral() {
  return (
    <Frame title="One repository or several" caption="Start with one. A tool moves into its own repository when it needs to, and keeps its history.">
      <div className="grid gap-3 sm:grid-cols-2">
        <Card icon={Folder} title="One team repository" tone="lead">
          <div className="mt-3"><Tree lines={[
            { t: "team-ai/", d: true },
            { t: "CLAUDE.md", i: 1 },
            { t: "library/", d: true, i: 1, c: "instructions, scorecards" },
            { t: "tools/", d: true, i: 1 },
            { t: "report-review/", d: true, i: 2 },
            { t: "translation/", d: true, i: 2 },
          ]} /></div>
          <Pros items={[{ ok: true, text: "One thing to set up, one place to look" }, { ok: true, text: "Tools reuse the library" }, { ok: false, text: "Everyone sees everything" }]} />
        </Card>
        <Card icon={Copy} title="One repository per tool" tone="plain">
          <div className="mt-3"><Tree lines={[
            { t: "team-library/", d: true },
            { t: "report-review/", d: true },
            { t: "translation/", d: true },
            { t: "each with its own CLAUDE.md,", c: "" },
            { t: "people and history", c: "" },
          ]} /></div>
          <Pros items={[{ ok: true, text: "You choose who sees each tool" }, { ok: true, text: "A tool can run or leave on its own" }, { ok: false, text: "More to set up and remember" }]} />
        </Card>
      </div>
    </Frame>
  );
}

function GithubFourWords() {
  const words = [
    { icon: Folder, w: "Repository", d: "A project folder that remembers every version and who changed what." },
    { icon: Users, w: "Organisation", d: "Your company's space on GitHub. Decides who sees each repository." },
    { icon: Check, w: "Save and share", d: "Keeps a version with a one-line reason and sends it to the others." },
    { icon: ArrowDown, w: "Get latest", d: "Brings everyone else's changes onto your computer." },
  ];
  return (
    <Frame title="Four words you'll need">
      <div className="grid gap-3 sm:grid-cols-2">
        {words.map((x) => (
          <div key={x.w} className="rounded-xl border border-border/60 bg-background/60 p-4 flex gap-3">
            <span className="w-10 h-10 rounded-full bg-amber-50 text-amber-700 grid place-items-center shrink-0"><x.icon className="w-5 h-5" /></span>
            <div><p className="text-sm font-semibold text-foreground">{x.w}</p><p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{x.d}</p></div>
          </div>
        ))}
      </div>
    </Frame>
  );
}

export const HANDOUT_VISUALS: Record<string, Record<string, ReactNode>> = {
  "from-sandbox-to-live": { "four-places": <FourPlaces />, "road-to-live": <RoadToLive /> },
  "define-good-before-you-hand-it-over": { "same-chart-twice": <SameChartTwice />, "scorecard": <ScorecardTable /> },
  "getting-your-content-ready-for-ai": { "three-steps": <ContentThreeSteps />, "tagged-part": <TaggedPart /> },
  "write-it-down-once": { "one-folder-per-job": <OneFolderPerJob />, "scorecard-ladder": <ScorecardLadder /> },
  "where-claude-looks-for-your-rules": { "rule-levels": <RuleLevels />, "request-vs-rule": <RequestVsRule /> },
  "share-it-schedule-it": { "which-place": <WhichPlace />, "risk-heat-map": <RiskHeatMap /> },
  "which-ai-for-which-specialist-job": { "tool-map": <SpecialistToolMap />, "names-stay-in-the-office": <CloudEuropeOffice /> },
  "one-set-of-files-the-whole-team-uses": { "team-library": <TeamLibrary />, "copy-vs-point": <CopyVsPoint /> },
  "one-github-repository-or-several": { "four-words": <GithubFourWords />, "one-or-several": <OneOrSeveral /> },
};
