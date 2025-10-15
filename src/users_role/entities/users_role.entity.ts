
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users_role')
export class UsersRole {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'nvarchar', length: 50 })
  name: string;
}
