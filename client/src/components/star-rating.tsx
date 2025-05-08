/**
 * StarRating Component
 * 
 * A reusable interactive star rating component that allows users to input and display ratings.
 * The component can operate in both interactive and read-only modes.
 */

import React, { useState } from "react";
import { Star } from "lucide-react";

/**
 * Props for the StarRating component
 * 
 * @property rating - The current rating value (1-5)
 * @property setRating - Callback function to update the rating
 * @property size - Optional size of the star icons in pixels (default: 24)
 * @property readonly - Optional flag to make the component read-only (default: false)
 */
interface StarRatingProps {
  rating: number;
  setRating: (rating: number) => void;
  size?: number;
  readonly?: boolean;
}

/**
 * StarRating component implementation
 * 
 * Renders a row of 5 interactive star icons that can be clicked to set a rating.
 * Features hover effects and toggleable read-only mode.
 * 
 * @param props - The component props
 * @param props.rating - Current rating value (1-5)
 * @param props.setRating - Function to call when rating changes
 * @param props.size - Size of star icons in pixels (default: 24)
 * @param props.readonly - Whether the stars are clickable (default: false)
 * @returns A React component rendering interactive star icons
 */
export function StarRating({ rating, setRating, size = 24, readonly = false }: StarRatingProps) {
  // Track which star the user is currently hovering over
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex">
      {/* Render 5 stars for ratings 1-5 */}
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={`cursor-${readonly ? 'default' : 'pointer'} mr-1 transition-all duration-150 ${
            // Fill the star if it's less than or equal to current rating or hover rating
            star <= (hoverRating || rating)
              ? "fill-yellow-400 text-yellow-400" // Filled star
              : "text-gray-300" // Empty star
          }`}
          // Toggle rating off if clicking the current rating, otherwise set to clicked star
          onClick={() => !readonly && setRating(star === rating ? 0 : star)}
          // Set hover rating when mouse enters a star (only in interactive mode)
          onMouseEnter={() => !readonly && setHoverRating(star)}
          // Reset hover rating when mouse leaves (only in interactive mode)
          onMouseLeave={() => !readonly && setHoverRating(0)}
        />
      ))}
    </div>
  );
}