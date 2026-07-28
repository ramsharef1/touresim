import { RatingStars } from './RatingStars'

interface Review {
  id: number
  destinationSlug: string
  destinationType: 'country' | 'city'
  rating: number
  title: string
  body?: string | null
  authorName: string
  authorEmail: string
  isApproved: boolean
  createdAt: Date
}

interface ReviewListProps {
  destinationSlug: string
  destinationType: 'country' | 'city'
}

async function fetchReviews(slug: string, type: 'country' | 'city') {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/reviews?destination=${slug}&type=${type}`,
      { cache: 'revalidate', next: { revalidate: 3600 } }, // Cache for 1 hour
    )

    if (!response.ok) return { reviews: [], avgRating: null }

    const data = await response.json()
    return {
      reviews: data.data || [],
      avgRating: data.avgRating,
      count: data.count,
    }
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return { reviews: [], avgRating: null, count: 0 }
  }
}

export async function ReviewList({
  destinationSlug,
  destinationType,
}: ReviewListProps) {
  const { reviews, avgRating, count } = await fetchReviews(
    destinationSlug,
    destinationType,
  )

  if (count === 0) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg text-center">
        <p className="text-gray-600">
          No reviews yet. Be the first to share your experience!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      {avgRating !== null && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-2">
                Average Rating ({count} review{count !== 1 ? 's' : ''})
              </p>
              <RatingStars
                rating={avgRating}
                onRatingChange={() => {}}
                interactive={false}
                size="lg"
                showLabel
              />
            </div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="border border-gray-200 rounded-lg p-4"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold text-gray-900">
                  {review.title}
                </h4>
                <p className="text-sm text-gray-600">
                  by {review.authorName}
                </p>
              </div>
              <RatingStars
                rating={review.rating}
                onRatingChange={() => {}}
                interactive={false}
                size="sm"
                showLabel={false}
              />
            </div>

            {review.body && (
              <p className="text-gray-700 mb-3">{review.body}</p>
            )}

            <p className="text-xs text-gray-500">
              {new Date(review.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
