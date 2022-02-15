import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AppService {
  constructor(private readonly JWTService: JwtService){}

 async Authed(req:Request){
  const token = req.cookies['jwt'];
  if(!token) return {authed:false,user:{}}
  const verify = await this.JWTService.verify(token,{secret:process.env.JWTSecret})
  if(!verify) return {authed:false,user:{}}
  return {authed:true,user:{username:verify.username,id:verify.id}}
 }
}
