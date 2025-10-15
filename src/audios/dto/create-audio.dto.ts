import { IsEnum, IsNotEmpty } from 'class-validator';
import { AudioCategory } from '../entities/audio-category.enum';
import { Type } from 'class-transformer';

export class CreateAudioDto {
  @IsNotEmpty()
  name: string;

   @Type(() => Number) 
  @IsEnum(AudioCategory, { message: 'category must be one of 1–6' })
  category: AudioCategory;
}
