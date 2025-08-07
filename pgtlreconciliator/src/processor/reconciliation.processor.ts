// reconciliation.processor.ts
import { Job } from 'bullmq';
import { parseCsv } from 'src/utils/csv_parser';
import { Transaction } from 'typeorm';
import { writeJsonFile } from 'src/utils/object_json_parser';
import { ReconciliationJobType } from 'src/common';
import { updateJobStatus } from './updateReconciliationJob';
import { ReconciliationJobStatusEnum } from 'src/common/index.enum';
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';

@Processor('reconciliation')
@Injectable()
export class ReconciliationProcessor extends WorkerHost {
  constructor() {
    super();
  }

  async process(job: Job<ReconciliationJobType>): Promise<string> {
    const { fileAPath, fileBPath, name } = job.data as ReconciliationJobType;

    const fileAMap = await parseCsv(fileAPath);
    const fileBMap = await parseCsv(fileBPath);

    const missingInB: Transaction[] = [];
    const missingInA: Transaction[] = [];
    const mismatchedAmount = [];
    const mismatchedStatus = [];

    for (const [id, transA] of fileAMap.entries()) {
      const transB = fileBMap.get(id);
      if (!transB) {
        missingInB.push(transA);
        continue;
      }

      if (parseFloat(transA.amount) !== parseFloat(transB.amount)) {
        mismatchedAmount.push({
          transactionId: id,
          a: transA.amount,
          b: transB.amount,
        });
      }

      if (transA.status !== transB.status) {
        mismatchedStatus.push({
          transactionId: id,
          a: transA.status,
          b: transB.status,
        });
      }

      fileBMap.delete(id);
    }

    for (const transB of fileBMap.values()) {
      missingInA.push(transB);
    }

    const report = {
      missingInB,
      missingInA,
      mismatchedAmount,
      mismatchedStatus,
    };

    return writeJsonFile(`${name} reconciliation_result.json`, report);
  }

  @OnWorkerEvent('active')
  onActive(job: Job) {
    updateJobStatus(job.id, ReconciliationJobStatusEnum.PROCESSING);
  }

  @OnWorkerEvent('completed')
  Oncompleted(job: Job,  result: any) {
    updateJobStatus(job.id, ReconciliationJobStatusEnum.COMPLETED, result);
  
    console.log(`✅ Job ${job.id} completed.`);
  }

  @OnWorkerEvent('failed')
  OnFailed(job: Job, err: any) {
    updateJobStatus(job.id, ReconciliationJobStatusEnum.FAILED);
    console.error(`❌ Job ${job?.id} failed with error:`, err);
  }
}
