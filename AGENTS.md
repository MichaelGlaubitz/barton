# AGENTS.md

## Cursor Cloud specific instructions

### Overview

Mathechismus.de is a German-language static Astro 6 site for math teaching tips ("Hacks") with interactive quizzes. No backend services, databases, or Docker required.

### Node.js

Requires Node.js `>=22.12.0`. nvm is available at `/home/ubuntu/.nvm/nvm.sh`. To activate:

```bash
export NVM_DIR="/home/ubuntu/.nvm" && . "$NVM_DIR/nvm.sh" && nvm use 22
```

### Key commands

| Task | Command |
|------|---------|
| Install deps | `npm install` |
| Create `.env` (non-interactive) | `npm run setup -- --silent` |
| Validate hacks | `npm run hacks:validate` |
| Dev server | `npm run dev` (http://localhost:4321/) |
| Build | `npm run build` |

### Notes

- No ESLint, Prettier, or test framework is configured. The only validation command is `npm run hacks:validate` which checks hack markdown frontmatter.
- The `.env` file is created from `.env.example` by `npm run setup -- --silent`. All env vars are optional for local development (Giscus comments show a placeholder without config).
- The `automation/cloudflare-bridge/` directory contains an unrelated Cloudflare Worker for CI automation; it is not needed for local development.
