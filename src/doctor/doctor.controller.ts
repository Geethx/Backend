import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  NotFoundException,
  UseGuards,
  Request,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DoctorService } from './doctor.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { User } from '../users/entities/user.entity';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
    role: string;
  };
}

@ApiTags('Doctor')
@Controller('doctor')
export class DoctorController {
  constructor(
    private readonly doctorService: DoctorService,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  @Post(':userId')
  @ApiOperation({ summary: 'Create a doctor profile' })
  async createDoctor(
    @Param('userId') userId: string,
    @Body() dto: CreateDoctorDto,
  ) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    return this.doctorService.create(dto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all doctors' })
  findAll() {
    return this.doctorService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get doctor by ID' })
  findOne(@Param('id') id: string) {
    return this.doctorService.findOne(id);
  }

  @Get('user/:userId')
  async getDoctorByUserId(@Param('userId') userId: string) {
    const doctor = await this.doctorService.findByUserId(userId);
    return doctor;
  }

  @Get(':id/time-slots')
  @ApiOperation({ summary: 'Get doctor available time slots' })
  async getTimeSlots(@Param('id') id: string) {
    const doctor = await this.doctorService.findOne(id);
    return {
      doctorId: doctor.id,
      doctorName: doctor.name,
      availableTimeSlots: doctor.availableTimeSlots || [],
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/time-slots')
  @ApiOperation({ summary: 'Get logged-in doctor available time slots' })
  async getMyTimeSlots(@Request() req: AuthenticatedRequest) {
    console.log('getMyTimeSlots called for user:', req.user);
    const userId: string = req.user.userId; // Use userId instead of sub
    try {
      const doctor = await this.doctorService.findByUserId(userId);
      console.log('Doctor found:', doctor);
      return {
        doctorId: doctor.id,
        doctorName: doctor.name,
        availableTimeSlots: doctor.availableTimeSlots || [],
      };
    } catch (error) {
      console.error('Error in getMyTimeSlots:', error);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('me/time-slots')
  @ApiOperation({ summary: 'Update logged-in doctor available time slots' })
  async updateMyTimeSlots(
    @Request() req: AuthenticatedRequest,
    @Body('availableTimeSlots') availableTimeSlots: string[],
  ) {
    const userId: string = req.user.userId; // Use userId instead of sub
    const doctor = await this.doctorService.updateAvailableTimeSlots(
      userId,
      availableTimeSlots,
    );
    return {
      doctorId: doctor.id,
      doctorName: doctor.name,
      availableTimeSlots: doctor.availableTimeSlots || [],
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update doctor profile' })
  update(@Param('id') id: string, @Body() dto: UpdateDoctorDto) {
    return this.doctorService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete doctor' })
  remove(@Param('id') id: string) {
    return this.doctorService.remove(id);
  }
}
