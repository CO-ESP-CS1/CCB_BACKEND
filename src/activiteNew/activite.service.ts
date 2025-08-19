import { Injectable, InternalServerErrorException, RequestTimeoutException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateActiviteDto } from './dto/create-activite.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ActiviteService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  private uploadWithTimeout(
    fileBufferOrPath: Buffer | string,
    timeoutMs = 20000,
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

  async createActivite(createDto: CreateActiviteDto, imageFile: Express.Multer.File) {
    // Utilisation correcte de la transaction
    const result = await this.prisma.$transaction(async (prisma) => {
      try {
        // Vérification du type d'activités (conversion en entier si nécessaire)
        if (typeof createDto.idtypeactivites !== 'number') {
          createDto.idtypeactivites = parseInt(createDto.idtypeactivites as any, 10);
        }

        // Vérification de l'image avant upload
        if (imageFile) {
          console.log('Image file received:', imageFile.originalname, imageFile.mimetype); // Log pour vérifier que l'image est reçue
          if (!imageFile.mimetype.startsWith('image/')) {
            throw new BadRequestException('Le fichier doit être une image valide.');
          }

          // Upload de l'image (si présente)
          const uploadResult = await this.uploadWithTimeout(imageFile.buffer, 20000);
          console.log('Image uploaded successfully:', uploadResult); // Log pour vérifier l'URL et public_id
          
          createDto.imageurl = uploadResult.secure_url;
          createDto.public_id = uploadResult.public_id;
        } else {
          console.log('No image file provided.');
        }

        // Création de l'activité dans la base de données avec Prisma dans la transaction
        const activite = await prisma.activite.create({
          data: {
            ...createDto,
          },
        });

        return activite; // L'objet activite est retourné à la fin de la transaction
      } catch (error) {
        console.error('Erreur lors de la création de l\'activité :', error);
        throw new InternalServerErrorException('Impossible de créer l\'activité');
      }
    });

    return result; // Résultat de la transaction (l'activité créée)
  }

  async getActivitesByUserRole(
    role: string,
    idassemblee: number,
    limit: number,
    offset: number
  ) {
    // Récupère toutes les activités dont le statut est "en_cours" et qui sont destinées à l'assemblée de l'utilisateur
    const activites = await this.prisma.activite.findMany({
      where: {
        statutactivite: 'en_cours',  // Seulement les activités en cours
        OR: [
          {
            publicCible: 'TOUS',  // Public cible = TOUS : accessible à tout utilisateur
          },
          {
            publicCible: role,  // Public cible = rôle de l'utilisateur : accessible aux utilisateurs ayant ce rôle
          }
        ],
      },
      include: {
        activite_assemblee: {
          where: {
            idassemblee,  // L'activité doit être liée à l'assemblée de l'utilisateur
          }
        }
      },
    });

    // Filtrer les activités qui sont associées à l'assemblée de l'utilisateur
    const filteredActivites = activites.filter(activity => activity.activite_assemblee.length > 0);

    // Appliquer la pagination sur les résultats filtrés
    const paginatedActivites = filteredActivites.slice(offset, offset + limit);

    return paginatedActivites;
  }


     async getActivitesByAssemblee(
    idassemblee: number,
    limit: number,
    offset: number
  ) {
    const now = new Date(); // Date actuelle pour filtrer les activités expirées

    try {
      // Requête optimisée avec jointure directe
      const [totalCount, activites] = await Promise.all([
        this.prisma.activite_assemblee.count({
          where: {
            idassemblee,
            activite: {
              datefin: { gte: now }
            }
          }
        }),
        
        this.prisma.activite_assemblee.findMany({
          where: {
            idassemblee,
            activite: {
              datefin: { gte: now }
            }
          },
          skip: offset,
          take: limit,
          orderBy: {
            activite: {
              datedebut: 'desc'
            }
          },
          select: {
            dateprevue: true,
            activite: {
              include: {
                typeactivites: true
              }
            },
            assemblee: true
          }
        })
      ]);

      // Formatage des résultats
      const formattedActivites = activites.map(item => ({
        ...item.activite,
        dateprevue: item.dateprevue,
        assemblee: item.assemblee
      }));

      return {
        data: formattedActivites,
        pagination: {
          total: totalCount,
          limit,
          offset,
          hasMore: offset + limit < totalCount,
        },
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des activités:', error);
      throw new InternalServerErrorException(
        'Une erreur est survenue lors de la récupération des activités'
      );
    }
  }

  async getActivitesByDepartement(
    iddepartement: number,
    limit: number,
    offset: number
  ) {
    const now = new Date(); // Date actuelle pour filtrer les activités expirées

    try {
      // Requête optimisée avec jointure directe
      const [totalCount, activites] = await Promise.all([
        this.prisma.activite_departement.count({
          where: {
            iddepartement,
            activite: {
              datefin: { gte: now }
            }
          }
        }),
        
        this.prisma.activite_departement.findMany({
          where: {
            iddepartement,
            activite: {
              datefin: { gte: now }
            }
          },
          skip: offset,
          take: limit,
          orderBy: {
            activite: {
              datedebut: 'desc'
            }
          },
          select: {
            activite: {
              include: {
                typeactivites: true
              }
            },
            departement: true
          }
        })
      ]);

      // Formatage des résultats
      const formattedActivites = activites.map(item => ({
        ...item.activite,
        departement: item.departement
      }));

      return {
        data: formattedActivites,
        pagination: {
          total: totalCount,
          limit,
          offset,
          hasMore: offset + limit < totalCount,
        },
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des activités:', error);
      throw new InternalServerErrorException(
        'Une erreur est survenue lors de la récupération des activités'
      );
    }
  }
}
