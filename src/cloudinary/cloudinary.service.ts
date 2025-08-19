// src/cloudinary/cloudinary.service.ts
import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import { ConfigService } from '@nestjs/config'; // Ajout important

@Injectable()
export class CloudinaryService {
  constructor(private configService: ConfigService) {
    // Configuration de Cloudinary
    cloudinary.config({
      cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
      secure: true,
    });
  }

  async uploadImage(imagePathOrBuffer: string | Buffer): Promise<{ secure_url: string; public_id: string }> {
    return new Promise((resolve, reject) => {
      if (typeof imagePathOrBuffer === 'string') {
        cloudinary.uploader.upload(
          imagePathOrBuffer, 
          { folder: 'publications' },
          (error, result) => {
            if (error) return reject(error);
            if (!result) return reject(new Error('Upload failed'));
            resolve({
              secure_url: result.secure_url,
              public_id: result.public_id,
            });
          }
        );
      } else {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'publications' },
          (error, result) => {
            if (error) return reject(error);
            if (!result) return reject(new Error('Upload failed'));
            resolve({
              secure_url: result.secure_url,
              public_id: result.public_id,
            });
          }
        );
        const bufferStream = new Readable();
        bufferStream.push(imagePathOrBuffer);
        bufferStream.push(null);
        bufferStream.pipe(stream);
      }
    });
  }

  async uploadAudio(audioBuffer: Buffer): Promise<{ secure_url: string; public_id: string }> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'video',
          folder: 'publications/audio',
        },
        (error, result) => {
          if (error) return reject(error);
          if (!result) return reject(new Error('Audio upload failed'));
          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
          });
        }
      );

      const bufferStream = new Readable();
      bufferStream.push(audioBuffer);
      bufferStream.push(null);
      bufferStream.pipe(uploadStream);
    });
  }
}