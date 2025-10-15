import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { QuoteCategory } from '../entities/quote-category.enum';

export class CreateQuoteDto {
    @IsOptional()
    @Transform(({ value }) => value === 'true')
    @IsBoolean()
    is_text: boolean;


    @IsNotEmpty()
    @IsOptional()
    quote?: string;

     @Type(() => Number) 
        @IsEnum(QuoteCategory, { message: 'category must be one of 1–6' })
        category: QuoteCategory;
}

