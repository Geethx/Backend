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
    const tokens = this.authService.generateTokens(await this.authService.validateUser(dto.email, dto.password));
    return {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      user: {
        id: tokens.user.id,
        email: tokens.user.email,
        name: tokens.user.name,
      },
    };
  }
}
