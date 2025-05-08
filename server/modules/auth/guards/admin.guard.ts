import { ExecutionContext, Injectable, CanActivate, ForbiddenException } from '@nestjs/common';
import { User } from '../../../shared/schema';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user as User;
    
    if (!user || !user.isAdmin) {
      throw new ForbiddenException('Admin privileges required');
    }
    
    return true;
  }
}