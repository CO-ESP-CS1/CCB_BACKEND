import {
  Controller,
  Post,
  Body,
  UseGuards,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Query,
  DefaultValuePipe,
} from '@nestjs/common';
import { ParticipationService } from './participation.service';
import { CreateParticipationDto } from './dto/create-participation.dto';
import { AuthGuard } from '../auth/auth.guard';
import { UserPayload } from '../auth/user-payload.decorator';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';

@ApiTags('participations')
@ApiBearerAuth()
@Controller('participations')
export class ParticipationController {
  constructor(private readonly participationService: ParticipationService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBody({ type: CreateParticipationDto })
  @ApiResponse({ status: 201, description: 'Participation notée avec succès' })
  @ApiResponse({ status: 400, description: 'Requête invalide' })
  @ApiResponse({ status: 403, description: 'Accès refusé' })
  @ApiResponse({ status: 404, description: 'Ressource introuvable' })
  async createParticipation(
    @Body() dto: CreateParticipationDto,
    @UserPayload() user: any
  ) {
    if (!user || !user.idmembre) {
      throw new ForbiddenException('Identifiant membre manquant');
    }

    return this.participationService.recordParticipation(dto, user.idmembre);
  }

  /**
   * Récupère les participations pour une séance donnée (avec pagination).
   * Exemple: GET /participations/seance/5?limit=20&offset=40
   */
  @Get('seance/:idseance')
  @UseGuards(AuthGuard)
  @ApiQuery({ name: 'limit', required: false, example: 10, description: 'Nombre d\'éléments à récupérer (take)' })
  @ApiQuery({ name: 'offset', required: false, example: 0, description: 'Nombre d\'éléments à sauter (skip)' })
  @ApiResponse({ status: 200, description: 'Liste paginée des participations' })
  async getBySeance(
    @Param('idseance', ParseIntPipe) idseance: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
  ) {
    // récupérer les items paginés
    const items = await this.participationService.getParticipationsBySeance(idseance, limit, offset);

    // récupérer le total (pour le front savoir combien de pages)
    const total = await this.participationService.countParticipationsBySeance(idseance);

    return {
      meta: {
        total,
        limit,
        offset
      },
      data: items
    };
  }
}
