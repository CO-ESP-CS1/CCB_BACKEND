import {
  Controller,
  Post,
  Body,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Get,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { UserPayload } from '../auth/user-payload.decorator';
import { VideoPublicationService } from './video-publication.service';
import { CreateVideoPublicationDto } from './dto/create-video-publication.dto';
import { Public } from '../auth/public.decorator';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('video-publications')
@ApiBearerAuth()
@Controller('video-publications')
@UseGuards(AuthGuard)
export class VideoPublicationController {
  constructor(private readonly videoPublicationService: VideoPublicationService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une nouvelle publication vidéo' })
  @ApiResponse({ status: 201, description: 'Publication vidéo créée avec succès.' })
  @ApiResponse({ status: 400, description: 'Données invalides.' })
  @ApiResponse({ status: 401, description: 'Non autorisé.' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(
    @Body() dto: CreateVideoPublicationDto,
    @UserPayload('idmembre') idmembre: number,
  ) {
    return this.videoPublicationService.createVideoPublication(dto, idmembre);
  }

  @Public()
  @Get('videos')
  @ApiOperation({ summary: 'Récupérer les publications vidéo publiées avec pagination' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Nombre maximum de résultats à retourner' })
  @ApiQuery({ name: 'offset', required: false, type: Number, description: 'Nombre d’éléments à sauter avant de commencer à collecter les résultats' })
  @ApiResponse({ status: 200, description: 'Liste des publications vidéo récupérée avec succès.' })
  async getPublishedVideos(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const limitNum = limit ? parseInt(limit, 10) : 10;
    const offsetNum = offset ? parseInt(offset, 10) : 0;

    return this.videoPublicationService.getPublishedVideoPublications(limitNum, offsetNum);
  }
}
