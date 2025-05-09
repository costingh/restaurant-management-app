import { Injectable, CanActivate, ExecutionContext, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DatabaseService } from '../../database/database.service';

export const RequirePermission = (action: string, resource: string) => 
  SetMetadata('permission', { action, resource });

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private databaseService: DatabaseService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Get permission requirements from route handler metadata
    const permission = this.reflector.get<{action: string, resource: string}>('permission', context.getHandler());
    
    // If no permission requirements, allow access
    if (!permission) {
      return true;
    }

    const { action, resource } = permission;
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // No user means not authenticated
    if (!user) {
      return false;
    }

    // Compatibility: Admin users have all permissions
    if (user.isAdmin) {
      return true;
    }

    // Check if the user has the required permission
    return this.databaseService.userHasPermission(user.id, action, resource);
  }
}