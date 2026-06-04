import { IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @MinLength(1)
  ancien_mot_de_passe: string;

  @IsString()
  @MinLength(6)
  nouveau_mot_de_passe: string;
}
