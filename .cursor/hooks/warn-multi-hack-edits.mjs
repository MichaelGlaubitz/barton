#!/usr/bin/env node
import { execSync } from 'node:child_process';

function readInput() {
  return new Promise((resolve) => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (chunk) => {
      data += chunk;
    });
    process.stdin.on('end', () => resolve(data));
  });
}

function getEditedHackFiles() {
  try {
    const out = execSync('git status --porcelain -- src/content/hacks', {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    const files = new Set();
    for (const line of out.split(/\r?\n/)) {
      if (!line.trim()) continue;
      const cleaned = line.replace(/^\s*[A-Z?]{1,2}\s+/, '');
      const normalized = cleaned.replace(/\\/g, '/');
      if (normalized.startsWith('src/content/hacks/') && normalized.endsWith('.md')) {
        files.add(normalized);
      }
    }
    return [...files];
  } catch {
    return [];
  }
}

function extractPathCandidates(payload) {
  if (!payload || typeof payload !== 'object') return [];
  const result = [];
  const stack = [payload];

  while (stack.length > 0) {
    const current = stack.pop();
    if (!current || typeof current !== 'object') continue;

    for (const [key, value] of Object.entries(current)) {
      if (typeof value === 'string') {
        if (
          key.toLowerCase().includes('path') ||
          key.toLowerCase().includes('file') ||
          key.toLowerCase().includes('target')
        ) {
          result.push(value.replace(/\\/g, '/'));
        }
      } else if (value && typeof value === 'object') {
        stack.push(value);
      }
    }
  }

  return result;
}

const raw = await readInput();
let payload = {};
try {
  payload = raw ? JSON.parse(raw) : {};
} catch {
  process.stdout.write('{ "permission": "allow" }\n');
  process.exit(0);
}

const candidates = extractPathCandidates(payload);
const touchesHackFile = candidates.some(
  (value) => value.includes('/src/content/hacks/') && value.endsWith('.md'),
);

if (!touchesHackFile) {
  process.stdout.write('{ "permission": "allow" }\n');
  process.exit(0);
}

const editedHackFiles = getEditedHackFiles();
if (editedHackFiles.length > 1) {
  const message = {
    permission: 'ask',
    user_message:
      'Mehr als eine Hack-Datei ist bereits geaendert. Bitte bestaetige, dass wirklich nur eine md-Datei pro Lauf bearbeitet wird.',
    agent_message: `Geaenderte Hack-Dateien: ${editedHackFiles.join(', ')}`,
  };
  process.stdout.write(`${JSON.stringify(message)}\n`);
  process.exit(0);
}

process.stdout.write('{ "permission": "allow" }\n');
