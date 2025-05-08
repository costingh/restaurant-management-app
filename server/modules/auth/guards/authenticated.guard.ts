import { ExecutionContext, Injectable, CanActivate, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    
    if (!request.isAuthenticated()) {
      throw new UnauthorizedException('Not authenticated');
    }
    
    return true;
  }
}