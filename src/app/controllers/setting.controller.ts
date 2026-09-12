import { Controller, Get, Header, Res } from '@nestjs/common';
import type { Response } from 'express';
import { renderSettingsPage } from '@/app/views/settings/settings.page';
import { Public } from '@/workless/jwt/public.decorator';

@Controller('settings')
export class SettingsController {
  @Public()
  @Get()
  @Header('Content-Type', 'text/html; charset=utf-8')
  renderSettings(@Res({ passthrough: true }) response: Response) {
    response.type('html');
    return renderSettingsPage();
  }
}
