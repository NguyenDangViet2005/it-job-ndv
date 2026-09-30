import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Lỗi hệ thống nội bộ. Vui lòng thử lại sau.';
    let errorDetail: any = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res !== null) {
        const resObj = res as Record<string, any>;
        if (Array.isArray(resObj.message)) {
          message = resObj.message.join(', ');
        } else if (resObj.message) {
          message = resObj.message;
        }
        errorDetail = resObj.error || null;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      this.logger.error(
        `Unhandled Exception at ${request.url}: ${exception.message}`,
        exception.stack,
      );
    } else {
      this.logger.error(`Unknown Exception at ${request.url}:`, exception);
    }

    // Nếu response headers đã gửi (ví dụ redirect OAuth), không can thiệp tiếp
    if (response.headersSent) {
      return;
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      message,
      ...(errorDetail ? { error: errorDetail } : {}),
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
