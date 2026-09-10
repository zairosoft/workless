import { Body, Controller, Get, Header, Post, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { Public } from '@/workless/jwt/public.decorator';
import { AuthService } from '@/app/services/auth.service';
import { LoginDto } from '@/app/dto/login.dto';
import { RegisterDto } from '@/app/dto/register.dto';
import { resolveLocaleFromRequest } from '@/workless/i18n';
import { renderLoginPage } from '@/app/views/auth/login.page';
import { renderRegisterPage } from '@/app/views/auth/register.page';
import { renderForgotPasswordPage } from '@/app/views/auth/forgot-password.page';

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
    return renderLoginPage({ locale: resolveLocaleFromRequest(request) });
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
   * GET /auth/register — renders the HTML register page
   */
  @Public()
  @Get('register')
  @Header('Content-Type', 'text/html; charset=utf-8')
  renderRegister(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    response.type('html');
    return renderRegisterPage({ locale: resolveLocaleFromRequest(request) });
  }

  /**
   * GET /auth/forgot/password — renders the password recovery view.
   */
  @Public()
  @Get('forgot/password')
  @Header('Content-Type', 'text/html; charset=utf-8')
  renderForgotPassword(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    response.type('html');
    return renderForgotPasswordPage({ locale: resolveLocaleFromRequest(request) });
  }

  @Public()
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }
}
