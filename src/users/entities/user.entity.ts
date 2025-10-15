import { UsersRole } from 'src/users_role/entities/users_role.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany } from 'typeorm';
import { SavedPost } from './saved-posts.entity';
import { Note } from './note.entity';


@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'nvarchar', length: 255 })
  name: string;

  @Column({ type: 'nvarchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'nvarchar', length: 100 })
  password: string;

  @ManyToOne(() => UsersRole)
  @JoinColumn({ name: 'role_id' })
  role: UsersRole;

  @Column({ type: 'int', default: 2 })
  role_id: number;

  @OneToMany(() => SavedPost, (savedPost) => savedPost.user)
  savedPosts: SavedPost[];

  @OneToMany(() => Note, (note) => note.user)
  notes: Note[];


  @CreateDateColumn({ type: 'datetime2', default: () => 'GETDATE()' })
  created_at: Date;

  @UpdateDateColumn({ type: 'datetime2', default: () => 'GETDATE()' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'datetime2', nullable: true })
  deleted_at: Date | null;

}
