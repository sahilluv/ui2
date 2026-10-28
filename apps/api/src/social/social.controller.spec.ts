import { UnauthorizedException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.strategy';
import { FollowListQueryDto } from './dto/follow-list-query.dto';
import { SocialController } from './social.controller';
import { SocialService } from './social.service';

describe('SocialController', () => {
  let controller: SocialController;
  let socialService: {
    followUser: jest.Mock;
    unfollowUser: jest.Mock;
    getFollowers: jest.Mock;
    getFollowing: jest.Mock;
    getSocialSummary: jest.Mock;
  };

  beforeEach(() => {
    socialService = {
      followUser: jest.fn(),
      unfollowUser: jest.fn(),
      getFollowers: jest.fn(),
      getFollowing: jest.fn(),
      getSocialSummary: jest.fn(),
    };
    controller = new SocialController(socialService as unknown as SocialService);
  });

  it('rejects unauthenticated requests through JwtAuthGuard', () => {
    const guard = new JwtAuthGuard();
    expect(() => guard.handleRequest(null, null, null)).toThrow(
      UnauthorizedException,
    );
  });

  it('derives acting user id exclusively from req.user.userId on follow', async () => {
    socialService.followUser.mockResolvedValue({ isFollowing: true });

    const req = { user: { userId: 'authenticated-user-123' } };
    const res = await controller.follow(req, 'target-456');

    expect(res).toEqual({ isFollowing: true });
    expect(socialService.followUser).toHaveBeenCalledWith(
      'authenticated-user-123',
      'target-456',
    );
  });

  it('derives acting user id exclusively from req.user.userId on unfollow', async () => {
    socialService.unfollowUser.mockResolvedValue({ isFollowing: false });

    const req = { user: { userId: 'authenticated-user-123' } };
    const res = await controller.unfollow(req, 'target-456');

    expect(res).toEqual({ isFollowing: false });
    expect(socialService.unfollowUser).toHaveBeenCalledWith(
      'authenticated-user-123',
      'target-456',
    );
  });

  it('passes query parameters to getFollowers', async () => {
    const dto: FollowListQueryDto = { limit: 25, cursor: 'cursor-1' };
    socialService.getFollowers.mockResolvedValue({ items: [], nextCursor: null });

    await controller.getFollowers('target-456', dto);

    expect(socialService.getFollowers).toHaveBeenCalledWith('target-456', dto);
  });

  it('passes query parameters to getFollowing', async () => {
    const dto: FollowListQueryDto = { limit: 10, search: 'Alice' };
    socialService.getFollowing.mockResolvedValue({ items: [], nextCursor: null });

    await controller.getFollowing('target-456', dto);

    expect(socialService.getFollowing).toHaveBeenCalledWith('target-456', dto);
  });

  it('derives acting user id exclusively from req.user.userId on social summary', async () => {
    const summary = {
      followerCount: 10,
      followingCount: 5,
      isFollowing: true,
      mutualCount: 2,
      mutualPreview: [],
    };
    socialService.getSocialSummary.mockResolvedValue(summary);

    const req = { user: { userId: 'authenticated-user-123' } };
    const res = await controller.getSocialSummary(req, 'target-456');

    expect(res).toEqual(summary);
    expect(socialService.getSocialSummary).toHaveBeenCalledWith(
      'authenticated-user-123',
      'target-456',
    );
  });
});
