import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Req,
  Res,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { VideoService } from './video.service';

import { Response } from 'express';
import { ReqWithUser } from 'src/types/RequestWithUser';
import { GetTokenFromCookiesAndDecode } from 'src/custom/decorators/getCookies.decorator';
import { DeepPartial } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import * as ejs from 'ejs';
import * as fs from 'fs';

@Controller('video')
export class VideoController {
  constructor(
    private readonly videoService: VideoService,
    @Inject('ejs') private ejsService: typeof ejs,
  ) {}

  @Get('info')
  async getInfo(@Query('url') url: string): Promise<{
    success: boolean;
    error?: string;
    html?: string;
  }> {
    const { success, error, info } = await this.videoService.getInfoAndFormats(
      url,
    );
    if (!success) return { success, error };
    const html = await this.ejsService.renderFile(
      __dirname + '../../../views/partials/modal.ejs',
      { info: info },
      { client: true },
    );
    return { success, html };
  }

  @Post('download')
  async download(
    @Res() res: Response,
    @GetTokenFromCookiesAndDecode() user: DeepPartial<User>,
    @Body() { itag, url }: { url: string; itag: number },
  ) {
    const { success, error } = await this.videoService.newVideo(
      url,
      itag,
      res,
      user,
    );
    if (!success) {
      throw new BadRequestException(error);
    }
    return res.status(200);
  }
}
