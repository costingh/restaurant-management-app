import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Restaurant, MenuItem } from "@/lib/types";
import { Layout } from "@/components/layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, MapPin, Clock, Phone, Utensils } from "lucide-react";
import { Link } from "wouter";

export default function RestaurantDetails() {
  const [, params] = useRoute("/restaurants/:id");
  const restaurantId = params?.id ? parseInt(params.id) : -1;

  // Fetch restaurant details
  const { data: restaurant, isLoading: isLoadingRestaurant } = useQuery<Restaurant>({
    queryKey: [`/api/restaurants/${restaurantId}`],
    enabled: restaurantId > 0,
  });

  // Fetch menu items for this restaurant
  const { data: menuItems = [], isLoading: isLoadingMenuItems } = useQuery<MenuItem[]>({
    queryKey: [`/api/menu-items?restaurantId=${restaurantId}`],
    enabled: restaurantId > 0,
  });

  // Group menu items by category
  const menuItemsByCategory = menuItems.reduce(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    },
    {} as Record<string, MenuItem[]>
  );

  // Get unique categories
  const categories = Object.keys(menuItemsByCategory);

  if (isLoadingRestaurant) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </Layout>
    );
  }

  if (!restaurant) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <h1 className="text-2xl font-bold">Restaurant Not Found</h1>
          <p className="text-muted-foreground">
            The restaurant you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild variant="outline">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Back button */}
        <Button asChild variant="ghost" className="mb-4 pl-0">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Restaurants
          </Link>
        </Button>

        {/* Restaurant header */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">{restaurant.name}</h1>
            <Badge variant="outline" className="bg-primary/10 text-primary">
              {restaurant.cuisine}
            </Badge>
          </div>
          <p className="text-muted-foreground">{restaurant.description}</p>
        </div>

        {/* Restaurant details and image */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
          <div className="md:col-span-3 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Restaurant Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-muted-foreground">{restaurant.location}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Contact</p>
                    <p className="text-muted-foreground">{restaurant.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Hours</p>
                    <p className="text-muted-foreground">{restaurant.openingHours}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="md:col-span-2">
            {restaurant.imageUrl ? (
              <div className="aspect-video h-full w-full rounded-md bg-cover bg-center bg-no-repeat overflow-hidden" style={{ backgroundImage: `url(${restaurant.imageUrl})` }} />
            ) : (
              <div className="flex aspect-video h-full w-full items-center justify-center rounded-md bg-muted">
                <Utensils className="h-12 w-12 text-muted-foreground/60" />
              </div>
            )}
          </div>
        </div>

        {/* Menu section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Utensils className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-semibold tracking-tight">Menu</h2>
          </div>

          {isLoadingMenuItems ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : menuItems.length > 0 ? (
            <Tabs defaultValue={categories[0] || "all"}>
              <TabsList className="mb-4">
                {categories.map((category) => (
                  <TabsTrigger key={category} value={category}>
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>

              {categories.map((category) => (
                <TabsContent key={category} value={category}>
                  <div className="space-y-4">
                    {menuItemsByCategory[category].map((item) => (
                      <Card key={item.id}>
                        <CardContent className="p-4">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="font-semibold">{item.name}</h3>
                              {item.description && (
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {item.description}
                                </p>
                              )}
                            </div>
                            <p className="font-semibold">{item.price}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Utensils className="h-12 w-12 text-muted-foreground/60 mb-4" />
                <CardTitle className="mb-2">No Menu Items Available</CardTitle>
                <CardDescription>
                  This restaurant doesn't have any menu items listed yet.
                </CardDescription>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
}
