import 'dotenv/config';
import { AsyncLocalStorage } from 'node:async_hooks';
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

/**
 * Shorthand alias để gọi trực tiếp các models ORM nhanh và gọn:
 * Ví dụ: orm.User.where(...) thay vì db.orm.public.User.where(...)
 */
type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0];
const transactionContext = new AsyncLocalStorage<Transaction>();

// Resolve the ORM per async request: repositories automatically share the
// transaction's connection, while unrelated requests keep using the pool.
export const orm: typeof db.orm.public = new Proxy({} as typeof db.orm.public, {
  get(_target, property) {
    return Reflect.get(
      transactionContext.getStore()?.orm.public ?? db.orm.public,
      property,
    );
  },
});

function retryable(error: unknown): boolean {
  const seen = new Set<unknown>();
  let current: any = error;
  while (current && !seen.has(current)) {
    seen.add(current);
    if (
      ['40001', '40P01'].includes(current.code) ||
      ['40001', '40P01'].includes(current.sqlState) ||
      ['40001', '40P01'].includes(current.meta?.sqlState) ||
      ['40001', '40P01'].includes(current.meta?.code)
    )
      return true;
    current = current.cause;
  }
  return false;
}

/** Database work only: uploads, file deletion and other external effects belong outside. */
export async function withTransaction<T>(
  work: () => Promise<T>,
  serializable = false,
): Promise<T> {
  if (transactionContext.getStore()) return work();
  for (let attempt = 0; ; attempt++) {
    try {
      return await db.transaction(async (tx) => {
        await tx.execute(
          (serializable
            ? db.raw.sql`SET TRANSACTION ISOLATION LEVEL SERIALIZABLE`
            : db.raw.sql`SET TRANSACTION ISOLATION LEVEL READ COMMITTED`
          )
            .affectedCount()
            .build(),
        );
        return transactionContext.run(tx, work);
      });
    } catch (error) {
      if (attempt >= 2 || !retryable(error)) throw error;
      await new Promise((resolve) =>
        setTimeout(resolve, 20 * (attempt + 1) + Math.random() * 30),
      );
    }
  }
}
