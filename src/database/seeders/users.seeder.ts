import * as argon2 from 'argon2';
import { randomBytes } from 'node:crypto';
import { DataSource } from 'typeorm';
import { DatabaseSeeder } from '@/database/seeder.interface';

export class UsersSeeder implements DatabaseSeeder {
  readonly name = 'sample-users';
  readonly order = 100;

  async seed(dataSource: DataSource): Promise<void> {
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      if (!(await queryRunner.hasTable('users'))) {
        throw new Error('Table "users" does not exist. Run database migrations before seeding.');
      }

      const password = process.env.SEED_USER_PASSWORD ?? '123456';
      const passwordHash = await this.hashPassword(password);
      const adminId = this.createUuidV7();
      const sampleUserId = this.createUuidV7();

      await queryRunner.startTransaction();
      const [admin] = await queryRunner.query(
        `INSERT INTO "users" (
          "id", "name", "email", "password", "role", "img", "is_active", "locale",
          "last_logged_activities", "remember_token", "email_verified_at", "last_logged_at",
          "created_at", "created_by", "updated_at", "updated_by", "deleted_at", "deleted_by"
        ) VALUES ($1, $2, $3, $4, $5, NULL, true, $6, NULL, NULL, now(), NULL, now(), NULL, now(), NULL, NULL, NULL)
        ON CONFLICT ("email") DO UPDATE SET "email" = EXCLUDED."email"
        RETURNING "id"`,
        [
          adminId,
          'System Administrator',
          'admin@example.com',
          passwordHash,
          'admin',
          'th',
        ],
      );

      await queryRunner.query(
        `INSERT INTO "users" (
          "id", "name", "email", "password", "role", "img", "is_active", "locale",
          "last_logged_activities", "remember_token", "email_verified_at", "last_logged_at",
          "created_at", "created_by", "updated_at", "updated_by", "deleted_at", "deleted_by"
        ) VALUES ($1, $2, $3, $4, $5, NULL, true, $6, NULL, NULL, now(), NULL, now(), $7, now(), $7, NULL, NULL)
        ON CONFLICT ("email") DO NOTHING`,
        [
          sampleUserId,
          'Sample User',
          'user@example.com',
          passwordHash,
          'user',
          'en',
          admin.id,
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

  private async hashPassword(password: string): Promise<string> {
    return argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 19_456,
      timeCost: 2,
      parallelism: 1,
      hashLength: 32,
    });
  }

  private createUuidV7(): string {
    const bytes = randomBytes(16);
    const timestamp = BigInt(Date.now());

    for (let index = 5; index >= 0; index -= 1) {
      bytes[index] = Number(timestamp >> BigInt((5 - index) * 8)) & 0xff;
    }

    bytes[6] = (bytes[6] & 0x0f) | 0x70;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;

    const hex = bytes.toString('hex');
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  }
}
