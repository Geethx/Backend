import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { User } from './users/entities/user.entity';
import { DoctorModule } from './doctor/doctor.module';
import { Doctor } from './doctor/entities/doctor.entity';
import { AppointmentModule } from './appointment/appointment.module';
import { Appointment } from './appointment/entities/appointment.entity';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST'),
        port: +configService.get('DATABASE_PORT'),
        username: configService.get('DATABASE_USER'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        entities: [User, Doctor, Appointment],
        synchronize: true, // Disable in production
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    DoctorModule,
    AppointmentModule,
    UsersModule,
  ],
})
export class AppModule {}
