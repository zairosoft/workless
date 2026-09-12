import { Controller, Get, Header, Res } from '@nestjs/common';
import type { Response } from 'express';
import { renderProfilePage } from '@/app/views/profile/profile.page';
import { Public } from '@/workless/jwt/public.decorator';

@Controller('profile')
export class ProfileController {
  @Public()
  @Get()
  @Header('Content-Type', 'text/html; charset=utf-8')
  renderProfile(@Res({ passthrough: true }) response: Response) {
    response.type('html');
    return renderProfilePage();
  }
}
