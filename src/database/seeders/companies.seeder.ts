import { DataSource } from 'typeorm';
import { DatabaseSeeder } from '@/database/seeder.interface';

export class CompaniesSeeder implements DatabaseSeeder {
  readonly name = 'system-company';
  readonly order = 10;

  async seed(dataSource: DataSource): Promise<void> {
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      if (!(await queryRunner.hasTable('companies'))) {
        throw new Error('Table "companies" does not exist. Run database migrations before seeding.');
      }

      await queryRunner.startTransaction();
      await queryRunner.query(
        `INSERT INTO "companies" (
          "id", "name", "code", "description", "logo", "is_active",
          "created_at", "updated_at"
        ) VALUES ($1, $2, $3, $4, NULL, true, now(), now())
        ON CONFLICT ("code") DO UPDATE SET
          "name" = EXCLUDED."name",
          "description" = EXCLUDED."description",
          "is_active" = EXCLUDED."is_active",
          "updated_at" = now()`,
        [
          '00000000-0000-0000-0000-000000000000',
          'Workless System',
          'system',
          'System company for platform-owned accounts.',
        ],
      );

      await queryRunner.commitTransaction();
    } catch (error) {
      if (queryRunner.isTransactionActive) {
        await queryRunner.rollbackTransaction();
      }
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
