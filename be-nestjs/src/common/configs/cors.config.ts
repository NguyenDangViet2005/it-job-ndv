import type { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

export const allowedOrigins = [
  'http://localhost:3000',
  'https://it-job-ndv.vercel.app',
];

export const getCorsOptions = (): CorsOptions => {
  const origins = [...allowedOrigins];

  if (process.env.CLIENT_URL) {
    const envOrigin = process.env.CLIENT_URL.replace(/\/+$/, '');
    if (!origins.includes(envOrigin)) {
      origins.push(envOrigin);
    }
  }

  return {
    origin: (origin, callback) => {
      // Cho phép requests không có origin (mobile app, curl, server-to-server)
      if (!origin) return callback(null, true);

      // Cho phép nếu nằm trong allowedOrigins hoặc là subdomain preview vercel
      if (
        origins.includes(origin) ||
        /^https:\/\/it-job-ndv.*\.vercel\.app$/.test(origin)
      ) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    exposedHeaders: ['Set-Cookie'],
  };
};

export const corsOptions = getCorsOptions();
