import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { VideoService } from './video.service';

import { Response } from 'express';
import { ReqWithUser } from 'src/types/RequestWithUser';

@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Get('info')
  getInfo(@Query('url') url: string, @Req() req: ReqWithUser) {
    // return this.videoService.getInfo(url);
  }

  @Get('download')
  download(@Res()res:Response ,
  // @Body() {url,type}: {url:string,type:'video'|'audio'},
  @Query('url') url: string,
  @Query('type') type: "video" | "audio"
  ) {
    // console.log(url," ",type)
    return this.videoService.newVideo(url,type,res);
  }
}
