import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import type { Review, User } from "@/lib/types";
import { StarRating } from "./star-rating";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Trash, Edit } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
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
import { formatDistanceToNow } from "date-fns";

interface ReviewListProps {
  restaurantId: number;
  currentUser?: User | null;
  onEditReview: (review: Review) => void;
}

export function ReviewList({ restaurantId, currentUser, onEditReview }: ReviewListProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [reviewToDelete, setReviewToDelete] = useState<number | null>(null);

  const { data: reviews, isLoading, error } = useQuery({
    queryKey: ['/api/reviews', 'restaurant', restaurantId.toString()],
    queryFn: async () => {
      const res = await fetch(`/api/reviews?restaurantId=${restaurantId}`);
      if (!res.ok) throw new Error('Failed to fetch reviews');
      return res.json() as Promise<Review[]>;
    },
  });

  const { data: users } = useQuery({
    queryKey: ['/api/users'],
    queryFn: async () => {
      const res = await fetch('/api/users');
      if (!res.ok) throw new Error('Failed to fetch users');
      return res.json() as Promise<User[]>;
    },
    enabled: !!reviews && reviews.length > 0,
  });

  const deleteMutation = useMutation({
    mutationFn: async (reviewId: number) => {
      return apiRequest(`/api/reviews/${reviewId}`, "DELETE");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/reviews'] });
      queryClient.invalidateQueries({ queryKey: ['/api/reviews', 'restaurant', restaurantId.toString()] });
      toast({
        title: "Review deleted",
        description: "The review has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete review. Please try again.",
        variant: "destructive",
      });
      console.error(error);
    },
  });

  const handleDeleteReview = (id: number) => {
    setReviewToDelete(id);
  };

  const confirmDelete = () => {
    if (reviewToDelete) {
      deleteMutation.mutate(reviewToDelete);
      setReviewToDelete(null);
    }
  };

  const getUsernameById = (userId: number) => {
    if (!users) return "Unknown User";
    const user = users.find(u => u.id === userId);
    return user ? user.username : "Unknown User";
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Reviews</h2>
        {[1, 2, 3].map((i) => (
          <Card key={i} className="w-full">
            <CardHeader>
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-4 w-20" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error loading reviews: {(error as Error).message}</div>;
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Reviews</h2>
        <Card className="w-full">
          <CardContent className="pt-6">
            <p className="text-center text-gray-500">No reviews yet for this restaurant.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Reviews ({reviews.length})</h2>
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id} className="w-full">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{getUsernameById(review.userId)}</CardTitle>
                  <div className="flex items-center mt-1">
                    <StarRating rating={review.rating} setRating={() => {}} readonly={true} size={16} />
                  </div>
                </div>
                
                {currentUser && currentUser.id === review.userId && (
                  <div className="flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onEditReview(review)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    <AlertDialog open={reviewToDelete === review.id} onOpenChange={(open) => !open && setReviewToDelete(null)}>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDeleteReview(review.id)}
                        >
                          <Trash className="h-4 w-4 text-red-500" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your review.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{review.content}</p>
            </CardContent>
            <CardFooter className="pt-0 text-xs text-gray-500">
              {review.createdAt && (
                <span>Posted {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}</span>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}