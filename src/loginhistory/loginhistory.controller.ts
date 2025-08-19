import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LoginHistoryService } from './loginhistory.service';
import { CreateLoginHistoryDto } from './dto/create-loginhistory.dto';
import { UpdateLoginHistoryDto } from './dto/update-loginhistory.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginHistoryResponseDto } from './dto/loginhistory-response.dto';

@ApiTags('loginhistory')
@Controller('loginhistory')
export class LoginHistoryController {
  constructor(private readonly loginHistoryService: LoginHistoryService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un enregistrement de connexion' })
  @ApiResponse({ status: 201, type: LoginHistoryResponseDto })
  create(@Body() dto: CreateLoginHistoryDto) {
    return this.loginHistoryService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lister les connexions' })
  @ApiResponse({ status: 200, type: [LoginHistoryResponseDto] })
  findAll() {
    return this.loginHistoryService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une connexion par ID' })
  @ApiResponse({ status: 200, type: LoginHistoryResponseDto })
  findOne(@Param('id') id: string) {
    return this.loginHistoryService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour une connexion' })
  @ApiResponse({ status: 200, type: LoginHistoryResponseDto })
  update(@Param('id') id: string, @Body() dto: UpdateLoginHistoryDto) {
    return this.loginHistoryService.update(+id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une connexion' })
  @ApiResponse({ status: 204 })
  remove(@Param('id') id: string) {
    return this.loginHistoryService.remove(+id);
  }
}
