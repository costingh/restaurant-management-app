import { Injectable, Logger } from '@nestjs/common';
import { db } from './db';
import { eq, and, SQL, sql } from 'drizzle-orm';
import { 
  users, restaurants, menuItems, roles, permissions, rolePermissions,
  type User, type Restaurant, type MenuItem, type Role, type Permission, type RolePermission,
  type InsertUser, type InsertRestaurant, type InsertMenuItem, type InsertRole, type InsertPermission, type InsertRolePermission,
  insertUserSchema, insertRestaurantSchema, insertMenuItemSchema
} from '../../shared/schema';

@Injectable()
export class DatabaseService {
  private readonly logger = new Logger(DatabaseService.name);

  constructor() {
    this.logger.log('DatabaseService initialized');
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, id));
      return user || undefined;
    } catch (error: any) {
      this.logger.error(`Error getting user: ${error.message}`);
      throw error;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser as typeof users.$inferInsert)
      .returning();
    return user;
  }
  
  // Restaurant operations
  async getAllRestaurants(): Promise<Restaurant[]> {
    try {
      this.logger.log('Fetching all restaurants');
      const result = await db.select().from(restaurants);
      this.logger.log(`Found ${result.length} restaurants`);
      return result;
    } catch (error: any) {
      this.logger.error(`Error getting all restaurants: ${error.message}`);
      throw error;
    }
  }

  async getRestaurant(id: number): Promise<Restaurant | undefined> {
    const [restaurant] = await db.select().from(restaurants).where(eq(restaurants.id, id));
    return restaurant || undefined;
  }

  async createRestaurant(insertRestaurant: InsertRestaurant): Promise<Restaurant> {
    const [restaurant] = await db
      .insert(restaurants)
      .values(insertRestaurant as typeof restaurants.$inferInsert)
      .returning();
    return restaurant;
  }

  async updateRestaurant(id: number, updateData: Partial<InsertRestaurant>): Promise<Restaurant | undefined> {
    const [restaurant] = await db
      .update(restaurants)
      .set(updateData)
      .where(eq(restaurants.id, id))
      .returning();
    return restaurant || undefined;
  }

  async deleteRestaurant(id: number): Promise<boolean> {
    const result = await db
      .delete(restaurants)
      .where(eq(restaurants.id, id))
      .returning({ id: restaurants.id });
    return result.length > 0;
  }
  
  // Menu item operations
  async getAllMenuItems(): Promise<MenuItem[]> {
    return db.select().from(menuItems);
  }

  async getMenuItemsByRestaurant(restaurantId: number): Promise<MenuItem[]> {
    return db.select().from(menuItems).where(eq(menuItems.restaurantId, restaurantId));
  }

  async getMenuItem(id: number): Promise<MenuItem | undefined> {
    const [menuItem] = await db.select().from(menuItems).where(eq(menuItems.id, id));
    return menuItem || undefined;
  }

  async createMenuItem(insertMenuItem: InsertMenuItem): Promise<MenuItem> {
    const [menuItem] = await db
      .insert(menuItems)
      .values(insertMenuItem as typeof menuItems.$inferInsert)
      .returning();
    return menuItem;
  }

  async updateMenuItem(id: number, updateData: Partial<InsertMenuItem>): Promise<MenuItem | undefined> {
    const [menuItem] = await db
      .update(menuItems)
      .set(updateData)
      .where(eq(menuItems.id, id))
      .returning();
    return menuItem || undefined;
  }

  async deleteMenuItem(id: number): Promise<boolean> {
    const result = await db
      .delete(menuItems)
      .where(eq(menuItems.id, id))
      .returning({ id: menuItems.id });
    return result.length > 0;
  }

  // Role operations
  async getAllRoles(): Promise<Role[]> {
    return db.select().from(roles);
  }

  async getRole(id: number): Promise<Role | undefined> {
    const [role] = await db.select().from(roles).where(eq(roles.id, id));
    return role || undefined;
  }

  async getRoleWithPermissions(id: number): Promise<(Role & { permissions: Permission[] }) | undefined> {
    try {
      // First get the role
      const [role] = await db.select().from(roles).where(eq(roles.id, id));
      if (!role) return undefined;

      // Then get the permissions for this role
      const rolePerms = await db
        .select({
          permission: permissions
        })
        .from(rolePermissions)
        .innerJoin(permissions, eq(permissions.id, rolePermissions.permissionId))
        .where(eq(rolePermissions.roleId, id));

      return {
        ...role,
        permissions: rolePerms.map(rp => rp.permission)
      };
    } catch (error: any) {
      this.logger.error(`Error getting role with permissions: ${error.message}`);
      throw error;
    }
  }

  async createRole(insertRole: InsertRole): Promise<Role> {
    const [role] = await db
      .insert(roles)
      .values(insertRole)
      .returning();
    return role;
  }

  async updateRole(id: number, updateData: Partial<InsertRole>): Promise<Role | undefined> {
    const [role] = await db
      .update(roles)
      .set(updateData)
      .where(eq(roles.id, id))
      .returning();
    return role || undefined;
  }

  async deleteRole(id: number): Promise<boolean> {
    const result = await db
      .delete(roles)
      .where(eq(roles.id, id))
      .returning({ id: roles.id });
    return result.length > 0;
  }

  // Permission operations
  async getAllPermissions(): Promise<Permission[]> {
    return db.select().from(permissions);
  }

  async getPermission(id: number): Promise<Permission | undefined> {
    const [permission] = await db.select().from(permissions).where(eq(permissions.id, id));
    return permission || undefined;
  }

  async getPermissionByActionAndResource(action: string, resource: string): Promise<Permission | undefined> {
    const [permission] = await db
      .select()
      .from(permissions)
      .where(and(
        eq(permissions.action, action),
        eq(permissions.resource, resource)
      ));
    return permission || undefined;
  }

  async createPermission(insertPermission: InsertPermission): Promise<Permission> {
    const [permission] = await db
      .insert(permissions)
      .values(insertPermission)
      .returning();
    return permission;
  }

  async updatePermission(id: number, updateData: Partial<InsertPermission>): Promise<Permission | undefined> {
    const [permission] = await db
      .update(permissions)
      .set(updateData)
      .where(eq(permissions.id, id))
      .returning();
    return permission || undefined;
  }

  async deletePermission(id: number): Promise<boolean> {
    const result = await db
      .delete(permissions)
      .where(eq(permissions.id, id))
      .returning({ id: permissions.id });
    return result.length > 0;
  }

  // Role-Permission operations
  async assignPermissionToRole(roleId: number, permissionId: number): Promise<RolePermission> {
    const [rolePermission] = await db
      .insert(rolePermissions)
      .values({ roleId, permissionId })
      .returning();
    return rolePermission;
  }

  async removePermissionFromRole(roleId: number, permissionId: number): Promise<boolean> {
    const result = await db
      .delete(rolePermissions)
      .where(and(
        eq(rolePermissions.roleId, roleId),
        eq(rolePermissions.permissionId, permissionId)
      ))
      .returning();
    return result.length > 0;
  }

  async getRolePermissions(roleId: number): Promise<Permission[]> {
    const result = await db
      .select({
        permission: permissions
      })
      .from(rolePermissions)
      .innerJoin(permissions, eq(permissions.id, rolePermissions.permissionId))
      .where(eq(rolePermissions.roleId, roleId));
    
    return result.map(r => r.permission);
  }

  // Enhanced user methods for role management
  async updateUserRole(userId: number, roleId: number): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ roleId })
      .where(eq(users.id, userId))
      .returning();
    return user || undefined;
  }

  async getUserWithRole(id: number): Promise<(User & { role?: Role }) | undefined> {
    try {
      // Get user with role join
      const result = await db
        .select({
          user: users,
          role: roles
        })
        .from(users)
        .leftJoin(roles, eq(users.roleId, roles.id))
        .where(eq(users.id, id));

      if (result.length === 0) return undefined;
      
      const { user, role } = result[0];
      return {
        ...user,
        role: role || undefined
      };
    } catch (error: any) {
      this.logger.error(`Error getting user with role: ${error.message}`);
      throw error;
    }
  }

  // Check if a user has a specific permission
  async userHasPermission(userId: number, action: string, resource: string): Promise<boolean> {
    try {
      // First, get the user to check if admin
      const user = await this.getUser(userId);
      if (!user) return false;
      
      // Admins have all permissions for backward compatibility
      if (user.isAdmin) return true;
      
      // If no roleId, user has no permissions
      if (!user.roleId) return false;
      
      // Check if the user's role has the specific permission
      const permCount = await db
        .select({ count: sql<number>`count(*)` })
        .from(rolePermissions)
        .innerJoin(permissions, eq(permissions.id, rolePermissions.permissionId))
        .where(and(
          eq(rolePermissions.roleId, user.roleId),
          eq(permissions.action, action),
          eq(permissions.resource, resource)
        ));
      
      return permCount[0].count > 0;
    } catch (error: any) {
      this.logger.error(`Error checking user permission: ${error.message}`);
      return false;
    }
  }
}
