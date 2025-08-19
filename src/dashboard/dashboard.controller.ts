import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { AuthGuard } from '../auth/auth.guard';
import { TokenPayload } from '../auth/token-payload.decorator';
import { Public } from '../auth/public.decorator';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

@ApiTags('Dashboard')
@Controller('dashboard')
@UseGuards(AuthGuard)
export class DashboardController {
  constructor(private readonly service: DashboardService) {}

  @Public()
  @Get('stories')
  @ApiOperation({ summary: 'Récupère les stories récentes (24h)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10, description: 'Nombre max de stories à retourner' })
  @ApiQuery({ name: 'offset', required: false, type: Number, example: 0, description: 'Décalage pour la pagination' })
  @ApiResponse({ status: 200, description: 'Liste des stories récentes' })
  async getStories(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.service.getStories(
      limit ? parseInt(limit, 10) : 10,
      offset ? parseInt(offset, 10) : 0,
    );
  }

  @Public()
  @Get('posts')
  @ApiOperation({ summary: 'Récupère les posts' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10, description: 'Nombre max de posts à retourner' })
  @ApiQuery({ name: 'offset', required: false, type: Number, example: 0, description: 'Décalage pour la pagination' })
  @ApiResponse({ status: 200, description: 'Liste des posts' })
  async getPosts(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.service.getPosts(
      limit ? parseInt(limit, 10) : 10,
      offset ? parseInt(offset, 10) : 0,
    );
  }

  @Get('annonces-non-lues-exist')
  @ApiOperation({
    summary: 'Vérifie si l’utilisateur a des annonces non lues',
    description:
      'Retourne `true` si au moins une annonce publiée et non lue cible le rôle ou le département de l’utilisateur dans son assemblée.',
  })
  @ApiResponse({
    status: 200,
    description: 'Indique si des annonces non lues existent pour cet utilisateur',
    schema: {
      example: {
        hasUnreadAnnouncement: true,
        role: 'MEMBRE',
      },
    },
  })
  async hasAnnoncesNonLues(
    @TokenPayload() userPayload: any,
  ) {
    return {
      hasUnreadAnnouncement: await this.service.hasUnreadTargetedAnnouncement(
        userPayload.idmembre,
        userPayload.idassemblee,
      ),
      role: userPayload.role,
    };
  }

  @Public()
  @Get('live-en-cours')
  @ApiOperation({ summary: 'Vérifie si un live est en cours' })
  @ApiResponse({
    status: 200,
    description: 'Indique si un live est actuellement en cours',
    schema: { example: { hasLiveEnCours: true } },
  })
  async hasLiveEnCours() {
    return { hasLiveEnCours: await this.service.hasLiveEnCours() };
  }
}
