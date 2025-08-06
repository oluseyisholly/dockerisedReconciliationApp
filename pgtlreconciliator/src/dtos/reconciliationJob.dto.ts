import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseFilterDto } from './baseFilter.dto';

export class CreateReconciliationJobDto {
  @ApiProperty({
    description: 'A human-readable name for the reconciliation job',
    example: 'August POS vs Bank Report',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'File to upload',
  })
  upload1: any;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'File to upload',
  })
  upload2: any;
}

export class ReconciliationJobFilterDto extends BaseFilterDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  searchQuery?: string;
}
