import { Controller, Get, Header, Param, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { Public } from '@/workless/jwt/public.decorator';
import { LOCALE_COOKIE_NAME, resolveLocale } from '@/workless/i18n';

function resolveRedirectTarget(request: Request): string {
  const referer =
    typeof request.headers.referer === 'string' && request.headers.referer.length > 0
      ? request.headers.referer
      : '';

  if (!referer) {
    return '/';
  }

  if (referer.startsWith('/')) {
    return referer;
  }

  const host = typeof request.headers.host === 'string' ? request.headers.host : '';

  if (!host) {
    return '/';
  }

  try {
    const currentOrigin = `${request.protocol}://${host}`;
    const refererUrl = new URL(referer, currentOrigin);
    const currentUrl = new URL(currentOrigin);

    if (refererUrl.origin !== currentUrl.origin) {
      return '/';
    }

    return `${refererUrl.pathname}${refererUrl.search}${refererUrl.hash}`;
  } catch {
    return '/';
  }
}

@Controller('language')
export class LanguageController {
  @Public()
  @Get(':locale')
  @Header('Cache-Control', 'no-store')
  setLocale(
    @Param('locale') locale: string,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const nextLocale = resolveLocale(locale);
    const redirectTarget = resolveRedirectTarget(request);

    response.cookie(LOCALE_COOKIE_NAME, nextLocale, {
      maxAge: 1000 * 60 * 60 * 24 * 365 * 5,
      sameSite: 'lax',
      path: '/',
      httpOnly: false,
    });

    return response.redirect(redirectTarget);
  }
}
