import { Module } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoController } from './video.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Video } from './entities/video.entity';
import { EjsModule } from 'src/ejs/ejs.module';

@Module({
  imports: [TypeOrmModule.forFeature([Video]), EjsModule.register()],
  controllers: [VideoController],
  providers: [VideoService],
})
export class VideoModule {}
