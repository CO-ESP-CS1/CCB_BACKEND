import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  ParseIntPipe,
  Query,
  DefaultValuePipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserPortalService } from './user-portal.service';
import { TokenPayload } from '../auth/token-payload.decorator';
import { UpdateMePersonneDto } from './dto/update-me-personne.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@ApiTags('Espace membre')
@ApiBearerAuth()
@Controller('me')
export class MeController {
  constructor(private readonly service: UserPortalService) {}

  @Patch('personne')
  @ApiOperation({ summary: 'Modifier mes informations personnelles (nom, prénom, sexe, date de naissance)' })
  updateMyPersonne(
    @TokenPayload() user: Record<string, unknown>,
    @Body() dto: UpdateMePersonneDto,
  ) {
    return this.service.updateMyPersonne(user, dto);
  }

  @Patch('password')
  @ApiOperation({ summary: 'Changer mon mot de passe' })
  changeMyPassword(
    @TokenPayload() user: Record<string, unknown>,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.service.changeMyPassword(user, dto);
  }

  @Get('dashboard')
  @ApiOperation({ summary: 'Tableau de bord personnel du membre connecté' })
  getDashboard(@TokenPayload() user: Record<string, unknown>) {
    return this.service.getDashboard(user);
  }

  @Get('inscriptions')
  @ApiOperation({ summary: 'Mes inscriptions aux activités' })
  getInscriptions(
    @TokenPayload() user: Record<string, unknown>,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('statut') statut?: string,
  ) {
    return this.service.getMyInscriptions(user, page, limit, statut);
  }

  @Get('paiements')
  @ApiOperation({ summary: 'Mon historique de paiements' })
  getPaiements(
    @TokenPayload() user: Record<string, unknown>,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.service.getMyPaiements(user, page, limit);
  }

  @Get('cotisations')
  @ApiOperation({ summary: 'Cotisations de mon assemblée avec mon statut de paiement' })
  getCotisations(
    @TokenPayload() user: Record<string, unknown>,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.service.getMyCotisations(user, page, limit);
  }

  @Get('badges')
  @ApiOperation({ summary: 'Mes badges obtenus' })
  getBadges(
    @TokenPayload() user: Record<string, unknown>,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
  ) {
    return this.service.getMyBadges(user, limit, offset);
  }

  @Get('departements')
  @ApiOperation({ summary: 'Mes départements' })
  getDepartements(@TokenPayload() user: Record<string, unknown>) {
    return this.service.getMyDepartements(user);
  }

  @Get('account-overview')
  @ApiOperation({
    summary: 'Vue d\'ensemble du compte (contenu, engagement reçu, activité)',
  })
  getAccountOverview(@TokenPayload() user: Record<string, unknown>) {
    return this.service.getAccountOverview(user);
  }

  @Get('content-insights')
  @ApiOperation({ summary: 'Mes publications avec statistiques d\'engagement' })
  getContentInsights(
    @TokenPayload() user: Record<string, unknown>,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.service.getContentInsights(user, page, Math.min(limit, 50));
  }

  @Get('activity')
  @ApiOperation({
    summary: 'Fil d\'activité : qui a interagi avec mon contenu',
  })
  getActivityFeed(
    @TokenPayload() user: Record<string, unknown>,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('type') type?: string,
  ) {
    return this.service.getActivityFeed(user, page, Math.min(limit, 50), type);
  }

  @Get('content-insights/:idpublication/engagement')
  @ApiOperation({
    summary: 'Détail des interactions sur une de mes publications',
  })
  getPublicationEngagement(
    @TokenPayload() user: Record<string, unknown>,
    @Param('idpublication', ParseIntPipe) idpublication: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
    @Query('type') type?: string,
  ) {
    return this.service.getPublicationEngagement(
      user,
      idpublication,
      type,
      Math.min(limit, 50),
      offset,
    );
  }

  @Get('my-interactions')
  @ApiOperation({ summary: 'Interactions que j\'ai effectuées sur le contenu d\'autres' })
  getMyInteractions(
    @TokenPayload() user: Record<string, unknown>,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('type') type?: string,
  ) {
    return this.service.getMyInteractions(user, page, Math.min(limit, 50), type);
  }
}
