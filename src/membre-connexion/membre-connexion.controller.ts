import {
  Controller,
  Param,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
  HttpStatus,Get,
} from '@nestjs/common';
import { MembreConnexionService } from './membre-connexion.service';
import { UpdateStatusDto } from './dto/update-status.dto';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Gestion Membres & Connexions')
@Controller('membresConnexion')
export class MembreConnexionController {
  constructor(private readonly service: MembreConnexionService) {}

  @Post(':id/status')
  @ApiOperation({
    summary: 'Modifier le statut d\'un membre et de sa connexion',
    description: 'Permet de valider, refuser ou suspendre un membre et sa connexion associée'
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID du membre à modifier',
    example: 1
  })
  @ApiBody({ type: UpdateStatusDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Statut mis à jour avec succès',
    schema: {
      example: {
        message: 'Statut mis à jour',
        membre: { idmembre: 1, statutmembre: 'actif' },
        connexion: { connexionid: 1, statutconnexion: 'active' }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Membre ou connexion non trouvé'
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Données invalides'
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateStatus(
    @Param('id', ParseIntPipe) idmembre: number,
    @Body() dto: UpdateStatusDto
  ) {
    const [membre, connexion] = await this.service.updateStatus(idmembre, dto.action);
    
    return {
      message: 'Statut mis à jour',
      membre: { idmembre: membre.idmembre, statutmembre: membre.statutmembre },
      connexion: { 
        connexionid: connexion.connexionid, 
        statutconnexion: connexion.statutconnexion 
      }
    };
  }

  
  @Get('pending')
  @ApiOperation({
    summary: 'Vérifier s\'il reste des membres en attente de validation',
    description: 'Vérifie s\'il existe des membres inactifs avec des connexions en statut "en_attente"'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'État des validations en attente',
    schema: {
      example: {
        hasPending: true,
        message: 'Il reste des membres en attente de validation'
      }
    }
  })
  async checkPendingMembers() {
    const hasPending = await this.service.hasPendingMembers();
    
    return {
      hasPending,
      message: hasPending 
        ? 'Il reste des membres en attente de validation' 
        : 'Tous les membres ont été traités'
    };
  }
}