/* =========================================================
   CyberQuest – données fictives (aucune base de données)
   Tout est en mémoire ; les modifications sont enregistrées
   dans le navigateur (localStorage) par app.js.
   ========================================================= */

const DATA = {};

/* ---------- Comptes de démonstration ---------- */
DATA.users = {
  joueur: {
    id: "cb", role: "joueur", name: "Camille Bernard", initials: "CB",
    email: "camille.bernard@entreprise.fr", job: "Assistante commerciale"
  },
  manager: {
    id: "md", role: "manager", name: "Marc Durand", initials: "MD",
    email: "marc.durand@entreprise.fr", job: "Responsable du service commercial"
  },
  admin: {
    id: "sl", role: "admin", name: "Sophie Leroy", initials: "SL",
    email: "sophie.leroy@entreprise.fr", job: "Service RH"
  }
};
DATA.demoPassword = "demo";
DATA.roleLabels = { joueur: "Employé", manager: "Manager", admin: "Administratrice RH" };

/* ---------- Page d'accueil joueur : thèmes et quiz ---------- */
DATA.themes = [
  {
    id: "cyber", name: "Cybersécurité", icon: "cpu",
    quizzes: [
      { title: "Menaces & vulnérabilités", questions: 10, level: "Intermédiaire" },
      { title: "Cryptographie & authentification", questions: 15, level: "Avancé" },
      { title: "Sécurité des données", questions: 12, level: "Débutant" },
      { title: "Phishing : repérer les faux mails", questions: 5, level: "Débutant" }
    ]
  },
  {
    id: "info", name: "Informatique", icon: "book",
    quizzes: [
      { title: "Algorithmes & complexité", questions: 8, level: "Débutant" },
      { title: "Réseaux & protocoles", questions: 10, level: "Intermédiaire" },
      { title: "Bases de données", questions: 9, level: "Intermédiaire" }
    ]
  },
  {
    id: "ia", name: "Intelligence artificielle", icon: "flask",
    quizzes: [
      { title: "Apprentissage automatique", questions: 12, level: "Intermédiaire" },
      { title: "Vision par ordinateur", questions: 15, level: "Avancé" },
      { title: "IA générative & chatbots", questions: 8, level: "Débutant" },
      { title: "Deepfakes vocaux", questions: 6, level: "Débutant" },
      { title: "Éthique de l'IA", questions: 10, level: "Intermédiaire" }
    ]
  }
];

/* ---------- Parcours de la formation obligatoire ---------- */
DATA.parcours = [
  { id: "phishing", name: "Phishing", games: 5 },
  { id: "mdp", name: "Mots de passe", games: 4 },
  { id: "pj", name: "Pièces jointes suspectes", games: 5 },
  { id: "qr", name: "Faux QR codes", games: 4 },
  { id: "ia", name: "IA & deepfakes", games: 4 }
];
DATA.doneDates = ["8 oct.", "12 oct.", "15 oct.", "18 oct.", "20 oct."];

/* ---------- Bibliothèque de quiz assignables (manager) ---------- */
DATA.quizLibrary = [
  { id: "pj", name: "Pièces jointes suspectes", games: 5, minutes: 10, notion: "Pièces jointes" },
  { id: "qr", name: "Faux QR codes", games: 4, minutes: 8, notion: "Faux QR codes" },
  { id: "mdp", name: "Mots de passe", games: 4, minutes: 8, notion: "Mots de passe" },
  { id: "deepfake", name: "Deepfakes vocaux", games: 3, minutes: 6, notion: "Deepfakes" }
];

/* ---------- Équipe du manager (service commercial) ----------
   done   : nombre de parcours terminés (dans l'ordre de DATA.parcours)
   notions: notions à revoir (ids de quizLibrary)                    */
