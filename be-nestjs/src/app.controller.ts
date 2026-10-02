import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getRoot() {
    return this.appService.getRoot();
  }

  @Get('health')
  async getHealth() {
    return await this.appService.getHealth();
  }
}
