import {
  Controller,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  UsePipes,
  ValidationPipe,
  UploadedFile,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { PublicationService } from './publication.service';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { AuthGuard } from '../auth/auth.guard';
import { UserPayload } from '../auth/user-payload.decorator';
import { CreateAudioPublicationDto } from './dto/create-audio-publication.dto';
import { memoryStorage } from 'multer'
import { FileInterceptor } from '@nestjs/platform-express';;
import {
  ApiTags,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('publications')
@ApiBearerAuth()
@Controller('publications')
@UseGuards(AuthGuard)
export class PublicationController {
  constructor(private readonly publicationService: PublicationService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une nouvelle publication avec fichiers médias' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Données de création de la publication avec fichiers médias',
    schema: {
      type: 'object',
      properties: {
        titre: { type: 'string' },
        description: { type: 'string' },
        typepublication: { type: 'string', enum: ['STORY', 'POST', 'VIDEO', 'SHORT'] },
        expirationdate: { type: 'string', format: 'date-time', nullable: true },
        // autres champs de CreatePublicationDto selon ta définition
        mediaurl: {
          type: 'string',
          format: 'binary',
          nullable: true,
        },
        mediaurl2: {
          type: 'string',
          format: 'binary',
          nullable: true,
        },
        mediaurl3: {
          type: 'string',
          format: 'binary',
          nullable: true,
        },
      },
      required: ['typepublication'], // adapte selon tes règles
    },
  })
  @ApiResponse({ status: 201, description: 'Publication créée avec succès.' })
  @ApiResponse({ status: 400, description: 'Requête invalide.' })
  @ApiResponse({ status: 401, description: 'Non autorisé.' })
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'mediaurl', maxCount: 1 },
        { name: 'mediaurl2', maxCount: 1 },
        { name: 'mediaurl3', maxCount: 1 },
      ],
      {
        storage: memoryStorage(),
      },
    ),
  )
  @UsePipes(new ValidationPipe({ transform: true }))
  async createPublication(
    @Body() createDto: CreatePublicationDto,
    @UploadedFiles()
    files: {
      mediaurl?: Express.Multer.File[];
      mediaurl2?: Express.Multer.File[];
      mediaurl3?: Express.Multer.File[];
    },
    @UserPayload('idmembre') idmembre: number,
  ) {
    createDto.idmembre = idmembre;
    const allFiles = [
      ...(files.mediaurl || []),
      ...(files.mediaurl2 || []),
      ...(files.mediaurl3 || []),
    ];
    return this.publicationService.createPublication(createDto, allFiles);
  }


   @Post('audio')
@ApiOperation({ summary: 'Créer une publication audio avec fichier' })
@ApiConsumes('multipart/form-data')
@ApiBody({
  description: 'Données de création de la publication audio avec fichier',
  type: CreateAudioPublicationDto,
})
@ApiResponse({ status: 201, description: 'Publication audio créée avec succès.' })
@ApiResponse({ status: 400, description: 'Requête invalide.' })
@ApiResponse({ status: 401, description: 'Non autorisé.' })
@UseInterceptors(
  FileInterceptor('mediaurl', {
    storage: memoryStorage(),
    limits: {
      fileSize: 25 * 1024 * 1024, // 25MB
    },
    fileFilter: (req, file, cb) => {
      if (file.mimetype.match(/\/(mp3|m4a|aac)$/)) {
        cb(null, true);
      } else {
        cb(new Error('Type de fichier audio non supporté'), false);
      }
    }
  }),
)
@UsePipes(new ValidationPipe({ transform: true }))
async createAudioPublication(
  @Body() createDto: CreateAudioPublicationDto,
  @UploadedFile() file: Express.Multer.File, // Correction ici (singulier)
  @UserPayload('idmembre') idmembre: number,
) {
  createDto.idmembre = idmembre;
  return this.publicationService.createAudioPublication(createDto, file);
}
}
