import {
  Controller,
  Post,
  Req,
  Res,
  UseGuards,
  Body,
  Get,
  Render,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { GetTokenFromCookiesAndDecode } from 'src/custom/decorators/getCookies.decorator';
import { ReqWithUser } from 'src/types/RequestWithUser';
import { User } from 'src/user/entities/user.entity';
import { DeepPartial } from 'typeorm';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/Register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(@Res() res: Response, @Req() req: ReqWithUser) {
    const { access_token } = this.authService.login(req.user);
    res.cookie('jwt', access_token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    return res.send({ redirect: '/' });
  }

  @Get('register')
  @Render('register')
  renderRegister(
    @Res() res: Response,
    @GetTokenFromCookiesAndDecode() user: DeepPartial<User> | null,
  ) {
    if (user) res.redirect('/');
  }

  @Get('login')
  @Render('login')
  renderLogin(
    @Res() res: Response,
    @GetTokenFromCookiesAndDecode() user: DeepPartial<User> | null,
  ) {
    if (user) res.redirect('/');
  }

  @Get('logout')
  logout(@Res() res: Response) {
    res.clearCookie('jwt', { httpOnly: true });
    return res.redirect('/');
  }

  @Post('register')
  async register(@Body() body: RegisterDto, @Res() res: Response) {
    const { success, error, token } = await this.authService.Register(body);
    if (!success || !token.access_token) {
      throw new BadRequestException(error || 'something went wrong');
    }
    res.cookie('jwt', token.access_token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    return res.send({ redirect: '/' });
  }
}
