import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PublicationService } from './publication.service';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';
import { statut_publication_enum, type_publication_enum } from '@prisma/client';
import { UserPayload } from '../auth/user-payload.decorator';
import { AuthGuard } from '../auth/auth.guard';
import { ForbiddenException } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiProperty,
} from '@nestjs/swagger';
import { Type } from 'class-transformer';

// Entité Publication pour la documentation Swagger
class PublicationEntity {
  @ApiProperty({ description: 'ID unique de la publication' })
  idpublication: number;

  @ApiProperty({ required: false, description: 'Titre de la publication' })
  titre?: string;

  @ApiProperty({ required: false, description: 'Description de la publication' })
  description?: string;

  @ApiProperty({ required: false, description: 'URL du média principal' })
  mediaurl?: string;

  @ApiProperty({ required: false, description: 'URL du second média' })
  mediaurl2?: string;

  @ApiProperty({ required: false, description: 'URL du troisième média' })
  mediaurl3?: string;

  @ApiProperty({ 
    required: false, 
    description: 'Date d\'expiration de la publication',
    example: '2023-12-31T23:59:59.999Z'
  })
  expirationdate?: Date;

  @ApiProperty({ 
    enum: Object.values(statut_publication_enum),
    description: 'Statut de la publication'
  })
  statutpublication: statut_publication_enum;

  @ApiProperty({ 
    enum: Object.values(type_publication_enum),
    description: 'Type de publication'
  })
  typepublication: type_publication_enum;

  @ApiProperty({ description: 'Date de création' })
  @Type(() => Date)
  createat: Date;

  @ApiProperty({ description: 'Date de mise à jour' })
  @Type(() => Date)
  updateat: Date;

  @ApiProperty({ description: 'ID du membre propriétaire' })
  idmembre: number;
}

// Entité pour la réponse de création
class CreatedPublicationResponse extends PublicationEntity {
  @ApiProperty({ description: 'Message de confirmation' })
  message: string;
}

@ApiTags('Publications')
@ApiBearerAuth()
@Controller('publication')
export class PublicationController {
  constructor(private readonly service: PublicationService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une nouvelle publication' })
  @ApiCreatedResponse({ 
    description: 'Publication créée avec succès',
    type: CreatedPublicationResponse 
  })
  @ApiBody({ 
    type: CreatePublicationDto,
    description: 'Données nécessaires pour créer une publication' 
  })
  create(@Body() dto: CreatePublicationDto) {
    return this.service.create(dto);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Récupérer les publications pour l\'utilisateur connecté',
    description: 'Permet de récupérer les publications avec filtres et pagination. Les utilisateurs avec le badge "publicationAutre" peuvent voir les publications d\'autres membres.'
  })
  @ApiOkResponse({
    description: 'Liste des publications récupérée avec succès',
    type: [PublicationEntity],
  })
  @ApiQuery({
    name: 'statut',
    required: false,
    enum: Object.values(statut_publication_enum),
    description: 'Filtrer par statut de publication',
    example: statut_publication_enum.publie
  })
  @ApiQuery({
    name: 'type',
    required: false,
    enum: Object.values(type_publication_enum),
    description: 'Filtrer par type de publication',
    example: type_publication_enum.POST
  })
  @ApiQuery({
    name: 'idmembre',
    required: false,
    type: Number,
    description: 'ID du membre pour voir ses publications (nécessite le badge publicationAutre)',
    example: 123
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Limite de résultats pour la pagination (défaut: 20)',
    example: 10
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    type: Number,
    description: 'Offset pour la pagination (défaut: 0)',
    example: 0
  })
  async findForUser(
    @UserPayload() user: any,
    @Query('statut') statut?: statut_publication_enum,
    @Query('type') type?: type_publication_enum,
    @Query('idmembre') idmembre?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('offset', new ParseIntPipe({ optional: true })) offset?: number,
  ) {
    const hasPublicationAutreBadge = await this.service.checkPublicationAutreBadge(user.idmembre);
    const targetId = (hasPublicationAutreBadge && idmembre) ? idmembre : user.idmembre;

    return this.service.findForUser({
      targetId,
      statut,
      type,
      hasPublicationAutreBadge,
      limit,
      offset
    });
  }


    @ApiOperation({ 
  summary: 'Vérifier s\'il y a des publications en attente',
  description: 'Renvoie true s\'il existe des publications avec le statut "en_attente", sinon false'
})
@ApiOkResponse({
  description: 'État des publications en attente',
  schema: {
    type: 'object',
    properties: {
      hasPending: {
        type: 'boolean',
        description: 'Indique s\'il y a des publications en attente',
        example: true
      }
    }
  }
})
@Get('check-pending')
async checkPendingPublications() {
  const hasPending = await this.service.hasPendingPublications();
  return { hasPending };
}


  @Get()
  @ApiOperation({ 
    summary: 'Récupérer toutes les publications',
    description: 'Attention: Peut retourner beaucoup de données. Utiliser la pagination.' 
  })
  @ApiOkResponse({
    description: 'Liste de toutes les publications',
    type: [PublicationEntity],
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Limite de résultats pour la pagination (défaut: 20)',
    example: 10
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    type: Number,
    description: 'Offset pour la pagination (défaut: 0)',
    example: 0
  })
  findAll(
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('offset', new ParseIntPipe({ optional: true })) offset?: number,
  ) {
    return this.service.findAll(limit, offset);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une publication par son ID' })
  @ApiOkResponse({
    description: 'Publication trouvée',
    type: PublicationEntity,
  })
  @ApiNotFoundResponse({ description: 'Publication non trouvée' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID de la publication',
    example: 1,
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour une publication' })
  @ApiOkResponse({
    description: 'Publication mise à jour avec succès',
    type: PublicationEntity,
  })
  @ApiNotFoundResponse({ description: 'Publication non trouvée' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID de la publication à mettre à jour',
    example: 1,
  })
  @ApiBody({ 
    type: UpdatePublicationDto,
    description: 'Données à mettre à jour' 
  })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePublicationDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Supprimer une publication',
    description: 'Seul le propriétaire ou un utilisateur avec le badge "supprimerPubAutre" peut supprimer. Supprime également toutes les interactions associées.'
  })
  @ApiOkResponse({
    description: 'Publication supprimée avec succès',
    schema: {
      example: {
        message: 'Publication supprimée',
        id: 123
      }
    }
  })
  @ApiForbiddenResponse({ 
    description: 'Pas les permissions nécessaires pour supprimer' 
  })
  @ApiNotFoundResponse({ description: 'Publication non trouvée' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID de la publication à supprimer',
    example: 1,
  })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @UserPayload('idmembre') userId: number,
  ) {
    const hasSupprimerBadge = await this.service.checkSupprimerPubAutreBadge(userId);
    return this.service.remove(id, userId, hasSupprimerBadge);
  }

  


}