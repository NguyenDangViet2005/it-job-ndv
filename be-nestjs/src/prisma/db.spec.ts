import { beforeEach, describe, expect, it, vi } from 'vitest';

const state = vi.hoisted(() => ({
  committed: [] as string[],
  transactions: [] as { isolation: string; writes: string[] }[],
  failures: [] as Error[],
}));

vi.mock('@prisma/orm-postgres/runtime', () => ({
  default: () => ({
    orm: {
      public: {
        User: {
          create: async () => {
            throw new Error('escaped transaction');
          },
        },
      },
    },
    raw: {
      sql: (parts: TemplateStringsArray) => ({
        affectedCount: () => ({ build: () => parts.join('') }),
      }),
    },
    transaction: async (work: (tx: any) => Promise<unknown>) => {
      const record = { isolation: '', writes: [] as string[] };
      state.transactions.push(record);
      const result = await work({
        execute: async (sql: string) => {
          record.isolation = sql;
        },
        orm: {
          public: {
            User: {
              create: async (data: { fullname: string }) => {
                record.writes.push(data.fullname);
                return data;
              },
            },
          },
        },
      });
      const failure = state.failures.shift();
      if (failure) throw failure;
      state.committed.push(...record.writes);
      return result;
    },
  }),
}));

import { orm, withTransaction } from './db.js';
const insert = (fullname: string) =>
  orm.User.create({ fullname, email: `${fullname}@test.local` } as any);

describe('transaction context', () => {
  beforeEach(() => {
    state.committed.length = 0;
    state.transactions.length = 0;
    state.failures.length = 0;
  });

  it('routes repositories through one transaction and rolls back on a later failure', async () => {
    await expect(
      withTransaction(async () => {
        await insert('user');
        throw new Error('membership failed');
      }),
    ).rejects.toThrow('membership failed');
    expect(state.committed).toEqual([]);
    expect(state.transactions[0].writes).toEqual(['user']);
  });

  it('shares the outer transaction for nested database work', async () => {
    await withTransaction(async () => {
      await insert('user');
      await withTransaction(async () => {
        await insert('company');
      });
    });
    expect(state.transactions).toHaveLength(1);
    expect(state.committed).toEqual(['user', 'company']);
    expect(state.transactions[0].isolation).toContain('READ COMMITTED');
  });

  it('isolates concurrent async contexts and clears them after completion', async () => {
    let release!: () => void;
    const barrier = new Promise<void>((resolve) => {
      release = resolve;
    });
    const first = withTransaction(async () => {
      await insert('first-before');
      await barrier;
      await insert('first-after');
    });
    const second = withTransaction(async () => {
      await insert('second');
      release();
    });
    await Promise.all([first, second]);
    expect(state.transactions.map((t) => t.writes)).toEqual([
      ['first-before', 'first-after'],
      ['second'],
    ]);
    await expect(insert('outside')).rejects.toThrow('escaped transaction');
  });

  it('retries the whole serializable operation on a wrapped SQLSTATE failure', async () => {
    state.failures.push(
      Object.assign(new Error('driver'), {
        cause: Object.assign(new Error('serialization'), { code: '40001' }),
      }),
    );
    await withTransaction(async () => {
      await insert('once');
    }, true);
    expect(state.transactions).toHaveLength(2);
    expect(state.committed).toEqual(['once']);
    expect(
      state.transactions.every((t) => t.isolation.includes('SERIALIZABLE')),
    ).toBe(true);
  });

  it('bounds deadlock retries and does not retry constraint violations', async () => {
    state.failures.push(
      ...Array.from({ length: 3 }, () =>
        Object.assign(new Error('deadlock'), { sqlState: '40P01' }),
      ),
    );
    await expect(
      withTransaction(async () => {
        await insert('deadlock');
      }),
    ).rejects.toThrow('deadlock');
    expect(state.transactions).toHaveLength(3);
    expect(state.committed).toEqual([]);
    state.transactions.length = 0;
    state.failures.push(
      Object.assign(new Error('duplicate'), { code: '23505' }),
    );
    await expect(
      withTransaction(async () => {
        await insert('duplicate');
      }),
    ).rejects.toThrow('duplicate');
    expect(state.transactions).toHaveLength(1);
  });
});
