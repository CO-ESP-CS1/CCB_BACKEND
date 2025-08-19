// src/profilpersonne/profilpersonne.controller.ts
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
  import { ProfilPersonneService } from './profilpersonne.service';
  import { CreateProfilPersonneDto } from './dto/create-profilpersonne.dto';
  import { UpdateProfilPersonneDto } from './dto/update-profilpersonne.dto';
  
  @Controller('profilpersonne')
  export class ProfilPersonneController {
    constructor(private readonly service: ProfilPersonneService) {}
  
    @Post()
    create(@Body() dto: CreateProfilPersonneDto) {
      return this.service.create(dto);
    }
  
    @Get()
    findAll() {
      return this.service.findAll();
    }
  
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
      return this.service.findOne(id);
    }
  
    @Patch(':id')
    update(
      @Param('id', ParseIntPipe) id: number,
      @Body() dto: UpdateProfilPersonneDto,
    ) {
      return this.service.update(id, dto);
    }
  
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
      return this.service.remove(id);
    }
  }
  