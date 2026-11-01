import * as argon2 from 'argon2';
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import {
  AuthServicePort,
  AuthSession,
  JwtPayload,
  LoginResult,
} from '@/app/interfaces/auth.interface';
import { RegisterDto } from '@/app/dto/register.dto';
import { OrgUserEntity } from '@modules/org/app/entities/user.entity';

@Injectable()
export class AuthService implements AuthServicePort {
  constructor(
    @InjectRepository(OrgUserEntity)
    private readonly usersRepository: Repository<OrgUserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async createSession(userId: string): Promise<AuthSession> {
    const user = await this.usersRepository.findOne({
      where: { id: userId, isActive: true },
    });
    if (!user) {
      throw new UnauthorizedException('User is not available for authentication.');
    }

    return {
      userId: user.id,
      companyId: user.companyId.trim().toLowerCase(),
      authenticatedAt: new Date(),
    };
  }

  async login(email: string, password: string): Promise<LoginResult> {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email: normalizedEmail })
      .getOne();

    const passwordMatches = user && await this.verifyPassword(password, user.password);
    if (!user || !user.isActive || !passwordMatches) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    await this.usersRepository.update(user.id, {
      lastLoggedAt: new Date(),
      ...(this.isLegacyScryptHash(user.password) ? { password: await this.hashPassword(password) } : {}),
    });
    return this.createLoginResult(user);
  }

  async register(dto: RegisterDto): Promise<LoginResult> {
    const email = dto.email.trim().toLowerCase();
    const existing = await this.usersRepository.findOne({ where: { email } });
    if (existing) {
      throw new ConflictException(`User email "${email}" already exists.`);
    }

    const user = this.usersRepository.create({
      companyId: '00000000-0000-0000-0000-000000000000',
      name: dto.displayName.trim(),
      email,
      password: await this.hashPassword(dto.password),
      role: 'user',
      isActive: true,
      locale: 'en',
    });

    const created = await this.usersRepository.save(user);
    return this.createLoginResult(created);
  }

  private createLoginResult(user: OrgUserEntity): LoginResult {
    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      companyId: user.companyId.trim().toLowerCase(),
      roles: [user.role],
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        displayName: user.name,
        roles: [user.role],
      },
    };
  }

  private async hashPassword(password: string): Promise<string> {
    return argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 19_456,
      timeCost: 2,
      parallelism: 1,
      hashLength: 32,
    });
  }

  private async verifyPassword(password: string, storedValue: string): Promise<boolean> {
    if (storedValue.startsWith('$argon2id$')) {
      try {
        return await argon2.verify(storedValue, password);
      } catch {
        return false;
      }
    }

    return this.verifyLegacyScryptPassword(password, storedValue);
  }

  private verifyLegacyScryptPassword(password: string, storedValue: string): boolean {
    const [algorithm, saltHex, hashHex] = storedValue.split(':');
    if (algorithm !== 'scrypt' || !saltHex || !hashHex) {
      return false;
    }

    try {
      const expectedHash = Buffer.from(hashHex, 'hex');
      const actualHash = scryptSync(password, Buffer.from(saltHex, 'hex'), expectedHash.length);
      return expectedHash.length > 0 && timingSafeEqual(actualHash, expectedHash);
    } catch {
      return false;
    }
  }

  private isLegacyScryptHash(storedValue: string): boolean {
    return storedValue.startsWith('scrypt:');
  }
}
