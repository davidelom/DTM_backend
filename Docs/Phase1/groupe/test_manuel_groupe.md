# Rapport des Tests Manuels de l'Application

## État du Front (UI et UX)

### 1. Page d'accueil
- **Observation :**
  - Affichage minimaliste.
  - Pas de style ou mise en page avancée.
- **Problèmes :**
  - Manque d'indication claire pour l'utilisateur sur ce que fait l'application.
  - Pas d'éléments visuels engageants.
  - On arrive sur une page vide qui a juste un lien vers la connexion et pas vers la page inscription donc il faudra soit enlever cette page pour mettre la page login par défaut ou ajouter des éléments sur cette page afin qu'elle est un intérêt. Lorsque l'on fait un site ou une application on doit minimiser au maximum le nombre de clique de l'utilisateur pour qu'il arrive à ses fins.
- **Améliorations possibles :**
  - Ajouter un titre et un texte d'accueil expliquant brièvement l'application.
  - Ajouter un lien vers la connexion et vers l'inscription. (Possibilité de mettre ces éléments dans un menu qui se trouvera dans un header).
  - Mettre en place un design moderne avec une meilleure palette de couleurs.
  - Ajout d'un header et d'un footer pour mieux définir le site et la navigation.

### 2. Page de connexion
- **Observation :**
  - Formulaire simple pour entrer un nom d'utilisateur et un mot de passe.
- **Problèmes :**
  - Aucun retour en cas de mauvais identifiants.
  - Absence de lien pour réinitialiser un mot de passe oublié.
  - Lorsqu'on essaye de se connecter avec de mauvais identifiants l'application s'arrête sûrement dû à une erreur côté backend. J'ai remarqué que lorsque l'identifiant n'existe pas dans la base de données alors l'application s'arrête. Mais lorsque le username utilisé existe et que le mot de passe est incorrect alors le site charge très longtemps et une erreur de timeout apparait.
- **Améliorations possibles :**
  - Ajouter des messages d'erreur clairs.
  - Créer un lien "Mot de passe oublié ?".
  - Corriger l'erreur côté backend

### 3. Page d'inscription
- **Observation :**
  - Les champs nécessaires sont présents (nom, email, mot de passe).
- **Problèmes :**
  - Pas de validation des champs (par exemple, email non valide accepté).
  - Mot de passe visible en clair (aucun champ masqué) et pas d'obligation d'avoir un mot de passe fort.
  - Pas de lien sur la page de connexion
  - On peut s'enregistrer plusieurs fois avec le même pseudo et email
- **Améliorations possibles :**
  - Ajouter des validations client-side (JavaScript).
  - Masquer le champ de mot de passe.
  - Ajouter un lien vers la page de connexion
  - Rendre le pseudo et mot de passe unique

