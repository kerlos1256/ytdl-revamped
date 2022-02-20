import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Response } from 'express';
import { User } from 'src/user/entities/user.entity';
import { DeepPartial, Repository } from 'typeorm';
import * as ytdl from 'ytdl-core';
import * as contentDisposition from 'content-disposition';
import { InjectRepository } from '@nestjs/typeorm';
import { Video } from './entities/video.entity';
import { Format, Formats, InfoWithFormats } from 'src/types/InfoWithFormats';
const cp = require('child_process');
const ffmpeg = require('ffmpeg-static');

@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(Video)
    private readonly vidRepo: Repository<Video>,
  ) {}

  async newVideo(
    url: string,
    itag: number,
    res: Response,
    user: DeepPartial<User> | null,
  ): Promise<{
    success: boolean;
    error?: string;
  }> {
    const { success, info } = await this.getInfo(url);
    if (!success) {
      return {
        success: false,
        error: 'video with the given url was not found',
      };
    }
    const targetFormat: any = info.formats.find(
      (format) => format.itag == itag,
    );
    if (!targetFormat) return { success: false };
    this.addVideo(user, info);
    if (targetFormat.hasAudio && !targetFormat.hasVideo) {
      // audio
      const ffmpegProcess = cp.spawn(
        ffmpeg,
        [
          // remove ffmpeg's console spamming
          '-loglevel',
          '0',
          '-hide_banner',
          // set input pipes
          '-i',
          'pipe:3',
          // map audio to the new file
          '-map',
          '0:a:0',
          // copy codecs
          '-c:a',
          'copy',
          // define output container and pipe
          '-f',
          'oga',
          'pipe:5',
        ],
        {
          windowsHide: true,
          stdio: [
            /* Standard: stdin, stdout, stderr */
            'inherit',
            'inherit',
            'inherit',
            /* Custom: pipe:3, pipe:4, pipe:5 */
            'pipe',
            'pipe',
            'pipe',
          ],
        },
      );
      res.setHeader(
        'Content-Disposition',
        contentDisposition(`${info.videoDetails.title}.oga`),
      );
      res.setHeader('Content-length', targetFormat.contentLength);

      ytdl(url, { format: targetFormat }).pipe(ffmpegProcess.stdio[3]);
      ffmpegProcess.stdio[5].pipe(res);
      return { success: true };
    } else if (targetFormat.hasVideo && targetFormat.hasAudio) {
      // video with audio
      res.setHeader(
        'Content-Disposition',
        contentDisposition(
          `${info.videoDetails.title}.${targetFormat.container}`,
        ),
      );

      res.setHeader('Content-length', targetFormat.contentLength);

      ytdl(url, { format: targetFormat }).pipe(res);

      return { success: true };
    } else if (targetFormat.hasVideo && !targetFormat.hasAudio) {
      // video without audio
      const video = ytdl(url, { format: targetFormat });
      const audio = ytdl(url, {
        filter: 'audioonly',
        quality: 'highestaudio',
      });
      const ffmpegProcess = cp.spawn(
        ffmpeg,
        [
          // remove ffmpeg's console spamming
          '-loglevel',
          '0',
          '-hide_banner',
          // set input pipes
          '-i',
          'pipe:3',
          '-i',
          'pipe:4',
          // map audio and video to the new file
          '-map',
          '1:v:0',
          '-map',
          '0:a:0',
          // copy codecs
          '-c:v',
          'copy',
          '-c:a',
          'copy',
          // define output container and pipe
          '-f',
          'webm',
          'pipe:5',
        ],
        {
          windowsHide: true,
          stdio: [
            /* Standard: stdin, stdout, stderr */
            'inherit',
            'inherit',
            'inherit',
            /* Custom: pipe:3, pipe:4, pipe:5 */
            'pipe',
            'pipe',
            'pipe',
          ],
        },
      );
      res.setHeader(
        'Content-Disposition',
        contentDisposition(
          `${info.videoDetails.title}.${targetFormat.container}`,
        ),
      );
      res.setHeader('Content-length', targetFormat.contentLength);

      audio.pipe(ffmpegProcess.stdio[3]);
      video.pipe(ffmpegProcess.stdio[4]);
      ffmpegProcess.stdio[5].pipe(res);
      return { success: true };
    }
  }

  async addVideo(user: DeepPartial<User>, vidInfo: ytdl.videoInfo) {
    if (!user) return;
    this.vidRepo.save(
      this.vidRepo.create({
        userId: user.id,
        title: vidInfo.videoDetails.title,
        url: vidInfo.videoDetails.video_url,
        thumbnail: vidInfo.videoDetails.thumbnails[0].url,
      }),
    );
  }

  async getInfo(url: string) {
    try {
      const info = await ytdl.getInfo(url);
      return { success: true, info };
    } catch (error) {
      return { success: false, error };
    }
  }
  async getInfoAndFormats(url: string): Promise<InfoWithFormats> {
    try {
      const info = await ytdl.getInfo(url);
      let formats: Formats = {
        audio: [],
        video: [],
      };

      const convertSize = (size: number) => {
        let formatedSize: string = null;
        const sizes = {
          GB: 1024 * 1024 * 1024,
          MB: 1024 * 1024,
          KB: 1024,
          B: 0,
        };
        Object.entries(sizes).forEach((entry, i) => {
          const key = entry[0];
          const s = entry[1];

          if (formatedSize !== null) return;
          if (size > s) {
            formatedSize = `${(size / s).toFixed(2)}${key}`;
          }
        });
        return formatedSize;
      };

      info.formats.map((frm) => {
        let type: 'audio' | 'video';
        if (frm.hasVideo && !frm.hasAudio) {
          type = 'video';
        } else if (frm.hasAudio && !frm.hasVideo) {
          type = 'audio';
        } else {
          return;
        }

        const qualityLabelExists = formats[type].findIndex(
          (format: Format) => format.qualityLabel === frm.qualityLabel,
        );

        if (qualityLabelExists > -1) {
          formats[type][qualityLabelExists].qualitys.push({
            itag: frm.itag,
            bitrate: frm.bitrate,
            container: frm.container,
            size: convertSize(Number(frm.contentLength)),
          });
        } else {
          formats[type].push({
            qualityLabel: frm.qualityLabel,
            qualitys: [
              {
                itag: frm.itag,
                bitrate: frm.bitrate,
                container: frm.container,
                size: convertSize(Number(frm.contentLength)),
              },
            ],
          });
        }
      });

      formats.video = formats.video.sort((first, next) => {
        const NFirst = Number(first.qualityLabel.split('p')[0]);
        const NNext = Number(next.qualityLabel.split('p')[0]);
        return NNext - NFirst;
      });

      return {
        success: true,
        info: {
          title: info.videoDetails.title,
          thumbnail: info.videoDetails.thumbnails[0].url,
          url: info.videoDetails.video_url,
          author: {
            name: info.videoDetails.author.name,
            avatar: info.videoDetails.author.thumbnails[0].url,
            subscriber_count: info.videoDetails.author.subscriber_count,
          },
          formats,
        },
      };
    } catch (error) {
      console.log(error);
      return { success: false, error };
    }
  }
}
