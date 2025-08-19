// src/profilassemblee/profilassemblee.controller.ts
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
  import { ProfilassembleeService } from './profilassemblee.service';
  import { CreateProfilassembleeDto } from './dto/create-profilassemblee.dto';
  import { UpdateProfilassembleeDto } from './dto/update-profilassemblee.dto';
  
  @Controller('profilassemblee')
  export class ProfilassembleeController {
    constructor(private readonly service: ProfilassembleeService) {}
  
    @Post()
    create(@Body() dto: CreateProfilassembleeDto) {
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
      @Body() dto: UpdateProfilassembleeDto,
    ) {
      return this.service.update(id, dto);
    }
  
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
      return this.service.remove(id);
    }
  }
  