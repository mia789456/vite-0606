import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MetricsController } from './controllers/metrics.controller';
import { DashboardController } from './controllers/dashboard.controller';

@Module({
  imports: [],
  controllers: [AppController, MetricsController, DashboardController],
  providers: [AppService],
})
export class AppModule {}
