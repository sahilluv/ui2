import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { SocialModule } from './social/social.module';

@Module({
  imports: [AuthModule, PostsModule, SocialModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
