import { 
  Controller, 
  Post, 
  UseGuards, 
  Request, 
  Body, 
  Get, 
  Res
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthenticatedGuard } from './guards/authenticated.guard';
import { LoginDto } from './dto/login.dto';
import { User } from '../../../shared/schema';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  
  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Request() req: any, @Body() _loginDto: LoginDto): Promise<User> {
    // _loginDto is not used here because Passport handles the authentication
    return req.user;
  }
  
  @Post('logout')
  async logout(@Request() req: any, @Res() res: Response): Promise<void> {
    req.logout((err: any) => {
      if (err) {
        console.error('Logout error:', err);
      }
      res.status(200).json({ message: 'Logged out successfully' });
    });
  }
  
  @Get('profile')
  @UseGuards(AuthenticatedGuard)
  getProfile(@Request() req: any): User {
    return req.user;
  }
}