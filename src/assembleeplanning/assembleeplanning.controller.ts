import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  UseGuards,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  ValidationPipe,
  ForbiddenException,
} from '@nestjs/common';
import { AssembleePlanningService } from './assembleeplanning.service';
import { CreateAssembleePlanningDto } from './dto/create-assembleeplanning.dto';
import { AuthGuard } from '../auth/auth.guard';
import { UserPayload } from '../auth/user-payload.decorator';
import {
  ApiBearerAuth,
  ApiBody,
  ApiResponse,
  ApiTags,
  ApiQuery,
  ApiOperation,
  ApiParam,
  ApiProperty,
} from '@nestjs/swagger';

/** --- Entities pour Swagger (réponse) --- */
class AssembleePlanningEntity {
  @ApiProperty({ description: "ID de l'assemblée" })
  idassemblee: number;

  @ApiProperty({ description: "ID du planning" })
  idplanning: number;

  @ApiProperty({
    type: Date,
    description: 'Date de création',
    example: '2023-10-15T14:30:00.000Z',
  })
  createat: Date;

  @ApiProperty({
    type: Date,
    description: 'Date de mise à jour',
    example: '2023-10-15T14:30:00.000Z',
  })
  updateat: Date;
}

class PaginatedAssembleePlanningResponse {
  @ApiProperty({
    type: [AssembleePlanningEntity],
    description: 'Liste des associations',
  })
  data: AssembleePlanningEntity[];

  @ApiProperty({
    description: 'Métadonnées de pagination',
    example: {
      page: 1,
      limit: 10,
      total: 100,
      hasMore: true,
    },
  })
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

/** --- Controller corrigé (sans redéclaration DTO) --- */
@ApiTags('assemblee-planning')
@ApiBearerAuth()
@Controller('assembleeplanning')
export class AssembleePlanningController {
  constructor(private readonly service: AssembleePlanningService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Associer une assemblée à un planning',
    description:
      "Crée une association entre une assemblée et un planning. Renvoie l'association existante si déjà présente.",
  })
  @ApiBody({
    type: CreateAssembleePlanningDto,
    description: "Données pour créer l'association",
  })
  @ApiResponse({
    status: 201,
    description: 'Association créée ou existante',
    type: AssembleePlanningEntity,
  })
  @ApiResponse({
    status: 400,
    description: 'Requête invalide',
  })
  @ApiResponse({
    status: 403,
    description: 'Non autorisé',
  })
  async create(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    data: CreateAssembleePlanningDto,
    @UserPayload() user: any,
  ) {
    if (!user) throw new ForbiddenException('Utilisateur non authentifié');
    return this.service.create(data);
  }

  @Get()
  @ApiOperation({
    summary: "Lister les associations assemblée-planning",
    description:
      "Retourne une liste paginée des associations avec possibilité de filtrage par assemblée",
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Numéro de page (défaut: 1)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: "Nombre d'éléments par page (défaut: 10, max: 100)",
    example: 10,
  })
  @ApiQuery({
    name: 'assembleeId',
    required: false,
    description: "Filtrer par ID d'assemblée",
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Liste paginée des associations',
    type: PaginatedAssembleePlanningResponse,
  })
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('assembleeId') assembleeId?: string,
  ) {
    const assembleeIdNum = assembleeId ? parseInt(assembleeId, 10) : undefined;
    return this.service.findAll(page, limit, assembleeIdNum);
  }

  @Get(':idassemblee/:idplanning')
  @ApiOperation({
    summary: 'Obtenir une association spécifique',
    description:
      "Récupère une association par ses identifiants composés (assemblée + planning)",
  })
  @ApiParam({
    name: 'idassemblee',
    description: "ID de l'assemblée",
    type: Number,
    example: 1,
  })
  @ApiParam({
    name: 'idplanning',
    description: 'ID du planning',
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Association récupérée',
    type: AssembleePlanningEntity,
  })
  @ApiResponse({
    status: 404,
    description: 'Association non trouvée',
  })
  async findOne(
    @Param('idassemblee', ParseIntPipe) idassemblee: number,
    @Param('idplanning', ParseIntPipe) idplanning: number,
  ) {
    return this.service.findOne(idassemblee, idplanning);
  }

  @Delete(':idassemblee/:idplanning')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Supprimer une association',
    description: "Supprime l'association entre une assemblée et un planning",
  })
  @ApiParam({
    name: 'idassemblee',
    description: "ID de l'assemblée",
    type: Number,
    example: 1,
  })
  @ApiParam({
    name: 'idplanning',
    description: 'ID du planning',
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Association supprimée',
    schema: {
      example: {
        message: 'Association supprimée',
        idassemblee: 1,
        idplanning: 1,
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Non autorisé',
  })
  @ApiResponse({
    status: 404,
    description: 'Association non trouvée',
  })
  async remove(
    @Param('idassemblee', ParseIntPipe) idassemblee: number,
    @Param('idplanning', ParseIntPipe) idplanning: number,
    @UserPayload() user: any,
  ) {
    if (!user) throw new ForbiddenException('Utilisateur non authentifié');
    return this.service.remove(idassemblee, idplanning);
  }
}
