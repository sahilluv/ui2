import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';

const createJwtService = () => ({
  signAsync: jest.fn().mockResolvedValue('mocked-token'),
});

describe('AuthService', () => {
  let prisma: any;
  let authService: AuthService;

  beforeEach(() => {
    prisma = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
      $transaction: jest.fn(),
    };

    authService = new AuthService(
      prisma as PrismaService,
      createJwtService() as any,
    );
  });

  it('registers a new user and returns a signed token', async () => {
    const user = {
      id: 'user-1',
      email: 'alice@example.com',
      name: 'Alice',
      passwordHash: 'hashed-password',
      profile: { id: 'profile-1' },
    };

    prisma.user.findUnique.mockResolvedValue(null);
    prisma.$transaction.mockImplementation(async (cb: any) => cb({
      user: {
        create: jest.fn().mockResolvedValue(user),
      },
    }));

    const result = await authService.register({
      email: 'alice@example.com',
      password: 'Password123',
      name: 'Alice',
    });

    expect(result.access_token).toBe('mocked-token');
    expect(result.user.email).toBe('alice@example.com');
  });

  it('creates Shadow, ShadowRank, and ShadowVerification on registration', async () => {
    const userWithIdentity = {
      id: 'user-1',
      email: 'bob@example.com',
      name: 'Bob',
      passwordHash: 'hashed-password',
      profile: { id: 'profile-1' },
      shadow: { id: 'shadow-1' },
      shadowRank: { id: 'rank-1', rankType: 'PAWN' },
      verification: { id: 'verify-1', status: 'UNVERIFIED' },
    };

    prisma.user.findUnique.mockResolvedValue(null);
    prisma.$transaction.mockImplementation(async (cb: any) => cb({
      user: {
        create: jest.fn().mockResolvedValue(userWithIdentity),
      },
    }));

    const result = await authService.register({
      email: 'bob@example.com',
      password: 'Password123',
    });

    expect(result.user.shadow).toBeDefined();
    expect(result.user.shadowRank).toBeDefined();
    if (result.user.shadowRank) {
      expect(result.user.shadowRank.rankType).toBe('PAWN');
    }
    expect(result.user.verification).toBeDefined();
    if (result.user.verification) {
      expect(result.user.verification.status).toBe('UNVERIFIED');
    }
  });

  it('rejects duplicate email registrations', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 'existing-user' });

    await expect(
      authService.register({
        email: 'taken@example.com',
        password: 'Password123',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('rejects invalid login credentials', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      email: 'alice@example.com',
      passwordHash: 'different-hash',
      name: 'Alice',
      profile: null,
    });

    await expect(
      authService.login({
        email: 'alice@example.com',
        password: 'Password123',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('returns access_token and user identity with shadowRank and verification on successful login', async () => {
    const userWithIdentity = {
      id: 'user-1',
      email: 'alice@example.com',
      passwordHash: await bcrypt.hash('Password123', 4),
      name: 'Alice',
      profile: { id: 'profile-1' },
      shadow: { id: 'shadow-1' },
      shadowRank: { id: 'rank-1', rankType: 'PAWN' },
      verification: { id: 'verify-1', status: 'UNVERIFIED' },
    };

    prisma.user.findUnique.mockResolvedValue(userWithIdentity);

    const result = await authService.login({
      email: 'alice@example.com',
      password: 'Password123',
    });

    expect(result.access_token).toBe('mocked-token');
    expect(result.user.shadowRank).toBeDefined();
    if (result.user.shadowRank) {
      expect(result.user.shadowRank.rankType).toBe('PAWN');
    }
    expect(result.user.verification).toBeDefined();
    if (result.user.verification) {
      expect(result.user.verification.status).toBe('UNVERIFIED');
    }
  });

  describe('getCurrentUserIdentity', () => {
    it('returns the current user identity with Shadow data', async () => {
      const userWithIdentity = {
        id: 'user-1',
        email: 'alice@example.com',
        name: 'Alice',
        passwordHash: 'hashed-password',
        profile: { id: 'profile-1' },
        shadow: { id: 'shadow-1' },
        shadowRank: { id: 'rank-1', rankType: 'PAWN' },
        verification: { id: 'verify-1', status: 'UNVERIFIED' },
      };

      prisma.user.findUnique.mockResolvedValue(userWithIdentity);

      const identity = await authService.getCurrentUserIdentity('user-1');

      expect(identity.id).toBe('user-1');
      expect(identity.email).toBe('alice@example.com');
      expect(identity.name).toBe('Alice');
      if (identity.shadow) {
        expect(identity.shadow.id).toBe('shadow-1');
      }
      if (identity.shadowRank) {
        expect(identity.shadowRank.rankType).toBe('PAWN');
      }
      if (identity.verification) {
        expect(identity.verification.status).toBe('UNVERIFIED');
      }
    });

    it('throws UnauthorizedException if user not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        authService.getCurrentUserIdentity('non-existent'),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('does not expose passwordHash in identity response', async () => {
      const userWithIdentity = {
        id: 'user-1',
        email: 'alice@example.com',
        name: 'Alice',
        passwordHash: 'secret-hash',
        profile: { id: 'profile-1' },
        shadow: { id: 'shadow-1' },
        shadowRank: { id: 'rank-1', rankType: 'PAWN' },
        verification: { id: 'verify-1', status: 'UNVERIFIED' },
      };

      prisma.user.findUnique.mockResolvedValue(userWithIdentity);

      const identity = await authService.getCurrentUserIdentity('user-1');

      const identityStr = JSON.stringify(identity);
      expect(identityStr).not.toContain('secret-hash');
      expect(identityStr).not.toContain('passwordHash');
    });
  });
});

