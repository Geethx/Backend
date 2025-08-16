import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { User } from './users/entities/user.entity';
import { DoctorModule } from './doctor/doctor.module';
import { Doctor } from './doctor/entities/doctor.entity';
import { AppointmentModule } from './appointment/appointment.module';
import { Appointment } from './appointment/entities/appointment.entity';
import { PaidAppointment } from './appointment/entities/paid-appointment.entity';
import { UsersModule } from './users/users.module';
import { PatientModule } from './patient/patient.module';
import { Patient } from './patient/entities/patient.entity';
import { MedicalReportsModule } from './medical-reports/medical-reports.module';
import { MedicalReport } from './medical-reports/entities/medical-report.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST'),
        port: +configService.get('DATABASE_PORT'),
        username: configService.get('DATABASE_USER'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        entities: [
          User,
          Doctor,
          Appointment,
          Patient,
          PaidAppointment,
          MedicalReport,
        ],
        synchronize: true, // Disable in production
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    DoctorModule,
    AppointmentModule,
    PatientModule,
    UsersModule,
    MedicalReportsModule,
    MedicalReportsModule,
  ],
})
export class AppModule {}
