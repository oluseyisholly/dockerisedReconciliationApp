import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { configService } from './config.service';
import { ReconciliationJob } from 'src/entities/reconciliationJob.entity';
import { ReconciliationFile } from 'src/entities/reconciliationFile.entity';
config();

const AppDataSource = new DataSource({
  ...configService.createTypeOrmOptions(),
  entities: [ReconciliationJob, ReconciliationFile],
} as DataSourceOptions);

export default AppDataSource;
