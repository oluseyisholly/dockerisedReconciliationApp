import { DeleteResult, ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { ReconciliationFile } from 'src/entities/reconciliationFile.entity';
import {
  PageInfo,
  PaginatedRecordsDto,
  PaginationDto,
} from 'src/dtos/pagination.dto';
import { ReconciliationFileFilterDto } from 'src/dtos/reconciliationFile.dto';

@Injectable() // Note: `EntityRepository` is deprecated, consider using DI with `@InjectRepository`.
export class ReconciliationFileRepository {
  constructor(
    @InjectRepository(ReconciliationFile)
    private readonly reconciliationFileRepository: Repository<ReconciliationFile>,
  ) {}

  async findById(id: number): Promise<ReconciliationFile> {
    return this.reconciliationFileRepository.findOne({ where: { id } });
  }

  async save(data: ReconciliationFile): Promise<ReconciliationFile> {
    return await this.reconciliationFileRepository.save(data);
  }

  async deleteById(id: number): Promise<DeleteResult> {
    return await this.reconciliationFileRepository.delete({ id });
  }

  async findAll(
    paginationDto: PaginationDto,
    userFilterDto: ReconciliationFileFilterDto,
  ): Promise<PaginatedRecordsDto<ReconciliationFile>> {
    const { page, per_page, sortOrder } = paginationDto;

    const where = this.buildQuery(userFilterDto);

    const [data, total] = await Promise.all([
      this.reconciliationFileRepository.find({
        where,
        order: {
          ['createdAt']: sortOrder,
        },
        skip: (page - 1) * per_page,
        take: per_page,
      }),
      this.reconciliationFileRepository.count({
        where,
      }),
    ]);

    const totalPages = Math.ceil(total / per_page);
    const pageInfo: PageInfo = {
      total,
      currentPage: page,
      perPage: per_page,
      totalPages,
    };

    return {
      data,
      pageInfo,
    };
  }

  // Add other custom methods as needed

  private buildQuery = (
    reconciliationFileFilterDto: ReconciliationFileFilterDto,
  ): Partial<ReconciliationFile[]> => {
    const { searchQuery } = reconciliationFileFilterDto;

    let where = [];

    if (searchQuery) {
      where = [
        {
          name: ILike(`%${searchQuery}%`),
        },
        // {
        //   ifavailable: ILike(`%${searchQuery}%`),
        // },
      ];
    }

    return where;
  };
}
