import type { Response } from 'express';

export const COOKIE_NAME = 'refreshtoken';
export const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

export const isProductionEnv = (): boolean =>
  process.env.NODE_ENV === 'production' ||
  (Boolean(process.env.CLIENT_URL) && !process.env.CLIENT_URL?.includes('localhost'));

/**
 * Thiết lập cookie Refresh Token
 */
export const setRefreshTokenCookie = (res: Response, token: string): void => {
  const isProduction = isProductionEnv();

  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/',
    maxAge: COOKIE_MAX_AGE,
  });
};

/**
 * Xóa cookie Refresh Token
 */
export const clearRefreshTokenCookie = (res: Response): void => {
  const isProduction = isProductionEnv();

  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/',
  });
};
