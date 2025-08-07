import { InjectQueue } from '@nestjs/bullmq';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Queue } from 'bullmq';
import {
  FilesTypes,
  ReconciliationreturnType,
  StandardResopnse,
} from 'src/common';
import { PaginatedRecordsDto, PaginationDto } from 'src/dtos/pagination.dto';
import {
  CreateReconciliationJobDto,
  ReconciliationJobFilterDto,
} from 'src/dtos/reconciliationJob.dto';
import { ReconciliationFile } from 'src/entities/reconciliationFile.entity';
import { ReconciliationJob } from 'src/entities/reconciliationJob.entity';
import { ReconciliationFileRepository } from 'src/repositories/reconciliationFile.repository';
import { ReconciliationJobRepository } from 'src/repositories/reconciliationJob.repository';
import { readJsonArray } from 'src/utils/json_object_parse';

@Injectable()
export class ReconciliationJobService {
  constructor(
    private reconciliationJobRepository: ReconciliationJobRepository,
    private reconciliationFileRepository: ReconciliationFileRepository,
    @InjectQueue('reconciliation') private reconciliationQueue: Queue,
  ) {}

  async createReconciliationJob(
    createReconciliationJobDto: CreateReconciliationJobDto,
    files: FilesTypes,
  ): Promise<StandardResopnse<ReconciliationJob>> {
    if (!files.upload1 || !files.upload2) {
      throw new BadRequestException('Two files are required.');
    }

    // Add job to queue
    const job = await this.reconciliationQueue.add('reconcile', {
      fileAPath: files.upload1[0].path,
      fileBPath: files.upload2[0].path,
      name: createReconciliationJobDto.name,
    });

    //create reconciliation Job
    const data = {
      name: createReconciliationJobDto.name,
      jobId: job.id,
    } as ReconciliationJob;

    const result = await this.reconciliationJobRepository.save(data);

    //create Assossiated Files
    const flleData1 = {
      fileName: files.upload1[0].filename,
      path: files.upload1[0].path,
      reconciliationJobId: result.id,
    } as ReconciliationFile;

    const flleData2 = {
      fileName: files.upload2[0].filename,
      path: files.upload2[0].path,
      reconciliationJobId: result.id,
    } as ReconciliationFile;

    await this.reconciliationFileRepository.save(flleData1);
    await this.reconciliationFileRepository.save(flleData2);

    return {
      data: null,
      code: 200,
      message: 'success',
    };
  }

  async findReconciliationJobs(
    paginationDto: PaginationDto,
    reconciliationJobFilterDto: ReconciliationJobFilterDto,
  ): Promise<StandardResopnse<PaginatedRecordsDto<ReconciliationJob>>> {
    return {
      data: await this.reconciliationJobRepository.findAll(
        paginationDto,
        reconciliationJobFilterDto,
      ),
      code: 200,
      message: 'Success',
    };
  }

  async getReconciliationJobresult(
    id: number,
  ): Promise<StandardResopnse<ReconciliationreturnType>> {
    const existingReconciliationJob =
      await this.reconciliationJobRepository.findById(id);

    if (!existingReconciliationJob) {
      throw new NotFoundException('Not Found');
    }

     if (!existingReconciliationJob.reportPath) {
      throw new NotFoundException('file not found');
    }



    const data = readJsonArray(existingReconciliationJob.reportPath);

    return {
      data,
      code: 200,
      message: 'Success',
    };
  }
}
