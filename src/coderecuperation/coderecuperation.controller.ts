import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CodeRecuperationService } from './coderecuperation.service';
import { CreateCodeRecuperationDto } from './dto/create-coderecuperation.dto';
import { UpdateCodeRecuperationDto } from './dto/update-coderecuperation.dto';

@ApiTags('Code de récupération') // Groupe dans Swagger
@Controller('coderecuperation')
export class CodeRecuperationController {
  constructor(private readonly service: CodeRecuperationService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un code de récupération' })
  @ApiResponse({ status: 201, description: 'Code de récupération créé avec succès.' })
  @ApiResponse({ status: 400, description: 'Données invalides.' })
  create(@Body() data: CreateCodeRecuperationDto) {
    return this.service.create(data);
  }

  @Get()
  @ApiOperation({ summary: 'Lister tous les codes de récupération' })
  @ApiResponse({ status: 200, description: 'Liste des codes de récupération.' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir un code de récupération par ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID du code de récupération' })
  @ApiResponse({ status: 200, description: 'Code de récupération trouvé.' })
  @ApiResponse({ status: 404, description: 'Code non trouvé.' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour un code de récupération' })
  @ApiParam({ name: 'id', type: Number, description: 'ID du code à mettre à jour' })
  @ApiResponse({ status: 200, description: 'Code de récupération mis à jour.' })
  update(@Param('id') id: string, @Body() data: UpdateCodeRecuperationDto) {
    return this.service.update(+id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un code de récupération' })
  @ApiParam({ name: 'id', type: Number, description: 'ID du code à supprimer' })
  @ApiResponse({ status: 200, description: 'Code supprimé avec succès.' })
  @ApiResponse({ status: 404, description: 'Code non trouvé.' })
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
