-- Bootstrap the first application administrator AFTER creating the user in
-- Supabase Dashboard -> Authentication -> Users.
-- Replace BOTH occurrences of REPLACE_WITH_YOUR_ADMIN_EMAIL and the display name below before running.
-- This does not create a user or password; Supabase Auth owns credentials.

DO $$
DECLARE
  target_email text := 'REPLACE_WITH_YOUR_ADMIN_EMAIL';
  target_name text := 'Portal Administrator';
  target_user_id uuid;
  target_role_id uuid;
BEGIN
  SELECT id
    INTO target_user_id
    FROM auth.users
   WHERE lower(email) = lower(target_email)
   LIMIT 1;

  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'No Supabase Auth user found for email %. Create the user in Authentication -> Users first.', target_email;
  END IF;

  SELECT id
    INTO target_role_id
    FROM public.roles
   WHERE code = 'superadmin'
     AND is_active = true
   LIMIT 1;

  IF target_role_id IS NULL THEN
    RAISE EXCEPTION 'Active superadmin role was not found in public.roles. Verify the core migration.';
  END IF;

  INSERT INTO public.user_profiles (user_id, full_name, allow_login, is_active)
  VALUES (target_user_id, target_name, true, true)
  ON CONFLICT (user_id) DO UPDATE
    SET full_name = EXCLUDED.full_name,
        allow_login = true,
        is_active = true,
        updated_at = now();

  INSERT INTO public.user_roles (user_id, role_id)
  VALUES (target_user_id, target_role_id)
  ON CONFLICT (user_id, role_id) DO NOTHING;
END
$$;

-- Verify the resulting application identity:
SELECT u.email, p.user_id, p.full_name, p.allow_login, p.is_active, r.code AS role_code
FROM auth.users u
JOIN public.user_profiles p ON p.user_id = u.id
JOIN public.user_roles ur ON ur.user_id = u.id
JOIN public.roles r ON r.id = ur.role_id
WHERE lower(u.email) = lower('REPLACE_WITH_YOUR_ADMIN_EMAIL');
