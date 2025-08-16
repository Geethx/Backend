import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';
import { PaidAppointmentController } from './paid-appointment.controller';
import { PaidAppointmentService } from './paid-appointment.service';
import { Appointment } from './entities/appointment.entity';
import { PaidAppointment } from './entities/paid-appointment.entity';
import { Doctor } from '../doctor/entities/doctor.entity';
import { User } from '../users/entities/user.entity';
import { Patient } from '../patient/entities/patient.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Appointment,
      PaidAppointment,
      Doctor,
      User,
      Patient,
    ]),
  ],
  controllers: [AppointmentController, PaidAppointmentController],
  providers: [AppointmentService, PaidAppointmentService],
  exports: [AppointmentService, PaidAppointmentService],
})
export class AppointmentModule {}
