import { Controller, Get, Header } from '@nestjs/common';
import { Public } from '@/workless/jwt/public.decorator';
import { renderDashboardPage } from '@modules/dashboard/app/views/dashboard.page';

@Public()
@Controller('dashboard')
export class DashboardController {
  @Get()
  @Header('Content-Type', 'text/html; charset=utf-8')
  renderDashboard() {
    return renderDashboardPage();
  }
}
