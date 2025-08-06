import { DeleteResult, ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { ReconciliationJob } from 'src/entities/reconciliationJob.entity';
import {
  PageInfo,
  PaginatedRecordsDto,
  PaginationDto,
} from 'src/dtos/pagination.dto';
import { ReconciliationJobFilterDto } from 'src/dtos/reconciliationJob.dto';

@Injectable() // Note: `EntityRepository` is deprecated, consider using DI with `@InjectRepository`.
export class ReconciliationJobRepository {
  constructor(
    @InjectRepository(ReconciliationJob)
    private readonly reconciliationJobRepository: Repository<ReconciliationJob>,
  ) {}

  async findById(id: number): Promise<ReconciliationJob> {
    return this.reconciliationJobRepository.findOne({ where: { id } });
  }

  async save(data: ReconciliationJob): Promise<ReconciliationJob> {
    return await this.reconciliationJobRepository.save(data);
  }

  async deleteById(id: number): Promise<DeleteResult> {
    return await this.reconciliationJobRepository.delete({ id });
  }

  async findAll(
    paginationDto: PaginationDto,
    userFilterDto: ReconciliationJobFilterDto,
  ): Promise<PaginatedRecordsDto<ReconciliationJob>> {
    const { page, per_page, sortOrder } = paginationDto;

    const where = this.buildQuery(userFilterDto);

    const [data, total] = await Promise.all([
      this.reconciliationJobRepository.find({
        where,
        order: {
          ['createdAt']: sortOrder,
        },
        skip: (page - 1) * per_page,
        take: per_page,
      }),
      this.reconciliationJobRepository.count({
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
    reconciliationJobFilterDto: ReconciliationJobFilterDto,
  ): Partial<ReconciliationJob[]> => {
    const { searchQuery } = reconciliationJobFilterDto;

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
