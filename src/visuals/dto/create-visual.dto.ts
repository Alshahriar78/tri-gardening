import { IsEnum } from 'class-validator';
import { VisualCategory } from '../entities/visual-category';
import { Type } from 'class-transformer';

export class CreateVisualDto {
  @Type(() => Number)
  @IsEnum(VisualCategory, { message: 'category must be one of 1–6' })
  category: VisualCategory;
}

