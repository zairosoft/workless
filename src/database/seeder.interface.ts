import { DataSource } from 'typeorm';

export interface DatabaseSeeder {
  readonly name: string;
  readonly order?: number;
  seed(dataSource: DataSource): Promise<void>;
}
