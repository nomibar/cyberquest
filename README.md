# CyberQuests – prototype statique

Site HTML / CSS / JavaScript sans base de données ni serveur.
Les données sont fictives (`assets/js/data.js`) et les actions (quiz assignés, questions ajoutées, progression du jeu) sont enregistrées dans le navigateur (localStorage).

## Site en ligne
https://nomibar.github.io/cyberquest/

## Lancer le site en local
Ouvrir `index.html` dans un navigateur (Chrome, Edge, Firefox).
Option : `python -m http.server` dans ce dossier, puis http://localhost:8000.

## Comptes de démonstration
Sur la page de connexion, cliquer sur un des 3 comptes, ou saisir l'email avec le mot de passe `demo` :

| Rôle | Email |
|---|---|
| Employé (joueur) | camille.bernard@entreprise.fr |
| Manager | marc.durand@entreprise.fr |
| Administratrice RH | sophie.leroy@entreprise.fr |

Pour revenir à l'état de départ : vider le stockage du site dans le navigateur (outils de développement → Application → Local Storage).

## Pages
| Fichier | Écran |
|---|---|
| `index.html` | Landing page |
| `connexion.html` | Connexion (avec message d'erreur) |
| `accueil.html` | Mes parcours (thèmes et quiz) |
| `jeu.html` | Mini-jeu phishing → explication de l'erreur → question de vérification → résultat |
| `progression.html` | Ma progression |
| `equipe.html` | Tableau de bord manager (notions les plus ratées, liste des collaborateurs) |
| `collaborateur.html?id=cb` | Détail d'un collaborateur + ajout de quiz |
| `admin.html` | Gestion des parcours (suppression avec confirmation) |
| `admin-question.html` | Nouvelle question / modification |
| `admin-apercu.html?id=…` | Aperçu avant publication |

## Structure
```
assets/css/style.css   styles communs (couleurs et typographie de la charte)
assets/js/data.js      données fictives
assets/js/app.js       fonctions communes : session, header, icônes, modale, toast, stockage
assets/img/logo.png    logo
```
