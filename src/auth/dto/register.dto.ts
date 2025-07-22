import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsArray,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  password: string;

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

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  availableTimeSlots?: string[];
}
