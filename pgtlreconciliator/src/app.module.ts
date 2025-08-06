import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from './config/config.service';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { HttpExceptionFilter } from './middleware/exception.filter';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './guards/authGuard';
import { PassportModule } from '@nestjs/passport';
import { ExternalAUthController } from './controller/facebookAuth.controller';
import { ReconciliationJobService } from './services/reconciliationJob.service';
import { ReconciliationJobRepository } from './repositories/reconciliationJob.repository';
import { ReconciliationJobController } from './controller/reconciliationJob.controller';
import { ReconciliationJob } from './entities/reconciliationJob.entity';
import { ReconciliationFileRepository } from './repositories/reconciliationFile.repository';
import { ReconciliationFile } from './entities/reconciliationFile.entity';

@Module({
  imports: [
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
  ],
})
export class AppModule {}
