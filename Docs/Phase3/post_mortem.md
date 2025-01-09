# **Post-Mortem : Développement de l'Application Task Manager**

Le projet avait pour objectif de corriger et améliorer une application témointe présent sur ce [dépôt sur GitHub](https://github.com/Aherbeth/dumb_task_manager). Ce repository contenait des failles de sécurité, des erreurs d'architecture, ainsi qu'une interface utilisateur rudimentaire et peu intuitive en termes d'UX. Vous pouvez consulter notre analyse détaillée des problèmes identifiés et des pistes d'amélioration proposées dans le dossier `Docs/Phase1/groupe`.

Le projet s'est effectué en duo.

---

## Histoire du développement

Tout d'abord, nous avons débuté par une phase d'analyse individuelle, au cours de laquelle chacun de nous a exploré le projet de son côté afin d'identifier les erreurs et de proposer des pistes d'amélioration potentielles. Cette approche individuelle permet une analyse personnalisée, en exploitant les points forts de chaque développeur, tout en évitant d'être influencé par les observations de l'autre. Vous pouvez consulter les analyses de David Gnaglo sur ce chemin `Docs/dg` et les analyses d'Alexis Metton sur ce chemin `Docs/am`.

Une fois cette étape terminée, nous avons mis en commun nos analyses et confronté nos résultats pour élaborer un rapport complet sur l'état du projet à améliorer. Ces analyses incluent une phase de tests manuels visant à identifier les erreurs susceptibles d’être rencontrées par des utilisateurs lambda, une phase de tests d’attaque simulant les actions potentielles de pirates informatiques, ainsi qu’une analyse approfondie du code source. Vous pouvez consulter le rapport détaillé de ces analyses dans le dossier `Docs/groupe`

Par la suite, nous avons défini les tâches à réaliser. Nous avons naturellement séparé le travail en deux branches : `refactor-frontend` et `refactor-backend`, car il était impératif de retravailler ces deux parties du code pour corriger les failles de sécurité, améliorer l’architecture non optimale et ajouter des fonctionnalités visant à enrichir l'application.

Il est important de noter que nous avons mis en place de nombreux tests pour faciliter le développement et garantir la maintenabilité de l'application. Ainsi, une fois le refactoring du frontend et du backend terminé et ces branches fusionnées dans la branche `develop` nous avons pu créer une nouvelle branche : `feature-test-end-to-end`. Les tests sur le backend ont été développés selon la méthodologie TDD (Test-Driven Development), qui consiste à écrire les tests avant d’implémenter les fonctionnalités. Ces tests ont donc été réalisés sur la branche dédiée au refactoring du backend.

Dans cette nouvelle branche, nous avons développé des tests end-to-end avec Cypress, dans le but final de les intégrer à un workflow GitHub Actions (comme cela a été fait pour les tests côté backend). Cela permet de s'assurer qu'à chaque push dans une branche ou à chaque pull request vers les branches `develop` ou `main`, ces tests sont exécutés automatiquement pour vérifier que l'application reste pleinement fonctionnelle.

Enfin, après avoir mis en place toutes ces fonctionnalités nous avons créé une branche `Docs---ajout-documentation-phase-3` pour rédiger et intégrer la documentation technique ainsi que le post-mortem que vous êtes en train de lire.

---

## Approche du développement

### Stratégie adoptée

- Analyse de la navigation sur le site
- Analyse du comportement du site face à des attaques informatique
- Analyse du code
- Mise en commun de nos analyses
- Planification selon nos analyses
- Distribution des tâches à réaliser
- Mise en commun à chaque grande partie terminé
- Push sur la branche `develop` pour réunir toutes nos contributions et tester notre applicaiton
- Push sur la branche `main` une fois l'application fonctionnelle sur la branche `develop`

###  Priorisation des tâches

Afin d'optimiser le temps de développement nous avons découpé les tâches à réalisées en plusieurs parties : 
- **Tâches critiques** : Correction des failles de sécurité
- **Optimisation** : Réorganisation de l'architecture du code pour améliorer la compréhension et l'efficacité.
- **Tests** : Mise en place de test avec Jest et Cypress pour garantir le bon fonctionnement de l'application tout au long du développement et faciliter le débogage en cas de problème.
- **Amélioration des fonctionnalités**: Optimisation ou ajout de nouvelles fonctionnalités et amélioration de l'UI et UX.

### Intégrations des bonnes pratiques 

Durant tout le travail, nous avons réfléchi aux bonnes pratiques à respecter et à mettre en place tel que : 
- **Architecture**: Mise en place de middlewares, contrôleurs (pour séparer la logique métier), modèles, etc., afin d'assurer une structure claire et évolutive.
- **Sécurité**: Adoption de normes de sécurité, telles que le chiffrement des mots de passe avec bcrypt et la gestion des tokens JWT, associée aux sessions utilisateurs, pour prévenir les failles CSRF et XSS.
- **Qualité du code** : Production d'un code lisible, bien structuré et organisé pour faciliter la lecture et la maintenance
- **Gestion de projet**: Déveleppoement du projet avec la stratégie de branche Gitflow, respect des conventionnal commits et recours aux pull requests pour être sûr que les deux membres du projet approuve les modifications dans les branches `develop` et `main`.

### Frameworks et outils utilisés

- **Backend** : Node.js, Express.js
- **Frontend** : Tailwind
- **Base de données** : MySQL
- **Tests** : Jest, Supertest, Cypress
- **Authentification** : Sessions (Express-session) et Tokens JWT
- **CI/CD** : GitHub Actions

## Outils de collaboration et communication

Dans le but de maximiser l'efficacité et l'organisation du projet, nous avons utilisé plusieurs outils : 

- **Communication écrite et orale** : Discord
- **Hébergement et versionnage du code**: GitHub
- **Développement du code** : VSCode avec l'extension `Live Share`. En effet, pour une partie du développement nécessitant une base de données MySQL nous avons dû travailler en simultané sur le même VSCode car un membre du groupe était dans l'impossiblité d'ajouter tout logiciel sur son ordinateur. 

---

## Point de satisfaction

### Respect du travail à réaliser

- Les failles de sécurité ont été corrigées.
- L'architecture du projet est efficace et cohérent tout en respectant les bonnes pratiques.
- Les test couvrent une grande partie des fonctionnalités de l'application.
- La planification et l'organisation du travail ont été respectées.

### Ajout de nouvelle fonctionnalités sur le projet

- UI/UX amélioré
- Partie admin protégée avec la possibilité de modifier le rôles des utilisateurs et de supprimer des utilisateurs.
- Possibilité de compléter des tâches avec une intéractivité UI pour le signifier à l'utilisateur.
- Possibilité d'ajout, modification et suppresion des tâches
- Dans le header, présence d'une bulle pour signifier le nombre de tâches qu'il reste à faire.
- Pour l'inscription, obligation de fournir un email valide et un mot de passe fort.
- Tests complets couvrant une grande partie de l'application

---

## Points d'insatisfaction et améliorations

Etant donné la durée du projet, toutes les fonctionnalités n'ont pas pû être ajouté à l'application afin d'avoir un système de gestion de tâches performant et intuitif.

L'utilisation exclusive du framework `Tailwind` pose une limite dans l'UI et l'UX.

## Difficultés rencontrées

### Imprévu

Nous avons dû faire face à un imprévu : l'un des membres du groupe n'était pas en mesure d'installer des logiciels sur son ordinateur professionnel. Pour contourner cette contrainte, nous avons mis en place une solution permettant de continuer à travailler et à contribuer efficacement au projet. L'extension `Live Share` de VSCode a été utilisée pour partager un même environnement de développement entre plusieurs personnes, permettant ainsi à tous de travailler sur la même interface en temps réel.