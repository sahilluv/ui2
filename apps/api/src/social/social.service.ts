import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { FollowListQueryDto } from './dto/follow-list-query.dto';

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;

export type ValidatedCursor = {
  createdAt: Date;
  id: string;
};

export type PublicUserSummary = {
  id: string;
  name: string | null;
  avatarUrl: string | null;
  bio?: string | null;
  rankType: 'PAWN' | 'KNIGHT' | 'BISHOP' | 'ROOK' | 'QUEEN' | 'KING';
  verificationStatus: 'UNVERIFIED' | 'VERIFIED';
};

export type FollowListItem = {
  followId: string;
  followedAt: string;
  user: PublicUserSummary;
};

export type PaginatedFollowResponse = {
  items: FollowListItem[];
  nextCursor: string | null;
};

export type SocialSummaryResponse = {
  followerCount: number;
  followingCount: number;
  isFollowing: boolean;
  mutualCount: number;
  mutualPreview: Array<{
    id: string;
    name: string | null;
    avatarUrl: string | null;
    rankType: 'PAWN' | 'KNIGHT' | 'BISHOP' | 'ROOK' | 'QUEEN' | 'KING';
    verificationStatus: 'UNVERIFIED' | 'VERIFIED';
  }>;
};

@Injectable()
export class SocialService {
  constructor(private readonly prisma: PrismaService) {}

