import { afterAll } from 'vitest';
import { configureTestDatabase } from './environment.js';

// Run before importing any repository: db.ts creates its pool at import time.
configureTestDatabase();
const { db } = await import('../../src/prisma/db.js');
afterAll(async () => {
  await db.close();
});
