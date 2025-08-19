import { ApiProperty } from '@nestjs/swagger';

export class ProfilPersonneDto {
  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false })
  adresse?: string;

  @ApiProperty({ required: false })
  photourl?: string;

  @ApiProperty({ required: false })
  couvertureurl?: string;
}

export class PersonneDto {
  @ApiProperty()
  nom: string;

  @ApiProperty()
  prenom: string;

  @ApiProperty()
  telephone: string;

  @ApiProperty({ required: false })
  email?: string;

  @ApiProperty({ required: false })
  sexe?: string;

  @ApiProperty({ required: false, type: Date })
  datenaissance?: Date;

  @ApiProperty({ type: [ProfilPersonneDto] })
  profilpersonne: ProfilPersonneDto[];
}

export class MembreDto {
  @ApiProperty()
  idmembre: number;

  @ApiProperty({ required: false })
  codemembre?: string;

  @ApiProperty({ required: false, type: Number, format: 'decimal' })
  solde?: number;

  @ApiProperty()
  role: string;

  @ApiProperty()
  idassemblee: number;

  @ApiProperty({ type: PersonneDto })
  personne: PersonneDto;
}
