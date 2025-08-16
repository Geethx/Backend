import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ValidationPipe } from '../pipes/validation.pipe';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UsePipes(ValidationPipe)
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const user = await this.authService.validateUser(dto.email, dto.password);
    const tokens = this.authService.generateTokens(user);

    // Find the doctor associated with this user
    const doctor = await this.authService.findDoctorByUserId(user.id);

    return {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      doctor: doctor
        ? {
            id: doctor.id,
            email: doctor.email,
            name: doctor.name,
            specialization: doctor.specialization,
            contactNumber: doctor.contactNumber,
            nic: doctor.nic,
            gender: doctor.gender,
            availableTimeSlots: doctor.availableTimeSlots,
          }
        : null,
    };
  }
}
