import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn({ unsigned: true })
  id?: number;

  @Column({ length: 65 })
  name: string;

  @Column({ length: 127, unique: true })
  email: string;

  @Column({ length: 250 })
  password: string;

  @Column({ type: 'date', nullable: true })
  birth?: Date;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @Column({ default: 1 })
  role?: number;
}
