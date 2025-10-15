import { Module } from '@nestjs/common';
import { VisualsService } from './visuals.service';
import { VisualsController } from './visuals.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Visual } from './entities/visual.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Visual])],
  controllers: [VisualsController],
  providers: [VisualsService],
  exports:[TypeOrmModule]
})
export class VisualsModule {}
