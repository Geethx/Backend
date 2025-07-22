import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorService } from './doctor.service';
import { DoctorController } from './doctor.controller';
import { Doctor } from './entities/doctor.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Doctor, User])],
  controllers: [DoctorController],
  providers: [DoctorService],
})
export class DoctorModule {}
