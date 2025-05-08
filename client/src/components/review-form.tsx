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
import { StarRating } from "@/components/star-rating";

// Define review form schema
const reviewFormSchema = z.object({
  restaurantId: z.number(),
  userId: z.number(),
  rating: z.number().min(1, "Rating is required").max(5),
  content: z.string().min(10, "Review content must be at least 10 characters").max(500, "Review content must be less than 500 characters"),
});

type FormData = z.infer<typeof reviewFormSchema>;

interface ReviewFormProps {
  restaurantId: number;
  userId: number;
  onSuccess?: () => void;
  review?: Review;
}

export function ReviewForm({ restaurantId, userId, onSuccess, review }: ReviewFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [rating, setRating] = useState<number>(review?.rating || 0);

  const form = useForm<FormData>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      restaurantId,
      userId,
      rating: review?.rating || 0,
      content: review?.content || "",
    },
  });

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
      queryClient.invalidateQueries({ queryKey: ['/api/reviews'] });
      queryClient.invalidateQueries({ queryKey: ['/api/reviews', 'restaurant', restaurantId.toString()] });
      toast({
        title: review ? "Review updated" : "Review submitted",
        description: review ? "Your review has been updated successfully." : "Your review has been submitted successfully.",
      });
      if (onSuccess) onSuccess();
      form.reset();
      setRating(0);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to ${review ? "update" : "submit"} review. Please try again.`,
        variant: "destructive",
      });
      console.error(error);
    },
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{review ? "Edit Review" : "Write a Review"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating</FormLabel>
                  <FormControl>
                    <StarRating 
                      rating={rating} 
                      setRating={(value) => {
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

            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-full"
            >
              {mutation.isPending ? "Submitting..." : review ? "Update Review" : "Submit Review"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}