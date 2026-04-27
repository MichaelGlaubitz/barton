# Mathechismus.de

Deutschsprachige Astro-Static-Site für **Mathechismus.de** mit kurzen Mathe-Didaktik-Tipps, **Mini-Quiz** pro Beitrag und **Giscus**-Kommentaren (GitHub Discussions).

## Neu hier? (ohne Vorkenntnisse)

Im Projektordner nacheinander im Terminal (PowerShell o. ä.):

```bash
npm install
npm run setup
npm run dev
```

- **`npm run setup`** legt die Datei **`.env`** an und fragt optional nach GitHub-Nutzernamen, Repo-Name und Giscus-Daten. Du kannst alles mit ENTER überspringen und später in `.env` nachbearbeiten.
- **`npm run dev`** startet die Vorschau. Im Terminal steht die Adresse (meist **http://localhost:4321/**).

Nur `.env` aus Vorlage kopieren (ohne Fragen): `npm run setup -- --silent`

## Lokal starten (kurz)

```bash
npm install
npm run dev
```

## Neuen Hack anlegen

1. Datei unter [`src/content/hacks/`](src/content/hacks/) anlegen, z. B. `mein-hack.md`.
2. Frontmatter an das Schema in [`src/content.config.ts`](src/content.config.ts) halten:
   - `title`, `summary`, `tags` (Liste), optional `order` (Sortierung auf der Startseite).
   - Optional `quiz`: Liste von Objekten mit `question`, `options` (2–6 Strings), `correctIndex` (0-basiert), `explanation`.
3. Im Markdown-Body Abschnitte wie **Kernaussage**, **So geht’s im Unterricht** usw. nutzen.
4. **YAML:** Texte mit `:` oder `*` am besten in **Anführungszeichen** setzen, sonst bricht der Parser.

## Giscus (Kommentare)

1. Öffentliches GitHub-Repository mit aktivierten **Discussions** anlegen.
2. Auf [giscus.app](https://giscus.app) die Giscus-App installieren und Kategorie wählen.
3. Werte aus der Konfiguration in `.env` kopieren (Vorlage: [`.env.example`](.env.example)). Nur Variablen mit Präfix `PUBLIC_` sind im Astro-Client verfügbar.
4. Neu bauen: `npm run build` — ohne gesetzte `PUBLIC_GISCUS_*`-Pflichtfelder erscheint auf Hack-Seiten ein kurzer Hinweis statt des Widgets.

## GitHub Pages (Projekt-Site)

In [`astro.config.mjs`](astro.config.mjs) werden `site` und `base` aus Umgebungsvariablen gelesen:

| Variable | Beispiel |
|----------|-----------|
| `PUBLIC_ASTRO_SITE` | `https://mathechismus.de` |
| `PUBLIC_ASTRO_BASE` | `/` |

Lokal ohne `.env`: `base` ist `/`, `site` bleibt leer.

### Actions-Workflow

[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) baut bei Push auf `main` und deployt nach **GitHub Pages** (Quelle: GitHub Actions). Im Repository unter **Settings → Pages** die Quelle **GitHub Actions** wählen.

Optional **Repository variables** für `PUBLIC_ASTRO_SITE`, `PUBLIC_ASTRO_BASE` und die `PUBLIC_GISCUS_*`-Werte setzen (gleiche Namen wie in `.env.example`), damit der Build auf GitHub dieselbe Konfiguration wie lokal erhält.

## Inhalt / Rechtliches

Die Texte sind didaktische **Paraphrasen** für den Unterricht — keine wörtliche Wiedergabe urheberrechtlich geschützter Werke. Für Zitate kurze Passagen mit Quellenangabe verwenden.

## Technik

- [Astro 6](https://astro.build/) mit Content Layer (`glob`-Loader).
- `npm run build` → statische Dateien in `dist/`.