DATA.team = [
  { id: "cb", initials: "CB", name: "Camille Bernard", job: "Assistante commerciale", done: 3, notions: ["pj"], last: "Aujourd'hui" },
  { id: "hd", initials: "HD", name: "Hugo Dubois", job: "Commercial terrain", done: 2, notions: ["pj", "qr"], last: "Il y a 2 jours" },
  { id: "if", initials: "IF", name: "Inès Fontaine", job: "Assistante commerciale", done: 5, notions: [], last: "Hier" },
  { id: "jg", initials: "JG", name: "Julien Garnier", job: "Chargé de clientèle", done: 3, notions: ["qr"], last: "Il y a 5 jours" },
  { id: "lm", initials: "LM", name: "Léa Martin", job: "Assistante commerciale", done: 1, notions: ["pj"], last: "Il y a 1 semaine" },
  { id: "np", initials: "NP", name: "Nicolas Petit", job: "Commercial sédentaire", done: 3, notions: ["pj"], last: "Hier" },
  { id: "sr", initials: "SR", name: "Sarah Roux", job: "Chargée de clientèle", done: 0, notions: [], last: "—" },
  { id: "tv", initials: "TV", name: "Thomas Vincent", job: "Commercial terrain", done: 4, notions: ["qr"], last: "Il y a 3 jours" }
];

/* Statistiques anonymisées de l'équipe, de la notion la plus ratée à la moins ratée */
DATA.teamNotions = [
  { id: "pj", label: "Pièces jointes suspectes", rate: 60 },
  { id: "qr", label: "Faux QR codes", rate: 45 },
  { id: "mdp", label: "Mots de passe", rate: 20 }
];

