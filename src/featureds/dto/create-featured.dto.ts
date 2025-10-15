import { IsIn, IsInt } from 'class-validator';

export class CreateFeaturedDto {
  @IsIn(['quotes', 'visual'])
  item_table: string;

  @IsInt()
  item_id: number;
}

