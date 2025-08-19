import { 
  Controller, 
  Post, 
  UseInterceptors, 
  UploadedFiles, 
  Body, 
  BadRequestException, ParseIntPipe, Patch, Param 
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ProfilService } from './profil.service';
import { CreateProfilAssembleeDto } from './dto/create-profil-assemblee.dto';
import { CreateProfilDepartementDto } from './dto/create-profil-departement.dto';
import { ApiTags, ApiConsumes, ApiBody, ApiResponse } from '@nestjs/swagger';
import { memoryStorage } from 'multer';
import { CreateProfilPersonneDto } from './dto/create-profil-personne.dto';
import { UpdateProfilPersonneDto} from './dto/update-profil-personne.dto';
import { UpdateProfilAssembleeDto } from './dto/update-profil-assemblee.dto';
import { UpdateProfilDepartementDto } from './dto/update-profil-departement.dto';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

@ApiTags('profils')
@Controller('profils')
export class ProfilController {
  constructor(private readonly profilService: ProfilService) {}

  @Post('assemblee')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files', 2, {
    storage: memoryStorage(),
    limits: { fileSize: MAX_FILE_SIZE },
  }))
  @ApiBody({
    description: 'Créer un profil pour une assemblée',
    schema: {
      type: 'object',
      properties: {
        idassemblee: { type: 'number' },
        description: { type: 'string', nullable: true },
        photo: { type: 'string', format: 'binary' },
        couverture: { type: 'string', format: 'binary' }
      }
    }
  })
  @ApiResponse({ status: 201, description: 'Profil assemblée créé' })
  @ApiResponse({ status: 400, description: 'Requête invalide' })
  @ApiResponse({ status: 404, description: 'Assemblée introuvable' })
  async createAssembleeProfil(
    @Body() dto: CreateProfilAssembleeDto,
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    try {
      const [photo, couverture] = files || [];
      return this.profilService.createAssembleeProfil(dto, photo, couverture);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('departement')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files', 2, {
    storage: memoryStorage(),
    limits: { fileSize: MAX_FILE_SIZE },
  }))
  @ApiBody({
    description: 'Créer un profil pour un département',
    schema: {
      type: 'object',
      properties: {
        iddepartement: { type: 'number' },
        description: { type: 'string', nullable: true },
        photo: { type: 'string', format: 'binary' },
        couverture: { type: 'string', format: 'binary' }
      }
    }
  })
  @ApiResponse({ status: 201, description: 'Profil département créé' })
  @ApiResponse({ status: 400, description: 'Requête invalide' })
  @ApiResponse({ status: 404, description: 'Département introuvable' })
  async createDepartementProfil(
    @Body() dto: CreateProfilDepartementDto,
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    try {
      const [photo, couverture] = files || [];
      return this.profilService.createDepartementProfil(dto, photo, couverture);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }


  @Post('personne')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files', 2, {
    storage: memoryStorage(),
    limits: { fileSize: MAX_FILE_SIZE },
  }))
  @ApiBody({
    description: 'Créer un profil pour une personne',
    schema: {
      type: 'object',
      properties: {
        idpersonne: { type: 'number' },
        description: { type: 'string', nullable: true },
        adresse: { type: 'string', nullable: true },
        photo: { type: 'string', format: 'binary' },
        couverture: { type: 'string', format: 'binary' }
      }
    }
  })
  @ApiResponse({ status: 201, description: 'Profil personne créé' })
  @ApiResponse({ status: 400, description: 'Requête invalide' })
  @ApiResponse({ status: 404, description: 'Personne introuvable' })
  async createPersonneProfil(
    @Body() dto: CreateProfilPersonneDto,
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    try {
      const [photo, couverture] = files || [];
      return this.profilService.createPersonneProfil(dto, photo, couverture);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }



  @Patch('personne/:id')
@ApiConsumes('multipart/form-data')
@UseInterceptors(FilesInterceptor('files', 2, {
  storage: memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
}))
@ApiBody({
  description: 'Mettre à jour un profil personne',
  schema: {
    type: 'object',
    properties: {
      description: { type: 'string', nullable: true },
      adresse: { type: 'string', nullable: true },
      photo: { type: 'string', format: 'binary' },
      couverture: { type: 'string', format: 'binary' }
    }
  }
})
@ApiResponse({ status: 200, description: 'Profil personne mis à jour' })
@ApiResponse({ status: 400, description: 'Requête invalide' })
@ApiResponse({ status: 404, description: 'Profil introuvable' })
async updatePersonneProfil(
  @Param('id', ParseIntPipe) id: number,
  @Body() dto: UpdateProfilPersonneDto,
  @UploadedFiles() files: Express.Multer.File[]
) {
  try {
    const [photo, couverture] = files || [];
    return this.profilService.updatePersonneProfil(id, dto, photo, couverture);
  } catch (error) {
    throw new BadRequestException(error.message);
  }
}

@Patch('assemblee/:id')
@ApiConsumes('multipart/form-data')
@UseInterceptors(FilesInterceptor('files', 2, {
  storage: memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
}))
@ApiBody({
  description: 'Mettre à jour un profil assemblée',
  schema: {
    type: 'object',
    properties: {
      description: { type: 'string', nullable: true },
      photo: { type: 'string', format: 'binary' },
      couverture: { type: 'string', format: 'binary' }
    }
  }
})
@ApiResponse({ status: 200, description: 'Profil assemblée mis à jour' })
@ApiResponse({ status: 400, description: 'Requête invalide' })
@ApiResponse({ status: 404, description: 'Profil introuvable' })
async updateAssembleeProfil(
  @Param('id', ParseIntPipe) id: number,
  @Body() dto: UpdateProfilAssembleeDto,
  @UploadedFiles() files: Express.Multer.File[]
) {
  try {
    const [photo, couverture] = files || [];
    return this.profilService.updateAssembleeProfil(id, dto, photo, couverture);
  } catch (error) {
    throw new BadRequestException(error.message);
  }
}

@Patch('departement/:id')
@ApiConsumes('multipart/form-data')
@UseInterceptors(FilesInterceptor('files', 2, {
  storage: memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
}))
@ApiBody({
  description: 'Mettre à jour un profil département',
  schema: {
    type: 'object',
    properties: {
      description: { type: 'string', nullable: true },
      photo: { type: 'string', format: 'binary' },
      couverture: { type: 'string', format: 'binary' }
    }
  }
})
@ApiResponse({ status: 200, description: 'Profil département mis à jour' })
@ApiResponse({ status: 400, description: 'Requête invalide' })
@ApiResponse({ status: 404, description: 'Profil introuvable' })
async updateDepartementProfil(
  @Param('id', ParseIntPipe) id: number,
  @Body() dto: UpdateProfilDepartementDto,
  @UploadedFiles() files: Express.Multer.File[]
) {
  try {
    const [photo, couverture] = files || [];
    return this.profilService.updateDepartementProfil(id, dto, photo, couverture);
  } catch (error) {
    throw new BadRequestException(error.message);
  }
}
}