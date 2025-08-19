import { Module } from '@nestjs/common';
import { PublicationActionService } from './publication-action.service';
import { PublicationActionController } from './publication-action.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PublicationActionController],
  providers: [PublicationActionService],
})
export class PublicationActionNewModule {}