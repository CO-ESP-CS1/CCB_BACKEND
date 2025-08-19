// src/typeactivites/typeactivites.controller.ts
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
  import { TypeactivitesService } from './typeactivites.service';
  import { CreateTypeactivitesDto } from './dto/create-typeactivites.dto';
  import { UpdateTypeactivitesDto } from './dto/update-typeactivites.dto';
  
  @Controller('typeactivites')
  export class TypeactivitesController {
    constructor(private readonly service: TypeactivitesService) {}
  
    @Post()
    create(@Body() dto: CreateTypeactivitesDto) {
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
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTypeactivitesDto) {
      return this.service.update(id, dto);
    }
  
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
      return this.service.remove(id);
    }
  }
  