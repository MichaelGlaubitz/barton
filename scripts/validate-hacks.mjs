import { readdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const hacksDir = resolve(process.cwd(), 'src/content/hacks');

function parseFrontmatter(source, filePath) {
  const cleanSource = source.replace(/^\uFEFF/, '');
  const match = cleanSource.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) {
    throw new Error(`${filePath}: Frontmatter fehlt.`);
  }
  return match[1];
}

function readScalar(frontmatter, key) {
  const regex = new RegExp(`^${key}:\\s*(.+)$`, 'm');
  const match = frontmatter.match(regex);
  return match ? match[1].trim() : null;
}

function readTags(frontmatter) {
  const blockMatch = frontmatter.match(/^tags:\s*\r?\n((?:\s*-\s*.+\r?\n?)*)/m);
  if (!blockMatch) return null;
  const tags = blockMatch[1]
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith('- '))
    .map((line) => line.slice(2).trim())
    .filter(Boolean);
  return tags;
}

function readQuizBlocks(frontmatter) {
  const quizStart = frontmatter.match(/^quiz:\s*$/m);
  if (!quizStart) return [];

  const startIndex = quizStart.index + quizStart[0].length;
  const quizBody = frontmatter.slice(startIndex);
  const questionBlocks = quizBody.match(/  - question:[\s\S]*?(?=\r?\n  - question:|$)/g);
  return questionBlocks ?? [];
}

function countOptions(questionBlock) {
  const options = questionBlock.match(/^\s{6}-\s+/gm);
  return options ? options.length : 0;
}

function readCorrectIndex(questionBlock) {
  const match = questionBlock.match(/^\s{4}correctIndex:\s*(\d+)\s*$/m);
  return match ? Number.parseInt(match[1], 10) : null;
}

function validateHack(frontmatter, filePath) {
  const errors = [];
  const title = readScalar(frontmatter, 'title');
  const summary = readScalar(frontmatter, 'summary');
  const tags = readTags(frontmatter);

  if (!title) errors.push('title fehlt oder ist leer');
  if (!summary) errors.push('summary fehlt oder ist leer');
  if (!tags || tags.length === 0) errors.push('tags fehlen oder sind leer');

  const order = readScalar(frontmatter, 'order');
  if (order && !/^\d+$/.test(order)) {
    errors.push('order muss eine ganze Zahl sein');
  }

  const quizBlocks = readQuizBlocks(frontmatter);
  quizBlocks.forEach((block, index) => {
    const optionsCount = countOptions(block);
    const correctIndex = readCorrectIndex(block);

    if (optionsCount < 2) {
      errors.push(`quiz[${index}] hat weniger als 2 Optionen`);
    }
    if (correctIndex === null) {
      errors.push(`quiz[${index}] hat keinen correctIndex`);
      return;
    }
    if (correctIndex < 0 || correctIndex >= optionsCount) {
      errors.push(
        `quiz[${index}] hat ungueltigen correctIndex (${correctIndex}) bei ${optionsCount} Optionen`,
      );
    }
  });

  return errors.map((error) => `${filePath}: ${error}`);
}

async function main() {
  const files = (await readdir(hacksDir))
    .filter((file) => file.endsWith('.md'))
    .sort((a, b) => a.localeCompare(b));

  const allErrors = [];

  for (const file of files) {
    const fullPath = resolve(hacksDir, file);
    const source = await readFile(fullPath, 'utf8');
    const frontmatter = parseFrontmatter(source, file);
    allErrors.push(...validateHack(frontmatter, file));
  }

  if (allErrors.length > 0) {
    process.stderr.write(`Hacks-Validierung fehlgeschlagen (${allErrors.length} Fehler):\n`);
    process.stderr.write(`${allErrors.map((line) => `- ${line}`).join('\n')}\n`);
    process.exitCode = 1;
    return;
  }

  process.stdout.write(`Hacks-Validierung erfolgreich (${files.length} Dateien).\n`);
}

await main();
