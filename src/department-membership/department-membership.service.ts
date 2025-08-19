import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DepartmentMembershipService {
  constructor(private readonly prisma: PrismaService) {}

  async isMemberInDepartment(
    memberId: number,
    departmentIdentifier: { id?: number; name?: string }
  ): Promise<boolean> {
    // Valider qu'au moins un identifiant est fourni
    if (!departmentIdentifier.id && !departmentIdentifier.name) {
      throw new Error('Department ID or name must be provided');
    }

    let departmentId = departmentIdentifier.id;

    // Si seul le nom est fourni, trouver l'ID du département
    if (!departmentId && departmentIdentifier.name) {
      const department = await this.prisma.departement.findFirst({
        where: { nomdepartement: departmentIdentifier.name },
        select: { iddepartement: true }
      });

      if (!department) return false;
      departmentId = department.iddepartement;
    }

    // Vérifier que departmentId est bien défini à ce stade
    if (!departmentId) {
      return false;
    }

    // Vérifier l'appartenance dans la table pivot "est"
    const membership = await this.prisma.est.findUnique({
      where: {
        idmembre_iddepartement: {
          idmembre: memberId,
          iddepartement: departmentId, // Maintenant garanti d'être un number
        }
      }
    });

    return !!membership;
  }
}