import { Injectable, InternalServerErrorException, RequestTimeoutException, BadRequestException, ConflictException,  ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAnnonceDto } from './dto/create-annonceNew.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { annonce, assemblee, departement } from '@prisma/client';  // Assurez-vous d'importer les types nécessaires

@Injectable()
export class AnnonceService {
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

  async createAnnonce(createDto: CreateAnnonceDto, files?: Express.Multer.File[]) {
    let uploadedData: { secure_url: string; public_id: string }[] = [];

    try {
      // 1. Upload des fichiers vers Cloudinary
      if (files && files.length > 0) {
        try {
          console.log('Fichiers reçus pour upload:', files);
          const uploadPromises = files.map((file, index) => {
            console.log(`Traitement du fichier ${index + 1}:`, file.originalname);
            const payload = file.buffer;
            if (!payload) {
              console.warn(`Le fichier ${file.originalname} n'a pas de buffer valide`);
              return null;
            }

            return this.uploadWithTimeout(payload)
              .then(result => {
                console.log(`Fichier ${file.originalname} uploadé avec succès:`, result);
                return result;
              })
              .catch(err => {
                console.error(`Erreur lors de l'upload du fichier ${file.originalname}:`, err);
                throw err;
              });
          });

          uploadedData = (await Promise.all(uploadPromises.filter(Boolean))) as { secure_url: string; public_id: string }[];
          console.log('Données uploadées sur Cloudinary:', uploadedData);
        } catch (uploadError) {
          throw new InternalServerErrorException('Erreur lors de l\'upload des fichiers.');
        }
      } else {
        console.log('Aucun fichier reçu pour upload.');
      }

      // 2. Création de l'annonce sans ajouter les associations
      let annonce;
      try {
        console.log('Création de l\'annonce avec les données suivantes :', createDto);
        annonce = await this.prisma.annonce.create({
          data: {
            titreannonce: createDto.titreannonce ?? null,
            descriptionannonce: createDto.descriptionannonce ?? null,
            imageurl: uploadedData[0]?.secure_url ?? null,
            priorite: createDto.priorite,
            statutannonce: createDto.statutannonce,
            publique_cible: createDto.publique_cible ?? null,
            idmembre: createDto.idmembre!,  // Assure-toi que idmembre est toujours présent dans createDto
            idtypeannonce: createDto.idtypeannonce!,
            datepublication: new Date(),  // Ajout de la date de publication pour l'annonce
          },
        });
        console.log('Annonce créée avec succès:', annonce);
      } catch (createError) {
        throw new InternalServerErrorException('Impossible de créer l\'annonce.');
      }

      // 3. Vérification des doublons dans les associations
      try {
        for (const idassemblee of createDto.idassemblees || []) {
          const existingAnnonceAssemblee = await this.prisma.annonce_assemblee.findFirst({
            where: {
              idassemblee: idassemblee,
              idannonce: annonce.idannonce,  // Utilise l'ID généré
            },
          });

          if (existingAnnonceAssemblee) {
            const assembleeDetails = await this.prisma.assemblee.findUnique({
              where: { idassemblee: idassemblee },
            });
            throw new ConflictException(`Cette annonce est déjà associée à l'assemblée "${assembleeDetails?.nomassemble}" avec l'ID ${idassemblee}.`);
          }
        }

        for (const iddepartement of createDto.iddepartements || []) {
          const existingAnnonceDepartement = await this.prisma.annonce_departement.findFirst({
            where: {
              iddepartement: iddepartement,
              idannonce: annonce.idannonce,  // Utilise l'ID généré
            },
          });

          if (existingAnnonceDepartement) {
            const departementDetails = await this.prisma.departement.findUnique({
              where: { iddepartement: iddepartement },
            });
            throw new ConflictException(`Cette annonce est déjà associée au département "${departementDetails?.nomdepartement}" avec l'ID ${iddepartement}.`);
          }
        }
      } catch (verificationError) {
        throw new ConflictException(verificationError.message);
      }

      // 4. Création des associations après la vérification des doublons
      try {
        await this.prisma.annonce_assemblee.createMany({
          data: (createDto.idassemblees ?? []).map(id => ({
            idassemblee: id,
            idannonce: annonce.idannonce,
          })),
        });

        await this.prisma.annonce_departement.createMany({
          data: (createDto.iddepartements ?? []).map(id => ({
            iddepartement: id,
            idannonce: annonce.idannonce,
          })),
        });
      } catch (associationError) {
        throw new InternalServerErrorException('Erreur lors de l\'association de l\'annonce aux départements ou assemblées.');
      }

      return annonce;

    } catch (error) {
      console.error('Erreur lors de la création de l\'annonce :', error);
      throw error instanceof InternalServerErrorException
        ? error
        : new InternalServerErrorException('Impossible de créer l\'annonce. Veuillez réessayer.');
    }
  }
async getAnnoncesForUser(user: any, page: number, limit: number) {
    console.log('Début de la récupération des annonces pour l\'utilisateur', user.idmembre);

    // Validation des données du token
    if (!user.idassemblee) {
        throw new BadRequestException("L'ID d'assemblée est manquant dans le token");
    }
    if (!user.idmembre) {
        throw new BadRequestException("L'ID membre est manquant dans le token");
    }

    // Conversion de l'ID assemblée
    const idAssemblee = Number(user.idassemblee);
    if (isNaN(idAssemblee)) {
        throw new BadRequestException(`ID d'assemblée invalide : ${user.idassemblee}`);
    }

    // 1. Récupérer les départements du membre depuis la table 'est'
    const userDepartements = await this.prisma.est.findMany({
        where: { 
            idmembre: Number(user.idmembre) 
        },
        select: { 
            iddepartement: true 
        }
    });

    // Extraire les IDs de départements
    const idDepartements = userDepartements.map(d => d.iddepartement);
    console.log(`Départements associés au membre ${user.idmembre}:`, idDepartements);

    // 2. Récupérer les annonces de l'assemblée et des départements
    const [annoncesAssemblee, annoncesDepartement] = await Promise.all([
        // Annonces de l'assemblée
        this.prisma.annonce_assemblee.findMany({
            where: { idassemblee: idAssemblee },
            include: { 
                annonce: {
                    select: {
                        idannonce: true,
                        titreannonce: true,
                        descriptionannonce: true,
                        imageurl: true,
                        priorite: true,
                        statutannonce: true,
                        publique_cible: true,
                        idmembre: true,
                        idtypeannonce: true,
                        createat: true, // On s'assure de récupérer ce champ
                        datepublication: true
                    }
                } 
            },
        }),
        
        // Annonces des départements du membre
        idDepartements.length > 0 
            ? this.prisma.annonce_departement.findMany({
                where: { iddepartement: { in: idDepartements } },
                include: { 
                    annonce: {
                        select: {
                            idannonce: true,
                            titreannonce: true,
                            descriptionannonce: true,
                            imageurl: true,
                            priorite: true,
                            statutannonce: true,
                            publique_cible: true,
                            idmembre: true,
                            idtypeannonce: true,
                            createat: true, // On s'assure de récupérer ce champ
                            datepublication: true
                        }
                    } 
                },
            })
            : Promise.resolve([])
    ]);

    console.log(`Annonces assemblée: ${annoncesAssemblee.length}, Annonces département: ${annoncesDepartement.length}`);

    // 3. Fusionner les annonces (éviter les doublons)
    const annoncesMap = new Map<number, any>();
    
    const addAnnonce = (item: any, source: string) => {
        const annonce = item.annonce;
        if (!annoncesMap.has(annonce.idannonce)) {
            annoncesMap.set(annonce.idannonce, {
                ...annonce,
                sourceType: source
            });
        }
    };

    // Ajouter les annonces de l'assemblée
    annoncesAssemblee.forEach(item => addAnnonce(item, 'assemblee'));
    
    // Ajouter les annonces des départements
    annoncesDepartement.forEach(item => addAnnonce(item, 'departement'));

    const toutesAnnonces = Array.from(annoncesMap.values());
    if (toutesAnnonces.length === 0) {
        console.log("Aucune annonce trouvée pour l'utilisateur");
        return {
            total: 0,
            annonces: [],
            page,
            limit,
            totalPages: 0
        };
    }

    // 4. Filtrage adapté par type d'annonce
    const annoncesFiltrees = toutesAnnonces.filter(annonce => {
        // Annonces de département: toujours accessibles
        if (annonce.sourceType === 'departement') {
            return true;
        }
        
        // Annonces d'assemblée: filtrer par public cible
        if (annonce.sourceType === 'assemblee') {
            const isPublic = annonce.publique_cible === 'TOUS';
            const matchesRole = user.role ? annonce.publique_cible === user.role : false;
            return isPublic || matchesRole;
        }
        
        return false;
    });

    // 5. Trier par createat (du plus récent au plus ancien)
    annoncesFiltrees.sort((a, b) => {
        return new Date(b.createat).getTime() - new Date(a.createat).getTime();
    });

    // 6. Récupérer les consultations de l'utilisateur
    const annonceIds = annoncesFiltrees.map(a => a.idannonce);
    const consultations = await this.prisma.consultation_annonce.findMany({
        where: {
            idmembre: Number(user.idmembre),
            idannonce: { in: annonceIds }
        },
        select: {
            idannonce: true
        }
    });

    // Créer un Set des IDs des annonces consultées
    const annoncesConsultees = new Set(consultations.map(c => c.idannonce));

    // 7. Ajouter l'indicateur de consultation à chaque annonce
    const annoncesAvecConsultation = annoncesFiltrees.map(annonce => ({
        ...annonce,
        consulte: annoncesConsultees.has(annonce.idannonce)
    }));

    // 8. Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = Math.min(startIndex + limit, annoncesAvecConsultation.length);
    const annoncesPaginees = annoncesAvecConsultation.slice(startIndex, endIndex);

    // 9. Calcul des métadonnées de pagination
    const total = annoncesAvecConsultation.length;
    const totalPages = Math.ceil(total / limit);

    console.log(`Résultats paginés: page ${page}/${totalPages} (${annoncesPaginees.length}/${total} annonces)`);
    
    return {
        total,
        annonces: annoncesPaginees,
        page,
        limit,
        totalPages
    };
}
}
