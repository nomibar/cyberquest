# CyberQuests

Site HTML / CSS / JavaScript hébergé sur GitHub Pages, avec une base de données [Supabase](https://supabase.com) (PostgreSQL) pour les comptes, le contenu des parcours, la progression et les quiz assignés.

## Site en ligne
https://nomibar.github.io/cyberquest/

## Base de données (Supabase)

### Installation
1. Créer un projet gratuit sur https://supabase.com.
2. **SQL Editor → New query** : coller et exécuter `supabase/schema.sql`, puis `supabase/seed.sql`.
3. **Project Settings → API** : copier « Project URL » et la clé « anon public » (ou « Publishable key ») dans `assets/js/config.js`.
4. **Authentication → URL Configuration** :
   - *Site URL* : `https://nomibar.github.io/cyberquest/`
   - *Redirect URLs* : ajouter `https://nomibar.github.io/cyberquest/connexion.html` et `http://localhost:8000/connexion.html`

La clé « anon » est publique par conception : ce sont les règles RLS (Row Level Security) de `schema.sql` qui protègent les données.

### Tables
| Table | Contenu |
|---|---|
| `profiles` | Un profil par compte : nom, poste, service, rôle (`joueur`, `manager`, `admin`), manager |
| `themes`, `theme_quizzes` | Thèmes et quiz de la page « Mes parcours » |
| `parcours` | Parcours de la formation obligatoire |
| `quiz_library` | Quiz qu'un manager peut assigner |
| `questions` | Questions des parcours (brouillon / publié) |
| `game_situations` | Situations du mini-jeu (contenu en JSON) |
| `parcours_completions` | Parcours terminés par chaque personne |
| `weak_notions` | Notions à revoir |
| `game_results` | Parties jouées et scores |
| `assignments` | Quiz assignés par un manager |

### Qui voit quoi (RLS)
- **Employé** : son profil, sa progression, ses scores, ses quiz assignés ; les questions publiées.
- **Manager** : en plus, le profil, l'avancement, les notions à revoir et les quiz assignés de son équipe (pas les scores détaillés) ; il peut assigner et retirer des quiz.
- **Admin RH** : tout le monde ; elle crée, modifie, publie et supprime les questions.

### Comptes
- **Inscription libre** depuis la page de connexion : le compte est créé avec le rôle « Employé » après confirmation par mail.
- Pour changer un rôle ou rattacher quelqu'un à un manager : Supabase → **Table Editor → profiles**, colonnes `role` et `manager_id`.

## Comptes de démonstration
Créés par `seed.sql`. Sur la page de connexion, cliquer sur un des 3 comptes, ou saisir l'email avec le mot de passe `demo` :

| Rôle | Email |
|---|---|
| Employé (joueur) | camille.bernard@entreprise.fr |
| Manager | marc.durand@entreprise.fr |
| Administratrice RH | sophie.leroy@entreprise.fr |

⚠️ Le mot de passe est public : n'importe qui peut se connecter en admin et modifier les questions. Pour fermer l'accès, supprimer ces comptes dans Supabase → Authentication → Users.

## Lancer le site en local
Dans ce dossier : `python -m http.server`, puis http://localhost:8000.

## Pages
| Fichier | Écran |
|---|---|
| `index.html` | Landing page |
| `connexion.html` | Connexion, inscription, mot de passe oublié |
| `accueil.html` | Mes parcours (thèmes et quiz) |
| `jeu.html` | Mini-jeu phishing → explication de l'erreur → question de vérification → résultat |
| `progression.html` | Ma progression |
| `equipe.html` | Tableau de bord manager (notions les plus ratées, liste des collaborateurs) |
| `collaborateur.html?id=…` | Détail d'un collaborateur + ajout de quiz |
| `admin.html` | Gestion des parcours (suppression avec confirmation) |
| `admin-question.html` | Nouvelle question / modification |
| `admin-apercu.html?id=…` | Aperçu avant publication |

## Structure
```
assets/css/style.css   styles communs (couleurs et typographie de la charte)
assets/js/config.js    adresse et clé publique du projet Supabase
assets/js/data.js      constantes d'affichage (comptes démo, listes des formulaires)
assets/js/app.js       fonctions communes : session, header, icônes, modale, toast
assets/js/db.js        accès à la base : chargement des données, démarrage des pages
assets/img/logo.png    logo
supabase/schema.sql    tables, règles de sécurité (RLS), triggers
supabase/seed.sql      données de départ (contenu, comptes de démo, équipe)
```
