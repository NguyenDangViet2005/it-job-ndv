import {
  Controller,
  Get,
  Query,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { LocationService } from './location.service.js';
import { GetWardsDto } from './dto/get-wards.dto.js';

@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get('provinces')
  async getProvinces() {
    const provinces = await this.locationService.getAllProvinces();
    return {
      success: true,
      message: 'Lấy danh sách tỉnh/thành phố thành công',
      data: provinces,
    };
  }

  @Get('wards')
  async getWards(@Query() query: GetWardsDto) {
    const wards = await this.locationService.getWardsByProvinceId(query.provinceid);
    return {
      success: true,
      message: 'Lấy danh sách quận/huyện thành công',
      data: wards,
    };
  }

  @Get('provinces/:id/wards')
  async getWardsByProvince(@Param('id', ParseIntPipe) provinceId: number) {
    const wards = await this.locationService.getWardsByProvinceId(provinceId);
    return {
      success: true,
      message: 'Lấy danh sách quận/huyện thành công',
      data: wards,
    };
  }
}
