import {
  Controller,
  Post,
  Body,
  UseGuards,
  BadRequestException, Get, Param, ParseIntPipe, Query, DefaultValuePipe
} from '@nestjs/common';
import { InteractionService } from './interaction.service';
import { CreateInteractionNewDto } from './dto/create-interaction.dto';
import { AuthGuard } from '../auth/auth.guard';
import { UserPayload } from '../auth/user-payload.decorator';
import { ResourceInteractionsDto } from './dto/resource-interactions.dto';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags, ApiParam, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiTags('interactionsNew')
@ApiBearerAuth()
@Controller('interactionsNew')
export class InteractionController {
  constructor(private readonly interactionService: InteractionService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBody({ type: CreateInteractionNewDto })
  @ApiResponse({ status: 201, description: 'Interaction créée avec succès' })
  @ApiResponse({ status: 400, description: 'Requête invalide' })
  @ApiResponse({ status: 403, description: 'Accès refusé' })
  async create(
    @Body() dto: CreateInteractionNewDto,
    @UserPayload() user: any,
  ) {
    try {
      // Validation du DTO
      dto.validateContent?.();
      
      // Vérifier la présence de l'ID membre
      if (!user || !user.idmembre) {
        throw new BadRequestException('Identifiant membre manquant');
      }

      return this.interactionService.createInteraction(dto, user.idmembre);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

@Get(':ressourceType/:ressourceId')
  @UseGuards(AuthGuard)
  @ApiParam({ name: 'ressourceType', enum: ['publication', 'live'], description: 'Type de ressource' })
  @ApiParam({ name: 'ressourceId', type: Number, description: 'ID de la ressource' })
  @ApiQuery({ name: 'type', required: false, enum: ['like', 'commentaire', 'signale', 'partage', 'all'], description: 'Type d\'interaction (par défaut: all)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Nombre d\'éléments par page (défaut: 10)' })
  @ApiQuery({ name: 'offset', required: false, type: Number, description: 'Position de départ (défaut: 0)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Liste des interactions avec détails des membres et informations de pagination',
    schema: {
      example: {
        data: [
          {
            id: 1,
            type: 'like',
            contenu: null,
            date_creation: '2023-08-15T12:30:45Z',
            membre: {
              id: 123,
              nom: 'Dupont',
              prenom: 'Jean',
              photo: 'https://example.com/photo.jpg',
              role: 'membre'
            }
          }
        ],
        pagination: {
          total: 100,
          limit: 10,
          offset: 0,
          hasMore: true
        }
      }
    }
  })
  async getResourceInteractions(
    @Param('ressourceType') ressourceType: string,
    @Param('ressourceId', ParseIntPipe) ressourceId: number,
    @Query('type') interactionType: string = 'all',
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number = 0
  ) {
    return this.interactionService.getResourceInteractions(
      ressourceType,
      ressourceId,
      interactionType,
      limit,
      offset
    );
  }
}