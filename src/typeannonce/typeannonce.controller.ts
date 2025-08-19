// src/typeannonce/typeannonce.controller.ts
import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    ParseIntPipe,
  } from '@nestjs/common';
  import { TypeannonceService } from './typeannonce.service';
  import { CreateTypeannonceDto } from './dto/create-typeannonce.dto';
  import { UpdateTypeannonceDto } from './dto/update-typeannonce.dto';
  
  @Controller('typeannonce')
  export class TypeannonceController {
    constructor(private readonly service: TypeannonceService) {}
  
    @Post()
    create(@Body() dto: CreateTypeannonceDto) {
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
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTypeannonceDto) {
      return this.service.update(id, dto);
    }
  
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
      return this.service.remove(id);
    }
  }
  