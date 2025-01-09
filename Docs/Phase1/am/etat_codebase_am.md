# Rapport sur l'État de la Codebase

## 1. Qualité du Code
- **Lisibilité :**
  - Le code est généralement lisible, mais manque de commentaires explicatifs pour clarifier certaines parties critiques, comme les requêtes SQL et les routes sensibles.
  - Certaines fonctions comme `Task.create` et `User.findById` utilisent des pratiques non sécurisées (concatenation directe dans les requêtes SQL), rendant le code vulnérable.
  - Les mots de passe ne sont pas hachés donc en cas d'attaque avec injection SQL les attaquants peuvent récupérer les mots de passe des utilisateurs en clair et donc les réutiliser.

- **Maintenabilité :**
  - Les fichiers sont bien séparés par responsabilité (`app.js`, `auth.js`, `tasks.js`, etc.), ce qui facilite la compréhension générale.
  - Cependant, l'absence de middleware commun pour gérer l'authentification ou les permissions peut entraîner une duplication de logique dans les fichiers (`tasks.js` et `admin.js`).

## 2. Qualité de l'Architecture
- **Modularité :**
  - L'architecture suit un modèle modulaire (routes séparées, modèles SQL dans des fichiers distincts), ce qui est une bonne pratique.
  - L'absence de contrôleurs dédiés pour encapsuler la logique métier dans les routes complique l'évolution du projet.

- **Séparation des responsabilités :**
  - Les fichiers de routes comme `auth.js` et `tasks.js` incluent à la fois des validations, des appels de modèle, et des réponses, ce qui mélange logique métier et gestion des requêtes HTTP.

## 3. Qualité et Couverture des Tests
- **Tests :**
  - Aucun test a été réalisée.
  - L'application manque de tests unitaires et fonctionnels pour valider le bon fonctionnement des fonctionnalités critiques comme l'authentification, la création de tâches ou la gestion des permissions.

- **Impact :**
  - L'absence de tests expose le projet à des erreurs lors de futures modifications ou ajouts de fonctionnalités.

## 4. Pistes d'Amélioration
- **Sécurisation :**
  1. Remplacer la concatenation SQL par des requêtes préparées dans les fichiers `user.js` et `task.js`.
     ```javascript
     const query = 'INSERT INTO tasks (title, description, completed, user_id) VALUES (?, ?, ?, ?)';
     db.run(query, [t.title, t.description, t.completed, t.user_id], function (err) {
         // Callback
     });
     ```
  2. Ajouter un middleware global pour gérer les permissions et l'authentification.
     ```javascript
     const authenticate = (req, res, next) => {
         if (req.session && req.session.user) {
             next();
         } else {
             res.status(401).send('Unauthorized');
         }
     };
     ```

  3. Ajouter un hachache des mots de passe
    - En effet, lors de la création d'un utilisateur nous devons hacher le mot de passe avant l'inscription dans la base de données. Voici un exemple de code fonctionnel même si dans les faits il y aura d'autres éléments à rajouter comme la vérification des champs et la mise en place d'une politique de username et email unique.
     ```javascript
      const bcrypt = require('bcrypt');
      create: (user, callback) => {
        bcrypt.hash(user.password, 10, (err, hashedPassword) => {
        const query = 'INSERT INTO users (username, password, email) VALUES (?, ?, ?)';
          const params = [user.username, hashedPassword, user.email];
          db.run(query, params, function (err) {
              callback(null, { id: this.lastID, ...user });
          });
        });
      },
     ```
     - Il faudra aussi modifier le code "authenticate" pour que le comparatifs des mots de passe se fasse entre password hachés. Voici un exemple de code fonctionnel même si dans les faits il y aura peut être d'autres éléments à rajouter.
    ```javascript
      const authenticate = (username, password, callback) => {
        User.findByUsername(username, (err, user) => {
            if (err || !user) return callback(null, false);

            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) return callback(err, false);
                if (isMatch) {
                    user.connected = true;
                    return callback(null, user);
                } else {
                    return callback(null, false);
                }
            });
        });
      };
    ```
- **Refactorisation :**
  1. Extraire la logique métier des routes (`auth.js`, `tasks.js`) dans des contrôleurs dédiés pour améliorer la lisibilité et la maintenabilité.
      - Par exemple, une route comme celle-ci :
        ```javascript
        router.post('/login', (req, res) => {
            users.authenticate(req.body.username, req.body.password, (user) => {
                if (user.connected) {
                    res.redirect('/?userId=' + user.id);
                }
            });
        });
        ```
        serait remplacée par :
        ```javascript
        router.post('/login', authController.login);
        ```
        Le fichier des routes ne gèrerait plus que les définitions des endpoints, et toute la logique métier se trouverait dans `authController`. Par conséquent, si une modification ou un ajout est nécessaire (par exemple, ajouter un système de rôles dans l'authentification), cela peut être réalisé directement dans le contrôleur sans affecter la gestion des routes.
  2. Ajouter des commentaires détaillés sur les fonctions importantes.

- **Tests :**
  1. Mettre en place un framework de test comme Jest pour couvrir :
     - Les modèles (`task.js`, `user.js`).
     - Les routes (`auth.js`, `tasks.js`, `admin.js`).
  2. Ajouter des tests d'intégration pour valider le comportement global de l'application.

- **Organisation :**
  - Revoir l'arborescence pour mieux séparer la logique métier, les modèles, et les routes :
    ```
    src/
      controllers/
      models/
      routes/
      views/
    ```
  - Pour voir une architecture encore plus global pour le projet :
    ```
    src/
      Front/
        views/
      Back/
        config/
        controllers/
        models/
        routes/
        middlewares/
      Docs/
        Phase1/
        Phase2/
        Phase3/
    ```

## Conclusion
La codebase est bien structurée dans l'ensemble, mais souffre de problèmes liés à la sécurité, au manque de tests, et à une architecture perfectible. En priorisant la sécurisation des requêtes SQL, la modularisation des contrôleurs, et l'ajout de tests unitaires, l'application gagnerait en robustesse, maintenabilité, et sécurité.
