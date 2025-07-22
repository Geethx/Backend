import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { Doctor } from '../doctor/entities/doctor.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Doctor) private doctorRepository: Repository<Doctor>,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = this.userRepository.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);

    const doctor = this.doctorRepository.create({
      user: savedUser,
      name: dto.name,
      email: dto.email,
      specialization: dto.specialization,
      contactNumber: dto.contactNumber,
      nic: dto.nic,
      gender: dto.gender,
      availableTimeSlots: dto.availableTimeSlots,
    });
    await this.doctorRepository.save(doctor);

    return savedUser;
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  serializeUser(user: User) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }

  generateTokens(user: User) {
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload, {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: process.env.JWT_ACCESS_EXPIRATION,
      }),
      refresh_token: this.jwtService.sign(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: process.env.JWT_REFRESH_EXPIRATION,
      }),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      }
    };
  }
}
