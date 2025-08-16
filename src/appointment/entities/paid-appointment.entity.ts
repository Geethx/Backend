import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Doctor } from '../../doctor/entities/doctor.entity';

export enum PaidAppointmentStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  FINISHED = 'FINISHED',
  CANCELLED = 'CANCELLED',
}

@Entity('paid_appointment')
export class PaidAppointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Doctor, { eager: true })
  @JoinColumn({ name: 'doctorId' })
  doctor: Doctor;

  @Column()
  patientId: string;

  @Column()
  patientName: string;

  @Column({ type: 'timestamp', nullable: true })
  scheduledAt: Date;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({
    type: 'enum',
    enum: PaidAppointmentStatus,
    default: PaidAppointmentStatus.IN_PROGRESS,
  })
  status: PaidAppointmentStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  amount: number;

  @Column({ type: 'timestamp', nullable: true })
  paymentDate: Date;

  @Column({ nullable: true })
  paymentMethod: string;

  @Column({ type: 'text', nullable: true })
  qrCode?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
