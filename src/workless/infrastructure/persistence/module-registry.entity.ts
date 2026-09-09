import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ModuleRegistryRecord, ModuleStatus } from '@/workless/registry/module-registry.interface';

@Entity({ name: 'module_registries' })
export class ModuleRegistryEntity implements ModuleRegistryRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 80 })
  name: string;

  @Column({ type: 'varchar', length: 32 })
  version: string;

  @Column({ type: 'varchar', length: 32, nullable: true })
  availableVersion?: string | null;

  @Column({ type: 'varchar', length: 20, default: ModuleStatus.UNINSTALLED })
  status: ModuleStatus;

  @Column({ type: 'boolean', default: false })
  enabled: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description?: string | null;

  @Column({ type: 'simple-array', nullable: true })
  dependencies?: string[];

  @Column({ type: 'simple-json', nullable: true })
  metadata?: Record<string, unknown> | null;

  @Column({ name: 'installed_at', type: 'timestamptz', nullable: true })
  installedAt?: Date | null;

  @Column({ name: 'upgraded_at', type: 'timestamptz', nullable: true })
  upgradedAt?: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
