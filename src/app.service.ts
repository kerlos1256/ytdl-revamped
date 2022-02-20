import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { User } from './user/entities/user.entity';
import { Video } from './video/entities/video.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Video)
    private readonly vidRepo: Repository<Video>,
  ) {}
  async Authed(user: DeepPartial<User>) {
    if (user) {
      const recentVids = await this.vidRepo.find({
        where: { userId: user.id },
        take: 8,
        order: { id: 'DESC' },
      });

      return { authed: true, user, videos: recentVids };
    } else {
      return {
        authed: false,
        // info: {
        //   title:
        //     'FLYING OVER NEW ZEALAND (4K UHD) - Relaxing Music Along With Beautiful Nature Videos - 4K Video',
        //   thumbnail:
        //     'https://i.ytimg.com/vi/wBW-Pm7u4KA/hqdefault.jpg?sqp=-oaymwEbCKgBEF5IVfKriqkDDggBFQAAiEIYAXABwAEG&rs=AOn4CLAjnQR_XA-9ysar7LYT8-fLTXEfuw',
        //   author: {
        //     name: 'Piano Relaxing',
        //     avatar:
        //       'https://yt3.ggpht.com/ytc/AKedOLS1ux6GXmgjIw4kkiJHfeuY0Bi9N0kjPaWVKzBv=s48-c-k-c0x00ffffff-no-rj',
        //     subscriber_count: 148000,
        //   },
        //   formats: {
        //     audio: [
        //       {
        //         qualityLabel: null,
        //         qualitys: [
        //           {
        //             itag: 251,
        //             bitrate: 172194,
        //             container: 'webm',
        //             size: '226.68MB',
        //           },
        //           {
        //             itag: 140,
        //             bitrate: 142214,
        //             container: 'mp4',
        //             size: '191.02MB',
        //           },
        //           {
        //             itag: 250,
        //             bitrate: 98237,
        //             container: 'webm',
        //             size: '121.78MB',
        //           },
        //           {
        //             itag: 249,
        //             bitrate: 78372,
        //             container: 'webm',
        //             size: '93.58MB',
        //           },
        //         ],
        //       },
        //     ],
        //     video: [
        //       {
        //         qualityLabel: '360p',
        //         qualitys: [
        //           {
        //             itag: 18,
        //             bitrate: 549332,
        //             container: 'mp4',
        //             size: '810.46MB',
        //           },
        //           {
        //             itag: 134,
        //             bitrate: 757874,
        //             container: 'mp4',
        //             size: '662.99MB',
        //           },
        //           {
        //             itag: 243,
        //             bitrate: 578608,
        //             container: 'webm',
        //             size: '552.68MB',
        //           },
        //         ],
        //       },
        //       {
        //         qualityLabel: '2160p',
        //         qualitys: [
        //           {
        //             itag: 313,
        //             bitrate: 23019598,
        //             container: 'webm',
        //             size: '23.59GB',
        //           },
        //         ],
        //       },
        //       {
        //         qualityLabel: '1440p',
        //         qualitys: [
        //           {
        //             itag: 271,
        //             bitrate: 10965809,
        //             container: 'webm',
        //             size: '12.03GB',
        //           },
        //         ],
        //       },
        //       {
        //         qualityLabel: '1080p',
        //         qualitys: [
        //           {
        //             itag: 137,
        //             bitrate: 5654746,
        //             container: 'mp4',
        //             size: '6.20GB',
        //           },
        //           {
        //             itag: 248,
        //             bitrate: 4135693,
        //             container: 'webm',
        //             size: '3.88GB',
        //           },
        //         ],
        //       },
        //       {
        //         qualityLabel: '720p',
        //         qualitys: [
        //           {
        //             itag: 136,
        //             bitrate: 2797767,
        //             container: 'mp4',
        //             size: '2.88GB',
        //           },
        //           {
        //             itag: 247,
        //             bitrate: 2491874,
        //             container: 'webm',
        //             size: '2.32GB',
        //           },
        //         ],
        //       },
        //       {
        //         qualityLabel: '480p',
        //         qualitys: [
        //           {
        //             itag: 135,
        //             bitrate: 1495501,
        //             container: 'mp4',
        //             size: '1.36GB',
        //           },
        //           {
        //             itag: 244,
        //             bitrate: 1087414,
        //             container: 'webm',
        //             size: '1.06GB',
        //           },
        //         ],
        //       },
        //       {
        //         qualityLabel: '240p',
        //         qualitys: [
        //           {
        //             itag: 133,
        //             bitrate: 314857,
        //             container: 'mp4',
        //             size: '296.73MB',
        //           },
        //           {
        //             itag: 242,
        //             bitrate: 308144,
        //             container: 'webm',
        //             size: '274.37MB',
        //           },
        //         ],
        //       },
        //       {
        //         qualityLabel: '144p',
        //         qualitys: [
        //           {
        //             itag: 160,
        //             bitrate: 162320,
        //             container: 'mp4',
        //             size: '114.01MB',
        //           },
        //           {
        //             itag: 278,
        //             bitrate: 160626,
        //             container: 'webm',
        //             size: '139.14MB',
        //           },
        //         ],
        //       },
        //     ],
        //   },
        // },
      };
    }
  }

  async getHistory(user: DeepPartial<User>) {
    const vids = await this.vidRepo.find({
      where: { userId: user.id },
      order: { id: 'DESC' },
    });
    return { vids, authed: true, user };
  }
}
