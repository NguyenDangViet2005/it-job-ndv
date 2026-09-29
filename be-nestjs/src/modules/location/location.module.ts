import { Module } from '@nestjs/common';
import { LocationController } from './location.controller.js';
import { LocationService } from './location.service.js';

@Module({
  controllers: [LocationController],
  providers: [LocationService],
  exports: [LocationService],
})
export class LocationModule {}
