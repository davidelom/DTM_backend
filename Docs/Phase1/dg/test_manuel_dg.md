# Rapport de Test Manuel

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
