import { Layout } from "@/components/layout/Layout";
import { Printer } from "lucide-react";

// --- Coordonnées ------------------------------------------------------------
// Fill these in. Leave a value as an empty string to omit it from the sheet.
// The SIRET line stays off until registration comes through.
const CONTACT = {
  commune: "[commune]",
  region: "Nord du Lot",
  telephone: "[téléphone]",
  email: "daniel@tutto.one",
};
// ---------------------------------------------------------------------------

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-border pt-6 print:pt-4 break-inside-avoid">
      <h2 className="text-[11px] font-sans font-semibold uppercase tracking-[0.14em] text-primary mb-3 print:mb-2">
        {label}
      </h2>
      <div className="font-serif text-[16px] print:text-[10.5pt] leading-relaxed print:leading-snug text-muted-foreground space-y-3 print:space-y-2">
        {children}
      </div>
    </section>
  );
}

/**
 * The capability sheet itself, in French. Shared by /fiche-capacites (where it
 * is a printable one-pager) and the French About page, so the two cannot drift.
 */
export function FicheSheet({ showContact = true }: { showContact?: boolean }) {
  const contactLine = [
    [CONTACT.commune, CONTACT.region].filter(Boolean).join(", "),
    CONTACT.telephone,
    CONTACT.email,
  ].filter(Boolean);

  return (
    <article
      lang="fr"
      className="bg-card border border-border rounded-2xl p-10 md:p-14 print:border-0 print:rounded-none print:p-0 print:bg-transparent"
    >
      <header className="mb-8 print:mb-5">
        <p className="text-[11px] font-sans font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-4 print:mb-3">
          Fiche de capacités
        </p>
        <h1 className="text-4xl print:text-[22pt] font-serif font-bold tracking-tight text-foreground">
          Daniel Forsthofer
        </h1>
        <p className="mt-3 print:mt-2 text-xl print:text-[12pt] font-serif text-foreground leading-snug max-w-xl">
          Je compte et je réduis la charge documentaire des entreprises.
        </p>
        {showContact && (
          <p className="mt-5 print:mt-3 text-sm print:text-[9pt] text-muted-foreground">
            {contactLine.map((part, i) => (
              <span key={part}>
                {i > 0 && <span className="mx-2 text-border">·</span>}
                {part}
              </span>
            ))}
          </p>
        )}
      </header>

      <div className="space-y-6 print:space-y-4">
        <Section label="Ce que je fais">
          <p>
            Les PME produisent et reproduisent les mêmes documents chaque semaine : devis, dossiers
            qualité, certificats fournisseurs, dossiers de financement, comptes rendus
            réglementaires. Personne ne compte ce que cela coûte. Je le compte, je dis ce qui peut
            être allégé, et je construis les systèmes qui l'allègent.
          </p>
        </Section>

        <Section label="Ce que j'ai construit">
          <p>
            J'ai conçu et j'exploite une{" "}
            <strong className="text-foreground font-semibold">
              plateforme d'analyse documentaire pour un cabinet juridique
            </strong>{" "}
            : ingestion de documents hétérogènes, extraction structurée, recherche hybride, et
            réponses systématiquement vérifiées contre le texte source avant d'être affichées.
          </p>
          <p>
            <strong className="text-foreground font-semibold">
              L'ensemble fonctionne sur des modèles locaux, sur site.
            </strong>{" "}
            Aucun document ne quitte le réseau du client — le secret professionnel l'interdit.
          </p>
          <p>
            <strong className="text-foreground font-semibold">
              C'est la même contrainte que celle des industriels d'ici
            </strong>
            , pour d'autres raisons : normes sous licence, données sous contrôle export, exigences
            clients. Je l'ai déjà résolue une fois.
          </p>
        </Section>

        <Section label="Formation">
          <p>
            Je forme des dirigeants et des équipes à l'usage professionnel des outils d'IA : non pas
            une démonstration, mais un travail réel mené en séance, sur leurs propres documents,
            jusqu'à un résultat qu'ils repartent avec.
          </p>
          <p>
            <strong className="text-foreground font-semibold">
              Je transmets la méthode, pas seulement l'outil.
            </strong>{" "}
            Une entreprise que j'accompagne doit pouvoir refaire le travail sans moi.
          </p>
        </Section>

        <Section label="La démonstration">
          <p>
            Je travaille sur{" "}
            <strong className="text-foreground font-semibold">l'Atelier Vallon</strong>, un atelier
            de mécanique de précision{" "}
            <strong className="text-foreground font-semibold">fictif</strong> : douze salariés, ISO
            9001 et EN 9100, environ 300 documents, avec des non-conformités volontairement
            introduites.
          </p>
          <p>
            <strong className="text-foreground font-semibold">
              Je ne fais jamais de démonstration sur les documents d'un client
            </strong>
            , et je ne demande aucun document avant qu'un accord soit signé.
          </p>
        </Section>

        <Section label="Ce que je ne suis pas">
          <ul className="space-y-3 print:space-y-2">
            <li className="flex gap-3">
              <span aria-hidden className="text-primary/50 select-none shrink-0">—</span>
              <span>
                Je ne suis{" "}
                <strong className="text-foreground font-semibold">
                  ni organisme certificateur, ni auditeur certifié
                </strong>
                . Je constate ce que les preuves documentaires établissent ; la décision de
                conformité appartient à l'entreprise et à son certificateur.
              </span>
            </li>
            <li className="flex gap-3">
              <span aria-hidden className="text-primary/50 select-none shrink-0">—</span>
              <span>
                Je ne touche{" "}
                <strong className="text-foreground font-semibold">
                  ni aux documents classifiés, ni aux données sous contrôle export
                </strong>
                .
              </span>
            </li>
            <li className="flex gap-3">
              <span aria-hidden className="text-primary/50 select-none shrink-0">—</span>
              <span>
                Je suis{" "}
                <strong className="text-foreground font-semibold">
                  nouveau sur le marché français
                </strong>
                . Mon français, parlé comme écrit, reste d'un niveau conversationnel simple.{" "}
                <strong className="text-foreground font-semibold">
                  Je m'appuie largement sur l'IA pour mes traductions
                </strong>{" "}
                — c'est précisément le métier que j'exerce. La qualité du travail, elle, ne dépend
                pas de la langue.
              </span>
            </li>
          </ul>
        </Section>
      </div>
    </article>
  );
}

export default function FicheCapacites() {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-6 py-12 print:py-0 print:px-0 print:max-w-none">
        <div className="flex justify-end mb-6 print:hidden">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground border border-border rounded-full hover:bg-muted/50 hover:text-foreground transition-colors"
            data-testid="button-print-fiche"
          >
            <Printer className="w-4 h-4" />
            Imprimer / PDF
          </button>
        </div>

        <FicheSheet />
      </div>
    </Layout>
  );
}
