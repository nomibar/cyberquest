-- =========================================================
-- CyberQuests – données de départ
-- À exécuter APRÈS schema.sql (SQL Editor → New query → Run).
-- Peut être relancé : les lignes déjà présentes sont ignorées.
-- =========================================================

-- Thèmes et quiz de la page « Mes parcours »
insert into public.themes (id, name, icon, position) values ('cyber', 'Cybersécurité', 'cpu', 0) on conflict (id) do nothing;
insert into public.themes (id, name, icon, position) values ('info', 'Informatique', 'book', 1) on conflict (id) do nothing;
insert into public.themes (id, name, icon, position) values ('ia', 'Intelligence artificielle', 'flask', 2) on conflict (id) do nothing;
insert into public.theme_quizzes (theme_id, title, question_count, level, position) select * from (values
  ('cyber', 'Menaces & vulnérabilités', 10, 'Intermédiaire', 0),
  ('cyber', 'Cryptographie & authentification', 15, 'Avancé', 1),
  ('cyber', 'Sécurité des données', 12, 'Débutant', 2),
  ('cyber', 'Phishing : repérer les faux mails', 5, 'Débutant', 3),
  ('info', 'Algorithmes & complexité', 8, 'Débutant', 0),
  ('info', 'Réseaux & protocoles', 10, 'Intermédiaire', 1),
  ('info', 'Bases de données', 9, 'Intermédiaire', 2),
  ('ia', 'Apprentissage automatique', 12, 'Intermédiaire', 0),
  ('ia', 'Vision par ordinateur', 15, 'Avancé', 1),
  ('ia', 'IA générative & chatbots', 8, 'Débutant', 2),
  ('ia', 'Deepfakes vocaux', 6, 'Débutant', 3),
  ('ia', 'Éthique de l''IA', 10, 'Intermédiaire', 4)
) v where not exists (select 1 from public.theme_quizzes);

-- Parcours de la formation obligatoire
insert into public.parcours (id, name, games, position) values ('phishing', 'Phishing', 5, 0) on conflict (id) do nothing;
insert into public.parcours (id, name, games, position) values ('mdp', 'Mots de passe', 4, 1) on conflict (id) do nothing;
insert into public.parcours (id, name, games, position) values ('pj', 'Pièces jointes suspectes', 5, 2) on conflict (id) do nothing;
insert into public.parcours (id, name, games, position) values ('qr', 'Faux QR codes', 4, 3) on conflict (id) do nothing;
insert into public.parcours (id, name, games, position) values ('ia', 'IA & deepfakes', 4, 4) on conflict (id) do nothing;

-- Quiz que le manager peut assigner
insert into public.quiz_library (id, name, games, minutes, notion, position) values ('pj', 'Pièces jointes suspectes', 5, 10, 'Pièces jointes', 0) on conflict (id) do nothing;
insert into public.quiz_library (id, name, games, minutes, notion, position) values ('qr', 'Faux QR codes', 4, 8, 'Faux QR codes', 1) on conflict (id) do nothing;
insert into public.quiz_library (id, name, games, minutes, notion, position) values ('mdp', 'Mots de passe', 4, 8, 'Mots de passe', 2) on conflict (id) do nothing;
insert into public.quiz_library (id, name, games, minutes, notion, position) values ('deepfake', 'Deepfakes vocaux', 3, 6, 'Deepfakes', 3) on conflict (id) do nothing;

