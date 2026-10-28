import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { SocialService } from './social.service';

describe('SocialService', () => {
  let prisma: {
    user: {
      findUnique: jest.Mock;
      count: jest.Mock;
      findMany: jest.Mock;
    };
    follow: {
      upsert: jest.Mock;
      findUnique: jest.Mock;
      deleteMany: jest.Mock;
      findMany: jest.Mock;
      count: jest.Mock;
    };
    $transaction: jest.Mock;
  };
  let socialService: SocialService;

  beforeEach(() => {
    prisma = {
      user: {
        findUnique: jest.fn(),
        count: jest.fn(),
        findMany: jest.fn(),
      },
      follow: {
        upsert: jest.fn(),
        findUnique: jest.fn(),
        deleteMany: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
      },
      $transaction: jest.fn(),
    };
    socialService = new SocialService(prisma as unknown as PrismaService);
  });

  describe('followUser', () => {
    it('rejects self-follow with HTTP 400', async () => {
      await expect(
        socialService.followUser('user-1', 'user-1'),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('throws 404 if target user does not exist', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        socialService.followUser('user-1', 'missing-user'),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('creates or verifies follow idempotently', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'target-1' });
      prisma.follow.upsert.mockResolvedValue({
        id: 'f-1',
        followerId: 'user-1',
        followingId: 'target-1',
      });

      const res = await socialService.followUser('user-1', 'target-1');
      expect(res).toEqual({ isFollowing: true });
      expect(prisma.follow.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            followerId_followingId: {
              followerId: 'user-1',
              followingId: 'target-1',
            },
          },
        }),
      );
    });

    it('handles concurrent P2002 conflict and returns isFollowing: true if relation exists', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'target-1' });
      const p2002Error = new Prisma.PrismaClientKnownRequestError(
        'Unique constraint violation',
        {
          code: 'P2002',
          clientVersion: '7.9.1',
          meta: { target: ['followerId', 'followingId'] },
        },
      );
      prisma.follow.upsert.mockRejectedValue(p2002Error);
      prisma.follow.findUnique.mockResolvedValue({ id: 'f-existing' });

      const res = await socialService.followUser('user-1', 'target-1');
      expect(res).toEqual({ isFollowing: true });
      expect(prisma.follow.findUnique).toHaveBeenCalled();
    });

    it('re-throws P2002 if the verified relation does not exist', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'target-1' });
      const p2002Error = new Prisma.PrismaClientKnownRequestError(
        'Unique constraint violation',
        {
          code: 'P2002',
          clientVersion: '7.9.1',
          meta: { target: ['followerId', 'followingId'] },
        },
      );
      prisma.follow.upsert.mockRejectedValue(p2002Error);
      prisma.follow.findUnique.mockResolvedValue(null);

      await expect(
        socialService.followUser('user-1', 'target-1'),
      ).rejects.toThrow(p2002Error);
    });

    it('re-throws unrelated errors', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'target-1' });
      const genericError = new Error('Database connection dropped');
      prisma.follow.upsert.mockRejectedValue(genericError);

      await expect(
        socialService.followUser('user-1', 'target-1'),
      ).rejects.toThrow(genericError);
    });
  });

  describe('unfollowUser', () => {
    it('rejects self-unfollow with HTTP 400', async () => {
      await expect(
        socialService.unfollowUser('user-1', 'user-1'),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('throws 404 if target user does not exist', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        socialService.unfollowUser('user-1', 'missing-user'),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('unfollows user idempotently using deleteMany', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'target-1' });
      prisma.follow.deleteMany.mockResolvedValue({ count: 1 });

      const res = await socialService.unfollowUser('user-1', 'target-1');
      expect(res).toEqual({ isFollowing: false });
      expect(prisma.follow.deleteMany).toHaveBeenCalledWith({
        where: {
          followerId: 'user-1',
          followingId: 'target-1',
        },
      });
    });

    it('returns isFollowing: false even if 0 rows were deleted', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'target-1' });
      prisma.follow.deleteMany.mockResolvedValue({ count: 0 });

      const res = await socialService.unfollowUser('user-1', 'target-1');
      expect(res).toEqual({ isFollowing: false });
    });
  });

  describe('getFollowers & getFollowing cursor pagination', () => {
    it('throws 404 when querying followers of nonexistent user', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        socialService.getFollowers('missing', { limit: 20 }),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('throws 404 when querying following of nonexistent user', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        socialService.getFollowing('missing', { limit: 20 }),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('queries followers with limit+1 and constructs nextCursor without leaking email or password', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'target-1' });
      const row1 = {
        id: 'f-1',
        createdAt: new Date('2026-10-22T10:00:00.000Z'),
        follower: {
          id: 'u-1',
          name: 'Alice',
          profile: { avatarUrl: 'https://example.com/a.jpg', bio: 'Hello' },
          shadowRank: { rankType: 'QUEEN' },
          verification: { status: 'VERIFIED' },
        },
      };
      const row2 = {
        id: 'f-2',
        createdAt: new Date('2026-10-22T09:00:00.000Z'),
        follower: {
          id: 'u-2',
          name: 'Bob',
          profile: null,
          shadowRank: null,
          verification: null,
        },
      };
      const extraRow = {
        id: 'f-3',
        createdAt: new Date('2026-10-22T08:00:00.000Z'),
        follower: {
          id: 'u-3',
          name: 'Charlie',
          profile: null,
          shadowRank: null,
          verification: null,
        },
      };
      prisma.follow.findMany.mockResolvedValue([row1, row2, extraRow]);

      const res = await socialService.getFollowers('target-1', { limit: 2 });
      expect(res.items).toHaveLength(2);
      expect(res.items[0].user).toEqual({
        id: 'u-1',
        name: 'Alice',
        avatarUrl: 'https://example.com/a.jpg',
        bio: 'Hello',
        rankType: 'QUEEN',
        verificationStatus: 'VERIFIED',
      });
      expect(res.items[1].user).toEqual({
        id: 'u-2',
        name: 'Bob',
        avatarUrl: null,
        bio: null,
        rankType: 'PAWN',
        verificationStatus: 'UNVERIFIED',
      });
      // Verification: no email or password
      expect((res.items[0].user as any).email).toBeUndefined();
      expect((res.items[0].user as any).passwordHash).toBeUndefined();

      expect(res.nextCursor).toBeDefined();
      expect(typeof res.nextCursor).toBe('string');
      // Cursor was derived from row2 (last returned item), not extraRow
      const decoded = socialService.decodeAndValidateCursor(res.nextCursor!);
      expect(decoded?.id).toBe('f-2');
      expect(decoded?.createdAt.toISOString()).toBe('2026-10-22T09:00:00.000Z');
    });

    it('returns nextCursor: null when results are within limit', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'target-1' });
      prisma.follow.findMany.mockResolvedValue([]);

      const res = await socialService.getFollowers('target-1', { limit: 20 });
      expect(res.items).toHaveLength(0);
      expect(res.nextCursor).toBeNull();
    });

    it('applies name search mode: insensitive and cursor predicate in explicit AND clauses', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'target-1' });
      prisma.follow.findMany.mockResolvedValue([]);

      const cursor = socialService.encodeCursor(
        new Date('2026-10-22T10:00:00.000Z'),
        'f-prior',
      );
      await socialService.getFollowers('target-1', {
        limit: 10,
        search: 'Alice',
        cursor,
      });

      expect(prisma.follow.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            AND: [
              { followingId: 'target-1' },
              {
                follower: {
                  name: {
                    contains: 'Alice',
                    mode: 'insensitive',
                  },
                },
              },
              {
                OR: [
                  { createdAt: { lt: new Date('2026-10-22T10:00:00.000Z') } },
                  {
                    createdAt: new Date('2026-10-22T10:00:00.000Z'),
                    id: { lt: 'f-prior' },
                  },
                ],
              },
            ],
          },
          orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
          take: 11,
        }),
      );
    });
  });

  describe('cursor decoding & validation', () => {
    it('encodes and decodes valid cursors correctly', () => {
      const date = new Date('2026-10-22T15:30:00.123Z');
      const encoded = socialService.encodeCursor(date, 'cursor-id-123');
      const decoded = socialService.decodeAndValidateCursor(encoded);

      expect(decoded).toBeDefined();
      expect(decoded?.id).toBe('cursor-id-123');
      expect(decoded?.createdAt.toISOString()).toBe('2026-10-22T15:30:00.123Z');
    });

    it('rejects invalid Base64URL characters', () => {
      expect(() =>
        socialService.decodeAndValidateCursor('invalid+chars/=='),
      ).toThrow(BadRequestException);
    });

    it('rejects non-canonical Base64URL encoding', () => {
      // In unpadded base64url, length 4k+1 is invalid
      expect(() =>
        socialService.decodeAndValidateCursor('abcde'),
      ).toThrow(BadRequestException);
    });

    it('rejects impossible calendar dates (e.g. Feb 29 in non-leap year)', () => {
      const impossibleDateJson = JSON.stringify({
        createdAt: '2026-02-29T12:00:00.000Z',
        id: 'id-1',
      });
      const encoded = Buffer.from(impossibleDateJson, 'utf8').toString('base64url');

      expect(() =>
        socialService.decodeAndValidateCursor(encoded),
      ).toThrow(BadRequestException);
    });

    it('rejects non-canonical timestamps (missing milliseconds or offset)', () => {
      const noMsJson = JSON.stringify({
        createdAt: '2026-10-22T12:00:00Z',
        id: 'id-1',
      });
      const encoded = Buffer.from(noMsJson, 'utf8').toString('base64url');

      expect(() =>
        socialService.decodeAndValidateCursor(encoded),
      ).toThrow(BadRequestException);
    });

    it('rejects missing or empty id', () => {
      const missingIdJson = JSON.stringify({
        createdAt: '2026-10-22T12:00:00.000Z',
        id: '   ',
      });
      const encoded = Buffer.from(missingIdJson, 'utf8').toString('base64url');

      expect(() =>
        socialService.decodeAndValidateCursor(encoded),
      ).toThrow(BadRequestException);
    });
  });

  describe('getSocialSummary', () => {
    it('throws 404 if target user does not exist', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        socialService.getSocialSummary('viewer-1', 'missing-user'),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('returns summary with mutuals for another user via RepeatableRead transaction', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'target-1' });
      prisma.follow.count
        .mockResolvedValueOnce(42) // followerCount
        .mockResolvedValueOnce(18); // followingCount
      prisma.follow.findUnique.mockResolvedValue({ id: 'follow-rec' }); // isFollowing

      const previewUsers = [
        {
          id: 'mutual-1',
          name: 'Elena',
          profile: { avatarUrl: 'https://example.com/elena.jpg' },
          shadowRank: { rankType: 'BISHOP' },
          verification: { status: 'VERIFIED' },
        },
      ];

      prisma.$transaction.mockImplementation(async (callback, options) => {
        expect(options).toEqual({
          isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead,
        });
        const tx = {
          user: {
            count: jest.fn().mockResolvedValue(1),
            findMany: jest.fn().mockResolvedValue(previewUsers),
          },
        };
        return callback(tx);
      });

      const res = await socialService.getSocialSummary('viewer-1', 'target-1');

      expect(res).toEqual({
        followerCount: 42,
        followingCount: 18,
        isFollowing: true,
        mutualCount: 1,
        mutualPreview: [
          {
            id: 'mutual-1',
            name: 'Elena',
            avatarUrl: 'https://example.com/elena.jpg',
            rankType: 'BISHOP',
            verificationStatus: 'VERIFIED',
          },
        ],
      });
    });

    it('returns mutualCount: 0 and empty preview when viewing own profile', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'user-1' });
      prisma.follow.count
        .mockResolvedValueOnce(10)
        .mockResolvedValueOnce(5);

      const res = await socialService.getSocialSummary('user-1', 'user-1');

      expect(res.isFollowing).toBe(false);
      expect(res.mutualCount).toBe(0);
      expect(res.mutualPreview).toEqual([]);
      expect(prisma.$transaction).not.toHaveBeenCalled();
    });
  });
});
