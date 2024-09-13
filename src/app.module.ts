import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database.module';
import { ProductsService } from './products/products.service';

@Module({
  imports: [ScheduleModule.forRoot(), DatabaseModule],
  controllers: [AppController],
  providers: [AppService, ProductsService],
})
export class AppModule {}
