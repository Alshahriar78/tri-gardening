import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Quote } from 'src/quotes/entities/quote.entity';
import { Visual } from 'src/visuals/entities/visual.entity';

@Entity('featureds')
export class Featured {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Quote, { nullable: true, eager: true })
  quote: Quote;

  @ManyToOne(() => Visual, { nullable: true, eager: true })
  visual: Visual;
}

