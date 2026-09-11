import { QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

/**
 * SAP-style language-dependent text table for company display fields.
 *
 * The legacy companies.name and companies.description columns remain in place
 * for backward compatibility. Existing values are copied to the default
 * English row so the application can migrate without losing data.
 */
export class CreateCompanyTextsMigration {
  readonly name = 'create-company-texts';
  readonly timestamp = 202609110004;
  readonly checksum = 'create-company-texts-v1-language-key';

  async up(queryRunner: QueryRunner): Promise<void> {
    if (!(await queryRunner.hasTable('companies'))) {
      throw new Error('Table "companies" must exist before "company_texts" is created.');
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
              length: '5',
              isPrimary: true,
              isNullable: false,
            },
            {
              name: 'name',
              type: 'varchar',
              length: '255',
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
  }
}
