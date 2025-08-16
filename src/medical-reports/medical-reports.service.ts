import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MedicalReport } from './entities/medical-report.entity';
import { CreateMedicalReportDto } from './dto/create-medical-report.dto';

@Injectable()
export class MedicalReportsService {
  constructor(
    @InjectRepository(MedicalReport)
    private medicalReportsRepository: Repository<MedicalReport>,
  ) {}

  async create(
    createMedicalReportDto: CreateMedicalReportDto,
    doctorId: number,
    imageUrls: string[] = [],
  ): Promise<MedicalReport> {
    const medicalReport = this.medicalReportsRepository.create({
      ...createMedicalReportDto,
      doctorId,
      imageUrls,
    });

    return await this.medicalReportsRepository.save(medicalReport);
  }

  async findByPatient(patientId: number): Promise<MedicalReport[]> {
    return await this.medicalReportsRepository.find({
      where: { patientId },
      relations: ['doctor', 'patient'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByAppointment(appointmentId: number): Promise<MedicalReport[]> {
    return await this.medicalReportsRepository.find({
      where: { appointmentId },
      relations: ['doctor', 'patient'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<MedicalReport | null> {
    return await this.medicalReportsRepository.findOne({
      where: { id },
      relations: ['doctor', 'patient'],
    });
  }
}
