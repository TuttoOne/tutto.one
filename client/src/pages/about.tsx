import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { usePreferences } from "@/lib/preferences";
import { copy, useT, SITE_TITLE } from "@/lib/i18n";

/**
 * A portrait for the people section. The image is a drop-in — if the file is
 * missing the initials stand in, so the page never shows a broken image.
 */
function Portrait({ src, alt, initials }: { src: string; alt: string; initials: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="w-full aspect-[3/4] rounded-xl bg-secondary/60 border border-border flex items-center justify-center">
        <span className="font-serif text-5xl font-bold text-muted-foreground/40 select-none">
          {initials}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      width={675}
      height={900}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className="w-full aspect-[3/4] object-cover rounded-xl border border-border"
    />
  );
}

/**
 * One person in the "who you work with" section. Both cards are the same
 * shape on purpose: neither of us is the junior partner here.
 */
function PersonCard({
  src,
  name,
  initials,
  role,
  link,
  children,
}: {
  src: string;
  name: string;
  initials: string;
  role: string;
  link: { href: string; label: string; external?: boolean };
  children: React.ReactNode;
}) {
  const linkClass =
    "mt-6 inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors";

  return (
    <div className="p-6 sm:p-8 bg-card border border-border rounded-2xl">
      <div className="grid sm:grid-cols-[minmax(0,200px)_1fr] gap-6 sm:gap-8">
        <div className="max-w-[200px] sm:max-w-none">
          <Portrait src={src} alt={name} initials={initials} />
        </div>
        <div>
          <h2 className="text-2xl font-serif font-bold text-foreground">{name}</h2>
          <p className="text-sm text-muted-foreground mt-1 mb-5">{role}</p>
          <div className="font-serif text-[17px] space-y-5 text-muted-foreground leading-relaxed">
            {children}
          </div>
          {link.external ? (
            <a href={link.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
              {link.label}
              <ArrowRight className="w-4 h-4" />
            </a>
          ) : (
            <Link href={link.href} className={linkClass}>
              {link.label}
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * The company-level About: what Tutto does, then who does it. The two people
 * get equal cards; the longer personal story and contact details still live
 * at /about/me, which Daniel's card links to.
 */
export default function About() {
  const { locale } = usePreferences();
  const t = useT();

  useEffect(() => {
    document.title = locale === "fr" ? "À propos - Tutto" : "About - Tutto";
    return () => {
      document.title = SITE_TITLE;
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

        {/*
          Both of us, same card, Rox first. Her introduction lives here
          because she has no page of her own on this site; mine repeats the
          shape rather than deferring to /about/me, which the card links out
          to for the longer version.
        */}
        <section className="mt-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary mb-4">
            {isFr ? "Avec qui vous travaillez" : "Who you work with"}
          </p>

          <div className="space-y-6">
            <PersonCard
              src="/rox.jpg"
              name="Roxanne Northover"
              initials="RN"
              role={isFr ? "Opérations, processus, IA appliquée" : "Operations, process, practical AI"}
              link={{
                href: "https://truenorthconsult.net/",
                label: isFr ? "True North Consulting, son cabinet" : "True North Consulting, her practice",
                external: true,
              }}
            >
              {isFr ? (
                <>
                  <p>
                    Rox travaille avec nous sur chaque mission. Son parcours : gestion de projet,
                    analyse métier, opérations et amélioration des processus — le tout adossé à un{" "}
                    <strong className="text-foreground font-semibold">Master en droit</strong>, qui
                    lui donne un socle solide en recherche, gouvernance et risque.
                  </p>
                  <p>
                    Ce qu'elle voit mieux que quiconque, c'est l'écart entre la façon dont une
                    entreprise est censée fonctionner et la façon dont le travail se fait réellement :
                    la direction décrit un processus pendant que les personnes qui l'exécutent chaque
                    jour tiennent avec des tableurs, des boîtes mail et des contournements que
                    personne n'a jamais écrits. Le droit lui a appris la même leçon très tôt — ce
                    qu'un système est censé produire et ce qu'il produit en pratique sont deux sujets
                    distincts.
                  </p>
                  <p>
                    Elle a travaillé sur la gouvernance de l'IA, le déploiement de CRM, la gestion
                    documentaire, l'automatisation du reporting et la conception de processus
                    opérationnels. Elle commence toujours au même endroit : que se passe-t-il vraiment
                    ici, et d'où vient la friction ?
                  </p>
                  <p>
                    Elle ne part jamais du principe que la technologie est la réponse. Parfois c'est
                    de l'automatisation, parfois un meilleur système, parfois simplement un processus
                    plus clair. C'est exactement le discernement qui fait tenir le travail sur l'IA.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    Rox works with us on every engagement. Her background is project management,
                    business analysis, operations and process improvement, built on a{" "}
                    <strong className="text-foreground font-semibold">Master's in Law</strong> that
                    gives her a real grounding in research, governance and risk.
                  </p>
                  <p>
                    What she sees better than anyone is the gap between how a business is supposed to
                    run and how the work actually happens — leadership describing one process while
                    the people doing it every day get by on spreadsheets, inboxes and workarounds
                    nobody ever wrote down. Law taught her the same lesson early: what a system is
                    meant to do and what it does in practice are two different subjects.
                  </p>
                  <p>
                    She has worked across AI governance, CRM implementation, document management,
                    reporting automation and operational process design. She starts in the same place
                    every time: what is really happening here, and where is the friction coming from?
                  </p>
                  <p>
                    She does not assume technology is the answer. Sometimes it's automation, sometimes
                    a better system, sometimes simply a clearer process. That judgement is what makes
                    the AI work land.
                  </p>
                </>
              )}
            </PersonCard>

            <PersonCard
              src="/profile.jpg"
              name="Daniel Forsthofer"
              initials="DF"
              role={isFr ? "IA appliquée, architecture, réalisation" : "Applied AI, architecture, delivery"}
              link={{
                href: "/about/me",
                label: isFr ? "Mon parcours, en plus long" : "The longer version, in my own words",
              }}
            >
              {isFr ? (
                <>
                  <p>
                    Daniel a fondé Tutto. Sa formation est la{" "}
                    <strong className="text-foreground font-semibold">philosophie</strong> — non comme
                    discipline académique, mais comme socle pratique pour travailler avec la
                    technologie : qu'est-ce que cela signifie vraiment d'utiliser ces systèmes, quelle
                    en est l'utilité réelle, et sur quoi avons-nous prise ?
                  </p>
                  <p>
                    C'est cette dernière question qui fait le plus gros du travail. L'IA n'est pas un
                    choix : elle est le produit de conditions économiques et scientifiques qu'aucune
                    décision isolée n'arrêtera. Ce qui relève du choix, c'est de la comprendre et de
                    bien s'en servir. Il travaille avec ceux qui veulent savoir ce qui se passe
                    réellement : ce que sont ces systèmes, ce qu'ils font vraiment bien, où ils
                    échouent, et à quoi ressemble une installation qui tient dans leur contexte.
                  </p>
                  <p>
                    Et il construit. La plupart des missions se terminent par quelque chose qui tourne
                    en production — une passerelle vers SharePoint ou Salesforce, une plateforme
                    documentaire qui ne quitte jamais le bâtiment, un processus qui n'a plus besoin de
                    quelqu'un pour le porter. Livrer une chose qui marche, plutôt que présenter le
                    plan d'une chose qui marcherait.
                  </p>
                  <p>
                    La peur est ici la condition de départ, pas l'ennemi — il la ressent encore. La
                    réponse n'est pas la bravade : c'est un premier pas, puis un autre. Son rôle n'est
                    pas d'être l'expert au-dessus de vous, mais celui qui a déjà fait les premiers
                    pas, à côté de vous.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    Daniel founded Tutto. His background is{" "}
                    <strong className="text-foreground font-semibold">philosophy</strong> — not as an
                    academic pursuit but as the practical grounding for working with technology: what
                    does it actually mean to use these systems, what is the return, and what is in
                    our control?
                  </p>
                  <p>
                    That last question does most of the work. AI is not a choice — it is the product
                    of economic and scientific conditions that no single decision will stop. What is a
                    choice is whether you understand it and whether you use it well. He works with
                    people who want to know what is actually happening: what these systems are, what
                    they are genuinely good at, where they fail, and what a working setup looks like
                    in their context.
                  </p>
                  <p>
                    And he builds. Most engagements end with something running in production — a
                    bridge into SharePoint or Salesforce, a document platform that never leaves the
                    building, a process that stopped needing someone to shepherd it. Ship the working
                    thing rather than present the plan for one.
                  </p>
                  <p>
                    Fear is the starting condition here, not the enemy — he still feels it. The answer
                    isn't bravado; it's a first step, then another. His role is not the expert above
                    you but the experienced first-stepper beside you.
                  </p>
                </>
              )}
            </PersonCard>
          </div>
        </section>

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
