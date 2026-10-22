/* =========================================================
   CyberQuest – fonctions communes à toutes les pages
   (stockage, session de démo, header, icônes, modale, toast)
   ========================================================= */

/* ---------- Stockage navigateur (avec repli en mémoire) ---------- */
const Store = (() => {
  const memory = {};
  return {
    get(key, fallback) {
      try {
        const raw = localStorage.getItem(key);
        return raw === null ? fallback : JSON.parse(raw);
      } catch (e) {
        return key in memory ? memory[key] : fallback;
      }
    },
    set(key, value) {
      memory[key] = value;
      try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* stockage indisponible */ }
    },
    remove(key) {
      delete memory[key];
      try { localStorage.removeItem(key); } catch (e) { /* stockage indisponible */ }
    }
  };
})();

/* ---------- Petits utilitaires ---------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

function esc(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function nl2br(text) { return esc(text).replace(/\n/g, "<br>"); }

function param(name) { return new URLSearchParams(location.search).get(name); }

function uid(prefix) { return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }

function todayLabel() {
  return new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso + "T12:00:00");
  return isNaN(d) ? iso : d.toLocaleDateString("fr-FR", { day: "numeric", month: "long" });
}

/* ---------- Icônes (tracés au trait, style Lucide) ---------- */
const ICONS = {
  cpu: '<rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2M15 20v2M2 15h2M2 9h2M20 15h2M20 9h2M9 2v2M9 20v2"/>',
  book: '<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/>',
  flask: '<path d="M10 2v6.292a7 7 0 1 0 4 0V2"/><path d="M5 15h14"/><path d="M8.5 2h7"/>',
  play: '<polygon points="6 3 20 12 6 21 6 3"/>',
  chevronRight: '<path d="m9 18 6-6-6-6"/>',
  chevronLeft: '<path d="m15 18-6-6 6-6"/>',
  chevronDown: '<path d="m6 9 6 6 6-6"/>',
  bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  user: '<circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>',
  swap: '<path d="m16 3 4 4-4 4"/><path d="M20 7H4"/><path d="m8 21-4-4 4-4"/><path d="M4 17h16"/>',
  shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
  clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  bulb: '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
  lock: '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  alert: '<circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>',
  warning: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  flag: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
  reply: '<polyline points="9 17 4 12 9 7"/><path d="M20 18v-2a4 4 0 0 0-4-4H4"/>',
  heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  arrowRight: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  calendar: '<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/>',
  info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
  rotate: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
  eye: '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
  edit: '<path d="M12 20h9"/><path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z"/>',
  trash: '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>',
  mic: '<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/>',
  phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
  send: '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
  paperclip: '<path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/>',
  file: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/>',
  qr: '<rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h1"/><path d="M21 12v.01"/><path d="M12 21v-1"/>',
  message: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
  image: '<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>',
  video: '<path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"/><rect x="2" y="6" width="14" height="12" rx="2"/>',
  upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>',
  filter: '<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>'
};