/* ---------- Mini-jeu « Phishing » : situations ---------- */
DATA.game = {
  title: "Mini-jeu · Phishing",
  minutesPerSituation: 3,
  situations: [
    {
      id: "prime",
      subject: "URGENT – Validation de votre prime avant 12h",
      fromName: "Direction Générale",
      fromInitials: "DG",
      fromAddr: "direction@entreprlse-rh.com",
      fromHint: 1,
      date: "Aujourd'hui, 10:47",
      body: [
        { text: "Bonjour," },
        { text: "Suite à la réorganisation, votre prime annuelle doit être validée avant 12h aujourd'hui, sinon elle sera définitivement perdue.", hint: 2 }
      ],
      cta: { label: "Valider ma prime", real: "http://prime-validation.co/login", hint: 3 },
      signature: { text: "Merci de ne pas en parler à vos collègues avant validation.\nCordialement,\nLa Direction", hint: 4 },
      choices: [
        { icon: "link", label: "Cliquer sur le lien", desc: "Valider la prime tout de suite", correct: false },
        { icon: "reply", label: "Répondre au mail", desc: "Demander plus d'informations", correct: false },
        { icon: "flag", label: "Signaler le mail", desc: "Prévenir le service informatique", correct: true }
      ],
      hints: [
        { title: "L'adresse de l'expéditeur", desc: "« entreprlse » contient un « l » à la place du « i ». Les pirates imitent les vraies adresses." },
        { title: "L'urgence", desc: "« Avant 12h, sinon c'est perdu » : on vous presse pour vous empêcher de réfléchir." },
        { title: "Le lien", desc: "Le texte affiché ne correspond pas à l'adresse réelle, visible en survolant le lien." },
        { title: "Le ton inhabituel", desc: "Demander de ne pas en parler aux collègues est un signal d'alerte classique." }
      ],
      reflexe: "Vérifiez l'expéditeur, survolez le lien sans cliquer, et en cas de doute signalez le mail au service informatique.",
      verif: {
        question: "Quel indice aurait dû vous alerter en premier ?",
        options: [
          "L'adresse de l'expéditeur contient une faute (entreprlse)",
          "Le mail est écrit en français",
          "Le mail est arrivé le matin",
          "Le bouton est de couleur bleue"
        ],
        correct: 0,
        explanation: "Vérifier l'adresse de l'expéditeur est le premier réflexe : c'est le plus rapide et le plus fiable."
      }
    },
    {
      id: "colis",
      subject: "Votre colis n'a pas pu être livré",
      fromName: "Service Livraison",
      fromInitials: "SL",
      fromAddr: "noreply@livraison-express-fr.net",
      fromHint: 1,
      date: "Aujourd'hui, 14:12",
      body: [
        { text: "Cher client,", hint: 2 },
        { text: "Nous n'avons pas pu livrer votre colis. Ouvrez le bon de livraison joint pour reprogrammer la livraison sous 48h." }
      ],
      attachment: { name: "Bon_livraison_7741.zip", size: "214 Ko", hint: 3 },
      signature: { text: "Sans action de votre part, le colis sera renvoyé à l'expéditeur.\nL'équipe Livraison", hint: 4 },
      choices: [
        { icon: "paperclip", label: "Ouvrir la pièce jointe", desc: "Reprogrammer la livraison", correct: false },
        { icon: "reply", label: "Répondre au mail", desc: "Demander le numéro de suivi", correct: false },
        { icon: "flag", label: "Signaler le mail", desc: "Prévenir le service informatique", correct: true }
      ],
      hints: [
        { title: "Un expéditeur inconnu", desc: "Une adresse « noreply » d'un transporteur que vous ne connaissez pas, sans lien avec une commande." },
        { title: "Une formule générique", desc: "« Cher client » : un vrai transporteur connaît votre nom." },
        { title: "Une pièce jointe .zip", desc: "Un bon de livraison n'est jamais un .zip. Ce type de fichier peut cacher un programme malveillant." },
        { title: "La pression", desc: "« Sans action de votre part… » : encore une fois, on vous pousse à agir vite." }
      ],
      reflexe: "N'ouvrez jamais une pièce jointe inattendue. Vérifiez votre commande directement sur le site du transporteur.",
      verif: {
        question: "Qu'est-ce qui rendait la pièce jointe suspecte ?",
        options: [
          "Son nom contient un numéro",
          "C'est un fichier .zip inattendu",
          "Elle pèse 214 Ko",
          "Elle est arrivée l'après-midi"
        ],
        correct: 1,
        explanation: "Un fichier compressé (.zip) reçu sans l'avoir demandé est un des moyens les plus courants de diffuser un virus."
      }
    },
    {
      id: "mdp",
      subject: "Votre mot de passe expire dans 24h",
      fromName: "Support Informatique",
      fromInitials: "SI",
      fromAddr: "support@entreprise-helpdesk.com",
      fromHint: 1,
      date: "Hier, 17:30",
      body: [
        { text: "Bonjour," },
        { text: "Votre mot de passe expire dans 24h. Pour garder l'accès à votre messagerie, confirmez votre mot de passe actuel sur la page sécurisée.", hint: 2 }
      ],
      cta: { label: "Conserver mon mot de passe", real: "http://securite-compte365.info/verif", hint: 3 },
      signature: { text: "Le Support Informatique\nCe message est automatique, merci de ne pas y répondre.", hint: 4 },
      choices: [
        { icon: "link", label: "Cliquer sur le lien", desc: "Confirmer mon mot de passe", correct: false },
        { icon: "reply", label: "Répondre au mail", desc: "Envoyer mon mot de passe au support", correct: false },
        { icon: "flag", label: "Signaler le mail", desc: "Prévenir le service informatique", correct: true }
      ],
      hints: [
        { title: "Un faux domaine", desc: "« entreprise-helpdesk.com » n'est pas l'adresse habituelle de votre entreprise." },
        { title: "La demande du mot de passe", desc: "Le service informatique ne vous demande jamais votre mot de passe, ni par mail ni par téléphone." },
        { title: "Le lien", desc: "L'adresse réelle mène vers un site externe sans rapport avec votre entreprise." },
        { title: "Impossible de vérifier", desc: "« Merci de ne pas répondre » vous empêche de poser la question au vrai support." }
      ],
      reflexe: "En cas de doute, contactez le service informatique par un moyen que vous connaissez déjà (téléphone interne, intranet).",
      verif: {
        question: "Que ne vous demandera jamais le service informatique ?",
        options: [
          "De redémarrer votre ordinateur",
          "D'installer une mise à jour",
          "De lui communiquer votre mot de passe",
          "De signaler un mail suspect"
        ],
        correct: 2,
        explanation: "Votre mot de passe est personnel : personne, pas même le support, n'a besoin de le connaître."
      }
    }
  ]
};

/* ---------- Administration : questions des parcours ---------- */
DATA.formats = ["Mail", "Message vocal", "QR code", "Conversation", "Image", "Vidéo"];
DATA.notionsList = ["Phishing", "Mots de passe", "Pièces jointes", "Faux QR codes", "Deepfakes vocaux", "IA générative"];

