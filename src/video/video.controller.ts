import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Req,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { VideoService } from './video.service';

import { Response } from 'express';
import { ReqWithUser } from 'src/types/RequestWithUser';
import { GetTokenFromCookiesAndDecode } from 'src/custom/decorators/getCookies.decorator';
import { DeepPartial } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Get('info')
  getInfo(@Query('url') url: string, @Req() req: ReqWithUser) {
    // return this.videoService.getInfo(url);
  }

  @Post('download')
  async download(
    @Res() res: Response,
    @GetTokenFromCookiesAndDecode() user: DeepPartial<User>,
    // @Query('url') url: string,
    // @Query('type') type: 'video' | 'audio',
    @Body() { type, url }: { url: string; type: 'audio' | 'video' },
  ) {
    const { success, error } = await this.videoService.newVideo(
      url,
      type,
      res,
      user,
    );
    if (!success) {
      throw new BadRequestException(error);
    }
    return res.status(200);
  }
}
