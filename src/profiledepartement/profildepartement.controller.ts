// src/profildepartement/profildepartement.controller.ts
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
  import { ProfilDepartementService } from './profildepartement.service';
  import { CreateProfilDepartementDto } from './dto/create-profildepartement.dto';
  import { UpdateProfilDepartementDto } from './dto/update-profildepartement.dto';
  
  @Controller('profildepartement')
  export class ProfilDepartementController {
    constructor(private readonly service: ProfilDepartementService) {}
  
    @Post()
    create(@Body() dto: CreateProfilDepartementDto) {
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
      @Body() dto: UpdateProfilDepartementDto,
    ) {
      return this.service.update(id, dto);
    }
  
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
      return this.service.remove(id);
    }
  }
  