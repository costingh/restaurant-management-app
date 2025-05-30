import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertRestaurantSchema, 
  insertMenuItemSchema,
  insertUserSchema
} from "@shared/schema";
import { ZodError } from "zod";
import session from "express-session";
import MemoryStore from "memorystore";

// Middleware to check if user is admin
const isAdmin = (req: Request, res: Response, next: Function) => {
  if (!req.session.user || !req.session.user.isAdmin) {
    return res.status(403).json({ message: "Unauthorized access" });
  }
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  const MemoryStoreSession = MemoryStore(session);
  
  // Session setup
  app.use(session({
    secret: process.env.SESSION_SECRET || "secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === "production" },
    store: new MemoryStoreSession({
      checkPeriod: 86400000 // Clear expired sessions every 24h
    })
  }));
  
  // Authentication routes
  app.post("/api/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Store user info in session (excluding password)
      req.session.user = {
        id: user.id,
        username: user.username,
        isAdmin: user.isAdmin
      };
      
      return res.status(200).json({
        id: user.id,
        username: user.username,
        isAdmin: user.isAdmin
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });
  
  app.post("/api/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      // By default, new users are not admins unless explicitly set
      const newUser = await storage.createUser({
        ...userData,
        isAdmin: userData.isAdmin || false
      });
      
      // Return user without password
      return res.status(201).json({
        id: newUser.id,
        username: newUser.username,
        isAdmin: newUser.isAdmin
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      console.error("Registration error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });
  
  app.get("/api/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Error logging out" });
      }
      return res.status(200).json({ message: "Logged out successfully" });
    });
  });
  
  app.get("/api/current-user", (req, res) => {
    if (!req.session.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    return res.status(200).json(req.session.user);
  });
  
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

  const httpServer = createServer(app);
  return httpServer;
}
