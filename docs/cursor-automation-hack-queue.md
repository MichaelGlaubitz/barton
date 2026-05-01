# Cursor Automations: Hack-Queue (ein Hack pro Lauf)

Kurzdoku für **Cursor Automations** (Cloud Agent): einen `pending`-Eintrag aus der Queue bearbeiten — inhaltlich nach der Projekt-Skill, technisch mit Validierung und Build.

---

## Agent instructions (zum Einfügen in die Automation)

Kopiere den folgenden Block in das Feld für **Anweisungen / Prompt** der Automation (ggf. Trigger und Branch anpassen; siehe Checkliste unten).

```
Arbeite im Repository barton (Wurzel = Repo-Root).

Pflichtlektüre: Lies .cursor/skills/hack-optimieren-eine-datei/SKILL.md und halte dich an Ziel, Begrenzung, Checkliste und Edit-Leitlinien. Struktur der Hack-Dateien beibehalten (Frontmatter-Felder, Überschriften-Reihenfolge wie in den bestehenden Hacks).

Strikte Dateigrenze:
- Bearbeite höchstens src/content/hacks/<slug>.md (eine Datei).
- Optional genau eine weitere Datei: scripts/hack-optimization-queue.json — nur um denselben slug von "pending" auf "done" zu setzen.
- Keine Änderungen an anderen Pfaden (keine Drive-by-Refactors).

Ablauf:
1) npm run hack:next ausführen. Wenn der Befehl fehlschlägt oder kein pending-Slug mehr existiert: sauber beenden und in der Zusammenfassung melden, dass die Queue leer ist — keine Dateien ändern.
2) Den ausgegebenen Slug verwenden. Zieldatei vollständig lesen; 1–2 thematisch nahe Hacks unter src/content/hacks/ als Stilreferenz lesen.
3) Schema prüfen: src/content.config.ts (title, summary, tags, optional order, quiz mit correctIndex < options.length).
4) Den einen Hack optimieren (Inhalt, Stil, Quiz). In quiz-Strings in YAML keine eingebetteten ASCII-Doppelquotes verwenden, die den YAML-String vorzeitig beenden (sonst schlägt astro build fehl). Bei Unsicherheit lieber Formulierungen ohne innere " wählen oder Feld in saubere YAML-Quotes packen.
5) scripts/hack-optimization-queue.json: nur den bearbeiteten slug auf done setzen.
6) npm run hacks:validate && npm run build — beide müssen erfolgreich sein. Bei Fehler: beheben oder nicht als fertig melden.
7) GitHub (online sichtbar): Vor dem Commit ggf. npm ci ausführen, falls node_modules fehlen. Änderungen auf einem neuen Branch committen (Branch-Name z. B. automation/hack-<slug> oder cursor/hack-<slug>). Mit dem Tool „Open Pull Request“ einen Pull Request gegen main öffnen — klare Titelzeile und kurze Beschreibung (welcher Slug, was geändert). Nicht selbst auf main mergen; keinen direkten Push auf main ohne PR. Commit-Message z. B.: content(hacks): <slug> optimieren; queue done

Pro Automation-Lauf genau ein Hack. Nicht mehrere Slugs in einem Lauf.

Hinweis: Slack-Trigger (#hacks, Schlüsselwort) wird in der Automation-UI konfiguriert — muss nicht erneut im Prompt stehen, sofern dort schon eingestellt.
```

---

## Kurz-Checkliste (für dich vor dem ersten Live-Lauf)

- [ ] **GitHub / Branch:** Automation läuft gegen einen **dedizierten Branch** oder erzeugt **PRs** — nicht ungeprüft direkt auf `main`, bis du die Qualität kennst.
- [ ] **Trigger:** erst **selten** (z. B. täglich oder Webhook/Manuell), später ggf. enger takten.
- [ ] **Tools:** nur nötige Aktionen (z. B. PR öffnen); MCP nur bei Bedarf.
- [ ] **Skill-Pfad** im Repo vorhanden: `.cursor/skills/hack-optimieren-eine-datei/SKILL.md` (Cloud-Clone muss dieselbe Struktur haben).
- [ ] **Nach dem ersten Lauf:** Diff lesen (Ton, Querverweise, Quiz-YAML), dann mergen.

---

## Kurz-Checkliste (Agent — entspricht der Skill)

| Schritt | Aktion |
|--------|--------|
| 1 | `hack:next` → Slug oder Abbruch wenn leer |
| 2 | Ziel-Hack + 1–2 Referenz-Hacks lesen |
| 3 | `content.config.ts` beachten |
| 4 | Eine `.md` bearbeiten; Quiz-YAML syntaktisch sicher |
| 5 | Queue-Eintrag `done` |
| 6 | `hacks:validate` + `build` |
| 7 | Commit / PR laut Automation |

---

## Referenzen im Repo

| Was | Pfad |
|-----|------|
| Skill | `.cursor/skills/hack-optimieren-eine-datei/SKILL.md` |
| Queue | `scripts/hack-optimization-queue.json` |
| Nächster Slug | `npm run hack:next` |
| Validierung | `npm run hacks:validate` |
| Astro-Check | `npm run build` |

---

## Hinweis

Cursor lädt Skills nicht zwingend automatisch im Cloud-Agenten; der Prompt **verweist deshalb ausdrücklich** auf die Skill-Datei. Wenn die Automation keinen Zugriff auf `.cursor/` hat, Inhalt der Skill in den Prompt duplizieren oder `.cursor/` im Clone inkludieren (je nach Cursor-/Repo-Einstellungen).
