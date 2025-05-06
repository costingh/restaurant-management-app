import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Phone } from "lucide-react";
import { Restaurant } from "@/lib/types";
import { Link } from "wouter";

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const { id, name, cuisine, location, phone, openingHours, description, imageUrl } = restaurant;
  
  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-lg">
      <div className="aspect-video overflow-hidden bg-gray-100">
        {imageUrl ? (
          <div className="h-48 w-full bg-gray-200 bg-cover bg-center" style={{ backgroundImage: `url(${imageUrl})` }} />
        ) : (
          <div className="h-48 w-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No image available</span>
          </div>
        )}
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{name}</CardTitle>
          <Badge variant="outline" className="bg-primary/10 text-primary">
            {cuisine}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 pb-2">
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">{location}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">{phone}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground truncate">{openingHours}</span>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button asChild className="w-full" size="sm">
          <Link href={`/restaurants/${id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
