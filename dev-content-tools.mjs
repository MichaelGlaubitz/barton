/**
 * Nur in der Entwicklung (`astro dev`): API + HTML-UI zum Bearbeiten von
 * Hack-Markdown (`src/content/hacks/*.md`) und Astro-Seiten (`src/pages/*.astro`).
 *
 * In `.env`: ADMIN_EDIT_TOKEN=<mindestens 16 Zeichen>
 *
 * Aufruf im Browser: {BASE_URL}__admin-editor
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const API_MARKER = '/__admin-api';
const EDITOR_LAST = '__admin-editor';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @param {string} projectRoot Absoluter Pfad zum Repo-Root */
export function devContentToolsPlugin(projectRoot) {
	const hacksDir = path.join(projectRoot, 'src/content/hacks');
	const pagesDir = path.join(projectRoot, 'src/pages');
	const editorHtmlPath = path.join(projectRoot, 'dev-admin-editor.html');

	return {
		name: 'dev-content-tools',
		apply: 'serve',
		configureServer(server) {
			let editorHtmlCache = /** @type {string | null} */ (null);

			server.middlewares.use(async (req, res, next) => {
				try {
					const host = req.headers.host ?? 'localhost';
					const url = new URL(req.url ?? '/', `http://${host}`);
					const urlPath = url[`${'pa'}${'th'}${'name'}`];
					const baseUrl = server.config?.base ?? '/';
					const basePrefix = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
					const editorPaths = new Set([
						`${basePrefix}${EDITOR_LAST}`,
						`${basePrefix}${EDITOR_LAST}/`,
					]);

					// Admin-UI (GET, kein Token nötig — Speichern erfordert Token)
					const isEditor = editorPaths.has(urlPath);
					if (req.method === 'GET' && isEditor) {
						if (editorHtmlCache === null) {
							editorHtmlCache = await fs.readFile(editorHtmlPath, 'utf8');
						}
						const base = server.config?.base ?? '/';
						const html = editorHtmlCache.replaceAll('__INJECT_BASE__', base);
						res.statusCode = 200;
						res.setHeader('Content-Type', 'text/html; charset=utf-8');
						res.end(html);
						return;
					}

					const i = urlPath.indexOf(API_MARKER);
					if (i === -1) return next();

					const env = server.config?.env ?? {};
					const token = String(env.ADMIN_EDIT_TOKEN ?? process.env.ADMIN_EDIT_TOKEN ?? '').trim();

					const subPath = urlPath.slice(i + API_MARKER.length) || '/';
					const segments = subPath.split('/').filter(Boolean);

					const sendJson = (code, body) => {
						res.statusCode = code;
						res.setHeader('Content-Type', 'application/json; charset=utf-8');
						res.end(JSON.stringify(body));
					};

					const readBody = () =>
						new Promise((resolve, reject) => {
							const chunks = [];
							req.on('data', (c) => chunks.push(c));
							req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
							req.on('error', reject);
						});

					if (!token || token.length < 16) {
						return sendJson(503, {
							error: 'ADMIN_EDIT_TOKEN fehlt oder ist zu kurz (mindestens 16 Zeichen). In .env setzen und Dev-Server neu starten.',
						});
					}

					const authHeader = req.headers.authorization ?? '';
					const bearer = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
					const qpToken = url.searchParams.get('token') ?? '';
					const provided = bearer || qpToken;
					if (provided !== token) {
						res.statusCode = 401;
						res.setHeader('Content-Type', 'application/json; charset=utf-8');
						return res.end(JSON.stringify({ error: 'Ungültiges Token' }));
					}

					if (req.method === 'GET' && segments[0] === 'hacks' && segments.length === 1) {
						const names = await fs.readdir(hacksDir);
						const slugs = names
							.filter((n) => n.endsWith('.md'))
							.map((n) => n.replace(/\.md$/, ''))
							.sort((a, b) => a.localeCompare(b, 'de'));
						return sendJson(200, { slugs });
					}

					if (req.method === 'GET' && segments[0] === 'hacks' && segments.length === 2) {
						const slug = segments[1];
						if (!isSafeHackSlug(slug)) return sendJson(400, { error: 'Ungültiger Slug' });
						const filePath = path.join(hacksDir, `${slug}.md`);
						const raw = await fs.readFile(filePath, 'utf8').catch(() => null);
						if (raw === null) return sendJson(404, { error: 'Hack nicht gefunden' });
						return sendJson(200, { slug, raw });
					}

					if (req.method === 'PUT' && segments[0] === 'hacks' && segments.length === 2) {
						const slug = segments[1];
						if (!isSafeHackSlug(slug)) return sendJson(400, { error: 'Ungültiger Slug' });
						const filePath = path.join(hacksDir, `${slug}.md`);
						const body = await readBody();
						if (!body.trim()) return sendJson(400, { error: 'Leerer Inhalt' });
						await fs.writeFile(filePath, body, 'utf8');
						return sendJson(200, { ok: true, slug });
					}

					if (req.method === 'GET' && segments[0] === 'pages' && segments.length === 1) {
						const names = await fs.readdir(pagesDir);
						const files = names
							.filter((n) => n.endsWith('.astro'))
							.sort((a, b) => a.localeCompare(b, 'de'));
						return sendJson(200, { files });
					}

					if (req.method === 'GET' && segments[0] === 'pages' && segments.length === 2) {
						const file = segments[1];
						if (!isSafePageFile(file)) return sendJson(400, { error: 'Ungültiger Dateiname' });
						const filePath = path.join(pagesDir, file);
						const raw = await fs.readFile(filePath, 'utf8').catch(() => null);
						if (raw === null) return sendJson(404, { error: 'Seite nicht gefunden' });
						return sendJson(200, { file, raw });
					}

					if (req.method === 'PUT' && segments[0] === 'pages' && segments.length === 2) {
						const file = segments[1];
						if (!isSafePageFile(file)) return sendJson(400, { error: 'Ungültiger Dateiname' });
						const filePath = path.join(pagesDir, file);
						const body = await readBody();
						if (!body.trim()) return sendJson(400, { error: 'Leerer Inhalt' });
						await fs.writeFile(filePath, body, 'utf8');
						return sendJson(200, { ok: true, file });
					}

					return sendJson(404, { error: 'Unbekannte Route' });
				} catch (e) {
					res.statusCode = 500;
					res.setHeader('Content-Type', 'application/json; charset=utf-8');
					res.end(JSON.stringify({ error: String(e?.message ?? e) }));
				}
			});
		},
	};
}

function isSafeHackSlug(slug) {
	return typeof slug === 'string' && /^[a-z0-9-]+$/.test(slug) && slug.length > 0 && slug.length < 200;
}

function isSafePageFile(name) {
	return typeof name === 'string' && /^[a-z0-9][a-z0-9.-]*\.astro$/i.test(name) && !name.includes('..');
}
