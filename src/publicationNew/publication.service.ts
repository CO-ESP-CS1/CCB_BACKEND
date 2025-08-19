// src/publication/publication.service.ts
import { Injectable, InternalServerErrorException, RequestTimeoutException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CreateAudioPublicationDto } from './dto/create-audio-publication.dto';

@Injectable()
export class PublicationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  private uploadWithTimeout(
    fileBufferOrPath: Buffer | string,
    timeoutMs = 50000,
  ): Promise<{ secure_url: string; public_id: string }> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new RequestTimeoutException('Upload Cloudinary timeout'));
      }, timeoutMs);

      this.cloudinaryService.uploadImage(fileBufferOrPath)
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

  async createPublication(dto: CreatePublicationDto, files?: Express.Multer.File[]) {
    try {
      let uploadedData: { secure_url: string; public_id: string }[] = [];

      if (files && files.length > 0) {
        // Uploads Cloudinary en parallèle avec timeout
        const uploadPromises = files.map(file => {
  const payload = file.buffer; // plus besoin de check file.path ici
  if (!payload) {
    console.warn(`Le fichier ${file.originalname} n'a pas de buffer valide`);
    return null;
  }
  return this.uploadWithTimeout(payload);
});


        uploadedData = (await Promise.all(uploadPromises.filter(Boolean))) as { secure_url: string; public_id: string }[];
      }

      // Transaction Prisma: si erreur, rollback
      return await this.prisma.$transaction(async (tx) => {
        return tx.publication.create({
          data: {
            titre: dto.titre || null,
            description: dto.description || null,

            mediaurl: uploadedData[0]?.secure_url || null,
            mediaurl2: uploadedData[1]?.secure_url || null,
            mediaurl3: uploadedData[2]?.secure_url || null,

            public_id: uploadedData[0]?.public_id || null,
            public_id2: uploadedData[1]?.public_id || null,
            public_id3: uploadedData[2]?.public_id || null,

            expirationdate: dto.expirationdate ? new Date(dto.expirationdate) : null,
            statutpublication: dto.statutpublication,
            typepublication: dto.typepublication,
            esttemporaire: dto.esttemporaire,
            idmembre: dto.idmembre,
          },
        });
      });
    } catch (error) {
      // Logger l'erreur sans planter le serveur
      console.error('Erreur lors de la création de la publication :', error);
      if (error instanceof RequestTimeoutException) {
        throw error; // Timeout spécifique Cloudinary
      }
      throw new InternalServerErrorException('Impossible de créer la publication');
    }
  }


async createAudioPublication(dto: CreateAudioPublicationDto, file?: Express.Multer.File) {
  try {
    let audioUrl: string | null = null;
    let publicId: string | null = null;

    // Upload du fichier audio s'il existe
    if (file && file.buffer) {
      try {
        const uploadedData = await this.cloudinaryService.uploadAudio(file.buffer);
        audioUrl = uploadedData.secure_url;
        publicId = uploadedData.public_id;
      } catch (uploadError) {
        console.error('Erreur lors de l\'upload audio:', uploadError);
        throw new InternalServerErrorException('Échec de l\'upload du fichier audio');
      }
    }

    // Transaction Prisma
    return await this.prisma.$transaction(async (tx) => {
      return tx.publication.create({
        data: {
          titre: dto.titre || null,
          description: dto.description || null,
          mediaurl: audioUrl,
          public_id: publicId,
          expirationdate: null, // Toujours null pour les audios
          statutpublication: dto.statutpublication,
          typepublication: 'AUDIO', // Forcé à AUDIO
          esttemporaire: dto.esttemporaire,
          idmembre: dto.idmembre,
        },
      });
    });
  } catch (error) {
    console.error('Erreur lors de la création de la publication audio :', error);
    throw new InternalServerErrorException('Impossible de créer la publication audio');
  }
}
}
