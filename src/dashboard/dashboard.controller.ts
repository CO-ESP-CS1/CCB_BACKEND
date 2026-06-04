import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { AuthGuard } from '../auth/auth.guard';
import { TokenPayload } from '../auth/token-payload.decorator';
import { Public } from '../auth/public.decorator';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { UpdateHomeCarouselDto } from './dto/update-home-carousel.dto';
import { UpdateAdminNotificationsDto } from './dto/update-admin-notifications.dto';
import { UserPayload } from '../auth/user-payload.decorator';

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

  @Get('membre/:idmembre/publications')
  @ApiOperation({
    summary: 'Publications publiées d\'un membre',
    description:
      'Retourne les posts publiés et les stories encore actives (24h ou date d\'expiration non dépassée) d\'un membre.',
  })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 12 })
  @ApiQuery({ name: 'offset', required: false, type: Number, example: 0 })
  @ApiResponse({ status: 200, description: 'Liste des publications publiques du membre' })
  async getMemberPublications(
    @Param('idmembre', ParseIntPipe) idmembre: number,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.service.getMemberPublicPublications(
      idmembre,
      limit ? parseInt(limit, 10) : 20,
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
  @Get('home-carousel')
  @ApiOperation({
    summary: 'Slides du carrousel accueil',
    description:
      'Contenu dynamique (max 10 slides) lu depuis un fichier JSON côté serveur — sans table dédiée en base.',
  })
  @ApiResponse({ status: 200, description: 'Liste des slides actifs du carrousel' })
  async getHomeCarousel() {
    return this.service.getHomeCarousel();
  }

  @Put('home-carousel')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Enregistrer les slides du carrousel accueil',
    description: 'Réservé aux badges gestionnaire, adminBadge ou ManagerApp. Max 10 slides.',
  })
  async saveHomeCarousel(
    @UserPayload('idmembre') memberId: number,
    @Body() dto: UpdateHomeCarouselDto,
  ) {
    return this.service.saveHomeCarousel(memberId, dto);
  }

  @Post('home-carousel/upload-image')
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { image: { type: 'string', format: 'binary' } },
    },
  })
  @ApiOperation({ summary: 'Uploader une image pour le carrousel accueil' })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
      limits: { fileSize: 8 * 1024 * 1024 },
    }),
  )
  async uploadHomeCarouselImage(
    @UserPayload('idmembre') memberId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.service.uploadHomeCarouselImage(memberId, file);
  }

  @Public()
  @Get('admin-notifications')
  @ApiOperation({
    summary: 'Notifications communauté programmées',
    description:
      'Notifications créées par les gestionnaires (fichier JSON). Retourne uniquement les entrées actives à venir.',
  })
  @ApiResponse({ status: 200, description: 'Liste des notifications à programmer sur les appareils' })
  async getAdminNotifications() {
    return this.service.getAdminNotificationsForDevices();
  }

  @Get('admin-notifications/all')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Liste complète des notifications communauté (admin)',
    description: 'Inclut les notifications passées et inactives — pour l’écran de gestion.',
  })
  async getAdminNotificationsAll() {
    return this.service.getAdminNotifications();
  }

  @Put('admin-notifications')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Enregistrer les notifications communauté',
    description: 'Réservé aux badges gestionnaire, adminBadge ou ManagerApp. Max 30 entrées.',
  })
  async saveAdminNotifications(
    @UserPayload('idmembre') memberId: number,
    @Body() dto: UpdateAdminNotificationsDto,
  ) {
    return this.service.saveAdminNotifications(memberId, dto);
  }

  @Get('assembly-feed')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Fil d’activité de mon assemblée',
    description:
      'Publications, annonces non lues, séances à venir et lives programmés pour l’assemblée du membre.',
  })
  async getAssemblyFeed(@TokenPayload() userPayload: { idmembre: number; idassemblee: number }) {
    return this.service.getAssemblyFeed(
      userPayload.idmembre,
      userPayload.idassemblee,
    );
  }

  @Public()
  @Get('upcoming-lives')
  @ApiOperation({
    summary: 'Lives programmés à venir (14 jours)',
    description: 'Utilisé pour les rappels push 10 min avant le début.',
  })
  async getUpcomingLives(
    @Query('idassemblee') idassemblee?: string,
  ) {
    const id = idassemblee ? parseInt(idassemblee, 10) : undefined;
    return {
      lives: await this.service.getUpcomingLives(
        id && !Number.isNaN(id) ? id : undefined,
      ),
    };
  }

  @Get('engagement-insights')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Badges d’engagement calculés pour le membre connecté' })
  async getEngagementInsights(@TokenPayload() userPayload: { idmembre: number }) {
    return this.service.getEngagementInsights(userPayload.idmembre);
  }

  @Get('cell-groups')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Départements / cellules du membre' })
  async getCellGroups(@TokenPayload() userPayload: { idmembre: number }) {
    return { groups: await this.service.getMemberCellGroups(userPayload.idmembre) };
  }

  @Get('cell-groups/:iddepartement/feed')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Fil des publications d’un département' })
  async getCellGroupFeed(
    @Param('iddepartement', ParseIntPipe) iddepartement: number,
  ) {
    return {
      items: await this.service.getCellGroupFeed(iddepartement),
    };
  }

  @Get('week-seances')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Séances de la semaine pour mon assemblée' })
  async getWeekSeances(
    @TokenPayload() userPayload: { idmembre: number; idassemblee: number },
  ) {
    return {
      seances: await this.service.getWeekSeances(
        userPayload.idmembre,
        userPayload.idassemblee,
      ),
    };
  }

  @Post('seance-presence')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Confirmer « Je serai présent » à une séance' })
  async confirmSeancePresence(
    @TokenPayload() userPayload: { idmembre: number },
    @Body() body: { idseance: number },
  ) {
    return this.service.confirmSeancePresence(
      userPayload.idmembre,
      body.idseance,
    );
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
