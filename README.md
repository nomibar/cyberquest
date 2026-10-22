# CyberQuests – prototype statique

Site HTML / CSS / JavaScript sans base de données ni serveur applicatif.
Le contenu est dans des fichiers JSON (`data/`) et les actions (connexion, progression du jeu, quiz assignés, questions ajoutées) sont enregistrées dans le navigateur (localStorage) : chacun ne voit que ce qui a été fait sur son propre navigateur.

## Site en ligne
https://nomibar.github.io/cyberquest/

## Lancer le site en local
Dans ce dossier : `python -m http.server 8000`, puis http://localhost:8000.

Le site doit être ouvert via un serveur (et non en double-cliquant sur `index.html`), car le navigateur refuse de lire les fichiers JSON depuis le disque.

## Comptes de démonstration
Sur la page de connexion, cliquer sur un des 3 comptes, ou saisir l'email avec le mot de passe `demo` :

| Rôle | Email |
|---|---|
| Employé (joueur) | camille.bernard@entreprise.fr |
| Manager | marc.durand@entreprise.fr |
| Administratrice RH | sophie.leroy@entreprise.fr |

Pour revenir à l'état de départ : vider le stockage du site dans le navigateur (outils de développement → Application → Local Storage).

## Données (`data/`)
| Fichier | Contenu |
|---|---|
| `people.json` | Comptes et équipe : rôle, poste, manager, parcours terminés (il y a N jours), notions à revoir |
| `themes.json` | Thèmes et quiz de la page « Mes parcours » |
| `parcours.json` | Parcours de la formation obligatoire |
| `quiz-library.json` | Quiz qu'un manager peut assigner |
| `questions.json` | Questions des parcours (brouillon / publié) |
| `game.json` | Situations du mini-jeu Phishing |

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
assets/js/data.js      constantes d'affichage (comptes démo, listes des formulaires)
assets/js/app.js       fonctions communes : session, header, icônes, modale, toast, stockage
assets/js/db.js        chargement des JSON, progression enregistrée, démarrage des pages
assets/img/logo.png    logo
data/*.json            contenu du site
```
