/* =========================================================
   CyberQuest – constantes d'affichage
   Le contenu (parcours, questions, équipe, progression…) est
   dans la base Supabase : voir assets/js/db.js et supabase/.
   Les champs ci-dessous marqués « chargé » sont remplis par db.js.
   ========================================================= */

const DATA = {};

/* ---------- Comptes de démonstration (créés par supabase/seed.sql) ---------- */
DATA.demoAccounts = [
  { role: "joueur", name: "Camille Bernard", initials: "CB", email: "camille.bernard@entreprise.fr" },
  { role: "manager", name: "Marc Durand", initials: "MD", email: "marc.durand@entreprise.fr" },
  { role: "admin", name: "Sophie Leroy", initials: "SL", email: "sophie.leroy@entreprise.fr" }
];
DATA.demoPassword = "demo";
DATA.roleLabels = { joueur: "Employé", manager: "Manager", admin: "Administratrice RH" };

/* ---------- Mini-jeu ---------- */
DATA.gameInfo = { parcoursId: "phishing", title: "Mini-jeu · Phishing", minutesPerSituation: 3 };

/* ---------- Administration : listes des formulaires ---------- */
DATA.formats = ["Mail", "Message vocal", "QR code", "Conversation", "Image", "Vidéo"];
DATA.notionsList = ["Phishing", "Mots de passe", "Pièces jointes", "Faux QR codes", "Deepfakes vocaux", "IA générative"];

/* ---------- Chargé depuis la base ---------- */
DATA.parcours = [];     // parcours de la formation
DATA.quizLibrary = [];  // quiz assignables
DATA.people = [];       // profils visibles par l'utilisateur connecté
DATA.me = null;         // l'utilisateur connecté, avec sa progression
DATA.team = [];         // l'équipe du manager (tout le monde pour l'admin)
DATA.teamNotions = [];  // notions les plus ratées par l'équipe
DATA.themes = [];       // page « Mes parcours »
DATA.game = null;       // situations du mini-jeu
DATA.history = [];      // parties jouées par l'utilisateur connecté
