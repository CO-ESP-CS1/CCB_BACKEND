import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFiles,
  UsePipes,
  ValidationPipe,
  BadRequestException,
  UseGuards,
  Query,
  Get,
  PipeTransform , Injectable, ParseIntPipe, DefaultValuePipe
} from '@nestjs/common';
import { AnnonceService } from './annonceNew.service';  // Assurez-vous que le bon service est importé
import { CreateAnnonceDto } from './dto/create-annonceNew.dto';  // Assurez-vous du bon nom de fichier
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '../auth/auth.guard'; // Gardien JWT
import { memoryStorage } from 'multer';
import { ApiTags, ApiBearerAuth, ApiConsumes, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserPayload } from '../auth/user-payload.decorator';  // Votre décorateur pour récupérer le payload utilisateur

@Injectable()
class ParseArrayPipe implements PipeTransform {
  transform(value: any) {
    if (!value) return [];

    if (Array.isArray(value)) {
      return value.map((v) => {
        const parsed = parseInt(v, 10);
        if (isNaN(parsed)) throw new BadRequestException(`Invalid number in array: ${v}`);
        return parsed;
      });
    }

    if (typeof value === 'string') {
      return value.split(',').map((v) => {
        const parsed = parseInt(v.trim(), 10);
        if (isNaN(parsed)) throw new BadRequestException(`Invalid number in array: ${v}`);
        return parsed;
      });
    }

    throw new BadRequestException('Invalid value for array parsing');
  }
}

@ApiTags('annonces')
@ApiBearerAuth()
@Controller('annoncesNew')
export class AnnonceController {
  constructor(private readonly annonceService: AnnonceService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une nouvelle annonce avec images' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: "Données de création de l'annonce avec fichiers images",
    schema: {
      type: 'object',
      properties: {
        titreannonce: { type: 'string' },
        descriptionannonce: { type: 'string' },
        typeannonce: { type: 'string' },
        priorite: { type: 'string', enum: ['haute', 'normale', 'basse', 'urgent'] },
        statutannonce: { type: 'string', enum: ['brouillon', 'publie', 'archive'] },
        publique_cible: { type: 'string' },
        imageurl: { type: 'string', format: 'binary', nullable: true },
        idassemblees: { type: 'string', description: 'Liste CSV des ID des assemblées' },
        iddepartements: { type: 'string', description: 'Liste CSV des ID des départements' },
      },
      required: ['titreannonce', 'descriptionannonce', 'typeannonce', 'statutannonce'],
    },
  })
  @ApiResponse({ status: 201, description: 'Annonce créée avec succès.' })
  @ApiResponse({ status: 400, description: 'Requête invalide.' })
  @ApiResponse({ status: 401, description: 'Non autorisé.' })
  @UseInterceptors(
    FileFieldsInterceptor(
      [{ name: 'imageurl', maxCount: 1 }],
      { storage: memoryStorage() },
    ),
  )
  @UsePipes(new ValidationPipe({ transform: true }))
  async createAnnonce(
    @Body() createDto: CreateAnnonceDto,
    @Body('idassemblees', new ParseArrayPipe()) idassemblees: number[],
    @Body('iddepartements', new ParseArrayPipe()) iddepartements: number[],
    @UploadedFiles() files: { imageurl?: Express.Multer.File[] },
    @UserPayload() userPayload: any,
  ) {
    console.log('Début de la création de l\'annonce');
    
    // Vérification des données du Body
    console.log('createDto:', createDto);
    console.log('idassemblees:', idassemblees);
    console.log('iddepartements:', iddepartements);

    // Assigner les données du payload utilisateur
    createDto.idmembre = userPayload.idmembre;
    createDto.idassemblees = idassemblees;
    createDto.iddepartements = iddepartements;

    // Vérification après transformation des données
    console.log('createDto après assignation de l\'idmembre:', createDto);

    // Vérification des fichiers uploadés
    const allFiles = [...(files.imageurl || [])];
    console.log('Fichiers uploadés:', allFiles);

    // Appel du service pour créer l'annonce
    const result = await this.annonceService.createAnnonce(createDto, allFiles);
    console.log('Annonce créée avec succès:', result);

    return result;
  }

@Get('user-annonces')
@UseGuards(AuthGuard)
async getAnnoncesForUser(
  @UserPayload() user: any, // Tout vient du token JWT
  @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
  @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10
) {
  console.log('Utilisateur connecté:', user);
  
  // Validation des données du token
  if (!user.idassemblee || !user.idmembre) {
    throw new BadRequestException('Les informations utilisateur sont incomplètes dans le token');
  }

  return this.annonceService.getAnnoncesForUser(user, page, limit);
}
}
