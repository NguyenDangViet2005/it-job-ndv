import { Injectable } from '@nestjs/common';
import { orm } from '~/prisma/db.js';

@Injectable()
export class AppService {
  getRoot() {
    return {
      status: 'ok',
      message: 'IT-JOB API is operational',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
    };
  }

  async getHealth() {
    let databaseStatus = 'connected';
    try {
      await orm.User.select('id').first();
    } catch (error: any) {
      databaseStatus = 'error';
    }

    const isHealthy = databaseStatus === 'connected';

    return {
      status: isHealthy ? 'healthy' : 'unhealthy',
      uptime: `${Math.floor(process.uptime())}s`,
      timestamp: new Date().toISOString(),
      services: {
        database: databaseStatus,
      },
    };
  }
}
