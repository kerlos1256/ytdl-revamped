import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import config from './ormconfig';
import { UserModule } from './user/user.module';
import { Video } from './video/entities/video.entity';
import { VideoModule } from './video/video.module';
import { EjsModule } from './ejs/ejs.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(config),
    TypeOrmModule.forFeature([Video]),
    AuthModule,
    UserModule,
    VideoModule,
    EjsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
