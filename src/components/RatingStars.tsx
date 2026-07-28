'use client'

import { Star } from 'lucide-react'
import { useState } from 'react'

interface RatingStarsProps {
  rating: number
  onRatingChange: (rating: number) => void
  interactive?: boolean
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

const sizeMap = {
  sm: 16,
  md: 20,
  lg: 24,
}

export function RatingStars({
  rating,
  onRatingChange,
  interactive = true,
  size = 'md',
  showLabel = true,
}: RatingStarsProps) {
  const [hoverRating, setHoverRating] = useState(0)
  const iconSize = sizeMap[size]

  const displayRating = hoverRating || rating

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => interactive && onRatingChange(star)}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            disabled={!interactive}
            className={`transition-colors ${
              interactive ? 'cursor-pointer hover:text-amber-400' : 'cursor-default'
            }`}
            title={`${star} star${star !== 1 ? 's' : ''}`}
          >
            <Star
              size={iconSize}
              className={displayRating >= star ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}
            />
          </button>
        ))}
      </div>
      {showLabel && rating > 0 && (
        <span className="text-sm font-medium text-gray-600">
          {rating.toFixed(1)} / 5
        </span>
      )}
    </div>
  )
}
