import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Task } from '../tasks/task.entity';
import * as bcrypt from 'bcrypt';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ select: false })
  password?: string;

  @Column()
  role?: 'USER' | 'ADMIN';

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @OneToMany((_type) => Task, (task) => task.user, { eager: true })
  tasks: Task[];

  @BeforeInsert()
  async hashPassword?() {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }
}
