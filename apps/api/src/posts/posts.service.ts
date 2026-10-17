import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';

const DEFAULT_FEED_LIMIT = 20;
const MAX_FEED_LIMIT = 50;

type FeedCursor = {
  createdAt: string;
  id: string;
};

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreatePostDto) {
    const content = dto.content.trim();
    if (!content) {
      throw new BadRequestException('Post content cannot be empty');
    }

    return this.prisma.post.create({
      data: {
        authorId: userId,
        content,
      },
      select: this.postSelect,
    });
  }

  async getFeed(limit = DEFAULT_FEED_LIMIT, cursor?: string) {
    const take = Math.min(Math.max(limit, 1), MAX_FEED_LIMIT);
    const decodedCursor = cursor ? this.decodeCursor(cursor) : undefined;
    const posts = await this.prisma.post.findMany({
      where: decodedCursor
        ? {
            OR: [
              { createdAt: { lt: decodedCursor.createdAt } },
              {
                createdAt: decodedCursor.createdAt,
                id: { lt: decodedCursor.id },
              },
            ],
          }
        : undefined,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: take + 1,
      select: this.postSelect,
    });

    const hasNextPage = posts.length > take;
    const items = hasNextPage ? posts.slice(0, take) : posts;
    const lastPost = items.at(-1);

    return {
      items,
      nextCursor:
        hasNextPage && lastPost
          ? this.encodeCursor(lastPost.createdAt, lastPost.id)
          : null,
    };
  }

  async getById(id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      select: this.postSelect,
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  private readonly postSelect = {
    id: true,
    content: true,
    createdAt: true,
    updatedAt: true,
    author: {
      select: {
        id: true,
        name: true,
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
  } as const;

  private encodeCursor(createdAt: Date, id: string) {
    const cursor: FeedCursor = {
      createdAt: createdAt.toISOString(),
      id,
    };
    return Buffer.from(JSON.stringify(cursor), 'utf8').toString('base64url');
  }

  private decodeCursor(value: string): FeedCursor {
    try {
      const parsed = JSON.parse(
        Buffer.from(value, 'base64url').toString('utf8'),
      ) as Partial<FeedCursor>;
      const createdAt = new Date(parsed.createdAt ?? '');

      if (
        typeof parsed.id !== 'string' ||
        !parsed.id ||
        !parsed.createdAt ||
        Number.isNaN(createdAt.getTime())
      ) {
        throw new Error('Invalid cursor');
      }

      return {
        createdAt: createdAt.toISOString(),
        id: parsed.id,
      };
    } catch {
      throw new BadRequestException('Invalid feed cursor');
    }
  }
}
