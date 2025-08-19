import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class AssignBadgeDto {
  @ApiProperty({ 
    description: 'ID du membre à qui attribuer le badge',
    example: 123
  })
  @IsInt()
  idmembre: number;

  @ApiProperty({
    description: 'Nom du rôle correspondant au badge à attribuer',
    example: 'diacre',
    enum: ['pasteur', 'membre', 'apotre', 'diacre', 'ancien', 'patriarche']
  })
  @IsString()
  roleName: string;
}