/**
 * Webinar « Aborde ta rentrée IA avec Claude » (21 September 2026).
 *
 * The FAQ lives here so the blog post (server seed + French overlay) and the
 * follow-up email render the same questions and answers. Answers are written
 * in the blog's mini-markdown: paragraphs, "- " lists, **bold**, [links](url).
 */

export const WEBINAR_SLUG = "aborde-ta-rentree-ia-avec-claude";
export const WEBINAR_REPLAY_URL = "https://youtu.be/cM5tb5CBfUA";

export type FaqItem = { q: string; a: string };

export const FAQ_FR: FaqItem[] = [
  {
    q: "Combien coûte, en tokens, une tâche comme celles de la démo ?",
    a: `Les tokens sont le « carburant » de l'IA : des morceaux de mots. En français, un mot représente en moyenne un peu plus d'un token. Tout ce que Claude **lit** (votre message, les instructions du projet, les fichiers, les mails qu'il ouvre) compte en **entrée** ; tout ce qu'il **écrit**, y compris sa réflexion, compte en **sortie**.
Pendant le live, nous avons donné un prix approximatif. Voici les tarifs exacts, en dollars par million de tokens (entrée / sortie) :
- **Claude Opus 5 et Opus 4.8** : 5 $ / 25 $ (c'est Opus 4.8 que nous utilisions)
- **Claude Sonnet 5** : 2 $ / 10 $
- **Claude Haiku 4.5** : 1 $ / 5 $
- **Claude Fable 5.1** : 10 $ / 50 $
La sortie coûte cinq fois plus cher, parce que produire du texte demande plus de calcul que le lire.
**Un ordre de grandeur :** classer une quinzaine de mails, c'est environ 30 000 tokens lus et 4 000 écrits, soit 0,15 $ + 0,10 $ ≈ **0,25 $** au tarif Opus. Mais une tâche en plusieurs étapes (chercher, ouvrir, classer, vérifier) relit le contexte à chaque étape : dix étapes peuvent faire monter la note à 1 ou 2 $. Ce sont des estimations ; le chiffre réel dépend du nombre et de la longueur des mails.
Avec un abonnement Pro ou Max, vous ne payez pas au token : les tokens consomment votre quota. La logique reste la même.
**Le contexte, c'est la mémoire de travail de la conversation.** Plus une conversation est longue, plus chaque nouveau message coûte cher, car Claude relit tout ce qui précède. D'où deux réflexes : une nouvelle conversation par tâche, et un projet pour garder le contexte (instructions, fichiers) sans tout recoller.`,
  },
  {
    q: "Même en payant, il y a des limites ? Comment savoir où j'en suis ?",
    a: `Oui. Les abonnements payants ont une **limite par session** (elle se réinitialise au bout de quelques heures) et une **limite hebdomadaire**. C'est exactement ce qui nous est arrivé en direct : la session était épuisée juste avant la partie sur les routines.
Pour suivre votre consommation, ouvrez **Paramètres → Utilisation**. Vous y voyez le pourcentage utilisé de la session et de la semaine, la répartition par produit (discussions, Claude Code, Cowork…) et, si vous les activez, les **crédits d'utilisation** : des crédits achetés qui prennent le relais quand le forfait est atteint, avec un plafond mensuel que vous fixez.
Pour tenir plus longtemps :
- choisissez un modèle plus léger ou un niveau d'effort plus bas pour les tâches simples ;
- ouvrez une nouvelle conversation plutôt que d'en prolonger une très longue ;
- désactivez les connecteurs dont la conversation n'a pas besoin ;
- espacez vos routines : un classement de mails toutes les heures, c'est 24 exécutions par jour.`,
  },
  {
    q: "Opus, Sonnet ou Fable : lequel choisir ?",
    a: `Notre recommandation par défaut : **Opus avec un effort moyen**. C'est un bon équilibre entre qualité et consommation pour le quotidien (aller chercher une information dans les mails, classer, rédiger un brouillon).
- **Fable 5.1**, le modèle le plus puissant, pour les analyses complexes et longues. Il épuise vos crédits beaucoup plus vite.
- **Sonnet 5** pour les tâches bien cadrées, avec un bon prompt et un skill clair : il fait très bien le travail pour moins de la moitié du prix d'Opus.
- **Haiku 4.5** pour les tâches très simples et répétitives.
Le **niveau d'effort** (faible, moyen, élevé, extra, max) règle le temps de réflexion. Commencez bas et montez seulement si le résultat ne suffit pas. Le comparatif officiel des modèles : [docs.claude.com](https://docs.claude.com/en/docs/about-claude/models/overview).`,
  },
  {
    q: "Peut-on connecter Microsoft 365 (Outlook, Excel, SharePoint) ?",
    a: `Oui. Le connecteur **Microsoft 365** donne accès à Outlook, SharePoint, OneDrive et Teams, sur le même principe que Gmail et Google Drive dans la démo.
Dans une entreprise, il faut en général l'**accord de la DSI** : c'est un administrateur Microsoft qui autorise l'application. Beaucoup d'entreprises le bloquent par défaut ; mieux vaut en parler en amont, idéalement dans le cadre d'une charte d'usage de l'IA.
Il existe aussi **Claude pour Excel**, un complément qui s'installe depuis le menu Compléments d'Excel. Vous pouvez lui demander de créer des tableaux, de mettre en forme, ou de **chercher une erreur** dans un classeur de 20 onglets. C'est l'un des usages les plus bluffants au quotidien, notamment sur les fichiers financiers.`,
  },
  {
    q: "Que deviennent mes données ? Où sont-elles stockées, et servent-elles à entraîner l'IA ?",
    a: `Ce que vous envoyez à Claude est traité sur les serveurs d'Anthropic, comme ce que vous envoyez à ChatGPT l'est chez OpenAI. Pendant les échanges, nous avons dit que les prompts servaient « très souvent » à entraîner les modèles ; c'est plus nuancé :
- **Offres professionnelles (Team, Enterprise, API)** : par défaut, vos conversations **ne servent pas** à entraîner les modèles.
- **Offres personnelles (Free, Pro, Max)** : **c'est vous qui choisissez**, dans Paramètres → Confidentialité, si vos conversations peuvent servir à améliorer les modèles.
- **Mode incognito** : la conversation n'est ni conservée dans votre historique, ni ajoutée à la mémoire, ni utilisée pour l'entraînement.
Un connecteur se **révoque à tout moment** (Paramètres → Connecteurs) : Claude perd l'accès immédiatement. Ce qui a déjà été lu reste dans les conversations passées ; supprimez-les si besoin.
**Besoin que les données restent en Europe ?** C'est possible avec Claude via AWS (Bedrock) ou Google Cloud (Vertex AI) dans des régions européennes. C'est une mise en place plus technique, pour les entreprises. **Mistral**, l'acteur français, héberge aussi ses données en Europe.
Dans tous les cas, quelques règles simples : pas de numéros de carte, de mots de passe ni de données de santé ; et, en entreprise, une **charte** qui précise ce qui peut être partagé avec une IA. Détails : [privacy.anthropic.com](https://privacy.anthropic.com).`,
  },
  {
    q: "Puis-je connecter tout le drive partagé d'une association ou d'une entreprise ?",
    a: `Si c'est un environnement **Google** (Gmail, Drive) ou **Microsoft** (SharePoint, OneDrive), oui : c'est exactement ce que nous avons fait dans la démo, avec l'autorisation de la personne qui administre les comptes. Pour un **Nextcloud**, il n'y a pas de connecteur prêt à l'emploi dans la liste par défaut ; il faudrait un connecteur sur mesure (MCP).
Claude n'avale pas un téraoctet d'un coup : il **cherche et ouvre** les fichiers dont il a besoin. En revanche, une analyse qui parcourt des milliers de documents consomme énormément de tokens. Commencez par un dossier précis, ou un projet avec les documents clés.
Pour une organisation, les **offres Team et Enterprise** sont faites pour ça : plusieurs utilisateurs, des limites beaucoup plus élevées, et des données non utilisées pour l'entraînement. Tarifs à jour : [claude.com/pricing](https://claude.com/pricing). Pour de très gros volumes, on peut aussi faire extraire l'information par un modèle qui tourne en local, puis confier l'analyse à Claude : moins cher, mais plus technique à installer.`,
  },
  {
    q: "Instructions, mémoire, CLAUDE.md : qu'est-ce que Claude retient, et comment faire le ménage ?",
    a: `Il y a trois couches, et il est utile de les distinguer :
- **Les instructions du projet** : c'est vous qui les écrivez. Claude les lit avant chaque réponse (qui vous êtes, votre ton, où sont vos bases Notion).
- **Les fichiers de contexte** : c'est vous qui les ajoutez (fiche entreprise, grille tarifaire, export des ventes). Claude ne peut pas les ajouter lui-même : Anthropic considère que c'est à l'humain de choisir ce qu'il met dans son contexte.
- **La mémoire** : c'est Claude qui la construit, au fil des conversations du projet. Vous pouvez la consulter et la modifier depuis le panneau Mémoire du projet.
Anthropic recommande de **faire le ménage régulièrement** : gardez ce qui est toujours vrai, supprimez ce qui est dépassé (un ancien tarif, un client perdu). Une mémoire à jour donne de meilleures réponses. Pour la même raison, gardez vos fichiers de contexte à jour, ou connectez-les à des fichiers en ligne (Drive) qui se mettent à jour tout seuls.
Si vous utilisez **Claude Code** ou **Cowork**, le fichier **CLAUDE.md** joue le rôle des instructions : un fichier texte d'instructions permanentes que vous pouvez relire et nettoyer de la même façon.`,
  },
  {
    q: "Claude était très poli, parfois trop. Comment lui donner la voix de ma marque ?",
    a: `Dans la démo, Claude a proposé 20 % de remise et un renvoi gratuit à un client mécontent : chaleureux, mais trop généreux. Le ton se règle à trois endroits :
- **Dans les instructions du projet** : c'est ce que nous avons fait avec « un ton chaleureux et professionnel, jamais robotique ».
- **Dans le skill** : fixez des limites précises, par exemple « geste commercial de 10 % maximum sans validation », « trois phrases maximum ».
- **Avec les styles** : dans le menu de style, vous pouvez créer un style personnalisé à partir de quelques exemples de vos propres mails.
Pour aller plus loin, créez un skill « voix de marque » qui décrit votre façon de parler, avec des exemples de ce qu'il faut dire et de ce qu'il ne faut pas dire. Poli, décontracté, très direct : c'est vous qui décidez.`,
  },
  {
    q: "Et les erreurs, les « hallucinations » ?",
    a: `Claude se trompe, et il faut s'y attendre : pendant le live, un axe de graphique était raté et un rendez-vous a d'abord été mal placé dans l'agenda. C'est pour cela que nous parlons d'une **nouvelle recrue** : il faut lui donner le contexte, les accès, et **vérifier ce qu'elle fait**.
Les bons réflexes :
- **vérifiez les chiffres à la source** : nous avons contrôlé dans le Google Sheet que Café Belleville Nord avait bien commandé pour 374 € en septembre ;
- demandez des **liens vers les sources** (le lien vers le mail dans chaque fiche Notion) ;
- préférez les **brouillons** aux envois automatiques ;
- laissez les décisions à un humain (une fiche SAV reste « Ouvert » jusqu'à ce que quelqu'un la ferme).
Voyez-le comme un cadeau : si l'IA était parfaite, nous arrêterions de réfléchir. Apprendre à piloter Claude, c'est apprendre à manager, une compétence qui sert bien au-delà de l'IA.`,
  },
  {
    q: "Quelle différence entre un skill et un plugin ? Et comment partager des skills en entreprise ?",
    a: `Un **skill** est une procédure que vous écrivez : un fichier texte qui explique à Claude quand l'utiliser et comment procéder, éventuellement accompagné de fichiers. Un **plugin** est un paquet plus formel, prêt à installer (onglet Plugins de Personnaliser), qui peut regrouper plusieurs skills, des connecteurs et des commandes.
En entreprise, les skills se partagent, souvent sous forme de fichier ZIP. Avec les offres Team et Enterprise, un administrateur peut mettre des skills à disposition de toute l'équipe. Imaginez le skill de votre contrôleur de gestion : quand vous avez une question financière hors de votre spécialité, Claude suit la méthode validée par l'expert. Stockés dans un endroit commun, **vérifiés et maintenus par l'entreprise**, ces skills garantissent la même qualité pour tout le monde.`,
  },
  {
    q: "Si j'oublie comment créer un skill ou une routine, Claude peut-il le faire pour moi ?",
    a: `Pour les **skills**, oui : tapez \`/skill-creator\` et décrivez ce que vous voulez, même vaguement (« fais-moi un skill pour traiter les demandes de devis »). Claude le rédige et vous n'avez plus qu'à cliquer sur « Enregistrer la compétence ». C'est ce que nous avons fait pour le skill de devis.
Pour les **routines**, le plus sûr est de passer par **Tâches planifiées** ; Claude peut en revanche vous rédiger les instructions de la routine, prêtes à coller.
Deux choses restent entre vos mains : **connecter vos applications** (pour des raisons de sécurité) et **ajouter les fichiers de contexte**. Pour le reste, vous pouvez oublier les détails : une fois enregistré dans un skill, Claude s'en souvient pour vous.`,
  },
  {
    q: "Routines : peut-on vraiment tout approuver automatiquement ?",
    a: `Une routine tourne sans vous. Si elle doit attendre votre validation à chaque action, elle reste bloquée jusqu'à ce que vous vous connectiez. D'où l'option d'**approbation automatique**.
Elle est raisonnable quand le **périmètre est clair et sans risque** : classer des mails selon des labels existants, créer des fiches Notion, préparer des **brouillons**. Même en approbation automatique, Claude peut s'arrêter s'il juge une action dangereuse.
Gardez la validation manuelle pour tout ce qui part vers l'extérieur ou ne se rattrape pas : envoi de mails aux clients, paiements, suppressions. Et testez chaque routine avec « Exécuter maintenant » avant de la programmer.`,
  },
  {
    q: "Notion a sa propre IA : pourquoi passer par Claude ?",
    a: `Les deux fonctionnent, et ensemble. L'IA intégrée de Notion est pratique pour travailler **dans une page** (créer une section, reformuler, mettre en forme). Claude connecté à Notion est plus fort quand la tâche **traverse plusieurs outils** : lire un mail dans Gmail, retrouver la commande dans Google Sheets, puis créer la fiche dans Notion. Et le connecteur Notion de Claude fonctionne aussi avec un compte Notion gratuit, comme dans la démo.`,
  },
];

