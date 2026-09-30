import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service.js';
import { SearchQueryDto } from './dto/search-query.dto.js';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  async search(@Query() query: SearchQueryDto) {
    const data = await this.searchService.search(query);
    return {
      success: true,
      message: 'Tìm kiếm thành công',
      data,
    };
  }
}
