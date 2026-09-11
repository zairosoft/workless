import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { ListCompaniesDto } from '@/app/dto/list-companies.dto';
import { CompanyEntity } from '@/app/entities/company.entity';
import { CompanyTextEntity } from '@/app/entities/company-text.entity';
import { PlatformUserEntity } from '@/app/entities/user.entity';
import { RequestActor } from '@/app/helpers/request-actor';
import {
  CompanyRecord,
  CompanyTextInput,
  CreateCompanyInput,
  UpdateCompanyInput,
} from '@/app/interfaces/company.interface';
import { CompaniesPolicy } from '@/app/providers/companies.policy';
import { CACHE_PORT, CachePort } from '@/workless/infrastructure/cache/cache.interface';

type CachedCompanyRecord = Omit<CompanyRecord, 'createdAt' | 'updatedAt' | 'deletedAt'> & {
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(CompanyEntity)
    private readonly companiesRepository: Repository<CompanyEntity>,
    @InjectRepository(CompanyTextEntity)
    private readonly companyTextsRepository: Repository<CompanyTextEntity>,
    @InjectRepository(PlatformUserEntity)
    private readonly usersRepository: Repository<PlatformUserEntity>,
    private readonly companiesPolicy: CompaniesPolicy,
    @Inject(CACHE_PORT)
    private readonly cache: CachePort,
  ) {}

  async listCompanies(query: ListCompaniesDto, actor: RequestActor, locale = 'en') {
    this.companiesPolicy.assertCanRead(actor);

    const languageCode = this.normalizeLanguageCode(locale);
    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 20, 100);
    const search = query.search?.trim();
    const cacheKey = `platform:companies:list:${languageCode}:${page}:${limit}:${encodeURIComponent(
      search?.toLowerCase() ?? '',
    )}`;
    const result = await this.cache.remember<{
      data: CachedCompanyRecord[];
      meta: { page: number; limit: number; total: number };
    }>(cacheKey, 60, async () => {
      const builder = this.companiesRepository
        .createQueryBuilder('company')
        .leftJoinAndSelect('company.texts', 'text')
        .where('company.deleted_at IS NULL')
        .orderBy('company.created_at', 'DESC')
        .skip((page - 1) * limit)
        .take(limit)
        .distinct(true);

      if (search) {
        builder.andWhere(
          new Brackets((searchBuilder) =>
            searchBuilder
              .where('company.code ILIKE :search')
              .orWhere('company.name ILIKE :search')
              .orWhere('text.name ILIKE :search'),
          ),
          { search: `%${search}%` },
        );
      }

      const [companies, total] = await builder.getManyAndCount();

      return {
        data: companies.map((company) =>
          this.toCachedRecord(this.toRecord(company, languageCode)),
        ),
        meta: { page, limit, total },
      };
    });

    return {
      data: result.data.map((company) => this.fromCachedRecord(company)),
      meta: result.meta,
    };
  }

  async getCompanyById(id: string, actor: RequestActor, locale = 'en'): Promise<CompanyRecord> {
    this.companiesPolicy.assertCanRead(actor);
    const languageCode = this.normalizeLanguageCode(locale);
    const company = await this.cache.remember<CachedCompanyRecord>(
      this.companyCacheKey(id, languageCode),
      300,
      async () =>
        this.toCachedRecord(this.toRecord(await this.getEntityOrFail(id), languageCode)),
    );
    return this.fromCachedRecord(company);
  }

  async createCompany(
    input: CreateCompanyInput,
    actor: RequestActor,
    locale = 'en',
  ): Promise<CompanyRecord> {
    this.companiesPolicy.assertCanWrite(actor);

    const code = this.normalizeCode(input.code);
    await this.ensureCodeIsAvailable(code);

    const company = this.companiesRepository.create({
      name: input.name.trim(),
      code,
      description: this.normalizeOptionalText(input.description),
      logo: this.normalizeOptionalText(input.logo),
      isActive: input.isActive ?? true,
      createdBy: actor.userId ?? null,
      updatedBy: actor.userId ?? null,
    });

    const saved = await this.companiesRepository.save(company);
    await this.saveCompanyTexts(saved.id, [
      ...(input.texts ?? []),
      { languageCode: 'en', name: input.name, description: input.description },
    ]);
    const created = this.toRecord(
      await this.getEntityOrFail(saved.id),
      this.normalizeLanguageCode(locale),
    );
    await this.invalidateCompanyCache(created.id);
    await this.cache.set(
      this.companyCacheKey(created.id, this.normalizeLanguageCode(locale)),
      this.toCachedRecord(created),
      300,
    );
    return created;
  }

  async updateCompany(
    id: string,
    input: UpdateCompanyInput,
    actor: RequestActor,
    locale = 'en',
  ): Promise<CompanyRecord> {
    this.companiesPolicy.assertCanWrite(actor);

    const company = await this.getEntityOrFail(id);
    if (company.id === '00000000-0000-0000-0000-000000000000' && input.isActive === false) {
      throw new ConflictException('The system company cannot be disabled.');
    }

    if (input.code !== undefined) {
      const code = this.normalizeCode(input.code);
      if (code !== company.code) {
        await this.ensureCodeIsAvailable(code, company.id);
        company.code = code;
      }
    }

    const englishInput = input.texts?.find(
      (text) => this.normalizeLanguageCode(text.languageCode) === 'en',
    );

    if (input.name !== undefined) {
      company.name = input.name.trim();
    } else if (englishInput) {
      company.name = englishInput.name.trim();
    }
    if (input.description !== undefined) {
      company.description = this.normalizeOptionalText(input.description);
    } else if (englishInput?.description !== undefined) {
      company.description = this.normalizeOptionalText(englishInput.description);
    }
    if (input.logo !== undefined) company.logo = this.normalizeOptionalText(input.logo);
    if (input.isActive !== undefined) company.isActive = input.isActive;
    company.updatedBy = actor.userId ?? null;

    const saved = await this.companiesRepository.save(company);
    const texts: CompanyTextInput[] = input.texts ? [...input.texts] : [];

    if (input.name !== undefined || input.description !== undefined) {
      const currentEnglish = await this.companyTextsRepository.findOne({
        where: { companyId: saved.id, languageCode: 'en' },
      });
      texts.push({
        languageCode: 'en',
        name: input.name ?? currentEnglish?.name ?? saved.name,
        description:
          input.description !== undefined
            ? input.description
            : currentEnglish?.description ?? saved.description,
      });
    }

    if (texts.length > 0) {
      await this.saveCompanyTexts(saved.id, texts);
    }

    const updated = this.toRecord(
      await this.getEntityOrFail(saved.id),
      this.normalizeLanguageCode(locale),
    );
    await this.invalidateCompanyCache(updated.id);
    await this.cache.set(
      this.companyCacheKey(updated.id, this.normalizeLanguageCode(locale)),
      this.toCachedRecord(updated),
      300,
    );
    return updated;
  }

  async deleteCompany(id: string, actor: RequestActor): Promise<void> {
    this.companiesPolicy.assertCanWrite(actor);

    const company = await this.getEntityOrFail(id);
    if (company.id === '00000000-0000-0000-0000-000000000000') {
      throw new ConflictException('The system company cannot be deleted.');
    }

    const assignedUsers = await this.usersRepository.count({ where: { companyId: id } });
    if (assignedUsers > 0) {
      throw new ConflictException(
        `Company "${company.name}" cannot be deleted while it has assigned users.`,
      );
    }

    company.deletedBy = actor.userId ?? null;
    await this.companiesRepository.save(company);
    await this.companiesRepository.softRemove(company);
    await this.invalidateCompanyCache(id);
  }

  private async getEntityOrFail(id: string): Promise<CompanyEntity> {
    const company = await this.companiesRepository.findOne({
      where: { id },
      relations: { texts: true },
    });
    if (!company) {
      throw new NotFoundException(`Company "${id}" was not found.`);
    }

    return company;
  }

  private async ensureCodeIsAvailable(code: string, exceptId?: string): Promise<void> {
    const existing = await this.companiesRepository.findOne({
      where: { code },
      withDeleted: true,
    });
    if (existing && existing.id !== exceptId) {
      throw new ConflictException(`Company code "${code}" already exists.`);
    }
  }

  private normalizeCode(code: string): string {
    return code.trim().toLowerCase();
  }

  private normalizeOptionalText(value?: string): string | null {
    const normalized = value?.trim();
    return normalized || null;
  }

  private companyCacheKey(id: string, languageCode: string): string {
    return `platform:companies:${languageCode}:${id}`;
  }

  private async invalidateCompanyCache(id: string): Promise<void> {
    await Promise.all([
      this.cache.del(this.companyCacheKey(id, 'en')),
      this.cache.del(`platform:companies:${id}`),
      this.cache.delByPrefix('platform:companies:'),
    ]);
  }

  private toCachedRecord(company: CompanyRecord): CachedCompanyRecord {
    return {
      ...company,
      createdAt: company.createdAt.toISOString(),
      updatedAt: company.updatedAt.toISOString(),
      deletedAt: company.deletedAt?.toISOString() ?? null,
    };
  }

  private fromCachedRecord(company: CachedCompanyRecord): CompanyRecord {
    return {
      ...company,
      createdAt: new Date(company.createdAt),
      updatedAt: new Date(company.updatedAt),
      deletedAt: company.deletedAt ? new Date(company.deletedAt) : null,
    };
  }

  private toRecord(company: CompanyEntity, languageCode = 'en'): CompanyRecord {
    const texts = (company.texts ?? []).map((text) => ({
      languageCode: text.languageCode,
      name: text.name,
      description: text.description ?? null,
    }));
    const selectedText =
      texts.find((text) => text.languageCode === languageCode) ??
      texts.find((text) => text.languageCode === 'en');

    return {
      id: company.id,
      name: selectedText?.name ?? company.name,
      code: company.code,
      description: selectedText?.description ?? company.description,
      texts,
      logo: company.logo,
      isActive: company.isActive,
      createdAt: company.createdAt,
      createdBy: company.createdBy ?? null,
      updatedAt: company.updatedAt,
      updatedBy: company.updatedBy ?? null,
      deletedAt: company.deletedAt ?? null,
      deletedBy: company.deletedBy ?? null,
    };
  }

  private async saveCompanyTexts(companyId: string, inputs: CompanyTextInput[]): Promise<void> {
    const byLanguage = new Map<string, CompanyTextInput>();

    for (const input of inputs) {
      const languageCode = this.normalizeLanguageCode(input.languageCode);
      byLanguage.set(languageCode, {
        languageCode,
        name: input.name,
        description: input.description,
      });
    }

    for (const input of byLanguage.values()) {
      const existing = await this.companyTextsRepository.findOne({
        where: { companyId, languageCode: input.languageCode },
      });
      const text = this.companyTextsRepository.create({
        ...(existing ?? {}),
        companyId,
        languageCode: input.languageCode,
        name: input.name.trim(),
        description: this.normalizeOptionalText(input.description),
      });
      await this.companyTextsRepository.save(text);
    }
  }

  private normalizeLanguageCode(languageCode: string): string {
    return languageCode.trim().toLowerCase();
  }
}
