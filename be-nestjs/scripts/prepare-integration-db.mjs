import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { copyFileSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { configureTestDatabase } from '../test/integration/environment.ts';

configureTestDatabase();
const projectRoot = fileURLToPath(new URL('../', import.meta.url));
// Prisma db update also advances local refs. Keep those outside source migrations.
const scratch = mkdtempSync(join(projectRoot, 'node_modules/.integration-db-'));
try {
  for (const file of ['contract.prisma', 'contract.json', 'contract.d.ts']) {
    copyFileSync(join(projectRoot, 'src/prisma', file), join(scratch, file));
  }
  writeFileSync(
    join(scratch, 'prisma.config.ts'),
    `
import { definePrismaConfig } from '@prisma/cli-engine';
import { defineConfig } from '@prisma/orm-postgres/config';
export default definePrismaConfig({
  orm: defineConfig({ contract: './contract.prisma', db: { connection: process.env.DATABASE_URL } }),
});
`,
  );
  // No reset and no consent to destructive changes.
  const result = spawnSync(
    process.execPath,
    [
      fileURLToPath(
        new URL('../node_modules/prisma/dist/prisma.js', import.meta.url),
      ),
      'db',
      'update',
      '--no-interactive',
    ],
    {
      cwd: scratch,
      env: process.env,
      stdio: 'inherit',
    },
  );
  if (result.error) throw result.error;
  process.exitCode = result.status ?? 1;
} finally {
  rmSync(scratch, { recursive: true, force: true, maxRetries: 10, retryDelay: 100 });
}
