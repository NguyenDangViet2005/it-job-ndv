import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import type { Request, Response } from 'express';
import { RESPONSE_MESSAGE_KEY } from '~/common/decorators/response-message.decorator.js';
import { SKIP_TRANSFORM_KEY } from '~/common/decorators/skip-transform.decorator.js';

export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface StandardResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  pagination?: PaginationMeta;
  requestId?: string;
  timestamp: string;
  path: string;
}

/**
 * Post-controller Interceptor: Chuẩn hóa mọi response đầu ra của ứng dụng về một cấu trúc thống nhất.
 *
 * Cấu trúc Response chuẩn:
 * {
 *   "success": true,
 *   "statusCode": 200,
 *   "message": "...",
 *   "data": ...,
 *   "pagination": { ... }, // nếu có phân trang
 *   "requestId": "...",
 *   "timestamp": "2026-...",
 *   "path": "/api/..."
 * }
 */
@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, StandardResponse<T> | T>
{
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<StandardResponse<T> | T> {
    const isSkipTransform = this.reflector.getAllAndOverride<boolean>(
      SKIP_TRANSFORM_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Bỏ qua chuẩn hóa nếu có decorator @SkipTransform()
    if (isSkipTransform) {
      return next.handle();
    }

    const httpContext = context.switchToHttp();
    const response = httpContext.getResponse<Response>();
    const request = httpContext.getRequest<Request>();
    const reqId = request.requestId || (request.headers['x-request-id'] as string);

    const customMessage = this.reflector.getAllAndOverride<string>(
      RESPONSE_MESSAGE_KEY,
      [context.getHandler(), context.getClass()],
    );

    return next.handle().pipe(
      map((result) => {
        // Nếu response header đã được gửi (ví dụ: OAuth res.redirect() hoặc stream download)
        if (response.headersSent) {
          return result;
        }

        const statusCode = response.statusCode || 200;
        let finalMessage = customMessage || 'Thao tác thành công';
        let finalData = result;
        let paginationMeta: PaginationMeta | undefined = undefined;

        // Xử lý thông minh nếu controller đã chủ động trả về wrapper { message, data } hoặc { success, message, data }
        if (result && typeof result === 'object' && !Array.isArray(result)) {
          if ('message' in result && typeof result.message === 'string') {
            finalMessage = customMessage || result.message;
          }

          if ('data' in result) {
            finalData = result.data;
            if ('totalItems' in result || 'totalPages' in result || 'page' in result || 'pageNumber' in result) {
              const pNum = result.page ?? result.pageNumber ?? 1;
              const pSize = result.pageSize ?? 10;
              const tItems = result.totalItems ?? (Array.isArray(result.data) ? result.data.length : 0);
              const tPages = result.totalPages ?? (tItems > 0 && pSize > 0 ? Math.ceil(tItems / pSize) : 1);
              paginationMeta = {
                page: pNum,
                pageSize: pSize,
                totalItems: tItems,
                totalPages: tPages,
              };
            }
          } else if ('success' in result && 'message' in result) {
            // Trường hợp controller trả về { success: true, message: '...' } không có data
            const { success, message, ...rest } = result;
            finalData = Object.keys(rest).length > 0 ? (rest as T) : null;
          }
        }

        return {
          success: true,
          statusCode,
          message: finalMessage,
          data: finalData ?? null,
          ...(paginationMeta ? { pagination: paginationMeta } : {}),
          ...(reqId ? { requestId: reqId } : {}),
          timestamp: new Date().toISOString(),
          path: request.originalUrl || request.url,
        };
      }),
    );
  }
}
