---
name: hack-optimieren-eine-datei
description: Optimiert genau eine Hack-Markdown-Datei inhaltlich und stilistisch bei gleichbleibender Struktur. Verwenden, wenn ein einzelner Eintrag unter src/content/hacks/ ueberarbeitet werden soll und Klarheit, Konsistenz sowie Quiz-Richtigkeit verbessert werden muessen.
---

# Hack optimieren (eine Datei)

## Ziel

Verbessere genau **eine** Datei unter `src/content/hacks/` in drei Dimensionen:
- inhaltliche Klarheit und fachliche Stringenz
- stilistische Qualitaet und Lesbarkeit
- formale Korrektheit von Frontmatter und Quiz

## Strikte Begrenzung

- Bearbeite nur `src/content/hacks/<slug>.md`.
- Optional ist genau **eine** zweite Aenderung erlaubt: der zugehoerige Queue-Status in `scripts/hack-optimization-queue.json`.
- Keine Drive-by-Refactors, keine Aenderungen an anderen Hacks.

## Pflicht-Checkliste vor dem Edit

1. Lies die Zieldatei vollstaendig.
2. Lies 1-2 thematisch benachbarte Hacks als Stil- und Abgrenzungsreferenz (z. B. bei Routinen die Schwester-Hacks).
3. Pruefe das Collection-Schema in `src/content.config.ts`:
   - `title`, `summary`, `tags`
   - optional `order`
   - `quiz[].correctIndex < quiz[].options.length`

## Edit-Leitlinien

### Inhalt
- Kernaussage zu Beginn klar und konkret machen.
- "Was ist das?" von "Warum ist das gut?" sauber trennen.
- Beispiele als nachvollziehbare Mini-Szenarien formulieren statt als Schlagwortliste.
- Typische Fehlanwendungen konkret beschreiben (nicht abstrakt).

### Stil
- Kurze, dichte Saetze mit klaren Verben.
- Keine Worthuelsen, kein Methodenjargon ohne Nutzen.
- Konsequent bei Begriffen bleiben (z. B. "Routine", "Schritt", "Diagnose").

### Quiz-Qualitaet
- Pro Frage genau eine eindeutig richtige Antwort.
- Distraktoren plausibel, aber klar falsch.
- Erklaerung begruendet den richtigen Index nachvollziehbar.
- `correctIndex` immer gegen die tatsaechliche Optionen-Reihenfolge verifizieren.

## Validierung nach dem Edit

1. Fuehre aus:
   - `npm run hacks:validate`
   - optional zur Gesamtsicherheit: `npm run build`
2. Wenn Queue genutzt wird:
   - genau den bearbeiteten `slug` von `pending` auf `done` setzen.

## Ausgabeformat im Chat

- Kurz nennen, was verbessert wurde (Inhalt, Stil, Quiz).
- Bei Quiz-Aenderungen explizit die Korrektheit von `correctIndex` bestaetigen.
- Keine langen Prosa-Zusammenfassungen; Fokus auf den konkreten Mehrwert des Edits.
