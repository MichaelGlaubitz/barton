import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const queuePath = resolve(process.cwd(), 'scripts/hack-optimization-queue.json');

function isValidStatus(status) {
  return status === 'pending' || status === 'done';
}

try {
  const raw = await readFile(queuePath, 'utf8');
  const queue = JSON.parse(raw);

  if (!Array.isArray(queue)) {
    throw new Error('Queue muss ein Array sein.');
  }

  for (const [index, item] of queue.entries()) {
    if (!item || typeof item.slug !== 'string' || !isValidStatus(item.status)) {
      throw new Error(`Ungueltiger Queue-Eintrag an Position ${index}.`);
    }
  }

  const next = queue.find((item) => item.status === 'pending');

  if (!next) {
    process.exitCode = 1;
  } else {
    process.stdout.write(`${next.slug}\n`);
  }
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`next-hack Fehler: ${message}\n`);
  process.exitCode = 2;
}
