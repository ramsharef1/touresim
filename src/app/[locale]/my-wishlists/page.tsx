'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Heart, ArrowRight } from 'lucide-react'

interface WishlistItem {
  destinationSlug: string
  destinationType: 'country' | 'city'
  addedAt: string
}

export default function MyWishlistsPage() {
  const [wishlists, setWishlists] = useState<WishlistItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'country' | 'city'>('all')

  useEffect(() => {
    // Load from localStorage
    const items: WishlistItem[] = []
    if (typeof window !== 'undefined') {
      for (const [key, value] of Object.entries(localStorage)) {
        if (key.startsWith('wishlist_')) {
          const [, type, slug] = key.split('_')
          items.push({
            destinationSlug: slug,
            destinationType: type as 'country' | 'city',
            addedAt: value as string,
          })
        }
      }
    }
    setWishlists(items.reverse()) // Newest first
    setIsLoading(false)
  }, [])

  const filteredWishlists =
    filter === 'all'
      ? wishlists
      : wishlists.filter((w) => w.destinationType === filter)

  const removeFromWishlist = (slug: string, type: 'country' | 'city') => {
    const key = `wishlist_${type}_${slug}`
    localStorage.removeItem(key)
    setWishlists((prev) => prev.filter((w) => w.destinationSlug !== slug))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
            <Heart className="text-red-500 fill-red-500" size={40} />
            My Wishlists
          </h1>
          <p className="text-gray-600 mt-2">
            {filteredWishlists.length} destination{filteredWishlists.length !== 1 ? 's' : ''} saved
          </p>
        </div>

        {wishlists.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center">
            <Heart className="mx-auto mb-4 text-gray-300" size={48} />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              No saved destinations yet
            </h2>
            <p className="text-gray-600 mb-6">
              Start adding destinations to your wishlists by clicking the heart icon on any country or city page.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Destinations
              <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <>
            {/* Filter */}
            <div className="mb-6 flex gap-2">
              {(['all', 'country', 'city'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filter === f
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {f === 'all' ? 'All' : f === 'country' ? 'Countries' : 'Cities'}
                  {f !== 'all' && (
                    <span className="ml-2">
                      ({wishlists.filter((w) => w.destinationType === f).length})
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWishlists.map((item) => (
                <div
                  key={`${item.destinationType}-${item.destinationSlug}`}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
                >
                  <div className="aspect-video bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center relative">
                    <div className="text-white text-center p-4">
                      <p className="text-sm text-blue-100 mb-1">
                        {item.destinationType === 'country' ? 'Country' : 'City'}
                      </p>
                      <p className="text-2xl font-bold capitalize">
                        {item.destinationSlug.replace(/-/g, ' ')}
                      </p>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-gray-500 mb-4">
                      Saved{' '}
                      {new Date(item.addedAt).toLocaleDateString()}
                    </p>
                    <div className="flex gap-2">
                      <Link
                        href={
                          item.destinationType === 'country'
                            ? `/${item.destinationSlug}`
                            : `/${item.destinationSlug.split('/')[0]}/${item.destinationSlug}`
                        }
                        className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors text-center"
                      >
                        View
                      </Link>
                      <button
                        onClick={() =>
                          removeFromWishlist(
                            item.destinationSlug,
                            item.destinationType,
                          )
                        }
                        className="px-3 py-2 bg-red-50 text-red-600 text-sm rounded hover:bg-red-100 transition-colors"
                        title="Remove from wishlist"
                      >
                        <Heart size={18} className="fill-current" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
