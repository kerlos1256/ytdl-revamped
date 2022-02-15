import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  register(username: string, password: string) {
    return this.userRepo.save(
      this.userRepo.create({
        name: username,
        password: password,
      }),
    );
  }

  findUser(username: string) {
    return this.userRepo.findOne({ where: { name: username } });
  }

  findUserById(id: number) {
    return this.userRepo.findOne(id);
  }

  findAll() {
    return this.userRepo.find({ relations: ['channels'] });
  }

  getUserChannels(userId: number) {
    return this.userRepo.findOne({
      where: { id: userId },
      relations: ['channels'],
    });
  }
}