function icon(name, size = 20, extra = "") {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${ICONS[name] || ""}</svg>`;
}

const FORMAT_ICONS = { "Mail": "mail", "Message vocal": "mic", "QR code": "qr", "Conversation": "message", "Image": "image", "Vidéo": "video" };

/* ---------- Session (compte de démo connecté, rempli par boot() dans db.js) ---------- */
const Session = {
  current: null,
  user() { return this.current; },
  role() { return this.current ? this.current.role : null; },
  async logout() { Auth.logout(); }
};

function homeFor(role) {
  return { joueur: "accueil.html", manager: "equipe.html", admin: "admin.html" }[role] || "accueil.html";
}

/* ---------- Données modifiables (stockées dans le navigateur, chargées par db.js) ---------- */
const Assignments = {
  list: [],
  all() { return this.list; },
  save() { Store.set("cq_assignments", this.list); },
  forPerson(id) { return this.list.filter(a => a.personId === id); },
  async addMany(items) {
    const created = items.map(a => ({
      id: uid("a"), group: a.group || null, personId: a.personId, quizId: a.quizId, due: a.due || "", notify: a.notify, date: todayLabel()
    }));
    this.list.push(...created);
    this.save();
    return created;
  },
  async add(a) { return (await this.addMany([a]))[0]; },
  async remove(id) { this.list = this.list.filter(a => a.id !== id); this.save(); },
  async removeGroup(group) { this.list = this.list.filter(a => a.group !== group); this.save(); }
};

const Questions = {
  list: [],
  all() { return this.list; },
  save() { Store.set("cq_questions", this.list); },
  get(id) { return this.list.find(q => q.id === id); },
  async upsert(q) {
    const i = this.list.findIndex(x => x.id === q.id);
    if (i >= 0) this.list[i] = q; else this.list.push(q);
    this.save();
    return q;
  },
  async remove(id) { this.list = this.list.filter(q => q.id !== id); this.save(); }
};

function quizById(id) { return DATA.quizLibrary.find(q => q.id === id); }
function parcoursById(id) { return DATA.parcours.find(p => p.id === id); }

/* ---------- Notifications ---------- */
function notificationsFor(user) {
  if (user.role === "joueur") {
    return Assignments.forPerson(user.id).filter(a => a.notify).map(a => ({
      key: a.id,
      text: `Votre manager vous a assigné le quiz « ${quizById(a.quizId).name} »` + (a.due ? ` à faire avant le ${formatDate(a.due)}.` : "."),
      href: "progression.html"
    }));
  }
  if (user.role === "manager") {
    return DATA.team.filter(p => p.done === DATA.parcours.length).map(p => ({
      key: "fini-" + p.id, text: `${p.name} a terminé toute sa formation.`, href: "collaborateur.html?id=" + p.id
    }));
  }
  return DATA.parcours.map(p => ({ p, drafts: Questions.all().filter(q => q.parcours === p.id && q.statut !== "publie").length }))
    .filter(x => x.drafts)
    .map(({ p, drafts }) => ({
      key: `brouillon-${p.id}-${drafts}`,
      text: `Pensez à mettre à jour le parcours « ${p.name} » : ${drafts} question${drafts > 1 ? "s" : ""} en brouillon.`,
      href: "admin.html?parcours=" + p.id
    }));
}

/* ---------- Header ---------- */
const NAV = {
  joueur: [["parcours", "Mes parcours", "accueil.html"], ["progression", "Ma progression", "progression.html"]],
  manager: [["parcours", "Mes parcours", "accueil.html"], ["progression", "Ma progression", "progression.html"], ["equipe", "Mon équipe", "equipe.html"]],
  admin: [["parcours", "Mes parcours", "accueil.html"], ["equipe", "Utilisateurs", "equipe.html"], ["admin", "Administration", "admin.html"]]
};

function renderHeader(active) {
  const user = Session.user();
  const el = $("#app-header");
  if (!el || !user) return;

  const notifs = notificationsFor(user);
  const seenKey = "cq_seen_notifs_" + user.id;
  const seen = Store.get(seenKey, []);
  const unseen = notifs.some(n => !seen.includes(n.key));

  el.className = "header";
  el.innerHTML = `
    <div class="header__inner">
      <a class="logo" href="${homeFor(user.role)}"><img src="assets/img/logo.png" alt="CyberQuests – accueil"></a>
      <nav class="nav" aria-label="Navigation principale">
        ${NAV[user.role].map(([key, label, href]) =>
          `<a href="${href}" class="${key === active ? "is-active" : ""}" ${key === active ? 'aria-current="page"' : ""}>${label}</a>`).join("")}
      </nav>
      <div class="header__right">
        <button class="icon-btn" id="notif-btn" aria-label="Notifications" aria-expanded="false">
          ${icon("bell")}${unseen ? '<span class="dot"></span>' : ""}
        </button>
        <button class="profile-btn" id="profile-btn" aria-expanded="false">
          ${icon("user", 18)}<span class="profile-name">Profil</span>${icon("chevronDown", 16)}
        </button>
        <div class="dropdown" id="notif-menu">
          <div class="dropdown__head"><strong>Notifications</strong></div>
          ${notifs.length
            ? notifs.map(n => `<a class="notif" href="${n.href}">${esc(n.text)}</a>`).join("")
            : '<p class="notif muted">Aucune notification pour le moment.</p>'}
        </div>
        <div class="dropdown" id="profile-menu">
          <div class="dropdown__head">
            <div class="row"><span class="avatar">${user.initials}</span>
              <div><strong>${esc(user.name)}</strong><div class="small muted">${DATA.roleLabels[user.role]} · ${esc(user.job)}</div></div>
            </div>
          </div>
          <button class="dropdown__item" id="switch-btn">${icon("swap", 18)} Changer de compte</button>
          <button class="dropdown__item" id="logout-btn">${icon("logout", 18)} Se déconnecter</button>
        </div>
      </div>
    </div>`;

  const toggle = (btn, menu, other, onOpen) => {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      other.classList.remove("is-open");
      const open = menu.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", open);
      if (open && onOpen) onOpen();
    });
  };
  const nb = $("#notif-btn"), pb = $("#profile-btn"), nm = $("#notif-menu"), pm = $("#profile-menu");
  toggle(nb, nm, pm, () => {
    Store.set(seenKey, [...new Set([...seen, ...notifs.map(n => n.key)])]);
    const dot = $(".dot", nb); if (dot) dot.remove();
  });
  toggle(pb, pm, nm);
  const closeMenus = () => {
    nm.classList.remove("is-open"); pm.classList.remove("is-open");
    nb.setAttribute("aria-expanded", false); pb.setAttribute("aria-expanded", false);
  };
  document.addEventListener("click", e => { if (!e.target.closest(".dropdown")) closeMenus(); });
  /* Échap ferme le menu ouvert et rend le focus à son bouton */
  document.addEventListener("keydown", e => {
    if (e.key !== "Escape") return;
    const opener = nm.classList.contains("is-open") ? nb : pm.classList.contains("is-open") ? pb : null;
    if (opener) { closeMenus(); opener.focus(); }
  });
  $("#logout-btn").addEventListener("click", async () => { await Session.logout(); location.href = "index.html"; });
  $("#switch-btn").addEventListener("click", async () => { await Session.logout(); location.href = "connexion.html"; });
}

/* ---------- Toast ---------- */
function toast(message, action) {
  $$(".toast").forEach(t => t.remove());
  const t = document.createElement("div");
  t.className = "toast";
  t.setAttribute("role", "status");
  t.innerHTML = `${icon("check")}<span>${message}</span>`;
  if (action) {
    const b = document.createElement("button");
    b.textContent = action.label;
    b.addEventListener("click", () => { action.onClick(); t.remove(); });
    t.appendChild(b);
  }
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 7000);
}

/* Toast transmis d'une page à l'autre (ex. après une publication) */
function flash(message) { Store.set("cq_flash", message); }
function showFlash() {
  const m = Store.get("cq_flash", null);
  if (m) { Store.remove("cq_flash"); toast(m); }
}

/* ---------- Modale ---------- */
/* Éléments atteignables au clavier dans la modale */
const focusablesIn = root => $$('a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])', root)
  .filter(el => el.offsetParent !== null || el.type === "radio");

function openModal(overlay) {
  overlay._opener = document.activeElement;
  overlay.hidden = false;
  const focusable = overlay.querySelector("input, select, button");
  if (focusable) focusable.focus();
  /* Échap ferme ; Tab reste dans la modale */
  const onKey = e => {
    if (e.key === "Escape") { closeModal(overlay); return; }
    if (e.key !== "Tab") return;
    const items = focusablesIn(overlay);
    if (!items.length) return;
    const first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };
  overlay._onKey = onKey;
  document.addEventListener("keydown", onKey);
  overlay.onclick = e => { if (e.target === overlay) closeModal(overlay); };
}

function closeModal(overlay) {
  overlay.hidden = true;
  if (overlay._onKey) document.removeEventListener("keydown", overlay._onKey);
  /* Rend le focus au bouton qui a ouvert la modale */
  if (overlay._opener && document.contains(overlay._opener)) overlay._opener.focus();
}

/* ---------- Composants réutilisés ---------- */
function progressBar(done, total, variant = "") {
  const pct = total ? Math.round((done / total) * 100) : 0;
  return `<div class="progress ${variant}" role="progressbar" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${done}"><span style="width:${pct}%"></span></div>`;
}

