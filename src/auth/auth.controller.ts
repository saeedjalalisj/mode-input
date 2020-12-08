import {Controller, Post, Body, UseGuards} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from "./dto/register.dto";
import {AuthGuard} from "@nestjs/passport";
import {LoginDto} from "./dto/login.dto";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() authDto: RegisterDto) {
    return await this.authService.register(authDto);
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }
}
