import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsDateString,
} from 'class-validator';
import { PaidAppointmentStatus } from '../entities/paid-appointment.entity';

export class CreatePaidAppointmentDto {
  @IsString()
  doctorId: string;

  @IsString()
  patientId: string;

  @IsString()
  patientName: string;

  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsDateString()
  paymentDate?: string;

  @IsOptional()
  @IsString()
  paymentMethod?: string;
}

export class UpdatePaidAppointmentDto {
  @IsOptional()
  @IsEnum(PaidAppointmentStatus)
  status?: PaidAppointmentStatus;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsDateString()
  paymentDate?: string;

  @IsOptional()
  @IsString()
  paymentMethod?: string;
}
