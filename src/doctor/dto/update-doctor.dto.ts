import { PartialType } from '@nestjs/swagger';
import { CreateDoctorDto } from './create-doctor.dto';
import { IsOptional, IsArray, IsString } from 'class-validator';

export class UpdateDoctorDto extends PartialType(CreateDoctorDto) {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  availableTimeSlots?: string[];
}
