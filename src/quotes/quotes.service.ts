import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quote } from './entities/quote.entity';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { QuoteCategory } from './entities/quote-category.enum';

@Injectable()
export class QuotesService {
  constructor(@InjectRepository(Quote) private readonly quoteRepo: Repository<Quote>) {}

async uploadQuote(dto: CreateQuoteDto, file?: Express.Multer.File) {
  
  const isText = dto.is_text === true;

  
  let content: string | undefined;
  if (isText) {
    content = dto.quote?.trim();
  } else {
    content = file?.path;
  }

  if (!content) {
    throw new Error('Quote content is required either as text or file');
  }

  
  const quote = this.quoteRepo.create({
    is_text:dto.is_text,
    quote: content,
    category: dto.category,
  });

  await this.quoteRepo.save(quote);

  return { success: 1, data: quote };
}


async getQuotesByCategory(category: string, page: number, limit: number) {
  const categoryEnum = QuoteCategory[category.toUpperCase() as keyof typeof QuoteCategory];
  if (!categoryEnum) {
    throw new Error(`Invalid category: ${category}`);
  }

  const [data, total] = await this.quoteRepo.findAndCount({
    where: { category: categoryEnum },
    relations: ['keywords'],
    skip: (page - 1) * limit,
    take: limit,
    order: { id: 'ASC' },
  });

  const formattedData = data.map((quote) => ({
    id: quote.id,
    quote: quote.quote,
    is_text: quote.is_text,
    view_count: quote.view_count,
    keywords: quote.keywords.map((k) => k.name),
  }));

  return {
    status: 'success',
    data: formattedData,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  };
}


}
