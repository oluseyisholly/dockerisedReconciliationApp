import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseFilterDto } from './baseFilter.dto';

export class CreateReconciliationFileDto {
  @ApiProperty({
    description: 'A human-readable name for the reconciliation File',
    example: 'August POS vs Bank Report',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'File to upload',
  })
  upload: any;
}

export class ReconciliationFileFilterDto extends BaseFilterDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  searchQuery?: string;
}

export class ReconciliationFileParamDto {
  @ApiProperty()
  @IsNotEmpty()
  id: number;
}
