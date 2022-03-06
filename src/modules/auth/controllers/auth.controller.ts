import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { LoginDto } from '../dtos/requests/login.dto';
import { AuthService } from '../services';

@Controller()
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @Post('/login')
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(loginDto);
    const payload = { id: user.id, name: user.name, email: user.email };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  getProfile(@Request() req: FastifyRequest & { user: unknown }) {
    return req.user;
  }
}
