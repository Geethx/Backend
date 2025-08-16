import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PaidAppointmentService } from './paid-appointment.service';
import {
  CreatePaidAppointmentDto,
  UpdatePaidAppointmentDto,
} from './dto/paid-appointment.dto';
import { PaidAppointmentStatus } from './entities/paid-appointment.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
    role: string;
  };
}

@Controller('paid-appointment')
export class PaidAppointmentController {
  constructor(
    private readonly paidAppointmentService: PaidAppointmentService,
  ) {}

  @Post()
  create(@Body() createPaidAppointmentDto: CreatePaidAppointmentDto) {
    return this.paidAppointmentService.create(createPaidAppointmentDto);
  }

  @Get()
  findAll() {
    return this.paidAppointmentService.findAll();
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  async getMyPaidAppointments(@Request() req: AuthenticatedRequest) {
    try {
      const userId: string = req.user.userId;
      console.log('Getting paid appointments for userId:', userId);
      const appointments =
        await this.paidAppointmentService.findByUserId(userId);
      return appointments;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to fetch paid appointments: ${errorMessage}`);
    }
  }

  @Get('my/finished')
  @UseGuards(JwtAuthGuard)
  async getMyFinishedAppointments(@Request() req: AuthenticatedRequest) {
    try {
      const userId: string = req.user.userId;
      console.log('Getting finished appointments for userId:', userId);
      const appointments =
        await this.paidAppointmentService.findByUserIdAndStatus(
          userId,
          PaidAppointmentStatus.FINISHED,
        );
      return appointments;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to fetch finished appointments: ${errorMessage}`);
    }
  }

  @Get('doctor/:doctorId')
  findByDoctor(@Param('doctorId') doctorId: string) {
    return this.paidAppointmentService.findByDoctor(doctorId);
  }

  @Get('doctor/:doctorId/status/:status')
  findByDoctorAndStatus(
    @Param('doctorId') doctorId: string,
    @Param('status') status: PaidAppointmentStatus,
  ) {
    return this.paidAppointmentService.findByDoctorAndStatus(doctorId, status);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paidAppointmentService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePaidAppointmentDto: UpdatePaidAppointmentDto,
  ) {
    return this.paidAppointmentService.update(id, updatePaidAppointmentDto);
  }

  @Patch(':id/finish')
  markAsFinished(@Param('id') id: string) {
    return this.paidAppointmentService.markAsFinished(id);
  }

  @Patch(':id/in-progress')
  markAsInProgress(@Param('id') id: string) {
    return this.paidAppointmentService.markAsInProgress(id);
  }

  @Patch(':id/cancel')
  cancel(@Param('id') id: string) {
    return this.paidAppointmentService.cancel(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paidAppointmentService.remove(id);
  }
}