const STATUS = {
  done: { label: "Terminé", tag: "green", icon: "check" },
  todo: { label: "À faire", tag: "grey", icon: "play" },
  rev: { label: "À revoir", tag: "red", icon: "rotate" },
  wait: { label: "Assigné · en attente", tag: "orange", icon: "play" }
};

function statusRow(name, meta, status, actionHtml = "") {
  const s = STATUS[status];
  return `
    <div class="list-row">
      <span class="status-dot icon-box--${s.tag === "red" ? "red" : s.tag}">${icon(s.icon, 16)}</span>
      <div class="grow"><div style="font-weight:600">${esc(name)}</div><div class="small muted">${esc(meta)}</div></div>
      <span class="tag tag--${s.tag}">${s.label}</span>
      ${actionHtml}
    </div>`;
}

/* Parcours d'une personne de l'équipe, avec les quiz assignés */
function personParcours(person) {
  const next = DATA.parcours.find(p => !person.completed[p.id]);
  const rows = DATA.parcours.map(p => {
    const doneAt = person.completed[p.id];
    const rev = !!doneAt && person.notions.includes(p.id);
    return {
      name: p.name,
      meta: doneAt ? `Terminé le ${shortDate(doneAt)}` + (rev ? " · notion à revoir" : "") : (p === next ? "Prochain parcours" : "Pas encore commencé"),
      status: rev ? "rev" : doneAt ? "done" : "todo",
      parcoursId: p.id
    };
  });
  const assigned = Assignments.forPerson(person.id).map(a => ({
    name: "Quiz : " + quizById(a.quizId).name,
    meta: `Assigné le ${a.date}` + (a.due ? ` · avant le ${formatDate(a.due)}` : ""),
    status: "wait",
    assignmentId: a.id,
    quizId: a.quizId
  }));
  return { rows, assigned };
}