-- Situations du mini-jeu Phishing (contenu complet en JSON)
insert into public.game_situations (id, parcours_id, position, content) values ('prime', 'phishing', 0, '{"subject":"URGENT – Validation de votre prime avant 12h","fromName":"Direction Générale","fromInitials":"DG","fromAddr":"direction@entreprlse-rh.com","fromHint":1,"date":"Aujourd''hui, 10:47","body":[{"text":"Bonjour,"},{"text":"Suite à la réorganisation, votre prime annuelle doit être validée avant 12h aujourd''hui, sinon elle sera définitivement perdue.","hint":2}],"cta":{"label":"Valider ma prime","real":"http://prime-validation.co/login","hint":3},"signature":{"text":"Merci de ne pas en parler à vos collègues avant validation.\nCordialement,\nLa Direction","hint":4},"choices":[{"icon":"link","label":"Cliquer sur le lien","desc":"Valider la prime tout de suite","correct":false},{"icon":"reply","label":"Répondre au mail","desc":"Demander plus d''informations","correct":false},{"icon":"flag","label":"Signaler le mail","desc":"Prévenir le service informatique","correct":true}],"hints":[{"title":"L''adresse de l''expéditeur","desc":"« entreprlse » contient un « l » à la place du « i ». Les pirates imitent les vraies adresses."},{"title":"L''urgence","desc":"« Avant 12h, sinon c''est perdu » : on vous presse pour vous empêcher de réfléchir."},{"title":"Le lien","desc":"Le texte affiché ne correspond pas à l''adresse réelle, visible en survolant le lien."},{"title":"Le ton inhabituel","desc":"Demander de ne pas en parler aux collègues est un signal d''alerte classique."}],"reflexe":"Vérifiez l''expéditeur, survolez le lien sans cliquer, et en cas de doute signalez le mail au service informatique.","verif":{"question":"Quel indice aurait dû vous alerter en premier ?","options":["L''adresse de l''expéditeur contient une faute (entreprlse)","Le mail est écrit en français","Le mail est arrivé le matin","Le bouton est de couleur bleue"],"correct":0,"explanation":"Vérifier l''adresse de l''expéditeur est le premier réflexe : c''est le plus rapide et le plus fiable."}}'::jsonb) on conflict (id) do nothing;
insert into public.game_situations (id, parcours_id, position, content) values ('colis', 'phishing', 1, '{"subject":"Votre colis n''a pas pu être livré","fromName":"Service Livraison","fromInitials":"SL","fromAddr":"noreply@livraison-express-fr.net","fromHint":1,"date":"Aujourd''hui, 14:12","body":[{"text":"Cher client,","hint":2},{"text":"Nous n''avons pas pu livrer votre colis. Ouvrez le bon de livraison joint pour reprogrammer la livraison sous 48h."}],"attachment":{"name":"Bon_livraison_7741.zip","size":"214 Ko","hint":3},"signature":{"text":"Sans action de votre part, le colis sera renvoyé à l''expéditeur.\nL''équipe Livraison","hint":4},"choices":[{"icon":"paperclip","label":"Ouvrir la pièce jointe","desc":"Reprogrammer la livraison","correct":false},{"icon":"reply","label":"Répondre au mail","desc":"Demander le numéro de suivi","correct":false},{"icon":"flag","label":"Signaler le mail","desc":"Prévenir le service informatique","correct":true}],"hints":[{"title":"Un expéditeur inconnu","desc":"Une adresse « noreply » d''un transporteur que vous ne connaissez pas, sans lien avec une commande."},{"title":"Une formule générique","desc":"« Cher client » : un vrai transporteur connaît votre nom."},{"title":"Une pièce jointe .zip","desc":"Un bon de livraison n''est jamais un .zip. Ce type de fichier peut cacher un programme malveillant."},{"title":"La pression","desc":"« Sans action de votre part… » : encore une fois, on vous pousse à agir vite."}],"reflexe":"N''ouvrez jamais une pièce jointe inattendue. Vérifiez votre commande directement sur le site du transporteur.","verif":{"question":"Qu''est-ce qui rendait la pièce jointe suspecte ?","options":["Son nom contient un numéro","C''est un fichier .zip inattendu","Elle pèse 214 Ko","Elle est arrivée l''après-midi"],"correct":1,"explanation":"Un fichier compressé (.zip) reçu sans l''avoir demandé est un des moyens les plus courants de diffuser un virus."}}'::jsonb) on conflict (id) do nothing;
insert into public.game_situations (id, parcours_id, position, content) values ('mdp', 'phishing', 2, '{"subject":"Votre mot de passe expire dans 24h","fromName":"Support Informatique","fromInitials":"SI","fromAddr":"support@entreprise-helpdesk.com","fromHint":1,"date":"Hier, 17:30","body":[{"text":"Bonjour,"},{"text":"Votre mot de passe expire dans 24h. Pour garder l''accès à votre messagerie, confirmez votre mot de passe actuel sur la page sécurisée.","hint":2}],"cta":{"label":"Conserver mon mot de passe","real":"http://securite-compte365.info/verif","hint":3},"signature":{"text":"Le Support Informatique\nCe message est automatique, merci de ne pas y répondre.","hint":4},"choices":[{"icon":"link","label":"Cliquer sur le lien","desc":"Confirmer mon mot de passe","correct":false},{"icon":"reply","label":"Répondre au mail","desc":"Envoyer mon mot de passe au support","correct":false},{"icon":"flag","label":"Signaler le mail","desc":"Prévenir le service informatique","correct":true}],"hints":[{"title":"Un faux domaine","desc":"« entreprise-helpdesk.com » n''est pas l''adresse habituelle de votre entreprise."},{"title":"La demande du mot de passe","desc":"Le service informatique ne vous demande jamais votre mot de passe, ni par mail ni par téléphone."},{"title":"Le lien","desc":"L''adresse réelle mène vers un site externe sans rapport avec votre entreprise."},{"title":"Impossible de vérifier","desc":"« Merci de ne pas répondre » vous empêche de poser la question au vrai support."}],"reflexe":"En cas de doute, contactez le service informatique par un moyen que vous connaissez déjà (téléphone interne, intranet).","verif":{"question":"Que ne vous demandera jamais le service informatique ?","options":["De redémarrer votre ordinateur","D''installer une mise à jour","De lui communiquer votre mot de passe","De signaler un mail suspect"],"correct":2,"explanation":"Votre mot de passe est personnel : personne, pas même le support, n''a besoin de le connaître."}}'::jsonb) on conflict (id) do nothing;

