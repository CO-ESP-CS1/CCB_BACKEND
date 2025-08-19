// src/responsabilite/responsabilite.controller.ts
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
  import { ResponsabiliteService } from './responsabilite.service';
  import { CreateResponsabiliteDto } from './dto/create-responsabilite.dto';
  import { UpdateResponsabiliteDto } from './dto/update-responsabilite.dto';
  
  @Controller('responsabilite')
  export class ResponsabiliteController {
    constructor(private readonly service: ResponsabiliteService) {}
  
    @Post()
    create(@Body() dto: CreateResponsabiliteDto) {
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
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateResponsabiliteDto) {
      return this.service.update(id, dto);
    }
  
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
      return this.service.remove(id);
    }
  }
  