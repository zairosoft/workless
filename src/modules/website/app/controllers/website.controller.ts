import { Controller, Get, Header, NotFoundException, Param, Res } from '@nestjs/common';
import type { Response } from 'express';
import appConfig from '@modules/website/app.config.json';
import { renderWebsitePage } from '@modules/website/app/views/website.page';
import { Public } from '@/workless/jwt/public.decorator';

@Public()
@Controller('website')
export class WebsiteController {
  @Get()
  openWebsite(@Res() response: Response) {
    return response.redirect(302, appConfig.subMenu[0]?.url ?? '/');
  }

  @Get(':section')
  @Header('Content-Type', 'text/html; charset=utf-8')
  renderSection(
    @Param('section') section: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const menuItem = appConfig.subMenu.find((item) => {
      const segments = item.url.split('/').filter(Boolean);
      return segments[segments.length - 1] === section;
    });

    if (!menuItem) {
      throw new NotFoundException(`Website section "${section}" was not found.`);
    }

    response.type('html');
    return renderWebsitePage(menuItem);
  }
}
