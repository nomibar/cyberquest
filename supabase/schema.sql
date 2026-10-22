-- =========================================================
-- CyberQuests – schéma de la base (Supabase / PostgreSQL)
-- À exécuter une seule fois, AVANT seed.sql :
-- Supabase → SQL Editor → New query → coller ce fichier → Run.
-- =========================================================

/* ---------- Comptes ---------- */

-- Un profil par compte Supabase Auth (créé automatiquement à l'inscription)
create table public.profiles (
  id           uuid primary key references auth.users on delete cascade,
  email        text not null,
  full_name    text not null default '',
  job          text not null default '',
  service      text not null default '',
  role         text not null default 'joueur' check (role in ('joueur', 'manager', 'admin')),
  manager_id   uuid references public.profiles on delete set null,
  last_seen_at timestamptz,
  created_at   timestamptz not null default now()
);
create index on public.profiles (manager_id);

/* ---------- Contenu pédagogique ---------- */

-- Thèmes et quiz de la page « Mes parcours »
create table public.themes (
  id       text primary key,
  name     text not null,
  icon     text not null default 'book',
  position int  not null default 0
);

create table public.theme_quizzes (
  id             bigint generated always as identity primary key,
  theme_id       text not null references public.themes on delete cascade,
  title          text not null,
  question_count int  not null default 0,
  level          text not null,
  position       int  not null default 0
);

-- Parcours de la formation obligatoire
create table public.parcours (
  id       text primary key,
  name     text not null,
  games    int  not null default 0,
  position int  not null default 0
);

-- Quiz que le manager peut assigner ; « notion » = notion travaillée
create table public.quiz_library (
  id       text primary key,
  name     text not null,
  games    int  not null default 0,
  minutes  int  not null default 0,
  notion   text not null,
  position int  not null default 0
);

-- Questions des parcours, gérées par l'administratrice RH
create table public.questions (
  id          text primary key,
  seq         bigint generated always as identity,
  parcours_id text not null references public.parcours on delete cascade,
  titre       text not null,
  format      text not null,
  notion      text,
  situation   text,
  fichier     text,
  reponses    text[],
  correct     int  not null default 0,
  explication text,
  statut      text not null default 'brouillon' check (statut in ('brouillon', 'publie')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index on public.questions (parcours_id);

-- Situations du mini-jeu (mail, indices, question de vérification) en JSON
create table public.game_situations (
  id          text primary key,
  parcours_id text not null references public.parcours on delete cascade,
  position    int  not null default 0,
  content     jsonb not null
);

/* ---------- Progression et résultats ---------- */

create table public.parcours_completions (
  user_id      uuid not null references public.profiles on delete cascade,
  parcours_id  text not null references public.parcours on delete cascade,
  completed_at timestamptz not null default now(),
  primary key (user_id, parcours_id)
);

-- Notions à revoir (visibles par le manager, sans le détail des réponses)
create table public.weak_notions (
  user_id    uuid not null references public.profiles on delete cascade,
  quiz_id    text not null references public.quiz_library on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, quiz_id)
);

-- Parties jouées : score visible uniquement par le joueur lui-même
create table public.game_results (
  id          bigint generated always as identity primary key,
  user_id     uuid not null default auth.uid() references public.profiles on delete cascade,
  parcours_id text not null references public.parcours on delete cascade,
  first_try   int  not null,
  total       int  not null,
  played_at   timestamptz not null default now()
);
create index on public.game_results (user_id);

/* ---------- Quiz assignés par un manager ---------- */

create table public.assignments (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles on delete cascade,
  quiz_id     text not null references public.quiz_library on delete cascade,
  assigned_by uuid default auth.uid() references public.profiles on delete set null,
  group_id    uuid,          -- même valeur pour une assignation à toute l'équipe
  due         date,
  notify      boolean not null default true,
  created_at  timestamptz not null default now()
);
create index on public.assignments (user_id);

/* ---------- Fonctions et triggers ---------- */

-- Création du profil à l'inscription (nom saisi dans le formulaire d'inscription)
create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(nullif(new.raw_user_meta_data ->> 'full_name', ''), split_part(new.email, '@', 1)));
  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create function public.touch_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

create trigger questions_updated_at
  before update on public.questions
  for each row execute function public.touch_updated_at();

