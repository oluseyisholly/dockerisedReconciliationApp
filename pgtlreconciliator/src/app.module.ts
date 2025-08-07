import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from './config/config.service';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './middleware/exception.filter';
import { JwtModule } from '@nestjs/jwt';
import { ReconciliationJobService } from './services/reconciliationJob.service';
import { ReconciliationJobRepository } from './repositories/reconciliationJob.repository';
import { ReconciliationJobController } from './controller/reconciliationJob.controller';
import { ReconciliationJob } from './entities/reconciliationJob.entity';
import { ReconciliationFileRepository } from './repositories/reconciliationFile.repository';
import { ReconciliationFile } from './entities/reconciliationFile.entity';
import { ReconciliationProcessor } from './processor/reconciliation.processor';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
      },
    }),
    BullModule.registerQueue({
      name: 'reconciliation',
    }),
    TypeOrmModule.forRoot(configService.createTypeOrmOptions()),
    TypeOrmModule.forFeature([ReconciliationJob, ReconciliationFile]),
    JwtModule.register({
      global: true,
      secret: 'value',
      signOptions: { expiresIn: '600000s' },
    }),
  ],
  controllers: [AppController, ReconciliationJobController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthGuard,
    // },

    AppService,
    ReconciliationJobService,
    ReconciliationJobRepository,
    ReconciliationFileRepository,
    ReconciliationProcessor,
  ],
})
export class AppModule {}
