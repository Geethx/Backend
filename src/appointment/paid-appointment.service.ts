import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  PaidAppointment,
  PaidAppointmentStatus,
} from './entities/paid-appointment.entity';
import {
  CreatePaidAppointmentDto,
  UpdatePaidAppointmentDto,
} from './dto/paid-appointment.dto';
import { Doctor } from '../doctor/entities/doctor.entity';
import * as QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PaidAppointmentService {
  constructor(
    @InjectRepository(PaidAppointment)
    private paidAppointmentRepo: Repository<PaidAppointment>,
    @InjectRepository(Doctor)
    private doctorRepo: Repository<Doctor>,
  ) {}

  async create(
    createPaidAppointmentDto: CreatePaidAppointmentDto,
  ): Promise<PaidAppointment> {
    const doctor = await this.doctorRepo.findOne({
      where: { id: createPaidAppointmentDto.doctorId },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    const paidAppointment = new PaidAppointment();
    paidAppointment.doctor = doctor;
    paidAppointment.patientId = createPaidAppointmentDto.patientId;
    paidAppointment.patientName = createPaidAppointmentDto.patientName;
    if (createPaidAppointmentDto.notes)
      paidAppointment.notes = createPaidAppointmentDto.notes;
    if (createPaidAppointmentDto.amount)
      paidAppointment.amount = createPaidAppointmentDto.amount;
    if (createPaidAppointmentDto.paymentMethod)
      paidAppointment.paymentMethod = createPaidAppointmentDto.paymentMethod;
    if (createPaidAppointmentDto.scheduledAt)
      paidAppointment.scheduledAt = new Date(
        createPaidAppointmentDto.scheduledAt,
      );
    if (createPaidAppointmentDto.paymentDate)
      paidAppointment.paymentDate = new Date(
        createPaidAppointmentDto.paymentDate,
      );

    return this.paidAppointmentRepo.save(paidAppointment);
  }

  async findAll(): Promise<any[]> {
    const paidAppointments = await this.paidAppointmentRepo.find({
      relations: ['doctor'],
    });
    return paidAppointments.map((appt) => ({
      id: appt.id,
      status: appt.status,
      doctorId: appt.doctor.id,
      doctorName: appt.doctor.name,
      scheduledAt: appt.scheduledAt
        ?.toISOString()
        .replace('T', ' ')
        .substring(0, 16),
      notes: appt.notes,
      patientId: appt.patientId,
      patientName: appt.patientName,
      amount: appt.amount,
      paymentDate: appt.paymentDate
        ?.toISOString()
        .replace('T', ' ')
        .substring(0, 16),
      paymentMethod: appt.paymentMethod,
      qrCode: appt.qrCode,
      createdAt: appt.createdAt,
      updatedAt: appt.updatedAt,
    }));
  }

  async findByDoctor(doctorId: string): Promise<any[]> {
    const paidAppointments = await this.paidAppointmentRepo.find({
      where: {
        doctor: { id: doctorId },
      },
      relations: ['doctor'],
    });
    return paidAppointments.map((appt) => ({
      id: appt.id,
      status: appt.status,
      doctorId: appt.doctor.id,
      scheduledAt: appt.scheduledAt
        ?.toISOString()
        .replace('T', ' ')
        .substring(0, 16),
      notes: appt.notes,
      patientId: appt.patientId,
      patientName: appt.patientName,
      amount: appt.amount,
      paymentDate: appt.paymentDate
        ?.toISOString()
        .replace('T', ' ')
        .substring(0, 16),
      paymentMethod: appt.paymentMethod,
      qrCode: appt.qrCode,
    }));
  }

  async findByUserId(userId: string): Promise<any[]> {
    // First find the doctor associated with this user
    console.log('Looking for doctor with userId:', userId);
    const doctor = await this.doctorRepo.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!doctor) {
      console.log('Doctor not found for userId:', userId);
      return [];
    }

    console.log('Found doctor:', doctor.name, 'with ID:', doctor.id);
    const appointments = await this.findByDoctor(doctor.id);
    console.log(
      `Returning ${appointments.length} paid appointments for doctor ${doctor.name}`,
    );
    return appointments;
  }

  async findByUserIdAndStatus(
    userId: string,
    status: PaidAppointmentStatus,
  ): Promise<any[]> {
    // First find the doctor associated with this user
    const doctor = await this.doctorRepo.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!doctor) {
      console.log('Doctor not found for userId:', userId);
      return [];
    }

    return this.findByDoctorAndStatus(doctor.id, status);
  }

  async findByDoctorAndStatus(
    doctorId: string,
    status: PaidAppointmentStatus,
  ): Promise<any[]> {
    const paidAppointments = await this.paidAppointmentRepo.find({
      where: {
        doctor: { id: doctorId },
        status,
      },
    });
    return paidAppointments.map((appt) => ({
      id: appt.id,
      status: appt.status,
      doctorId: appt.doctor.id,
      scheduledAt: appt.scheduledAt
        ?.toISOString()
        .replace('T', ' ')
        .substring(0, 16),
      notes: appt.notes,
      patientId: appt.patientId,
      patientName: appt.patientName,
      amount: appt.amount,
      paymentDate: appt.paymentDate
        ?.toISOString()
        .replace('T', ' ')
        .substring(0, 16),
      paymentMethod: appt.paymentMethod,
    }));
  }

  async findOne(id: string): Promise<PaidAppointment> {
    const paidAppointment = await this.paidAppointmentRepo.findOne({
      where: { id },
      relations: ['doctor'],
    });

    if (!paidAppointment) {
      throw new NotFoundException('Paid appointment not found');
    }

    return paidAppointment;
  }

  async update(
    id: string,
    updatePaidAppointmentDto: UpdatePaidAppointmentDto,
  ): Promise<PaidAppointment> {
    const paidAppointment = await this.findOne(id);

    Object.assign(paidAppointment, {
      ...updatePaidAppointmentDto,
      paymentDate: updatePaidAppointmentDto.paymentDate
        ? new Date(updatePaidAppointmentDto.paymentDate)
        : paidAppointment.paymentDate,
    });

    return this.paidAppointmentRepo.save(paidAppointment);
  }

  async markAsFinished(id: string): Promise<PaidAppointment> {
    const paidAppointment = await this.findOne(id);

    // Generate unique QR code data for this patient and appointment
    const qrData = {
      appointmentId: paidAppointment.id,
      patientId: paidAppointment.patientId,
      patientName: paidAppointment.patientName,
      doctorId: paidAppointment.doctor.id,
      finishedAt: new Date().toISOString(),
      uniqueCode: uuidv4(),
    };

    // Generate QR code as base64 string
    const qrCodeBase64 = await QRCode.toDataURL(JSON.stringify(qrData));

    paidAppointment.status = PaidAppointmentStatus.FINISHED;
    paidAppointment.qrCode = qrCodeBase64;

    return this.paidAppointmentRepo.save(paidAppointment);
  }

  async markAsInProgress(id: string): Promise<PaidAppointment> {
    const paidAppointment = await this.findOne(id);
    paidAppointment.status = PaidAppointmentStatus.IN_PROGRESS;
    return this.paidAppointmentRepo.save(paidAppointment);
  }

  async cancel(id: string): Promise<PaidAppointment> {
    const paidAppointment = await this.findOne(id);
    paidAppointment.status = PaidAppointmentStatus.CANCELLED;
    return this.paidAppointmentRepo.save(paidAppointment);
  }

  async remove(id: string): Promise<void> {
    const result = await this.paidAppointmentRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Paid appointment not found');
    }
  }
}
