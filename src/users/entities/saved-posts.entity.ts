import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Audio } from 'src/audios/entities/audio.entity';
import { Quote } from 'src/quotes/entities/quote.entity';
import { Visual } from 'src/visuals/entities/visual.entity';

@Entity('saved_posts')
export class SavedPost {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.savedPosts)
  user: User;

  @ManyToOne(() => Audio, { nullable: true })
  audio: Audio;

  @ManyToOne(() => Quote, { nullable: true })
  quote: Quote;

  @ManyToOne(() => Visual, { nullable: true })
  visual: Visual;
}


