'use client'

import { Heart } from 'lucide-react'
import { useState, useEffect } from 'react'

interface WishlistButtonProps {
  destinationSlug: string
  destinationType: 'country' | 'city'
  className?: string
}

export function WishlistButton({ destinationSlug, destinationType, className = '' }: WishlistButtonProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Check if already wishlisted on mount
  useEffect(() => {
    const key = `wishlist_${destinationType}_${destinationSlug}`
    const wishlisted = localStorage.getItem(key) === 'true'
    setIsWishlisted(wishlisted)
  }, [destinationSlug, destinationType])

  const handleToggle = async () => {
    setIsLoading(true)
    try {
      const key = `wishlist_${destinationType}_${destinationSlug}`

      if (isWishlisted) {
        // Remove from wishlist
        localStorage.removeItem(key)
        setIsWishlisted(false)
      } else {
        // Add to wishlist
        localStorage.setItem(key, 'true')
        setIsWishlisted(true)

        // Also send to backend for persistence (when user auth added)
        try {
          await fetch('/api/wishlists', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ destinationSlug, destinationType }),
          })
        } catch (error) {
          console.error('Failed to sync wishlist:', error)
          // Continue anyway - local storage is working
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
        isWishlisted
          ? 'bg-red-50 text-red-600 hover:bg-red-100'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      } disabled:opacity-50 ${className}`}
      title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart
        size={20}
        className={isWishlisted ? 'fill-current' : ''}
      />
      <span className="text-sm font-medium">
        {isWishlisted ? 'Saved' : 'Save'}
      </span>
    </button>
  )
}
