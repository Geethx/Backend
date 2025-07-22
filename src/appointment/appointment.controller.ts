import { Controller, Get, Post, Patch, Param, Body } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { AppointmentStatus } from './entities/appointment.entity';

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

  @Patch(':id/accept')
  acceptAppointment(@Param('id') id: string) {
    return this.appointmentService.updateStatus(id, AppointmentStatus.CONFIRMED);
  }

  @Patch(':id/reject')
  rejectAppointment(@Param('id') id: string) {
    return this.appointmentService.updateStatus(id, AppointmentStatus.CANCELLED);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateAppointmentDto) {
    return this.appointmentService.updateStatus(id, dto.status);
  }
}