### 4. Tableau de bord
- **Observation :**
  - Pour arriver sur le tableau de bord des tâches nous devons passer par une page qui ne sert à rien (car pas d'information dessus). Elle contient seulement le lien vers le tableau de bord donc autant directement afficher le tableau de bord ou ajouter du contenu sur cette page afin qu'elle soit utile.
  - Les tâches sont affichées dans une liste simple.
- **Problèmes :**
  - Pas d’indicateurs visuels pour les tâches terminées ou en cours.
  - Interface peu intuitive pour ajouter ou supprimer des tâches.
- **Améliorations possibles :**
  - Ajouter des filtres (tâches terminées/en cours).
  - Utiliser des icônes ou des couleurs pour indiquer l'état des tâches.

### 5. Page administration
- **Observation :**
  - Même si je connaissais pas l'application je tente toujours de voir s'il existe une page d'administration. Pour cela, je tente dans l'url quelques urls possibles qui pourraient renvoyer sur une page admin comme "http://localhost:3000/administration" ou "http://localhost:3000/admin". Ainsi, avec la seconde url je remarque que je peux avoir accès à la page admin seulement en connaissant l'url. En d'autres termes, elle n'est pas protégé pour des roles spécifiques c'est-à-dire accessible seulement pour les utilisateurs avec un rôle admin par exemple.
- **Problèmes :**
  - Je peux voir l'ensemble des utilisateurs de la base de données mais l'action remove ne renvoie sur aucune route existante par conséquent je ne peux pas supprimer des utilisateurs.
- **Améliorations possibles :**
  - Ajouter un sécurité sur la page adminnistration en resteignant son accès à un rôle spécifique (comme ROLE_ADMIN).

### 6. Page utilisateur
- **Observation :**
  - Les pages utilisateurs ne sont pas sécurisées donc tout le monde peut avoir accès aux tâches des autres utilisateurs pourvu que l'attaquant connaisse l'id de l'utilisateur et en le mettant dans cette url "http://localhost:3000/?userId={id_de_l_utilisateur}"
- **Problèmes :**
  - Aucun tableau de bord des tâches est sécurisé accessible pour tout le monde.
- **Améliorations possibles :**
  - Limiter l'accès pour chaque utilisateur à son tableau de bord de tâches.

---

## État Général (Fonctionnalités et Attentes)

### 1. Navigation sur le site
- **Fonctionnalité attendue :**
  - Permettre à l'utilisateur de naviguer facilement entre les différentes pages : connexion, inscription, tableau de bord, etc.
- **Résultat observé :**
  - La navigation est possible en saisissant manuellement les URL, mais aucune barre de navigation ou menu n'est présent.
  - Après la connexion, l'utilisateur est redirigé sur une page vide avec un lien peu visible pour accéder à ses tâches.
  - Aucun retour utilisateur clair sur la navigation en cours.
- **Améliorations possibles :**
  - Ajouter une barre de navigation persistante pour accéder rapidement aux pages principales.
  - Mettre en place un header personnalisé pour afficher des liens dynamiques selon l'état de l'utilisateur (connecté ou non).
  - Ajouter une page d'accueil claire avec des explications sur l'utilisation de l'application.
### 2. Connexion et déconnexion
- **Fonctionnalité attendue :**
  - Permettre à un utilisateur de se connecter et de gérer sa session.
- **Résultat observé :**
  - La connexion fonctionne avec des utilisateurs valides.
  - La déconnexion n’est pas visible (pas de bouton ou lien pour déconnecter).
  - L'application s'arrête en cas de tentative de connexion avec des utilisateurs non valides.
- **Améliorations possibles :**
  - Ajouter un bouton "Se déconnecter" dans le header (lorsque l'on aura créé un header).
  - Gérer la session avec un retour utilisateur (message "Connexion réussie") et faire directement une redirectin sur la liste des tâches de l'utilisateur plutôt que sur une page vide qui a un lien pour aller sur les tâches.
  - Corriger l'erreur côté backend.

### 3. Inscription
- **Fonctionnalité attendue :**
  - Permettre à un utilisateur de créer un compte.
- **Résultat observé :**
  - Il existe pas de vérification de champs ainsi nous pouvons mettre dans email autre chose qu'un email
  - Les comptes sont bien créés, mais aucun retour utilisateur en cas d'erreur.
  - Après l'inscription, nous sommes renvoyés sur la page de connexion et nous devons nous reconnecter. Ajoute un étape inutile pour l'utilisateur.
- **Améliorations possibles :**
  - Ajouter des vérifications de champs avant la création du compte utilisateur.
  - Afficher des erreurs si les données sont invalides ou si l'utilisateur existe déjà.
  - Être connecté directement après l'inscription.

### 4. Ajout de tâches
- **Fonctionnalité attendue :**
  - Permettre à un utilisateur de créer une tâche.
- **Résultat observé :**
  - Les tâches sont ajoutées mais sans message de confirmation tel que "Tâche créée avec succès.
  - Changer le style des tâches selon leur paramètre (par exemple, si elle est complétée ou non).
- **Améliorations possibles :**
  - Ajouter un message de succès après l’ajout.
  - Permettre d’ajouter d'autres paramères aux tâches afin qu'elles soient plus complètes.

### 5. Suppression de tâches
- **Fonctionnalité attendue :**
  - Permettre à un utilisateur de supprimer ses tâches.
- **Résultat observé :**
  - Fonctionnalité opérationnelle, mais aucune demande de confirmation avant suppression.
- **Améliorations possibles :**
  - Ajouter une boîte de dialogue pour confirmer la suppression.

### 6. Modification de tâches
- **Fonctionnalité attendue :**
  - Permettre à un utilisateur de modifier ses tâches.
- **Résultat observé :**
  - Fonctionnalité non existante
- **Améliorations possibles :**
  - Créer un bouton pour modifier le contenu de ses tâches.

### 7. Sécurisation des pages
- **Fonctionnalité attendue :**
  - Chaque utilisateur selon son id et son rôle peut avoir accès à des informations limité
- **Résultat observé :**
  - Aucune page est protégé donc accessible pour tout le monde à partir du moment où l'on connaît les urls.
- **Améliorations possibles :**
  - Créer des rôles et limiter le contenu consultable selon le rôle de l'utilisateur et selon les informations qui le concerne.

---

### Conclusion
## État des Fonctionnalités

| Fonctionnalité | État | UI/UX | Problèmes Identifiés | Améliorations Possibles |
|----------------|------|-------|---------------------|------------------------|
| Connexion      | 🟡    | 🟡     | • Pas de message d'erreur explicite • Pas de validation côté client | • Ajouter des messages d'erreur clairs • Ajouter de la validation en temps réel |
| Inscription    | 🟡    | 🟠     | • Formulaire trop basique • Pas de confirmation de mot de passe | • Ajouter une confirmation de mot de passe • Ajouter des règles de mot de passe fort |
| Liste des tâches | 🟢    | 🟡     | • Pas de pagination • Chargement lent avec beaucoup de tâches • Pas de statut des tâches | • Implémenter la pagination • Ajouter un système de filtres • Ajouter un système de statut (terminé/en cours) |
| Création de tâche | 🟢    | 🟡     | • Interface minimaliste • Pas de validation des dates • Pas de champ statut | • Ajouter un calendrier pour la sélection de date • Ajouter des champs priorité • Ajouter un champ statut |
| Modification de tâche | 🔴    | 🔴     | • Fonctionnalité inexistante • Impossible de modifier le statut des tâches | • Implémenter la modification des tâches • Ajouter la possibilité de changer le statut • Ajouter une modale de confirmation |
| Suppression de tâche | 🟡    | 🟠     | • Pas de confirmation • Suppression immédiate sans possibilité d'annuler | • Ajouter une confirmation • Implémenter un système d'annulation |
| Navigation     | 🟠    | 🟠     | • Absence de header/menu de navigation • Pas de liens vers les pages principales • Navigation peu intuitive | • Ajouter un header avec menu principal • Implémenter des liens vers accueil/tâches/connexion • Améliorer l'expérience de navigation |
| Déconnexion    | 🔴    | 🔴     | • Fonctionnalité inexistante • Pas de bouton de déconnexion • Session utilisateur mal gérée | • Ajouter un bouton de déconnexion • Implémenter la gestion de session • Ajouter une confirmation de déconnexion |
| Sécurité       | 🔴    | -     | • ID utilisateur exposé dans l'URL • Vulnérable à la manipulation d'ID • Pas de protection des routes • Accès aux tâches sans authentification • Routes non sécurisées | • Masquer les IDs techniques • Implémenter des tokens sécurisés • Ajouter une authentification robuste • Mettre en place un middleware d'authentification • Protéger toutes les routes sensibles |

## Légende

- 🟢 Fonctionne parfaitement
- 🟡 Fonctionne avec quelques problèmes
- 🟠 Problèmes majeurs
- 🔴 Ne fonctionne pas

## État Général

### Points Positifs

- Application fonctionnelle dans l'ensemble
- Interface simple à comprendre
- Temps de réponse correct pour les opérations basiques

### Points d'Amélioration

- Manque général de retour utilisateur sur les actions
- Absence de système de gestion d'erreurs cohérent
- Interface utilisateur minimaliste nécessitant une refonte
- Pas de responsive design
- Sécurité à renforcer :
  - Exposition des IDs techniques dans l'URL
  - Absence de protection contre la manipulation d'identifiants
  - Pas de validation des permissions utilisateur
  - Accès non autorisé possible via manipulation d'URL
  - Routes sensibles accessibles sans authentification
- Navigation entre les pages inexistante ou peu intuitive
- Gestion des sessions utilisateur défaillante

### Delta avec l'Attendu

- Fonctionnalités de base présentes mais perfectibles
- Manque de fonctionnalités avancées (filtres, tri, recherche)
- Expérience utilisateur à améliorer significativement
