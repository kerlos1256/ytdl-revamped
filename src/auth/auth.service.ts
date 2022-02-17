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

  async validateUser(
    name: string,
    pass: string,
  ): Promise<{
    success: boolean;
    error?: string;
    user?: DeepPartial<User>;
  }> {
    const user = await this.userService.findUser(name);

    if (!user) return { success: false, error: 'user not found' };
    if (user.password === pass) {
      const { password, ...result } = user;
      return { success: true, user: result };
    }
    return { success: false, error: 'wrong password' };
  }

  login(user: DeepPartial<User>) {
    const payload = { username: user.name, id: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  async Register({ password, username }: RegisterDto): Promise<{
    success: boolean;
    error?: string;
    token?: { access_token: string };
  }> {
    if (!username || !password)
      return {
        success: false,
        error: 'username and password fields must be provided',
      };

    const userExists = await this.userService.findUser(username);
    if (userExists) return { success: false, error: 'username already taken' };

    const newUser = await this.userService.register(username, password);
    if (!newUser) return { success: false, error: 'Error creating new user' };
    return { success: true, token: this.login(newUser) };
  }
}
