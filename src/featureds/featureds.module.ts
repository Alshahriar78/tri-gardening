import { Module } from '@nestjs/common';
import { FeaturedsService } from './featureds.service';
import { FeaturedsController } from './featureds.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Featured } from './entities/featured.entity';
import { VisualsModule } from 'src/visuals/visuals.module';
import { QuotesModule } from 'src/quotes/quotes.module';

@Module({
  imports:[TypeOrmModule.forFeature([Featured]),VisualsModule,QuotesModule],
    controllers: [FeaturedsController],
  providers: [FeaturedsService],
})
export class FeaturedsModule {}
