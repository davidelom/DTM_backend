# Rapport sur la Sécurité de l'Application

## 1. Méthodes d'attaques testées

### 1.1 Injection SQL

- **Contexte :**
  - Des tests d'injection SQL ont été réalisés sur différents points d'entrée de l'application, notamment les routes de connexion, d'inscription et de gestion des tâches.
  - Tous les champs, sauf ceux liés à la création de tâches, se sont avérés protégés grâce sûrement à l'utilisation de requêtes préparées.

- **Tests sur les autres champs :**
  - **Connexion (`/login`) :**
    - Les champs `username` et `password` ont été testés avec des charges malveillantes, par exemple :
      ```sql
      ' OR '1'='1
      ```
    - Résultat : Échec de l'injection SQL. Les entrées sont correctement traitées à l'aide de requêtes préparées (c'est ce qu'il y a de plus probable).
  - **Inscription (`/register`) :**
    - Les champs `username`, `password`, et `email` ont également été testés pour des injections SQL similaires.
    - Résultat : Aucune vulnérabilité détectée grâce à l'utilisation de requêtes sécurisées.

- **Injection SQL fonctionnelle :**
  - La seule injection ayant fonctionné concerne la route `/tasks` lors de la création d'une tâche.

#### **Exploitation de la route `/tasks`**
- **Méthode :**
  - Une requête POST malveillante a été envoyée à l'URL `http://localhost:3000/tasks?userId=6` avec le corps suivant :
    ```json
    {
        "title": "Task', (SELECT password FROM users WHERE id=1), 0, 6 ); insert into tasks (title, description, completed, user_id) values ('",
        "description": "Provoquer une erreur SQL",
        "completed": 0
    }
    ```
  - La requête injectée exploite le champ `title`, sûrement concaténé directement dans la requête SQL sans protection.

