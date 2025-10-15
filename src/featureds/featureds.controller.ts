import { Controller, Post, Body, Get } from '@nestjs/common';
import { FeaturedsService } from './featureds.service';

@Controller('featureds')
export class FeaturedsController {
  constructor(private readonly featuredsService: FeaturedsService) {}

  @Post('upload')
  async uploadFeatured(
    @Body() body: { item_table: 'quotes' | 'visual'; item_id: number },
  ) {
    return this.featuredsService.uploadFeatured(body.item_table, body.item_id);
  }

  @Get()
  async getFeatureds() {
    return this.featuredsService.getFeatureds();
  }
}
