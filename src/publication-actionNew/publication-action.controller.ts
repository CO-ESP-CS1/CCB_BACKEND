import { Controller, Post, Body, UseGuards, BadRequestException } from '@nestjs/common';
import { PublicationActionService } from './publication-action.service';
import { CreatePublicationActionNewDto } from './dto/create-publication-action.dto';
import { AuthGuard } from '../auth/auth.guard';
import { UserPayload } from '../auth/user-payload.decorator';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('publication-actionsNew')
@ApiBearerAuth()
@Controller('publication-actionsNew')
export class PublicationActionController {
  constructor(private readonly actionService: PublicationActionService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBody({ type: CreatePublicationActionNewDto })
  @ApiResponse({ status: 201, description: 'Action créée avec succès' })
  @ApiResponse({ status: 400, description: 'Requête invalide' })
  @ApiResponse({ status: 403, description: 'Action non autorisée' })
  @ApiResponse({ status: 404, description: 'Publication introuvable' })
  @ApiResponse({ status: 409, description: 'Action non permise pour le statut actuel' })
  async createAction(
    @Body() dto: CreatePublicationActionNewDto,
    @UserPayload() user: any
  ) {
    try {
      if (!user || !user.idmembre) {
        throw new BadRequestException('Identifiant membre manquant');
      }

      return this.actionService.createPublicationAction(dto, user.idmembre);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}