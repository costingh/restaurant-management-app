import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Layout } from "@/components/layout";
import { Restaurant } from "@/lib/types";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { RestaurantForm } from "@/components/restaurant-form";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Plus, Store, Pencil, Trash2 } from "lucide-react";

export default function AdminRestaurants() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch restaurants
  const { data: restaurants = [], isLoading } = useQuery<Restaurant[]>({
    queryKey: ["/api/restaurants"],
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/restaurants/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/restaurants"] });
      toast({
        title: "Restaurant deleted",
        description: "The restaurant has been deleted successfully.",
      });
      setIsDeleteOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete restaurant",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setIsEditOpen(true);
  };

  const handleDelete = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (selectedRestaurant) {
      deleteMutation.mutate(selectedRestaurant.id);
    }
  };

  // Table columns configuration
  const columns = [
    {
      header: "Name",
      accessorKey: "name" as keyof Restaurant,
      cell: (row: Restaurant) => (
        <div className="font-medium">{row.name}</div>
      ),
    },
    {
      header: "Cuisine",
      accessorKey: "cuisine" as keyof Restaurant,
      cell: (row: Restaurant) => (
        <Badge variant="outline">{row.cuisine}</Badge>
      ),
    },
    {
      header: "Location",
      accessorKey: "location" as keyof Restaurant,
    },
    {
      header: "Phone",
      accessorKey: "phone" as keyof Restaurant,
    },
    {
      header: "Actions",
      accessorKey: (row: Restaurant) => (
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
            <Store className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">Restaurants</h1>
          </div>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Restaurant
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Restaurant</DialogTitle>
                <DialogDescription>
                  Fill in the details to create a new restaurant.
                </DialogDescription>
              </DialogHeader>
              <RestaurantForm onSuccess={() => setIsAddOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        <DataTable
          data={restaurants}
          columns={columns}
          searchable
          searchKeys={["name", "cuisine", "location"]}
        />

        {/* Edit Dialog */}
        {selectedRestaurant && (
          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Edit Restaurant</DialogTitle>
                <DialogDescription>
                  Update the restaurant details.
                </DialogDescription>
              </DialogHeader>
              <RestaurantForm
                restaurant={selectedRestaurant}
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
                  {selectedRestaurant?.name}
                </span>
                ? This action cannot be undone and will also delete all
                associated menu items.
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
