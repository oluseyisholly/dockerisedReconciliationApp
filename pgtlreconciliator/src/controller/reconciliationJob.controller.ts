import {
  Body,
  Controller,
  Get,
 
  Param,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { SwaggerApiEnumTags } from '../common/index.enum';
import {
  CreateReconciliationJobDto,
  ReconciliationJobFilterDto,
} from 'src/dtos/reconciliationJob.dto';
import { ReconciliationJobService } from 'src/services/reconciliationJob.service';
import { PaginatedRecordsDto, PaginationDto } from 'src/dtos/pagination.dto';
import { ReconciliationJob } from 'src/entities/reconciliationJob.entity';
import {
  FilesTypes,
  ReconciliationreturnType,
  StandardResopnse,
} from 'src/common';
import {
  FileFieldsInterceptor,
} from '@nestjs/platform-express';
import { fileMulterOptions } from 'src/common/mutler.config';
import { ReconciliationFileParamDto } from 'src/dtos/reconciliationFile.dto';

@Controller('reconcile')
@ApiTags(SwaggerApiEnumTags.ReconciliationJob)
@ApiBearerAuth()
export class ReconciliationJobController {
  constructor(
    private readonly ReconciliationJobService: ReconciliationJobService,
  ) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'upload1', maxCount: 1 },
        { name: 'upload2', maxCount: 1 },
      ],
      fileMulterOptions,
    ),
  )
  @ApiConsumes('multipart/form-data')
  createReconciliationJob(
    @Body() createReconciliationJobDto: CreateReconciliationJobDto,
    @UploadedFiles()
    files: FilesTypes,
  ): Promise<StandardResopnse<ReconciliationJob>> {

    return this.ReconciliationJobService.createReconciliationJob(
      createReconciliationJobDto,
      files,
    );
  }

  @Get()
  findAllReconciliationJob(
    @Query() paginationDto: PaginationDto,
    @Query() reconciliationJobFilterDto: ReconciliationJobFilterDto,
  ): Promise<StandardResopnse<PaginatedRecordsDto<ReconciliationJob>>> {
    return this.ReconciliationJobService.findReconciliationJobs(
      paginationDto,
      reconciliationJobFilterDto,
    );
  }

  @Get(':id')
  findAllReconciliationJobResult(
    @Param() reconciliationFileParamDto: ReconciliationFileParamDto,
  ): Promise<StandardResopnse<ReconciliationreturnType>> {
    return this.ReconciliationJobService.getReconciliationJobresult(
      reconciliationFileParamDto?.id,
    );
  }
}
