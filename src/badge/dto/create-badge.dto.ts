import { IsString, IsOptional } from 'class-validator';

export class CreateBadgeDto {
  @IsString()
  nombadge: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  iconeurl?: string;

  @IsOptional()
  @IsString()
  couleur?: string;
}
