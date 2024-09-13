import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class ProductsService {
  constructor(@InjectConnection() private connection: Connection) {}
  private readonly logger = new Logger(ProductsService.name);

  @Cron(CronExpression.EVERY_SECOND)
  handleCron() {
    this.logger.debug('Called every second');
  }
}
