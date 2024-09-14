import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [ScheduleModule.forRoot(), DatabaseModule, ProductsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
