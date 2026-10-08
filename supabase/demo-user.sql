-- Derfet: demo account "بڕوا" for the one-click login (no email confirmation needed).
-- Run this once in Supabase -> SQL Editor, after profiles.sql. Safe to run again.
-- Must match DEMO_USER in lib/constants.js.

do $$
declare
  demo_email text := 'brwa@darfat.demo';
  demo_password text := 'darfat-demo-2026';
  demo_name text := 'بڕوا';
  uid uuid;
begin
  select id into uid from auth.users where email = demo_email;

  if uid is null then
    uid := gen_random_uuid();

    insert into auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) values (
      '00000000-0000-0000-0000-000000000000', uid, 'authenticated', 'authenticated',
      demo_email, extensions.crypt(demo_password, extensions.gen_salt('bf')), now(),
      '{"provider":"email","providers":["email"]}',
      jsonb_build_object('full_name', demo_name),
      now(), now(), '', '', '', ''
    );

    insert into auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) values (
      gen_random_uuid(), uid, uid::text,
      jsonb_build_object('sub', uid::text, 'email', demo_email, 'email_verified', true),
      'email', now(), now(), now()
    );
  else
    -- Already exists: make sure it is confirmed and the password matches.
    update auth.users
    set email_confirmed_at = coalesce(email_confirmed_at, now()),
        encrypted_password = extensions.crypt(demo_password, extensions.gen_salt('bf'))
    where id = uid;
  end if;

  -- The on_auth_user_created trigger creates the profile; this covers older setups.
  insert into public.profiles (id, full_name)
  values (uid, demo_name)
  on conflict (id) do update set full_name = excluded.full_name;
end $$;
