import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Patch, 
  Delete, 
  Query, 
  ParseIntPipe,
  DefaultValuePipe
} from '@nestjs/common';
import { AssembleeService } from './assemblee.service';
import { CreateAssembleeDto } from './dto/create-assemblee.dto';
import { UpdateAssembleeDto } from './dto/update-assemblee.dto';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiQuery, 
  ApiBody,
  ApiParam,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiProperty
} from '@nestjs/swagger';
import { Public } from '../auth/public.decorator';
// Définition des entités directement dans le fichier
class ProfilAssemblee {
  @ApiProperty({ 
    example: 'https://example.com/photo.jpg', 
    description: 'URL de la photo de profil',
    required: false 
  })
  photourl?: string;

  @ApiProperty({ 
    example: 'https://example.com/cover.jpg', 
    description: 'URL de la photo de couverture',
    required: false 
  })
  couvertureurl?: string;

  @ApiProperty({ 
    example: 'Assemblée principale de Paris', 
    description: 'Description de l\'assemblée',
    required: false 
  })
  description?: string;
}

class Arrondissement {
  @ApiProperty({ example: 1, description: 'ID de l\'arrondissement' })
  idarrondissement: number;

  @ApiProperty({ example: 'Paris Centre', description: 'Nom de l\'arrondissement' })
  nomarrondissement: string;
}

class Assemblee {
  @ApiProperty({ example: 1, description: 'ID unique de l\'assemblée' })
  idassemblee: number;

  @ApiProperty({ example: 'Assemblée de Paris', description: 'Nom de l\'assemblée' })
  nomassemble: string;

  @ApiProperty({ 
    example: '123 Rue de l\'Église', 
    description: 'Adresse physique de l\'assemblée',
    required: false 
  })
  adresseassemblee?: string;

  @ApiProperty({ 
    example: 'Nord', 
    description: 'Zone géographique',
    required: false 
  })
  zone?: string;

  @ApiProperty({ example: 1, description: 'ID de l\'arrondissement associé' })
  idarrondissement: number;

  @ApiProperty({ 
    example: '2023-01-01T00:00:00.000Z', 
    description: 'Date de création' 
  })
  createat: Date;

  @ApiProperty({ 
    example: '2023-01-01T00:00:00.000Z', 
    description: 'Date de dernière mise à jour' 
  })
  updateat: Date;

  @ApiProperty({ 
    type: Arrondissement, 
    description: 'Arrondissement associé' 
  })
  arrondissement: Arrondissement;

  @ApiProperty({ 
    type: ProfilAssemblee, 
    description: 'Profil avec photos et description' 
  })
  profilassemblee: ProfilAssemblee;
}

class PaginatedAssembleeResponse {
  @ApiProperty({ 
    type: [Assemblee], 
    description: 'Liste des assemblées' 
  })
  data: Assemblee[];

  @ApiProperty({ 
    description: 'Métadonnées de pagination',
    example: {
      total: 50,
      skip: 0,
      take: 10,
      hasMore: true,
      currentPage: 1,
      totalPages: 5,
      nextPage: 2,
      prevPage: null
    }
  })
  pagination: {
    total: number;
    skip: number;
    take: number;
    hasMore: boolean;
    currentPage: number;
    totalPages: number;
    nextPage: number | null;
    prevPage: number | null;
  };
}

