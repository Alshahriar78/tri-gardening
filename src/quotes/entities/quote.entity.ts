import { Keyword } from 'src/common/entities/keyword.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { QuoteCategory } from './quote-category.enum';

@Entity('quotes')
export class Quote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'bit' })
  is_text: boolean;


  @Column()
  quote: string;
  
   @Column({ default: 0 })
  view_count: number;

  @Column({ type: 'int' })
  category: QuoteCategory;

  @ManyToMany(() => Keyword, { cascade: true, eager: true })
  @JoinTable({
    name: 'quote_keywords',
  })
  keywords: Keyword[];

}
