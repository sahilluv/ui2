import { BadRequestException, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { PostsService } from './posts.service';

describe('PostsService', () => {
  let prisma: {
    post: {
      create: jest.Mock;
      findMany: jest.Mock;
      findUnique: jest.Mock;
    };
  };
  let postsService: PostsService;

  beforeEach(() => {
    prisma = {
      post: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
      },
    };
    postsService = new PostsService(prisma as unknown as PrismaService);
  });

  it('creates a post for the authenticated user', async () => {
    const createdPost = {
      id: 'post-1',
      content: 'Hello campus',
      author: { id: 'user-1', name: 'Alice' },
      createdAt: new Date('2026-09-03T10:00:00.000Z'),
      updatedAt: new Date('2026-09-03T10:00:00.000Z'),
    };
    prisma.post.create.mockResolvedValue(createdPost);

    const result = await postsService.create('user-1', {
      content: '  Hello campus  ',
    });

    expect(result).toEqual(createdPost);
    expect(prisma.post.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { authorId: 'user-1', content: 'Hello campus' },
      }),
    );
  });

  it('does not use a client-supplied authorId', async () => {
    prisma.post.create.mockResolvedValue({});

    await postsService.create('user-1', {
      content: 'Own post',
      authorId: 'user-2',
    } as CreatePostDto & { authorId: string });

    expect(prisma.post.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { authorId: 'user-1', content: 'Own post' },
      }),
    );
  });

  it('rejects empty content', async () => {
    await expect(
      postsService.create('user-1', { content: '   ' }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects invalid DTO content', async () => {
    const emptyDto = plainToInstance(CreatePostDto, { content: '   ' });
    const longDto = plainToInstance(CreatePostDto, {
      content: 'a'.repeat(281),
    });

    expect(await validate(emptyDto)).not.toHaveLength(0);
    expect(await validate(longDto)).not.toHaveLength(0);
  });

  it('returns feed posts newest first with a next cursor', async () => {
    const newest = {
      id: 'post-2',
      content: 'Newest',
      author: { id: 'user-1', name: 'Alice' },
      createdAt: new Date('2026-09-03T11:00:00.000Z'),
      updatedAt: new Date('2026-09-03T11:00:00.000Z'),
    };
    const older = {
      id: 'post-1',
      content: 'Older',
      author: { id: 'user-2', name: 'Bob' },
      createdAt: new Date('2026-09-03T10:00:00.000Z'),
      updatedAt: new Date('2026-09-03T10:00:00.000Z'),
    };
    const extra = {
      id: 'post-0',
      content: 'Extra',
      author: { id: 'user-3', name: 'Cara' },
      createdAt: new Date('2026-09-03T09:00:00.000Z'),
      updatedAt: new Date('2026-09-03T09:00:00.000Z'),
    };
    prisma.post.findMany.mockResolvedValue([newest, older, extra]);

    const result = await postsService.getFeed(2);

    expect(result.items).toEqual([newest, older]);
    expect(result.nextCursor).toEqual(expect.any(String));
    expect(prisma.post.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        take: 3,
      }),
    );
  });

  it('uses the cursor boundary for the next page', async () => {
    const older = {
      id: 'post-1',
      content: 'Older',
      author: { id: 'user-2', name: 'Bob' },
      createdAt: new Date('2026-09-03T10:00:00.000Z'),
      updatedAt: new Date('2026-09-03T10:00:00.000Z'),
    };
    prisma.post.findMany
      .mockResolvedValueOnce([
        {
          id: 'post-2',
          content: 'Newest',
          author: { id: 'user-1', name: 'Alice' },
          createdAt: new Date('2026-09-03T11:00:00.000Z'),
          updatedAt: new Date('2026-09-03T11:00:00.000Z'),
        },
        older,
      ])
      .mockResolvedValueOnce([older]);

    const firstPage = await postsService.getFeed(1);
    await postsService.getFeed(1, firstPage.nextCursor ?? undefined);

    expect(prisma.post.findMany).toHaveBeenLastCalledWith(
      expect.objectContaining({
        where: {
          OR: [
            { createdAt: { lt: '2026-09-03T11:00:00.000Z' } },
            {
              createdAt: '2026-09-03T11:00:00.000Z',
              id: { lt: 'post-2' },
            },
          ],
        },
      }),
    );
  });

  it('returns a post by id', async () => {
    const post = {
      id: 'post-1',
      content: 'Hello campus',
      author: { id: 'user-1', name: 'Alice' },
    };
    prisma.post.findUnique.mockResolvedValue(post);

    await expect(postsService.getById('post-1')).resolves.toEqual(post);
  });

  it('throws when a post does not exist', async () => {
    prisma.post.findUnique.mockResolvedValue(null);

    await expect(postsService.getById('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
