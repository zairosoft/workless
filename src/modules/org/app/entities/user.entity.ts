import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
@Index('uq_users_email', ['email'], { unique: true })
export class OrgUserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index('idx_users_company_id')
  @Column({ name: 'company_id', type: 'uuid' })
  companyId: string;

  @Column({ type: 'varchar', length: 120 })
  name: string;

  @Column({ type: 'varchar', length: 160 })
  email: string;

  @Column({ type: 'varchar', length: 255, select: false })
  password: string;

  @Column({ type: 'varchar', length: 50 })
  role: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  img?: string | null;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'varchar', length: 10, default: 'en' })
  locale: string;

  @Column({ name: 'last_logged_activities', type: 'text', nullable: true })
  lastLoggedActivities?: string | null;

  @Column({ name: 'remember_token', type: 'varchar', length: 255, nullable: true, select: false })
  rememberToken?: string | null;

  @Column({ name: 'email_verified_at', type: 'timestamptz', nullable: true })
  emailVerifiedAt?: Date | null;

  @Column({ name: 'last_logged_at', type: 'timestamptz', nullable: true })
  lastLoggedAt?: Date | null;

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

  get displayName(): string {
    return this.name;
  }

  set displayName(value: string) {
    this.name = value;
  }

  get active(): boolean {
    return this.isActive;
  }

  set active(value: boolean) {
    this.isActive = value;
  }

  get roles(): string[] {
    return this.role ? [this.role] : [];
  }

  set roles(value: string[]) {
    this.role = value[0] ?? 'user';
  }

}
