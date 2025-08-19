import { PartialType } from '@nestjs/swagger';
import { CreateActiviteDto1 } from './create-activite.dto';
import { IsInt, IsOptional } from 'class-validator';

export class UpdateActiviteDto extends PartialType(CreateActiviteDto1) {
  @IsOptional()
  @IsInt()
  idtypeactivites?: number; // doit être optionnel pour Prisma
}
