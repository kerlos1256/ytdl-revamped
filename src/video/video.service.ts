import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Response } from 'express';
import { User } from 'src/user/entities/user.entity';
import { DeepPartial, Repository } from 'typeorm';
import * as ytdl from 'ytdl-core';
import * as contentDisposition from 'content-disposition';
import { InjectRepository } from '@nestjs/typeorm';
import { Video } from './entities/video.entity';
@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(Video)
    private readonly vidRepo: Repository<Video>,
  ) {}

  async newVideo(
    url: string,
    type: 'video' | 'audio',
    res: Response,
    user: DeepPartial<User> | null,
  ) {
    const info = await ytdl.getInfo(url);
    if (!info) throw new BadRequestException('invalid url');

    const newVid = this.addVideo(user, info, type);

    switch (type) {
      case 'video':
        const videoFormat = info.formats.filter(
          (frm) => frm.hasAudio && frm.hasVideo,
        );

        res.setHeader(
          'Content-Disposition',
          contentDisposition(
            `${info.videoDetails.title}.${videoFormat[0].container}`,
          ),
        );
        res.setHeader('Content-length', videoFormat[0].contentLength);

        ytdl(url, { format: videoFormat[0] }).pipe(res);
        return res.status(200);
      case 'audio':
        const audioFormats = info.formats.filter(
          (frm) => frm.hasAudio && !frm.hasVideo,
        );

        const highestAudio = audioFormats.reduce((acc, item, index, og) => {
          if (item.audioBitrate > acc.audioBitrate) {
            return item;
          } else {
            return acc;
          }
        }, audioFormats[0]);

        res.setHeader(
          'Content-Disposition',
          contentDisposition(
            `${info.videoDetails.title}.${highestAudio.container}`,
          ),
        );
        res.setHeader('Content-length', highestAudio.contentLength);

        const file = ytdl(url, { format: highestAudio });
        file.pipe(res);

        return res.status(200);
    }
  }

  async addVideo(
    user: DeepPartial<User>,
    vidInfo: ytdl.videoInfo,
    type: 'video' | 'audio',
  ) {
    if (!user) return;
    // if (type !== 'audio' && type !== 'video') return;
    // this.vidRepo.save(
    //   this.vidRepo.create({
    //     userId: user.id,
    //     title: vidInfo.videoDetails.title,
    //     url: vidInfo.videoDetails.video_url,
    //     thumbnail: vidInfo.videoDetails.thumbnails[0].url,
    //   }),
    // );
  }

  async getInfo(url: string) {
    const info = await ytdl.getInfo(url);
    console.log(info.formats);
  }
}
