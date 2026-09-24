import type { PostFr } from "./index";

export const post: PostFr = {
  content: `Deux randonneurs de dix-huit et dix-neuf ans ont préparé leur première vraie sortie en montagne en juillet. Une nuit en refuge, un lac sur le chemin, un itinéraire qui rendrait bien sur les photos de famille. Ils ont fait ce que la plupart d'entre nous auraient fait : demander à une IA de l'organiser. Elle l'a fait, carte à l'appui.

Ils se sont perdus. Un garde du parc les a trouvés et a demandé à voir la carte. Le lac était dans la mauvaise vallée. Les temps de marche sortaient de nulle part. Selon lui, rien n'y était juste.

Et la carte n'a jamais dit qu'elle n'était pas sûre. Elle a simplement tracé un trait.

C'est avec cette histoire qu'Aygalic Jara a ouvert son intervention à dotAI, à Paris, la semaine dernière. Aygalic est doctorant à l'Université Paris-Saclay et consultant chez SCIAM, et son lightning talk s'intitulait « Hallucinations: Harvesting Uncertainty ». Neuf minutes. C'est l'explication la plus claire que j'aie entendue de la chose que toute équipe devrait comprendre avant de confier du vrai travail à l'IA.

![Aygalic Jara à dotAI 2026, Paris.](/blog/confidence-probes/aygalic-jara.webp)

## Rien n'a cassé

Le premier point qu'il a soulevé est celui qu'on rate. Quand la carte des randonneurs s'est trompée, rien n'a échoué. Pas de panne, pas de message d'erreur, pas de fichier corrompu. Le modèle a fait exactement ce pour quoi il est conçu : produire la suite la plus plausible. Plausible et vrai, ce n'est pas la même chose, et le modèle n'a aucun moyen de vous dire lequel des deux vous avez reçu.

Ce n'est pas un bug que quelqu'un a oublié de corriger. C'est la façon dont ces modèles sont entraînés. Ils apprennent à prédire le mot suivant à partir de textes comme Wikipédia, et Wikipédia ne dit jamais « je ne sais pas ». Il donne la réponse. Le modèle apprend donc à donner la réponse, lui aussi.

On peut réintroduire un peu de doute à l'entraînement, mais si on va trop loin, le modèle se met à refuser des questions auxquelles il aurait su répondre. Et les benchmarks récompensent une supposition assurée plutôt qu'un « pas sûr » honnête, donc peu de monde s'y essaie. La réponse de l'industrie a été de mieux deviner : recherche web, recherche dans vos documents, meilleures instructions. Aygalic leur a rendu justice. Ça fonctionne. Le taux d'erreur baisse. Mais, comme il l'a dit, ces outils ne signalent pas l'erreur. La mauvaise réponse arrive exactement avec la même assurance que la bonne.

## Le modèle le sait souvent

La partie encourageante de l'intervention, c'est celle-ci. Les statistiques nous donnaient autrefois des intervalles de confiance. L'apprentissage profond nous les a retirés, et l'IA générative a aggravé les choses. Pourtant le modèle porte bien un signal sur la solidité de ce qu'il avance. Il ne le dit simplement pas.

L'endroit évident où chercher, la probabilité de chaque mot, s'avère bruité. Un modèle qui hésite entre « environ », « à peu près » et « approximativement deux heures » a l'air incertain, mais il hésite sur la formulation, pas sur le fait. Le signal utile est plus profond, dans l'état interne du modèle pendant qu'il écrit.

Son équipe lit ce signal avec un outil presque gênant de simplicité : une régression logistique, l'un des plus vieux outils de la statistique. On pose au modèle des milliers de questions dont on connaît la réponse, on enregistre son état interne à chaque fois, on marque chaque réponse juste ou fausse, et on entraîne la sonde à distinguer les deux. On obtient une estimation peu coûteuse et assez fiable, prise à l'intérieur du modèle, de la justesse de la réponse qu'il s'apprête à donner.

Dans leurs derniers travaux, la sonde désigne les mots précis qui sont inventés et indique de quel type d'erreur il s'agit. Un exemple tiré du jeu de test : à qui l'on demandait le nom du bâtiment visible par la fenêtre, un modèle a répondu « Starbucks », puis a insisté en décrivant le logo qu'il voyait « clairement » sur la façade. Il n'y avait aucun nom sur le bâtiment. La sonde l'a signalé.

La même astuce sert déjà à accélérer les modèles, en écartant les mots proposés auxquels le modèle ne fait pas confiance avant la vérification coûteuse. Et le dernier exemple d'Aygalic se passe d'explication : le résumé de recherche qui conseillait d'ajouter de la colle à la sauce de sa pizza. Une sonde aurait vu à quel point le modèle croyait peu à ce qu'il écrivait.

Sa dernière phrase : vous n'avez pas à faire confiance à une IA qui ne croit pas en elle-même.

## Pourquoi c'est la première chose à apprendre

Les premiers mois avec l'IA suivent presque toujours la même courbe. Les premières réponses impressionnent, alors on lui fait confiance. Puis une réponse tourne mal devant un client, alors on cesse de lui faire confiance et on vérifie tout. Tout vérifier, c'est là que le temps part. C'est pour ça que tant d'équipes me disent que l'IA ne leur fait rien gagner : Claude rédige en quelques minutes, et le vérifier prend encore une heure.

L'intervention d'Aygalic explique pourquoi aucune de ces deux réactions ne marche. L'aisance du texte ne dit rien. Une réponse juste et une réponse inventée se lisent de la même façon. La compétence à acquérir n'est donc ni « faire confiance » ni « se méfier ». C'est savoir où placer les contrôles, pour qu'une personne regarde les quelques endroits qui le méritent au lieu de relire chaque ligne.

Il y a un piège pour le commun des utilisateurs. Les sondes qu'il a décrites lisent l'état interne d'un modèle. Les chercheurs et les laboratoires peuvent le faire. Vous, en tapant dans Claude ou ChatGPT, non. Et demander au modèle « à quel point es-tu sûr ? » n'est pas équivalent : cette réponse est encore du texte généré, produit de la même manière que l'erreur.

Une équipe doit donc construire ses intervalles de confiance de l'extérieur.

## Ce que fait Praxis

Praxis est construit autour de ce problème, et la méthode suit de près ce qu'Aygalic a décrit.

Sa sonde est entraînée sur des questions dont on connaît la réponse. Dans Praxis, la première chose que fait une équipe après avoir posé ses règles, c'est le même geste à l'échelle de l'équipe : choisir les tâches qui reviennent, et écrire à quoi ressemble un bon résultat et comment on le noterait. Cette grille, ce sont vos réponses connues. Sans elle, personne ne peut dire si l'IA avait raison, seulement si elle en avait l'air.

Sa sonde signale les mots précis qui sont faux, pas toute la réponse. Dans Praxis, l'assistant vérifie son propre brouillon par rapport à votre grille, avec une source pour chaque affirmation, avant que quiconque ne l'ouvre. Votre équipe relit les alertes, pas tout le document. Une affirmation sans source, ou un chiffre qui ne correspond pas au fichier dont il vient, c'est la version vue de l'extérieur d'un faible score de confiance.

Son constat que la recherche et la récupération de documents font baisser le taux d'erreur sans signaler l'erreur, c'est la raison pour laquelle nous connectons l'assistant à vos fichiers tout en gardant le contrôle. Connecter vos documents améliore le brouillon. La grille vous dit où il reste faux.

Et ses randonneurs sont la raison pour laquelle nous décidons tôt quelles tâches l'IA ne doit pas faire seule, et qui valide avant que quoi que ce soit ne sorte de la maison. Certaines erreurs coûtent un après-midi. D'autres, c'est la mauvaise vallée.

Rien de tout cela ne demande un laboratoire de recherche. Il faut un standard écrit, l'habitude de demander des sources, et une frontière claire entre ce que la machine rédige et ce qu'une personne approuve. Cela s'apprend en quelques séances, sur votre propre travail, et c'est précisément la partie que les vidéos gratuites sautent.

Si votre équipe en est au stade « on vérifie tout », la séance gratuite de 60 minutes est le bon point de départ : apportez une tâche, et nous construisons ensemble sa première grille.

---

Sources : Aygalic Jara, « Hallucinations: Harvesting Uncertainty », lightning talk à [dotAI 2026](https://www.dotai.io/), Paris, 17 septembre 2026. J'ai travaillé à partir d'une transcription automatique de l'intervention, ses propos sont donc paraphrasés plutôt que cités. Le parallèle avec Praxis est le mien, pas le sien.`,
};
