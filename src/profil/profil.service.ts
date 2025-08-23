import { 
  Injectable, 
  InternalServerErrorException, 
  RequestTimeoutException,
  NotFoundException
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CreateProfilAssembleeDto } from './dto/create-profil-assemblee.dto';
import { CreateProfilDepartementDto } from './dto/create-profil-departement.dto';
import { CreateProfilPersonneDto } from './dto/create-profil-personne.dto';
import { UpdateProfilPersonneDto} from './dto/update-profil-personne.dto';
import { UpdateProfilAssembleeDto } from './dto/update-profil-assemblee.dto';
import { UpdateProfilDepartementDto } from './dto/update-profil-departement.dto';


@Injectable()
export class ProfilService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService
  ) {}

  private async uploadWithTimeout(
    file: Express.Multer.File,
    timeoutMs = 20000
  ): Promise<{ secure_url: string; public_id: string }> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new RequestTimeoutException('Upload Cloudinary timeout'));
      }, timeoutMs);

      this.cloudinary.uploadImage(file.buffer)
        .then(result => {
          clearTimeout(timer);
          resolve(result);
        })
        .catch(err => {
          clearTimeout(timer);
          reject(err);
        });
    });
  }

  private async handleImageUpload(file?: Express.Multer.File) {
    if (!file) return null;
    
    if (!file.mimetype.startsWith('image/')) {
      throw new InternalServerErrorException('Le fichier doit être une image valide');
    }

    return this.uploadWithTimeout(file);
  }

  async createAssembleeProfil(
    dto: CreateProfilAssembleeDto,
    photo?: Express.Multer.File,
    couverture?: Express.Multer.File
  ) {
    // Vérifier que l'assemblée existe
    const assemblee = await this.prisma.assemblee.findUnique({
      where: { idassemblee: dto.idassemblee }
    });
    if (!assemblee) {
      throw new NotFoundException(`Assemblée avec ID ${dto.idassemblee} introuvable`);
    }

    // Upload des images
    const [photoResult, couvertureResult] = await Promise.all([
      this.handleImageUpload(photo),
      this.handleImageUpload(couverture)
    ]);

    return this.prisma.profilassemblee.create({
      data: {
        idassemblee: dto.idassemblee,
        description: dto.description,
        photourl: photoResult?.secure_url || null,
        couvertureurl: couvertureResult?.secure_url || null
      }
    });
  }

  async createDepartementProfil(
    dto: CreateProfilDepartementDto,
    photo?: Express.Multer.File,
    couverture?: Express.Multer.File
  ) {
    // Vérifier que le département existe
    const departement = await this.prisma.departement.findUnique({
      where: { iddepartement: dto.iddepartement }
    });
    if (!departement) {
      throw new NotFoundException(`Département avec ID ${dto.iddepartement} introuvable`);
    }

    // Upload des images
    const [photoResult, couvertureResult] = await Promise.all([
      this.handleImageUpload(photo),
      this.handleImageUpload(couverture)
    ]);

    return this.prisma.profildepartement.create({
      data: {
        iddepartement: dto.iddepartement,
        description: dto.description,
        photourl: photoResult?.secure_url || null,
        couvertureurl: couvertureResult?.secure_url || null
      }
    });
  }


   async createPersonneProfil(
    dto: CreateProfilPersonneDto,
    photo?: Express.Multer.File,
    couverture?: Express.Multer.File
  ) {
    // Vérifier que la personne existe
    const personne = await this.prisma.personne.findUnique({
      where: { idpersonne: dto.idpersonne }
    });
    if (!personne) {
      throw new NotFoundException(`Personne avec ID ${dto.idpersonne} introuvable`);
    }

    // Upload des images
    const [photoResult, couvertureResult] = await Promise.all([
      this.handleImageUpload(photo),
      this.handleImageUpload(couverture)
    ]);

    return this.prisma.profilpersonne.create({
      data: {
        idpersonne: dto.idpersonne,
        description: dto.description,
        adresse: dto.adresse,
        photourl: photoResult?.secure_url || null,
        couvertureurl: couvertureResult?.secure_url || null
      }
    });
  }


