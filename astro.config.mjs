// @ts-check
import { defineConfig } from 'astro/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnv } from 'vite';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { devContentToolsPlugin } from './dev-content-tools.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * GitHub Pages (Projekt-Site): z. B. in .env (nach `npm run setup`)
 *   PUBLIC_ASTRO_SITE=https://deinname.github.io
 *   PUBLIC_ASTRO_BASE=/barton/
 * loadEnv sorgt dafür, dass Werte aus .env auch hier ankommen.
 */
const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';
const env = loadEnv(mode, process.cwd(), '');
const site = env.PUBLIC_ASTRO_SITE;
const base = env.PUBLIC_ASTRO_BASE ?? '/';

export default defineConfig({
	...(site ? { site } : {}),
	base: base.endsWith('/') || base === '/' ? base : `${base}/`,
	trailingSlash: 'always',
	vite: {
		plugins: [devContentToolsPlugin(__dirname)],
		envPrefix: ['PUBLIC_', 'ADMIN_EDIT_'],
	},
	markdown: {
		smartypants: false,
		remarkPlugins: [remarkMath],
		rehypePlugins: [rehypeKatex],
	},
});
