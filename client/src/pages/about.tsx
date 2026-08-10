import { useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { usePreferences } from "@/lib/preferences";
import { copy, useT } from "@/lib/i18n";

/**
 * The company-level About. Deliberately impersonal — the individual story,
 * photograph and contact details live at /about/me.
 */
export default function About() {
  const { locale } = usePreferences();
  const t = useT();

  useEffect(() => {
    document.title = locale === "fr" ? "À propos - Tutto" : "About - Tutto";
    return () => {
      document.title = "Tutto | AI Consulting";
    };
  }, [locale]);

  const isFr = locale === "fr";

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-serif font-bold mb-4">{t(copy.about.title)}</h1>
        <p className="text-xl text-muted-foreground mb-16 max-w-xl">{t(copy.about.standfirst)}</p>

        <div className="font-serif text-[17px] space-y-6 text-muted-foreground leading-relaxed">
          {isFr ? (
            <>
              <p>
                Tutto est un cabinet de conseil et de réalisation qui travaille à l'intersection des
                opérations, des données et de l'IA. Pas de présentations ni de méthodologies : nous
                entrons dans le détail de vos problèmes réels, nous construisons ce qui les résout,
                et nous nous assurons que cela fonctionne en production.
              </p>
              <p>
                Notre travail couvre tout ce que la préparation à l'IA exige réellement. Parfois il
                s'agit de construire une{" "}
                <strong className="text-foreground font-semibold">passerelle MCP</strong> qui donne à
                l'assistant IA de vos équipes un accès direct à SharePoint ou Salesforce — pour
                qu'elles interrogent au lieu de copier-coller. Parfois il s'agit de déployer une{" "}
                <strong className="text-foreground font-semibold">
                  plateforme d'intelligence documentaire autonome
                </strong>{" "}
                sur site, afin qu'une équipe juridique puisse mener une revue assistée par IA sur
                150 000 documents couverts par le secret professionnel sans qu'un seul octet ne
                quitte le bâtiment.
              </p>
              <p>
                Le fil conducteur : la plupart des problèmes d'adoption de l'IA ne sont pas des
                problèmes d'IA. Ce sont des{" "}
                <strong className="text-foreground font-semibold">
                  problèmes d'architecture de l'information
                </strong>
                . Votre savoir est enfoui dans des fils de discussion, des PDF, la mémoire
                institutionnelle et des processus que personne n'a documentés. Les humains
                s'accommodent de cette ambiguïté. L'IA, non. Notre métier est de structurer ce
                désordre.
              </p>

              <h2 className="text-2xl font-serif font-bold text-foreground pt-6">
                Ce que nous croyons
              </h2>
              <p>
                L'IA est déjà utilisée le plus intensément dans les métiers qui créent le plus de
                valeur : ingénierie logicielle, analyse, droit, recherche, rédaction. L'écart n'est
                pas dans les outils ; il est entre ce que l'IA pourrait théoriquement apporter à une
                organisation et ce qu'elle en fait aujourd'hui. C'est dans cet écart que nous
                travaillons.
              </p>
              <p>
                Les entreprises qui s'en sortiront le mieux ne seront pas celles qui auront déployé
                l'IA les premières, mais celles qui auront compris leurs propres opérations assez
                clairement pour savoir où l'IA ferait la plus grande différence — et qui disposaient
                de l'infrastructure informationnelle pour la soutenir. Construire cette
                infrastructure est un travail ingrat. C'est aussi le plus utile que nous fassions.
              </p>

              <h2 className="text-2xl font-serif font-bold text-foreground pt-6">
                Notre façon de travailler
              </h2>
              <p>
                Nous sommes volontairement de taille réduite. Chaque client a donc un accès direct
                aux personnes qui font le travail, et non à une équipe junior briefée de seconde
                main. Nous cadrons chaque mission en un seul échange, nous avançons vite, et nous
                livrons des choses qui tournent réellement en production. Aucun transfert à des
                intégrateurs. Rien qui finisse sur une étagère.
              </p>
              <p>
                La plupart des missions commencent par une conversation de trente minutes. Nous vous
                dirons honnêtement si nous pensons pouvoir aider, et à quoi cela ressemblerait.
              </p>
            </>
          ) : (
            <>
              <p>
                Tutto is a consultancy and build shop working at the intersection of operations,
                data, and AI. We don't do slide decks and frameworks. We get into the detail of your
                actual problems, build the thing that solves them, and make sure it works in
                production.
              </p>
              <p>
                Our work spans the full range of what AI readiness actually requires. Sometimes that
                means building an{" "}
                <strong className="text-foreground font-semibold">MCP bridge</strong> that gives your
                team's AI assistant direct access to SharePoint or Salesforce — so they're asking
                instead of copy-pasting. Sometimes it means deploying a{" "}
                <strong className="text-foreground font-semibold">
                  self-contained document intelligence platform
                </strong>{" "}
                on-premise so a legal team can run AI-powered review across 150,000 privileged
                documents without a single byte leaving the building. Sometimes it means working out
                why an AI pilot worked brilliantly in isolation and fails to scale — and fixing the
                information architecture underneath it.
              </p>
              <p>
                The common thread: most AI adoption problems aren't AI problems. They're{" "}
                <strong className="text-foreground font-semibold">
                  information architecture problems
                </strong>
                . Your knowledge is buried in Slack threads, PDFs, institutional memory, and
                processes nobody has documented. Humans navigate that ambiguity. AI cannot. Our job
                is to structure the chaos — turning implicit organisational knowledge into explicit,
                machine-consumable assets.
              </p>

              <h2 className="text-2xl font-serif font-bold text-foreground pt-6">What we believe</h2>
              <p>
                AI is already being used most intensively in exactly the roles that drive the most
                value — software engineers, analysts, lawyers, researchers, writers. The gap isn't in
                the tools; it's between what AI can theoretically do for an organisation and what
                they're actually doing with it today. That gap is where we work.
              </p>
              <p>
                The businesses that come out ahead won't be the ones who deployed AI first. They'll
                be the ones who understood their own operations clearly enough to know where AI would
                make the biggest difference — and had the information infrastructure in place to
                support it. Building that infrastructure is unglamorous work. It's also the most
                valuable work we do.
              </p>

              <h2 className="text-2xl font-serif font-bold text-foreground pt-6">How we work</h2>
              <p>
                We're small by design. That means every client gets direct access to the people doing
                the work — not a junior team briefed secondhand. We scope every engagement in a
                single call, move fast, and ship things that actually run in production. No handoffs
                to implementation partners. No shelfware.
              </p>
              <p>
                Most engagements start with a 30-minute conversation. We'll tell you honestly whether
                we think we can help, and what that looks like.
              </p>
            </>
          )}
        </div>

        {/* The personal page sits underneath this one. */}
        <Link
          href="/about/me"
          className="mt-14 group flex items-center justify-between gap-6 p-6 bg-card border border-border rounded-2xl hover:border-primary/40 transition-colors"
        >
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary mb-2">
              {t(copy.about.personalEyebrow)}
            </p>
            <p className="font-serif text-lg font-bold text-foreground group-hover:text-primary transition-colors">
              {t(copy.about.personalTitle)}
            </p>
            <p className="text-sm text-muted-foreground mt-1">{t(copy.about.personalBody)}</p>
          </div>
          <ArrowRight className="w-5 h-5 text-muted-foreground/50 group-hover:text-primary transition-colors shrink-0" />
        </Link>

        <div className="mt-10 p-8 bg-secondary/30 rounded-2xl border border-border">
          <h3 className="text-xl font-serif font-bold mb-2">{t(copy.common.readyToTalk)}</h3>
          <p className="text-muted-foreground mb-6">{t(copy.about.ctaBody)}</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="https://cal.com/tuttoone/15min"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors"
            >
              {t(copy.common.bookCall)}
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 border border-border rounded-full font-medium text-foreground hover:bg-muted/50 transition-colors"
            >
              {t(copy.common.sendMessage)} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
