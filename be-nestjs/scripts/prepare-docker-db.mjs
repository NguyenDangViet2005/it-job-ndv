import { spawnSync } from 'node:child_process';
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const scratch = mkdtempSync(join(root, '.schema-work', 'prisma-'));

try {
  // Prisma RC compares mapped CHECK expressions with PostgreSQL's SQL text.
  // The PostgreSQL 15 image prints these array casts as per-element casts.
  const contract = readFileSync(join(root, 'src/prisma/contract.prisma'), 'utf8');
  const normalized = contract.replace(
    /ANY \(\(ARRAY\[((?:'[^']+'::character varying)(?:, '[^']+'::character varying)*)\]\)::text\[\]\)/g,
    (_, values) =>
      `ANY (ARRAY[${values.split(', ').map((value) => `(${value})::text`).join(', ')}])`,
  );
  mkdirSync(join(scratch, 'src/prisma'), { recursive: true });
  writeFileSync(join(scratch, 'src/prisma/contract.prisma'), normalized);
  copyFileSync(join(root, 'prisma.config.ts'), join(scratch, 'prisma.config.ts'));

  const cli = join(root, 'node_modules/prisma/dist/prisma.js');
  for (const args of [['contract', 'emit'], ['db', 'update', '--no-interactive']]) {
    const result = spawnSync(process.execPath, [cli, ...args], {
      cwd: scratch,
      stdio: 'inherit',
    });
    if (result.error) throw result.error;
    if (result.status !== 0) {
      process.exitCode = result.status ?? 1;
      break;
    }
  }
} finally {
  rmSync(scratch, { recursive: true });
}
