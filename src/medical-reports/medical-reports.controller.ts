import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { MedicalReportsService } from './medical-reports.service';
import { CreateMedicalReportDto } from './dto/create-medical-report.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
    role: string;
  };
}

@Controller('medical-reports')
@UseGuards(JwtAuthGuard)
export class MedicalReportsController {
  constructor(private readonly medicalReportsService: MedicalReportsService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: './uploads/medical-reports',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return cb(
            new BadRequestException('Only image files are allowed!'),
            false,
          );
        }
        cb(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
      },
    }),
  )
  async create(
    @Body() createMedicalReportDto: CreateMedicalReportDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Request() req: AuthenticatedRequest,
  ) {
    const imageUrls = files
      ? files.map((file) => `/uploads/medical-reports/${file.filename}`)
      : [];

    return this.medicalReportsService.create(
      createMedicalReportDto,
      parseInt(req.user.userId, 10),
      imageUrls,
    );
  }

  @Get('patient/:patientId')
  async findByPatient(@Param('patientId') patientId: string) {
    return this.medicalReportsService.findByPatient(+patientId);
  }

  @Get('appointment/:appointmentId')
  async findByAppointment(@Param('appointmentId') appointmentId: string) {
    return this.medicalReportsService.findByAppointment(+appointmentId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.medicalReportsService.findOne(+id);
  }
}
