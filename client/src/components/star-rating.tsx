import React, { useState } from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  setRating: (rating: number) => void;
  size?: number;
  readonly?: boolean;
}

export function StarRating({ rating, setRating, size = 24, readonly = false }: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={`cursor-${readonly ? 'default' : 'pointer'} mr-1 transition-all duration-150 ${
            star <= (hoverRating || rating)
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-300"
          }`}
          onClick={() => !readonly && setRating(star === rating ? 0 : star)}
          onMouseEnter={() => !readonly && setHoverRating(star)}
          onMouseLeave={() => !readonly && setHoverRating(0)}
        />
      ))}
    </div>
  );
}