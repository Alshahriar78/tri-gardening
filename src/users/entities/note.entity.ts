import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Entity('notes')
export class Note {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    note: string;

    @Column({ nullable: true })
    title: string;

    @ManyToOne(() => User, (user) => user.notes)
    user: User;

    @Column({ type: 'datetime2', default: () => 'GETDATE()' })
    createdAt: Date;

}