DATA.questions = [
  { id: "q1", parcours: "phishing", titre: "Faux mail de la direction (prime)", format: "Mail", statut: "publie" },
  { id: "q2", parcours: "phishing", titre: "Colis non livré avec pièce jointe", format: "Mail", statut: "publie" },
  { id: "q3", parcours: "phishing", titre: "Mot de passe qui expire", format: "Mail", statut: "publie" },
  { id: "q4", parcours: "phishing", titre: "Facture d'un fournisseur inconnu", format: "Mail", statut: "publie" },
  { id: "q5", parcours: "phishing", titre: "SMS de la banque", format: "Conversation", statut: "brouillon" },
  { id: "q6", parcours: "mdp", titre: "Choisir une phrase de passe", format: "Conversation", statut: "publie" },
  { id: "q7", parcours: "mdp", titre: "Mot de passe noté sur un post-it", format: "Image", statut: "publie" },
  { id: "q8", parcours: "mdp", titre: "Même mot de passe partout", format: "Conversation", statut: "publie" },
  { id: "q9", parcours: "mdp", titre: "Activer la double authentification", format: "Conversation", statut: "publie" },
  { id: "q10", parcours: "pj", titre: "Fichier .zip inattendu", format: "Mail", statut: "publie" },
  { id: "q11", parcours: "pj", titre: "Document Word avec macros", format: "Mail", statut: "publie" },
  { id: "q12", parcours: "pj", titre: "Facture en .exe", format: "Mail", statut: "publie" },
  { id: "q13", parcours: "pj", titre: "Lien de partage de fichiers", format: "Mail", statut: "publie" },
  { id: "q14", parcours: "pj", titre: "Clé USB trouvée sur le parking", format: "Image", statut: "publie" },
  { id: "q15", parcours: "qr", titre: "QR code collé sur un parcmètre", format: "QR code", statut: "publie" },
  { id: "q16", parcours: "qr", titre: "QR code reçu par courrier", format: "QR code", statut: "publie" },
  { id: "q17", parcours: "qr", titre: "QR code dans un mail", format: "Mail", statut: "publie" },
  { id: "q18", parcours: "qr", titre: "Menu de restaurant modifié", format: "QR code", statut: "brouillon" },
  {
    id: "q19", parcours: "ia", titre: "Reconnaître un faux QR code sur une affiche", format: "QR code", statut: "publie",
    notion: "Faux QR codes",
    situation: "Une affiche dans le hall propose de scanner un QR code pour « gagner une carte cadeau ».",
    reponses: ["Scanner le QR code", "Prévenir l'accueil ou le service informatique", "Prendre une photo pour plus tard"],
    correct: 1,
    explication: "Un QR code peut mener vers un faux site. Avant de scanner, vérifiez qui a posé l'affiche."
  },
  {
    id: "q20", parcours: "ia", titre: "Un chatbot vous demande vos identifiants", format: "Conversation", statut: "publie",
    notion: "IA générative",
    situation: "Un assistant en ligne vous demande votre identifiant et votre mot de passe pour « finaliser votre demande ».",
    reponses: ["Donner mes identifiants", "Fermer la conversation et prévenir le support", "Donner seulement mon identifiant"],
    correct: 1,
    explication: "Aucun assistant légitime ne demande votre mot de passe."
  },
  {
    id: "q21", parcours: "ia", titre: "Photo truquée d'un dirigeant sur LinkedIn", format: "Image", statut: "publie",
    notion: "IA générative",
    situation: "Une photo de votre PDG annonçant un jeu concours circule sur LinkedIn.",
    reponses: ["Partager la publication", "Vérifier sur le compte officiel de l'entreprise", "Participer au concours"],
    correct: 1,
    explication: "L'IA permet de créer de fausses images très réalistes : vérifiez toujours la source officielle."
  },
  {
    id: "q22", parcours: "ia", titre: "Vidéo deepfake en visioconférence", format: "Vidéo", statut: "brouillon",
    notion: "Deepfakes vocaux",
    situation: "En visio, un « directeur » à l'image un peu floue vous demande un virement urgent.",
    reponses: ["Faire le virement", "Raccrocher et rappeler le directeur sur son numéro habituel", "Demander un mail de confirmation"],
    correct: 1,
    explication: "Une vidéo peut être truquée en direct. Confirmez toujours par un autre canal."
  }
];
