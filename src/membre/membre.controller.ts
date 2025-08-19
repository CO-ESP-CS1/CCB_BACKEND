import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query, 
  ParseIntPipe,
  DefaultValuePipe,
  BadRequestException,
  PipeTransform,
  Injectable,
  ArgumentMetadata,  UnauthorizedException,
} from '@nestjs/common';
import { MembreService } from './membre.service';
import { CreateMembreDto } from './dto/create-membre.dto';
import { UpdateMembreDto } from './dto/update-membre.dto';
import { AuthGuard } from '../auth/auth.guard'; // adapte le chemin si nécessaire
import { UserPayload } from '../auth/user-payload.decorator'; 
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiQuery,
  ApiParam,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse
} from '@nestjs/swagger';

// Pipe personnalisé pour les paramètres optionnels numériques
@Injectable()
export class OptionalParseIntPipe implements PipeTransform<string | undefined, number | undefined> {
  transform(value: string | undefined, metadata: ArgumentMetadata): number | undefined {
    if (value === undefined || value === '') {
      return undefined;
    }
    
    const val = parseInt(value, 10);
    if (isNaN(val)) {
      throw new BadRequestException('Validation failed (numeric string is expected)');
    }
    
    return val;
  }
}

@ApiTags('membres')
@Controller('membres')
export class MembreController {
  constructor(private readonly membreService: MembreService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un nouveau membre' })
  @ApiCreatedResponse({ description: 'Membre créé avec succès' })
  @ApiBadRequestResponse({ description: 'Données invalides' })
  create(@Body() dto: CreateMembreDto) {
    return this.membreService.create(dto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Lister tous les membres avec filtres',
    description: 'Récupère les membres avec pagination et filtres: statut, rôle, assemblée, département'
  })
  @ApiQuery({ name: 'skip', required: false, type: Number, description: 'Position de départ (défaut: 0)' })
  @ApiQuery({ name: 'take', required: false, type: Number, description: 'Nombre d\'éléments (défaut: 10, max: 100)' })
  @ApiQuery({ name: 'statut', required: false, type: String, description: 'Filtrer par statut du membre' })
  @ApiQuery({ name: 'role', required: false, type: String, description: 'Filtrer par rôle du membre' })
  @ApiQuery({ name: 'idassemblee', required: false, type: Number, description: 'Filtrer par ID d\'assemblée' })
  @ApiQuery({ name: 'iddepartement', required: false, type: Number, description: 'Filtrer par ID de département' })
  @ApiOkResponse({ 
    description: 'Liste paginée des membres',
    schema: {
      example: {
        data: [
          {
            idmembre: 1,
            codemembre: "MEM-001",
            solde: 100.50,
            dateadhesion: "2023-01-15",
            statutmembre: "actif",
            role: "membre",
            idassemblee: 1,
            idpersonne: 123,
            createat: "2023-01-15T10:00:00.000Z",
            updateat: "2023-08-28T12:00:00.000Z",
            personne: {
              idpersonne: 123,
              nom: "Dupont",
              prenom: "Jean",
              telephone: "+33123456789",
              email: "jean.dupont@example.com"
            },
            assemblee: {
              idassemblee: 1,
              nomassemble: "Assemblée de Paris"
            },
            est: [
              {
                iddepartement: 1,
                departement: {
                  iddepartement: 1,
                  nomdepartement: "Musique"
                }
              }
            ]
          }
        ],
        pagination: {
          total: 50,
          skip: 0,
          take: 10,
          hasMore: true,
          currentPage: 1,
          totalPages: 5
        }
      }
    }
  })
  findAll(
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip: number = 0,
    @Query('take', new DefaultValuePipe(10), ParseIntPipe) take: number = 10,
    @Query('statut') statut?: string,
    @Query('role') role?: string,
    @Query('idassemblee', OptionalParseIntPipe) idassemblee?: number,
    @Query('iddepartement', OptionalParseIntPipe) iddepartement?: number
  ) {
    try {
      return this.membreService.findAll(
        skip,
        take,
        statut,
        role,
        idassemblee,
        iddepartement
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un membre par ID' })
  @ApiParam({ name: 'id', description: 'ID du membre', type: Number })
  @ApiOkResponse({ description: 'Détails du membre' })
  @ApiNotFoundResponse({ description: 'Membre non trouvé' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.membreService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour un membre' })
  @ApiParam({ name: 'id', description: 'ID du membre à mettre à jour', type: Number })
  @ApiOkResponse({ description: 'Membre mis à jour' })
  @ApiNotFoundResponse({ description: 'Membre non trouvé' })
  @ApiBadRequestResponse({ description: 'Données invalides' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMembreDto
  ) {
    return this.membreService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un membre' })
  @ApiParam({ name: 'id', description: 'ID du membre à supprimer', type: Number })
  @ApiOkResponse({ description: 'Membre supprimé' })
  @ApiNotFoundResponse({ description: 'Membre non trouvé' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.membreService.remove(id);
  }


    @Get('me/profile')
  async getMyProfile(@UserPayload('idmembre') idmembreFromToken: number | string) {
    if (!idmembreFromToken) {
      throw new UnauthorizedException('idmembre absent du token');
    }

    const idmembre = typeof idmembreFromToken === 'string'
      ? parseInt(idmembreFromToken, 10)
      : idmembreFromToken;

    if (!idmembre || Number.isNaN(idmembre)) {
      throw new UnauthorizedException('idmembre invalide dans le token');
    }

    return this.membreService.getProfileByMembreId(Number(idmembre));
  }
}