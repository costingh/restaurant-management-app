import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthenticatedGuard } from './guards/authenticated.guard';
import { LoginDto } from './dto/login.dto';
import { Request, Response } from 'express';
import { User } from '../../../shared/schema';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Req() req: Request, @Body() _loginDto: LoginDto): Promise<User> {
    return req.user as User;
  }

  @UseGuards(AuthenticatedGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request, @Res() res: Response): Promise<void> {
    req.logout(() => {
      res.status(HttpStatus.OK).json({ message: 'Logged out successfully' });
    });
  }

  @UseGuards(AuthenticatedGuard)
  @Get('profile')
  getProfile(@Req() req: Request): User {
    return req.user as User;
  }
}