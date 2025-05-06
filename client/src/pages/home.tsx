import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Restaurant } from "@/lib/types";
import { Layout } from "@/components/layout";
import { RestaurantCard } from "@/components/restaurant-card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Store } from "lucide-react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("");

  // Fetch restaurants
  const { data: restaurants = [], isLoading } = useQuery<Restaurant[]>({
    queryKey: ["/api/restaurants"],
  });

  // Get unique cuisines for the filter
  const cuisines = Array.from(
    new Set(restaurants.map((restaurant) => restaurant.cuisine))
  );

  // Filter restaurants based on search query and selected cuisine
  const filteredRestaurants = restaurants.filter((restaurant) => {
    const matchesSearch =
      searchQuery === "" ||
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCuisine =
      selectedCuisine === "" || restaurant.cuisine === selectedCuisine;

    return matchesSearch && matchesCuisine;
  });

  return (
    <Layout>
      <section className="mb-8 space-y-4">
        <div className="flex items-center space-x-2">
          <Store className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">Restaurants</h1>
        </div>
        <p className="text-muted-foreground">
          Browse our collection of restaurants and discover your next favorite
          dining experience.
        </p>
        
        {/* Search and filters */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search restaurants..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select
            value={selectedCuisine}
            onValueChange={setSelectedCuisine}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="All cuisines" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All cuisines</SelectItem>
              {cuisines.map((cuisine, index) => (
                <SelectItem key={index} value={cuisine}>
                  {cuisine}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </section>

      {/* Active filters */}
      {(searchQuery || selectedCuisine) && (
        <div className="mb-6 flex flex-wrap gap-2">
          {searchQuery && (
            <Badge variant="secondary" className="gap-1">
              Search: {searchQuery}
              <button
                className="ml-1"
                onClick={() => setSearchQuery("")}
              >
                ×
              </button>
            </Badge>
          )}
          {selectedCuisine && (
            <Badge variant="secondary" className="gap-1">
              Cuisine: {selectedCuisine}
              <button
                className="ml-1"
                onClick={() => setSelectedCuisine("")}
              >
                ×
              </button>
            </Badge>
          )}
        </div>
      )}

      {/* Restaurant grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-[350px] rounded-lg bg-muted/50 animate-pulse"
            />
          ))}
        </div>
      ) : filteredRestaurants.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-lg font-medium">No restaurants found</p>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search or filters to find what you're looking
            for.
          </p>
        </div>
      )}
    </Layout>
  );
}
