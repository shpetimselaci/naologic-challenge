import { ConfigModule } from '@nestjs/config';
import databaseConfig from './config/database.config';
import { Module } from '@nestjs/common';

@Module({
  imports: [ConfigModule.forFeature(databaseConfig)],
})
export class DatabaseModule {}