@ApiTags('Assemblées')
@Controller('assemblees')
export class AssembleeController {
  constructor(private readonly assembleeService: AssembleeService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Créer une nouvelle assemblée',
    description: 'Crée une nouvelle assemblée avec les données fournies. Retourne l\'assemblée créée avec son profil.'
  })
  @ApiBody({ 
    type: CreateAssembleeDto,
    examples: {
      standard: {
        summary: 'Assemblée standard',
        value: {
          nomassemble: "Assemblée de Paris",
          adresseassemblee: "123 Rue de l'Église",
          zone: "Nord",
          idarrondissement: 1
        }
      },
      minimal: {
        summary: 'Minimum requis',
        value: {
          nomassemble: "Assemblée de Lyon",
          idarrondissement: 2
        }
      }
    }
  })
  @ApiCreatedResponse({ 
    description: 'Assemblée créée avec succès',
    type: Assemblee
  })
  @ApiBadRequestResponse({ 
    description: 'Données invalides ou manquantes' 
  })
  create(@Body() data: CreateAssembleeDto) {
    return this.assembleeService.create(data);
  }

    @Public()
  @Get()
  @ApiOperation({ 
    summary: 'Lister toutes les assemblées',
    description: `Récupère une liste paginée des assemblées avec options de:
    - Pagination (skip/take)
    - Recherche globale (nom, zone ou adresse)
    - Tri par champ spécifique
    - Ordre de tri (asc/desc)
    
    Valeurs par défaut: skip=0, take=10, sortField=idassemblee, sortOrder=asc`
  })
  @ApiQuery({ 
    name: 'skip', 
    required: false, 
    type: Number, 
    description: 'Position de départ (défaut: 0)',
    example: 0
  })
  @ApiQuery({ 
    name: 'take', 
    required: false, 
    type: Number, 
    description: 'Nombre d\'éléments (défaut: 10, max: 100)',
    example: 10
  })
  @ApiQuery({ 
    name: 'search', 
    required: false, 
    type: String, 
    description: 'Terme de recherche (nom, zone ou adresse)',
    example: 'paris'
  })
  @ApiQuery({ 
    name: 'sortField', 
    required: false, 
    enum: ['idassemblee', 'nomassemble', 'createat', 'updateat'],
    description: 'Champ de tri (défaut: idassemblee)',
    example: 'nomassemble'
  })
  @ApiQuery({ 
    name: 'sortOrder', 
    required: false, 
    enum: ['asc', 'desc'],
    description: 'Ordre de tri (défaut: asc)',
    example: 'asc'
  })
  @ApiOkResponse({ 
    description: 'Liste paginée des assemblées',
    type: PaginatedAssembleeResponse
  })
  @ApiBadRequestResponse({ 
    description: 'Paramètres invalides' 
  })
  findAll(
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip: number = 0,
    @Query('take', new DefaultValuePipe(10), ParseIntPipe) take: number = 10,
    @Query('search') search?: string,
    @Query('sortField') sortField: string = 'idassemblee',
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'asc'
  ) {
    return this.assembleeService.findAll(
      skip,
      take,
      search,
      sortField,
      sortOrder
    );
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Obtenir les détails d\'une assemblée',
    description: 'Récupère les détails complets d\'une assemblée par son ID'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID de l\'assemblée', 
    type: Number,
    example: 1
  })
  @ApiOkResponse({ 
    description: 'Détails de l\'assemblée',
    type: Assemblee
  })
  @ApiNotFoundResponse({ 
    description: 'Assemblée non trouvée' 
  })
  @ApiBadRequestResponse({ 
    description: 'ID invalide' 
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.assembleeService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Mettre à jour une assemblée',
    description: 'Met à jour partiellement une assemblée existante'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID de l\'assemblée à mettre à jour', 
    type: Number,
    example: 1
  })
  @ApiBody({ 
    type: UpdateAssembleeDto,
    examples: {
      rename: {
        summary: 'Renommer',
        value: { nomassemble: "Nouveau nom" }
      },
      relocate: {
        summary: 'Changer de zone',
        value: { zone: "Nouvelle zone" }
      }
    }
  })
  @ApiOkResponse({ 
    description: 'Assemblée mise à jour',
    type: Assemblee
  })
  @ApiNotFoundResponse({ 
    description: 'Assemblée non trouvée' 
  })
  @ApiBadRequestResponse({ 
    description: 'Données invalides' 
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateAssembleeDto
  ) {
    return this.assembleeService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Supprimer une assemblée',
    description: 'Supprime une assemblée et retourne ses données'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID de l\'assemblée à supprimer', 
    type: Number,
    example: 1
  })
  @ApiOkResponse({ 
    description: 'Assemblée supprimée',
    type: Assemblee
  })
  @ApiNotFoundResponse({ 
    description: 'Assemblée non trouvée' 
  })
  @ApiBadRequestResponse({ 
    description: 'ID invalide' 
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.assembleeService.remove(id);
  }
}