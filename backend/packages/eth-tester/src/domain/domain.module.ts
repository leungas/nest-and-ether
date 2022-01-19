import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { InfrastructureModule } from 'src/infrastructure/infrastructure.module';
import { AppService } from './services/app.service';
import { SchedulerService } from './services/scheduler.service';

@Module({
  imports: [InfrastructureModule, ScheduleModule.forRoot()],
  providers: [AppService, SchedulerService],
  exports: [AppService, SchedulerService],
})
export class DomainModule {}
