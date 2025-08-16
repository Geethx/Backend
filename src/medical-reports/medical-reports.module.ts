import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicalReportsController } from './medical-reports.controller';
import { MedicalReportsService } from './medical-reports.service';
import { MedicalReport } from './entities/medical-report.entity';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    TypeOrmModule.forFeature([MedicalReport]),
    MulterModule.register({
      dest: './uploads/medical-reports',
    }),
  ],
  controllers: [MedicalReportsController],
  providers: [MedicalReportsService],
  exports: [MedicalReportsService],
})
export class MedicalReportsModule {}
