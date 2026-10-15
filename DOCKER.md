# IM Youth Portal — Docker development

This repository is a Vite + React application generated in Google AI Studio. Docker is optional for deployment, but this setup lets developers run the app and its checks without installing Bun, Node.js, or npm on the host.

## Prerequisites

- Docker Desktop running with Linux containers enabled.
- Git and a terminal.
- Supabase project URL and publishable/anon key for live database testing.

## Start the development server

1. Check out the `feat/supabase-database-migration` branch.
2. Copy `.env.example` to `.env` and set:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. From the repository root, run:

   ```powershell
   docker compose up --build
   ```

4. Open http://localhost:3000.

The source directory is bind-mounted for development. Dependencies are stored in a Docker-managed named volume, not installed on the Windows host.

## Run checks in a one-off container

Run TypeScript checking:

```powershell
docker compose run --rm imyouth bun run lint
```

Run the production build:

```powershell
docker compose run --rm imyouth bun run build
```

The build output is written to `dist/` in the working tree because the repository is bind-mounted.

## Stop the app

```powershell
docker compose down
```

To remove the dependency volume and force a fresh dependency install on the next build, use `docker compose down --volumes`. This removes the named dependency volume; do not use it if you intentionally want to preserve cached dependencies.

## Security

- Only the Supabase publishable/anon key belongs in the browser app's `VITE_SUPABASE_ANON_KEY`.
- Never add a Supabase `service_role` key to `.env`, Vite variables, source code, or a client container.
- Do not commit `.env`; it is ignored by Git.
- Applying the SQL migrations to Supabase is a separate step. Docker startup does not apply them automatically.
