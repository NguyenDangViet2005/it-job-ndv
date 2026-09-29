import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CompanyService } from './company.service.js';
import { CreateCompanyDto } from './dto/create-company.dto.js';
import { UpdateCompanyDto } from './dto/update-company.dto.js';
import { CompanyQueryDto } from './dto/company-query.dto.js';
import { JwtAuthGuard } from '~/common/guards/jwt-auth.guard.js';
import { RolesGuard } from '~/common/guards/roles.guard.js';
import { Roles } from '~/common/decorators/roles.decorator.js';
import { CurrentUser } from '~/common/decorators/current-user.decorator.js';
import type { UserPayload } from '~/common/decorators/current-user.decorator.js';

@Controller(['company'])
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get()
  async getCompanies(@Query() query: CompanyQueryDto) {
    return this.companyService.getCompanies(query);
  }

  @Get('logos')
  async getCompanyLogos(@Query() query: CompanyQueryDto) {
    return this.companyService.getCompanyLogos(query);
  }

  @Get('my-company')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('employer', 'admin')
  async getMyCompany(@CurrentUser() currentUser: UserPayload) {
    return this.companyService.getCompanyByUserId(currentUser.id);
  }

  @Put('my-company')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('employer', 'admin')
  async updateMyCompany(
    @CurrentUser() currentUser: UserPayload,
    @Body() dto: UpdateCompanyDto,
  ) {
    const company = await this.companyService.getCompanyByUserId(currentUser.id);
    const updated = await this.companyService.updateCompany(company.id, currentUser, dto);
    return {
      data: updated,
      message: 'Cập nhật thông tin công ty thành công',
    };
  }

  @Post('upload-avatar')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('employer', 'admin')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @CurrentUser() currentUser: UserPayload,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Vui lòng chọn file ảnh');
    }
    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException('Chỉ chấp nhận file định dạng hình ảnh');
    }
    if (file.size > 5 * 1024 * 1024) {
      throw new BadRequestException('Kích thước ảnh không được vượt quá 5MB');
    }

    const company = await this.companyService.getCompanyByUserId(currentUser.id);
    const avatarUrl = await this.companyService.uploadCompanyAvatar(company.id, file);

    return {
      avatarUrl,
      message: 'Upload ảnh đại diện thành công',
    };
  }

  @Post('upload-cover')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('employer', 'admin')
  @UseInterceptors(FileInterceptor('file'))
  async uploadCover(
    @CurrentUser() currentUser: UserPayload,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Vui lòng chọn file ảnh');
    }
    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException('Chỉ chấp nhận file định dạng hình ảnh');
    }
    if (file.size > 5 * 1024 * 1024) {
      throw new BadRequestException('Kích thước ảnh không được vượt quá 5MB');
    }

    const company = await this.companyService.getCompanyByUserId(currentUser.id);
    const coverimageUrl = await this.companyService.uploadCompanyCover(company.id, file);

    return {
      coverimageUrl,
      message: 'Upload ảnh bìa thành công',
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('employer', 'admin')
  async createCompany(
    @CurrentUser() currentUser: UserPayload,
    @Body() dto: CreateCompanyDto,
  ) {
    return this.companyService.createCompany(currentUser.id, dto);
  }

  @Get(':id')
  async getCompanyById(@Param('id', ParseIntPipe) id: number) {
    return this.companyService.getCompanyById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('employer', 'admin')
  async updateCompany(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: UserPayload,
    @Body() dto: UpdateCompanyDto,
  ) {
    return this.companyService.updateCompany(id, currentUser, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('employer', 'admin')
  async deleteCompany(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: UserPayload,
  ) {
    return this.companyService.deleteCompany(id, currentUser);
  }
}
