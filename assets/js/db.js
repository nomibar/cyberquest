/* =========================================================
   CyberQuest – accès à la base Supabase
   (client, chargement des données, démarrage des pages)
   ========================================================= */

const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/* Résultat d'une requête Supabase, ou exception en cas d'erreur */
async function rows(request) {
  const { data, error } = await request;
  if (error) throw error;
  return data;
}

/* ---------- Mise en forme ---------- */
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

/* ---------- Conversion des lignes de la base ---------- */
function toUser(p) {
  return {
    id: p.id, role: p.role, name: p.full_name, initials: initialsOf(p.full_name),
    email: p.email, job: p.job, service: p.service, managerId: p.manager_id
  };
}

function toAssignment(a) {
  return { id: a.id, group: a.group_id, personId: a.user_id, quizId: a.quiz_id, due: a.due || "", notify: a.notify, date: dateLabel(a.created_at) };
}

function toQuestion(q) {
  return {
    id: q.id, parcours: q.parcours_id, titre: q.titre, format: q.format, notion: q.notion || undefined,
    situation: q.situation || undefined, fichier: q.fichier || undefined,
    reponses: q.reponses || undefined, correct: q.correct, explication: q.explication || undefined, statut: q.statut
  };
}

function fromQuestion(q) {
  return {
    id: q.id, parcours_id: q.parcours, titre: q.titre, format: q.format, notion: q.notion || null,
    situation: q.situation || null, fichier: q.fichier || null,
    reponses: q.reponses && q.reponses.length ? q.reponses : null, correct: q.correct || 0,
    explication: q.explication || null, statut: q.statut
  };
}

/* ---------- Chargement ----------
   Les règles RLS limitent ce que chacun reçoit : un employé ne voit
   que lui-même, un manager son équipe, l'admin tout le monde.        */
const LOADERS = {
  async themes() {
    const [themes, quizzes] = await Promise.all([
      rows(sb.from("themes").select("*").order("position")),
      rows(sb.from("theme_quizzes").select("*").order("position"))
    ]);
    DATA.themes = themes.map(t => ({
      id: t.id, name: t.name, icon: t.icon,
      quizzes: quizzes.filter(z => z.theme_id === t.id).map(z => ({ title: z.title, questions: z.question_count, level: z.level }))
    }));
  },
  async game() {
    const list = await rows(sb.from("game_situations").select("*").eq("parcours_id", DATA.gameInfo.parcoursId).order("position"));
    DATA.game = { ...DATA.gameInfo, situations: list.map(s => ({ id: s.id, ...s.content })) };
  },
  async history() {
    const list = await rows(sb.from("game_results").select("*").eq("user_id", Session.user().id).order("played_at"));
    DATA.history = list.map(h => ({ date: dateLabel(h.played_at), firstTry: h.first_try, total: h.total }));
  },
  async questions() {
    Questions.list = (await rows(sb.from("questions").select("*").order("seq"))).map(toQuestion);
  }
};

async function loadData(user, extra) {
  const [profiles, parcours, library, completions, notions, assignments] = await Promise.all([
    rows(sb.from("profiles").select("*")),
    rows(sb.from("parcours").select("*").order("position")),
    rows(sb.from("quiz_library").select("*").order("position")),
    rows(sb.from("parcours_completions").select("*")),
    rows(sb.from("weak_notions").select("*")),
    rows(sb.from("assignments").select("*").order("created_at")),
    ...extra.map(name => LOADERS[name]())
  ]);

  DATA.parcours = parcours.map(p => ({ id: p.id, name: p.name, games: p.games }));
  DATA.quizLibrary = library.map(z => ({ id: z.id, name: z.name, games: z.games, minutes: z.minutes, notion: z.notion }));
  Assignments.list = assignments.map(toAssignment);

  DATA.people = profiles.map(p => {
    const completed = {};
    completions.filter(c => c.user_id === p.id).forEach(c => { completed[c.parcours_id] = c.completed_at; });
    return {
      ...toUser(p), completed,
      done: DATA.parcours.filter(x => completed[x.id]).length,
      notions: notions.filter(n => n.user_id === p.id).map(n => n.quiz_id),
      last: lastSeenLabel(p.last_seen_at)
    };
  });
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
    const { data: { session } } = await sb.auth.getSession();
    if (!session) { location.replace("connexion.html"); return; }
    const profile = await rows(sb.from("profiles").select("*").eq("id", session.user.id).single());
    const user = toUser(profile);
    if (roles && !roles.includes(user.role)) { location.replace("connexion.html?refus=1"); return; }
    Session.current = user;

    if (user.role === "admin" && !extra.includes("questions")) extra = [...extra, "questions"];
    await loadData(user, extra);
    sb.from("profiles").update({ last_seen_at: new Date().toISOString() }).eq("id", user.id).then(() => {});

    await page(user);
  } catch (e) {
    console.error(e);
    const main = $("main") || document.body;
    main.insertAdjacentHTML("afterbegin", `<div class="alert alert--error" role="alert" style="margin:24px">${icon("alert", 18)}<span>Impossible de charger les données. Vérifiez votre connexion puis rechargez la page. <span class="small">(${esc(e.message || e)})</span></span></div>`);
  }
}

/* Erreur lors d'un enregistrement : message à l'utilisateur */
function saveError(e) {
  console.error(e);
  toast("L'enregistrement a échoué. Vérifiez votre connexion et réessayez.");
}
