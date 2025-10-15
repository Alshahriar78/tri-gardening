import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { AudioCategory } from './audio-category.enum';
import { Keyword } from 'src/common/entities/keyword.entity';



@Entity('audios')
export class Audio {

  
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

 @Column({
    type: 'int',
  })
  category: AudioCategory; 

  @Column()
  img_path: string;

  @Column()
  audio_path: string;

  @Column({ default: 0 })
  view_count: number;

  @ManyToMany(() => Keyword,  { cascade: true, eager:true })
  @JoinTable({
  name: 'audio_and_keywords',
})
  keywords: Keyword[];
}
