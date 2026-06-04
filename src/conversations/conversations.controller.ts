import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { UserPayload } from '../auth/user-payload.decorator';
import { ConversationsService } from './conversations.service';
import { SendMessageDto } from './dto/send-message.dto';
import { CreateGroupDto } from './dto/create-group.dto';
import { MarkReadDto } from './dto/mark-read.dto';
import { AddGroupMembersDto } from './dto/add-group-members.dto';

@ApiTags('conversations')
@ApiBearerAuth()
@Controller('conversations')
@UseGuards(AuthGuard)
export class ConversationsController {
  constructor(private readonly service: ConversationsService) {}

  @Get()
  listThreads(@UserPayload('idmembre') idmembre: number) {
    return this.service.listThreads(Number(idmembre));
  }

  @Get('contacts')
  listContacts(
    @UserPayload('idmembre') idmembre: number,
    @Query('q') search?: string,
  ) {
    return this.service.listContacts(Number(idmembre), search);
  }

  @Get('groups/list')
  listGroups(@UserPayload('idmembre') idmembre: number) {
    return this.service.listGroups(Number(idmembre));
  }

  @Post('groups')
  createGroup(
    @UserPayload('idmembre') idmembre: number,
    @Body() dto: CreateGroupDto,
  ) {
    return this.service.createGroup(
      Number(idmembre),
      dto.name,
      dto.memberIds,
    );
  }

  @Get('groups/:groupId/info')
  getGroupInfo(
    @UserPayload('idmembre') idmembre: number,
    @Param('groupId', ParseIntPipe) groupId: number,
  ) {
    return this.service.getGroupInfo(Number(idmembre), groupId);
  }

  @Patch('messages/:messageId')
  editMessage(
    @UserPayload('idmembre') idmembre: number,
    @Param('messageId', ParseIntPipe) messageId: number,
    @Body() dto: SendMessageDto,
  ) {
    return this.service.editMessage(
      Number(idmembre),
      messageId,
      dto.contenu,
    );
  }

  @Delete('messages/:messageId')
  deleteMessage(
    @UserPayload('idmembre') idmembre: number,
    @Param('messageId', ParseIntPipe) messageId: number,
  ) {
    return this.service.deleteMessage(Number(idmembre), messageId);
  }

  @Post('groups/:groupId/members')
  addGroupMembers(
    @UserPayload('idmembre') idmembre: number,
    @Param('groupId', ParseIntPipe) groupId: number,
    @Body() dto: AddGroupMembersDto,
  ) {
    return this.service.addGroupMembers(
      Number(idmembre),
      groupId,
      dto.memberIds,
    );
  }

  @Post('groups/:groupId/leave')
  leaveGroup(
    @UserPayload('idmembre') idmembre: number,
    @Param('groupId', ParseIntPipe) groupId: number,
  ) {
    return this.service.leaveGroup(Number(idmembre), groupId);
  }

  @Delete('groups/:groupId')
  deleteGroup(
    @UserPayload('idmembre') idmembre: number,
    @Param('groupId', ParseIntPipe) groupId: number,
  ) {
    return this.service.deleteGroup(Number(idmembre), groupId);
  }

  @Post('groups/:groupId/photo')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
      limits: { fileSize: 8 * 1024 * 1024 },
    }),
  )
  uploadGroupPhoto(
    @UserPayload('idmembre') idmembre: number,
    @Param('groupId', ParseIntPipe) groupId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.service.uploadGroupPhoto(Number(idmembre), groupId, file);
  }

  @Delete('direct/:partnerId')
  hideDirectConversation(
    @UserPayload('idmembre') idmembre: number,
    @Param('partnerId', ParseIntPipe) partnerId: number,
  ) {
    return this.service.hideDirectConversation(Number(idmembre), partnerId);
  }

  @Get('groups/:groupId/messages')
  getGroupMessages(
    @UserPayload('idmembre') idmembre: number,
    @Param('groupId', ParseIntPipe) groupId: number,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
  ) {
    return this.service.getGroupMessages(
      Number(idmembre),
      groupId,
      limit,
      offset,
    );
  }

  @Post('groups/:groupId/messages/image')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
      limits: { fileSize: 8 * 1024 * 1024 },
    }),
  )
  sendGroupImageMessage(
    @UserPayload('idmembre') idmembre: number,
    @Param('groupId', ParseIntPipe) groupId: number,
    @UploadedFile() file: Express.Multer.File,
    @Body('caption') caption?: string,
  ) {
    return this.service.sendGroupImageMessage(
      Number(idmembre),
      groupId,
      file,
      caption,
    );
  }

  @Post('groups/:groupId/messages')
  sendGroupMessage(
    @UserPayload('idmembre') idmembre: number,
    @Param('groupId', ParseIntPipe) groupId: number,
    @Body() dto: SendMessageDto,
  ) {
    return this.service.sendGroupMessage(
      Number(idmembre),
      groupId,
      dto.contenu,
    );
  }

  @Post(':partnerId/messages/image')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
      limits: { fileSize: 8 * 1024 * 1024 },
    }),
  )
  sendDirectImageMessage(
    @UserPayload('idmembre') idmembre: number,
    @Param('partnerId', ParseIntPipe) partnerId: number,
    @UploadedFile() file: Express.Multer.File,
    @Body('caption') caption?: string,
  ) {
    return this.service.sendDirectImageMessage(
      Number(idmembre),
      partnerId,
      file,
      caption,
    );
  }

  @Get(':partnerId/messages')
  getMessages(
    @UserPayload('idmembre') idmembre: number,
    @Param('partnerId', ParseIntPipe) partnerId: number,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
  ) {
    return this.service.getMessages(
      Number(idmembre),
      partnerId,
      limit,
      offset,
    );
  }

  @Post(':partnerId/read')
  markRead(
    @UserPayload('idmembre') idmembre: number,
    @Param('partnerId', ParseIntPipe) partnerId: number,
    @Body() dto: MarkReadDto,
  ) {
    return this.service.markRead(
      Number(idmembre),
      partnerId,
      dto.lastMessageId,
    );
  }

  @Post(':partnerId/messages')
  sendMessage(
    @UserPayload('idmembre') idmembre: number,
    @Param('partnerId', ParseIntPipe) partnerId: number,
    @Body() dto: SendMessageDto,
  ) {
    return this.service.sendMessage(
      Number(idmembre),
      partnerId,
      dto.contenu,
    );
  }
}
