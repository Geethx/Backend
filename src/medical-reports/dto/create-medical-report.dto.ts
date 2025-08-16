import { IsString, IsNumber, IsOptional, IsArray } from 'class-validator';

export class CreateMedicalReportDto {
  @IsNumber()
  appointmentId: number;

  @IsNumber()
  patientId: number;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  findings?: string;

  @IsOptional()
  @IsString()
  recommendations?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsArray()
  imageUrls?: string[];
}
