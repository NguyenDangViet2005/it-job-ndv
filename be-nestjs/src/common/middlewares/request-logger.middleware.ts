import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';

/**
 * Middleware ghi log chi tiết cho mỗi request gửi đến ứng dụng:
 * HTTP Method, URL, IP, User-Agent, StatusCode, và thời gian thực thi (ms).
 */
@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction): void {
    const { method, originalUrl, ip } = req;
    const userAgent = req.get('user-agent') || '';
    const startTime = Date.now();
    const reqId = req.requestId || (req.headers['x-request-id'] as string) || '';

    res.on('finish', () => {
      const { statusCode } = res;
      const duration = Date.now() - startTime;
      const reqIdTag = reqId ? `[${reqId}] ` : '';

      const logMessage = `${reqIdTag}${method} ${originalUrl} ${statusCode} - ${duration}ms - IP: ${ip} - UA: ${userAgent}`;

      if (statusCode >= 500) {
        this.logger.error(logMessage);
      } else if (statusCode >= 400) {
        this.logger.warn(logMessage);
      } else {
        this.logger.log(logMessage);
      }
    });

    next();
  }
}
