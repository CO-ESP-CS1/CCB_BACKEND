import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { RegenerationService } from './regeneration.service';
import { RegenerateRecoveryCodeDto } from './dto/regenerate-recovery-code.dto';

@ApiTags('regeneration')
@Controller('regeneration')
export class RegenerationController {
  constructor(private readonly regenerationService: RegenerationService) {}

  @Post('recovery-code')
  @ApiOperation({ summary: 'Régénérer un code de récupération' })
  @ApiResponse({ status: 201, description: 'Code de récupération régénéré avec succès.' })
  @ApiBadRequestResponse({ description: 'Données invalides ou manquantes' })
  async regenerate(@Body() dto: RegenerateRecoveryCodeDto) {
    if (!dto.telephone || !dto.mot_de_passe || !dto.deviceid) {
      throw new BadRequestException('Téléphone, mot de passe et deviceid sont obligatoires');
    }

    return this.regenerationService.regenerateRecoveryCode(
      dto.telephone,
      dto.mot_de_passe,
      dto.deviceid,
    );
  }
}
