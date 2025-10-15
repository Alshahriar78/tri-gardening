import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AudiosService } from './audios.service';
import { AudiosController } from './audios.controller';
import { Audio } from './entities/audio.entity';
import { Keyword } from 'src/common/entities/keyword.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Audio,Keyword]),
  ],
  controllers: [AudiosController],
  providers: [AudiosService],
})
export class AudiosModule {}
