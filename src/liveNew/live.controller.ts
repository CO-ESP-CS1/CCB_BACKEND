// src/live/live.controller.ts
import { Controller, Post, Body, UseGuards, Get, Query } from '@nestjs/common';
import { LiveService } from './live.service';
import { CreateLiveDto } from './dto/create-live.dto';
import { AuthGuard } from '../auth/auth.guard';
import { UserPayload } from '../auth/user-payload.decorator';
import { Public } from '../auth/public.decorator';

import { ApiTags, ApiBearerAuth, ApiOperation,ApiQuery, ApiResponse, ApiUnauthorizedResponse, ApiBadRequestResponse } from '@nestjs/swagger';

@ApiTags('Live')
@ApiBearerAuth()
@Controller('liveNew')
@UseGuards(AuthGuard)
export class LiveController {
  constructor(private readonly liveService: LiveService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un nouveau live' })
  @ApiResponse({ status: 201, description: 'Live créé avec succès.' })
  @ApiBadRequestResponse({ description: 'Données invalides ou manquantes.' })
  @ApiUnauthorizedResponse({ description: 'Authentification requise.' })
  async createLive(
    @Body() createLiveDto: CreateLiveDto,
    @UserPayload('idmembre') idmembre: number,
  ) {
    return this.liveService.createLive(createLiveDto, idmembre);
  }

    @Public()
   @Get()
  @ApiOperation({ summary: 'Récupérer les lives avec leurs auteurs' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Nombre max de lives à retourner' })
  @ApiQuery({ name: 'offset', required: false, type: Number, description: 'Nombre d\'éléments à sauter' })
  @ApiResponse({ status: 200, description: 'Liste des lives avec auteurs' })
  async getLives(
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    // parseInt car query params sont strings
    const l = limit ? parseInt(limit.toString(), 10) : 10;
    const o = offset ? parseInt(offset.toString(), 10) : 0;
    return this.liveService.getLivesWithAuthors(l, o);
  }
}
