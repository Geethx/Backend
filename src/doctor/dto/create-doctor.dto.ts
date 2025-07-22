import { IsEmail, IsOptional, IsString, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDoctorDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  specialization?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  contactNumber?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  nic?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiProperty({ required: false, type: [String], description: 'Array of available time slots, e.g., [\'Friday 9-11\']' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  availableTimeSlots?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;
}
