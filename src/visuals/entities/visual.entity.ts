import { Keyword } from 'src/common/entities/keyword.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { VisualCategory } from './visual-category';

@Entity('visuals')
export class Visual {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  img_path: string;

  @Column({ default: 0 })
  view_count: number;

  @Column({ type: 'int' })
category: VisualCategory;

  @ManyToMany(() => Keyword, { cascade: true, eager: true })
  @JoinTable({ name: 'visual_keywords' })
  keywords: Keyword[];
}
