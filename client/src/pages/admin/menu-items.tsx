import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Layout } from "@/components/layout";
import { MenuItem, Restaurant } from "@/lib/types";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { MenuItemForm } from "@/components/menu-item-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Utensils, Pencil, Trash2 } from "lucide-react";

export default function AdminMenuItems() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string>("all");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch menu items
  const { data: menuItems = [], isLoading: isLoadingMenuItems } = useQuery<MenuItem[]>({
    queryKey: ["/api/menu-items"],
  });

  // Fetch restaurants for filtering and forms
  const { data: restaurants = [], isLoading: isLoadingRestaurants } = useQuery<Restaurant[]>({
    queryKey: ["/api/restaurants"],
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/menu-items/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/menu-items"] });
      toast({
        title: "Menu item deleted",
        description: "The menu item has been deleted successfully.",
      });
      setIsDeleteOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete menu item",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (menuItem: MenuItem) => {
    setSelectedMenuItem(menuItem);
    setIsEditOpen(true);
  };

  const handleDelete = (menuItem: MenuItem) => {
    setSelectedMenuItem(menuItem);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (selectedMenuItem) {
      deleteMutation.mutate(selectedMenuItem.id);
    }
  };

  // Filter menu items by selected restaurant
  const filteredMenuItems = selectedRestaurantId === "all"
    ? menuItems
    : menuItems.filter(item => item.restaurantId === parseInt(selectedRestaurantId));

  // Get restaurant name by ID
  const getRestaurantName = (restaurantId: number) => {
    const restaurant = restaurants.find(r => r.id === restaurantId);
    return restaurant ? restaurant.name : "Unknown Restaurant";
  };

  // Table columns configuration
  const columns = [
    {
      header: "Name",
      accessorKey: "name" as keyof MenuItem,
      cell: (row: MenuItem) => (
        <div className="font-medium">{row.name}</div>
      ),
    },
    {
      header: "Restaurant",
      accessorKey: "restaurantId" as keyof MenuItem,
      cell: (row: MenuItem) => getRestaurantName(row.restaurantId),
    },
    {
      header: "Category",
      accessorKey: "category" as keyof MenuItem,
      cell: (row: MenuItem) => (
        <Badge variant="outline">{row.category}</Badge>
      ),
    },
    {
      header: "Price",
      accessorKey: "price" as keyof MenuItem,
    },
    {
      header: "Actions",
      accessorKey: (row: MenuItem) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(row);
            }}
          >
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row);
            }}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-2">
            <Utensils className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">Menu Items</h1>
          </div>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Menu Item
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Menu Item</DialogTitle>
                <DialogDescription>
                  Fill in the details to create a new menu item.
                </DialogDescription>
              </DialogHeader>
              <MenuItemForm onSuccess={() => setIsAddOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Restaurant filter */}
        <div className="w-full md:w-[280px]">
          <Select
            value={selectedRestaurantId}
            onValueChange={setSelectedRestaurantId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by Restaurant" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Restaurants</SelectItem>
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
        </div>

        <DataTable
          data={filteredMenuItems}
          columns={columns}
          searchable
          searchKeys={["name", "category", "price"]}
        />

        {/* Edit Dialog */}
        {selectedMenuItem && (
          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Edit Menu Item</DialogTitle>
                <DialogDescription>
                  Update the menu item details.
                </DialogDescription>
              </DialogHeader>
              <MenuItemForm
                menuItem={selectedMenuItem}
                onSuccess={() => setIsEditOpen(false)}
              />
            </DialogContent>
          </Dialog>
        )}

        {/* Delete Alert Dialog */}
        <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete{" "}
                <span className="font-semibold">
                  {selectedMenuItem?.name}
                </span>
                ? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  );
}
