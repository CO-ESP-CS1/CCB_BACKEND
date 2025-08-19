import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LiveService } from './live.service';
import { CreateLiveDto1 } from './dto/create-live.dto';
import { UpdateLiveDto } from './dto/update-live.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LiveResponseDto } from './dto/live-response.dto';

@ApiTags('lives')
@Controller('lives')
export class LiveController {
  constructor(private readonly liveService: LiveService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un live' })
  @ApiResponse({ status: 201, type: LiveResponseDto })
  create(@Body() dto: CreateLiveDto1) {
    return this.liveService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lister tous les lives' })
  @ApiResponse({ status: 200, type: [LiveResponseDto] })
  findAll() {
    return this.liveService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un live par ID' })
  @ApiResponse({ status: 200, type: LiveResponseDto })
  findOne(@Param('id') id: string) {
    return this.liveService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour un live' })
  @ApiResponse({ status: 200, type: LiveResponseDto })
  update(@Param('id') id: string, @Body() dto: UpdateLiveDto) {
    return this.liveService.update(+id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un live' })
  @ApiResponse({ status: 204 })
  remove(@Param('id') id: string) {
    return this.liveService.remove(+id);
  }
}
