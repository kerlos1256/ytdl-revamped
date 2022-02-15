import { Inject, Injectable } from '@nestjs/common';
import { Response } from 'express';
import { User } from 'src/user/entities/user.entity';
import { DeepPartial } from 'typeorm';
import * as ytdl from 'ytdl-core';

@Injectable()
export class VideoService {
  async newVideo(url: string,type: 'video' | 'audio',res: Response) {
    const info = await ytdl.getInfo(url)

    switch(type){
      case 'video':
        const videoFormat = info.formats.filter(frm => frm.hasAudio && frm.hasVideo)
        res.setHeader(
          'Content-Disposition', `attachment; filename="${info.videoDetails.title}.${videoFormat[0].container}"`,
        );
        ytdl(url,{format:videoFormat[0]}).pipe(res);
        return true
      case 'audio':
        const audioFormats = info.formats.filter(frm => frm.hasAudio && !frm.hasVideo)
        const highestAudio = audioFormats.reduce((acc,item,index,og)=>{
          if(item.audioBitrate > acc.audioBitrate){
            return item
          }else{
            return acc
          }
        },audioFormats[0])
        res.setHeader(
          'Content-Disposition', `attachment; filename="${info.videoDetails.title}.${highestAudio.container}"`,
        );
        const file = ytdl(url,{format:highestAudio});
        file.pipe(res)
        return true
    }
  }
  // async getInfo(url: string) {
  //   const info = await ytdl.getInfo(url);
  //   console.log(info.formats);
  // }
}