-- Questions des parcours (administration)
insert into public.questions (id, parcours_id, titre, format, notion, situation, reponses, correct, explication, statut) values ('q1', 'phishing', 'Faux mail de la direction (prime)', 'Mail', null, null, null, 0, null, 'publie') on conflict (id) do nothing;
insert into public.questions (id, parcours_id, titre, format, notion, situation, reponses, correct, explication, statut) values ('q2', 'phishing', 'Colis non livré avec pièce jointe', 'Mail', null, null, null, 0, null, 'publie') on conflict (id) do nothing;
insert into public.questions (id, parcours_id, titre, format, notion, situation, reponses, correct, explication, statut) values ('q3', 'phishing', 'Mot de passe qui expire', 'Mail', null, null, null, 0, null, 'publie') on conflict (id) do nothing;
insert into public.questions (id, parcours_id, titre, format, notion, situation, reponses, correct, explication, statut) values ('q4', 'phishing', 'Facture d''un fournisseur inconnu', 'Mail', null, null, null, 0, null, 'publie') on conflict (id) do nothing;
insert into public.questions (id, parcours_id, titre, format, notion, situation, reponses, correct, explication, statut) values ('q5', 'phishing', 'SMS de la banque', 'Conversation', null, null, null, 0, null, 'brouillon') on conflict (id) do nothing;
insert into public.questions (id, parcours_id, titre, format, notion, situation, reponses, correct, explication, statut) values ('q6', 'mdp', 'Choisir une phrase de passe', 'Conversation', null, null, null, 0, null, 'publie') on conflict (id) do nothing;
insert into public.questions (id, parcours_id, titre, format, notion, situation, reponses, correct, explication, statut) values ('q7', 'mdp', 'Mot de passe noté sur un post-it', 'Image', null, null, null, 0, null, 'publie') on conflict (id) do nothing;
insert into public.questions (id, parcours_id, titre, format, notion, situation, reponses, correct, explication, statut) values ('q8', 'mdp', 'Même mot de passe partout', 'Conversation', null, null, null, 0, null, 'publie') on conflict (id) do nothing;
insert into public.questions (id, parcours_id, titre, format, notion, situation, reponses, correct, explication, statut) values ('q9', 'mdp', 'Activer la double authentification', 'Conversation', null, null, null, 0, null, 'publie') on conflict (id) do nothing;
insert into public.questions (id, parcours_id, titre, format, notion, situation, reponses, correct, explication, statut) values ('q10', 'pj', 'Fichier .zip inattendu', 'Mail', null, null, null, 0, null, 'publie') on conflict (id) do nothing;
insert into public.questions (id, parcours_id, titre, format, notion, situation, reponses, correct, explication, statut) values ('q11', 'pj', 'Document Word avec macros', 'Mail', null, null, null, 0, null, 'publie') on conflict (id) do nothing;
insert into public.questions (id, parcours_id, titre, format, notion, situation, reponses, correct, explication, statut) values ('q12', 'pj', 'Facture en .exe', 'Mail', null, null, null, 0, null, 'publie') on conflict (id) do nothing;
insert into public.questions (id, parcours_id, titre, format, notion, situation, reponses, correct, explication, statut) values ('q13', 'pj', 'Lien de partage de fichiers', 'Mail', null, null, null, 0, null, 'publie') on conflict (id) do nothing;
insert into public.questions (id, parcours_id, titre, format, notion, situation, reponses, correct, explication, statut) values ('q14', 'pj', 'Clé USB trouvée sur le parking', 'Image', null, null, null, 0, null, 'publie') on conflict (id) do nothing;
insert into public.questions (id, parcours_id, titre, format, notion, situation, reponses, correct, explication, statut) values ('q15', 'qr', 'QR code collé sur un parcmètre', 'QR code', null, null, null, 0, null, 'publie') on conflict (id) do nothing;
insert into public.questions (id, parcours_id, titre, format, notion, situation, reponses, correct, explication, statut) values ('q16', 'qr', 'QR code reçu par courrier', 'QR code', null, null, null, 0, null, 'publie') on conflict (id) do nothing;
insert into public.questions (id, parcours_id, titre, format, notion, situation, reponses, correct, explication, statut) values ('q17', 'qr', 'QR code dans un mail', 'Mail', null, null, null, 0, null, 'publie') on conflict (id) do nothing;
insert into public.questions (id, parcours_id, titre, format, notion, situation, reponses, correct, explication, statut) values ('q18', 'qr', 'Menu de restaurant modifié', 'QR code', null, null, null, 0, null, 'brouillon') on conflict (id) do nothing;
insert into public.questions (id, parcours_id, titre, format, notion, situation, reponses, correct, explication, statut) values ('q19', 'ia', 'Reconnaître un faux QR code sur une affiche', 'QR code', 'Faux QR codes', 'Une affiche dans le hall propose de scanner un QR code pour « gagner une carte cadeau ».', array['Scanner le QR code', 'Prévenir l''accueil ou le service informatique', 'Prendre une photo pour plus tard']::text[], 1, 'Un QR code peut mener vers un faux site. Avant de scanner, vérifiez qui a posé l''affiche.', 'publie') on conflict (id) do nothing;
insert into public.questions (id, parcours_id, titre, format, notion, situation, reponses, correct, explication, statut) values ('q20', 'ia', 'Un chatbot vous demande vos identifiants', 'Conversation', 'IA générative', 'Un assistant en ligne vous demande votre identifiant et votre mot de passe pour « finaliser votre demande ».', array['Donner mes identifiants', 'Fermer la conversation et prévenir le support', 'Donner seulement mon identifiant']::text[], 1, 'Aucun assistant légitime ne demande votre mot de passe.', 'publie') on conflict (id) do nothing;
insert into public.questions (id, parcours_id, titre, format, notion, situation, reponses, correct, explication, statut) values ('q21', 'ia', 'Photo truquée d''un dirigeant sur LinkedIn', 'Image', 'IA générative', 'Une photo de votre PDG annonçant un jeu concours circule sur LinkedIn.', array['Partager la publication', 'Vérifier sur le compte officiel de l''entreprise', 'Participer au concours']::text[], 1, 'L''IA permet de créer de fausses images très réalistes : vérifiez toujours la source officielle.', 'publie') on conflict (id) do nothing;
insert into public.questions (id, parcours_id, titre, format, notion, situation, reponses, correct, explication, statut) values ('q22', 'ia', 'Vidéo deepfake en visioconférence', 'Vidéo', 'Deepfakes vocaux', 'En visio, un « directeur » à l''image un peu floue vous demande un virement urgent.', array['Faire le virement', 'Raccrocher et rappeler le directeur sur son numéro habituel', 'Demander un mail de confirmation']::text[], 1, 'Une vidéo peut être truquée en direct. Confirmez toujours par un autre canal.', 'brouillon') on conflict (id) do nothing;

