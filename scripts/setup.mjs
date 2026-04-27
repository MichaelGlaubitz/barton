#!/usr/bin/env node
/**
 * Einrichtung für Didaktik-Hacks: .env anlegen, optional Werte setzen, Hinweise zu Giscus/GitHub Pages.
 * Aufruf: npm run setup
 * Nur .env aus Vorlage: npm run setup -- --silent
 */

import { execFile } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const envExample = path.join(root, '.env.example');
const envFile = path.join(root, '.env');

function printHelp() {
	console.log(`
Didaktik-Hacks — Setup

  npm run setup              Interaktiv: .env anlegen, Fragen, Hinweise
  npm run setup -- --silent  Nur .env aus .env.example kopieren (wenn fehlend)
  npm run setup -- --help    Diese Hilfe
`);
}

function upsertEnvLine(content, key, value) {
	const line = `${key}=${value}`;
	const re = new RegExp(`^${key}=.*$`, 'm');
	if (re.test(content)) {
		return content.replace(re, line);
	}
	return content.replace(/\s*$/, '') + '\n' + line + '\n';
}

function openBrowser(url) {
	const cb = (err) => {
		if (err) console.log(`\n(Bitte manuell öffnen: ${url})\n`);
	};
	if (process.platform === 'win32') {
		execFile('cmd', ['/c', 'start', '', url], { windowsHide: true }, cb);
	} else if (process.platform === 'darwin') {
		execFile('open', [url], cb);
	} else {
		execFile('xdg-open', [url], cb);
	}
}

async function main() {
	const args = process.argv.slice(2);
	if (args.includes('--help') || args.includes('-h')) {
		printHelp();
		return;
	}

	const silent = args.includes('--silent');

	if (!fs.existsSync(envExample)) {
		console.error('Fehlt die Datei .env.example im Projektordner.');
		process.exit(1);
	}

	if (!fs.existsSync(envFile)) {
		fs.copyFileSync(envExample, envFile);
		if (!silent) {
			console.log('Erledigt: .env wurde aus .env.example erstellt.\n');
		}
	} else if (!silent) {
		console.log('Hinweis: .env existiert schon — sie wird nur ergänzt/aktualisiert, nicht gelöscht.\n');
	}

	if (silent) {
		return;
	}

	const rl = readline.createInterface({ input, output });

	console.log('══════════════════════════════════════════════════════');
	console.log('  Didaktik-Hacks — Einrichtung (Schritt für Schritt)');
	console.log('══════════════════════════════════════════════════════\n');
	console.log(
		'Du kannst bei jeder Frage ENTER drücken, um nichts zu ändern.\n',
	);

	let envContent = fs.readFileSync(envFile, 'utf8');

	const ghUser = (await rl.question('1) Dein GitHub-Benutzername (für die Website-URL): ')).trim();
	const ghRepo = (await rl.question('2) Name deines GitHub-Repos (z. B. barton): ')).trim();

	if (ghUser && ghRepo) {
		const site = `https://${ghUser}.github.io`;
		const base = `/${ghRepo.replace(/^\/+|\/+$/g, '')}/`;
		envContent = upsertEnvLine(envContent, 'PUBLIC_ASTRO_SITE', site);
		envContent = upsertEnvLine(envContent, 'PUBLIC_ASTRO_BASE', base);
		console.log('\n   → PUBLIC_ASTRO_SITE und PUBLIC_ASTRO_BASE in .env eingetragen.');
		console.log(`     Erwartete Adresse später: ${site}/${ghRepo}/`);
	} else {
		console.log('\n   (Übersprungen — kannst du später in .env eintragen.)');
	}

	console.log('\n--- Giscus (Kommentare unter jedem Hack) ---');
	console.log(
		'   Dafür brauchst du ein öffentliches GitHub-Repo mit „Discussions“ und die App auf giscus.app.\n',
	);

	const openG = (
		await rl.question('3) Soll ich giscus.app im Browser öffnen? (j/n, Standard: j): ')
	)
		.trim()
		.toLowerCase();
	if (openG !== 'n' && openG !== 'nein') {
		openBrowser('https://giscus.app/de');
		console.log('   Browser geöffnet (oder Link oben manuell).');
	}

	const hasGiscus = (
		await rl.question(
			'\n4) Hast du dort schon repo, repoId und categoryId? (j/n): ',
		)
	)
		.trim()
		.toLowerCase();

	if (hasGiscus === 'j' || hasGiscus === 'ja') {
		const repo = (await rl.question('   PUBLIC_GISCUS_REPO (Format: Nutzer/Repo): ')).trim();
		const repoId = (await rl.question('   PUBLIC_GISCUS_REPO_ID: ')).trim();
		const catId = (await rl.question('   PUBLIC_GISCUS_CATEGORY_ID: ')).trim();
		const category = (
			await rl.question(
				'   PUBLIC_GISCUS_CATEGORY (Name der Discussion-Kategorie, Standard: Announcements): ',
			)
		).trim();

		if (repo) envContent = upsertEnvLine(envContent, 'PUBLIC_GISCUS_REPO', repo);
		if (repoId) envContent = upsertEnvLine(envContent, 'PUBLIC_GISCUS_REPO_ID', repoId);
		if (catId) envContent = upsertEnvLine(envContent, 'PUBLIC_GISCUS_CATEGORY_ID', catId);
		if (category) envContent = upsertEnvLine(envContent, 'PUBLIC_GISCUS_CATEGORY', category);
		console.log('\n   → Giscus-Werte in .env eingetragen.');
	} else {
		console.log(
			'\n   Kein Problem — die Seite funktioniert ohne Giscus; unter jedem Hack erscheint dann ein kurzer Hinweis.',
		);
	}

	fs.writeFileSync(envFile, envContent, 'utf8');
	rl.close();

	console.log('\n══════════════════════════════════════════════════════');
	console.log('  Fertig.');
	console.log('══════════════════════════════════════════════════════\n');
	console.log('  Lokal ansehen:     npm run dev');
	console.log('  Dann im Browser:   http://localhost:4321/  (Port kann abweichen — siehe Terminal)\n');
	console.log('  Produktions-Build: npm run build');
	console.log('  Build testen:      npm run preview\n');
	console.log(
		'  GitHub Pages: Repo auf GitHub anlegen, Code pushen, unter „Settings → Pages“ die Quelle „GitHub Actions“ wählen.',
	);
	console.log(
		'  Für den Build dort dieselben Werte wie in .env als „Repository variables“ eintragen (siehe README).\n',
	);
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
