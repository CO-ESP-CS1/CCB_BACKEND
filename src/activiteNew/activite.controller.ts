import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  UsePipes,
  ValidationPipe,  Param,ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ActiviteService } from './activite.service';
import { CreateActiviteDto } from './dto/create-activite.dto';
import { AuthGuard } from '../auth/auth.guard';
import { UserPayload } from '../auth/user-payload.decorator';
import { ApiTags, ApiBearerAuth, ApiConsumes, ApiBody, ApiQuery, ApiResponse , ApiOperation, ApiParam} from '@nestjs/swagger';

@ApiTags('Activités')
@ApiBearerAuth()
@Controller('activiteNew')
@UseGuards(AuthGuard)
export class ActiviteController {
  constructor(private readonly activiteService: ActiviteService) {}

  @ApiOperation({ summary: 'Créer un nouveau activites pour bcloudinary' })
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 }, // Limite à 5MB
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Création d\'une activité avec image',
    type: CreateActiviteDto,
    schema: {
      type: 'object',
      properties: {
        libelleactivite: { type: 'string', description: 'Nom de l\'activité' },
        descriptionactivite: { type: 'string', description: 'Description détaillée de l\'activité' },
        datedebut: { type: 'string', format: 'date', description: 'Date de début de l\'activité' },
        datefin: { type: 'string', format: 'date', description: 'Date de fin de l\'activité' },
        statutactivite: { type: 'string', example: 'en cours', description: 'Statut de l\'activité (ex. en cours)' },
        idtypeactivites: { type: 'integer', description: 'ID du type d\'activité' },
        necessiteInscription: { type: 'boolean', description: 'Indique si l\'inscription est requise pour l\'activité' },
        publicCible: { type: 'string', description: 'Public cible de l\'activité (ex. TOUS, ADMIN)' },
        image: {
          type: 'string',
          format: 'binary',
          description: 'Image associée à l\'activité (si applicable)',
        },
      },
      required: ['idtypeactivites'], // Champ requis
    },
  })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @ApiResponse({
    status: 201,
    description: 'Activité créée avec succès.',
  })
  async createActivite(
    @Body() createActiviteDto: CreateActiviteDto,
    @UploadedFile() imageFile: Express.Multer.File,
  ) {
    // Transformation des dates pour s'assurer qu'elles sont au format ISO-8601
    if (createActiviteDto.datedebut) {
      createActiviteDto.datedebut = new Date(createActiviteDto.datedebut).toISOString();
    }

    if (createActiviteDto.datefin) {
      createActiviteDto.datefin = new Date(createActiviteDto.datefin).toISOString();
    }

    // Vérification explicite des autres champs
    if (createActiviteDto.descriptionactivite) {
      createActiviteDto.descriptionactivite = String(createActiviteDto.descriptionactivite).trim();
    }

    if (createActiviteDto.idtypeactivites) {
      createActiviteDto.idtypeactivites = parseInt(String(createActiviteDto.idtypeactivites), 10);
    }

    // Appel du service pour la création de l'activité
    return this.activiteService.createActivite(createActiviteDto, imageFile);
  }

  @ApiOperation({ summary: 'obtenir les activites du memebre connecte' })
  @Get()
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Nombre d\'éléments à récupérer (pagination)',
    type: Number,
    example: 10,
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    description: 'Offset de pagination (point de départ)',
    type: Number,
    example: 0,
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des activités en cours pour l\'utilisateur',
    type: [CreateActiviteDto],
  })
  async getActivites(
    @UserPayload() userPayload: any,
    @Query('limit') limit: number = 10, // Valeur par défaut : 10
    @Query('offset') offset: number = 0, // Valeur par défaut : 0
  ) {
    const { role, idassemblee } = userPayload;  // Extraction des données du token via ton décorateur custom

    // Passer ces informations au service pour appliquer les filtres nécessaires
    const activites = await this.activiteService.getActivitesByUserRole(role, idassemblee, limit, offset);

    return activites;
  }


@ApiOperation({ 
    summary: 'Obtenir les activités d\'une assemblée spécifique',
    description: 'Récupère les activités d\'une assemblée avec pagination, tri par date et filtrage des activités expirées'
  })
  @Get('assemblee/:idassemblee')
  @ApiParam({
    name: 'idassemblee',
    description: 'ID de l\'assemblée dont on veut récupérer les activités',
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Nombre d\'éléments à récupérer (pagination)',
    type: Number,
    example: 10,
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    description: 'Offset de pagination (point de départ)',
    type: Number,
    example: 0,
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des activités de l\'assemblée',
  })
  async getActivitesByAssemblee(
    @Param('idassemblee', ParseIntPipe) idassemblee: number,
    @Query('limit') limit: number = 10,
    @Query('offset') offset: number = 0,
  ) {
    return this.activiteService.getActivitesByAssemblee(
      idassemblee,
      limit,
      offset
    );
  }

  @ApiOperation({ 
    summary: 'Obtenir les activités d\'un département spécifique',
    description: 'Récupère les activités d\'un département avec pagination, tri par date et filtrage des activités expirées'
  })
  @Get('departement/:iddepartement')
  @ApiParam({
    name: 'iddepartement',
    description: 'ID du département dont on veut récupérer les activités',
    type: Number,
    example: 75,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Nombre d\'éléments à récupérer (pagination)',
    type: Number,
    example: 10,
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    description: 'Offset de pagination (point de départ)',
    type: Number,
    example: 0,
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des activités du département',
  })
  async getActivitesByDepartement(
    @Param('iddepartement', ParseIntPipe) iddepartement: number,
    @Query('limit') limit: number = 10,
    @Query('offset') offset: number = 0,
  ) {
    return this.activiteService.getActivitesByDepartement(
      iddepartement,
      limit,
      offset
    );
  }
}
