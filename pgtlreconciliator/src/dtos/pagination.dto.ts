import { PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Enum for sort order
 */
export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

/**
 * DTO for pagination
 */
export class PaginationDto {
  @ApiPropertyOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  per_page?: number = 25;

  @ApiPropertyOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  page?: number = 1;

  // @IsString()
  // @IsOptional()
  // sortBy?: string = 'created_at';

  @ApiPropertyOptional()
  @IsEnum(SortOrder)
  @IsOptional()
  sortOrder?: SortOrder = SortOrder.DESC;
}

export class UpdatePagainationDto extends PartialType(PaginationDto) {}

/**
 * The PageInfo type is used to represent pagination data
 */
export type PageInfo = {
  total: number;
  currentPage: number;
  perPage: number;
  totalPages: number;
};

/**
 * The PaginatedRecordsDto type is used to represent paginated records
 */
export class PaginatedRecordsDto<T> {
  data: Array<T>;
  pageInfo: PageInfo;
}
