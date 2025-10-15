import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('keywords')
export class Keyword {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;
}
