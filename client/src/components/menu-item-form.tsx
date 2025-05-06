import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { MenuItem, Restaurant } from "@/lib/types";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

// Schema for form validation
const menuItemSchema = z.object({
  restaurantId: z.number().positive("Restaurant is required"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  price: z.string().min(1, "Price is required"),
  category: z.string().min(1, "Category is required"),
  imageUrl: z.string().optional(),
});

type FormData = z.infer<typeof menuItemSchema>;

interface MenuItemFormProps {
  menuItem?: MenuItem;
  onSuccess?: () => void;
}

export function MenuItemForm({ menuItem, onSuccess }: MenuItemFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all restaurants for the dropdown
  const { data: restaurants = [] } = useQuery<Restaurant[]>({
    queryKey: ["/api/restaurants"],
  });

  // Initialize form with existing data or defaults
  const form = useForm<FormData>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: menuItem
      ? {
          restaurantId: menuItem.restaurantId,
          name: menuItem.name,
          description: menuItem.description || "",
          price: menuItem.price,
          category: menuItem.category,
          imageUrl: menuItem.imageUrl || "",
        }
      : {
          restaurantId: 0,
          name: "",
          description: "",
          price: "",
          category: "",
          imageUrl: "",
        },
  });

  // Create or update mutation
  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const url = menuItem
        ? `/api/menu-items/${menuItem.id}`
        : "/api/menu-items";
      const method = menuItem ? "PUT" : "POST";
      
      const response = await apiRequest(method, url, data);
      return response.json();
    },
    onSuccess: () => {
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/menu-items"] });
      
      toast({
        title: menuItem ? "Menu item updated" : "Menu item created",
        description: menuItem
          ? "The menu item has been updated successfully."
          : "The menu item has been created successfully.",
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
          name="restaurantId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Restaurant</FormLabel>
              <Select
                value={field.value.toString()}
                onValueChange={(value) => field.onChange(parseInt(value))}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a restaurant" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {restaurants.map((restaurant) => (
                    <SelectItem
                      key={restaurant.id}
                      value={restaurant.id.toString()}
                    >
                      {restaurant.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Select the restaurant this menu item belongs to
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Menu item name" {...field} />
              </FormControl>
              <FormDescription>
                The name of the menu item as it will appear to customers
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
                  placeholder="Describe this menu item"
                  {...field}
                  rows={3}
                />
              </FormControl>
              <FormDescription>
                A detailed description of the menu item
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input placeholder="$10.99" {...field} />
                </FormControl>
                <FormDescription>The price of the menu item</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input placeholder="Appetizer, Main, Dessert, etc." {...field} />
                </FormControl>
                <FormDescription>
                  The category this menu item belongs to
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
                An image URL for this menu item (optional)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Saving..." : menuItem ? "Update Menu Item" : "Create Menu Item"}
        </Button>
      </form>
    </Form>
  );
}