export const FAQ_EN: FaqItem[] = [
  {
    q: "How much does a task like the ones in the demo cost in tokens?",
    a: `Tokens are the "fuel" of AI: pieces of words. Everything Claude **reads** (your message, the project instructions, files, the emails it opens) counts as **input**; everything it **writes**, including its reasoning, counts as **output**.
During the live session we gave a rough figure. Here are the exact prices, in dollars per million tokens (input / output):
- **Claude Opus 5 and Opus 4.8**: $5 / $25 (we were using Opus 4.8)
- **Claude Sonnet 5**: $2 / $10
- **Claude Haiku 4.5**: $1 / $5
- **Claude Fable 5.1**: $10 / $50
Output costs five times more because generating text takes more compute than reading it.
**A ballpark:** sorting about fifteen emails is roughly 30,000 tokens read and 4,000 written, so $0.15 + $0.10 ≈ **$0.25** at Opus prices. A multi-step task (search, open, sort, check) re-reads the context at every step, so ten steps can take it to $1–2. These are estimates; the real figure depends on how many emails there are and how long they are.
On a Pro or Max subscription you don't pay per token: tokens use up your allowance. The logic is the same.
**Context is the conversation's working memory.** The longer a conversation gets, the more each new message costs, because Claude re-reads everything before it. Hence two habits: a new conversation per task, and a project to keep context (instructions, files) without pasting it again.`,
  },
  {
    q: "Are there limits even on a paid plan? How do I see where I am?",
    a: `Yes. Paid plans have a **per-session limit** (it resets after a few hours) and a **weekly limit**. That's exactly what happened live: the session ran out just before the routines section.
To track usage, open **Settings → Usage**. It shows the percentage of your session and week used, the split by product (chats, Claude Code, Cowork…) and, if you turn them on, **usage credits**: purchased credits that take over when your plan runs out, up to a monthly cap you set.
To make it last:
- pick a lighter model or a lower effort level for simple tasks;
- start a new conversation rather than extending a very long one;
- turn off connectors the conversation doesn't need;
- space out your routines: sorting email every hour is 24 runs a day.`,
  },
  {
    q: "Opus, Sonnet or Fable: which should I use?",
    a: `Our default recommendation: **Opus at medium effort**. It balances quality and usage well for everyday work (finding something in your email, sorting, drafting).
- **Fable 5.1**, the most powerful model, for long, complex analysis. It burns through credits much faster.
- **Sonnet 5** for well-defined tasks with a good prompt and a clear skill: it does the job very well at less than half the price of Opus.
- **Haiku 4.5** for very simple, repetitive tasks.
The **effort level** (low, medium, high, extra, max) sets how long Claude thinks. Start low and only go up if the result isn't good enough. Official model comparison: [docs.claude.com](https://docs.claude.com/en/docs/about-claude/models/overview).`,
  },
  {
    q: "Can I connect Microsoft 365 (Outlook, Excel, SharePoint)?",
    a: `Yes. The **Microsoft 365** connector gives access to Outlook, SharePoint, OneDrive and Teams, just as Gmail and Google Drive worked in the demo.
In a company you usually need **IT's approval**: a Microsoft administrator has to authorise the app. Many companies block it by default, so raise it early, ideally as part of an AI usage policy.
There's also **Claude for Excel**, an add-in you install from Excel's Add-ins menu. You can ask it to build tables, format sheets, or **find an error** in a 20-tab workbook. It's one of the most impressive everyday uses, especially on financial files.`,
  },
  {
    q: "What happens to my data? Where is it stored, and is it used to train the AI?",
    a: `What you send Claude is processed on Anthropic's servers, just as what you send ChatGPT is processed by OpenAI. During the Q&A we said prompts are "very often" used for training; it's more nuanced than that:
- **Business plans (Team, Enterprise, API)**: by default, your conversations are **not** used to train models.
- **Personal plans (Free, Pro, Max)**: **you choose**, in Settings → Privacy, whether your conversations can be used to improve models.
- **Incognito mode**: the conversation isn't kept in your history, isn't added to memory and isn't used for training.
A connector can be **revoked at any time** (Settings → Connectors) and Claude loses access immediately. Anything it has already read stays in past conversations; delete those if needed.
**Need data to stay in Europe?** That's possible with Claude through AWS (Bedrock) or Google Cloud (Vertex AI) in European regions. It's a more technical setup, for companies. **Mistral**, the French provider, also hosts data in Europe.
Either way, a few simple rules: no card numbers, passwords or health data; and in a company, a **policy** that says what may be shared with an AI. Details: [privacy.anthropic.com](https://privacy.anthropic.com).`,
  },
  {
    q: "Can I connect an organisation's whole shared drive?",
    a: `If it's a **Google** (Gmail, Drive) or **Microsoft** (SharePoint, OneDrive) environment, yes: that's exactly what we did in the demo, with permission from whoever administers the accounts. For **Nextcloud** there's no ready-made connector in the default list; you'd need a custom (MCP) connector.
Claude doesn't swallow a terabyte at once: it **searches and opens** the files it needs. But an analysis that goes through thousands of documents uses a huge number of tokens. Start with one specific folder, or a project with the key documents.
For organisations, the **Team and Enterprise plans** are built for this: multiple users, much higher limits, and data not used for training. Current prices: [claude.com/pricing](https://claude.com/pricing). For very large volumes you can also have a locally run model extract the information and then hand the analysis to Claude: cheaper, but more technical to set up.`,
  },
  {
    q: "Instructions, memory, CLAUDE.md: what does Claude remember, and how do I clean it up?",
    a: `There are three layers, and it helps to tell them apart:
- **Project instructions**: you write them. Claude reads them before every reply (who you are, your tone, where your Notion databases are).
- **Context files**: you add them (company profile, price list, sales export). Claude can't add them itself: Anthropic considers that choosing what goes into your context is a human's job.
- **Memory**: Claude builds it over the project's conversations. You can view and edit it from the project's Memory panel.
Anthropic recommends **cleaning it up regularly**: keep what's still true and delete what's out of date (an old price, a lost client). Up-to-date memory gives better answers. For the same reason, keep your context files current, or link online files (Drive) that update themselves.
If you use **Claude Code** or **Cowork**, the **CLAUDE.md** file plays the role of instructions: a text file of standing instructions you can review and tidy the same way.`,
  },
  {
    q: "Claude was very polite, sometimes too much. How do I give it my brand's voice?",
    a: `In the demo Claude offered an unhappy customer 20% off and a free replacement: warm, but too generous. You set tone in three places:
- **In the project instructions**: that's what we did with "a warm, professional tone, never robotic".
- **In the skill**: set precise limits, e.g. "commercial gesture of 10% maximum without approval", "three sentences maximum".
- **With styles**: in the style menu you can create a custom style from a few examples of your own emails.
To go further, create a "brand voice" skill that describes how you speak, with examples of what to say and what not to say. Polite, relaxed, very direct: your call.`,
  },
  {
    q: "What about mistakes, the so-called hallucinations?",
    a: `Claude makes mistakes, and you should expect it: during the live session one chart axis was wrong and a meeting was first put in the wrong place in the calendar. That's why we talk about a **new hire**: give it context and access, and **check its work**.
Good habits:
- **check figures at the source**: we confirmed in the Google Sheet that Café Belleville Nord really had ordered €374 in September;
- ask for **links to sources** (the link to the email in each Notion record);
- prefer **drafts** over automatic sending;
- leave decisions to a human (a support ticket stays "Open" until someone closes it).
See it as a gift: if AI were perfect, we'd stop thinking. Learning to steer Claude is learning to manage, a skill that's useful far beyond AI.`,
  },
  {
    q: "What's the difference between a skill and a plugin? And how do companies share skills?",
    a: `A **skill** is a procedure you write: a text file that tells Claude when to use it and how to proceed, optionally with supporting files. A **plugin** is a more formal, ready-to-install package (Plugins tab under Customize) that can bundle several skills, connectors and commands.
In a company, skills get shared, often as a ZIP file. On Team and Enterprise plans an administrator can make skills available to the whole team. Picture your financial controller's skill: when you have a finance question outside your specialty, Claude follows the method the expert approved. Stored in one shared place and **checked and maintained by the company**, these skills give everyone the same quality.`,
  },
  {
    q: "If I forget how to create a skill or a routine, can Claude do it for me?",
    a: `For **skills**, yes: type \`/skill-creator\` and describe what you want, even loosely ("make me a skill for handling quote requests"). Claude writes it and you just click "Save skill". That's how we built the quote skill.
For **routines**, the safest route is **Scheduled tasks**; Claude can, however, write the routine's instructions for you, ready to paste.
Two things stay in your hands: **connecting your apps** (for security reasons) and **adding context files**. For the rest, you can forget the details: once it's saved in a skill, Claude remembers it for you.`,
  },
  {
    q: "Routines: is it safe to approve everything automatically?",
    a: `A routine runs without you. If it has to wait for your approval on every action, it stays stuck until you log in. Hence the **auto-approve** option.
It's reasonable when the **scope is clear and low-risk**: sorting email into existing labels, creating Notion records, preparing **drafts**. Even on auto-approve, Claude may stop if it judges an action dangerous.
Keep manual approval for anything that leaves the building or can't be undone: emails to customers, payments, deletions. And test each routine with "Run now" before scheduling it.`,
  },
  {
    q: "Notion has its own AI: why go through Claude?",
    a: `Both work, and they work together. Notion's built-in AI is handy for work **inside a page** (adding a section, rewording, formatting). Claude connected to Notion is stronger when the task **spans several tools**: reading an email in Gmail, finding the order in Google Sheets, then creating the record in Notion. And Claude's Notion connector also works with a free Notion account, as in the demo.`,
  },
];

/** The FAQ as blog markdown: one "### question" heading per item. */
export function faqToMarkdown(items: FaqItem[]): string {
  return items.map((item) => `### ${item.q}\n${item.a}`).join("\n\n");
}
