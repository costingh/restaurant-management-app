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

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  isAdmin: true,
});

// We'll define the user relations after all tables are defined to avoid circular dependencies

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

// We'll define the restaurant relations after all tables are defined to avoid circular dependencies

export const insertRestaurantSchema = createInsertSchema(restaurants).pick({
  name: true,
  cuisine: true,
  location: true,
  phone: true,
  openingHours: true,
  description: true,
  imageUrl: true,
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

export const insertMenuItemSchema = createInsertSchema(menuItems).pick({
  restaurantId: true,
  name: true,
  description: true,
  price: true,
  category: true,
  imageUrl: true,
});

// Review table and schema
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  restaurantId: integer("restaurant_id").notNull().references(() => restaurants.id, { onDelete: 'cascade' }),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  rating: integer("rating").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const reviewsRelations = relations(reviews, ({ one }) => ({
  restaurant: one(restaurants, {
    fields: [reviews.restaurantId],
    references: [restaurants.id],
  }),
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
}));

export const insertReviewSchema = createInsertSchema(reviews)
  .pick({
    restaurantId: true,
    userId: true,
    rating: true,
    content: true,
  })
  .extend({
    rating: z.number().min(1).max(5),
  });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Restaurant = typeof restaurants.$inferSelect;
export type InsertRestaurant = z.infer<typeof insertRestaurantSchema>;

export type MenuItem = typeof menuItems.$inferSelect;
export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;

export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;

// Define relations after all tables to avoid circular dependencies
export const usersRelations = relations(users, ({ many }) => ({
  reviews: many(reviews),
}));

export const restaurantsRelations = relations(restaurants, ({ many }) => ({
  menuItems: many(menuItems),
  reviews: many(reviews),
}));
