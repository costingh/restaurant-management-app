import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { z } from "zod";

// User table and schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").default(false).notNull(),
});

export const insertUserSchema = createInsertSchema(users, {
  username: z.string().min(1),
  password: z.string().min(1),
  isAdmin: z.boolean().default(false),
});

// Restaurant table and schema
export const restaurants = pgTable("restaurants", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  cuisine: text("cuisine").notNull(),
  location: text("location").notNull(),
  phone: text("phone").notNull(),
  openingHours: text("opening_hours").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
});

export const restaurantsRelations = relations(restaurants, ({ many }) => ({
  menuItems: many(menuItems),
}));

export const insertRestaurantSchema = createInsertSchema(restaurants, {
  name: z.string().min(1),
  cuisine: z.string().min(1),
  location: z.string().min(1),
  phone: z.string().min(1),
  openingHours: z.string().min(1),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
});

// Menu item table and schema
export const menuItems = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  restaurantId: integer("restaurant_id").notNull().references(() => restaurants.id, { onDelete: 'cascade' }),
  name: text("name").notNull(),
  description: text("description"),
  price: text("price").notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url"),
});

export const menuItemsRelations = relations(menuItems, ({ one }) => ({
  restaurant: one(restaurants, {
    fields: [menuItems.restaurantId],
    references: [restaurants.id],
  }),
}));

export const insertMenuItemSchema = createInsertSchema(menuItems, {
  restaurantId: z.number(),
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.string().min(1),
  category: z.string().min(1),
  imageUrl: z.string().optional(),
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Restaurant = typeof restaurants.$inferSelect;
export type InsertRestaurant = z.infer<typeof insertRestaurantSchema>;

export type MenuItem = typeof menuItems.$inferSelect;
export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>; 