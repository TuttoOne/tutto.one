import { useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import {
  ProductHero,
  Section,
  CardGrid,
  FeatureCard,
  StatCard,
  ExampleSession,
  ClosingCta,
} from "@/components/product/ProductPage";
import { useT } from "@/lib/i18n";
import { copy, SITE_TITLE } from "@/lib/i18n";
import { usePreferences } from "@/lib/preferences";
import { usePageTr } from "@/lib/page-fr";
import { GTM_FR } from "@/lib/fr/gtm-orchestrator";

const BOOKING = "https://cal.com/tuttoone/30min";

/**
 * Rebuilt on the shared product-page vocabulary so its headings and structure
 * match the rest of the site, rather than the bespoke inline-styled document
 * layout it used to carry.
 */
export default function GtmOrchestrator() {
  const t = useT();
  const tr = usePageTr(GTM_FR);
  const { locale } = usePreferences();

  useEffect(() => {
    document.title =
      locale === "fr"
        ? "GTM — moteur de prospection sur site | Tutto"
        : "GTM — On-premise sales outreach engine | Tutto";
    return () => {
      document.title = SITE_TITLE;
    };
  }, [locale]);

  const capabilities = [
    "Researches every prospect automatically",
    "Writes in the sender's voice, not AI voice",
    "Sends safely and on schedule",
    "Connects without API access",
    "Keeps the pipeline warm on its own",
  ];

  const capabilityBodies: Record<string, string> = {
    "Researches every prospect automatically":
      "A research engine profiles each company and contact — what they do, their tech stack, competitive replacement signals, country-specific buying culture — and writes a structured dossier with a personalisation hook. 45 deep-research reports generated; 6,675 prospects profiled across 9 countries.",
    "Writes in the sender's voice, not AI voice":
      "A multi-stage writing pipeline drafts each message, then runs it through automated editorial gates — mechanics, fact-checking, voice-match, and an 'AI-tell' detector that strips the giveaways that get cold email deleted. Anything that fails is held back rather than sent.",
    "Sends safely and on schedule":
      "A sequence scheduler enrols prospects into multi-step campaigns with a send-claim architecture — idempotency keys and fail-closed guards so nothing double-sends or loops. Every send is logged and auditable. 670 emails drafted, 482 sent, across 11 campaign types.",
    "Connects without API access":
      "Reverse-engineered session-replay integrations for HubSpot CRM, Apollo.io, and a licence portal where no developer API was available. Live CRM, enrichment and licensing data surfaces directly into the workflow. Website-visitor signals (790 companies tracked) feed warm leads in automatically.",
    "Keeps the pipeline warm on its own":
      "Daily automations graduate new prospects into campaigns, draft follow-ups for deals that go quiet, and send a morning briefing — so accounts keep moving without manual chasing. Live opportunities at SSAB, Eidsiva, GleSYS, Vektus and others sourced through the system.",
  };

  const stats = [
    { value: "6,675", label: "Prospects researched & profiled" },
    { value: "670", label: "Personalised emails drafted" },
    { value: "482", label: "Emails sent through the pipeline" },
  ];

  const architecture = [
    "Local-only automation",
    "Local-model generation",
    "Controlled frontier escalation",
  ];
  const architectureBodies: Record<string, string> = {
    "Local-only automation":
      "Pulling firmographics, enriching contacts, reconciling licences, and writing the results back to the CRM all run as deterministic processes on the device. No model is involved and nothing leaves the hardware.",
    "Local-model generation":
      "Open-weight models running on the DGX Spark do the bulk of the drafting, research and editorial work. Prospect data is processed on-device and never transmitted.",
    "Controlled frontier escalation":
      "When a task genuinely needs frontier reasoning, Claude (Opus) is called across a single, deliberate boundary — and only the minimum, abstracted context crosses it. Customer-identifying detail is held back on the device.",
  };

  const differentiators = [
    "Privacy by architecture, not policy",
    "Frontier where it counts, local everywhere else",
    "One egress chokepoint",
  ];
  const differentiatorBodies: Record<string, string> = {
    "Privacy by architecture, not policy":
      "Generation, enrichment, CRM and licence operations run on a single device under direct control. The frontier model is an opt-in escalation across a controlled boundary, not the engine the system depends on.",
    "Frontier where it counts, local everywhere else":
      "Open-weight models handle volume and routine reasoning on-device; Opus is reserved for the hardest judgement calls. Cost and exposure both scale with how rarely the boundary is crossed.",
    "One egress chokepoint":
      "A single LLM client mediates every model call. The routing rule — local by default, frontier only when required, sensitive data never raw — is enforced in one place and is auditable.",
  };

  const stack = [
    { key: "Hardware", body: "NVIDIA DGX Spark — GB10 Superchip, 128GB unified memory, NVMe storage. Runs entirely on-device." },
    { key: "AI Models", body: "Open-weight models locally for drafting, research, and editorial gates. Claude (Opus) reached headlessly only when frontier reasoning is required." },
    { key: "Orchestration", body: "Claude running headlessly as the orchestrator — routes each step to a local model or the frontier model through a single LLM client." },
    { key: "Backend", body: "Python (FastAPI) services, a sequence scheduler with send-claim/idempotency architecture, and a React dashboard." },
    { key: "Integrations", body: "Reverse-engineered session-replay bridges to HubSpot CRM, Apollo.io where no developer API exists." },
    { key: "Security", body: "Hardened Linux, TOTP-gated administrative access, least-privilege read-only roles, and full audit logging of sends and model egress." },
  ];

  const session = [
    {
      tag: "A",
      q:
        locale === "fr"
          ? "Quels comptes sont restés silencieux ces trois dernières semaines ?"
          : "Which accounts have gone quiet in the last three weeks?",
      a:
        locale === "fr"
          ? "12 comptes sans contact entrant depuis le 20 juillet. Les plus importants : SSAB (renouvellement de licence, 3e trimestre), Eidsiva (pilote cadré le 2 juillet). Relances rédigées, prêtes à relecture."
          : "12 accounts with no inbound since 20 Jul. Highest value: SSAB (licence renewal, Q3), Eidsiva (pilot scoped 2 Jul). Follow-ups drafted for review.",
    },
    {
      tag: "B",
      q:
        locale === "fr"
          ? "Rédige la relance pour SSAB dans ma voix"
          : "Draft the follow-up for SSAB in my voice",
      a:
        locale === "fr"
          ? "Brouillon prêt. Contrôles de forme, de faits et de ton validés. Une affirmation retenue pour relecture : la date de renouvellement provient du CRM, mise à jour le 14 juillet."
          : "Draft ready. Passed mechanics, fact-check and voice-match. Held one claim for review: renewal date cited from CRM, last updated 14 Jul.",
    },
  ];

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-6 py-12">
        <ProductHero
          eyebrow={tr("AI-Powered Sales Outreach Engine")}
          title={
            locale === "fr"
              ? "La prospection personnalisée, à grande échelle, sur votre matériel."
              : "Personalised outreach at scale, on your own hardware."
          }
          standfirst={
            <>
              <p>
                {tr(
                  "A custom system designed and built to run B2B prospecting end-to-end. Researches prospects, writes personalised emails in the sender's voice, schedules and sends safely, and keeps every account moving — with a human reviewing, not retyping.",
                )}
              </p>
              <p>
                {tr(
                  "Running outreach across the Nordics, Baltics and Netherlands — thousands of prospects, dozens of live accounts, and a CRM that does not research, write, or follow up on its own. Done manually, true personalisation does not scale. Done with templates, response rates collapse. This system eliminates that trade-off.",
                )}
              </p>
            </>
          }
          primaryCta={{ label: t(copy.common.bookConversation), href: BOOKING }}
          secondaryCta={{ label: t(copy.common.seePortfolio), href: "/portfolio" }}
          meta={tr("Privacy by architecture, not policy")}
        />

        <Section index="01" label={tr("What it does")}>
          <CardGrid cols={3}>
            {capabilities.map((title, i) => (
              <FeatureCard key={title} numeral={`${["i", "ii", "iii", "iv", "v"][i]}.`} title={tr(title)}>
                {tr(capabilityBodies[title])}
              </FeatureCard>
            ))}
          </CardGrid>
        </Section>

        <Section
          index="02"
          label={tr("By the numbers")}
          intro={
            <p>
              {tr(
                "Figures pulled live from the system's database. Conversion and reply rates are deliberately omitted — not yet reliably tracked. The honest proof point: sourced live deals including SSAB, Eidsiva and GleSYS.",
              )}
            </p>
          }
        >
          <div className="grid md:grid-cols-2 gap-5 items-start">
            <div className="flex flex-col gap-4">
              {stats.map((s) => (
                <StatCard key={s.label} stat={s.value} label={tr(s.label)} />
              ))}
            </div>
            <ExampleSession
              caption={locale === "fr" ? "GTM · session type" : "GTM · example session"}
              items={session}
            />
          </div>
        </Section>

        <Section
          index="03"
          label={tr("Privacy and data flow")}
          intro={
            <p>
              {tr(
                "The system runs on an NVIDIA DGX Spark — not on rented cloud infrastructure. Prospect records, CRM data, and licensing information live on the device and stay there. There are three data paths, separated by design.",
              )}
            </p>
          }
        >
          <CardGrid cols={3}>
            {architecture.map((title, i) => (
              <FeatureCard key={title} numeral={`${["i", "ii", "iii"][i]}.`} title={tr(title)}>
                {tr(architectureBodies[title])}
              </FeatureCard>
            ))}
          </CardGrid>
        </Section>

        <Section index="04" label={tr("What makes it different")}>
          <CardGrid cols={3}>
            {differentiators.map((title, i) => (
              <FeatureCard key={title} numeral={`${["i", "ii", "iii"][i]}.`} title={tr(title)}>
                {tr(differentiatorBodies[title])}
              </FeatureCard>
            ))}
          </CardGrid>
        </Section>

        <Section index="05" label={tr("Stack")}>
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
            {stack.map((row) => (
              <div key={row.key}>
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary mb-2">
                  {tr(row.key)}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{tr(row.body)}</p>
              </div>
            ))}
          </div>
        </Section>

        <ClosingCta
          title={
            locale === "fr"
              ? "Le même principe, appliqué à votre prospection"
              : "The same principle, applied to your outreach"
          }
          body={tr(
            "The system is a specific answer to a specific problem. The underlying principle applies broadly: most sales and GTM functions can be restructured so that the sensitive work stays on your hardware, the AI is directed rather than trusted, and the human in the loop reviews decisions instead of making them one at a time.",
          )}
          href={BOOKING}
          label={t(copy.common.bookConversation)}
          messageLabel={t(copy.common.sendMessage)}
        />
      </div>
    </Layout>
  );
}
