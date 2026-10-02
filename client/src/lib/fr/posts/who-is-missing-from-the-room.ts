import type { PostFr } from "./index";

export const post: PostFr = {
  content: `Un samedi, 18 h. Une femme de 52 ans, en bonne santé, arrive aux urgences avec une grosse fatigue, des nausées et une douleur entre les omoplates. Le logiciel d'aide à la décision calcule son risque cardiovasculaire. 12 %, faible. Le médecin pense à l'estomac, prescrit un antiacide et la renvoie chez elle. Six heures plus tard, elle fait un infarctus.

C'est ainsi que Céline Chantry-Daron a ouvert son intervention à Toulouse ce matin. Elle est directrice scientifique dans la MedTech, et elle nous a dit tout de suite que l'histoire est inventée mais qu'elle pourrait arriver aujourd'hui. Près d'une femme sur deux de moins de 60 ans victime d'un infarctus ne ressent pas les symptômes que nous connaissons tous par les films, la douleur dans la poitrine qui descend dans le bras gauche. Ce sont les symptômes observés chez les hommes, et ce sont ceux que les dossiers médicaux décrivent le mieux.

## Rien n'était cassé

Voici ce que je veux garder de son intervention. Le score faible, c'était le système qui fonctionnait. L'IA n'a ni intention ni préjugé. Elle fait ce pour quoi elle est conçue : travailler sur les données que nous lui donnons.

Elle a montré par où le manque entre, et c'est bien avant l'algorithme. Dans le monde réel, les symptômes féminins ont été moins étudiés. Les femmes ont donc été diagnostiquées plus tard ou différemment. C'est ce que montrent les dossiers. Ces dossiers deviennent les labels à partir desquels un modèle apprend, ce que les data scientists appellent la vérité terrain. Ensuite quelqu'un choisit un seuil unique, réglé sur l'ensemble de la population. Puis un chiffre apparaît sur un écran, et il fait autorité parce qu'il a été calculé.

Elle appelle cela un bug produit. Le code est correct. Le produit a été construit sur des données qui laissent des gens de côté.

Deux chiffres de ses diapositives me sont restés. Une étude de 2025 a soumis 10 000 prompts cliniques à GPT-4o, tous tirés de vrais cas patients. Dans 22 % des cas, le diagnostic était moins précis pour les femmes. Et dans 93 % des pathologies étudiées, les femmes étaient sous-représentées dans les données d'entraînement.

## On le retrouve partout

La médecine éclaire vivement le sujet parce que le coût, c'est une personne. Mais sa diapositive suivante s'intitulait « Et ce n'est pas un cas isolé ».

Amazon, de 2015 à 2018 : un outil de tri de CV entraîné sur dix ans de candidatures majoritairement masculines pénalisait les femmes. Les modèles de détection du cancer de la peau entraînés sur peaux claires sont moins performants sur peaux foncées. La reconnaissance faciale se trompait pour 0,8 % des hommes à peau claire et pour 34,7 % des femmes à peau foncée (l'étude Gender Shades au MIT, 2018).

Et les personnes qui construisent ces systèmes ressemblent beaucoup aux données. 89 % des chercheurs en IA sont des hommes. On ne teste pas un cas qu'on n'a jamais imaginé.

Les deux corrections rapides que l'on propose ne tiennent pas non plus. Retirez la colonne genre : le code postal, la profession, les revenus et l'historique médical la portent toujours, et vous ne pouvez plus du tout mesurer l'écart. Corrigez les données : vous ne savez toujours pas si cela a marché tant que vous ne regardez que la moyenne. Un modèle peut sembler excellent dans l'ensemble et se tromper chaque fois pour le même groupe de personnes.

## La même chose se passe dans votre entreprise

C'est là que le sujet me touche de près. Nous construisons tous, maintenant. Des seconds cerveaux, des scripts qui évaluent nos données, de petites applications pour une seule tâche, dans nos entreprises et dans nos vies personnelles.

Dans les équipes avec lesquelles je travaille, cela commence en général par quelques personnes. Quelques personnes sont formées, quelques personnes s'en servent et ce sont les mêmes qui fournissent les fichiers, les notes et les exemples sur lesquels tout le reste est construit. Ce qui entre dans le second cerveau de l'entreprise, c'est leur vision de son fonctionnement.

Alors, qu'en est-il de toutes les personnes qui ne participent pas ? Celle qui répond au téléphone et sait pourquoi les clients partent. Celle qui, à l'atelier, sait quelle étape du processus personne ne suit. Si elles n'y sont pas, leur point de vue est laissé de côté. Le résultat probable est celui que Céline a décrit : une image de l'entreprise qui la représente mal, et des erreurs qui paraissent justes parce qu'une machine les a produites.

Personne ne décide de faire cela. Cela arrive parce que l'outil travaille sur ce qu'on lui donne. C'est donc à nous de veiller à ce qu'aucun point de vue ne soit laissé hors de ce que nous construisons, de la même façon que des biais ont déjà été relevés dans les modèles.

## Que faire

Nous encourageons autant d'inclusion, de discussion et d'exploration que possible, d'une manière qui soit sûre pour l'entreprise comme pour la personne.

D'abord, apprendre. Apprendre, c'est aussi définir ce qu'est un usage acceptable pour vous, puis l'affiner, l'écrire et vérifier régulièrement que la définition tient toujours.

Ensuite, fixez des objectifs, écrivez ce qu'est un bon travail et vérifiez que ce que vous avez construit fonctionne sans perturber les systèmes déjà en place. Cette dernière vérification revient à votre service informatique, ou à une agence extérieure si vous n'en avez pas.

Les trois questions de Céline pour demain matin ont leur place ici. Si vous construisez un système, déclinez les résultats par groupe et demandez-vous pour qui il fonctionne le moins bien. Si vous en achetez un, demandez sur quelle population il a été validé, quelles sont ses limites et quels usages sont exclus. Si vous décidez, demandez qui signe, qui peut dire non et qui porte la responsabilité quand le système se trompe.

Il y a aussi une échéance. Sa diapositive sur l'AI Act : les obligations de transparence s'appliquent déjà depuis le 2 août 2026, les systèmes à haut risque dans l'emploi, l'éducation et le crédit suivent le 2 décembre 2027, et l'IA intégrée à des produits réglementés, dont certains dispositifs médicaux, le 2 août 2028. Tout ce que vous concevez aujourd'hui sera en service d'ici là, donc la conformité se construit dès la conception.

Et c'est rentable. Elle a cité une étude montrant que les équipes tech diverses tirent 45 % de leurs revenus de l'innovation, contre 26 % pour les équipes homogènes.

## Nous n'en sommes qu'au début

Son intervention portait sur les femmes, qui représentent la moitié de l'humanité et sont encore perçues comme une minorité dans l'IA. Elle a été claire : le raisonnement va plus loin. Les personnes en situation de handicap, celles qui viennent d'autres parcours et d'autres milieux, les patients, les utilisateurs, celles et ceux qui font le travail chaque jour.

Elle a terminé par une image. L'IA est un miroir. Elle reflète les données dont on la nourrit et les choix de celles et ceux qui la construisent. Pour qu'elle reflète toute l'humanité, il faut que toute l'humanité soit dans la pièce.

Les choses vont vite, mais nous n'en sommes qu'au début. Nous devons construire cet avenir ensemble, et il est essentiel de ne laisser aucun point de vue de côté. Si la question se pose dans votre équipe ou dans votre groupe de pairs, écrivez-moi. Je serai heureux de vous aider.

---

Sources : Céline Chantry-Daron, intervention sur les biais de l'IA, le genre et la diversité, Toulouse, 2 octobre 2026. J'ai travaillé à partir d'une transcription automatique et de deux photos de ses diapositives, ses propos sont donc paraphrasés et les chiffres sont ceux qu'elle a présentés. Études citées sur ses diapositives : Gender Shades (Buolamwini et Gebru, MIT, 2018) et Daneshjou et al. (2021). La partie sur les seconds cerveaux et sur ce qu'une équipe peut faire est la mienne.`,
};
