import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from './entities/patient.entity';
import { Appointment } from '../appointment/entities/appointment.entity';
import { PaidAppointment } from '../appointment/entities/paid-appointment.entity';
import { Doctor } from '../doctor/entities/doctor.entity';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient) private patientRepo: Repository<Patient>,
    @InjectRepository(Appointment)
    private appointmentRepo: Repository<Appointment>,
    @InjectRepository(PaidAppointment)
    private paidAppointmentRepo: Repository<PaidAppointment>,
    @InjectRepository(Doctor) private doctorRepo: Repository<Doctor>,
  ) {}

  async findAll(): Promise<Patient[]> {
    return this.patientRepo.find();
  }

  async findPatientsByDoctor(userId: string): Promise<any[]> {
    try {
      console.log('Finding patients for doctor with userId:', userId);

      // First find the doctor by userId through the user relation
      const doctor = await this.doctorRepo.findOne({
        where: { user: { id: userId } },
        relations: ['user'],
      });
      if (!doctor) {
        throw new NotFoundException('Doctor not found');
      }

      console.log('Found doctor:', doctor.name, 'with ID:', doctor.id);

      // Get unique patient IDs from both appointments and paid appointments
      const appointmentPatients = await this.appointmentRepo
        .createQueryBuilder('appointment')
        .select(['appointment.patientId', 'appointment.patientName'])
        .where('appointment.doctorId = :doctorId', { doctorId: doctor.id })
        .getMany();

      const paidAppointmentPatients = await this.paidAppointmentRepo
        .createQueryBuilder('paidAppointment')
        .select(['paidAppointment.patientId', 'paidAppointment.patientName'])
        .where('paidAppointment.doctorId = :doctorId', { doctorId: doctor.id })
        .getMany();

      // Combine and deduplicate patient IDs
      const allPatients = [...appointmentPatients, ...paidAppointmentPatients];
      const uniquePatientIds = new Set<string>();

      allPatients.forEach((patient) => {
        if (patient.patientId) {
          uniquePatientIds.add(patient.patientId);
        }
      });

      // Fetch full patient details for each unique patient ID
      const uniquePatients: Patient[] = [];
      for (const patientId of uniquePatientIds) {
        try {
          const patient = await this.patientRepo.findOne({
            where: { id: patientId },
          });
          if (patient) {
            uniquePatients.push(patient);
          }
        } catch (error) {
          console.warn(`Could not fetch patient with ID ${patientId}:`, error);
          // If patient not found in Patient table, use appointment data as fallback
          const appointmentPatient = allPatients.find(
            (p) => p.patientId === patientId,
          );
          if (appointmentPatient) {
            uniquePatients.push({
              id: appointmentPatient.patientId,
              name: appointmentPatient.patientName || 'Unknown Patient',
              email: 'N/A',
              contactNumber: null,
              address: null,
              dateOfBirth: null,
              gender: null,
            } as unknown as Patient);
          }
        }
      }

      console.log(
        'Found',
        uniquePatients.length,
        'unique patients for doctor',
        doctor.name,
      );
      return uniquePatients;
    } catch (error) {
      console.error('Error finding patients for doctor:', error);
      throw error;
    }
  }

  async create(patientData: Partial<Patient>): Promise<Patient> {
    const patient = this.patientRepo.create(patientData);
    return this.patientRepo.save(patient);
  }

  async findOne(id: string): Promise<Patient> {
    const patient = await this.patientRepo.findOne({ where: { id } });
    if (!patient) throw new NotFoundException('Patient not found');
    return patient;
  }

  async update(id: string, updateData: Partial<Patient>): Promise<Patient> {
    await this.patientRepo.update(id, updateData);
    return this.findOne(id);
  }

  // Add more methods as needed (create, update, etc.)
}
