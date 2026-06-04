import { IsArray, ArrayMinSize, ArrayMaxSize, IsInt } from 'class-validator';

export class AddGroupMembersDto {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  @IsInt({ each: true })
  memberIds: number[];
}
