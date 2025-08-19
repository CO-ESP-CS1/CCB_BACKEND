import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query, 
  ParseIntPipe
} from '@nestjs/common';
import { DepartementService } from './departement.service';
import { CreateDepartementDto } from './dto/create-departement.dto';
import { UpdateDepartementDto } from './dto/update-departement.dto';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiQuery , ApiProperty
} from '@nestjs/swagger';

// Entité pour la documentation Swagger
class DepartementEntity {
  @ApiProperty({ description: 'ID du département' })
  iddepartement: number;

  @ApiProperty({ description: 'Nom du département' })
  nomdepartement: string;

  @ApiProperty({ description: 'Responsable du département', required: false })
  responsable?: string;

  @ApiProperty({ description: 'ID de l\'assemblée associée', required: false })
  idassemblee?: number;

  @ApiProperty({ 
    description: 'Profil du département',
    type: Object,
    example: {
      idprofildepartement: 1,
      description: 'Description du département',
      photourl: 'https://example.com/photo.jpg',
      couvertureurl: 'https://example.com/couverture.jpg'
    }
  })
  profildepartement: {
    idprofildepartement: number;
    description: string;
    photourl: string;
    couvertureurl: string;
  };
}

@ApiTags('Départements')
@Controller('departement')
export class DepartementController {
  constructor(private readonly service: DepartementService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un nouveau département' })
  @ApiResponse({ 
    status: 201, 
    description: 'Département créé avec succès',
    type: DepartementEntity 
  })
  create(@Body() data: CreateDepartementDto) {
    return this.service.create(data);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Lister tous les départements',
    description: 'Retourne une liste paginée de départements avec leurs profils'
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Limite de résultats (défaut: 10)',
    type: Number,
    example: 10
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    description: 'Offset de pagination (défaut: 0)',
    type: Number,
    example: 0
  })
  @ApiQuery({
    name: 'idassemblee',
    required: false,
    description: 'Filtrer par ID d\'assemblée',
    type: Number,
    example: 1
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des départements',
    schema: {
      example: {
        data: [{
          iddepartement: 1,
          nomdepartement: 'Informatique',
          responsable: 'John Doe',
          profildepartement: {
            photourl: 'https://example.com/photo.jpg',
            couvertureurl: 'https://example.com/couverture.jpg'
          }
        }],
        pagination: {
          total: 20,
          limit: 10,
          offset: 0,
          hasMore: true
        }
      }
    }
  })
  findAll(
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('offset', new ParseIntPipe({ optional: true })) offset?: number,
    @Query('idassemblee', new ParseIntPipe({ optional: true })) idassemblee?: number
  ) {
    return this.service.findAll(limit, offset, idassemblee);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir un département par son ID' })
  @ApiResponse({
    status: 200,
    description: 'Détails du département',
    type: DepartementEntity
  })
  @ApiResponse({
    status: 404,
    description: 'Département non trouvé'
  })
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour un département' })
  @ApiResponse({
    status: 200,
    description: 'Département mis à jour',
    type: DepartementEntity
  })
  update(@Param('id') id: string, @Body() data: UpdateDepartementDto) {
    return this.service.update(+id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un département' })
  @ApiResponse({
    status: 200,
    description: 'Département supprimé'
  })
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}