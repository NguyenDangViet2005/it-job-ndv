import { Module } from '@nestjs/common';
import { ConnectionController } from './connection.controller.js';
import { ConnectionService } from './connection.service.js';

@Module({
  controllers: [ConnectionController],
  providers: [ConnectionService],
  exports: [ConnectionService],
})
export class ConnectionModule {}
