import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment, AppointmentStatus } from './entities/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Doctor } from '../doctor/entities/doctor.entity';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment) private appointmentRepo: Repository<Appointment>,
    @InjectRepository(Doctor) private doctorRepo: Repository<Doctor>,
  ) {}

  async create(dto: CreateAppointmentDto): Promise<Appointment> {
    const doctor = await this.doctorRepo.findOne({ where: { id: dto.doctorId } });
    if (!doctor) throw new NotFoundException('Doctor not found');
    const appointment = this.appointmentRepo.create({
      doctor,
      patientId: dto.patientId,
      patientName: dto.patientName,
      scheduledAt: dto.scheduledAt,
      notes: dto.notes,
      status: AppointmentStatus.PENDING,
    });
    return this.appointmentRepo.save(appointment);
  }

  async findByDoctor(doctorId: string): Promise<any[]> {
    console.log('Looking for appointments for doctorId:', doctorId);
    const doctor = await this.doctorRepo.findOne({ where: { id: doctorId } });
    if (!doctor) {
      console.log('Doctor not found for id:', doctorId);
      return [];
    }
    const appointments = await this.appointmentRepo.find({ where: { doctor: { id: doctorId } } });
    console.log('Found appointments:', appointments);
    return appointments.map(appt => ({
      id: appt.id,
      status: appt.status,
      doctorId: appt.doctor.id,
      scheduledAt: appt.scheduledAt ? appt.scheduledAt.toISOString().replace('T', ' ').substring(0, 16) : '',
      notes: appt.notes,
      patientId: appt.patientId,
      patientName: appt.patientName,
    }));
  }

  async updateStatus(id: string, status: AppointmentStatus): Promise<Appointment> {
    const appointment = await this.appointmentRepo.findOne({ where: { id } });
    if (!appointment) throw new NotFoundException('Appointment not found');
    appointment.status = status;
    return this.appointmentRepo.save(appointment);
  }

  async findByDoctorWithStatus(doctorId: string, status: AppointmentStatus): Promise<any[]> {
    const appointments = await this.appointmentRepo.find({
      where: {
        doctor: { id: doctorId },
        status,
      },
    });
    return appointments.map(appt => ({
      id: appt.id,
      status: appt.status,
      doctorId: appt.doctor.id,
      scheduledAt: appt.scheduledAt?.toISOString().replace('T', ' ').substring(0, 16),
      notes: appt.notes,
      patientId: appt.patientId,
      patientName: appt.patientName,
    }));
  }
  
}