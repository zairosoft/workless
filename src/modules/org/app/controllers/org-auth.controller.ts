import { Controller, Get, Header, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { Public } from '@/workless/jwt/public.decorator';
import { resolveLocaleFromRequest } from '@/workless/i18n';
import { renderForgotPasswordPage } from '@modules/org/app/views/auth/forgot-password.page';
import { renderRegisterPage } from '@modules/org/app/views/auth/register.page';

/** Public organization account pages owned by the Org module. */
@Controller('org')
export class OrgAuthController {
  /** GET /org/register — renders the HTML registration page. */
  @Public()
  @Get('register')
  @Header('Content-Type', 'text/html; charset=utf-8')
  renderRegister(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    response.type('html');
    return renderRegisterPage({ locale: resolveLocaleFromRequest(request) });
  }

  /** GET /org/forgot/password — renders the password recovery page. */
  @Public()
  @Get('forgot/password')
  @Header('Content-Type', 'text/html; charset=utf-8')
  renderForgotPassword(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    response.type('html');
    return renderForgotPasswordPage({ locale: resolveLocaleFromRequest(request) });
  }
}
