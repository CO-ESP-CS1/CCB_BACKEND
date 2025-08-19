import { ApiProperty } from '@nestjs/swagger';

export class BadgeWithDateDto {
  @ApiProperty({ description: 'ID du badge', example: 1 })
  idbadge: number;

  @ApiProperty({ description: 'Nom du badge', example: 'Bénévole' })
  nombadge: string;

  @ApiProperty({ description: 'Description du badge', example: 'Attribué pour service', required: false, nullable: true })
  description?: string | null;

  @ApiProperty({ description: "URL de l'icône", example: 'https://..../icone.png', required: false, nullable: true })
  iconeurl?: string | null;

  @ApiProperty({ description: 'Couleur associée', example: '#ff0000', required: false, nullable: true })
  couleur?: string | null;

  @ApiProperty({ description: 'Date de création du badge', example: '2025-01-01T00:00:00.000Z' })
  createat: Date;

  @ApiProperty({ description: 'Date de mise à jour du badge', example: '2025-01-02T00:00:00.000Z' })
  updateat: Date;

  @ApiProperty({ description: "Date d'attribution du badge au membre", example: '2025-06-01T12:00:00.000Z' })
  dateattribution: Date;
}
