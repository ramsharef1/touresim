'use client'

import { useEffect, useState } from 'react'
import { Check, X, Star } from 'lucide-react'

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
  createdAt: string
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'pending' | 'approved' | 'all'>('pending')

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      const response = await fetch(
        '/api/reviews?includeUnapproved=true',
      )
      if (response.ok) {
        const data = await response.json()
        setReviews(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleApprove = async (id: number) => {
    // Note: In production, you'd call an API to approve the review
    // For now, this is a placeholder
    console.log('Approve review:', id)
    // After API call:
    // setReviews(prev => prev.map(r => r.id === id ? {...r, isApproved: true} : r))
  }

  const handleReject = async (id: number) => {
    // Note: In production, you'd call an API to delete the review
    console.log('Reject review:', id)
    // After API call:
    // setReviews(prev => prev.filter(r => r.id !== id))
  }

  const filteredReviews =
    filter === 'pending'
      ? reviews.filter((r) => !r.isApproved)
      : filter === 'approved'
        ? reviews.filter((r) => r.isApproved)
        : reviews

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-20 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reviews</h1>
        <p className="text-gray-600 mt-2">
          Manage and moderate destination reviews
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {(['pending', 'approved', 'all'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              filter === f
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            {f === 'pending' && `Pending (${reviews.filter((r) => !r.isApproved).length})`}
            {f === 'approved' && `Approved (${reviews.filter((r) => r.isApproved).length})`}
            {f === 'all' && `All (${reviews.length})`}
          </button>
        ))}
      </div>

      {/* Reviews List */}
      {filteredReviews.length === 0 ? (
        <div className="bg-gray-50 p-8 rounded-lg text-center">
          <p className="text-gray-600">No reviews to display</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <div
              key={review.id}
              className={`border rounded-lg p-6 ${
                review.isApproved
                  ? 'bg-green-50 border-green-200'
                  : 'bg-yellow-50 border-yellow-200'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="font-semibold text-gray-900">
                      {review.title}
                    </h3>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={
                            i < review.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-gray-300'
                          }
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    <strong>{review.authorName}</strong> on{' '}
                    {new Date(review.createdAt).toLocaleDateString()} • {review.destinationType}:{' '}
                    <span className="font-mono">{review.destinationSlug}</span>
                  </p>
                </div>
                {review.isApproved && (
                  <span className="px-3 py-1 bg-green-200 text-green-800 text-sm font-medium rounded">
                    ✓ Approved
                  </span>
                )}
              </div>

              {review.body && (
                <p className="text-gray-700 mb-4 italic">
                  "{review.body}"
                </p>
              )}

              <div className="flex gap-2 text-xs text-gray-600 mb-4">
                <span>Email: {review.authorEmail}</span>
              </div>

              {!review.isApproved && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApprove(review.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm font-medium"
                  >
                    <Check size={16} />
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(review.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm font-medium"
                  >
                    <X size={16} />
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
