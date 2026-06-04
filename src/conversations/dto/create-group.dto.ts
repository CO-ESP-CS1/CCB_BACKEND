import { IsArray, IsString, MaxLength, MinLength, ArrayMinSize, ArrayMaxSize, IsInt } from 'class-validator';

export class CreateGroupDto {
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  name: string;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(29)
  @IsInt({ each: true })
  memberIds: number[];
}
