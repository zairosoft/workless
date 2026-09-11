import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CompanyEntity } from '@/app/entities/company.entity';

@Entity({ name: 'company_texts' })
@Index('idx_company_texts_language_name', ['languageCode', 'name'])
export class CompanyTextEntity {
  @PrimaryColumn({ name: 'company_id', type: 'uuid' })
  companyId: string;

  @PrimaryColumn({ name: 'language_code', type: 'varchar', length: 10 })
  languageCode: string;

  @Column({ type: 'varchar', length: 160 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @ManyToOne(() => CompanyEntity, (company) => company.texts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'company_id', referencedColumnName: 'id' })
  company?: CompanyEntity;
}
