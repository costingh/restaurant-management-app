import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { User } from "@/lib/types";

import {
  LayoutGrid,
  Menu,
  Utensils,
  Store,
  LogOut,
  User as UserIcon,
  X,
  Home,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { useMobile } from "@/hooks/use-mobile";

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const NavItem = ({ href, icon, label, active, onClick }: NavItemProps) => (
  <Link href={href} onClick={onClick}>
    <Button
      variant={active ? "secondary" : "ghost"}
      className="w-full justify-start gap-2"
    >
      {icon}
      {label}
    </Button>
  </Link>
);

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const isMobile = useMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toast } = useToast();

  // Fetch current user info
  const { data: user } = useQuery<User>({
    queryKey: ["/api/users/current-user"],
    onError: () => {
      // Silently fail - user is not logged in
    },
  });

  const handleLogout = async () => {
    try {
      await apiRequest("GET", "/api/logout");
      window.location.href = "/";
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-background px-4 lg:hidden">
        <div className="flex items-center gap-2">
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="flex h-16 items-center border-b px-4">
                <Link href="/" className="flex items-center gap-2">
                  <Utensils className="h-5 w-5" />
                  <span className="font-semibold">Restaurant Manager</span>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-auto"
                  onClick={() => setSidebarOpen(false)}
                >
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close</span>
                </Button>
              </div>
              <nav className="flex flex-col gap-1 p-4">
                <NavItem
                  href="/"
                  icon={<Home className="h-5 w-5" />}
                  label="Home"
                  active={location === "/"}
                  onClick={() => setSidebarOpen(false)}
                />
                {user?.isAdmin && (
                  <>
                    <NavItem
                      href="/admin"
                      icon={<LayoutGrid className="h-5 w-5" />}
                      label="Dashboard"
                      active={location === "/admin"}
                      onClick={() => setSidebarOpen(false)}
                    />
                    <NavItem
                      href="/admin/restaurants"
                      icon={<Store className="h-5 w-5" />}
                      label="Restaurants"
                      active={location === "/admin/restaurants"}
                      onClick={() => setSidebarOpen(false)}
                    />
                    <NavItem
                      href="/admin/menu-items"
                      icon={<Utensils className="h-5 w-5" />}
                      label="Menu Items"
                      active={location === "/admin/menu-items"}
                      onClick={() => setSidebarOpen(false)}
                    />
                  </>
                )}
                <Separator className="my-2" />
                {user ? (
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2"
                    onClick={() => {
                      handleLogout();
                      setSidebarOpen(false);
                    }}
                  >
                    <LogOut className="h-5 w-5" />
                    Logout
                  </Button>
                ) : (
                  <NavItem
                    href="/auth"
                    icon={<UserIcon className="h-5 w-5" />}
                    label="Login"
                    active={location === "/auth"}
                    onClick={() => setSidebarOpen(false)}
                  />
                )}
              </nav>
            </SheetContent>
          </Sheet>
          <Link href="/" className="flex items-center gap-2">
            <Utensils className="h-5 w-5" />
            <span className="font-semibold">Restaurant Manager</span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {user.username}
              </span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button asChild variant="outline" size="sm">
              <Link href="/auth">Login</Link>
            </Button>
          )}
        </div>
      </header>

      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 hidden w-64 border-r bg-background lg:flex lg:flex-col",
            {
              "lg:w-64": !isMobile,
            }
          )}
        >
          <div className="flex h-16 items-center border-b px-6">
            <Link href="/" className="flex items-center gap-2">
              <Utensils className="h-5 w-5" />
              <span className="font-semibold">Restaurant Manager</span>
            </Link>
          </div>
          <nav className="flex flex-1 flex-col gap-1 p-4">
            <NavItem
              href="/"
              icon={<Home className="h-5 w-5" />}
              label="Home"
              active={location === "/"}
            />
            {user?.isAdmin && (
              <>
                <NavItem
                  href="/admin"
                  icon={<LayoutGrid className="h-5 w-5" />}
                  label="Dashboard"
                  active={location === "/admin"}
                />
                <NavItem
                  href="/admin/restaurants"
                  icon={<Store className="h-5 w-5" />}
                  label="Restaurants"
                  active={location === "/admin/restaurants"}
                />
                <NavItem
                  href="/admin/menu-items"
                  icon={<Utensils className="h-5 w-5" />}
                  label="Menu Items"
                  active={location === "/admin/menu-items"}
                />
              </>
            )}
          </nav>
          <div className="border-t p-4">
            {user ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <UserIcon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{user.username}</p>
                    <p className="text-xs text-muted-foreground">
                      {user.isAdmin ? "Administrator" : "User"}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5" />
                  Logout
                </Button>
              </div>
            ) : (
              <Button asChild className="w-full">
                <Link href="/auth">Login</Link>
              </Button>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main
          className={cn("flex-1 overflow-hidden", {
            "lg:ml-64": !isMobile,
          })}
        >
          <div className="container mx-auto max-w-7xl py-6 px-4 md:py-8 md:px-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
