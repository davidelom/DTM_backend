# Rapport de Tests de Sécurité

## Tests de Vulnérabilités

| Type d'Attaque             | Localisation du Test                                                  | Méthode d'Attaque                                                                                                                                                                              | Résultat     | Impact                                                                                                                      |
| -------------------------- | --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | --------------------------------------------------------------------------------------------------------------------------- |
| Cross-Site Scripting (XSS) | • Formulaire de création de tâche  • Champ titre  • Champ description | • Injection de `<script>alert('XSS')</script>` dans le titre  • Injection de `<img src="x" onerror="alert('XSS')">` dans la description  • Le code est exécuté lors de l'affichage de la tâche | 🔴 Vulnérable | • Le code JavaScript malveillant est exécuté  • Possible vol de cookies de session  • Modification du contenu de la page    |
| Injection SQL              | • Page de connexion  • Liste des tâches                               | • Tentative avec `' OR '1'='1` dans le login  • Modification de l'ID dans l'URL  • Test avec `1 UNION SELECT * FROM users`                                                                     | 🔴 Vulnérable | • Connexion possible sans identifiants valides  • Accès aux données d'autres utilisateurs  • Possible extraction de la base |
| Broken Access Control      | • Navigation directe  • Accès aux pages protégées                     | • Accès à la liste des tâches sans connexion  • Modification des identifiants dans l'URL  • Tentative d'accès à la partie admin                                                                | 🔴 Vulnérable | • Accès aux tâches sans authentification  • Visualisation des tâches d'autres utilisateurs  • Pas de vérification de rôle   |
| Sensitive Data Exposure    | • Barre d'adresse  • Console développeur  • Stockage local            | • Inspection des réponses réseau  • Analyse du stockage du navigateur  • Observation des identifiants visibles                                                                                 | 🔴 Vulnérable | • Identifiants techniques exposés  • Données sensibles en clair  • Pas de HTTPS                                             |
| Improper Input Validation  | • Tous les formulaires de l'application                               | • Test avec caractères spéciaux `<>'"%;`  • Tentative avec très longues chaînes  • Envoi de types invalides                                                                                    | 🔴 Vulnérable | • Aucune validation côté serveur  • Pas de limite de taille  • Accepte tous les types                                       |
| Broken Authentication      | • Système de connexion  • Bouton déconnexion                          | • Analyse des cookies dans le navigateur  • Test du bouton déconnexion  • Manipulation des informations de session                                                                             | 🔴 Vulnérable | • Session non sécurisée  • Pas de déconnexion réelle  • Tokens non utilisés                                                 |

## Détails des Tests Effectués

### Test XSS

1. Création d'une nouvelle tâche avec du code JavaScript malveillant
2. Vérification de l'exécution lors de l'affichage
3. Test de différents vecteurs d'injection (attributs, scripts, événements)

### Test Injection SQL Détaillé

#### Sur la page de connexion

1. Dans le champ "email" :
   - Test : `' OR '1'='1`
   - Résultat : Erreur Node.js - TypeError: Cannot read properties of undefined (reading 'password')
   - L'application crash au lieu de gérer l'erreur proprement

2. Dans le champ "password" :
   - Test : `' OR '1'='1`
   - Résultat : Même erreur, l'application crash

#### Vulnérabilités identifiées

- Pas de validation des entrées
- Les erreurs SQL ne sont pas gérées
- L'application expose des erreurs techniques aux utilisateurs
- Vulnérable aux attaques par déni de service (DoS) via injection SQL malformée

#### Impact

- Possibilité de crasher l'application
- Exposition d'informations techniques sensibles
- Pas de protection contre les injections SQL
- Risque de DoS (Denial of Service)

#### Recommandations spécifiques

1. Valider et assainir les entrées utilisateur
2. Utiliser des requêtes préparées
3. Gérer proprement les erreurs sans exposer les détails techniques
4. Implémenter un système de rate limiting
5. Ajouter des logs pour détecter les tentatives d'injection

### Test Contrôle d'Accès

1. Tentative d'accès direct aux URLs protégées
2. Modification des IDs dans l'URL
3. Test d'accès aux fonctionnalités admin

### Test Validation des Entrées Détaillé

#### Sur le formulaire de création de tâche

1. Test avec caractères spéciaux :
   - Input testé : `<>'"%;`
   - Résultat : Les caractères sont acceptés et insérés directement dans la base
   - Query SQL générée : `INSERT INTO tasks (title, description, completed, user_id) VALUES ('<>'"%;',' <>'"%;', 0, 1 )`

#### Vulnérabilités identifiées

- Aucune validation ou échappement des caractères spéciaux
- Les caractères SQL dangereux sont acceptés
- Insertion directe des valeurs dans les requêtes SQL
- Pas de protection contre les injections SQL
- Pas de limite sur la longueur des entrées

#### Impact

- Risque d'injection SQL via les champs de formulaire
- Possibilité d'injecter du HTML/JavaScript malveillant
- Risque de corruption de la base de données
- Vulnérabilité aux attaques XSS stockées

#### Recommandations spécifiques

1. Implémenter une validation stricte des entrées
2. Échapper les caractères spéciaux
3. Utiliser des requêtes préparées
4. Définir des limites de longueur pour les champs
5. Filtrer les balises HTML dangereuses

## Points de Vigilance dans le Code

### Sécurité Générale

- Vérifier la configuration des en-têtes HTTP de sécurité
- Implémenter une politique de mots de passe forts
- Mettre en place une journalisation des événements de sécurité

### Validation des Données

- Valider toutes les entrées côté serveur
- Échapper les sorties HTML
- Vérifier les types et formats de données

### Authentification et Sessions

- Implémenter une gestion de session sécurisée
- Ajouter des tokens CSRF
- Gérer correctement les déconnexions

### Base de Données

- Utiliser des requêtes préparées
- Chiffrer les données sensibles
- Limiter les privilèges des utilisateurs DB

## Recommandations Prioritaires

1. 🚨 Sécuriser l'authentification et les sessions
2. 🔒 Protéger contre les injections (SQL, XSS)
3. 🛡️ Implémenter les middlewares de sécurité
4. 🔑 Mettre en place la gestion des permissions
5. 📝 Ajouter la journalisation des tentatives d'attaque
6. 🔐 Chiffrer les données sensibles
7. 🌐 Forcer l'utilisation de HTTPS

## Conclusion

L'application présente de nombreuses vulnérabilités critiques qui doivent être corrigées avant toute mise en production. Les tests ont révélé des failles de sécurité importantes dans plusieurs domaines clés (authentification, validation des entrées, contrôle d'accès). Une refonte significative des mécanismes de sécurité est nécessaire.
