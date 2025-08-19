import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { MembreService } from './membre.service';
import { AuthGuard } from '../auth/auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { MembreDto } from './dto/membre.dto';

@ApiTags('MembresPersonne')
@UseGuards(AuthGuard)
@Controller('membresPersonne')
export class MembreController {
  constructor(private readonly membreService: MembreService) {}

  @Get()
  @ApiOperation({ summary: 'Lister les membres actifs avec infos personnelles (pagination)' })
  @ApiResponse({ status: 200, type: [MembreDto] })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Nombre de résultats (défaut: 10)' })
  @ApiQuery({ name: 'offset', required: false, type: Number, description: 'Décalage pour la pagination (défaut: 0)' })
  async getMembresActifs(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const take = limit ? parseInt(limit, 10) : 10;
    const skip = offset ? parseInt(offset, 10) : 0;

    return this.membreService.getMembresActifs(take, skip);
  }


   @Get('search')
  @ApiOperation({ summary: 'Rechercher membres actifs par nom ou téléphone' })
  @ApiResponse({ status: 200, type: [MembreDto] })
  @ApiQuery({ name: 'nom', required: false, type: String, description: 'Nom ou prénom partiel' })
  @ApiQuery({ name: 'telephone', required: false, type: String, description: 'Numéro de téléphone partiel' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Nombre de résultats (défaut: 10)' })
  @ApiQuery({ name: 'offset', required: false, type: Number, description: 'Décalage pour la pagination (défaut: 0)' })
  async searchMembres(
    @Query('nom') nom?: string,
    @Query('telephone') telephone?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const take = limit ? parseInt(limit, 10) : 10;
    const skip = offset ? parseInt(offset, 10) : 0;

    return this.membreService.searchMembresActifs({ nom, telephone, take, skip });
  }


    @Get('by-assemblee')
  @ApiOperation({ summary: 'Filtrer membres actifs par nom d\'assemblée' })
  @ApiResponse({ status: 200, type: [MembreDto] })
  @ApiQuery({ name: 'nomAssemblee', required: true, type: String, description: 'Nom partiel de l\'assemblée' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Nombre de résultats (défaut: 10)' })
  @ApiQuery({ name: 'offset', required: false, type: Number, description: 'Décalage pour la pagination (défaut: 0)' })
  async getMembresByAssemblee(
    @Query('nomAssemblee') nomAssemblee: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const take = limit ? parseInt(limit, 10) : 10;
    const skip = offset ? parseInt(offset, 10) : 0;

    return this.membreService.getMembresByAssemblee(nomAssemblee, take, skip);
  }
}
