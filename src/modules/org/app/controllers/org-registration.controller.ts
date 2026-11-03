import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '@/app/services/auth.service';
import { RegisterDto } from '@/app/dto/register.dto';
import { Public } from '@/workless/jwt/public.decorator';

/** Registration API owned by Org while keeping its existing API URL. */
@Controller('auth')
export class OrgRegistrationController {
  constructor(private readonly authService: AuthService) {}

  /** POST /api/v1/auth/register */
  @Public()
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }
}
