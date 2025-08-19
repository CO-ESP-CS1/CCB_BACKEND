import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class BadgeService {
  constructor(private readonly prisma: PrismaService) {}

  async memberHasBadge(memberId: number, badgeName: string): Promise<boolean> {
    const badge = await this.prisma.badge.findFirst({
      where: { nombadge: badgeName }
    });

    if (!badge) {
      throw new NotFoundException(`Badge '${badgeName}' introuvable`);
    }

    const memberBadge = await this.prisma.membre_badge.findUnique({
      where: {
        idmembre_idbadge: {
          idmembre: memberId,
          idbadge: badge.idbadge
        }
      }
    });

    return !!memberBadge;
  }
}