import { Injectable, InternalServerErrorException, RequestTimeoutException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateStoryDto } from './dto/create-story.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class StoryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  private uploadWithTimeout(
    fileBufferOrPath: Buffer | string,
    timeoutMs = 10000,
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

async createStory(dto: CreateStoryDto, file?: Express.Multer.File) {
  try {
    if (!file) {
      throw new InternalServerErrorException('Media file is required');
    }

    if (dto.idmembre === undefined) {
      throw new InternalServerErrorException('idmembre must be defined');
    }

    const idmembre: number = dto.idmembre;

    const payload = file.buffer;
    if (!payload) {
      throw new InternalServerErrorException('Invalid file payload');
    }

    const uploadResult = await this.uploadWithTimeout(payload, 20000);

    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + 24);

    return await this.prisma.$transaction(async (tx) => {
      return tx.publication.create({
        data: {
          description: dto.description,
          mediaurl: uploadResult.secure_url,
          public_id: uploadResult.public_id,
          expirationdate: expirationDate,
          statutpublication: 'en_attente',
          typepublication: 'STORY',
          esttemporaire: true,
          idmembre,
        },
      });
    });
  } catch (error) {
    console.error('Erreur lors de la création de la story :', error);
    if (error instanceof RequestTimeoutException) {
      throw error;
    }
    throw new InternalServerErrorException('Impossible de créer la story');
  }
}


}
