import { Module } from '@nestjs/common';
import { ConversationsController } from './conversations.controller';
import { ConversationsService } from './conversations.service';
import { PrismaService } from '../../prisma/prisma.service';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [CloudinaryModule],
  controllers: [ConversationsController],
  providers: [ConversationsService, PrismaService],
})
export class ConversationsModule {}
