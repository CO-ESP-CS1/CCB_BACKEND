import { Controller, Get, Post, Body, Param, Patch, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ActiviteService } from './activite.service';
import { CreateActiviteDto1 } from './dto/create-activite.dto';
import { UpdateActiviteDto } from './dto/update-activite.dto';

@ApiTags('activites')
@Controller('activites')
export class ActiviteController {
  constructor(private readonly service: ActiviteService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une activité' })
  create(@Body() dto: CreateActiviteDto1) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer toutes les activités' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une activité par ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour une activité' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateActiviteDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une activité' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
