import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { AuthGuard } from '@nestjs/passport';
import { LoginDto } from './dto/login.dto';
import { AuthResponse, IAuthResponse } from './auth.interface';
import { ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Register new user
   */
  @Post('register')
  @ApiResponse({ status: 200, description: 'The user has been successfully registered.', type: AuthResponse })
  @ApiResponse({ status: 409, description: 'User exists'})
  async register(@Body() authDto: RegisterDto): Promise<IAuthResponse | Error> {
    return await this.authService.register(authDto);
  }

  /**
   * Login existing user
   */
  @UseGuards(AuthGuard('local'))
  @Post('login')
  @ApiResponse({ status: 200, description: 'The user has been successfully logged in.', type: AuthResponse})
  @ApiResponse({ status: 401, description: 'Unauthorized.'})
  async login(@Body() loginDto: LoginDto): Promise<IAuthResponse | Error> {
    return await this.authService.login(loginDto);
  }
}
