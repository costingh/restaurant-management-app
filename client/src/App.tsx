/**
 * Main Application Component
 * 
 * This is the root component of the application that sets up:
 * 1. React Query for data fetching
 * 2. Application routing using Wouter
 * 3. Toast notifications and tooltips
 * 
 * The application has two main sections:
 * - Public-facing pages for viewing restaurants and reviews
 * - Admin area for managing restaurants and menu items
 */

import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Login from "@/pages/login";
import RestaurantDetails from "@/pages/restaurant-details";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminRestaurants from "@/pages/admin/restaurants";
import AdminMenuItems from "@/pages/admin/menu-items";

/**
 * Router Component
 * 
 * Defines the application's routing structure using wouter.
 * The routes are organized into two sections:
 * 1. Public routes - accessible to all users
 * 2. Admin routes - accessible to authenticated admin users
 * 
 * @returns A React component containing all the application routes
 */
function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/restaurants/:id" component={RestaurantDetails} />
      
      {/* Admin routes */}
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/restaurants" component={AdminRestaurants} />
      <Route path="/admin/menu-items" component={AdminMenuItems} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

/**
 * Main App Component
 * 
 * Sets up the global providers and renders the Router component.
 * This component wraps the entire application with necessary providers:
 * - QueryClientProvider: For React Query data fetching
 * - TooltipProvider: For UI tooltips
 * - Toaster: For toast notifications
 * 
 * @returns The root component of the application
 */
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
