import 'dotenv/config';
import { Temporal } from '@js-temporal/polyfill';

if (!('Temporal' in globalThis)) {
  (globalThis as any).Temporal = Temporal;
}

import postgres from '@prisma/orm-postgres/runtime';
import type { Contract } from './contract.d.js';
import contractJson from './contract.json' with { type: 'json' };

export const db = postgres<Contract>({
  contractJson,
  url: process.env.DATABASE_URL,
});
