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

## Conclusion
L'application est globalement fonctionnelle sauf pour la connexion qui arrête l'exécution du site en cas de tentative de connexion avec de mauvais identifiants. Le visuel du site n'est pas travaillé et n'a aucune bonne pratique dans sa construction. Un site doit avoir un header, des sections (contenus du site) et un footer. Le SEO n'est pas travaillé, il manque une structure claire du site avec par exemple des titres h1, h2... ce qui dévalue la note du site par les moteurs de recherche, s'il était mise en ligne. De plus, il n'existe pas de vérification de champs dans l'inscription avec un mot de passe qui est en clair dans l'input. La prochaine étape pourrait être d'améliorer le visuel, la structure du site, et ajouter plus de feedback à l'utilisateur lorsqu'il utilise le site (par exemple, par des messages en haut de page dès qu'une action est réalisée).
