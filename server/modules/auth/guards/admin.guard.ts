import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Request } from 'express';
import { User } from '../../../shared/schema';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as User;
    
    if (!user?.isAdmin) {
      throw new ForbiddenException('Admin access required');
    }
    
    return true;
  }
}