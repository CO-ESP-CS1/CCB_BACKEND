import {
  Controller,
  Get,
  Query,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { BadgeService } from './badge.service';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { UserPayload } from '../auth/user-payload.decorator';

@ApiTags('Badges')
@ApiBearerAuth()
@Controller('badgesNew')
@UseGuards(AuthGuard)
export class BadgeController {
  constructor(private readonly service: BadgeService) {}

  @Get('has-badge')
  @ApiOperation({
    summary: 'Vérifier si le membre connecté possède un badge spécifique',
    description: 'Vérifie si le membre authentifié a un badge donné en fonction de son nom'
  })
  @ApiQuery({
    name: 'badgeName',
    type: String,
    description: 'Nom du badge à vérifier',
    example: 'publicationAutre',
    required: true
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Résultat de la vérification',
    schema: {
      example: {
        hasBadge: true,
        message: 'Vous possédez ce badge'
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Badge non trouvé'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Non authentifié'
  })
  async memberHasBadge(
    @UserPayload('idmembre') memberId: number,
    @Query('badgeName') badgeName: string
  ) {
    const hasBadge = await this.service.memberHasBadge(memberId, badgeName);
    
    return {
      hasBadge,
      message: hasBadge
        ? 'Vous possédez ce badge'
        : 'Vous ne possédez pas ce badge'
    };
  }
}