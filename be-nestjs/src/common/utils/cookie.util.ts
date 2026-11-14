import type { Response } from 'express';

export const COOKIE_NAME = 'refreshtoken';
export const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

export const isProductionEnv = (): boolean =>
  process.env.NODE_ENV === 'production' ||
  process.env.RENDER === 'true' ||
  Boolean(process.env.VERCEL) ||
  (Boolean(process.env.CLIENT_URL) && !process.env.CLIENT_URL?.includes('localhost'));

const useSecureRefreshCookie = (): boolean => {
  const isLocalHttp = /^http:\/\/localhost(?::\d+)?\/?$/.test(
    process.env.CLIENT_URL ?? '',
  );
  return isProductionEnv() &&
    !(isLocalHttp && process.env.COOKIE_ALLOW_LOCAL_HTTP === 'true');
};

/**
 * Thiết lập cookie Refresh Token
 */
export const setRefreshTokenCookie = (res: Response, token: string): void => {
  const secure = useSecureRefreshCookie();

  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure,
    sameSite: secure ? 'none' : 'lax',
    path: '/',
    maxAge: COOKIE_MAX_AGE,
  });
};

/**
 * Xóa cookie Refresh Token
 */
export const clearRefreshTokenCookie = (res: Response): void => {
  const secure = useSecureRefreshCookie();

  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure,
    sameSite: secure ? 'none' : 'lax',
    path: '/',
  });
};
