import { Controller, Get, Render, Req, UseGuards } from '@nestjs/common';
import { DeepPartial } from 'typeorm';
import { AppService } from './app.service';
import { User } from './user/entities/user.entity';
import { GetTokenFromCookiesAndDecode } from './custom/decorators/getCookies.decorator';
import { AuthGuard } from '@nestjs/passport';
import { ReqWithUser } from './types/RequestWithUser';
import { JwtAuthGuard } from './auth/jwt.gaurd';
import { Video } from './video/entities/video.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  Authed(@GetTokenFromCookiesAndDecode() user: DeepPartial<User>): Promise<{
    authed: boolean;
    user?: DeepPartial<User>;
    videos?: DeepPartial<Video>[];
  }> {
    return this.appService.Authed(user);
  }

  @Get('history')
  @UseGuards(JwtAuthGuard)
  @Render('history')
  renderHistory(@Req() req: ReqWithUser) {
    return this.appService.getHistory(req.user);
  }
}
