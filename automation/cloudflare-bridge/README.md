# Cloudflare Bridge (Kostenlos)

Dieser Ordner enthaelt einen minimalen, kostenlosen Bridge-Service fuer den Workflow `Hack Optimize Dispatch`.

## Was dieser Worker jetzt schon kann

- nimmt `POST /hack-optimize` an
- prueft `X-Automation-Token` gegen Worker-Secret `AUTOMATION_TOKEN`
- validiert Basis-Payload (`mode`, optional `slug`)
- gibt klare JSON-Statusantwort zurueck (fuer GitHub Actions Summary)

## Was dieser Worker **noch nicht** macht

- keine echte Hack-Optimierung
- kein Commit/Push

Er ist als sicherer Startpunkt gedacht, damit du sofort mobil testen kannst.

## 1) Kostenlos deployen

Voraussetzung: Cloudflare-Account (Free Plan) + Node.js lokal.

```bash
cd automation/cloudflare-bridge
npm install -g wrangler
wrangler login
wrangler secret put AUTOMATION_TOKEN
wrangler deploy
```

Nach `wrangler deploy` bekommst du eine URL wie:

`https://barton-automation-bridge.<account>.workers.dev`

Die vollstaendige Secret-URL fuer GitHub ist dann:

`https://barton-automation-bridge.<account>.workers.dev/hack-optimize`

## 2) GitHub Secrets setzen

Im Repo `Settings -> Secrets and variables -> Actions`:

- `AUTOMATION_WEBHOOK_URL` = `https://...workers.dev/hack-optimize`
- `AUTOMATION_TOKEN` = exakt derselbe Token wie im Worker-Secret

## 3) Mobil testen

In GitHub App:

1. Actions -> `Hack Optimize Dispatch`
2. `Run workflow`
3. `mode=next` (oder `slug`)
4. Ergebnis in der Summary lesen

Wenn alles korrekt ist, kommt ein `queued` mit Klartext.

## 4) Nächster Ausbau (optional)

Um wirklich zu optimieren, musst du in `src/worker.js` den markierten Bereich ersetzen durch:

- Aufruf einer echten Cursor-Automation-API **oder**
- `workflow_dispatch` auf einen zweiten GitHub-Workflow, der den Textlauf ausfuehrt.

Das Grundgeruest (Auth + Payload + Klartextstatus) bleibt gleich.
