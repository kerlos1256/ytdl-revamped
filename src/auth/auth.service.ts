import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { DeepPartial } from 'typeorm';
import { RegisterDto } from './dto/Register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(name: string, pass: string) {
    const user = await this.userService.findUser(name);

    if (!user) throw new NotFoundException('user not found');
    if (user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    throw new BadRequestException('wrong password');
  }

  login(user: DeepPartial<User>) {
    const payload = { username: user.name, id: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  async Register({ password, username }: RegisterDto) {
    if(!username || !password) throw new BadRequestException("username and password fields must be provided")
    const userExists = await this.userService.findUser(username);
    if (userExists)
      throw new UnprocessableEntityException('username already taken');

    const newUser = await this.userService.register(username, password);
    if (!newUser)
      throw new UnprocessableEntityException('Error creating new user');
    return this.login(newUser);
  }
}
