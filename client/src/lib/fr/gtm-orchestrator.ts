import type { FrDict } from "../page-fr";

/** French for the GTM Orchestrator page, keyed on the English string. */
export const GTM_FR: FrDict = {
  "AI-Powered Sales Outreach Engine":
    "Moteur de prospection commerciale assisté par IA",
  "The Problem": "Le problème",
  Capabilities: "Fonctionnalités",
  "What it does": "Ce que fait le système",
  Metrics: "Chiffres",
  "By the numbers": "En chiffres",
  Architecture: "Architecture",
  "Privacy and data flow": "Confidentialité et circulation des données",
  Differentiators: "Points distinctifs",
  "What makes it different": "Ce qui le distingue",
  Technology: "Technologie",
  Stack: "Socle technique",
  "Built by Humanity³": "Réalisé par Humanity³",
  "A division of Tutto Products and Services":
    "Une division de Tutto Products and Services",

  "Prospects researched & profiled": "Prospects étudiés et profilés",
  "Countries covered (NL, SE, FI, DK, NO, Baltics)":
    "Pays couverts (NL, SE, FI, DK, NO, pays baltes)",
  "Personalised emails drafted": "Courriels personnalisés rédigés",
  "Emails sent through the pipeline": "Courriels envoyés par la chaîne",
  "Active multi-step campaign enrolments":
    "Inscriptions actives à des campagnes multi-étapes",
  "Deep-research dossiers generated": "Dossiers de recherche approfondie produits",
  "Accounts under licence management": "Comptes sous gestion de licence",
  "Custom integrations built (HubSpot, Apollo, Licence portal)":
    "Intégrations sur mesure réalisées (HubSpot, Apollo, portail de licences)",
  "Lines of code — full-stack Python + React":
    "Lignes de code — Python et React, de bout en bout",

  "Researches every prospect automatically":
    "Étudie automatiquement chaque prospect",
  "A research engine profiles each company and contact — what they do, their tech stack, competitive replacement signals, country-specific buying culture — and writes a structured dossier with a personalisation hook. 45 deep-research reports generated; 6,675 prospects profiled across 9 countries.":
    "Un moteur de recherche profile chaque entreprise et chaque contact — activité, socle technique, signaux de remplacement concurrentiel, culture d'achat propre au pays — et rédige un dossier structuré assorti d'une accroche personnalisée. 45 rapports de recherche approfondie produits ; 6 675 prospects profilés dans 9 pays.",
  "Writes in the sender's voice, not AI voice":
    "Écrit avec la voix de l'expéditeur, pas celle d'une IA",
  "A multi-stage writing pipeline drafts each message, then runs it through automated editorial gates — mechanics, fact-checking, voice-match, and an 'AI-tell' detector that strips the giveaways that get cold email deleted. Anything that fails is held back rather than sent.":
    "Une chaîne de rédaction en plusieurs étapes produit chaque message, puis le soumet à des contrôles éditoriaux automatisés : forme, vérification des faits, correspondance de ton, et un détecteur de « marqueurs d'IA » qui supprime les signes qui font supprimer un courriel de prospection. Tout ce qui échoue est retenu plutôt qu'envoyé.",
  "Sends safely and on schedule": "Envoie en toute sûreté, au bon moment",
  "A sequence scheduler enrols prospects into multi-step campaigns with a send-claim architecture — idempotency keys and fail-closed guards so nothing double-sends or loops. Every send is logged and auditable. 670 emails drafted, 482 sent, across 11 campaign types.":
    "Un planificateur de séquences inscrit les prospects dans des campagnes multi-étapes selon une architecture de réservation d'envoi : clés d'idempotence et garde-fous à sécurité positive, pour qu'aucun message ne parte deux fois ni ne boucle. Chaque envoi est journalisé et auditable. 670 courriels rédigés, 482 envoyés, sur 11 types de campagnes.",
  "Connects without API access": "Se connecte sans accès API",
  "Reverse-engineered session-replay integrations for HubSpot CRM, Apollo.io, and a licence portal where no developer API was available. Live CRM, enrichment and licensing data surfaces directly into the workflow. Website-visitor signals (790 companies tracked) feed warm leads in automatically.":
    "Des intégrations par rejeu de session, obtenues par rétro-ingénierie, pour le CRM HubSpot, Apollo.io et un portail de licences, là où aucune API destinée aux développeurs n'existait. Les données de CRM, d'enrichissement et de licences remontent directement dans le flux de travail. Les signaux de visite du site (790 entreprises suivies) alimentent automatiquement les pistes tièdes.",
  "Keeps the pipeline warm on its own":
    "Entretient le pipeline de lui-même",
  "Daily automations graduate new prospects into campaigns, draft follow-ups for deals that go quiet, and send a morning briefing — so accounts keep moving without manual chasing. Live opportunities at SSAB, Eidsiva, GleSYS, Vektus and others sourced through the system.":
    "Des automatisations quotidiennes font passer les nouveaux prospects en campagne, rédigent les relances des affaires qui s'endorment et envoient un point matinal — de sorte que les comptes avancent sans relance manuelle. Des opportunités en cours chez SSAB, Eidsiva, GleSYS, Vektus et d'autres ont été trouvées par ce biais.",

  "Local-only automation": "Automatisation strictement locale",
  "Pulling firmographics, enriching contacts, reconciling licences, and writing the results back to the CRM all run as deterministic processes on the device. No model is involved and nothing leaves the hardware.":
    "La récupération des données d'entreprise, l'enrichissement des contacts, le rapprochement des licences et l'écriture des résultats dans le CRM s'exécutent comme des traitements déterministes sur la machine. Aucun modèle n'intervient et rien ne quitte le matériel.",
  "Local-model generation": "Génération par modèle local",
  "Open-weight models running on the DGX Spark do the bulk of the drafting, research and editorial work. Prospect data is processed on-device and never transmitted.":
    "Des modèles à poids ouverts exécutés sur le DGX Spark assurent l'essentiel de la rédaction, de la recherche et du travail éditorial. Les données des prospects sont traitées sur la machine et jamais transmises.",
  "Controlled frontier escalation": "Recours encadré à un modèle de pointe",
  "When a task genuinely needs frontier reasoning, Claude (Opus) is called across a single, deliberate boundary — and only the minimum, abstracted context crosses it. Customer-identifying detail is held back on the device.":
    "Lorsqu'une tâche exige réellement un raisonnement de pointe, Claude (Opus) est appelé au travers d'une frontière unique et délibérée — et seul le contexte minimal, rendu abstrait, la franchit. Les éléments identifiant les clients restent sur la machine.",

  "Privacy by architecture, not policy":
    "La confidentialité par l'architecture, non par une politique",
  "Generation, enrichment, CRM and licence operations run on a single device under direct control. The frontier model is an opt-in escalation across a controlled boundary, not the engine the system depends on.":
    "La génération, l'enrichissement, les opérations de CRM et de licences s'exécutent sur une seule machine sous contrôle direct. Le modèle de pointe est un recours facultatif au travers d'une frontière maîtrisée, et non le moteur dont dépend le système.",
  "Frontier where it counts, local everywhere else":
    "Le modèle de pointe là où il compte, le local partout ailleurs",
  "Open-weight models handle volume and routine reasoning on-device; Opus is reserved for the hardest judgement calls. Cost and exposure both scale with how rarely the boundary is crossed.":
    "Les modèles à poids ouverts traitent le volume et le raisonnement courant sur la machine ; Opus est réservé aux arbitrages les plus difficiles. Le coût comme l'exposition diminuent à mesure que la frontière est franchie plus rarement.",
  "One egress chokepoint": "Un point de sortie unique",
  "A single LLM client mediates every model call. The routing rule — local by default, frontier only when required, sensitive data never raw — is enforced in one place and is auditable.":
    "Un client LLM unique arbitre chaque appel de modèle. La règle d'aiguillage — local par défaut, modèle de pointe seulement si nécessaire, données sensibles jamais brutes — est appliquée en un seul endroit et reste auditable.",

  Hardware: "Matériel",
  "AI Models": "Modèles d'IA",
  Orchestration: "Orchestration",
  Backend: "Back-end",
  Integrations: "Intégrations",
  Security: "Sécurité",
  Access: "Accès",

  "NVIDIA DGX Spark — GB10 Superchip, 128GB unified memory, NVMe storage. Runs entirely on-device.":
    "NVIDIA DGX Spark — superpuce GB10, 128 Go de mémoire unifiée, stockage NVMe. Fonctionne intégralement sur la machine.",
  "Open-weight models locally for drafting, research, and editorial gates. Claude (Opus) reached headlessly only when frontier reasoning is required.":
    "Des modèles à poids ouverts en local pour la rédaction, la recherche et les contrôles éditoriaux. Claude (Opus) n'est sollicité, sans interface, que lorsqu'un raisonnement de pointe est nécessaire.",
  "Claude running headlessly as the orchestrator — routes each step to a local model or the frontier model through a single LLM client.":
    "Claude, exécuté sans interface, joue le rôle de chef d'orchestre : il aiguille chaque étape vers un modèle local ou vers le modèle de pointe, au travers d'un client LLM unique.",
  "Python (FastAPI) services, a sequence scheduler with send-claim/idempotency architecture, and a React dashboard.":
    "Des services Python (FastAPI), un planificateur de séquences à architecture de réservation d'envoi et d'idempotence, et un tableau de bord React.",
  "Reverse-engineered session-replay bridges to HubSpot CRM, Apollo.io where no developer API exists.":
    "Des passerelles par rejeu de session, obtenues par rétro-ingénierie, vers le CRM HubSpot et Apollo.io, là où aucune API destinée aux développeurs n'existe.",
  "Hardened Linux, TOTP-gated administrative access, least-privilege read-only roles, and full audit logging of sends and model egress.":
    "Linux durci, accès d'administration protégé par TOTP, rôles en lecture seule au moindre privilège, et journalisation complète des envois et des sorties de modèle.",
  "Tailscale peer-to-peer VPN — secure remote access without port forwarding.":
    "VPN pair-à-pair Tailscale — accès distant sécurisé sans redirection de ports.",

  "A custom system designed and built to run B2B prospecting end-to-end. Researches prospects, writes personalised emails in the sender's voice, schedules and sends safely, and keeps every account moving — with a human reviewing, not retyping.":
    "Un système sur mesure, conçu et construit pour mener la prospection B2B de bout en bout. Il étudie les prospects, rédige des courriels personnalisés dans la voix de l'expéditeur, planifie et envoie en toute sûreté, et fait avancer chaque compte — l'humain relisant plutôt que ressaisissant.",
  "Personalised outreach at scale is impossible by hand. Generic templates get ignored.":
    "La prospection personnalisée à grande échelle est impossible à la main. Les modèles génériques, eux, sont ignorés.",
  "Running outreach across the Nordics, Baltics and Netherlands — thousands of prospects, dozens of live accounts, and a CRM that does not research, write, or follow up on its own. Done manually, true personalisation does not scale. Done with templates, response rates collapse. This system eliminates that trade-off.":
    "Mener une prospection dans les pays nordiques, les pays baltes et aux Pays-Bas : des milliers de prospects, des dizaines de comptes actifs, et un CRM qui ne cherche pas, n'écrit pas et ne relance pas de lui-même. À la main, la vraie personnalisation ne passe pas à l'échelle. Avec des modèles types, les taux de réponse s'effondrent. Ce système supprime ce compromis.",
  "Figures pulled live from the system's database. Conversion and reply rates are deliberately omitted — not yet reliably tracked. The honest proof point: sourced live deals including SSAB, Eidsiva and GleSYS.":
    "Chiffres extraits en direct de la base du système. Les taux de conversion et de réponse sont volontairement omis : ils ne sont pas encore mesurés de façon fiable. La preuve honnête tient aux affaires réelles trouvées par ce biais, notamment SSAB, Eidsiva et GleSYS.",
  "The system runs on an NVIDIA DGX Spark — not on rented cloud infrastructure. Prospect records, CRM data, and licensing information live on the device and stay there. There are three data paths, separated by design.":
    "Le système tourne sur un NVIDIA DGX Spark, et non sur une infrastructure cloud louée. Les fiches prospects, les données du CRM et les informations de licence résident sur la machine et y restent. Trois chemins de données coexistent, séparés par conception.",
  "The orchestration layer is Claude running headlessly, directing the local models and reserving the frontier model for the few steps that actually require it. Every call out of the device passes through one auditable chokepoint, so escalation is the exception, not the default.":
    "La couche d'orchestration est Claude exécuté sans interface : il pilote les modèles locaux et réserve le modèle de pointe aux rares étapes qui l'exigent réellement. Chaque appel sortant de la machine passe par un point de contrôle unique et auditable, si bien que l'escalade reste l'exception et non la règle.",
  "The system is a specific answer to a specific problem. The underlying principle applies broadly: most sales and GTM functions can be restructured so that the sensitive work stays on your hardware, the AI is directed rather than trusted, and the human in the loop reviews decisions instead of making them one at a time.":
    "Ce système est une réponse précise à un problème précis. Le principe sous-jacent vaut largement : la plupart des fonctions commerciales peuvent être réorganisées pour que le travail sensible reste sur votre matériel, que l'IA soit dirigée plutôt que crue sur parole, et que l'humain dans la boucle relise les décisions au lieu de les prendre une par une.",
};
