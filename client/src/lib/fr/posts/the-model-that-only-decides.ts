import type { PostFr } from "./index";

export const post: PostFr = {
  content: `Cette semaine, Diogo Almeida, ancien chercheur d'OpenAI, a sorti de l'ombre un modèle appelé Jev, via son entreprise TypeSafe AI. Jev ne sait pas écrire un e-mail. Il ne résume pas un document et ne rédige pas d'offre. Il se contente de choisir.

Vous lui donnez un contexte et une question avec un ensemble de réponses fixé d'avance. Il vous renvoie l'une de ces réponses et un score de confiance. C'est tout.

On pourrait y voir un retour en arrière. Pour la plupart des petites entreprises avec lesquelles je travaille, je pense que c'est au contraire la direction la plus utile.

## L'essentiel de votre travail d'IA, c'est du tri, pas de la rédaction

Quand j'observe comment une petite équipe passe réellement son temps, l'écriture est rarement le goulet d'étranglement. Le tri, si. Lequel de ces quarante e-mails demande mon attention aujourd'hui ? Cette facture est-elle complète ou manque-t-il quelque chose ? Cette demande est-elle un vrai prospect, un fournisseur ou du spam ? Ce ticket va-t-il à la facturation ou au technicien ? Cette clause de contrat est-elle standard ou inhabituelle ?

Chacune de ces questions est un petit jugement. Trop flou pour une règle par mots-clés, bien trop simple pour qu'une personne y passe une minute, et il revient des centaines de fois par semaine.

Aujourd'hui, quand on automatise ces décisions, on les confie généralement à un grand modèle de langage. Ça fonctionne, mais c'est comme engager un avocat pour ouvrir le courrier. Vous payez un raisonnement dont vous n'avez pas besoin, vous attendez, et vous recevez un paragraphe qu'il faut ensuite traduire en oui ou en non.

Un modèle de décision est conçu exactement pour ce travail. Il répond sous l'une de trois formes : oui ou non, une option dans une liste, ou une note sur une échelle. Il ne peut pas partir dans de la prose, donc le logiciel qui l'entoure n'a jamais à deviner ce qu'il voulait dire.

Voici ce que cela donne pour un e-mail qui arrive dans une boîte partagée :

[VISUAL:decision-flow]

Ce n'est pas un remplaçant de l'assistant que vous utilisez déjà. C'est un autre outil, pour un autre travail :

[VISUAL:four-kinds-of-tool]

## Ce que ça coûte

C'est ce qui a retenu l'attention. TypeSafe affiche Jev à 0,042 $ par million de tokens en entrée, et la sortie est gratuite. Il répond en 70 à 500 millisecondes, assez vite pour fonctionner dans un formulaire ou un chat en direct sans que personne ne le remarque. Une décision typique avec une page de contexte représente environ mille tokens. Mille décisions coûtent donc à peu près quatre centimes.

Linas Beliūnas, dont j'ai lu le guide avant d'écrire ce texte, souligne le point le plus important : le prix des tokens est la plus petite partie du calcul. La vraie valeur, c'est le travail que vous n'envoyez plus au modèle coûteux, les minutes qu'une personne ne passe plus à trier, et la rapidité. Les vrais coûts, ce sont les erreurs, les solutions de repli et le temps de mise en place et de suivi. Si la décision n'a jamais coûté cher, un modèle bon marché ne vous fera pas économiser grand-chose.

## Votre décision est-elle adaptée ?

Voici la liste que j'utiliserais avant de l'essayer sur quoi que ce soit :

- **Les réponses sont connues d'avance.** Vous pouvez lister tous les résultats valides avant de poser la question.
- **Il faut comprendre, pas réfléchir longuement.** Un filtre par mots-clés ne suffit pas, mais un collègue sensé trancherait en quelques secondes.
- **Les éléments sont sous ses yeux.** Tout ce qu'il faut pour décider est dans ce que vous envoyez. Il ne navigue pas et ne va rien chercher.
- **La décision est fréquente.** Les économies ne s'additionnent qu'avec le volume.
- **Une mauvaise réponse est rattrapable.** Il existe une étape de relecture, une solution de repli ou un retour arrière.
- **Vous pouvez savoir après coup s'il avait raison.** Sinon, vous ne saurez jamais ce qu'il vaut.

Et une règle qui prime sur toutes les autres : si du code simple peut le faire, utilisez du code simple. Les dates, les montants, les seuils, les autorisations et les règles de conformité appartiennent à un logiciel que vous pouvez lire et auditer, pas au jugement d'un modèle.

Appliqué au genre de décisions que je vois chaque semaine dans les petites entreprises :

[VISUAL:sme-fit-map]

## Ce qu'il ne fait pas

Le discours de lancement affirme que Jev « ne peut pas halluciner ». C'est vrai dans un sens étroit : il ne peut pas renvoyer quelque chose que vous n'avez pas demandé. Il peut quand même choisir la mauvaise option, et se tromper avec assurance. Une réponse typée élimine toute une catégorie d'erreurs de format. Elle n'élimine pas le mauvais jugement.

La sécurité en est l'exemple le plus clair. Dans un test indépendant sur des attaques par injection de prompt, Jev obtenait de bons résultats quand on lui disait à quoi servait l'application, et nettement moins bons sans cette information, parce qu'une attaque sortie de son contexte ressemble à une demande ordinaire. Considérez-le comme un signal d'alerte précoce, pas comme la serrure de la porte.

Les tests montrent aussi quelque chose d'utile : ce que vous envoyez compte autant que le modèle. Sur un jeu de données public de spam, le simple fait d'ajouter l'expéditeur, les liens et les pièces jointes à chaque e-mail a fait passer la précision d'environ 94 % à 98 %, sans changer la question. L'essentiel du gain vient du bon contexte, pas d'un prompt plus astucieux.

À son crédit, TypeSafe publie les points faibles de la version actuelle : le calcul et le comptage, la comparaison de dates, les doubles négations, les données bruitées et les textes volontairement trompeurs. Ces notes, plus ce que nous avons vu en pratique, donnent une courte liste de pièges :

[VISUAL:pitfalls]

## Comment je le testerais dans une petite entreprise

1. **Listez vos décisions.** Notez les petits jugements répétés que votre équipe fait chaque semaine. La plupart des équipes en trouvent dix ou plus en une heure.
2. **Choisissez-en une ennuyeuse, fréquente et peu risquée.** Le tri des e-mails et la qualification des prospects sont de bons premiers candidats.
3. **Étiquetez quelques centaines d'exemples réels.** Quelle était la bonne réponse à chaque fois ? C'est votre jeu de test, et c'est la chose la plus précieuse que vous construirez.
4. **Comparez-le à quelque chose de simple.** Votre règle actuelle, ou un grand modèle qui fait le même travail. Si Jev ne fait pas clairement mieux que la solution simple, arrêtez-vous là.
5. **Faites-le d'abord tourner dans l'ombre.** Laissez-le décider en parallèle de votre équipe pendant quelques semaines sans agir. Comparez.
6. **N'automatisez que les cas sûrs.** Laissez-le agir quand il est confiant, et envoyez le reste à une personne. C'est le score de confiance qui rend ce partage possible.
7. **Continuez à vérifier.** Vos e-mails, vos clients et vos produits changent. Une décision juste en septembre peut dériver d'ici le printemps.

## Avant de le brancher

Quelques précautions pratiques. Jev est encore en accès anticipé : on s'inscrit via la console de TypeSafe et on attend d'être admis. Il existe des SDK Python et JavaScript, et on peut aussi y accéder via l'AI Gateway de Vercel et OpenRouter, où les intégrations sont marquées comme expérimentales. Côté données, TypeSafe affirme ne pas entraîner ses modèles sur les données clients et propose un accord de traitement des données, mais la conservation zéro est réservée aux clients entreprise, et l'entreprise ne précise pas où les requêtes sont traitées. Si vos données ne doivent pas quitter la Suisse ou l'UE, posez la question avant d'envoyer des données clients où que ce soit. Figez la version exacte du modèle, pour qu'une mise à jour silencieuse ne change pas vos résultats. Et gardez la décision derrière votre propre interface, pour pouvoir changer de fournisseur plus tard. Des alternatives ouvertes suivent déjà de près.

## L'enjeu plus large

Depuis deux ans, on se demande quel modèle écrit le mieux. Pour une petite entreprise, la question la plus utile est plus discrète : quelles petites décisions mangent la journée de mon équipe, et lesquelles une machine pourrait-elle prendre en charge de façon fiable, bon marché, avec une personne qui garde la main sur les cas limites ?

Un modèle qui ne fait que décider vous oblige à répondre sérieusement à cette question. Rien que pour ça, il mérite un après-midi.

---

Sources : l'[article de lancement](https://typesafe.ai/blog/introducing-system-one-models-and-jev) de TypeSafe AI, sa [documentation](https://docs.typesafe.ai/) (dont le guide sur la confiance et la page des limites de Jev 1.13) et ses [pages juridiques](https://typesafe.ai/legal/privacy-policy), et le guide de Linas Beliūnas « How to Use Jev AI » dans Linas's Newsletter, qui rassemble les prix, les modes d'accès et les résultats de tests indépendants cités ici. La liste de vérification, le plan de test et les schémas sont ma propre adaptation pour les petites entreprises.`,
};
