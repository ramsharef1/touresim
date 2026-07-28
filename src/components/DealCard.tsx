'use client'

import { Clock, TrendingDown } from 'lucide-react'
import Image from 'next/image'
import { useCallback } from 'react'

interface DealCardProps {
  id: number
  title: string
  type: 'flight' | 'hotel' | 'tour' | 'activity' | 'experience'
  originalPrice?: string | null
  dealPrice: string
  discount?: number | null
  imageUrl?: string | null
  affiliateUrl: string
  expiresAt: Date | string
  partner: string
  description?: string | null
}

export function DealCard({
  id,
  title,
  type,
  originalPrice,
  dealPrice,
  discount,
  imageUrl,
  affiliateUrl,
  expiresAt,
  partner,
  description,
}: DealCardProps) {
  const price = parseFloat(typeof dealPrice === 'string' ? dealPrice : dealPrice.toString())
  const origPrice = originalPrice ? parseFloat(typeof originalPrice === 'string' ? originalPrice : originalPrice.toString()) : null

  const expirationDate = typeof expiresAt === 'string' ? new Date(expiresAt) : expiresAt
  const hoursLeft = Math.max(0, Math.floor((expirationDate.getTime() - new Date().getTime()) / (1000 * 60 * 60)))
  const daysLeft = Math.floor(hoursLeft / 24)

  const handleClick = useCallback(async () => {
    try {
      await fetch('/api/deals', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dealId: id }),
      })
    } catch (err) {
      console.error('Failed to log deal click:', err)
    }
  }, [id])

  const typeColors: Record<string, string> = {
    flight: 'bg-blue-100 text-blue-700',
    hotel: 'bg-purple-100 text-purple-700',
    tour: 'bg-green-100 text-green-700',
    activity: 'bg-orange-100 text-orange-700',
    experience: 'bg-pink-100 text-pink-700',
  }

  const urgencyColor = daysLeft === 0 ? 'text-red-600' : daysLeft === 1 ? 'text-orange-600' : 'text-gray-600'

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden h-full flex flex-col">
      {/* Image */}
      {imageUrl ? (
        <div className="aspect-video bg-gray-200 overflow-hidden relative">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        </div>
      ) : (
        <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
          <TrendingDown size={40} className="text-gray-400" />
        </div>
      )}

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Badges */}
        <div className="flex justify-between items-start gap-2 mb-3">
          <span className={`inline-block px-2.5 py-1 ${typeColors[type] || typeColors.tour} text-xs rounded-full font-medium capitalize`}>
            {type}
          </span>
          {discount && discount > 0 && (
            <span className="inline-block px-2.5 py-1 bg-red-100 text-red-700 text-xs rounded-full font-bold">
              -{discount}%
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm">
          {title}
        </h3>

        {/* Description */}
        {description && (
          <p className="text-xs text-gray-600 mb-3 line-clamp-2">
            {description}
          </p>
        )}

        {/* Price */}
        <div className="mb-3">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900">
              ${price.toFixed(0)}
            </span>
            {origPrice && origPrice > price && (
              <span className="text-sm line-through text-gray-500">
                ${origPrice.toFixed(0)}
              </span>
            )}
          </div>
        </div>

        {/* Expiration */}
        <div className={`flex items-center gap-1 text-xs mb-4 font-medium ${urgencyColor}`}>
          <Clock size={14} />
          {hoursLeft === 0 ? (
            <span>Expired</span>
          ) : daysLeft > 0 ? (
            <span>{daysLeft}d {hoursLeft % 24}h left</span>
          ) : (
            <span>{hoursLeft}h left</span>
          )}
        </div>

        {/* CTA */}
        <a
          href={affiliateUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
          className="w-full block text-center px-4 py-2.5 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 transition-colors text-sm"
        >
          View Deal
        </a>

        {/* Partner */}
        <p className="text-xs text-gray-500 mt-2 text-center capitalize">
          via {partner.replace('.com', '')}
        </p>
      </div>
    </div>
  )
}
