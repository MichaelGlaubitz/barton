# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

Mathechismus.de is a static Astro 6 site (German math didactics). All content lives in Markdown files under `src/content/hacks/`. No database, no Docker, no external runtime dependencies.

### Prerequisites

- Node.js >= 22.12.0 (nvm is available; `nvm use 22`)
- npm (lockfile: `package-lock.json`)

### Key commands

| Action | Command |
|--------|---------|
| Install deps | `npm install` |
| Create `.env` (non-interactive) | `npm run setup -- --silent` |
| Validate hacks | `npm run hacks:validate` |
| Dev server | `npm run dev` (port 4321) |
| Production build | `npm run build` |
| Preview build | `npm run preview` |

### Dev server notes

- `npm run dev` starts Astro + Vite on `http://localhost:4321/`.
- The dev server exposes an admin editor API at `/__admin-editor` (requires `ADMIN_EDIT_TOKEN` ≥ 16 chars in `.env`).
- Hot-reload works for Markdown content and Astro components.
- No external services (DB, Redis, etc.) are needed.

### Environment variables

- `.env` is created from `.env.example` via `npm run setup -- --silent`.
- `PUBLIC_GISCUS_*` vars are optional (comment widget); the site works without them.
- `PUBLIC_ASTRO_SITE` / `PUBLIC_ASTRO_BASE` control URL prefix; defaults to `/` locally.

### Content validation

Run `npm run hacks:validate` to lint all hack Markdown files against the Zod schema defined in `src/content.config.ts`. This is the closest equivalent to a lint/test step.

### Gotchas

- The setup script (`npm run setup`) is interactive by default — always pass `--silent` in CI/agent contexts.
- The project requires Node 22+; older versions will fail on modern ES module features used in config files.
- There is no ESLint or Prettier config in this repo. The only automated check is `npm run hacks:validate`.
