import { validateTestDatabase } from './environment.js';

describe('integration database guard (no connection)', () => {
  const local = 'postgresql://user:password@localhost:5433/it_job_test';
  it('accepts the separate local test database', () => {
    expect(
      validateTestDatabase(
        local,
        'postgresql://user:password@production:5432/it_job',
      ),
    ).toBe(local);
  });
  it('does not fall back to the production URL', () => {
    expect(() => validateTestDatabase(undefined, local)).toThrow(
      'Set DATABASE_TEST_URL',
    );
  });
  it.each([
    'postgresql://user:password@production:5432/it_job_test',
    'postgresql://user:password@localhost:5433/it_job',
    'postgresql://user:password@localhost:5433/contest',
    'https://localhost/it_job_test',
  ])('rejects unsafe target %s', (url) => {
    expect(() => validateTestDatabase(url)).toThrow();
  });
  it('detects the same database despite different credentials, options and loopback spelling', () => {
    expect(() =>
      validateTestDatabase(
        local,
        'postgres://other:secret@127.0.0.1:5433/it_job_test?sslmode=disable',
      ),
    ).toThrow('different databases');
  });
});
