import type { FrDict } from "../page-fr";

/**
 * French for the three recorded runs on /usecase, keyed on the English string
 * as it appears in `lib/usecase-runs.ts`.
 *
 * The runs are generated: the recorder writes the English, and a rebuild can
 * add or reword a line. Keying on the sentence means a new line falls back to
 * the English rather than rendering blank, which is the same bargain the other
 * long-form pages make.
 *
 * **Figures are left exactly as the run printed them** — "62,400", "£20,246,618,087",
 * "1.46%". The page's claim is that these are the real lines from a real run, so
 * re-punctuating a number into French convention would be the one edit that
 * makes the claim untrue. Only the words around them are translated.
 */
export const USECASE_FR: FrDict = {
  /* ---- Run 1: the regulatory return ------------------------------------- */

  "Regulatory return": "Déclaration réglementaire",
  "Banking and insurance": "Banque et assurance",
  "Ashcombe Mutual, a building society": "Ashcombe Mutual, une société de crédit immobilier",
  "The quarterly return nobody can check by hand":
    "La déclaration trimestrielle que personne ne peut vérifier à la main",
  "Sixty-two thousand rows arrive from the core system every quarter, and some of them are wrong. Amounts held as text. Branch codes that are not on the master list. Dates that are not dates. Eight rules decide what can be reported, and somebody has to be able to defend every figure in it.":
    "Soixante-deux mille lignes arrivent du système central chaque trimestre, et certaines sont fausses. Des montants stockés en texte. Des codes d'agence absents du référentiel. Des dates qui n'en sont pas. Huit règles décident de ce qui peut être déclaré, et quelqu'un doit pouvoir défendre chaque chiffre.",
  "Nine hundred and nine problems, found before a single figure was published. A hundred and thirty-three records could not be trusted and were left out, each one named. And seventeen exposures crossed the large-exposure threshold, so they went to a person. The system does not make that call.":
    "Neuf cent neuf anomalies, trouvées avant qu'un seul chiffre ne soit publié. Cent trente-trois enregistrements n'étaient pas fiables et ont été écartés, chacun nommément. Et dix-sept expositions ont franchi le seuil des grands risques : elles sont donc remontées à une personne. Le système ne tranche pas cela.",

  "Loading source data": "Chargement des données source",
  "exposure_extract_raw.xlsx (3 MB)": "exposure_extract_raw.xlsx (3 Mo)",
  "62,400 records loaded": "62,400 enregistrements chargés",
  "11 columns": "11 colonnes",
  "Loading the branch master": "Chargement du référentiel des agences",
  "18 branches in master list": "18 agences dans le référentiel",
  "Applying the reporting rules": "Application des règles de déclaration",
  "8 rules applied to every record": "8 règles appliquées à chaque enregistrement",
  "909 issues identified (1.46% of records)":
    "909 anomalies identifiées (1.46% des enregistrements)",
  "759 repaired and reported": "759 corrigés et déclarés",
  "133 excluded from reported figures": "133 exclus des chiffres déclarés",
  "17 referred to a person for a decision": "17 remontés à une personne pour décision",
  "ground truth: 909 issues planted, matches":
    "vérité terrain : 909 anomalies implantées, concordance",
  "Calculating the return": "Calcul de la déclaration",
  "4 regions and 6 products": "4 régions et 6 produits",
  "Total exposure £20,246,618,087": "Exposition totale £20,246,618,087",
  "Risk-weighted £16,001,104,374 (79.0% of gross)":
    "Pondérée du risque £16,001,104,374 (79.0% du brut)",
  "Building the Excel return pack": "Construction du classeur Excel de déclaration",
  "Regulatory_Return_Pack.xlsx (18 KB) - 7 sheets":
    "Regulatory_Return_Pack.xlsx (18 Ko) — 7 feuilles",
  "Reading the figures back out of the workbook": "Relecture des chiffres depuis le classeur",
  "Read 'Return Summary' - tiles and position": "Lecture de « Return Summary » — vignettes et position",
  "Read 'Regional Summary' - 4 regions": "Lecture de « Regional Summary » — 4 régions",
  "Read 'Product Summary' - 6 products": "Lecture de « Product Summary » — 6 produits",
  "Read 'Exposure Trend' - 12 periods": "Lecture de « Exposure Trend » — 12 périodes",
  "return_values.json written - every board figure comes from here":
    "return_values.json écrit — chaque chiffre du conseil vient d'ici",
  "Building the board pack": "Construction du dossier pour le conseil",
  "Board_Exposure_Report.pptx (49 KB) - 5 slides":
    "Board_Exposure_Report.pptx (49 Ko) — 5 diapositives",

  "Records reported": "Enregistrements déclarés",
  "62,267 of 62,400": "62,267 sur 62,400",
  "Issues identified": "Anomalies identifiées",
  "Gross exposure": "Exposition brute",
  "Referred to a person": "Remontés à une personne",

  /* ---- Run 2: application screening -------------------------------------- */

  "Application screening": "Tri des candidatures",
  "Recruitment and HR": "Recrutement et RH",
  "Marlowe & Finch, an agency hiring for six roles":
    "Marlowe & Finch, un cabinet qui recrute sur six postes",
  "Twelve hundred applications, and a reason for every no":
    "Mille deux cents candidatures, et un motif pour chaque refus",
  "Twelve hundred applications came in over three months, through five channels, for six jobs, and no two are written the same way. Seven rules do the screening, and they were written down before a single application arrived. That ordering is the whole point.":
    "Mille deux cents candidatures sont arrivées en trois mois, par cinq canaux, pour six postes, et il n'y en a pas deux rédigées pareil. Sept règles font le tri, et elles ont été écrites avant qu'une seule candidature n'arrive. Cet ordre est tout l'enjeu.",
  "A hundred and forty-one applications did not go forward, and every one of them carries the rule that stopped it. If a candidate rings up in six weeks there is an answer, and it is the same answer for everybody. Nineteen asked above the approved band: not rejected, referred to a person.":
    "Cent quarante et une candidatures n'ont pas été retenues, et chacune porte la règle qui l'a arrêtée. Si un candidat rappelle dans six semaines, il y a une réponse, et c'est la même pour tout le monde. Dix-neuf demandaient au-dessus de la fourchette validée : non pas refusées, mais remontées à une personne.",

  "Loading applications": "Chargement des candidatures",
  "applications_raw.xlsx (82 KB)": "applications_raw.xlsx (82 Ko)",
  "1,240 applications received in the window":
    "1,240 candidatures reçues sur la période",
  "Loading the role specs": "Chargement des fiches de poste",
  "6 roles being hired for": "6 postes à pourvoir",
  "18 alternative spellings mapped": "18 orthographes alternatives rapprochées",
  "Applying the screening rules": "Application des règles de tri",
  "7 rules applied to every application": "7 règles appliquées à chaque candidature",
  "385 issues identified (31.0% of applications)":
    "385 anomalies identifiées (31.0% des candidatures)",
  "225 tidied and kept in": "225 nettoyées et conservées",
  "141 not progressed, each with a reason on record":
    "141 non retenues, chacune avec un motif consigné",
  "19 referred to a person": "19 remontées à une personne",
  "ground truth: 385 conditions planted, matches":
    "vérité terrain : 385 conditions implantées, concordance",
  "Scoring and ranking": "Notation et classement",
  "1,099 applications scored out of 100": "1,099 candidatures notées sur 100",
  "top 6 per role shortlisted, 36 people in total":
    "6 meilleurs par poste retenus, 36 personnes au total",
  "Building the Excel shortlist pack": "Construction du classeur Excel de présélection",
  "Shortlist_Pack.xlsx (19 KB) - 6 sheets": "Shortlist_Pack.xlsx (19 Ko) — 6 feuilles",
  "Read 'Screening Summary' - tiles and totals":
    "Lecture de « Screening Summary » — vignettes et totaux",
  "Read 'Role Summary' - 6 roles": "Lecture de « Role Summary » — 6 postes",
  "shortlist_values.json written - every slide figure comes from here":
    "shortlist_values.json écrit — chaque chiffre des diapositives vient d'ici",
  "Building the hiring manager pack": "Construction du dossier pour le manager",
  "Hiring_Manager_Pack.pptx (41 KB) - 4 slides":
    "Hiring_Manager_Pack.pptx (41 Ko) — 4 diapositives",

  Applications: "Candidatures",
  "Not progressed": "Non retenues",
  Shortlisted: "Présélectionnés",

  /* ---- Run 3: campaign artwork ------------------------------------------- */

  "Campaign artwork": "Déclinaisons de campagne",
  "Agencies and studios": "Agences et studios",
  "Fennel & Fig, a spring range": "Fennel & Fig, une collection de printemps",
  "One brief, fifty-nine sizes, five channels":
    "Un brief, cinquante-neuf formats, cinq canaux",
  "One campaign has to ship in fifty-nine sizes across five channels. Every retailer sent their spec differently and half of them spell the channel another way. Seven rules carry the studio's standards, the ones that used to live in one person's head and get applied differently at eleven at night.":
    "Une campagne doit sortir en cinquante-neuf formats sur cinq canaux. Chaque distributeur a envoyé son cahier des charges à sa façon, et la moitié orthographie le canal autrement. Sept règles portent les standards du studio — ceux qui vivaient dans la tête d'une seule personne et s'appliquaient autrement à onze heures du soir.",
  "Seven formats were not built, and that is the useful part. One frame was so wide the product would have been cropped out of it. Two asked for type below the size anyone can read. Three headlines went to a copywriter, because that is a writing job, not a resizing job.":
    "Sept formats n'ont pas été produits, et c'est là le plus utile. Un cadre était si large que le produit en aurait été recadré. Deux demandaient un corps de texte en dessous du lisible. Trois accroches sont parties chez un rédacteur, parce que c'est un travail d'écriture, pas de redimensionnement.",

  "Loading the format brief": "Chargement du brief de formats",
  "format_brief_raw.xlsx (8 KB)": "format_brief_raw.xlsx (8 Ko)",
  "59 formats briefed": "59 formats briefés",
  "Loading the brand standards": "Chargement des standards de marque",
  "Fennel & Fig, Spring Range 2026": "Fennel & Fig, collection printemps 2026",
  "minimum type 14px, safe area 40px, headline limit 34 characters":
    "corps minimum 14px, zone de sécurité 40px, accroche limitée à 34 caractères",
  "5 channels, 13 spellings mapped": "5 canaux, 13 orthographes rapprochées",
  "Applying the build rules": "Application des règles de production",
  "7 rules applied to every format": "7 règles appliquées à chaque format",
  "23 issues identified": "23 anomalies identifiées",
  "13 specs corrected and built": "13 spécifications corrigées et produites",
  "7 held back, not built blind": "7 mises de côté, non produites à l'aveugle",
  "3 sent to a copywriter": "3 envoyées à un rédacteur",
  "ground truth: 23 conditions planted, matches":
    "vérité terrain : 23 conditions implantées, concordance",
  "Rendering the assets": "Rendu des visuels",
  "52 assets written to outputs/assets/": "52 visuels écrits dans outputs/assets/",
  "5 channels, 64.8 megapixels rendered": "5 canaux, 64.8 mégapixels rendus",
  "contact_sheet.png (591 KB)": "contact_sheet.png (591 Ko)",
  "Building the Excel register": "Construction du registre Excel",
  "Format_Register.xlsx (16 KB) - 6 sheets": "Format_Register.xlsx (16 Ko) — 6 feuilles",
  "Read 'Build Summary' - tiles and totals":
    "Lecture de « Build Summary » — vignettes et totaux",
  "Read 'Channel Summary' - 5 channels": "Lecture de « Channel Summary » — 5 canaux",
  "format_values.json written - every slide figure comes from here":
    "format_values.json écrit — chaque chiffre des diapositives vient d'ici",
  "Building the studio pack": "Construction du dossier studio",
  "Studio_Handover_Pack.pptx (40 KB) - 4 slides":
    "Studio_Handover_Pack.pptx (40 Ko) — 4 diapositives",

  "Formats briefed": "Formats briefés",
  "Assets built": "Visuels produits",
  "Held back": "Mis de côté",
  "With a copywriter": "Chez un rédacteur",

  /* ---- The download list ------------------------------------------------- */

  "Excel workbook": "Classeur Excel",
  "PowerPoint deck": "Présentation PowerPoint",
  Image: "Image",
};
