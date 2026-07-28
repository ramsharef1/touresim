'use client'

import { useState, useCallback, useMemo } from 'react'
import { Search, X } from 'lucide-react'
import Link from 'next/link'

interface Destination {
  slug: string
  name: string
  type: 'country' | 'city'
}

interface ComparisonSearchProps {
  destinations: Destination[]
  onCompare?: (slugs: string[]) => void
  maxSelect?: number
}

export function ComparisonSearch({
  destinations,
  onCompare,
  maxSelect = 3,
}: ComparisonSearchProps) {
  const [selected, setSelected] = useState<string[]>([])
  const [search, setSearch] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const filtered = useMemo(() => {
    return destinations.filter((d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) && !selected.includes(d.slug)
    )
  }, [search, selected, destinations])

  const handleSelect = useCallback(
    (slug: string) => {
      if (selected.length < maxSelect) {
        setSelected([...selected, slug])
        setSearch('')
      }
    },
    [selected, maxSelect]
  )

  const handleRemove = useCallback((slug: string) => {
    setSelected((prev) => prev.filter((s) => s !== slug))
  }, [])

  const handleCompare = useCallback(() => {
    if (selected.length >= 2) {
      const url = `/compare/${selected.join('-')}`
      window.location.href = url
    }
  }, [selected])

  const selectedDests = destinations.filter((d) => selected.includes(d.slug))

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute left-3 top-3 text-gray-400">
          <Search size={20} />
        </div>
        <input
          type="text"
          placeholder="Search countries or cities..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Dropdown */}
      {isOpen && search && filtered.length > 0 && (
        <div className="absolute mt-2 w-full max-w-2xl bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-96 overflow-y-auto">
          {filtered.slice(0, 10).map((dest) => (
            <button
              key={dest.slug}
              onClick={() => handleSelect(dest.slug)}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 flex justify-between items-center"
            >
              <div>
                <p className="font-medium text-gray-900">{dest.name}</p>
                <p className="text-xs text-gray-500 capitalize">{dest.type}</p>
              </div>
              {selected.length < maxSelect && (
                <span className="text-blue-600 text-sm font-medium">+ Add</span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Selected Destinations */}
      {selected.length > 0 && (
        <div className="mt-4">
          <div className="flex flex-wrap gap-2">
            {selectedDests.map((dest) => (
              <div
                key={dest.slug}
                className="inline-flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-full"
              >
                <span className="font-medium">{dest.name}</span>
                <button
                  onClick={() => handleRemove(dest.slug)}
                  className="hover:text-blue-900"
                  aria-label="Remove"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Compare Button */}
          {selected.length >= 2 && (
            <button
              onClick={handleCompare}
              className="mt-4 w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Compare {selected.length} Destination{selected.length !== 1 ? 's' : ''}
            </button>
          )}

          {selected.length === 1 && (
            <p className="mt-4 text-sm text-gray-600">
              Select at least 2 destinations to compare
            </p>
          )}

          {selected.length === maxSelect && (
            <p className="mt-4 text-sm text-gray-600">
              Maximum {maxSelect} destinations selected
            </p>
          )}
        </div>
      )}

      {/* Empty State */}
      {!isOpen && selected.length === 0 && (
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">
            Start by searching for a destination above
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            {destinations
              .slice(0, 6)
              .map((dest) => (
                <button
                  key={dest.slug}
                  onClick={() => handleSelect(dest.slug)}
                  className="p-3 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors text-sm font-medium text-gray-900"
                >
                  {dest.name}
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
