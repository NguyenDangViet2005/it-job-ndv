import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '~/common/guards/jwt-auth.guard.js';
import {
  CurrentUser,
  type UserPayload,
} from '~/common/decorators/current-user.decorator.js';
import { ConnectionService } from './connection.service.js';
import { SendConnectionDto } from './dto/send-connection.dto.js';

@Controller('connection')
export class ConnectionController {
  constructor(private readonly connectionService: ConnectionService) {}

  @Get('user/:userid')
  async getUserConnections(
    @Param('userid', ParseIntPipe) userId: number,
    @Query('pageNumber') pageNumber?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.connectionService.getUserConnections(
      userId,
      pageNumber ? parseInt(pageNumber, 10) : 1,
      pageSize ? parseInt(pageSize, 10) : 10,
    );
  }

  @Get('pending')
  @UseGuards(JwtAuthGuard)
  async getPendingRequests(
    @CurrentUser() user: UserPayload,
    @Query('pageNumber') pageNumber?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.connectionService.getPendingRequests(
      user.id,
      pageNumber ? parseInt(pageNumber, 10) : 1,
      pageSize ? parseInt(pageSize, 10) : 10,
    );
  }

  @Get('sent')
  @UseGuards(JwtAuthGuard)
  async getSentRequests(
    @CurrentUser() user: UserPayload,
    @Query('pageNumber') pageNumber?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.connectionService.getSentRequests(
      user.id,
      pageNumber ? parseInt(pageNumber, 10) : 1,
      pageSize ? parseInt(pageSize, 10) : 10,
    );
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async sendConnectionRequest(
    @CurrentUser() user: UserPayload,
    @Body() dto: SendConnectionDto,
  ) {
    const effectiveUserId = dto.userid || user.id;
    return this.connectionService.sendConnectionRequest(
      effectiveUserId,
      dto.connecteduserid,
    );
  }

  @Put(':connectionId/accept')
  @UseGuards(JwtAuthGuard)
  async acceptConnectionRequest(
    @Param('connectionId', ParseIntPipe) connectionId: number,
    @CurrentUser() user: UserPayload,
  ) {
    return this.connectionService.acceptConnectionRequest(
      connectionId,
      user.id,
    );
  }

  @Put(':connectionId/reject')
  @UseGuards(JwtAuthGuard)
  async rejectConnectionRequest(
    @Param('connectionId', ParseIntPipe) connectionId: number,
    @CurrentUser() user: UserPayload,
  ) {
    return this.connectionService.rejectConnectionRequest(
      connectionId,
      user.id,
    );
  }

  @Delete(':connectionId')
  @UseGuards(JwtAuthGuard)
  async removeConnection(
    @Param('connectionId', ParseIntPipe) connectionId: number,
    @CurrentUser() user: UserPayload,
  ) {
    return this.connectionService.removeConnection(connectionId, user.id);
  }
}
