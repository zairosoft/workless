import { randomUUID } from 'node:crypto';
import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import {
  CreateUserInput,
  UpdateUserInput,
  UserRecord,
  UserServicePort,
} from '@/app/interfaces/user.interface';
import { EVENT_BUS_PORT, EventBusPort } from '@/app/interfaces/event-bus.interface';
import { HOOK_PORT, HookPort } from '@/app/interfaces/hook.interface';
import { COMPANY_CONTEXT, CompanyContextPort } from '@/app/interfaces/company-context.interface';
import { RequestActor } from '@/app/helpers/request-actor';
import { ListUsersDto } from '@/app/dto/list-users.dto';
import { PlatformUserEntity } from '@/app/entities/user.entity';
import { UsersPolicy } from '@/app/providers/users.policy';
import { CompanyCacheService } from '@/app/providers/company-cache.service';

type CachedUserRecord = Omit<UserRecord, 'createdAt' | 'updatedAt'> & {
  createdAt: string;
  updatedAt: string;
};

type CachedUserList = {
  data: CachedUserRecord[];
  meta: { page: number; limit: number; total: number };
};

@Injectable()
export class UsersService implements UserServicePort {
  constructor(
    @InjectRepository(PlatformUserEntity)
    private readonly usersRepository: Repository<PlatformUserEntity>,
    private readonly usersPolicy: UsersPolicy,
    @Inject(EVENT_BUS_PORT)
    private readonly eventBus: EventBusPort,
    @Inject(HOOK_PORT)
    private readonly hookService: HookPort,
    @Inject(COMPANY_CONTEXT)
    private readonly companyContext: CompanyContextPort,
    private readonly companyCache: CompanyCacheService,
  ) {}

  async findById(id: string): Promise<UserRecord | null> {
    const companyId = this.companyContext.requireCompanyId();
    const cached = await this.companyCache.remember<CachedUserRecord | null>(
      'users',
      { action: 'detail', id },
      300,
      async () => {
        const entity = await this.usersRepository.findOne({ where: { id, companyId } });
        return entity ? this.toCachedRecord(this.toRecord(entity)) : null;
      },
    );
    return cached ? this.fromCachedRecord(cached) : null;
  }

  async findByEmail(email: string): Promise<UserRecord | null> {
    const companyId = this.companyContext.requireCompanyId();
    const normalizedEmail = email.trim().toLowerCase();
    const cached = await this.companyCache.remember<CachedUserRecord | null>(
      'users',
      { action: 'email', email: normalizedEmail },
      300,
      async () => {
        const entity = await this.usersRepository.findOne({
          where: { companyId, email: normalizedEmail },
        });
        return entity ? this.toCachedRecord(this.toRecord(entity)) : null;
      },
    );
    return cached ? this.fromCachedRecord(cached) : null;
  }

  async getUserById(id: string, actor?: RequestActor): Promise<UserRecord> {
    if (actor) this.usersPolicy.assertCanReadDirectory(actor);

    const user = await this.findById(id);
    if (!user) throw new NotFoundException(`User "${id}" was not found.`);
    return user;
  }

  async listUsers(query: ListUsersDto, actor?: RequestActor) {
    if (actor) this.usersPolicy.assertCanReadDirectory(actor);

    const companyId = this.companyContext.requireCompanyId();
    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 20, 100);
    const search = query.search?.trim();
    const where = search
      ? [
          { companyId, email: ILike(`%${search}%`) },
          { companyId, displayName: ILike(`%${search}%`) },
        ]
      : { companyId };

    const cached = await this.companyCache.remember<CachedUserList>(
      'users',
      { action: 'list', page, limit, search: search?.toLowerCase() ?? '' },
      120,
      async () => {
        const [entities, total] = await this.usersRepository.findAndCount({
          where,
          order: { createdAt: 'DESC' },
          skip: (page - 1) * limit,
          take: limit,
        });
        return {
          data: entities.map((entity) => this.toCachedRecord(this.toRecord(entity))),
          meta: { page, limit, total },
        };
      },
    );
    return {
      data: cached.data.map((user) => this.fromCachedRecord(user)),
      meta: cached.meta,
    };
  }

  async createUser(input: CreateUserInput, actor?: RequestActor): Promise<UserRecord> {
    if (actor) this.usersPolicy.assertCanCreate(actor);

    const payload = await this.hookService.emit('user.creating', input);
    const companyId = this.companyContext.requireCompanyId();
    const email = payload.email.trim().toLowerCase();
    const existing = await this.usersRepository.findOne({ where: { companyId, email } });

    if (existing) throw new ConflictException(`User email "${email}" already exists.`);

    const now = new Date();
    const saved = await this.usersRepository.save(this.usersRepository.create({
      id: randomUUID(),
      companyId,
      email,
      displayName: payload.displayName.trim(),
      active: true,
      roles: [...(payload.roles ?? [])],
      createdAt: now,
      updatedAt: now,
    }));
    const created = this.toRecord(saved);

    await this.companyCache.invalidateTable('users');
    await this.companyCache.set(
      'users',
      { action: 'detail', id: created.id },
      this.toCachedRecord(created),
      300,
    );

    await this.eventBus.emit('user.created', {
      userId: created.id,
      companyId,
      email: created.email,
    });
    return created;
  }

  async updateUser(id: string, input: UpdateUserInput, actor?: RequestActor): Promise<UserRecord> {
    const companyId = this.companyContext.requireCompanyId();
    const payload = await this.hookService.emit('user.updating', input);
    const existing = await this.usersRepository.findOne({ where: { id, companyId } });

    if (!existing) throw new NotFoundException(`User "${id}" was not found.`);
    if (actor) this.usersPolicy.assertCanUpdate(actor, this.toRecord(existing));

    const nextEmail = payload.email?.trim().toLowerCase();
    if (nextEmail && nextEmail !== existing.email) {
      const duplicate = await this.usersRepository.findOne({ where: { companyId, email: nextEmail } });
      if (duplicate) throw new ConflictException(`User email "${nextEmail}" already exists.`);
    }

    const saved = await this.usersRepository.save(this.usersRepository.create({
      ...existing,
      email: nextEmail ?? existing.email,
      displayName: payload.displayName?.trim() ?? existing.displayName,
      active: payload.active ?? existing.active,
      roles: payload.roles ?? existing.roles,
      updatedAt: new Date(),
    }));
    const updated = this.toRecord(saved);

    await this.companyCache.invalidateTable('users');
    await this.companyCache.set(
      'users',
      { action: 'detail', id: updated.id },
      this.toCachedRecord(updated),
      300,
    );

    await this.eventBus.emit('user.updated', {
      userId: updated.id,
      companyId,
      email: updated.email,
    });
    return updated;
  }

  private toRecord(entity: PlatformUserEntity): UserRecord {
    return {
      id: entity.id,
      companyId: entity.companyId,
      email: entity.email,
      displayName: entity.displayName,
      active: entity.active,
      roles: [...(entity.roles ?? [])],
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  private toCachedRecord(user: UserRecord): CachedUserRecord {
    return {
      ...user,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }

  private fromCachedRecord(user: CachedUserRecord): UserRecord {
    return {
      ...user,
      createdAt: new Date(user.createdAt),
      updatedAt: new Date(user.updatedAt),
    };
  }
}
