import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertRestaurantSchema, 
  insertMenuItemSchema,
  insertReviewSchema
} from "@shared/schema";
import { ZodError } from "zod";
import { setupAuth } from "./auth";

// Middleware to check if user is admin
const isAdmin = (req: Request, res: Response, next: Function) => {
  if (!req.isAuthenticated() || !req.user.isAdmin) {
    return res.status(403).json({ message: "Unauthorized access" });
  }
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication with Passport
  setupAuth(app);
  
  
  // Restaurant routes
  app.get("/api/restaurants", async (req, res) => {
    try {
      const restaurants = await storage.getAllRestaurants();
      return res.status(200).json(restaurants);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });
  
  app.get("/api/restaurants/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid restaurant ID" });
      }
      
      const restaurant = await storage.getRestaurant(id);
      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }
      
      return res.status(200).json(restaurant);
    } catch (error) {
      console.error("Error fetching restaurant:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });
  
  app.post("/api/restaurants", isAdmin, async (req, res) => {
    try {
      const restaurantData = insertRestaurantSchema.parse(req.body);
      const newRestaurant = await storage.createRestaurant(restaurantData);
      return res.status(201).json(newRestaurant);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid restaurant data", errors: error.errors });
      }
      console.error("Error creating restaurant:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });
  
  app.put("/api/restaurants/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid restaurant ID" });
      }
      
      // Validate the update data
      const updateData = insertRestaurantSchema.partial().parse(req.body);
      
      const updatedRestaurant = await storage.updateRestaurant(id, updateData);
      if (!updatedRestaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }
      
      return res.status(200).json(updatedRestaurant);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid restaurant data", errors: error.errors });
      }
      console.error("Error updating restaurant:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });
  
  app.delete("/api/restaurants/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid restaurant ID" });
      }
      
      const deleted = await storage.deleteRestaurant(id);
      if (!deleted) {
        return res.status(404).json({ message: "Restaurant not found" });
      }
      
      return res.status(200).json({ message: "Restaurant deleted successfully" });
    } catch (error) {
      console.error("Error deleting restaurant:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });
  
  // Menu item routes
  app.get("/api/menu-items", async (req, res) => {
    try {
      const restaurantId = req.query.restaurantId ? parseInt(req.query.restaurantId as string) : undefined;
      
      let menuItems;
      if (restaurantId && !isNaN(restaurantId)) {
        menuItems = await storage.getMenuItemsByRestaurant(restaurantId);
      } else {
        menuItems = await storage.getAllMenuItems();
      }
      
      return res.status(200).json(menuItems);
    } catch (error) {
      console.error("Error fetching menu items:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });
  
  app.get("/api/menu-items/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid menu item ID" });
      }
      
      const menuItem = await storage.getMenuItem(id);
      if (!menuItem) {
        return res.status(404).json({ message: "Menu item not found" });
      }
      
      return res.status(200).json(menuItem);
    } catch (error) {
      console.error("Error fetching menu item:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });
  
  app.post("/api/menu-items", isAdmin, async (req, res) => {
    try {
      const menuItemData = insertMenuItemSchema.parse(req.body);
      
      // Verify that the referenced restaurant exists
      const restaurant = await storage.getRestaurant(menuItemData.restaurantId);
      if (!restaurant) {
        return res.status(400).json({ message: "Referenced restaurant not found" });
      }
      
      const newMenuItem = await storage.createMenuItem(menuItemData);
      return res.status(201).json(newMenuItem);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid menu item data", errors: error.errors });
      }
      console.error("Error creating menu item:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });
  
  app.put("/api/menu-items/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid menu item ID" });
      }
      
      // Validate the update data
      const updateData = insertMenuItemSchema.partial().parse(req.body);
      
      // If restaurantId is provided, verify that the restaurant exists
      if (updateData.restaurantId) {
        const restaurant = await storage.getRestaurant(updateData.restaurantId);
        if (!restaurant) {
          return res.status(400).json({ message: "Referenced restaurant not found" });
        }
      }
      
      const updatedMenuItem = await storage.updateMenuItem(id, updateData);
      if (!updatedMenuItem) {
        return res.status(404).json({ message: "Menu item not found" });
      }
      
      return res.status(200).json(updatedMenuItem);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid menu item data", errors: error.errors });
      }
      console.error("Error updating menu item:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });
  
  app.delete("/api/menu-items/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid menu item ID" });
      }
      
      const deleted = await storage.deleteMenuItem(id);
      if (!deleted) {
        return res.status(404).json({ message: "Menu item not found" });
      }
      
      return res.status(200).json({ message: "Menu item deleted successfully" });
    } catch (error) {
      console.error("Error deleting menu item:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });

  // Review routes
  app.get("/api/reviews", async (req, res) => {
    try {
      const restaurantId = req.query.restaurantId ? parseInt(req.query.restaurantId as string) : undefined;
      const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
      
      let reviews;
      if (restaurantId && !isNaN(restaurantId)) {
        reviews = await storage.getReviewsByRestaurant(restaurantId);
      } else if (userId && !isNaN(userId)) {
        reviews = await storage.getReviewsByUser(userId);
      } else {
        reviews = await storage.getAllReviews();
      }
      
      return res.status(200).json(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });
  
  app.get("/api/reviews/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid review ID" });
      }
      
      const review = await storage.getReview(id);
      if (!review) {
        return res.status(404).json({ message: "Review not found" });
      }
      
      return res.status(200).json(review);
    } catch (error) {
      console.error("Error fetching review:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });
  
  app.post("/api/reviews", async (req, res) => {
    try {
      // Check if user is authenticated
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to post a review" });
      }
      
      const reviewData = insertReviewSchema.parse(req.body);
      
      // Ensure the user can only post reviews as themselves
      if (reviewData.userId !== req.user.id) {
        return res.status(403).json({ message: "You can only post reviews as yourself" });
      }
      
      // Verify that the referenced restaurant exists
      const restaurant = await storage.getRestaurant(reviewData.restaurantId);
      if (!restaurant) {
        return res.status(400).json({ message: "Referenced restaurant not found" });
      }
      
      const newReview = await storage.createReview(reviewData);
      return res.status(201).json(newReview);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid review data", errors: error.errors });
      }
      console.error("Error creating review:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });
  
  app.patch("/api/reviews/:id", async (req, res) => {
    try {
      // Check if user is authenticated
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to update a review" });
      }
      
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid review ID" });
      }
      
      // Get the existing review
      const existingReview = await storage.getReview(id);
      if (!existingReview) {
        return res.status(404).json({ message: "Review not found" });
      }
      
      // Ensure the user can only update their own reviews (or is an admin)
      if (existingReview.userId !== req.user.id && !req.user.isAdmin) {
        return res.status(403).json({ message: "You can only update your own reviews" });
      }
      
      // Validate the update data
      const updateData = insertReviewSchema.partial().parse(req.body);
      
      // Don't allow changing restaurant or user
      delete updateData.restaurantId;
      delete updateData.userId;
      
      const updatedReview = await storage.updateReview(id, updateData);
      if (!updatedReview) {
        return res.status(404).json({ message: "Review not found" });
      }
      
      return res.status(200).json(updatedReview);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid review data", errors: error.errors });
      }
      console.error("Error updating review:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });
  
  app.delete("/api/reviews/:id", async (req, res) => {
    try {
      // Check if user is authenticated
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to delete a review" });
      }
      
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid review ID" });
      }
      
      // Get the existing review
      const existingReview = await storage.getReview(id);
      if (!existingReview) {
        return res.status(404).json({ message: "Review not found" });
      }
      
      // Ensure the user can only delete their own reviews (or is an admin)
      if (existingReview.userId !== req.user.id && !req.user.isAdmin) {
        return res.status(403).json({ message: "You can only delete your own reviews" });
      }
      
      const deleted = await storage.deleteReview(id);
      if (!deleted) {
        return res.status(404).json({ message: "Review not found" });
      }
      
      return res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
      console.error("Error deleting review:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
