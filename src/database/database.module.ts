import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { createTypeOrmConfig } from '@/config/typeorm.config';
import { MigrationService } from '@/database/migration.service';
import { MIGRATION_PORT } from '@/workless/interfaces/migration.interface';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => createTypeOrmConfig(configService),
    }),
  ],
  providers: [
    MigrationService,
    { provide: MIGRATION_PORT, useExisting: MigrationService },
  ],
  exports: [TypeOrmModule, MigrationService, MIGRATION_PORT],
})
export class DatabaseModule {}
