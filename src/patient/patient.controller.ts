import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PatientService } from './patient.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Patient } from './entities/patient.entity';

interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
    role: string;
  };
}

@Controller('patient')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Get()
  getAllPatients() {
    return this.patientService.findAll();
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  async getMyPatients(@Request() req: AuthenticatedRequest) {
    try {
      const userId: string = req.user.userId;
      console.log('Getting patients for doctor userId:', userId);

      const patients = await this.patientService.findPatientsByDoctor(userId);
      return patients;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to fetch patients: ${errorMessage}`);
    }
  }

  @Post()
  createPatient(@Body() patientData: Partial<Patient>) {
    return this.patientService.create(patientData);
  }

  @Get(':id')
  getPatient(@Param('id') id: string) {
    return this.patientService.findOne(id);
  }

  @Patch(':id')
  updatePatient(@Param('id') id: string, @Body() updateData: Partial<Patient>) {
    return this.patientService.update(id, updateData);
  }
}
