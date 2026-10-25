import { config } from 'dotenv';
import { fileURLToPath } from 'node:url';

function databaseTarget(value: string) {
  const url = new URL(value);
  if (!['postgres:', 'postgresql:'].includes(url.protocol)) {
    throw new Error('Integration tests require a PostgreSQL URL.');
  }
  const host = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)
    ? 'loopback'
    : url.hostname;
  return {
    host,
    port: url.port || '5432',
    name: decodeURIComponent(url.pathname.slice(1)),
  };
}

export function validateTestDatabase(testUrl?: string, productionUrl?: string) {
  if (!testUrl) {
    throw new Error(
      'Set DATABASE_TEST_URL in be-nestjs/.env; integration tests never fall back to DATABASE_URL.',
    );
  }
  const target = databaseTarget(testUrl);
  if (
    target.host !== 'loopback' ||
    !/(^|[_-])test($|[_-])/i.test(target.name)
  ) {
    throw new Error(
      'DATABASE_TEST_URL must point to a local database with a test name, e.g. it_job_test.',
    );
  }
  if (
    productionUrl &&
    JSON.stringify(target) === JSON.stringify(databaseTarget(productionUrl))
  ) {
    throw new Error(
      'DATABASE_TEST_URL and DATABASE_URL must target different databases.',
    );
  }
  return testUrl;
}

export function configureTestDatabase() {
  config({
    path: fileURLToPath(new URL('../../.env', import.meta.url)),
    quiet: true,
  });
  const url = validateTestDatabase(
    process.env.DATABASE_TEST_URL,
    process.env.DATABASE_URL,
  );
  process.env.DATABASE_URL = url;
  process.env.NODE_ENV = 'test';
  return url;
}
