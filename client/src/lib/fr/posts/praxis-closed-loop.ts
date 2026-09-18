import type { PostFr } from "./index";

export const post: PostFr = {
  content: `Il y a quelques mois, j'ai lu un article de [Lenny's Newsletter](https://www.lennysnewsletter.com/p/how-to-build-ai-product-sense) qui a clarifié quelque chose autour de quoi je tournais. Il est signé Tal Raviv et Aman Khan, et porte sur ce qu'ils appellent le « sens produit appliqué à l'IA » : la capacité d'anticiper correctement ce qui aura un réel impact pour les utilisateurs et ce qui est effectivement réalisable avec l'IA. Leur thèse : cela ne s'acquiert pas en lisant des articles explicatifs, mais en mettant les mains dans des agents de développement et en faisant du vrai travail avec eux.

La raison, avancent-ils, est que les outils grand public comme ChatGPT sont opaques. Vous écrivez, quelque chose revient. Vous ignorez pourquoi cela revient ainsi, ce que faisait le modèle, ou à quel endroit il a déraillé. Les agents de développement comme Claude Code sont différents : vous pouvez lire le raisonnement, observer les appels d'outils, voir la fenêtre de contexte se remplir. Vous butez sur les mêmes murs que les ingénieurs. Et c'est en butant dessus que vous commencez réellement à comprendre le fonctionnement.

En lisant cela, je me suis dit : c'est exactement le problème que Praxis a été conçu pour résoudre. Et je ne l'avais pas énoncé assez clairement.

## La plupart des formations à l'IA sont difficiles au mauvais endroit

L'offre de formation à l'IA est aujourd'hui abondante. Elle est le plus souvent soit trop abstraite, soit trop « tutorialisée ». La version abstraite enseigne des concepts sans jamais vous laisser toucher à quoi que ce soit : vous repartez en sachant ce qu'est une fenêtre de contexte, sans l'avoir sentie se remplir sur une tâche réelle. La version tutoriel vous guide dans un exercice préparé où tout se passe bien : vous repartez avec une capture d'écran, mais sans compétence.

La plateforme d'apprentissage d'Anthropic, [anthropic.skilljar.com](https://anthropic.skilljar.com/), est réellement bonne. Les cours sont bien faits. Ils couvrent le sujet correctement — des bases de ce qu'est Claude et de son usage, jusqu'à Claude Code, l'API, le Model Context Protocol, les agents et sous-agents, avec des parcours spécialisés pour les enseignants, les petites entreprises et les associations. Le contenu est juste et la théorie solide.

Ce qu'elle ne peut pas faire, c'est s'asseoir à côté de vous.

## Ce que Praxis ajoute

Praxis s'appuie sur le programme d'Anthropic. La [bibliothèque de cours](https://tutto.one/courses) reprend les supports de dix-sept de ces cours — des premiers pas avec l'IA jusqu'aux sous-agents et aux séances spécialisées — adaptés à des séances accompagnées, et chacun existe désormais en français comme en anglais. Chaque séance part de la théorie posée par le cours Anthropic, puis fait une chose de plus : vous construisez quelque chose de réel avec, pendant la séance, sous mon regard.

La différence que cela produit est exactement celle que décrivent Tal et Aman. Quand vous construisez en direct — quand l'outil fait quelque chose d'inattendu, que le contexte sature, ou que la première version ne fait pas tout à fait ce qu'il fallait — vous vivez ces moments et nous les traversons ensemble. C'est là que la compréhension se forme réellement. Non pas en lisant, mais en heurtant le problème et en trouvant la sortie avec quelqu'un qui l'a déjà fait.

Les séances couvrent le même terrain que les cours Anthropic, mais dans un ordre différent : le résultat avant la théorie. Vous voyez ce que fait l'outil avant que je n'explique pourquoi il fonctionne ainsi. La plupart des gens constatent que la théorie porte deux fois plus une fois le comportement observé.

## La boucle complète

Voici le point qui me semble réellement utile : Anthropic propose une certification. Une fois le programme suivi, vous disposez de la théorie issue du cursus, de l'expérience pratique acquise en séance, et de la possibilité de passer les tests d'Anthropic pour être certifié.

C'est la boucle complète. Théorie, pratique, et un titre qui a du sens parce qu'il vient de ceux qui ont conçu le modèle.

La [bibliothèque de cours Praxis](https://tutto.one/courses) couvre dix-sept parcours :

- **Premiers pas avec l'IA** et **Pour commencer** — la rampe d'accès, pour ceux qui n'ont encore rien utilisé de tout cela
- **Claude 101** et **Claude Code 101** — les fondations : le fonctionnement des outils et ce à quoi ils servent réellement
- **Claude Code en pratique** et le parcours **API Anthropic** — la couche pratique : connecter des outils, construire pour de vrai
- **Model Context Protocol** — comment l'IA se relie aux logiciels que vous utilisez déjà
- **Compétences d'agent** et **sous-agents** — comment construire des systèmes qui agissent, et pas seulement qui répondent
- **Capacités et limites de l'IA** — ce que les modèles savent faire, ce qu'ils ne savent pas faire, et comment distinguer les deux
- Les parcours de **maîtrise de l'IA** pour les enseignants et les petites entreprises — les mêmes fondations appliquées à des contextes précis
- Les séances spécialisées : **où Claude garde ce qu'il sait**, **ce qu'est une évaluation**, et **mesurer l'extraction** — la matière plus avancée, pour ceux qui construisent déjà

À chacun correspond une séance Praxis : une heure guidée et pratique, où vous travaillez la matière sur un cas issu de votre propre activité plutôt que sur un exercice générique.

## À qui cela s'adresse

Si vous avez déjà commencé à explorer les outils d'IA et que vous voulez aller plus loin — plus vite, avec moins de confusion, et avec un chemin clair vers la certification — voici la couche pratique que le cursus Anthropic ne fournit pas à lui seul.

Si vous êtes enseignant, consultant, ou si vous souhaitez enseigner cette matière vous-même, le [parcours formateur Praxis](/become-a-trainer) repose sur les mêmes fondations.

L'article de Lenny's Newsletter mérite d'être lu pour comprendre l'argument en faveur de la pratique. En bref : on ne peut pas se forger une intuition d'un outil de l'extérieur. Il faut s'en servir, le casser, et comprendre ce qui vient de se passer. C'est à cela que sert Praxis.

Informations et réservation sur [/praxis](/praxis) et [/praxis-programme](/praxis-programme).`,
};
