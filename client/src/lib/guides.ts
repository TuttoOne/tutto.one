// The step-by-step guides (static pages in client/public/<folder>/), listed on
// Thinking next to the posts. They keep their own layout, so each entry links
// straight to the page. The guides themselves are in English only.
// Dates in "Nov 6, 2026" form so they sort with the posts.

type L = { en: string; fr: string };
export type Guide = { href: string; date: string; title: L; excerpt: L };

export const GUIDES: Guide[] = [
  {
    href: "/claude-privacy",
    date: "Nov 6, 2026",
    title: { en: "Stop Claude training on your chats", fr: "Empêcher Claude de s'entraîner sur vos conversations" },
    excerpt: {
      en: "One switch in Settings decides whether Anthropic can train its models on your chats and coding sessions. Where it is, what it covers and what it doesn't. About 2 minutes.",
      fr: "Un seul réglage décide si Anthropic peut entraîner ses modèles sur vos conversations et vos sessions de code. Où le trouver, ce qu'il couvre et ce qu'il ne couvre pas. Environ 2 minutes.",
    },
  },
  {
    href: "/workspaces",
    date: "Nov 4, 2026",
    title: { en: "Share folders with VS Code workspaces", fr: "Partager des dossiers avec les espaces de travail VS Code" },
    excerpt: {
      en: "Keep the folders you use again and again in one place and link them into each project, so you stop copying the same files into every folder. About 5 minutes.",
      fr: "Gardez les dossiers que vous réutilisez au même endroit et liez-les à chaque projet, au lieu de copier les mêmes fichiers partout. Environ 5 minutes.",
    },
  },
  {
    href: "/design-system",
    date: "Nov 4, 2026",
    title: { en: "Brief Claude on your brand with a design system", fr: "Donner votre charte graphique à Claude" },
    excerpt: {
      en: "Create a design system in Claude from the app home and follow the wizard, so everything it makes looks like yours. Plus when to build it from your code instead. About 15 minutes.",
      fr: "Créez un design system dans Claude depuis l'accueil de l'application, pour que tout ce qu'il produit ait votre identité. Et quand le construire plutôt à partir de votre code. Environ 15 minutes.",
    },
  },
  {
    href: "/skill-file",
    date: "Nov 4, 2026",
    title: { en: "Writing your skill file", fr: "Écrire votre fichier de compétences" },
    excerpt: {
      en: "How to get what a senior person knows out of their head and into a plain skill file that Claude reads every time.",
      fr: "Comment sortir ce que sait une personne expérimentée de sa tête pour le mettre dans un simple fichier que Claude lit à chaque fois.",
    },
  },
  {
    href: "/evals",
    date: "Nov 4, 2026",
    title: { en: "Evals: proving the output is good", fr: "Évaluations : prouver que le résultat est bon" },
    excerpt: {
      en: "How to check that AI output is right, with a rubric you grade by hand, a script that grades it for you and a second model as judge.",
      fr: "Comment vérifier qu'un résultat d'IA est juste : une grille notée à la main, un script qui note pour vous et un second modèle comme juge.",
    },
  },
  {
    href: "/toolkit",
    date: "Nov 3, 2026",
    title: { en: "The Claude toolkit", fr: "La boîte à outils Claude" },
    excerpt: {
      en: "The VS Code extensions, command-line tools and Python libraries that let Claude open a PDF, fill in a spreadsheet or read a scanned page, and which ones you need.",
      fr: "Les extensions VS Code, outils en ligne de commande et bibliothèques Python qui permettent à Claude d'ouvrir un PDF, de remplir un tableur ou de lire une page scannée, et lesquels installer.",
    },
  },
  {
    href: "/vscode-setup",
    date: "Oct 28, 2026",
    title: { en: "VS Code with Claude and Mistral", fr: "VS Code avec Claude et Mistral" },
    excerpt: {
      en: "From a fresh install to your first task with two AI agents. Six steps, each with the screen you should see. About 30 minutes.",
      fr: "De l'installation à votre première tâche avec deux agents IA. Six étapes, chacune avec l'écran que vous devez voir. Environ 30 minutes.",
    },
  },
  {
    href: "/ai-files",
    date: "Oct 23, 2026",
    title: { en: "Use our tool files with your own AI", fr: "Utiliser nos fichiers outils avec votre propre IA" },
    excerpt: {
      en: "Download a file, drop it into your folder, start a chat and let your AI guide you: Claude, ChatGPT, Mistral, Gemini or any other. About 5 minutes.",
      fr: "Téléchargez un fichier, déposez-le dans votre dossier, lancez une conversation et laissez votre IA vous guider : Claude, ChatGPT, Mistral, Gemini ou une autre. Environ 5 minutes.",
    },
  },
];