  async followUser(viewerId: string, targetUserId: string): Promise<{ isFollowing: true }> {
    if (viewerId === targetUserId) {
      throw new BadRequestException('Cannot follow yourself');
    }

    await this.assertUserExists(targetUserId);

    try {
      await this.prisma.follow.upsert({
        where: {
          followerId_followingId: {
            followerId: viewerId,
            followingId: targetUserId,
          },
        },
        create: {
          followerId: viewerId,
          followingId: targetUserId,
        },
        update: {},
      });
    } catch (error: any) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        const targetMeta = (error.meta?.target as string[] | string) ?? '';
        const isExpectedIndex = Array.isArray(targetMeta)
          ? targetMeta.includes('followerId') && targetMeta.includes('followingId')
          : typeof targetMeta === 'string' &&
            (targetMeta.includes('followerId') ||
              targetMeta.includes('Follow_followerId_followingId_key'));

        if (isExpectedIndex) {
          const verifyExisting = await this.prisma.follow.findUnique({
            where: {
              followerId_followingId: {
                followerId: viewerId,
                followingId: targetUserId,
              },
            },
            select: { id: true },
          });

          if (verifyExisting) {
            return { isFollowing: true };
          }
        }
      }
      throw error;
    }

    return { isFollowing: true };
  }

  async unfollowUser(viewerId: string, targetUserId: string): Promise<{ isFollowing: false }> {
    if (viewerId === targetUserId) {
      throw new BadRequestException('Cannot unfollow yourself');
    }

    await this.assertUserExists(targetUserId);

    await this.prisma.follow.deleteMany({
      where: {
        followerId: viewerId,
        followingId: targetUserId,
      },
    });

    return { isFollowing: false };
  }

  async getFollowers(
    targetUserId: string,
    query: FollowListQueryDto,
  ): Promise<PaginatedFollowResponse> {
    await this.assertUserExists(targetUserId);

    const take = Math.min(Math.max(query.limit ?? DEFAULT_LIMIT, 1), MAX_LIMIT);
    const decodedCursor = this.decodeAndValidateCursor(query.cursor);

    const andClauses: Prisma.FollowWhereInput[] = [
      { followingId: targetUserId },
    ];

    if (query.search?.trim()) {
      andClauses.push({
        follower: {
          name: {
            contains: query.search.trim(),
            mode: 'insensitive',
          },
        },
      });
    }

    if (decodedCursor) {
      andClauses.push({
        OR: [
          { createdAt: { lt: decodedCursor.createdAt } },
          {
            createdAt: decodedCursor.createdAt,
            id: { lt: decodedCursor.id },
          },
        ],
      });
    }

    const rows = await this.prisma.follow.findMany({
      where: { AND: andClauses },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: take + 1,
      select: {
        id: true,
        createdAt: true,
        follower: {
          select: {
            id: true,
            name: true,
            profile: {
              select: {
                avatarUrl: true,
                bio: true,
              },
            },
            shadowRank: {
              select: {
                rankType: true,
              },
            },
            verification: {
              select: {
                status: true,
              },
            },
          },
        },
      },
    });

    const hasNextPage = rows.length > take;
    const items = hasNextPage ? rows.slice(0, take) : rows;
    const lastItem = items.at(-1);

    return {
      items: items.map((f) => ({
        followId: f.id,
        followedAt: f.createdAt.toISOString(),
        user: {
          id: f.follower.id,
          name: f.follower.name,
          avatarUrl: f.follower.profile?.avatarUrl ?? null,
          bio: f.follower.profile?.bio ?? null,
          rankType: f.follower.shadowRank?.rankType ?? 'PAWN',
          verificationStatus: f.follower.verification?.status ?? 'UNVERIFIED',
        },
      })),
      nextCursor:
        hasNextPage && lastItem
          ? this.encodeCursor(lastItem.createdAt, lastItem.id)
          : null,
    };
  }

  async getFollowing(
    targetUserId: string,
    query: FollowListQueryDto,
  ): Promise<PaginatedFollowResponse> {
    await this.assertUserExists(targetUserId);

    const take = Math.min(Math.max(query.limit ?? DEFAULT_LIMIT, 1), MAX_LIMIT);
    const decodedCursor = this.decodeAndValidateCursor(query.cursor);

    const andClauses: Prisma.FollowWhereInput[] = [
      { followerId: targetUserId },
    ];

    if (query.search?.trim()) {
      andClauses.push({
        following: {
          name: {
            contains: query.search.trim(),
            mode: 'insensitive',
          },
        },
      });
    }

    if (decodedCursor) {
      andClauses.push({
        OR: [
          { createdAt: { lt: decodedCursor.createdAt } },
          {
            createdAt: decodedCursor.createdAt,
            id: { lt: decodedCursor.id },
          },
        ],
      });
    }

    const rows = await this.prisma.follow.findMany({
      where: { AND: andClauses },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: take + 1,
      select: {
        id: true,
        createdAt: true,
        following: {
          select: {
            id: true,
            name: true,
            profile: {
              select: {
                avatarUrl: true,
                bio: true,
              },
            },
            shadowRank: {
              select: {
                rankType: true,
              },
            },
            verification: {
              select: {
                status: true,
              },
            },
          },
        },
      },
    });

    const hasNextPage = rows.length > take;
    const items = hasNextPage ? rows.slice(0, take) : rows;
    const lastItem = items.at(-1);

    return {
      items: items.map((f) => ({
        followId: f.id,
        followedAt: f.createdAt.toISOString(),
        user: {
          id: f.following.id,
          name: f.following.name,
          avatarUrl: f.following.profile?.avatarUrl ?? null,
          bio: f.following.profile?.bio ?? null,
          rankType: f.following.shadowRank?.rankType ?? 'PAWN',
          verificationStatus: f.following.verification?.status ?? 'UNVERIFIED',
        },
      })),
      nextCursor:
        hasNextPage && lastItem
          ? this.encodeCursor(lastItem.createdAt, lastItem.id)
          : null,
    };
  }

  async getSocialSummary(
    viewerId: string,
    targetUserId: string,
  ): Promise<SocialSummaryResponse> {
    await this.assertUserExists(targetUserId);

    const followerCountPromise = this.prisma.follow.count({
      where: { followingId: targetUserId },
    });

    const followingCountPromise = this.prisma.follow.count({
      where: { followerId: targetUserId },
    });

    const isFollowingPromise =
      viewerId === targetUserId
        ? Promise.resolve(false)
        : this.prisma.follow
            .findUnique({
              where: {
                followerId_followingId: {
                  followerId: viewerId,
                  followingId: targetUserId,
                },
              },
              select: { id: true },
            })
            .then((record) => Boolean(record));

    let mutualCount = 0;
    let mutualPreview: SocialSummaryResponse['mutualPreview'] = [];

    if (viewerId !== targetUserId) {
      const mutualWhere: Prisma.UserWhereInput = {
        AND: [
          { id: { notIn: [viewerId, targetUserId] } },
          { followers: { some: { followerId: viewerId } } },
          { following: { some: { followingId: targetUserId } } },
        ],
      };

      const [count, previewUsers] = await this.prisma.$transaction(
        async (tx) => {
          const c = await tx.user.count({ where: mutualWhere });
          const p = await tx.user.findMany({
            where: mutualWhere,
            take: 3,
            orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
            select: {
              id: true,
              name: true,
              profile: {
                select: {
                  avatarUrl: true,
                },
              },
              shadowRank: {
                select: {
                  rankType: true,
                },
              },
              verification: {
                select: {
                  status: true,
                },
              },
            },
          });
          return [c, p] as const;
        },
        {
          isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead,
        },
      );

      mutualCount = count;
      mutualPreview = previewUsers.map((u) => ({
        id: u.id,
        name: u.name,
        avatarUrl: u.profile?.avatarUrl ?? null,
        rankType: (u.shadowRank?.rankType as any) ?? 'PAWN',
        verificationStatus: (u.verification?.status as any) ?? 'UNVERIFIED',
      }));
    }

    const [followerCount, followingCount, isFollowing] = await Promise.all([
      followerCountPromise,
      followingCountPromise,
      isFollowingPromise,
    ]);

    return {
      followerCount,
      followingCount,
      isFollowing,
      mutualCount,
      mutualPreview,
    };
  }

  private async assertUserExists(userId: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
  }

  encodeCursor(createdAt: Date, id: string): string {
    const cursor = {
      createdAt: createdAt.toISOString(),
      id,
    };
    return Buffer.from(JSON.stringify(cursor), 'utf8').toString('base64url');
  }

  decodeAndValidateCursor(rawCursor?: string): ValidatedCursor | undefined {
    if (!rawCursor) return undefined;

    try {
      // 1. Base64URL character set & non-empty & valid length check
      if (
        typeof rawCursor !== 'string' ||
        rawCursor.trim().length === 0 ||
        !/^[A-Za-z0-9_-]+$/.test(rawCursor) ||
        rawCursor.length % 4 === 1
      ) {
        throw new Error('Malformed Base64URL string');
      }

      const buffer = Buffer.from(rawCursor, 'base64url');

      // Canonical re-encoding check (rejects non-canonical padding/trailing bits)
      if (buffer.toString('base64url') !== rawCursor) {
        throw new Error('Non-canonical Base64URL encoding');
      }

      // 2. Strict UTF-8 validation
      const textDecoder = new TextDecoder('utf-8', { fatal: true });
      const rawJson = textDecoder.decode(buffer);

      // 3. Valid JSON object
      const parsed = JSON.parse(rawJson);
      if (
        typeof parsed !== 'object' ||
        parsed === null ||
        Array.isArray(parsed)
      ) {
        throw new Error('Cursor must be a JSON object');
      }

      const keys = Object.keys(parsed);
      if (
        keys.length !== 2 ||
        !keys.includes('createdAt') ||
        !keys.includes('id')
      ) {
        throw new Error('Cursor must contain exactly createdAt and id');
      }

      // 4. Non-empty string ID
      if (typeof parsed.id !== 'string' || parsed.id.trim().length === 0) {
        throw new Error('Cursor id must be a non-empty string');
      }

      // 5. Strict canonical UTC timestamp format (exact 3 millisecond digits)
      const isoUtcRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
      if (
        typeof parsed.createdAt !== 'string' ||
        !isoUtcRegex.test(parsed.createdAt)
      ) {
        throw new Error('Cursor createdAt must match YYYY-MM-DDTHH:mm:ss.sssZ');
      }

      const date = new Date(parsed.createdAt);
      if (
        Number.isNaN(date.getTime()) ||
        date.toISOString() !== parsed.createdAt
      ) {
        throw new Error('Cursor createdAt represents an impossible calendar date');
      }

      return {
        createdAt: date,
        id: parsed.id.trim(),
      };
    } catch {
      throw new BadRequestException('Invalid pagination cursor');
    }
  }
}
