import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { db, orm } from './db.js';

/**
 * Service quản lý kết nối cơ sở dữ liệu và vòng đời Database trong NestJS IoC Container.
 */
@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  readonly db = db;
  readonly orm = orm;

  async onModuleInit(): Promise<void> {
    try {
      if (typeof (this.db as any).connect === 'function') {
        await (this.db as any).connect();
      }
      this.logger.log('✅ Kết nối Cơ sở dữ liệu thành công');
    } catch (error: any) {
      this.logger.error('❌ Kết nối Cơ sở dữ liệu thất bại', error?.message || error);
    }
  }

  async onModuleDestroy(): Promise<void> {
    try {
      if (typeof (this.db as any).close === 'function') {
        await (this.db as any).close();
      }
      this.logger.log('🛑 Đã đóng kết nối Cơ sở dữ liệu an toàn');
    } catch (error: any) {
      this.logger.error('❌ Lỗi khi đóng kết nối Cơ sở dữ liệu', error?.message || error);
    }
  }
}
