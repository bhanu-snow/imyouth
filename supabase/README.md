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

## 3. Seed the initial FAQ content

After all migrations are applied, run the complete `supabase/seed.sql` file in Supabase SQL Editor. It imports the existing bilingual FAQ content into `faq_categories`, `myth_faqs`, and `faq_talking_points`, plus the three bundled sample events and two bundled sample news posts with their tags. It also creates the aggregate-only `event_rsvp_counts` view used by the events page. The seed is idempotent for these bundled records and can be rerun to refresh them.

The FAQ, Events, and News pages now read and write through Supabase rather than browser localStorage. Event RSVP requires a signed-in Supabase user. The FAQ editor requires `superadmin` or `content_manager`; event/news publishing is gated by the page roles and enforced by database RLS.

Important: bundled events and news are prototype/sample content from the existing frontend. Verify every claim, event date, coordinator, and organizational detail before using them as official public announcements. Historical demo RSVP counts and news share counts are intentionally not imported as real engagement.

This seed does not create an Auth user, insert a password, or migrate other localStorage-backed modules such as members, organizational leadership, social broadcasts, or parliamentary history.

## 4. Geography data is not complete yet

The district directory migration seeds all 75 districts listed by the [Government of Uttar Pradesh district portal](https://uttarpradesh.s3waas.gov.in/). The generic "District HQ / Local Unit" entries are placeholders to let the district → local-unit dropdown graph function; they are not official tehsil/block records. Replace them with a verified tehsil/block/ward directory before production.

Before production, import a verified, authoritative Uttar Pradesh dataset into states, zones, districts, and sub_districts. Keep stable codes and UUIDs, and ensure each sub-district references its correct district. Do not add fabricated tehsil names or office-bearer contact details.

## 5. Enable the first real administrator

1. Create the administrator account in Supabase Authentication → Users. Set a strong password there.
2. Open `supabase/bootstrap_admin.sql` and replace `REPLACE_WITH_YOUR_ADMIN_EMAIL` with the exact email used in Supabase Auth. Update `target_name` if desired.
3. Run the edited script in Supabase SQL Editor. It creates/activates the matching profile, assigns the existing `superadmin` role, and returns a verification row.
4. Sign in through the website with that email and password.

The bootstrap script deliberately does not create Auth users or passwords. Never insert passwords into application tables or put the Supabase `service_role` key in frontend code.

Use the actual Auth user UUID and verify the resulting rows. Never store a password in user_profiles, application tables, or browser localStorage. Supabase Auth owns password verification.

## 6. Important current migration boundary

This branch adds the normalized schema, row-level security, a Supabase client, Supabase Auth sign-in/session restoration, and database-backed reference-data loading for the dropdowns updated so far. Several content and administration workflows still call the legacy storageService and browser localStorage; they are not yet migrated to relational CRUD and are not protected by Supabase RLS. Local account creation and password reset are intentionally disabled until a server-side Supabase Auth admin workflow is implemented. Do not treat this branch as production-ready until those workflows are migrated.

After configuring Supabase, run npm run lint and npm run build, then test public application submission, role assignment, login, and each lookup chain in a non-production project before deployment.
