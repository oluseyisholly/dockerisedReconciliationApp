import { Column, Entity, OneToMany } from 'typeorm';
import { Base } from './base';
import { ReconciliationFile } from './reconciliationFile.entity';
import { ReconciliationJobStatusEnum } from 'src/common/index.enum';

@Entity('reconciliation_jobs')
export class ReconciliationJob extends Base {
  @Column()
  name: string; // e.g., "August Payments vs Bank Dump"

  @Column()
  jobId: string;

  @Column({ default: ReconciliationJobStatusEnum.PENDING })
  status:
    | ReconciliationJobStatusEnum.PENDING
    | ReconciliationJobStatusEnum.COMPLETED
    | ReconciliationJobStatusEnum.PROCESSING
    | ReconciliationJobStatusEnum.FAILED;

  @Column({ nullable: true })
  reportPath: string; // location of generated Excel/JSON report

  @Column({ type: 'text', nullable: true })
  errorMessage: string;

  @OneToMany(() => ReconciliationFile, (file) => file.job)
  files: ReconciliationFile[];
}
