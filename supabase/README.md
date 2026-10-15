# IM Youth Portal — Supabase relational database setup

## 1. Configure the client

Copy the Supabase project URL and publishable/anon key from Supabase Project Settings → API into your local .env file:

    VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
    VITE_SUPABASE_ANON_KEY=YOUR_PUBLISHABLE_OR_ANON_KEY

The browser must use only the publishable/anon key. Never put the service_role key in Vite variables or frontend code.

Install dependencies and start the app:

    npm install
    npm run dev

## 2. Apply migrations in order

Use the Supabase SQL Editor or Supabase CLI to apply these files in ascending timestamp order:

1. migrations/20261016000100_relational_core.sql
2. migrations/20261016000200_rls_policies.sql
3. migrations/20261016000300_geography_integrity.sql
4. migrations/20261016000400_lookup_ordering.sql
5. migrations/20261016000500_member_lookup_catalogs.sql
6. migrations/20261016000600_security_hardening.sql
7. migrations/20261016000700_up_district_directory.sql
8. migrations/20261016000800_designation_lookups.sql

Do not run only the first migration: later migrations add row-level security, lookup data, and integrity constraints.

## 3. Geography data is not complete yet

The district directory migration seeds all 75 districts listed by the Government of Uttar Pradesh district portal. The generic "District HQ / Local Unit" entries are placeholders to let the district → local-unit dropdown graph function; they are not official tehsil/block records. Replace them with a verified tehsil/block/ward directory before production.

Before production, import a verified, authoritative Uttar Pradesh dataset into states, zones, districts, and sub_districts. Keep stable codes and UUIDs, and ensure each sub-district references its correct district. Do not add fabricated tehsil names or office-bearer contact details.

## 4. Enable the first real administrator

1. Create the first administrator account in Supabase Authentication → Users.
2. Copy that user's UUID.
3. In the SQL Editor, insert a matching user_profiles row with allow_login = true and is_active = true.
4. Assign the superadmin role through user_roles using the matching role UUID from roles.

Use the actual Auth user UUID and verify the resulting rows. Never store a password in user_profiles, application tables, or browser localStorage. Supabase Auth owns password verification.

## 5. Important current migration boundary

This branch adds the normalized schema, row-level security, a Supabase client, and database-backed reference-data loading for the dropdowns updated so far. Several content and administration workflows still call the legacy storageService and browser localStorage. Those workflows are not yet migrated to relational CRUD and must not be treated as production-persistent or protected by Supabase RLS until their data access is moved to Supabase.

After configuring Supabase, run npm run lint and npm run build, then test public application submission, role assignment, login, and each lookup chain in a non-production project before deployment.
