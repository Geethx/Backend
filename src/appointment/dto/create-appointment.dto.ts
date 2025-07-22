import { ApiProperty } from '@nestjs/swagger';

export class CreateAppointmentDto {
  @ApiProperty()
  doctorId: string;

  @ApiProperty()
  patientId: string;

  @ApiProperty()
  patientName: string;

  @ApiProperty()
  scheduledAt: Date;

  @ApiProperty({ required: false })
  notes?: string;
}