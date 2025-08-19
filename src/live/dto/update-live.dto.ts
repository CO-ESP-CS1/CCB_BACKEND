import { PartialType } from '@nestjs/swagger';
import { CreateLiveDto1 } from './create-live.dto';

export class UpdateLiveDto extends PartialType(CreateLiveDto1) {}
