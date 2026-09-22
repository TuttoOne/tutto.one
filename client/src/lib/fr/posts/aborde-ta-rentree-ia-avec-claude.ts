import type { PostFr } from "./index";
import { FAQ_FR, faqToMarkdown } from "@shared/webinar-rentree-ia";

export const post: PostFr = {
  introCard: {
    tagline: "Tutto × Altiplane · Webinaire du 21 septembre 2026",
    headline: "Aborde ta rentrée IA avec Claude",
    sub: "Connecteurs, projets, skills et routines : le compte rendu complet, les prompts utilisés et les réponses à vos questions.",
  },
  content: `Le lundi 21 septembre, Franz Kubach (Altiplane) et Daniel Forsthofer (Tutto) ont animé en direct un webinaire pour passer de « je fais des choses avec l'IA » à « l'IA fait aussi des choses pour moi ». Pas de cours magistral : une démonstration en conditions réelles, avec ses réussites, un ou deux ratés (formateurs), et beaucoup de questions. Merci à toutes celles et ceux qui étaient là.

Cet article reprend tout ce qui a été montré, étape par étape, avec les prompts et les skills à copier, puis une FAQ qui complète les réponses données pendant le live.

[VIDEO:https://youtu.be/cM5tb5CBfUA]

## Les quatre piliers

À la fin de la session, l'objectif était que tu saches :
1. **connecter tes applications** à Claude (la technologie MCP, pour Model Context Protocol) ;
2. utiliser un **projet** pour piloter ton entreprise ou tes projets personnels depuis un seul endroit ;
3. définir des **skills** (des compétences) pour ne pas refaire la même demande des centaines de fois ;
4. automatiser le tout avec des **routines**, qui travaillent pendant que tu dors ou que tu prends un café.

Deux mots de cadrage avant de commencer. D'abord, **l'IA ne répond jamais deux fois de la même manière** : on ne peut pas prédire exactement ce qu'elle va produire, et elle va sans doute se tromper, même pendant un live. Ensuite, travailler avec Claude, c'est comme accueillir **une nouvelle recrue** : elle ne connaît ni tes habitudes, ni tes dossiers, ni ta façon de travailler. Il faut lui expliquer le contexte, lui donner les accès nécessaires, et vérifier ce qu'elle fait. Aujourd'hui, on pose les premières bases ; tirer pleinement parti de l'IA se construit sur plusieurs semaines.

## Le cas pratique : Torréfaction Belleville

![Le fil rouge du webinaire : Torréfaction Belleville, un torréfacteur artisanal parisien géré à deux.](/blog/rentree-ia/01-cas-pratique.webp)

Pour rendre tout cela concret, Franz a joué le rôle du gérant de **Torréfaction Belleville**, une petite entreprise artisanale parisienne (fictive) :
- **une équipe de deux** : le gérant (ventes, clients, fournisseurs) et Karim, le torréfacteur ;
- **un rythme fixe** : réunion de 30 minutes le lundi, torréfaction le mardi et le jeudi de 8 h à 10 h ;
- **un suivi commercial manuel** : 9 clients B2B, des clients particuliers, et les ventes saisies à la main dans un Google Sheet ;
- **pas de SAV structuré** : tout arrive dans Gmail (factures, devis, réclamations, événements).

L'objectif : structurer tout ça avec Claude, et commencer à centraliser l'information dans Notion (clients, devis, SAV, comptes rendus, factures fournisseurs).

Ce n'est qu'un exemple. Remplace le café par ton activité (un cabinet, une association, un commerce, un projet perso) : la méthode est exactement la même.

## Pilier 1 : connecter tes applications

Pourquoi connecter Gmail à Claude ? Pour qu'il puisse **lire** tes mails, ton agenda et tes fichiers, **agir** (classer, créer un événement, préparer un brouillon) et **analyser**. Et tout cela reste **révocable à tout moment**.

![Personnaliser → Connecteurs : Google Drive, Gmail, Google Calendar, Microsoft 365, Notion…](/blog/rentree-ia/02-connecteurs.webp)

Dans le menu de gauche, va dans **Personnaliser → Connecteurs**. Google apparaît en général parmi les plus utilisés. Connecte **Google Drive**, **Gmail**, **Google Calendar**, puis **Notion**. À chaque fois, Google t'explique ce que Claude pourra voir et faire ; il ne fera rien que tu ne lui demandes pas, et tu peux couper l'accès quand tu veux.

### Trier l'urgent

Premier test, dans une simple conversation :

> Va voir mes mails et dis-moi lesquels demandent une action rapide de ma part. Je suis le gérant de Torréfaction Belleville, je n'ai pas de temps à perdre : j'ai besoin de savoir où agir en priorité.

Claude trouve l'outil Gmail, lit la boîte et fait remonter l'essentiel : deux réclamations clients (des grains éventés pour Julien Vasseur, du moulu au lieu de grains entiers pour Sophie Renaud), une facture de maintenance qui arrive à échéance dans quatre jours, et un fournisseur, Africa Green Coffee, qui propose de présenter sa nouvelle récolte le jeudi 24 à 9 h 30. Tu peux déplier les étapes pour voir ce qu'il fait : pas besoin de tout comprendre, mais c'est utile quand un résultat surprend.

### Classer avec des labels Gmail

Les labels ne sont même pas une fonction d'IA, mais ils sont parfaits pour qu'une IA classe vite et bien. Dans Gmail, crée tes labels (le **+** à côté de « Libellés ») et donne-leur une couleur (les trois petits points → couleur du libellé). Pour Belleville : Clients & SAV, Commercial B2B, Équipe & Production, Factures & Compta, Fournisseurs, Presse & Événements, Rapports & Ventes.

> Classe mes mails selon les labels existants : Clients & SAV, Commercial B2B, Équipe & Production, Factures & Compta, Fournisseurs, Presse & Événements, Rapports & Ventes. N'invente pas de nouveaux labels.

![La boîte Gmail classée par Claude, chaque mail sous son label de couleur.](/blog/rentree-ia/03-labels-gmail.webp)

Claude vérifie d'abord que les labels existent, puis les applique. Il en a oublié quelques-uns : il a suffi de lui demander de classer aussi ceux qui restaient. Quand le **périmètre est clair** (des labels donnés, rien à inventer), tu peux l'autoriser à agir sans validation, parce qu'il ne sortira pas de ce cadre.

### Un copilote pour l'agenda

Le rendez-vous d'Africa Green Coffee tombe pendant la torréfaction du jeudi, et Karim a prévenu par mail qu'il serait absent jeudi et vendredi.

> Africa Green Coffee propose un appel jeudi 24 à 9 h 30. Vérifie mon agenda et mes mails récents, dis-moi si je suis vraiment disponible et, sinon, propose une meilleure option.

Claude croise l'agenda et les mails, repère le conflit et l'absence de Karim, et propose le mercredi 23 à 9 h 30.

> Oui, prépare-moi le brouillon de réponse et bloque le créneau dans l'agenda.

![L'événement créé par Claude dans Google Calendar, avec tout le contexte du rendez-vous.](/blog/rentree-ia/04-agenda.webp)

Deux bonnes pratiques ici. **Le brouillon** : Claude n'envoie rien sans ton accord, tu restes maître à bord. Et **le contexte dans l'agenda** : Claude remplit les événements bien mieux que nous (objet, contact, notes), ce qui est précieux quand tu les consultes depuis ton téléphone. Pour finir :

> Peux-tu actualiser mon calendrier avec les informations de mes mails ? Vérifie les événements existants, notamment celui qu'on vient de créer, évite les doublons, et mets à jour les événements concernés plutôt que de les recréer.

Il a déplacé la torréfaction, ajouté l'absence de Karim et les échéances de factures. Il a fait une petite erreur sur un rendez-vous, l'a remarquée et corrigée.

## Pilier 2 : le projet, pour ne plus répéter le contexte

Tout ce qu'on vient de faire vivait dans **une seule conversation**. Ouvre-en une nouvelle, et Claude a tout oublié : il faut tout lui réexpliquer. Quand on est deux dans une entreprise, on n'a pas ce temps-là.

![C'est quoi un projet dans Claude ? Un espace qui centralise les consignes et les documents de référence.](/blog/rentree-ia/05-projet.webp)

Un **projet** (qui existe aussi dans ChatGPT et Mistral), c'est une boîte qui regroupe toutes tes conversations sur un même thème, avec :
- **un contexte permanent** : les fichiers et les consignes sont ajoutés une fois ;
- **pas de redite** : tu n'as plus besoin de réexpliquer ;
- **un projet par dossier** : une entreprise, une équipe, un projet perso ;
- **un historique conservé**.

On parle beaucoup de se construire un « deuxième cerveau » avec l'IA : avant même de créer des agents, il faut comprendre comment fonctionne un projet.

### Créer le projet et ses instructions

Nouveau projet, avec cette description :

> Je gère Torréfaction Belleville, un torréfacteur artisanal parisien. J'utilise ce projet pour centraliser mes commandes, mes clients B2B et mes échanges avec eux, afin d'obtenir des réponses et des analyses cohérentes avec mon activité, sans avoir à répéter le contexte à chaque fois.

Les **instructions** sont ce que Claude lit avant chaque réponse :

![Les instructions du projet : l'identité, le ton, et où trouver chaque base Notion (liens masqués).](/blog/rentree-ia/06-instructions.webp)

> Tu es l'assistant de Torréfaction Belleville, un torréfacteur artisanal parisien. Réponds toujours en français, avec un ton chaleureux et professionnel, jamais robotique.
> Mon CRM clients se trouve dans Notion : [lien]. Les informations de factures sont à placer ici : [lien] ; le lien vers le mail suffit, pas besoin de charger le PDF dans Notion. La partie SAV se trouve ici : [lien]. Les comptes rendus commerciaux se trouvent ici : [lien].
> Les demandes de devis sont à recenser dans le tableau Notion « Devis » : [lien]. Consulte le statut de chaque fiche pour distinguer les devis envoyés des simples demandes.

Si tes applications sont connectées, Claude trouverait ces bases tout seul ; mais les lui indiquer fait gagner du temps et évite les erreurs.

### Ajouter le contexte

Dans le panneau **Contexte**, glisse les documents de référence : une **fiche de présentation** de l'entreprise (identité, ton de marque, équipe, lieux, rythme hebdomadaire, clients, fournisseurs, structure des factures et des devis, statuts utilisés dans Notion, règles SAV : « ouvert, en cours, résolu », et un geste commercial adapté en cas de défaut produit), la **grille tarifaire**, et l'**export des ventes** directement depuis Google Drive (le **+**, puis Drive).

Premier réflexe à chaque nouveau projet :

> Prends connaissance de la fiche de présentation, de la grille tarifaire et de l'export des ventes avant qu'on commence.

Ça améliore nettement la qualité des réponses. En parallèle, Claude construit sa **mémoire** du projet au fil des conversations ; tu peux la consulter à tout moment.

### Traiter les factures dans Notion

Tu peux lancer une autre conversation dans le projet pendant que la première tourne :

> Traite les factures des mails dans Notion, même sans pièce jointe. Utilise les statuts prévus : Prélèvement automatique, À payer, Payé, En retard. Vérifie aussi les échéances des factures existantes et signale les retards, sans confondre prélèvement prévu et paiement confirmé.

![La base Notion « Factures fournisseurs » remplie par Claude : numéro, date, fournisseur, montant, statut et lien vers le mail.](/blog/rentree-ia/07-factures-notion.webp)

Claude a lu les factures dans le corps des mails, ouvert les PDF, et rempli la base : numéro, date, fournisseur, montant, échéance, statut. Il a bien compris que la facture d'électricité était en prélèvement automatique. Conseil : **mets un lien vers le mail** plutôt que d'importer le PDF, c'est plus fiable et un clic suffit pour retrouver l'original. Beaucoup de PME ont une adresse dédiée à la facturation ; un seul prompt suffit pour transformer ce flux en base organisée.

### Analyser les ventes

> À partir de nos commandes de septembre, quels sont nos 3 meilleurs clients B2B, c'est-à-dire ceux qui ont généré le plus de chiffre d'affaires, classés par ordre décroissant ? Indique le montant pour chacun, et conseille-moi des actions pour les fidéliser.

Claude a ouvert le Google Sheet, filtré sur septembre, produit un petit graphique et des actions de fidélisation. Un axe du graphique était raté, ce qui ne nous était pas arrivé lors des tests : l'IA ne répond jamais deux fois pareil. Le chiffre, lui, était juste : Café Belleville Nord, 374 € en septembre, vérifié dans le fichier.

### Répondre à une demande de tarif

Le Comptoir de Pauline, client depuis six mois, veut passer de 10 à 15 kg par mois et demande un tarif dégressif.

> Le Comptoir de Pauline veut passer de 10 à 15 kg par mois à partir d'octobre et demande un tarif dégressif. Regarde la grille tarifaire et son historique d'achats, propose-moi un prix cohérent, et prépare un brouillon de réponse.

L'intérêt n'est pas que Claude invente un prix : il s'appuie sur **la grille existante, la fiche entreprise et l'historique réel** du client, puis rédige la réponse. C'est le contexte du projet qui rend la proposition crédible.

## Pilier 3 : les skills, pour la méthode

Le projet donne le contexte. Pour une tâche précise (traiter une réclamation, répondre à un devis), on veut que Claude sache **exactement** quoi faire, sans surcharger les instructions.

![C'est quoi un skill ? Une procédure réutilisable qui guide Claude dans une tâche métier.](/blog/rentree-ia/08-skill.webp)

Un **skill** est une procédure réutilisable : un fichier texte qui explique à Claude **quand** l'utiliser et **comment** procéder, étape par étape, avec le résultat attendu. Il peut être accompagné de fichiers ou pointer vers des outils (« va voir l'export des ventes, puis l'agenda »). Service client, comptabilité, commerce : ça sert partout.

Dans **Personnaliser → Compétences → Ajouter**, trois options : **importer** un skill existant (souvent un fichier ZIP, téléchargé ou partagé par ton entreprise), le **créer avec Claude** en conversation, ou l'**écrire à la main**.

### Skill n° 1, écrit à la main : traiter une réclamation SAV

![La création manuelle du skill « traiter-reclamation-sav ».](/blog/rentree-ia/09-creer-competence.webp)

> **Nom :** traiter-reclamation-sav
> **Description :** Traite une réclamation ou une demande de changement de commande à partir d'un mail client, pour Torréfaction Belleville (retrouve la commande, ouvre une fiche SAV dans Notion, prépare une réponse empathique en brouillon Gmail).
> **Instructions :** Quand un mail de réclamation ou de changement de commande arrive, identifie d'abord le type de demande, puis suis ces trois étapes dans l'ordre. Vérifie les informations disponibles et prépare une réponse sans proposer automatiquement de compensation ni confirmer une faisabilité non vérifiée. Confirme ce qui a été fait à chaque étape.
> **1. Retrouver la commande.** Cherche le numéro de commande cité dans le mail dans le Google Sheet « Export Shopify – Ventes 2026 ». Note le produit, la quantité et le montant exacts.
> **2. Créer la fiche SAV.** Dans la base Notion « SAV / Réclamations », vérifie si la demande est déjà suivie et actualise la fiche existante sans doublon. Sinon, crée une entrée avec Sujet, Client, N° commande, Statut = Ouvert, et la date du mail.
> **3. Préparer la réponse.** Rédige un brouillon de réponse dans Gmail : empathique et professionnel, qui reconnaît le problème sans le minimiser. Pour une réclamation, propose un geste commercial adapté à la gravité (renvoi gratuit pour un défaut simple, renvoi et remise pour un problème plus sérieux). Ne jamais envoyer directement, toujours laisser en brouillon. Ajoute un lien cliquable vers ce brouillon dans la fiche SAV Notion, sous le libellé « Brouillon de réponse ». Si le lien direct n'est pas disponible, signale-le sans inventer d'URL.

Pour l'utiliser, tape **/** et le nom du skill :

> /traiter-reclamation-sav Traite tout ce qui est sous le label Clients & SAV : réclamations et changements de commande.

![Les fiches créées dans la base Notion « SAV / Réclamations », statut Ouvert.](/blog/rentree-ia/10-sav-notion.webp)

Claude a identifié les deux réclamations (et ignoré le troisième mail, une simple question de disponibilité), créé les fiches avec le bon numéro de commande, et préparé deux brouillons. Le statut reste **Ouvert** : c'est à un humain de le fermer une fois le problème résolu. Et le ton ? Très chaleureux… et un peu trop généreux (20 % sur la prochaine commande). C'est typiquement ce qu'on corrige dans le skill : les skills sont **versionnables**, tu peux les modifier à la main ou demander à Claude de les améliorer.

### Skill n° 2, créé par Claude : traiter une demande de devis

Camille Roy, office manager d'une agence de 40 personnes dans le 11e, cherche un fournisseur de café en grain pour deux machines automatiques. Cette fois, on laisse Claude écrire le skill avec **/skill-creator** :

> /skill-creator Crée-moi un skill nommé « traiter-demande-de-devis ». Il doit fonctionner par étapes : vérifier les ventes du client dans le Google Sheet des ventes ; s'il y a déjà eu des ventes, analyser leur date, les produits, les quantités et les prix ; proposer un prix cohérent ; vérifier si une fiche client existe dans le CRM Notion, la créer si elle n'existe pas, sinon utiliser la fiche existante sans créer de doublon ; recenser la demande dans le tableau Notion « Devis » ; préparer un brouillon de réponse.

Claude rédige le skill et propose de l'enregistrer : un clic sur « Enregistrer la compétence » et il est utilisable tout de suite, dans la même conversation.

## Pilier 4 : les routines, pour automatiser

Une **routine** (ou tâche planifiée) est une tâche qui se lance toute seule à la fréquence choisie : chaque matin pour les mails, chaque semaine pour un bilan des ventes. On la crée depuis le projet, dans **Programmé**, ou depuis **Tâches planifiées** : un nom, des instructions, une fréquence, et un niveau d'autorisation.

![Créer une tâche planifiée : nom, instructions, fréquence et autorisations.](/blog/rentree-ia/13-routine.webp)

Les quatre routines préparées pour Belleville :
- **Classement des mails**, toutes les heures : « Classe mes mails dans la boîte de réception selon les labels existants de mon compte Gmail : Clients & SAV, Commercial B2B, Fournisseurs, Factures & Compta, Rapports & Ventes, Presse & Événements. »
- **Traiter les factures**, chaque jour à 9 h : la même consigne que pour les factures ci-dessus.
- **Analyse des commandes de la semaine précédente**, le lundi à 8 h : produit et quantité totale, client B2B le plus actif, synthèse ajoutée dans Notion, et un mail de résumé envoyé à l'adresse de l'entreprise.
- **Demandes de devis**, le lundi à 10 h : « Repère les nouvelles demandes de devis dans mes mails et utilise le skill traiter-demande-de-devis. »

**Autorisations.** Si chaque action doit être validée à la main, la routine attend que tu te connectes. Pour classer des mails ou préparer des brouillons, l'approbation automatique est raisonnable : le périmètre est clair et rien ne part chez le client. Même dans ce mode, Claude peut refuser une action qu'il juge dangereuse. Chaque exécution crée une conversation (marquée « programmée ») que tu peux relire, et le bouton **Exécuter maintenant** permet de tester avant la première échéance. Comme la routine vit dans le projet, elle profite de tout son contexte.

### Et le live s'est arrêté… faute de tokens

C'est là que la session a atteint sa limite d'utilisation : après deux skills, des recherches et des dizaines d'actions, plus assez de crédits, et l'achat de crédits supplémentaires ne s'est pas débloqué à temps. Frustrant, mais instructif : c'est exactement ce qui arrivera un jour dans ton quotidien. On le voit dans **Paramètres → Utilisation**, et il faut alors choisir : acheter des crédits, passer à un modèle plus léger, ou attendre la réinitialisation.

![Paramètres → Utilisation : consommation de la session et de la semaine, crédits d'utilisation et plafond mensuel.](/blog/rentree-ia/12-utilisation.webp)

## Le débrief, en clair

![Le débrief : connecter, utiliser les projets, définir des skills, créer des routines.](/blog/rentree-ia/14-debrief.webp)

- **Les connecteurs donnent les outils** : aller chercher une information dans les mails, la rapprocher de l'agenda, préparer une action sans tout recopier.
- **Le projet donne le contexte** : qui tu es, tes tarifs, où sont tes bases. Tu ne réexpliques plus à chaque conversation.
- **Les skills donnent la méthode** : tu décris les étapes une fois, Claude les suit, tu testes et tu améliores.
- **Les routines donnent le rendez-vous** : une fois qu'une tâche fonctionne, tu la programmes, et tu vérifies le résultat avec ton café.

## Par où commencer

C'est le principe d'Altiplane : **prendre de la hauteur sur ses opérations avant de les automatiser**. Choisis **une seule tâche** que tu connais bien, que tu refais sans cesse, un peu fastidieuse, qu'on n'a pas envie de faire mais qu'on est obligé de faire. Donne le contexte, teste sur un cas concret, vérifie le résultat. Puis améliore le skill, change, recommence, et élargis progressivement. Ne cherche pas à tout automatiser d'un coup : c'est là que les erreurs arrivent et qu'on perd le contrôle.

Si un modèle te fait hésiter, regarde ce comparatif présenté pendant la session :

![La gamme Claude, du plus léger au plus capable : Haiku 4.5, Sonnet 5, Opus 5, Fable 5.1, avec leur prix par million de tokens.](/blog/rentree-ia/11-modeles.webp)

## Questions fréquentes

${faqToMarkdown(FAQ_FR)}

## Qui sommes-nous

**Altiplane**, avec Franz Kubach, aide les PME françaises à prendre de la hauteur sur leurs opérations avant de les automatiser : audit digitalisation et IA, automatisations sur mesure, et ateliers pour donner aux équipes des bases concrètes, sans jargon. [altiplane.fr](https://altiplane.fr)

**Tutto**, avec Daniel Forsthofer, accompagne les entreprises qui adoptent l'IA, des entrepreneurs et fondateurs jusqu'aux organisations de 250 personnes. Seize ans de transformation digitale, des déploiements d'applications jusqu'à 2,5 millions d'utilisateurs, et une approche simple : écouter vos cas d'usage et les traduire en coaching sur mesure, pour que vos équipes conçoivent et pilotent elles-mêmes leurs systèmes IA. [tutto.one](https://tutto.one)

## Et maintenant ?

D'autres sessions arrivent, plus courtes et plus ciblées, pour aller plus loin sur les sujets qui vous ont le plus intéressés : les tokens et les coûts, la mémoire, la confidentialité, les skills partagés en entreprise. Et si tu préfères être accompagné sur tes propres outils et ton propre cas, nous proposons aussi des sessions individuelles ou en petit groupe : [prends rendez-vous avec Altiplane](https://altiplane.fr), [écris à Tutto](/contact), ou consulte [le calendrier des prochaines sessions](/calendar).`,
};
