import { Module } from '@nestjs/common';
import { LocationController } from './location.controller.js';
import { LocationService } from './location.service.js';
import { LocationRepository } from './location.repository.js';

@Module({
  controllers: [LocationController],
  providers: [LocationService, LocationRepository],
  exports: [LocationService, LocationRepository],
})
export class LocationModule {}
