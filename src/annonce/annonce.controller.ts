import { Controller, Get, Post, Body, Param, Patch, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AnnonceService } from './annonce.service';
import { CreateAnnonceDto } from './dto/create-annonce.dto';
import { UpdateAnnonceDto } from './dto/update-annonce.dto';

@ApiTags('annonce')
@Controller('annonce')
export class AnnonceController {
  constructor(private readonly service: AnnonceService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une annonce' })
  create(@Body() dto: CreateAnnonceDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer toutes les annonces' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une annonce par ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour une annonce' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAnnonceDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une annonce' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
