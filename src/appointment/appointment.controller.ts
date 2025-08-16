import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { AppointmentStatus } from './entities/appointment.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
    role: string;
  };
}

@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  create(@Body() dto: CreateAppointmentDto) {
    return this.appointmentService.create(dto);
  }

  @Get('doctor/:doctorId')
  findByDoctor(@Param('doctorId') doctorId: string) {
    return this.appointmentService.findByDoctor(doctorId);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  async getMyAppointments(@Request() req: AuthenticatedRequest) {
    try {
      // Get doctor info from authenticated user
      const userId: string = req.user.userId;
      console.log('Getting appointments for userId:', userId);

      // Find doctor by user ID - you'll need to implement this method
      const appointments = await this.appointmentService.findByUserId(userId);
      return appointments;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to fetch appointments: ${errorMessage}`);
    }
  }

  @Get('my/paid')
  @UseGuards(JwtAuthGuard)
  async getMyPaidAppointments(@Request() req: AuthenticatedRequest) {
    try {
      // Get doctor info from authenticated user
      const userId: string = req.user.userId;
      console.log('Getting paid appointments for userId:', userId);

      // Find doctor by user ID - you'll need to implement this method
      const appointments =
        await this.appointmentService.findPaidByUserId(userId);
      return appointments;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to fetch paid appointments: ${errorMessage}`);
    }
  }

  @Get()
  findAll() {
    return this.appointmentService.findAll();
  }

  @Patch(':id/accept')
  acceptAppointment(@Param('id') id: string) {
    return this.appointmentService.updateStatus(id, AppointmentStatus.ACCEPTED);
  }

  @Patch(':id/reject')
  rejectAppointment(@Param('id') id: string) {
    return this.appointmentService.updateStatus(id, AppointmentStatus.REJECTED);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateAppointmentDto) {
    return this.appointmentService.updateStatus(id, dto.status);
  }
}
