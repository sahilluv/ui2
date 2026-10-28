import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.strategy';
import { FollowListQueryDto } from './dto/follow-list-query.dto';
import { SocialService } from './social.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class SocialController {
  constructor(private readonly socialService: SocialService) {}

  @Post(':id/follow')
  follow(@Request() req: any, @Param('id') targetUserId: string) {
    return this.socialService.followUser(req.user.userId, targetUserId);
  }

  @Delete(':id/follow')
  unfollow(@Request() req: any, @Param('id') targetUserId: string) {
    return this.socialService.unfollowUser(req.user.userId, targetUserId);
  }

  @Get(':id/followers')
  getFollowers(
    @Param('id') targetUserId: string,
    @Query() query: FollowListQueryDto,
  ) {
    return this.socialService.getFollowers(targetUserId, query);
  }

  @Get(':id/following')
  getFollowing(
    @Param('id') targetUserId: string,
    @Query() query: FollowListQueryDto,
  ) {
    return this.socialService.getFollowing(targetUserId, query);
  }

  @Get(':id/social-summary')
  getSocialSummary(
    @Request() req: any,
    @Param('id') targetUserId: string,
  ) {
    return this.socialService.getSocialSummary(req.user.userId, targetUserId);
  }
}
