// src/typeresponsabilite/typeresponsabilite.controller.ts
import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Patch,
    Delete,
    ParseIntPipe,
  } from '@nestjs/common';
  import { TyperesponsabiliteService } from './typeresponsabilite.service';
  import { CreateTyperesponsabiliteDto } from './dto/create-typeresponsabilite.dto';
  import { UpdateTyperesponsabiliteDto } from './dto/update-typeresponsabilite.dto';
  import { ApiTags, ApiResponse, ApiParam } from '@nestjs/swagger';
  
  @ApiTags('typeresponsabilite')
  @Controller('typeresponsabilite')
  export class TyperesponsabiliteController {
    constructor(private readonly service: TyperesponsabiliteService) {}
  
    @Post()
    @ApiResponse({ status: 201, description: 'Création réussie' })
    create(@Body() dto: CreateTyperesponsabiliteDto) {
      return this.service.create(dto);
    }
  
    @Get()
    @ApiResponse({ status: 200, description: 'Liste des types de responsabilité' })
    findAll() {
      return this.service.findAll();
    }
  
    @Get(':id')
    @ApiParam({ name: 'id', type: Number })
    @ApiResponse({ status: 200, description: 'Type de responsabilité trouvé' })
    @ApiResponse({ status: 404, description: 'Non trouvé' })
    findOne(@Param('id', ParseIntPipe) id: number) {
      return this.service.findOne(id);
    }
  
    @Patch(':id')
    @ApiParam({ name: 'id', type: Number })
    @ApiResponse({ status: 200, description: 'Mise à jour réussie' })
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTyperesponsabiliteDto) {
      return this.service.update(id, dto);
    }
  
    @Delete(':id')
    @ApiParam({ name: 'id', type: Number })
    @ApiResponse({ status: 200, description: 'Suppression réussie' })
    remove(@Param('id', ParseIntPipe) id: number) {
      return this.service.remove(id);
    }
  }
  