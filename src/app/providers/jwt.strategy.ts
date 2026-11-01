import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { OrgUserEntity } from '@modules/org/app/entities/user.entity';
import type { AuthenticatedUser, JwtPayload } from '@/app/interfaces/auth.interface';
import { resolveJwtSecret } from '@/config/jwt.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    @InjectRepository(OrgUserEntity)
    private readonly usersRepository: Repository<OrgUserEntity>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: resolveJwtSecret(configService),
    });
  }

  async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
    const user = await this.usersRepository.findOne({
      where: { id: payload.userId, isActive: true },
    });
    if (!user) {
      throw new UnauthorizedException('User account is disabled or not found.');
    }

    if (typeof payload.companyId !== 'string') {
      throw new UnauthorizedException('Token company is invalid.');
    }

    const tokenCompanyId = payload.companyId.trim().toLowerCase();
    if (!isUUID(tokenCompanyId)) {
      throw new UnauthorizedException('Token company is invalid.');
    }

    const databaseCompanyId = user.companyId.trim().toLowerCase();
    if (!isUUID(databaseCompanyId)) {
      throw new UnauthorizedException('User company is invalid.');
    }
    if (tokenCompanyId !== databaseCompanyId) {
      throw new UnauthorizedException('Token company is no longer valid.');
    }

    return {
      userId: user.id,
      email: user.email,
      companyId: databaseCompanyId,
      roles: [user.role],
    };
  }
}