-- Comptes : les 3 comptes de démo ont le mot de passe « demo »,
-- les autres collaborateurs ont un mot de passe aléatoire (non utilisable).
-- La création dans auth.users déclenche la création du profil (trigger on_auth_user_created).
insert into auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, recovery_token, email_change_token_new, email_change)
values ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000000001', 'authenticated', 'authenticated', 'sophie.leroy@entreprise.fr', extensions.crypt('demo', extensions.gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Sophie Leroy"}', now(), now(), '', '', '', '')
on conflict (id) do nothing;
insert into auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
values ('00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', '{"sub":"00000000-0000-4000-8000-000000000001","email":"sophie.leroy@entreprise.fr","email_verified":true}', 'email', now(), now(), now())
on conflict do nothing;
insert into auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, recovery_token, email_change_token_new, email_change)
values ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000000002', 'authenticated', 'authenticated', 'marc.durand@entreprise.fr', extensions.crypt('demo', extensions.gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Marc Durand"}', now(), now(), '', '', '', '')
on conflict (id) do nothing;
insert into auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
values ('00000000-0000-4000-8000-000000000002', '00000000-0000-4000-8000-000000000002', '{"sub":"00000000-0000-4000-8000-000000000002","email":"marc.durand@entreprise.fr","email_verified":true}', 'email', now(), now(), now())
on conflict do nothing;
insert into auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, recovery_token, email_change_token_new, email_change)
values ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000000003', 'authenticated', 'authenticated', 'camille.bernard@entreprise.fr', extensions.crypt('demo', extensions.gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Camille Bernard"}', now(), now(), '', '', '', '')
on conflict (id) do nothing;
insert into auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
values ('00000000-0000-4000-8000-000000000003', '00000000-0000-4000-8000-000000000003', '{"sub":"00000000-0000-4000-8000-000000000003","email":"camille.bernard@entreprise.fr","email_verified":true}', 'email', now(), now(), now())
on conflict do nothing;
insert into auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, recovery_token, email_change_token_new, email_change)
values ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000000004', 'authenticated', 'authenticated', 'hugo.dubois@entreprise.fr', extensions.crypt(gen_random_uuid()::text, extensions.gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Hugo Dubois"}', now(), now(), '', '', '', '')
on conflict (id) do nothing;
insert into auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
values ('00000000-0000-4000-8000-000000000004', '00000000-0000-4000-8000-000000000004', '{"sub":"00000000-0000-4000-8000-000000000004","email":"hugo.dubois@entreprise.fr","email_verified":true}', 'email', now(), now(), now())
on conflict do nothing;
insert into auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, recovery_token, email_change_token_new, email_change)
values ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000000005', 'authenticated', 'authenticated', 'ines.fontaine@entreprise.fr', extensions.crypt(gen_random_uuid()::text, extensions.gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Inès Fontaine"}', now(), now(), '', '', '', '')
on conflict (id) do nothing;
insert into auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
values ('00000000-0000-4000-8000-000000000005', '00000000-0000-4000-8000-000000000005', '{"sub":"00000000-0000-4000-8000-000000000005","email":"ines.fontaine@entreprise.fr","email_verified":true}', 'email', now(), now(), now())
on conflict do nothing;
insert into auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, recovery_token, email_change_token_new, email_change)
values ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000000006', 'authenticated', 'authenticated', 'julien.garnier@entreprise.fr', extensions.crypt(gen_random_uuid()::text, extensions.gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Julien Garnier"}', now(), now(), '', '', '', '')
on conflict (id) do nothing;
insert into auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
values ('00000000-0000-4000-8000-000000000006', '00000000-0000-4000-8000-000000000006', '{"sub":"00000000-0000-4000-8000-000000000006","email":"julien.garnier@entreprise.fr","email_verified":true}', 'email', now(), now(), now())
on conflict do nothing;
insert into auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, recovery_token, email_change_token_new, email_change)
values ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000000007', 'authenticated', 'authenticated', 'lea.martin@entreprise.fr', extensions.crypt(gen_random_uuid()::text, extensions.gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Léa Martin"}', now(), now(), '', '', '', '')
on conflict (id) do nothing;
insert into auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
values ('00000000-0000-4000-8000-000000000007', '00000000-0000-4000-8000-000000000007', '{"sub":"00000000-0000-4000-8000-000000000007","email":"lea.martin@entreprise.fr","email_verified":true}', 'email', now(), now(), now())
on conflict do nothing;
insert into auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, recovery_token, email_change_token_new, email_change)
values ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000000008', 'authenticated', 'authenticated', 'nicolas.petit@entreprise.fr', extensions.crypt(gen_random_uuid()::text, extensions.gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Nicolas Petit"}', now(), now(), '', '', '', '')
on conflict (id) do nothing;
insert into auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
values ('00000000-0000-4000-8000-000000000008', '00000000-0000-4000-8000-000000000008', '{"sub":"00000000-0000-4000-8000-000000000008","email":"nicolas.petit@entreprise.fr","email_verified":true}', 'email', now(), now(), now())
on conflict do nothing;
insert into auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, recovery_token, email_change_token_new, email_change)
values ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000000009', 'authenticated', 'authenticated', 'sarah.roux@entreprise.fr', extensions.crypt(gen_random_uuid()::text, extensions.gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Sarah Roux"}', now(), now(), '', '', '', '')
on conflict (id) do nothing;
insert into auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
values ('00000000-0000-4000-8000-000000000009', '00000000-0000-4000-8000-000000000009', '{"sub":"00000000-0000-4000-8000-000000000009","email":"sarah.roux@entreprise.fr","email_verified":true}', 'email', now(), now(), now())
on conflict do nothing;
insert into auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, recovery_token, email_change_token_new, email_change)
values ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-000000000010', 'authenticated', 'authenticated', 'thomas.vincent@entreprise.fr', extensions.crypt(gen_random_uuid()::text, extensions.gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Thomas Vincent"}', now(), now(), '', '', '', '')
on conflict (id) do nothing;
insert into auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
values ('00000000-0000-4000-8000-000000000010', '00000000-0000-4000-8000-000000000010', '{"sub":"00000000-0000-4000-8000-000000000010","email":"thomas.vincent@entreprise.fr","email_verified":true}', 'email', now(), now(), now())
on conflict do nothing;

