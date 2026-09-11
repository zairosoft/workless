import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { CreateCompanyDto } from '@/app/dto/create-company.dto';
import { ListCompaniesDto } from '@/app/dto/list-companies.dto';
import { UpdateCompanyDto } from '@/app/dto/update-company.dto';
import type { PermissionAwareRequest } from '@/app/helpers/request-actor';
import { PermissionGuard } from '@/app/providers/permission.guard';
import { RequirePermissions } from '@/app/providers/require-permissions.decorator';
import { CompaniesService } from '@/app/services/companies.service';
import { renderCompaniesPage } from '@/app/views/companies/companies.page';
import { Public } from '@/workless/jwt/public.decorator';
import { resolveLocaleFromRequest } from '@/workless/i18n';

@Controller('platform/companies')
@UseGuards(PermissionGuard)
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Public()
  @Get('page')
  @Header('Content-Type', 'text/html; charset=utf-8')
  renderPage(@Res({ passthrough: true }) response: Response) {
    response.type('html');
    return renderCompaniesPage();
  }

  @Get()
  @RequirePermissions('platform.company.read')
  list(@Query() query: ListCompaniesDto, @Req() request: PermissionAwareRequest) {
    return this.companiesService.listCompanies(
      query,
      request.actor!,
      resolveLocaleFromRequest(request),
    );
  }

  @Get(':id')
  @RequirePermissions('platform.company.read')
  getOne(@Param('id') id: string, @Req() request: PermissionAwareRequest) {
    return this.companiesService.getCompanyById(
      id,
      request.actor!,
      resolveLocaleFromRequest(request),
    );
  }

  @Post()
  @RequirePermissions('platform.company.write')
  create(@Body() dto: CreateCompanyDto, @Req() request: PermissionAwareRequest) {
    return this.companiesService.createCompany(
      dto,
      request.actor!,
      resolveLocaleFromRequest(request),
    );
  }

  @Patch(':id')
  @RequirePermissions('platform.company.write')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateCompanyDto,
    @Req() request: PermissionAwareRequest,
  ) {
    return this.companiesService.updateCompany(
      id,
      dto,
      request.actor!,
      resolveLocaleFromRequest(request),
    );
  }

  @Delete(':id')
  @RequirePermissions('platform.company.write')
  async remove(@Param('id') id: string, @Req() request: PermissionAwareRequest) {
    await this.companiesService.deleteCompany(id, request.actor!);
    return { deleted: true };
  }
}
