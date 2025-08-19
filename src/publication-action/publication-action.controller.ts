// src/publication-action/publication-action.controller.ts
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
  import { PublicationActionService } from './publication-action.service';
  import { CreatePublicationActionDto } from './dto/create-publication-action.dto';
  import { UpdatePublicationActionDto } from './dto/update-publication-action.dto';
  
  @Controller('publication-action')
  export class PublicationActionController {
    constructor(private readonly service: PublicationActionService) {}
  
    @Post()
    create(@Body() dto: CreatePublicationActionDto) {
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
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePublicationActionDto) {
      return this.service.update(id, dto);
    }
  
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
      return this.service.remove(id);
    }
  }
  