- **Requête SQL générée par le serveur :**
  ```sql
  INSERT INTO tasks (title, description, completed, user_id)
  VALUES ('Task', (SELECT password FROM users WHERE id=1), 0, 6 ); 
  insert into tasks (title, description, completed, user_id) values ('', 'Provoquer une erreur SQL', 0, 6);

- **Comment corriger l'erreur**
  - Remplacer la concaténation par des requêtes préparées comme suûrement pour la connexion et l'inscription qui elles n'étaient pas vulnérables aux attaques à injection SQL.
  - Une requête préparée sépare les données utilisateur de la logique SQL, empêchant toute commande malveillante de s'exécuter.
  - Exemple :
     ```javascript
        const query = 'INSERT INTO tasks (title, description, completed, user_id) VALUES (?, ?, ?, ?)';
     ```

---

### 1.2 Cross-Site Scripting (XSS)

- **Contexte :**
  - Des tests de failles XSS ont été réalisés sur différents champs texte de l'application, notamment ceux liés à la création et à l'affichage des tâches.
  - Tous les champs, y compris ceux affichant les données des tâches, semblent protégés grâce à une gestion correcte des sorties ou à une absence de rendu des balises HTML.

- **Tests effectués :**
  - **Ajout de tâches (`/tasks`) :**
    - Les champs `title` et `description` ont été testés avec des charges malveillantes comme :
      ```html
      <script>alert('XSS')</script>
      ```
    - **Résultat :** Aucun script injecté n'a été exécuté dans la vue HTML. Les balises HTML sont affichées en texte brut ou échappées. En ajoutant simplement des balises bold (<b>) dans un champ, on remarque que les balises HTML sont bien échappées.
  - **Affichage des tâches :**
    - Le rendu dans le tableau des tâches ne permet pas l'exécution de scripts malveillants. Cela indique probablement une gestion sécurisée des données affichées, comme l'échappement des balises HTML dans les vues.

- **XSS non fonctionnel :**
  - Aucun champ testé ne s'est avéré vulnérable aux attaques XSS.

---

### 1.3 Broken Access Control (BAC)
- **Méthode :**
  - Des tests ont été effectués pour vérifier si des contrôles d'accès sont appliqués aux pages et aux ressources de l'application.
  - Ces tests incluent la manipulation des URL, des paramètres, et l'accès direct à des pages ou fonctionnalités supposées restreintes.
  - Exemple :
    - Accès direct à `/tasks?userId=1` en modifiant l'identifiant utilisateur pour visualiser les tâches d'autres utilisateurs.
    - Accès à la partie admninistation en ajoutant dans l'url `/administration` ou `/admin`
#### **Tests effectués :**

1. **Accès direct aux tâches d'autres utilisateurs :**
   - **URL testée :**
     ```
     http://localhost:3000/tasks?userId=1
     ```
   - **Méthode :**
     - Modification du paramètre `userId` dans l'URL pour visualiser les tâches d'autres utilisateurs.
   - **Résultat :**
     - L'attaque a réussi : les tâches de l'utilisateur ayant `id=1` sont accessibles sans aucune vérification d'autorisation.
     - **Problème :**
       - Aucune validation n'est faite pour vérifier si l'utilisateur connecté a les droits pour accéder aux ressources demandées.

2. **Accès à la page administration :**
   - **URL testée :**
     ```
     http://localhost:3000/admin
     ```
   - **Méthode :**
     - Tentative d'accès direct à une page d'administration en testant des URL comme `/admin` et `/administration`.
   - **Résultat :**
     - L'attaque a réussi : la page d'administration est accessible uniquement en connaissant son URL, sans restriction d'accès basée sur le rôle.
     - **Problème :**
       - Tout utilisateur peut visualiser l'ensemble des données des utilisateurs.
       - Aucune fonctionnalité sensible (comme la suppression d'utilisateurs) ne fonctionne, mais cela pourrait être exploité si les routes étaient activées.

#### **Problèmes Identifiés :**

1. **Absence de contrôles d'accès :**
   - Aucune validation n'est mise en place pour restreindre l'accès aux pages ou fonctionnalités selon l'identité ou le rôle de l'utilisateur.

2. **Pages non protégées :**
   - Les pages sensibles comme `/admin` ou les tableaux de bord des utilisateurs sont accessibles à tout utilisateur disposant de l'URL appropriée.

3. **Manque de rôles et permissions :**
   - Les rôles (par exemple, `ROLE_ADMIN`) ne sont pas utilisés pour limiter l'accès à certaines pages ou fonctionnalités.

#### **Comment corriger l'erreur**

1. **Implémenter une gestion des rôles et permissions :**
   - Ajoutez des rôles aux utilisateurs (par exemple, `ROLE_USER`, `ROLE_ADMIN`) et limitez l'accès aux pages et ressources en fonction de ces rôles.
   - Exemple d'implémentation dans Express.js :
     ```javascript
     const authorize = (roles) => (req, res, next) => {
         const userRole = req.user?.role;
         if (!roles.includes(userRole)) {
             return res.status(403).send('Access Denied');
         }
         next();
     };

     app.use('/admin', authorize(['ROLE_ADMIN']));
     ```

2. **Ajouter une vérification d'accès dans les routes :**
   - Par exemple, pour les tâches, vérifiez si l'utilisateur connecté est bien le propriétaire des tâches demandées :
     ```javascript
     router.get('/tasks', (req, res) => {
         const userId = req.user.id;
         if (req.query.userId !== userId.toString()) {
             return res.status(403).send('Access Denied');
         }
     });
     ```

4. **Protéger les URLs sensibles :**
   - Implémentez une logique de session pour limiter l'accès aux pages ou ressources selon l'identité de l'utilisateur.
   - Exemple :
     ```javascript
     app.use((req, res, next) => {
         if (!req.session || !req.session.userId) {
             return res.redirect('/login');
         }
         next();
     });
     ```
---

### 1.4 Exposition des Sessions
- **Contexte :**
  - Les sessions sont utilisées pour gérer l'authentification et la persistance des utilisateurs connectés.
  - Des tests ont été effectués pour analyser la sécurité des cookies de session.

- **Méthode :**
  - Analyse des cookies transmis lors de la connexion pour vérifier s'ils sont correctement sécurisés :
    - Utilisation des attributs `HttpOnly`, `Secure`, et `SameSite`.
    - Test de récupération des cookies via JavaScript injecté (potentiellement via une faille XSS).

- **Résultat :**
  - Les tests indiquent que les sessions ne sont pas correctement initialisées après la connexion ou l'inscription. 
  - Aucune session utilisateur n’est explicitement créée pour persister l'état d'authentification. Par conséquent :
    - L'application ne peut pas vérifier si un utilisateur est authentifié pour accéder à des pages ou ressources protégées.
    - Les cookies de session générés ne contiennent pas d'informations significatives pour identifier l'utilisateur.

- **Impact :**
  - Tout utilisateur ayant l'URL correcte peut accéder à des ressources protégées, même sans être authentifié.
  - Les fonctionnalités nécessitant un état persistant, comme la personnalisation du tableau de bord, ne fonctionnent pas correctement.

- **Recommandations :**
  1. **Créer des sessions utilisateur après connexion :**
     - Lorsqu'un utilisateur se connecte avec succès, associez ses informations (par exemple, `id`, `username`, et `role`) à la session.
       ```javascript
       req.session.user = {
           id: user.id,
           username: user.username,
           role: user.role || 'ROLE_USER'
       };
       ```

  2. **Ajouter une gestion de déconnexion :**
     - Implémentez une route pour supprimer les données de session et invalider les cookies lors de la déconnexion.
       ```javascript
       req.session.destroy((err) => {
           if (err) console.error('Erreur de déconnexion :', err);
           res.redirect('/login');
       });
       ```

  3. **Protéger les routes sensibles :**
     - Utilisez un middleware pour vérifier la présence d’une session utilisateur avant d’autoriser l'accès aux routes sensibles.
       ```javascript
       const authenticate = (req, res, next) => {
           if (req.session && req.session.user) {
               next();
           } else {
               res.status(401).send('Unauthorized: Please log in.');
           }
       };
       ```
  4. **Sécuriser les cookies :**
     - Configurez les attributs `HttpOnly`, `Secure`, et `SameSite` pour empêcher leur accès via des scripts et limiter leur envoi à des requêtes sécurisées.
       ```javascript
       app.use(session({
           secret: 'votre-secret',
           cookie: { httpOnly: true, secure: true, sameSite: 'strict' }
       }));
       ```
---

### 1.5 Absence de Protection CSRF
- **Contexte :**
  - Les attaques CSRF reposent sur l'exploitation des cookies de session pour exécuter des actions non autorisées. Ces attaques permettent à un attaquant d'exploiter la session d'un utilisateur connecté pour effectuer des actions non autorisées.
  - **Note :** L'analyse de l'application a révélé qu'elle ne gère pas de sessions utilisateur. Par conséquent, l'absence de protection CSRF reste une vulnérabilité **théorique** dans l'état actuel de l'application. Cependant, si une gestion des sessions est implémentée à l'avenir, ce risque devra être pris en compte.

- **Méthode :**
  - Simulation d'une requête POST malveillante envoyée depuis un site tiers pour manipuler les données de l'utilisateur connecté.
    - Exemple de formulaire malveillant :
      ```html
      <form action="http://localhost:3000/tasks?userId=6" method="POST">
          <input type="hidden" name="title" value="Tâche malveillante">
          <input type="hidden" name="description" value="Description injectée via CSRF">
          <button type="submit">Soumettre</button>
      </form>
      ```
    - Ce formulaire, hébergé sur un site tiers, profite du fait que le navigateur envoie automatiquement les cookies valides avec la requête.

- **Résultat :**
  - L'attaque a réussi :
    - Une nouvelle tâche (`Tâche malveillante`) a été créée via les cookies de session de la victime, sans intervention de sa part.
    - L'absence de validation côté serveur a permis l'exécution de la requête.

- **Impact :**
  - Un attaquant peut manipuler des données ou exécuter des actions au nom de l'utilisateur connecté, notamment l'ajout ou la modification de tâches.

- **Recommandations :**
  1. **Configurer les cookies avec `SameSite` :**
     - Limitez les envois de cookies aux requêtes provenant du même site :
       ```javascript
       app.use(session({
           secret: 'votre-secret',
           cookie: { sameSite: 'strict' }
       }));
       ```

  2. **Restreindre les origines des requêtes :**
     - Configurez les en-têtes CORS pour limiter les requêtes provenant de sites externes :
       ```javascript
       const cors = require('cors');
       app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
       ```
---
### Conclusion

L'analyse de sécurité de l'application a révélé plusieurs vulnérabilités majeures, comme une injection SQL exploitable sur la création de tâches, un contrôle d'accès insuffisant permettant d'accéder à des données d'autres utilisateurs, et l'absence de gestion des sessions utilisateur. Bien que les risques liés au CSRF soient théoriques en l'absence de sessions, ils devront être pris en compte si une gestion des sessions est implémentée. Il est impératif d'adopter des requêtes préparées, de restreindre l'accès selon les rôles, et d'ajouter une gestion sécurisée des sessions et des permissions pour renforcer la sécurité globale.
