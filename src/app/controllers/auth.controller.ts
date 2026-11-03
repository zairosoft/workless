import { Body, Controller, Get, Header, Post, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { Public } from '@/workless/jwt/public.decorator';
import { AuthService } from '@/app/services/auth.service';
import { LoginDto } from '@/app/dto/login.dto';
import { resolveLocaleFromRequest } from '@/workless/i18n';
import { renderLoginPage } from '@/app/views/auth/login.page';
import { isRuntimeModuleEnabled } from '@/workless/registry/module-runtime-state';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * GET /auth/login — renders the HTML login page
   */
  @Public()
  @Get('login')
  @Header('Content-Type', 'text/html; charset=utf-8')
  renderLogin(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    response.type('html');
    return renderLoginPage({
      locale: resolveLocaleFromRequest(request),
      orgModuleEnabled: isRuntimeModuleEnabled('org'),
    });
  }

  /**
   * POST /auth/login — JSON API endpoint that returns a JWT token
   */
  @Public()
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  /**
   * GET /auth/logout — removes the browser-held JWT and returns to login.
   */
  @Public()
  @Get('logout')
  @Header('Cache-Control', 'no-store, no-cache, must-revalidate')
  logout(@Res() response: Response) {
    return response.redirect(303, '/auth/login');
  }
}
