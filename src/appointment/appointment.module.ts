import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';
import { Appointment } from './entities/appointment.entity';
import { Doctor } from '../doctor/entities/doctor.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment, Doctor, User])],
  controllers: [AppointmentController],
  providers: [AppointmentService],
  exports: [AppointmentService],
})
export class AppointmentModule {}