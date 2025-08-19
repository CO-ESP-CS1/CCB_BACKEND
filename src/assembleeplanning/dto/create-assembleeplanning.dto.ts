import { IsInt } from 'class-validator';

export class CreateAssembleePlanningDto {
  @IsInt()
  idassemblee: number;

  @IsInt()
  idplanning: number;
}
