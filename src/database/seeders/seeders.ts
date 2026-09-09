import { DatabaseSeeder } from '@/database/seeder.interface';
import { CompaniesSeeder } from '@/database/seeders/companies.seeder';
import { UsersSeeder } from '@/database/seeders/users.seeder';

export const databaseSeeders: DatabaseSeeder[] = [new CompaniesSeeder(), new UsersSeeder()].sort(
  (left, right) => (left.order ?? 0) - (right.order ?? 0),
);