-- Rôle de l'utilisateur connecté (security definer : évite la récursion des règles RLS)
create function public.my_role() returns text
language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid()
$$;

-- L'utilisateur connecté peut-il voir cette personne ? (lui-même, son équipe, ou tout le monde s'il est admin)
create function public.can_see_user(target uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select target = auth.uid()
      or public.my_role() = 'admin'
      or exists (select 1 from public.profiles where id = target and manager_id = auth.uid())
$$;

/* ---------- Sécurité : Row Level Security ---------- */

alter table public.profiles             enable row level security;
alter table public.themes               enable row level security;
alter table public.theme_quizzes        enable row level security;
alter table public.parcours             enable row level security;
alter table public.quiz_library         enable row level security;
alter table public.questions            enable row level security;
alter table public.game_situations      enable row level security;
alter table public.parcours_completions enable row level security;
alter table public.weak_notions         enable row level security;
alter table public.game_results         enable row level security;
alter table public.assignments          enable row level security;

-- Profils : chacun modifie seulement son nom, son poste et sa dernière activité.
-- Le rôle et le manager se changent depuis le tableau de bord Supabase (Table Editor).
create policy "profils visibles" on public.profiles for select to authenticated using (public.can_see_user(id));
create policy "modifier son profil" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
revoke update on public.profiles from anon, authenticated;
grant update (full_name, job, last_seen_at) on public.profiles to authenticated;

-- Contenu : lisible par tous les connectés, modifiable par l'admin
create policy "lecture" on public.themes          for select to authenticated using (true);
create policy "admin"   on public.themes          for all    to authenticated using (public.my_role() = 'admin') with check (public.my_role() = 'admin');
create policy "lecture" on public.theme_quizzes   for select to authenticated using (true);
create policy "admin"   on public.theme_quizzes   for all    to authenticated using (public.my_role() = 'admin') with check (public.my_role() = 'admin');
create policy "lecture" on public.parcours        for select to authenticated using (true);
create policy "admin"   on public.parcours        for all    to authenticated using (public.my_role() = 'admin') with check (public.my_role() = 'admin');
create policy "lecture" on public.quiz_library    for select to authenticated using (true);
create policy "admin"   on public.quiz_library    for all    to authenticated using (public.my_role() = 'admin') with check (public.my_role() = 'admin');
create policy "lecture" on public.game_situations for select to authenticated using (true);
create policy "admin"   on public.game_situations for all    to authenticated using (public.my_role() = 'admin') with check (public.my_role() = 'admin');

-- Questions : les brouillons ne sont visibles que par l'admin
create policy "lecture" on public.questions for select to authenticated using (statut = 'publie' or public.my_role() = 'admin');
create policy "admin"   on public.questions for all    to authenticated using (public.my_role() = 'admin') with check (public.my_role() = 'admin');

-- Progression : visible par soi, son manager et l'admin ; chacun enregistre la sienne
create policy "lecture"       on public.parcours_completions for select to authenticated using (public.can_see_user(user_id));
create policy "ajout"         on public.parcours_completions for insert to authenticated with check (user_id = auth.uid());
create policy "mise a jour"   on public.parcours_completions for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "lecture"       on public.weak_notions for select to authenticated using (public.can_see_user(user_id));
create policy "ajout"         on public.weak_notions for insert to authenticated with check (user_id = auth.uid());
create policy "suppression"   on public.weak_notions for delete to authenticated using (user_id = auth.uid());

-- Scores : strictement personnels (le manager ne les voit pas)
create policy "lecture" on public.game_results for select to authenticated using (user_id = auth.uid());
create policy "ajout"   on public.game_results for insert to authenticated with check (user_id = auth.uid());

-- Quiz assignés : un manager assigne aux membres de son équipe, l'admin à tout le monde
create policy "lecture" on public.assignments for select to authenticated using (public.can_see_user(user_id));
create policy "ajout" on public.assignments for insert to authenticated with check (
  assigned_by = auth.uid()
  and public.my_role() in ('manager', 'admin')
  and user_id <> auth.uid()
  and public.can_see_user(user_id)
);
create policy "suppression" on public.assignments for delete to authenticated using (assigned_by = auth.uid() or public.my_role() = 'admin');
