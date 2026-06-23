# AI-Powered Sales Outreach Engine
### A custom system I designed and built to run B2B prospecting end-to-end

**The problem.** I run outreach for TSplus across the Nordics, Baltics and Netherlands — thousands of prospects, dozens of live accounts, and a CRM that doesn't research, write, or follow up on its own. Done by hand, personalised outreach at this scale is impossible; done with generic templates, it gets ignored.

**What I built.** A full-stack outreach platform (~28,500 lines of Python plus a React dashboard) that researches prospects, writes genuinely personalised emails in my voice, schedules and sends them safely, and keeps every account moving — with me reviewing, not retyping.

---

## What the system does

**1. Researches every prospect automatically.**
A research engine profiles each company and contact — what they do, their tech stack, competitive replacement signals (Citrix, VPN, RDS), country-specific buying culture — and writes a structured dossier with a personalisation hook. *45 deep-research reports generated; 6,675 prospects profiled across 9 countries.*

**2. Writes in my voice, not "AI voice".**
A multi-stage writing pipeline drafts each message, then runs it through automated editorial gates — mechanics, fact-checking, voice-match, and an "AI-tell" detector that strips the giveaways that get cold email deleted. Anything that fails is held back rather than sent.

**3. Sends safely and on schedule.**
A sequence scheduler enrols prospects into multi-step campaigns with a send-claim architecture (idempotency keys, fail-closed guards) so nothing double-sends or loops. Every send is logged and auditable. *670 emails drafted, 482 sent, across 11 campaign types.*

**4. Connects to the tools I already use — without API access.**
I reverse-engineered session-replay integrations for **HubSpot CRM, Apollo.io, and the TSplus license portal** where no developer API was available, surfacing live CRM, enrichment and licensing data directly into the workflow. Website-visitor signals (790 companies tracked) feed warm leads in automatically.

**5. Keeps the pipeline warm on its own.**
Daily automations graduate new prospects into campaigns, draft follow-ups for deals that go quiet, and send me a morning briefing — so accounts keep moving without me chasing them.

---

## Where it adds value

- **Scale with personalisation** — 6,675 researched prospects, each addressed individually rather than blasted.
- **Quality control built in** — every message passes editorial gates before it can reach a human; reviewed by me, never auto-blasted.
- **Real pipeline generated** — live opportunities sourced and worked through the system (Remote Access trials at SSAB, Eidsiva, GleSYS, Vektus and others) became tracked CRM deals.
- **No data left on the table** — license disputes, renewals and visitor signals are reconciled and turned into outreach instead of being lost.

---

## By the numbers

| Metric | Figure |
|---|---|
| Prospects researched & profiled | **6,675** |
| Countries covered | **9** (NL, SE, FI, DK, NO, Baltics) |
| Personalised emails drafted | **670** |
| Emails sent through the pipeline | **482** |
| Active multi-step campaigns | **130 enrolments live** |
| Deep-research dossiers | **45** |
| Accounts under license management | **469** |
| Custom tool integrations built | **3** (HubSpot, Apollo, License portal) |
| Codebase | **~28,500 lines, full-stack** |

*Figures pulled live from the system's database. Conversion/reply rates are deliberately omitted — they are not yet reliably tracked. The honest qualitative proof point is: sourced live deals including SSAB, Eidsiva and GleSYS.*

---

## Privacy & Data Flow

The system runs on my own hardware — an **NVIDIA DGX Spark** — not on rented cloud infrastructure. Prospect records, CRM data, and licensing information live on the device and stay there. It brings the AI to the data, not the data to the AI.

There are three data paths, separated by design:

- **Local-only automation.** Pulling firmographics, enriching contacts, reconciling licenses, and writing the results back to the CRM all run as deterministic processes on the device. No model is involved and nothing leaves the hardware.
- **Local-model generation.** Open-weight models running on the DGX Spark do the bulk of the drafting, research and editorial work. Prospect data is processed on-device and never transmitted.
- **Controlled frontier escalation.** When a task genuinely needs frontier reasoning, Claude (Opus) is called across a single, deliberate boundary — and only the minimum, abstracted context crosses it. Customer-identifying detail is held back on the device.

The orchestration layer is **Claude running headlessly**, directing the local models and reserving the frontier model for the few steps that actually require it. Every call out of the device passes through one auditable chokepoint, so escalation is the exception, not the default.

This is the gap that protects the whole solution: the work — and all of the sensitive data — stays on my hardware. The frontier model is reached for only when it earns its place, and never with raw customer data.

## What Makes It Different

**Privacy by architecture, not by policy.** Generation, enrichment, CRM and license operations run on a single device under my own control. The frontier model is an opt-in escalation across a controlled boundary, not the engine the system depends on.

**Frontier where it counts, local everywhere else.** Open-weight models handle volume and routine reasoning on-device; Opus is reserved for the hardest judgement calls. Cost and exposure both scale with how rarely the boundary is crossed.

**One egress chokepoint.** A single LLM client mediates every model call, so the routing rule — local by default, frontier only when required, sensitive data never raw — is enforced in one place and is auditable.

---

## Technology Stack

- **Hardware:** NVIDIA DGX Spark (GB10 Superchip, 128GB unified memory, NVMe storage) — the system runs entirely on-device.
- **AI models:** Open-weight models running locally for the bulk of drafting, research and editorial gates; Claude (Opus) reached headlessly across a controlled boundary only when frontier reasoning is required.
- **Orchestration:** Claude running headlessly as the orchestrator, routing each step to a local model or the frontier model through a single LLM client.
- **Backend:** Python (FastAPI) services, a sequence scheduler with a send-claim/idempotency architecture, and a React dashboard.
- **Integrations:** Reverse-engineered session-replay bridges to HubSpot CRM, Apollo.io and the TSplus license portal where no developer API exists.
- **Security:** Hardened Linux, TOTP-gated administrative access, least-privilege read-only roles, and full audit logging of sends and model egress.
- **Access:** Tailscale peer-to-peer VPN for secure remote access without port forwarding.

---

*Built by Humanity³ (H³) — a division of Tutto Products and Services*
