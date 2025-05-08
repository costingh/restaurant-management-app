/**
 * Review Form Component
 * 
 * A form component that allows users to create or edit restaurant reviews.
 * Features include:
 * - Star rating input
 * - Text content field with validation
 * - Create/update functionality based on whether an existing review is provided
 * - Form validation using Zod
 * - Toast notifications for success/error feedback
 */

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Review } from "@/lib/types";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StarRating } from "./star-rating";

/**
 * Zod schema for review form validation
 * Validates:
 * - Required restaurant and user IDs
 * - Rating between 1-5 stars
 * - Review content length (10-500 characters)
 */
const reviewFormSchema = z.object({
  restaurantId: z.number(),
  userId: z.number(),
  rating: z.number().min(1, "Rating is required").max(5),
  content: z.string().min(10, "Review content must be at least 10 characters").max(500, "Review content must be less than 500 characters"),
});

/**
 * Type definition for form data based on the Zod schema
 */
type FormData = z.infer<typeof reviewFormSchema>;

/**
 * Props for the ReviewForm component
 * 
 * @property restaurantId - ID of the restaurant being reviewed
 * @property userId - ID of the user writing the review
 * @property onSuccess - Optional callback function to execute after successful submission
 * @property review - Optional existing review for edit mode
 */
interface ReviewFormProps {
  restaurantId: number;
  userId: number;
  onSuccess?: () => void;
  review?: Review;
}

/**
 * Review Form Component Implementation
 * 
 * @param props - Component props
 * @param props.restaurantId - ID of the restaurant being reviewed
 * @param props.userId - ID of the user writing the review
 * @param props.onSuccess - Optional callback for successful submission
 * @param props.review - Optional existing review (for edit mode)
 * @returns A review form component for creating or editing reviews
 */
export function ReviewForm({ restaurantId, userId, onSuccess, review }: ReviewFormProps) {
  // Hooks for toast notifications and React Query
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // State for tracking the star rating selection
  const [rating, setRating] = useState<number>(review?.rating || 0);

  // Initialize react-hook-form with Zod schema validation
  const form = useForm<FormData>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      restaurantId,
      userId,
      rating: review?.rating || 0,
      content: review?.content || "",
    },
  });

  /**
   * Mutation for creating or updating a review
   * Uses different API endpoints based on whether we're creating or editing
   */
  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      if (review) {
        // Update existing review
        return apiRequest(`/api/reviews/${review.id}`, "PATCH", data);
      } else {
        // Create new review
        return apiRequest("/api/reviews", "POST", data);
      }
    },
    onSuccess: () => {
      // Invalidate queries to refetch reviews data
      queryClient.invalidateQueries({ queryKey: ['/api/reviews'] });
      queryClient.invalidateQueries({ queryKey: ['/api/reviews', 'restaurant', restaurantId.toString()] });
      
      // Show success toast
      toast({
        title: review ? "Review updated" : "Review submitted",
        description: review ? "Your review has been updated successfully." : "Your review has been submitted successfully.",
      });
      
      // Execute success callback if provided
      if (onSuccess) onSuccess();
      
      // Reset form state
      form.reset();
      setRating(0);
    },
    onError: (error) => {
      // Show error toast
      toast({
        title: "Error",
        description: `Failed to ${review ? "update" : "submit"} review. Please try again.`,
        variant: "destructive",
      });
      console.error(error);
    },
  });

  /**
   * Form submission handler
   * @param data - Validated form data
   */
  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

  /**
   * Render the review form
   * Uses shadcn/ui components for a consistent design
   */
  return (
    <Card className="w-full max-w-2xl mx-auto">
      {/* Card header with dynamic title based on edit/create mode */}
      <CardHeader>
        <CardTitle>{review ? "Edit Review" : "Write a Review"}</CardTitle>
      </CardHeader>
      
      <CardContent>
        {/* React Hook Form integration with shadcn/ui Form components */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Star Rating Field */}
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating</FormLabel>
                  <FormControl>
                    <StarRating 
                      rating={rating} 
                      setRating={(value: number) => {
                        // Update both local state and form field value
                        setRating(value);
                        field.onChange(value);
                      }}
                      size={32}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Review Content Field */}
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Review</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Share your experience at this restaurant..."
                      {...field}
                      rows={5}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button with loading state */}
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-full"
            >
              {mutation.isPending 
                ? "Submitting..." 
                : review ? "Update Review" : "Submit Review"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}