/* ---------- Modale « Ajouter un quiz » (manager) ---------- */
function setupAssignModal({ onAssign }) {
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  overlay.hidden = true;
  overlay.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="assign-title">
      <div class="modal__head">
        <div class="grow"><h2 class="modal__title" id="assign-title">Ajouter un quiz</h2><p class="muted" id="assign-for"></p></div>
        <button class="square-btn" data-close aria-label="Fermer">${icon("x", 18)}</button>
      </div>
      <form class="modal__body" id="assign-form">
        <label class="input">${icon("search", 16)}<input type="search" id="assign-search" placeholder="Rechercher un quiz" aria-label="Rechercher un quiz"></label>
        <div class="stack" style="gap:8px" id="assign-list" role="radiogroup" aria-label="Quiz"></div>
        <div class="field">
          <label class="field__label" for="assign-due">Date limite <span class="field__hint">(facultatif)</span></label>
          <div class="input">${icon("calendar", 16)}<input type="date" id="assign-due"></div>
        </div>
        <label class="checkbox"><input type="checkbox" id="assign-notify" checked> <span id="assign-notify-label">Prévenir par une notification</span></label>
      </form>
      <div class="modal__foot">
        <button class="btn btn--secondary" data-close>Annuler</button>
        <button class="btn btn--primary" id="assign-submit">Assigner le quiz</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);

  let ctx = null;
  let selected = null;

  const renderList = () => {
    const q = $("#assign-search", overlay).value.trim().toLowerCase();
    const items = DATA.quizLibrary.filter(z => z.name.toLowerCase().includes(q));
    $("#assign-list", overlay).innerHTML = items.length ? items.map(z => `
      <label class="option ${z.id === selected ? "is-selected" : ""}">
        <input type="radio" name="assign-quiz" value="${z.id}" ${z.id === selected ? "checked" : ""}>
        <span class="option__radio">${z.id === selected ? icon("check", 12) : ""}</span>
        <span class="grow"><span style="font-weight:600;display:block">${z.name}</span><span class="small muted">${z.games} mini-jeux · ≈ ${z.minutes} min</span></span>
        ${ctx && ctx.suggested && ctx.suggested.includes(z.id) ? '<span class="tag tag--red">Conseillé</span>' : ""}
      </label>`).join("") : '<p class="muted small">Aucun quiz ne correspond à votre recherche.</p>';
    /* Après un choix (clic ou flèches), la liste est redessinée : le focus reste sur le quiz choisi */
    $$('input[name="assign-quiz"]', overlay).forEach(r => r.addEventListener("change", () => {
      selected = r.value;
      renderList();
      $(`input[name="assign-quiz"][value="${selected}"]`, overlay).focus();
    }));
  };

  $("#assign-search", overlay).addEventListener("input", renderList);
  $$("[data-close]", overlay).forEach(b => b.addEventListener("click", e => { e.preventDefault(); closeModal(overlay); }));
  $("#assign-form", overlay).addEventListener("submit", e => e.preventDefault());
  $("#assign-submit", overlay).addEventListener("click", () => {
    if (!selected) { $("#assign-list", overlay).insertAdjacentHTML("beforeend", '<p class="small" style="color:var(--red)">Choisissez un quiz.</p>'); return; }
    closeModal(overlay);
    onAssign({ ...ctx, quizId: selected, due: $("#assign-due", overlay).value, notify: $("#assign-notify", overlay).checked });
  });

  return {
    open(options) {
      ctx = options;
      selected = options.preselect || (options.suggested && options.suggested[0]) || null;
      $("#assign-for", overlay).textContent = options.forLabel;
      $("#assign-notify-label", overlay).textContent = options.notifyLabel;
      $("#assign-search", overlay).value = "";
      $("#assign-due", overlay).value = "";
      renderList();
      openModal(overlay);
    }
  };
}
