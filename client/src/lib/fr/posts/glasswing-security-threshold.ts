import type { PostFr } from "./index";

export const post: PostFr = {
  content: `Anthropic a publié cette semaine un premier point d'étape sur le [projet Glasswing](https://www.anthropic.com/research/glasswing-initial-update). Il s'agit, sur le papier, de l'annonce d'une initiative de sécurité. Ce que le document décrit en réalité, c'est le franchissement d'un seuil — et la plupart des organisations n'en ont pas mesuré les conséquences.

## Ce qu'est Glasswing

Glasswing est l'effort d'Anthropic pour utiliser son modèle le plus performant, Claude Mythos Preview, afin de trouver des vulnérabilités dans des logiciels critiques avant les attaquants. Les partenaires du lancement comprennent AWS, Apple, Cisco, Google, Microsoft, NVIDIA et JPMorganChase. Anthropic engage 100 millions de dollars en crédits d'usage et 4 millions de dollars de dons directs à des organisations de sécurité open source.

Le cadrage affiché est défensif : nous utilisons l'IA pour protéger les infrastructures. Ce cadrage est exact. Il est aussi incomplet.

## Ce que disent les chiffres

Ces derniers mois, Mythos Preview a analysé plus de 1 000 projets open source. Il y a relevé 23 019 vulnérabilités au total, dont 6 202 classées de gravité élevée ou critique.

Anthropic a ensuite soumis 1 752 de ces constats élevés ou critiques à six cabinets indépendants de recherche en sécurité. 90,6 % — soit 1 587 — ont été confirmés comme de véritables positifs. 62,4 % ont été confirmés de gravité élevée ou critique.

Faites le calcul. À ce taux de vrais positifs, Mythos Preview a mis au jour près de 3 900 vulnérabilités réelles, élevées ou critiques, dans du code open source, au terme d'une analyse qui a pris des mois et non des années. Ce chiffre continuera de croître : Anthropic annonce vouloir poursuivre les analyses.

L'échelle n'est pas le sujet. Le taux l'est. Un taux de 90 % de vrais positifs sur la découverte de vulnérabilités n'est pas un résultat de recherche. C'est une capacité opérationnelle.

## Le point de saturation des référentiels

Anthropic note que Mythos Preview a progressé au point de « saturer pour l'essentiel les référentiels existants » de découverte de vulnérabilités. Anthropic a donc soutenu la création de deux nouveaux référentiels — ExploitBench et ExploitGym — précisément pour suivre à l'avenir les capacités des modèles de pointe en matière de développement d'exploits.

Lorsqu'un modèle sature un référentiel, celui-ci cesse d'être informatif. Ce qui le remplace, ce sont les essais en conditions réelles : c'est exactement ce qu'est Glasswing. Le passage des référentiels à l'analyse en production n'est pas un choix de méthode. C'est la reconnaissance que la capacité a dépassé la mesure.

L'implication est directe : les systèmes d'IA savent désormais trouver des vulnérabilités logicielles et en construire les exploits à un niveau qui dépasse tous les chercheurs en sécurité, hormis les plus chevronnés. Anthropic l'écrit explicitement.

## wolfSSL

L'exemple concret du document mérite qu'on s'y arrête. wolfSSL est une bibliothèque de cryptographie open source utilisée par des milliards d'appareils : routeurs, systèmes embarqués, objets connectés. Mythos Preview y a trouvé une vulnérabilité et construit un exploit fonctionnel qui permettrait à un attaquant de forger des certificats, et donc de se faire passer pour une banque ou un fournisseur de messagerie auprès de tout appareil exécutant la bibliothèque concernée.

Ce n'est pas un constat académique. La falsification de certificats à grande échelle rend possibles des attaques par hameçonnage et par interception que l'utilisateur final ne peut pratiquement pas détecter. L'appareil fait confiance au certificat. L'utilisateur fait confiance à l'appareil.

wolfSSL a été prévenu. Le correctif existe. La question, comme toujours, est de savoir en combien de temps il atteindra les milliards d'appareils qui exécutent la version vulnérable.

## Le vrai problème : l'asymétrie

Le modèle de menace sous lequel travaillent la plupart des équipes de sécurité suppose une parité approximative entre la capacité de l'attaquant et le temps de réaction du défenseur. Les attaquants trouvent des vulnérabilités. Les chercheurs les valident. Des correctifs sont développés. Les organisations les appliquent selon un cycle trimestriel, ou à réception d'un avis critique.

Ce que démontre Glasswing, c'est que le versant « découverte » de cette équation a été radicalement accéléré. Un modèle peut analyser 1 000 projets en quelques mois. Il peut construire des exploits fonctionnels, et pas seulement signaler des faiblesses potentielles. Il peut le faire en continu, à grande échelle, et sa capacité progresse.

Le versant « correction », lui, n'a pas changé. Les tests de correctifs, les chaînes de déploiement, la gestion des dépendances et les frictions organisationnelles liées à la mise à jour des systèmes en production fonctionnent selon les mêmes délais qu'il y a cinq ans.

C'est cet écart qui constitue le véritable problème. L'initiative Glasswing place les défenseurs du bon côté de cet écart. Mais ils n'en bénéficient que s'ils savent absorber les constats et agir plus vite que la fenêtre de vulnérabilité ne reste ouverte.

## Ce que cela implique en pratique

Le document cite le NIST et le NCSC britannique, qui recommandent aux défenseurs de raccourcir les délais de test et de déploiement des correctifs, de durcir les configurations réseau par défaut, d'imposer l'authentification multifacteur et de tenir des journaux complets. Ces recommandations ne sont pas nouvelles. Leur urgence, elle, l'est.

Quelques points à évaluer dans votre propre organisation :

- **La vitesse de correction.** Combien de temps s'écoule entre un avis critique et un déploiement confirmé sur l'ensemble de votre parc ? Si la réponse se compte en semaines ou en mois, cet écart est votre fenêtre d'exposition. Mythos Preview peut construire un exploit fonctionnel dans le temps qu'il faut à votre gestion des changements pour programmer une fenêtre de maintenance.

- **L'inventaire des dépendances.** Savez-vous lesquels de vos systèmes dépendent de wolfSSL, ou de l'un des 1 000 autres projets analysés par Glasswing ? Si votre nomenclature logicielle est incomplète ou périmée, les avis n'atteindront pas les bonnes personnes à temps.

- **La couverture de l'authentification multifacteur.** L'exemple bancaire cité impliquait un acteur malveillant ayant compromis la messagerie d'un client pour obtenir, par manipulation, un virement. Le point d'entrée n'était pas une faille inédite : c'était un identifiant. L'authentification multifacteur n'est pas un dispositif sophistiqué. Son absence reste l'un des facteurs les plus fréquents dans les attaques réussies.

L'initiative Glasswing est une réelle bonne nouvelle : Anthropic emploie à des fins défensives une capacité qui pourrait servir à l'attaque. Mais le bénéfice ne se matérialise que si les organisations destinataires savent effectivement avancer au rythme qu'exige désormais la menace.

Le seuil est franchi. La question est de savoir si votre tempo opérationnel l'a rattrapé.`,
};
