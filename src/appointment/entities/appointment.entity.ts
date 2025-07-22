import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Doctor } from '../../doctor/entities/doctor.entity';

export enum AppointmentStatus {
  PENDING = 'Pending',
  CONFIRMED = 'Confirmed',
  CANCELLED = 'Cancelled',
}

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: AppointmentStatus, default: AppointmentStatus.PENDING })
  status: AppointmentStatus;

  @ManyToOne(() => Doctor, { eager: true })
  @JoinColumn({ name: 'doctorId' })
  doctor: Doctor;

  @Column({ name: 'patientId', type: 'uuid' })
  patientId: string;

  @Column({ name: 'patientName', type: 'varchar', nullable: true })
  patientName?: string;

  @Column({ name: 'scheduledAt' })
  scheduledAt: Date;

  @Column({ nullable: true })
  notes?: string;
}