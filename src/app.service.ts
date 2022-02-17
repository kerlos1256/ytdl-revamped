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
      return { authed: false };
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
