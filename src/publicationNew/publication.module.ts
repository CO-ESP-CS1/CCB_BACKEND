// src/publication/publication.module.ts (ou publicationNew.module.ts)
import { Module } from '@nestjs/common';
import { PublicationService } from './publication.service';
import { PublicationController } from './publication.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { CloudinaryModule } from '../cloudinary/cloudinary.module'; // <-- importer ici
import { StoryService } from './story.service';
import { StoryController } from './story.controller';
import { VideoPublicationController } from './video-publication.controller';
import { VideoPublicationService } from './video-publication.service';
import { ShortPublicationService } from './short-publication.service';
import { ShortPublicationController } from './short-publication.controller';

@Module({
  imports: [CloudinaryModule],
  providers: [PublicationService, StoryService, VideoPublicationService, PrismaService, ShortPublicationService],
  controllers: [PublicationController, StoryController, VideoPublicationController, ShortPublicationController],
})
export class PublicationNewModule {}
