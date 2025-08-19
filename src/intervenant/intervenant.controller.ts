import { Controller, Get, Post, Body, Patch, Param, Delete, Query, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { IntervenantService } from './intervenant.service';
import { CreateIntervenantDto } from './dto/create-intervenant.dto';
import { UpdateIntervenantDto } from './dto/update-intervenant.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { IntervenantResponseDto } from './dto/intervenant-response.dto';

@ApiTags('intervenants')
@Controller('intervenants')
export class IntervenantController {
  constructor(private readonly intervenantService: IntervenantService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un intervenant' })
  @ApiResponse({ status: 201, type: IntervenantResponseDto })
  create(@Body() dto: CreateIntervenantDto) {
    return this.intervenantService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lister les intervenants avec pagination et recherche' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10, description: 'Nombre maximum de résultats à renvoyer' })
  @ApiQuery({ name: 'offset', required: false, type: Number, example: 0, description: 'Nombre de résultats à ignorer' })
  @ApiQuery({ name: 'search', required: false, type: String, example: 'Jean', description: "Recherche partielle par nom ou prénom (insensible à la casse)" })
  @ApiResponse({ status: 200, description: 'Liste paginée des intervenants, triée par le plus récent' })
  findAll(
    @Query('limit', new DefaultValuePipe(null), ParseIntPipe) limit: number | null,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
    @Query('search') search?: string,
  ) {
    return this.intervenantService.findAll(limit, offset, search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un intervenant par ID' })
  @ApiResponse({ status: 200, type: IntervenantResponseDto })
  findOne(@Param('id') id: string) {
    return this.intervenantService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour un intervenant' })
  @ApiResponse({ status: 200, type: IntervenantResponseDto })
  update(@Param('id') id: string, @Body() dto: UpdateIntervenantDto) {
    return this.intervenantService.update(+id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un intervenant' })
  @ApiResponse({ status: 204 })
  remove(@Param('id') id: string) {
    return this.intervenantService.remove(+id);
  }
}
