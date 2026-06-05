// src/cloudinary/cloudinary.service.ts
import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import { randomUUID } from 'crypto';
import { ConfigService } from '@nestjs/config';

function randomToken(): string {
  return randomUUID().replace(/-/g, '').slice(0, 16);
}

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

  async uploadImage(
    imagePathOrBuffer: string | Buffer,
    folder = 'publications',
  ): Promise<{ secure_url: string; public_id: string }> {
    return new Promise((resolve, reject) => {
      if (typeof imagePathOrBuffer === 'string') {
        cloudinary.uploader.upload(
          imagePathOrBuffer, 
          { folder },
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
          { folder },
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

  async uploadPdf(
    pdfBuffer: Buffer,
    folder = 'assembly-formations',
    filename = 'formation.pdf',
  ): Promise<{ secure_url: string; public_id: string; view_url: string }> {
    const safeFilename = filename.toLowerCase().endsWith('.pdf')
      ? filename
      : `${filename.replace(/[^a-zA-Z0-9._-]/g, '_')}.pdf`;
    const publicId = randomToken();

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'raw',
          folder,
          public_id: publicId,
        },
        (error, result) => {
          if (error) return reject(error);
          if (!result) return reject(new Error('PDF upload failed'));

          const viewUrl = result.secure_url;

          const downloadUrl = cloudinary.url(result.public_id, {
            resource_type: 'raw',
            secure: true,
            flags: `attachment:${safeFilename}`,
          });

          resolve({
            secure_url: downloadUrl,
            public_id: result.public_id,
            view_url: viewUrl,
          });
        },
      );

      const bufferStream = new Readable();
      bufferStream.push(pdfBuffer);
      bufferStream.push(null);
      bufferStream.pipe(uploadStream);
    });
  }

  async deleteRawAsset(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
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