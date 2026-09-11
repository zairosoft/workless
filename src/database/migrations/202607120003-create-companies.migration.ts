import { QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateCompaniesMigration {
  readonly name = 'create-companies';
  readonly timestamp = 202607120003;
  readonly checksum = 'create-companies-v3-with-company-text-locale';

  async up(queryRunner: QueryRunner): Promise<void> {
    if (!(await queryRunner.hasTable('companies'))) {
      await queryRunner.createTable(
        new Table({
          name: 'companies',
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary: true,
              isNullable: false,
              default: 'gen_random_uuid()',
            },
            {
              name: 'name',
              type: 'varchar',
              length: '160',
              isNullable: false,
            },
            {
              name: 'code',
              type: 'varchar',
              length: '80',
              isNullable: false,
            },
            {
              name: 'description',
              type: 'text',
              isNullable: true,
            },
            {
              name: 'logo',
              type: 'varchar',
              length: '500',
              isNullable: true,
            },
            {
              name: 'is_active',
              type: 'boolean',
              isNullable: false,
              default: true,
            },
            {
              name: 'created_at',
              type: 'timestamptz',
              isNullable: false,
              default: 'now()',
            },
            {
              name: 'created_by',
              type: 'uuid',
              isNullable: true,
            },
            {
              name: 'updated_at',
              type: 'timestamptz',
              isNullable: false,
              default: 'now()',
            },
            {
              name: 'updated_by',
              type: 'uuid',
              isNullable: true,
            },
            {
              name: 'deleted_at',
              type: 'timestamptz',
              isNullable: true,
            },
            {
              name: 'deleted_by',
              type: 'uuid',
              isNullable: true,
            },
          ],
          indices: [
            new TableIndex({
              name: 'uq_companies_code',
              columnNames: ['code'],
              isUnique: true,
            }),
            new TableIndex({
              name: 'idx_companies_name',
              columnNames: ['name'],
            }),
            new TableIndex({
              name: 'idx_companies_active_created_at',
              columnNames: ['created_at'],
              where: '"is_active" = true AND "deleted_at" IS NULL',
            }),
          ],
        }),
        true,
      );
    }

    if (!(await queryRunner.hasTable('company_texts'))) {
      await queryRunner.createTable(
        new Table({
          name: 'company_texts',
          columns: [
            {
              name: 'company_id',
              type: 'uuid',
              isPrimary: true,
              isNullable: false,
            },
            {
              name: 'locale',
              type: 'varchar',
              length: '10',
              isPrimary: true,
              isNullable: false,
            },
            {
              name: 'name',
              type: 'varchar',
              length: '160',
              isNullable: false,
            },
            {
              name: 'description',
              type: 'text',
              isNullable: true,
            },
            {
              name: 'created_at',
              type: 'timestamptz',
              isNullable: false,
              default: 'now()',
            },
            {
              name: 'updated_at',
              type: 'timestamptz',
              isNullable: false,
              default: 'now()',
            },
          ],
          indices: [
            new TableIndex({
              name: 'idx_company_texts_locale_name',
              columnNames: ['locale', 'name'],
            }),
          ],
        }),
        true,
      );
    }

    const companyTexts = await queryRunner.getTable('company_texts');
    const hasCompanyForeignKey = companyTexts?.foreignKeys.some(
      (foreignKey) =>
        foreignKey.columnNames.length === 1 &&
        foreignKey.columnNames[0] === 'company_id' &&
        foreignKey.referencedTableName === 'companies',
    );

    if (!hasCompanyForeignKey) {
      await queryRunner.createForeignKey(
        'company_texts',
        new TableForeignKey({
          name: 'fk_company_texts_company',
          columnNames: ['company_id'],
          referencedTableName: 'companies',
          referencedColumnNames: ['id'],
          onDelete: 'CASCADE',
        }),
      );
    }

    await queryRunner.query(`
      INSERT INTO "company_texts"
        ("company_id", "locale", "name", "description", "created_at", "updated_at")
      SELECT "id", 'en', "name", "description", "created_at", "updated_at"
      FROM "companies"
      WHERE "deleted_at" IS NULL
      ON CONFLICT ("company_id", "locale") DO NOTHING
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    if (await queryRunner.hasTable('company_texts')) {
      await queryRunner.dropTable('company_texts', true, true);
    }
    if (await queryRunner.hasTable('companies')) {
      await queryRunner.dropTable('companies', true, true);
    }
  }
}
