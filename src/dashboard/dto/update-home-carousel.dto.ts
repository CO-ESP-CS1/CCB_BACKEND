import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class HomeCarouselSlideInputDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  @MaxLength(80)
  id: string;

  @ApiProperty()
  @IsString()
  @MaxLength(200)
  title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  subtitle?: string;

  @ApiProperty()
  @IsString()
  @MaxLength(80)
  slideName: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUrl({ require_tld: false })
  imageUrl?: string;

  @ApiProperty({ required: false, enum: ['banner1', 'banner2', 'banner3'] })
  @IsOptional()
  @IsIn(['banner1', 'banner2', 'banner3'])
  fallbackKey?: 'banner1' | 'banner2' | 'banner3';

  @ApiProperty({ description: 'Description complète sur la page détail' })
  @IsOptional()
  @IsString()
  @MaxLength(4000)
  detailDescription?: string;

  @ApiProperty({ required: false, example: '/live' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  linkRoute?: string;

  @ApiProperty({ required: false, example: 'Voir le live' })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  linkLabel?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  order?: number;
}

export class UpdateHomeCarouselDto {
  @ApiProperty({ type: [HomeCarouselSlideInputDto] })
  @IsArray()
  @ArrayMaxSize(10)
  @ValidateNested({ each: true })
  @Type(() => HomeCarouselSlideInputDto)
  slides: HomeCarouselSlideInputDto[];
}
