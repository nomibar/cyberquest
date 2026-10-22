/* =========================================================
   CyberQuest – accès aux données
   Le contenu est lu dans data/*.json ; les actions (connexion,
   progression, quiz assignés, questions modifiées) sont
   enregistrées dans le navigateur (localStorage).
   ========================================================= */

async function loadJSON(name) {
  const res = await fetch(`data/${name}.json`);
  if (!res.ok) throw new Error(`data/${name}.json introuvable (${res.status})`);
  return res.json();
}

/* ---------- Mise en forme ---------- */
const daysAgo = n => new Date(Date.now() - n * 86400000).toISOString();

function initialsOf(name) {
  return String(name || "?").split(/[\s.-]+/).filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join("");
}

function shortDate(iso) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

function dateLabel(iso) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}

function lastSeenLabel(iso) {
  if (!iso) return "—";
  const days = Math.floor((Date.now() - new Date(iso)) / 86400000);
  if (days < 1) return "Aujourd'hui";
  if (days === 1) return "Hier";
  if (days < 7) return `Il y a ${days} jours`;
  const weeks = Math.floor(days / 7);
  return weeks === 1 ? "Il y a 1 semaine" : `Il y a ${weeks} semaines`;
}

/* ---------- Progression enregistrée dans le navigateur ---------- */
const Progress = {
  completions(userId) { return Store.get("cq_completions_" + userId, {}); },
  complete(userId, parcoursId) {
    const done = this.completions(userId);
    if (!done[parcoursId]) done[parcoursId] = new Date().toISOString();
    Store.set("cq_completions_" + userId, done);
  },
  history(userId) { return Store.get("cq_history_" + userId, []); },
  addResult(userId, result) {
    Store.set("cq_history_" + userId, [...this.history(userId), { date: new Date().toISOString(), ...result }]);
  }
};

/* Personne de data/people.json, complétée par ce qui a été joué dans ce navigateur */
function toPerson(p) {
  const completed = {};
  Object.entries(p.completedDaysAgo).forEach(([id, n]) => { completed[id] = daysAgo(n); });
  /* Un parcours rejoué garde sa première date de fin */
  Object.entries(Progress.completions(p.id)).forEach(([id, date]) => { if (!completed[id]) completed[id] = date; });
  const lastSeen = Store.get("cq_last_seen_" + p.id, null) || (p.lastSeenDaysAgo === null ? null : daysAgo(p.lastSeenDaysAgo));
  return {
    id: p.id, role: p.role, name: p.name, initials: initialsOf(p.name), email: p.email,
    job: p.job, service: p.service, managerId: p.managerId,
    completed, notions: p.notions, last: lastSeenLabel(lastSeen)
  };
}

/* ---------- Connexion de démonstration ---------- */
const Auth = {
  async login(email, password) {
    const people = await loadJSON("people");
    const p = people.find(x => x.email === email);
    if (!p || password !== DATA.demoPassword) return null;
    Store.set("cq_session", p.id);
    return p;
  },
  logout() { Store.remove("cq_session"); }
};

/* ---------- Chargement ---------- */
const LOADERS = {
  async themes() { DATA.themes = await loadJSON("themes"); },
  async game() { DATA.game = await loadJSON("game"); },
  async history() {
    DATA.history = Progress.history(Session.user().id).map(h => ({ date: dateLabel(h.date), firstTry: h.firstTry, total: h.total }));
  },
  async questions() { Questions.list = Store.get("cq_questions", null) || await loadJSON("questions"); }
};

async function loadData(user, people, extra) {
  const [parcours, library] = await Promise.all([
    loadJSON("parcours"),
    loadJSON("quiz-library"),
    ...extra.map(name => LOADERS[name]())
  ]);
  DATA.parcours = parcours;
  DATA.quizLibrary = library;
  Assignments.list = Store.get("cq_assignments", []);

  DATA.people = people.map(p => ({ ...p, done: DATA.parcours.filter(x => p.completed[x.id]).length }));
  DATA.me = DATA.people.find(p => p.id === user.id);
  DATA.team = DATA.people
    .filter(p => p.id !== user.id && (user.role === "admin" || p.managerId === user.id));

  /* Part de l'équipe qui doit revoir chaque notion, de la plus ratée à la moins ratée */
  DATA.teamNotions = DATA.team.length ? DATA.quizLibrary
    .map(z => ({ id: z.id, label: z.name, rate: Math.round(100 * DATA.team.filter(p => p.notions.includes(z.id)).length / DATA.team.length) }))
    .filter(n => n.rate > 0)
    .sort((a, b) => b.rate - a.rate)
    .slice(0, 3) : [];
}

/* ---------- Démarrage d'une page ----------
   roles : rôles autorisés (null = tout utilisateur connecté)
   extra : données en plus à charger (voir LOADERS)              */
async function boot(roles, page, extra = []) {
  try {
    const id = Store.get("cq_session", null);
    if (!id) { location.replace("connexion.html"); return; }
    const people = (await loadJSON("people")).map(toPerson);
    const user = people.find(p => p.id === id);
    if (!user) { Auth.logout(); location.replace("connexion.html"); return; }
    if (roles && !roles.includes(user.role)) { location.replace("connexion.html?refus=1"); return; }
    Session.current = user;
    Store.set("cq_last_seen_" + user.id, new Date().toISOString());

    if (user.role === "admin" && !extra.includes("questions")) extra = [...extra, "questions"];
    await loadData(user, people, extra);

    await page(user);
  } catch (e) {
    console.error(e);
    const main = $("main") || document.body;
    main.insertAdjacentHTML("afterbegin", `<div class="alert alert--error" role="alert" style="margin:24px">${icon("alert", 18)}<span>Impossible de charger les données. Ouvrez le site via un serveur (voir README) puis rechargez la page. <span class="small">(${esc(e.message || e)})</span></span></div>`);
  }
}

/* Erreur lors d'un enregistrement : message à l'utilisateur */
function saveError(e) {
  console.error(e);
  toast("L'enregistrement a échoué. Réessayez.");
}
