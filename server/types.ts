/**
 * Server Type Definitions
 * 
 * This file contains TypeScript type declarations to enhance Express types
 * and enable better type checking for authentication and session features.
 */
import { User as UserType } from "@shared/schema";

// Extend Express's session and request types to work with our authentication
declare global {
  namespace Express {
    // User type will be exposed on req.user when authenticated
    interface User extends UserType {}
    
    // Extend session to include user information
    interface Session {
      passport?: {
        user: number; // userId is stored in session
      };
    }
  }
}