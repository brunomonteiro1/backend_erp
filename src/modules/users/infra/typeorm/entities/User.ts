import 'dotenv/config';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  VersionColumn,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';

export enum Level {
  admin = 1,
  consultant = 2,
}

@Entity('users')
class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({
    type: 'enum',
    enum: Level,
  })
  @Exclude()
  level: number;

  @Column()
  status: boolean;

  @Column()
  firstLogon: boolean;

  @Column()
  avatar: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  @Exclude()
  canceled_at: Date;

  @VersionColumn()
  @Exclude()
  version: number;

  @Expose({ name: 'type' })
  getLevel(): string | null {
    if (this.level === 1) {
      return 'Administrador';
    }
    if (this.level === 2) {
      return 'Consultor';
    }
    return null;
  }

  @Expose({ name: 'avatar_url' })
  getAvatarUrl(): string | null {
    return this.avatar ? `${process.env.API_URL}/files/${this.avatar}` : null;
  }
}

export default User;
