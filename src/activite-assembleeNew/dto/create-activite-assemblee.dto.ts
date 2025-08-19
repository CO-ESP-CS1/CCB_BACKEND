import { IsArray, IsInt, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateActiviteAssembleeDto {
  @ApiProperty({
    description: 'ID de l\'activité à lier avec les assemblées',
    example: 1,
  })
  @IsInt()
  idactivite: number;

  @ApiProperty({
    description: 'ID de l\'assemblée ou une liste d\'ID d\'assemblées auxquelles l\'activité doit être associée',
    example: [1, 2],
    isArray: true,  // Cette option définit que le champ est un tableau
  })
  @IsArray()
  @IsInt({ each: true })
  idassemblees: number[];
}
