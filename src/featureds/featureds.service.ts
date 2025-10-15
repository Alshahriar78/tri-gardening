import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Featured } from './entities/featured.entity';
import { Quote } from 'src/quotes/entities/quote.entity';
import { Visual } from 'src/visuals/entities/visual.entity';

@Injectable()
export class FeaturedsService {
  constructor(
    @InjectRepository(Featured)
    private readonly featuredRepo: Repository<Featured>,
    @InjectRepository(Quote)
    private readonly quoteRepo: Repository<Quote>,
    @InjectRepository(Visual)
    private readonly visualRepo: Repository<Visual>,
  ) {}

  async uploadFeatured(item_table: 'quotes' | 'visual', item_id: number) {
    let featuredItem: Featured;

    if (item_table === 'quotes') {
      const quote = await this.quoteRepo.findOne({ where: { id: item_id } });
      if (!quote) throw new NotFoundException('Quote not found');
      featuredItem = this.featuredRepo.create({ quote });
    } else if (item_table === 'visual') {
      const visual = await this.visualRepo.findOne({ where: { id: item_id } });
      if (!visual) throw new NotFoundException('Visual not found');
      featuredItem = this.featuredRepo.create({ visual });
    } else {
      throw new Error('Invalid item_table, must be "quotes" or "visual"');
    }

    await this.featuredRepo.save(featuredItem);

    return {
      success: 1,
      message: 'Featured uploaded successfully',
      data: featuredItem,
    };
  }

  async getFeatureds() {
    const featuredItems = await this.featuredRepo.find({
      relations: ['quote', 'visual'],
    });

    const quoteList = featuredItems
      .filter((f) => f.quote)
      .map((f) => ({
        is_text: f.quote.is_text,
        quote: f.quote.quote,
      }));

    const visualList = featuredItems
      .filter((f) => f.visual)
      .map((f) => ({
        category: f.visual.category,
        image_path: f.visual.img_path,
      }));

    return {
      status: 'success',
      data: {
        quoteList,
        visualList,
      },
    };
  }
}
