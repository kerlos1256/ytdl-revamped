import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { config } from './ormconfig';
import { UserModule } from './user/user.module';
import { VideoModule } from './video/video.module';

@Module({
  imports: [TypeOrmModule.forRoot(config), AuthModule, UserModule, VideoModule],
  controllers:[AppController],
  providers:[AppService]
})
export class AppModule {}