-- Rôles, postes et rattachement au manager
update public.profiles set role = 'admin', job = 'Service RH', service = 'Ressources humaines', manager_id = null, last_seen_at = now() - interval '1 hour' where id = '00000000-0000-4000-8000-000000000001';
update public.profiles set role = 'manager', job = 'Responsable du service commercial', service = 'Service commercial', manager_id = null, last_seen_at = now() - interval '1 hour' where id = '00000000-0000-4000-8000-000000000002';
update public.profiles set role = 'joueur', job = 'Assistante commerciale', service = 'Service commercial', manager_id = '00000000-0000-4000-8000-000000000002', last_seen_at = now() - interval '1 hour' where id = '00000000-0000-4000-8000-000000000003';
update public.profiles set role = 'joueur', job = 'Commercial terrain', service = 'Service commercial', manager_id = '00000000-0000-4000-8000-000000000002', last_seen_at = now() - interval '2 days' where id = '00000000-0000-4000-8000-000000000004';
update public.profiles set role = 'joueur', job = 'Assistante commerciale', service = 'Service commercial', manager_id = '00000000-0000-4000-8000-000000000002', last_seen_at = now() - interval '1 day' where id = '00000000-0000-4000-8000-000000000005';
update public.profiles set role = 'joueur', job = 'Chargé de clientèle', service = 'Service commercial', manager_id = '00000000-0000-4000-8000-000000000002', last_seen_at = now() - interval '5 days' where id = '00000000-0000-4000-8000-000000000006';
update public.profiles set role = 'joueur', job = 'Assistante commerciale', service = 'Service commercial', manager_id = '00000000-0000-4000-8000-000000000002', last_seen_at = now() - interval '7 days' where id = '00000000-0000-4000-8000-000000000007';
update public.profiles set role = 'joueur', job = 'Commercial sédentaire', service = 'Service commercial', manager_id = '00000000-0000-4000-8000-000000000002', last_seen_at = now() - interval '1 day' where id = '00000000-0000-4000-8000-000000000008';
update public.profiles set role = 'joueur', job = 'Chargée de clientèle', service = 'Service commercial', manager_id = '00000000-0000-4000-8000-000000000002', last_seen_at = null where id = '00000000-0000-4000-8000-000000000009';
update public.profiles set role = 'joueur', job = 'Commercial terrain', service = 'Service commercial', manager_id = '00000000-0000-4000-8000-000000000002', last_seen_at = now() - interval '3 days' where id = '00000000-0000-4000-8000-000000000010';

