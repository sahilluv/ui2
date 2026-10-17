import { UnauthorizedException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.strategy';
import { CreatePostDto } from './dto/create-post.dto';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

describe('PostsController', () => {
  let controller: PostsController;
  let postsService: {
    create: jest.Mock;
    getFeed: jest.Mock;
    getById: jest.Mock;
  };

  beforeEach(() => {
    postsService = {
      create: jest.fn(),
      getFeed: jest.fn(),
      getById: jest.fn(),
    };
    controller = new PostsController(postsService as unknown as PostsService);
  });

  it('creates a post using the authenticated request user', async () => {
    const dto: CreatePostDto = { content: 'Hello campus' };
    postsService.create.mockResolvedValue({ id: 'post-1' });

    await expect(
      controller.create({ user: { userId: 'user-1' } }, dto),
    ).resolves.toEqual({ id: 'post-1' });
    expect(postsService.create).toHaveBeenCalledWith('user-1', dto);
  });

  it('passes feed query values to the service', async () => {
    postsService.getFeed.mockResolvedValue({ items: [], nextCursor: null });

    await controller.getFeed({ limit: 10, cursor: 'cursor-1' });

    expect(postsService.getFeed).toHaveBeenCalledWith(10, 'cursor-1');
  });

  it('returns a 401 when the JWT guard has no authenticated user', () => {
    const guard = new JwtAuthGuard();

    expect(() => guard.handleRequest(null, null, null)).toThrow(
      UnauthorizedException,
    );
  });

  it('returns a post by id through the service', async () => {
    postsService.getById.mockResolvedValue({ id: 'post-1' });

    await expect(controller.getById('post-1')).resolves.toEqual({
      id: 'post-1',
    });
  });
});
