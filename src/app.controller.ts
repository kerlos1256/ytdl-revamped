import { Controller, Get, Render, Req, UseGuards } from '@nestjs/common';
import { DeepPartial } from 'typeorm';
import { AppService } from './app.service';
import { User } from './user/entities/user.entity';
import { Request } from 'express'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  Authed(@Req() req:Request): Promise<{ authed: boolean,user:DeepPartial<User> }> {
    return this.appService.Authed(req)
  }
  
}