-- Parcours terminés par les collaborateurs
insert into public.parcours_completions (user_id, parcours_id, completed_at) values ('00000000-0000-4000-8000-000000000003', 'phishing', now() - interval '14 days') on conflict do nothing;
insert into public.parcours_completions (user_id, parcours_id, completed_at) values ('00000000-0000-4000-8000-000000000003', 'mdp', now() - interval '10 days') on conflict do nothing;
insert into public.parcours_completions (user_id, parcours_id, completed_at) values ('00000000-0000-4000-8000-000000000003', 'pj', now() - interval '7 days') on conflict do nothing;
insert into public.parcours_completions (user_id, parcours_id, completed_at) values ('00000000-0000-4000-8000-000000000004', 'phishing', now() - interval '14 days') on conflict do nothing;
insert into public.parcours_completions (user_id, parcours_id, completed_at) values ('00000000-0000-4000-8000-000000000004', 'mdp', now() - interval '10 days') on conflict do nothing;
insert into public.parcours_completions (user_id, parcours_id, completed_at) values ('00000000-0000-4000-8000-000000000005', 'phishing', now() - interval '14 days') on conflict do nothing;
insert into public.parcours_completions (user_id, parcours_id, completed_at) values ('00000000-0000-4000-8000-000000000005', 'mdp', now() - interval '10 days') on conflict do nothing;
insert into public.parcours_completions (user_id, parcours_id, completed_at) values ('00000000-0000-4000-8000-000000000005', 'pj', now() - interval '7 days') on conflict do nothing;
insert into public.parcours_completions (user_id, parcours_id, completed_at) values ('00000000-0000-4000-8000-000000000005', 'qr', now() - interval '4 days') on conflict do nothing;
insert into public.parcours_completions (user_id, parcours_id, completed_at) values ('00000000-0000-4000-8000-000000000005', 'ia', now() - interval '2 days') on conflict do nothing;
insert into public.parcours_completions (user_id, parcours_id, completed_at) values ('00000000-0000-4000-8000-000000000006', 'phishing', now() - interval '14 days') on conflict do nothing;
insert into public.parcours_completions (user_id, parcours_id, completed_at) values ('00000000-0000-4000-8000-000000000006', 'mdp', now() - interval '10 days') on conflict do nothing;
insert into public.parcours_completions (user_id, parcours_id, completed_at) values ('00000000-0000-4000-8000-000000000006', 'pj', now() - interval '7 days') on conflict do nothing;
insert into public.parcours_completions (user_id, parcours_id, completed_at) values ('00000000-0000-4000-8000-000000000007', 'phishing', now() - interval '14 days') on conflict do nothing;
insert into public.parcours_completions (user_id, parcours_id, completed_at) values ('00000000-0000-4000-8000-000000000008', 'phishing', now() - interval '14 days') on conflict do nothing;
insert into public.parcours_completions (user_id, parcours_id, completed_at) values ('00000000-0000-4000-8000-000000000008', 'mdp', now() - interval '10 days') on conflict do nothing;
insert into public.parcours_completions (user_id, parcours_id, completed_at) values ('00000000-0000-4000-8000-000000000008', 'pj', now() - interval '7 days') on conflict do nothing;
insert into public.parcours_completions (user_id, parcours_id, completed_at) values ('00000000-0000-4000-8000-000000000010', 'phishing', now() - interval '14 days') on conflict do nothing;
insert into public.parcours_completions (user_id, parcours_id, completed_at) values ('00000000-0000-4000-8000-000000000010', 'mdp', now() - interval '10 days') on conflict do nothing;
insert into public.parcours_completions (user_id, parcours_id, completed_at) values ('00000000-0000-4000-8000-000000000010', 'pj', now() - interval '7 days') on conflict do nothing;
insert into public.parcours_completions (user_id, parcours_id, completed_at) values ('00000000-0000-4000-8000-000000000010', 'qr', now() - interval '4 days') on conflict do nothing;

-- Notions à revoir
insert into public.weak_notions (user_id, quiz_id) values ('00000000-0000-4000-8000-000000000003', 'pj') on conflict do nothing;
insert into public.weak_notions (user_id, quiz_id) values ('00000000-0000-4000-8000-000000000004', 'pj') on conflict do nothing;
insert into public.weak_notions (user_id, quiz_id) values ('00000000-0000-4000-8000-000000000004', 'qr') on conflict do nothing;
insert into public.weak_notions (user_id, quiz_id) values ('00000000-0000-4000-8000-000000000006', 'qr') on conflict do nothing;
insert into public.weak_notions (user_id, quiz_id) values ('00000000-0000-4000-8000-000000000007', 'pj') on conflict do nothing;
insert into public.weak_notions (user_id, quiz_id) values ('00000000-0000-4000-8000-000000000008', 'pj') on conflict do nothing;
insert into public.weak_notions (user_id, quiz_id) values ('00000000-0000-4000-8000-000000000010', 'qr') on conflict do nothing;
