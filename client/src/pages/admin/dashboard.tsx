import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Restaurant, MenuItem } from "@/lib/types";
import { RestaurantCard } from "@/components/restaurant-card";
import { Store, Utensils, BarChart } from "lucide-react";

export default function AdminDashboard() {
  // Fetch restaurants and menu items
  const { data: restaurants = [] } = useQuery<Restaurant[]>({
    queryKey: ["/api/restaurants"],
  });

  const { data: menuItems = [] } = useQuery<MenuItem[]>({
    queryKey: ["/api/menu-items"],
  });

  // Get top restaurants by number of menu items
  const topRestaurants = [...restaurants]
    .map((restaurant) => ({
      ...restaurant,
      menuItemCount: menuItems.filter(
        (item) => item.restaurantId === restaurant.id
      ).length,
    }))
    .sort((a, b) => b.menuItemCount - a.menuItemCount)
    .slice(0, 3);

  // Get cuisine distribution
  const cuisineDistribution = restaurants.reduce((acc, restaurant) => {
    acc[restaurant.cuisine] = (acc[restaurant.cuisine] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Get category distribution for menu items
  const categoryDistribution = menuItems.reduce((acc, menuItem) => {
    acc[menuItem.category] = (acc[menuItem.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your restaurants and menu items from a central location.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button asChild>
              <Link href="/admin/restaurants">Manage Restaurants</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/menu-items">Manage Menu Items</Link>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Restaurants
              </CardTitle>
              <Store className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{restaurants.length}</div>
              <p className="text-xs text-muted-foreground">
                Across {Object.keys(cuisineDistribution).length} cuisine types
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Menu Items
              </CardTitle>
              <Utensils className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{menuItems.length}</div>
              <p className="text-xs text-muted-foreground">
                Across {Object.keys(categoryDistribution).length} categories
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Menu Size
              </CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {restaurants.length
                  ? (menuItems.length / restaurants.length).toFixed(1)
                  : "0"}
              </div>
              <p className="text-xs text-muted-foreground">
                Items per restaurant
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Featured Restaurants */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold tracking-tight">Top Restaurants</h2>
            <Button variant="link" asChild>
              <Link href="/admin/restaurants">View all</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {topRestaurants.length > 0 ? (
              topRestaurants.map((restaurant) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))
            ) : (
              <div className="col-span-3 flex items-center justify-center py-8">
                <p className="text-center text-muted-foreground">
                  No restaurants found. Create your first restaurant to get
                  started.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Distribution Cards */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Cuisine Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              {Object.keys(cuisineDistribution).length > 0 ? (
                <ul className="space-y-2">
                  {Object.entries(cuisineDistribution)
                    .sort((a, b) => b[1] - a[1])
                    .map(([cuisine, count]) => (
                      <li key={cuisine} className="flex items-center justify-between">
                        <span className="text-sm">{cuisine}</span>
                        <div className="flex items-center gap-2">
                          <div className="h-2 bg-primary rounded-full" style={{ width: `${(count / restaurants.length) * 100}px` }} />
                          <span className="text-sm text-muted-foreground">{count}</span>
                        </div>
                      </li>
                    ))}
                </ul>
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  No cuisine data available
                </p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Menu Categories</CardTitle>
            </CardHeader>
            <CardContent>
              {Object.keys(categoryDistribution).length > 0 ? (
                <ul className="space-y-2">
                  {Object.entries(categoryDistribution)
                    .sort((a, b) => b[1] - a[1])
                    .map(([category, count]) => (
                      <li key={category} className="flex items-center justify-between">
                        <span className="text-sm">{category}</span>
                        <div className="flex items-center gap-2">
                          <div className="h-2 bg-primary rounded-full" style={{ width: `${(count / menuItems.length) * 100}px` }} />
                          <span className="text-sm text-muted-foreground">{count}</span>
                        </div>
                      </li>
                    ))}
                </ul>
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  No category data available
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
