import { Controller, Post, Body, UseGuards, BadRequestException, Get, ParseIntPipe, Param, Query , DefaultValuePipe} from '@nestjs/common';
import { BadgeService } from './membre-badge.service';
import { AssignBadgeDto } from './dto/assign-role.dto';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags, ApiOperation, ApiParam, ApiOkResponse, ApiNotFoundResponse, ApiQuery } from '@nestjs/swagger';
import { AssignBadgeByIdDto } from './dto/assign-badge-id.dto';
import { BadgeWithDateDto } from './dto/badge-with-date.dto';
import { BadgesListDto } from './dto/badges-list.dto';

@ApiTags('badges')
@ApiBearerAuth()
@Controller('badges')
export class BadgeController {
  constructor(private readonly badgeService: BadgeService) {}

  // Endpoint existant pour attribution par rôle
  @Post('assign-by-role')
  @ApiOperation({ summary: 'Attribuer un badge par nom de rôle' })
  @ApiBody({ type: AssignBadgeDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Badge attribué avec succès' 
  })
  @ApiResponse({ status: 404, description: 'Membre ou badge introuvable' })
  @ApiResponse({ status: 409, description: 'Le membre possède déjà ce badge' })
  async assignBadgeByRole(@Body() dto: AssignBadgeDto) {
    try {
      return this.badgeService.assignBadgeByRole(dto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

   @Post('assign-by-id')
  @ApiOperation({ summary: 'Attribuer un badge par ID' })
  @ApiBody({ type: AssignBadgeByIdDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Badge attribué avec succès' 
  })
  @ApiResponse({ status: 404, description: 'Membre ou badge introuvable' })
  @ApiResponse({ status: 409, description: 'Le membre possède déjà ce badge' })
  async assignBadgeById(@Body() dto: AssignBadgeByIdDto) {
    try {
      return this.badgeService.assignBadgeById(dto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }


     @Get('member/:idmembre')
  @ApiOperation({ summary: "Récupérer les badges d'un membre par son ID (avec pagination)" })
  @ApiParam({ name: 'idmembre', description: "ID du membre", type: Number, example: 42 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10, description: 'Nombre maximal d\'éléments à retourner' })
  @ApiQuery({ name: 'offset', required: false, type: Number, example: 0, description: 'Nombre d\'éléments à sauter (skip)' })
  @ApiOkResponse({ description: "Liste paginée des badges du membre", type: BadgesListDto })
  @ApiNotFoundResponse({ description: "Membre introuvable" })
  async getBadgesByMembre(
    @Param('idmembre', ParseIntPipe) idmembre: number,
    @Query('limit', new DefaultValuePipe(null), ParseIntPipe) limit: number | null,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
  ): Promise<BadgesListDto> {
    // limit peut être null (pas de limite)
    return this.badgeService.getBadgesByMembreId(idmembre, limit, offset);
  }
}