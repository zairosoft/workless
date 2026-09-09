import { Global, Module } from '@nestjs/common';
import { COMPANY_CONTEXT } from '@/app/interfaces/company-context.interface';
import { CompanyCacheService } from '@/app/providers/company-cache.service';
import { RequestCompanyContextService } from '@/app/providers/request-company-context.service';

@Global()
@Module({
  providers: [
    RequestCompanyContextService,
    { provide: COMPANY_CONTEXT, useExisting: RequestCompanyContextService },
    CompanyCacheService,
  ],
  exports: [COMPANY_CONTEXT, RequestCompanyContextService, CompanyCacheService],
})
export class CompanyContextModule {}