async getProfilPersonneByIdPersonne(idpersonne: number) {
  // Vérifier que la personne existe
  const personne = await this.prisma.personne.findUnique({
    where: { idpersonne },
  });

  if (!personne) {
    throw new NotFoundException(`Personne avec ID ${idpersonne} introuvable`);
  }

  // Récupérer le profil lié à cette personne
  const profil = await this.prisma.profilpersonne.findUnique({
    where: { idpersonne },
  });

  if (!profil) {
    throw new NotFoundException(`Profil pour la personne ID ${idpersonne} introuvable`);
  }

  return profil;
}


   async updatePersonneProfil(
    id: number,
    dto: UpdateProfilPersonneDto,
    photo?: Express.Multer.File,
    couverture?: Express.Multer.File
  ) {
    // Vérifier que le profil existe
    const existingProfil = await this.prisma.profilpersonne.findUnique({
      where: { idprofilpersonne: id }
    });
    
    if (!existingProfil) {
      throw new NotFoundException(`Profil personne avec ID ${id} introuvable`);
    }

    // Upload des nouvelles images si fournies
    const [photoResult, couvertureResult] = await Promise.all([
      photo ? this.handleImageUpload(photo) : Promise.resolve(null),
      couverture ? this.handleImageUpload(couverture) : Promise.resolve(null)
    ]);

    return this.prisma.profilpersonne.update({
      where: { idprofilpersonne: id },
      data: {
        description: dto.description,
        adresse: dto.adresse,
        photourl: photoResult?.secure_url ?? existingProfil.photourl,
        couvertureurl: couvertureResult?.secure_url ?? existingProfil.couvertureurl
      }
    });
  }

  async updateAssembleeProfil(
    id: number,
    dto: UpdateProfilAssembleeDto,
    photo?: Express.Multer.File,
    couverture?: Express.Multer.File
  ) {
    // Vérifier que le profil existe
    const existingProfil = await this.prisma.profilassemblee.findUnique({
      where: { idprofilassemblee: id }
    });
    
    if (!existingProfil) {
      throw new NotFoundException(`Profil assemblée avec ID ${id} introuvable`);
    }

    // Upload des nouvelles images
    const [photoResult, couvertureResult] = await Promise.all([
      photo ? this.handleImageUpload(photo) : Promise.resolve(null),
      couverture ? this.handleImageUpload(couverture) : Promise.resolve(null)
    ]);

    return this.prisma.profilassemblee.update({
      where: { idprofilassemblee: id },
      data: {
        description: dto.description,
        photourl: photoResult?.secure_url ?? existingProfil.photourl,
        couvertureurl: couvertureResult?.secure_url ?? existingProfil.couvertureurl
      }
    });
  }

  async updateDepartementProfil(
    id: number,
    dto: UpdateProfilDepartementDto,
    photo?: Express.Multer.File,
    couverture?: Express.Multer.File
  ) {
    // Vérifier que le profil existe
    const existingProfil = await this.prisma.profildepartement.findUnique({
      where: { idprofildepartement: id }
    });
    
    if (!existingProfil) {
      throw new NotFoundException(`Profil département avec ID ${id} introuvable`);
    }

    // Upload des nouvelles images
    const [photoResult, couvertureResult] = await Promise.all([
      photo ? this.handleImageUpload(photo) : Promise.resolve(null),
      couverture ? this.handleImageUpload(couverture) : Promise.resolve(null)
    ]);

    return this.prisma.profildepartement.update({
      where: { idprofildepartement: id },
      data: {
        description: dto.description,
        photourl: photoResult?.secure_url ?? existingProfil.photourl,
        couvertureurl: couvertureResult?.secure_url ?? existingProfil.couvertureurl
      }
    });
  }
}