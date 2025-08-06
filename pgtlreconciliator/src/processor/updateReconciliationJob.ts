import { ReconciliationJobStatusEnum } from 'src/common/index.enum';
import AppDataSource from 'src/config/data-source';
import { ReconciliationJob } from 'src/entities/reconciliationJob.entity';

async function getJobRepo() {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  return AppDataSource.getRepository(ReconciliationJob);
}

// Helper to update job status
export async function updateJobStatus(
  jobId: string,
  status: ReconciliationJobStatusEnum,
  result: string = null,
) {
  const repo = await getJobRepo();
  const reconJob = await repo.findOneBy({ jobId });
  if (!reconJob) return;

  reconJob.status = status;
  if (status === ReconciliationJobStatusEnum.COMPLETED) {
    reconJob.reportPath = result;
  }

  await repo.save(reconJob);
}
