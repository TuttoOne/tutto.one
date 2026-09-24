import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { usePreferences } from "@/lib/preferences";
import { copy, useT, SITE_TITLE } from "@/lib/i18n";
/* The booking label is the home page's, so every page asks the same way. */
import { landing } from "@/lib/landing-copy";

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
                Tutto forme les équipes à bien utiliser l'IA, puis construit ce qui mérite de
                l'être. Pas de présentations, pas de méthodologies : nous travaillons sur vos vraies
                tâches jusqu'à ce qu'elles cessent de se répéter.
              </p>
              <p>
                La plupart des entreprises que nous rencontrons ont le même problème. Les équipes
                utilisent déjà ChatGPT ou Claude, et cela ne leur fait rien gagner : demander,
                corriger, redemander, en brûlant des tokens au passage. Personne n'a fixé les
                règles, défini un bon résultat, ni décidé quoi déléguer.
              </p>
              <p>
                Nous le faisons donc dans cet ordre. <strong className="text-foreground font-semibold">Les règles</strong> : ce qui entre, et ce
                qui ne sort jamais de l'entreprise. <strong className="text-foreground font-semibold">Un indicateur par tâche</strong>, pour juger
                le travail sur un standard. <strong className="text-foreground font-semibold">Ce qu'on délègue</strong>. Puis la construction :
                outils, compétences, automatisation et agents — d'une passerelle MCP vers SharePoint
                à une plateforme documentaire qui passe en revue 150 000 documents couverts par le
                secret professionnel sans qu'un seul octet ne quitte le bâtiment.
              </p>

              <h2 className="text-2xl font-serif font-bold text-foreground pt-6">
                Ce que nous croyons
              </h2>
              <p>
                La plupart des problèmes d'IA ne sont pas des problèmes d'IA. Ce sont des problèmes
                de management. Personne ne confierait une tâche à un stagiaire sans consigne, sans
                standard et sans validation — et c'est exactement ainsi que la plupart des équipes
                confient le travail à l'IA.
              </p>
              <p>
                Les entreprises qui s'en sortiront le mieux ne seront pas celles qui auront acheté
                l'IA les premières, mais celles qui auront fixé les règles, écrit ce qu'est un bon
                résultat, et su quoi déléguer. C'est un travail ingrat. C'est aussi là que le temps
                se récupère.
              </p>

              <h2 className="text-2xl font-serif font-bold text-foreground pt-6">
                Notre façon de travailler
              </h2>
              <p>
                Nous sommes volontairement de taille réduite : vous travaillez avec les personnes
                qui font le travail, pas avec une équipe junior briefée de seconde main. La
                formation est un programme à prix fixe, avec une garantie ; le développement est
                cadré en un seul appel. Tout se fait sur votre propre travail, et se termine par
                quelque chose qui tourne.
              </p>
              <p>
                Tout commence par un appel gratuit de 15 minutes. Venez avec la tâche que vous
                répétez sans cesse. Nous vous dirons honnêtement si nous pouvons aider.
              </p>
            </>
          ) : (
            <>
              <p>
                Tutto trains teams to use AI properly, then builds what's worth building. No slide
                decks, no frameworks: we work on your actual jobs until they stop repeating.
              </p>
              <p>
                Most firms we meet have the same problem. Staff already use ChatGPT or Claude, and
                it saves them nothing: ask, fix, ask again, burning tokens on the way. Nobody set
                the rules, defined what good looks like, or decided what to hand over.
              </p>
              <p>
                So we do it in that order. <strong className="text-foreground font-semibold">The rules</strong>: what goes in, and what never
                leaves the building. <strong className="text-foreground font-semibold">A KPI for each job</strong>, so output is judged against a
                standard. <strong className="text-foreground font-semibold">What to hand over</strong>. Then the build: tools, skills, automation
                and agents — from an MCP bridge into SharePoint to a document platform that reviews
                150,000 privileged files without a single byte leaving the building.
              </p>

              <h2 className="text-2xl font-serif font-bold text-foreground pt-6">What we believe</h2>
              <p>
                Most AI problems aren't AI problems. They're management problems. Nobody would hand
                an intern a job without a brief, a standard and a sign-off — and that's exactly how
                most teams hand work to AI.
              </p>
              <p>
                The firms that come out ahead won't be the ones who bought AI first. They'll be the
                ones who set the rules, wrote down what good looks like, and knew what to hand
                over. That work is unglamorous. It's also where the time comes back.
              </p>

              <h2 className="text-2xl font-serif font-bold text-foreground pt-6">How we work</h2>
              <p>
                We're small by design: you work with the people doing the work, not a junior team
                briefed secondhand. Training is a fixed programme with a guarantee; build work is
                scoped in one call. Everything runs on your own work, and ends with something that
                runs.
              </p>
              <p>
                It starts with a free 15-minute call. Bring the job you keep repeating. We'll tell
                you honestly whether we can help.
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
              {t(landing.introCall)}
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
