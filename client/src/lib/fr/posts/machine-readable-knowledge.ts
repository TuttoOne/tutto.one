import type { PostFr } from "./index";

export const post: PostFr = {
  content: `[Brian Madden](https://brianmadden.ai) a construit ce que j'aurais aimé voir exister lorsque j'ai commencé à réfléchir à la façon dont l'IA devrait travailler avec le savoir professionnel. Son dépôt de connaissances public, sur [brianmadden.ai](https://brianmadden.ai), est la mise en pratique d'une idée que la plupart des organisations peinent encore à formuler : si vous voulez que l'IA travaille bien avec votre pensée, votre pensée doit être structurée de façon exploitable par l'IA.

Ce billet porte sur ce qu'il a construit, sur l'importance de ces principes, et sur le lien direct avec ce qu'enseigne Praxis.

## Ce qu'est brianmadden.ai — et ce qu'il n'est pas

La foire aux questions du site de Brian est le meilleur point de départ, et elle mérite une lecture attentive. Les distinctions qu'il pose sont précises, et chacune écarte un malentendu différent.

**Est-ce un agent conversationnel ?**

Non. C'est une source de données à laquelle votre IA se connecte. Vous parlez à votre IA, et elle puise dans le savoir de Brian lorsque c'est pertinent. Il s'agit moins d'un agent conversationnel que d'une source de contexte et de connaissances, tenue à jour en permanence, pour votre propre assistant.

**Est-ce un jumeau numérique ?**

Non. Un jumeau numérique simule une personne. Ceci rend accessible une pensée publiée. La distinction compte : une simulation cherche à reproduire un comportement ; un dépôt de connaissances rend un raisonnement transparent et réutilisable.

**D'où cela vient-il ?**

Brian entretient un système de connaissances personnel assisté par IA — ce que l'on appelle parfois un second cerveau — et c'est ainsi qu'il utilise l'IA au quotidien. Ce système contient tout ce dont il a besoin pour travailler : contenus, idées, liste de tâches, réflexions, comptes rendus de réunion, documents, plans. [brianmadden.ai](https://brianmadden.ai) est un sous-ensemble de ce système privé, mis à jour chaque jour. Les contenus passent du système privé au dépôt public selon des principes de publication explicites.

**Dans quelle mesure est-ce à jour ?**

Le fichier de « pensée actuelle » est mis à jour fréquemment. La synthèse l'est à chaque nouvelle publication. Point essentiel : l'IA signale les contenus périmés plutôt que de présenter une pensée ancienne comme actuelle — un choix de conception que la plupart des systèmes de connaissances ne font pas.

**Peut-on le dupliquer ?**

Oui. Le dépôt GitHub fait foi. Dupliquez-le, bâtissez dessus, utilisez ces cadres dans votre propre travail.

## Pourquoi ces principes comptent

Ce que Brian a construit démontre une chose importante : l'écart entre « l'IA donne de bonnes réponses » et « l'IA fait mon travail de façon fiable » relève presque toujours de la structure du savoir, et non du modèle.

Un agent conversationnel dans un navigateur n'a accès ni à vos documents, ni à vos précédents, ni au savoir de votre organisation, ni à votre jugement professionnel. Il devine à quoi ressemble une réponse raisonnable, à partir de tout ce sur quoi il a été entraîné. C'est réellement utile pour une question ponctuelle. C'est un risque pour tout ce que vous voulez exécuter de façon régulière, à grande échelle, selon vos exigences propres.

La solution n'est pas un meilleur modèle. C'est un savoir mieux structuré : explicite, à jour, lisible par la machine, et duplicable.

## Pourquoi Praxis enseigne cette méthode

Praxis est le programme qui vous apprend à bâtir cette structure pour votre propre travail. Le fichier de compétences — l'élément central de chaque séance Praxis — est la mise en œuvre concrète de cette idée : un savoir professionnel consigné en langage courant, structuré de sorte qu'un script puisse le lire et l'appliquer de la même manière, à chaque fois.

Les supports de cours Praxis reposent eux-mêmes sur ce principe. Le contenu est tenu comme un dépôt de connaissances structuré — un dossier de fichiers markdown, organisés par thème, écrits pour être lus aussi bien par des humains que par une IA. Vous pouvez le parcourir dans la [bibliothèque de cours Praxis](https://tutto.one/praxis/learn/praxis-foundations).

## À qui revient le mérite

L'idée de publier un système de connaissances personnel sous forme de dépôt GitHub — ouvert, partageable et duplicable par quiconque — est une initiative de Brian, et je tiens à la lui attribuer directement.

Si ce cadre vous est utile, son site est l'endroit où approfondir.

[brianmadden.ai](https://brianmadden.ai)`,
};
