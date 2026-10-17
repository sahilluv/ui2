import { UnauthorizedException } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(() => {
    authService = {
      register: jest.fn(),
      login: jest.fn(),
      getCurrentUserIdentity: jest.fn(),
    } as any;

    controller = new AuthController(authService);
  });

  describe('/auth/me', () => {
    it('returns the current user identity when authenticated', async () => {
      const mockIdentity = {
        id: 'user-1',
        email: 'alice@example.com',
        name: 'Alice',
        profile: { id: 'profile-1' },
        shadow: { id: 'shadow-1' },
        shadowRank: { id: 'rank-1', rankType: 'PAWN' },
        verification: { id: 'verify-1', status: 'UNVERIFIED' },
      };

      (authService.getCurrentUserIdentity as jest.Mock).mockResolvedValue(
        mockIdentity,
      );

      const result = await controller.getMe({
        user: { userId: 'user-1' },
      });

      expect(result).toEqual(mockIdentity);
      expect(authService.getCurrentUserIdentity).toHaveBeenCalledWith('user-1');
    });

    it('throws UnauthorizedException if user not found', async () => {
      (authService.getCurrentUserIdentity as jest.Mock).mockRejectedValue(
        new UnauthorizedException('User not found'),
      );

      await expect(
        controller.getMe({
          user: { userId: 'non-existent' },
        }),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('exposes rank and verification as read-only identity data', async () => {
      const mockIdentity = {
        id: 'user-1',
        email: 'alice@example.com',
        profile: { id: 'profile-1' },
        shadow: { id: 'shadow-1' },
        shadowRank: { id: 'rank-1', rankType: 'PAWN' },
        verification: { id: 'verify-1', status: 'UNVERIFIED' },
      };

      (authService.getCurrentUserIdentity as jest.Mock).mockResolvedValue(
        mockIdentity,
      );

      const result = await controller.getMe({
        user: { userId: 'user-1' },
      });

      if (result.shadowRank) {
        expect(result.shadowRank.rankType).toBe('PAWN');
      }
      if (result.verification) {
        expect(result.verification.status).toBe('UNVERIFIED');
      }
    });
  });
});
