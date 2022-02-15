import { Controller, Post, Req, Res, UseGuards, Body, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { ReqWithUser } from 'src/types/RequestWithUser';
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
    return res.send(req.user);
  }

  @Get("register")
  registerView(@Res()res: Response){
    res.render("register")
  }
  @Post('register')
  async register(@Body() body: RegisterDto, @Res() res: Response,@Req() req:Request) {
    console.log('body',body)
    const { access_token } = await this.authService.Register(body);
    res.cookie('jwt', access_token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    return res.send({redirect:'/'});
  }
}
