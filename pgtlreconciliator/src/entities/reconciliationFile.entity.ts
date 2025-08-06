import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Base } from './base';
import { ReconciliationJob } from './reconciliationJob.entity';

@Entity('reconciliation_files')
export class ReconciliationFile extends Base {
  @Column()
  fileName: string;

  @Column()
  path: string; // file location in disk or cloud

  @ManyToOne(() => ReconciliationJob, (job) => job.files)
  @JoinColumn({ name: 'reconciliationJobId' })
  job: ReconciliationJob;

  @Column()
  reconciliationJobId: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  uploadedAt: Date;
}
