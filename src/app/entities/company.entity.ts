import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CompanyTextEntity } from '@/app/entities/company-text.entity';

@Entity({ name: 'companies' })
@Index('uq_companies_code', ['code'], { unique: true })
export class CompanyEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 160 })
  name: string;

  @Column({ type: 'varchar', length: 80 })
  code: string;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @OneToMany(() => CompanyTextEntity, (text) => text.company)
  texts?: CompanyTextEntity[];

  @Column({ type: 'varchar', length: 500, nullable: true })
  logo?: string | null;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @Column({ name: 'created_by', type: 'uuid', nullable: true })
  createdBy?: string | null;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @Column({ name: 'updated_by', type: 'uuid', nullable: true })
  updatedBy?: string | null;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  deletedAt?: Date | null;

  @Column({ name: 'deleted_by', type: 'uuid', nullable: true })
  deletedBy?: string | null;
}
