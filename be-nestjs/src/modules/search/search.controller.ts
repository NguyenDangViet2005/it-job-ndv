import { Controller, Get, Query } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { SearchService } from './search.service.js';
import { SearchQueryDto } from './dto/search-query.dto.js';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  async search(@Query() query: SearchQueryDto) {
    const data = await this.searchService.search(query);
    return {
      success: true,
      message: 'Tìm kiếm thành công',
      data,
    };
  }
}
