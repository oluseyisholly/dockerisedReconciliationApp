// reconciliation.processor.ts
import { Worker } from 'bullmq';
import { redisConfig } from '../redis.config';
import { parseCsv } from 'src/utils/csv_parser';
import { Transaction } from 'typeorm';
import { writeJsonFile } from 'src/utils/object_json_parser';
import { ReconciliationJobType } from 'src/common';
import AppDataSource from 'src/config/data-source';
import { ReconciliationJob } from 'src/entities/reconciliationJob.entity';
import { updateJobStatus } from './updateReconciliationJob';
import { ReconciliationJobStatusEnum } from 'src/common/index.enum';

const worker = new Worker(
  'reconciliation',
  async (job) => {
    const { fileAPath, fileBPath, name } = job.data as ReconciliationJobType;

    const fileAMap = await parseCsv(fileAPath);
    const fileBMap = await parseCsv(fileBPath);

    console.log(fileAMap, fileBMap);

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
  },
  { connection: redisConfig },
);

worker.on('active', async (job) => {
  await updateJobStatus(job.id, ReconciliationJobStatusEnum.PROCESSING);
});

// ✅ Handle job success
worker.on('completed', (job, result) => {
  updateJobStatus(job.id, ReconciliationJobStatusEnum.COMPLETED, result);
  console.log(`✅ Job ${job.id} completed.`);
  console.log('Reconciliation Report:', result);
});

// ❌ Handle job failure
worker.on('failed', (job, err) => {
  updateJobStatus(job.id, ReconciliationJobStatusEnum.FAILED);
  console.error(`❌ Job ${job?.id} failed with error:`, err);
});
