import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service.js';
import { JwtAuthGuard } from '~/common/guards/jwt-auth.guard.js';
import { RolesGuard } from '~/common/guards/roles.guard.js';
import { Roles } from '~/common/decorators/roles.decorator.js';
import { CurrentUser, type UserPayload } from '~/common/decorators/current-user.decorator.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { ChangePasswordDto } from './dto/change-password.dto.js';
import { AddSkillDto } from './dto/add-skill.dto.js';
import { UserPaginationDto } from './dto/user-pagination.dto.js';

@Controller('user')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles('admin')
  async getAll(@Query() query: UserPaginationDto) {
    return this.userService.getAllUsers(query.pageNumber, query.pageSize);
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getUserById(id);
  }

  @Put(':id')
  async updateProfile(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: UserPayload,
    @Body() dto: UpdateUserDto,
  ) {
    const updated = await this.userService.updateUser(
      id,
      currentUser.id,
      currentUser.role,
      dto,
    );
    return {
      message: 'Cập nhật thông tin cá nhân thành công',
      data: updated,
    };
  }

  @Put(':id/avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  async updateAvatar(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: UserPayload,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Vui lòng chọn file ảnh đại diện');
    }
    const updated = await this.userService.updateAvatar(
      id,
      currentUser.id,
      currentUser.role,
      file,
    );
    return {
      message: 'Cập nhật ảnh đại diện thành công',
      data: updated,
    };
  }

  @Put(':id/cover-image')
  @UseInterceptors(FileInterceptor('coverimage'))
  async updateCover(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: UserPayload,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Vui lòng chọn file ảnh bìa');
    }
    const updated = await this.userService.updateCoverImage(
      id,
      currentUser.id,
      currentUser.role,
      file,
    );
    return {
      message: 'Cập nhật ảnh bìa thành công',
      data: updated,
    };
  }

  @Put(':id/cv')
  @UseInterceptors(FileInterceptor('cv'))
  async updateCV(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: UserPayload,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Vui lòng chọn file CV');
    }
    const updated = await this.userService.updateCV(
      id,
      currentUser.id,
      currentUser.role,
      file,
    );
    return {
      message: 'Cập nhật CV thành công',
      data: updated,
    };
  }

  @Post(':id/change-password')
  async changePassword(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') currentUserId: number,
    @Body() dto: ChangePasswordDto,
  ) {
    await this.userService.changePassword(id, currentUserId, dto);
    return {
      message: 'Đổi mật khẩu thành công',
    };
  }

  @Get(':id/skills')
  async getUserSkills(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getUserSkills(id);
  }

  @Post(':id/skills')
  async addUserSkill(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: UserPayload,
    @Body() dto: AddSkillDto,
  ) {
    const skill = await this.userService.addUserSkill(
      id,
      currentUser.id,
      currentUser.role,
      dto.skillid,
    );
    return {
      message: 'Thêm kỹ năng thành công',
      data: skill,
    };
  }

  @Delete(':id/skills/:skillid')
  async removeUserSkill(
    @Param('id', ParseIntPipe) id: number,
    @Param('skillid', ParseIntPipe) skillid: number,
    @CurrentUser() currentUser: UserPayload,
  ) {
    await this.userService.removeUserSkill(
      id,
      currentUser.id,
      currentUser.role,
      skillid,
    );
    return {
      message: 'Xóa kỹ năng thành công',
    };
  }

  @Get(':id/applications')
  async getUserApplications(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: UserPayload,
    @Query() query: UserPaginationDto,
  ) {
    if (currentUser.id !== id && currentUser.role !== 'admin') {
      throw new ForbiddenException('Bạn chỉ có quyền xem danh sách ứng tuyển của chính mình');
    }
    return this.userService.getUserApplications(
      id,
      query.pageNumber,
      query.pageSize,
    );
  }

  @Get(':id/posts')
  async getUserPosts(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: UserPaginationDto,
  ) {
    return this.userService.getUserPosts(
      id,
      query.pageNumber,
      query.pageSize,
    );
  }

  @Get(':id/media')
  async getUserMedia(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: UserPaginationDto,
  ) {
    return this.userService.getUserMedia(
      id,
      query.pageNumber,
      query.pageSize,
    );
  }

  @Delete(':id')
  @Roles('admin')
  async deleteUser(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('role') currentUserRole: string,
  ) {
    await this.userService.deleteUser(id, currentUserRole);
    return {
      message: 'Xóa người dùng thành công',
    };
  }
}
