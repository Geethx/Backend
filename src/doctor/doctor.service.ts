import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor } from './entities/doctor.entity';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(Doctor) private doctorRepo: Repository<Doctor>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async create(dto: CreateDoctorDto, user: User): Promise<Doctor> {
    if (!user) throw new NotFoundException('User not found');

    const doctor = this.doctorRepo.create({
      ...dto,
      email: user.email,
      user,
    });

    return this.doctorRepo.save(doctor);
  }

  findAll(): Promise<Doctor[]> {
    return this.doctorRepo.find();
  }

  async findOne(id: string): Promise<Doctor> {
    const doctor = await this.doctorRepo.findOne({ where: { id } });
    if (!doctor) throw new NotFoundException('Doctor not found');
    return doctor;
  }

  async findByUserId(userId: string): Promise<Doctor> {
    const doctor = await this.doctorRepo.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });
    if (!doctor)
      throw new NotFoundException('Doctor profile not found for this user');
    return doctor;
  }

  async update(id: string, dto: UpdateDoctorDto): Promise<Doctor> {
    await this.doctorRepo.update(id, dto);
    return this.findOne(id);
  }

  async updateAvailableTimeSlots(
    userId: string,
    timeSlots: string[],
  ): Promise<Doctor> {
    const doctor = await this.findByUserId(userId);
    if (!doctor)
      throw new NotFoundException('Doctor profile not found for this user');
    doctor.availableTimeSlots = timeSlots;
    return this.doctorRepo.save(doctor);
  }

  async remove(id: string): Promise<void> {
    await this.doctorRepo.delete(id);
  }
}
