import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const email = dto.email.trim().toLowerCase();
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const user = await this.prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          email,
          name: dto.name?.trim() ?? null,
          passwordHash,
          profile: {
            create: {},
          },
          shadow: {
            create: {},
          },
          shadowRank: {
            create: {
              rankType: 'PAWN',
            },
          },
          verification: {
            create: {
              status: 'UNVERIFIED',
            },
          },
        },
        include: {
          profile: true,
          shadow: true,
          shadowRank: true,
          verification: true,
        },
      });
      return createdUser;
    });

    const payload = { sub: user.id, email: user.email };
    const access_token = await this.jwtService.signAsync(payload);

    return {
      access_token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        profile: user.profile,
        shadow: user.shadow,
        shadowRank: user.shadowRank,
        verification: user.verification,
      },
    };
  }

  async login(dto: LoginDto) {
    const email = dto.email.trim().toLowerCase();
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        profile: true,
        shadow: true,
        shadowRank: true,
        verification: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordMatches = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = { sub: user.id, email: user.email };
    const access_token = await this.jwtService.signAsync(payload);

    return {
      access_token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        profile: user.profile,
        shadow: user.shadow,
        shadowRank: user.shadowRank,
        verification: user.verification,
      },
    };
  }

  async getCurrentUserIdentity(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        shadow: true,
        shadowRank: true,
        verification: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      profile: user.profile,
      shadow: user.shadow
        ? {
            id: user.shadow.id,
          }
        : null,
      shadowRank: user.shadowRank
        ? {
            id: user.shadowRank.id,
            rankType: user.shadowRank.rankType,
          }
        : null,
      verification: user.verification
        ? {
            id: user.verification.id,
            status: user.verification.status,
          }
        : null,
    };
  }
}
