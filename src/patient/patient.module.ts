import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from './entities/patient.entity';
import { PatientService } from './patient.service';
import { PatientController } from './patient.controller';
import { Appointment } from '../appointment/entities/appointment.entity';
import { PaidAppointment } from '../appointment/entities/paid-appointment.entity';
import { Doctor } from '../doctor/entities/doctor.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Patient, Appointment, PaidAppointment, Doctor]),
  ],
  providers: [PatientService],
  controllers: [PatientController],
  exports: [PatientService],
})
export class PatientModule {}
