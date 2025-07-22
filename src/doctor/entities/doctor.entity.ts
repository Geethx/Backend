import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Doctor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  specialization?: string;

  @Column({ nullable: true })
  contactNumber?: string;

  @Column({ nullable: true })
  nic?: string;

  @Column({ nullable: true })
  gender?: string;

  @Column('simple-array', { nullable: true })
  availableTimeSlots?: string[];

  @OneToOne(() => User, (user) => user.doctor, { nullable: true })
  @JoinColumn()
  user?: User;
}
