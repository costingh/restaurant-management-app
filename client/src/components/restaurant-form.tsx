import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Restaurant } from "@/lib/types";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

// Schema for form validation
const restaurantSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  cuisine: z.string().min(2, "Cuisine must be at least 2 characters"),
  location: z.string().min(5, "Location must be at least 5 characters"),
  phone: z.string().min(7, "Please enter a valid phone number"),
  openingHours: z.string().min(5, "Please enter valid opening hours"),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
});

type FormData = z.infer<typeof restaurantSchema>;

interface RestaurantFormProps {
  restaurant?: Restaurant;
  onSuccess?: () => void;
}

export function RestaurantForm({ restaurant, onSuccess }: RestaurantFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Initialize form with existing data or defaults
  const form = useForm<FormData>({
    resolver: zodResolver(restaurantSchema),
    defaultValues: restaurant
      ? {
          name: restaurant.name,
          cuisine: restaurant.cuisine,
          location: restaurant.location,
          phone: restaurant.phone,
          openingHours: restaurant.openingHours,
          description: restaurant.description || "",
          imageUrl: restaurant.imageUrl || "",
        }
      : {
          name: "",
          cuisine: "",
          location: "",
          phone: "",
          openingHours: "",
          description: "",
          imageUrl: "",
        },
  });

  // Create or update mutation
  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const url = restaurant
        ? `/api/restaurants/${restaurant.id}`
        : "/api/restaurants";
      const method = restaurant ? "PUT" : "POST";
      
      const response = await apiRequest(method, url, data);
      return response.json();
    },
    onSuccess: () => {
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/restaurants"] });
      
      toast({
        title: restaurant ? "Restaurant updated" : "Restaurant created",
        description: restaurant
          ? "The restaurant has been updated successfully."
          : "The restaurant has been created successfully.",
        variant: "default",
      });
      
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "An error occurred. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Restaurant name" {...field} />
              </FormControl>
              <FormDescription>
                The name of your restaurant as it will appear to customers
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="cuisine"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cuisine</FormLabel>
                <FormControl>
                  <Input placeholder="Italian, Mexican, etc." {...field} />
                </FormControl>
                <FormDescription>
                  The type of cuisine your restaurant offers
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="(555) 123-4567" {...field} />
                </FormControl>
                <FormDescription>
                  A contact phone number for your restaurant
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="123 Main St, Anytown" {...field} />
              </FormControl>
              <FormDescription>
                The physical address of your restaurant
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="openingHours"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Opening Hours</FormLabel>
              <FormControl>
                <Input
                  placeholder="Mon-Fri: 9AM-10PM, Sat-Sun: 10AM-11PM"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                The hours your restaurant is open for business
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="A brief description of your restaurant"
                  {...field}
                  rows={3}
                />
              </FormControl>
              <FormDescription>
                Describe your restaurant, its ambiance, and what makes it unique
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/image.jpg" {...field} />
              </FormControl>
              <FormDescription>
                An image URL for your restaurant (optional)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Saving..." : restaurant ? "Update Restaurant" : "Create Restaurant"}
        </Button>
      </form>
    </Form>
  );
}
