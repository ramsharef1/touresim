'use client'

import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import type { DestinationComparison } from '@/lib/comparison'

interface ComparisonGridProps {
  destinations: DestinationComparison[]
  onEdit?: () => void
}

const metricOrder = [
  'population',
  'area',
  'country',
  'timezone',
  'language',
  'currency',
  'climate',
  'bestTime',
  'gdp',
  'safetyRating',
  'visaFree',
  'elevation',
  'coordinates',
]

export function ComparisonGrid({ destinations, onEdit }: ComparisonGridProps) {
  if (destinations.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-12 text-center">
        <p className="text-gray-600">No destinations selected for comparison</p>
      </div>
    )
  }

  // Get unique metrics from all destinations
  const allMetrics = new Set<string>()
  destinations.forEach((d) => {
    Object.keys(d.metrics).forEach((m) => allMetrics.add(m))
  })

  const sortedMetrics = Array.from(allMetrics).sort((a, b) => {
    const aIndex = metricOrder.indexOf(a)
    const bIndex = metricOrder.indexOf(b)
    return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex)
  })

  return (
    <div className="space-y-6">
      {/* Header Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {destinations.map((dest) => (
          <div key={dest.slug} className="bg-white rounded-lg shadow-sm overflow-hidden">
            {dest.image && (
              <div className="relative aspect-video bg-gray-200">
                <Image
                  src={dest.image}
                  alt={dest.name}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </div>
            )}
            <div className="p-4">
              <h2 className="text-2xl font-bold text-gray-900">{dest.name}</h2>
              <p className="text-sm text-gray-600 capitalize mt-1">{dest.type}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Comparison Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 w-32">
                  Metric
                </th>
                {destinations.map((dest) => (
                  <th key={dest.slug} className="px-6 py-3 text-left text-sm font-semibold text-gray-900 min-w-40">
                    {dest.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedMetrics.map((metric, idx) => (
                <tr
                  key={metric}
                  className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {destinations[0]?.metrics[metric]?.label || metric}
                  </td>
                  {destinations.map((dest) => {
                    const m = dest.metrics[metric]
                    return (
                      <td key={`${dest.slug}-${metric}`} className="px-6 py-4 text-sm text-gray-600">
                        {m ? (
                          <div className="flex items-center gap-2">
                            {m.color && (
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  m.color === 'green'
                                    ? 'bg-green-500'
                                    : m.color === 'yellow'
                                      ? 'bg-yellow-500'
                                      : m.color === 'red'
                                        ? 'bg-red-500'
                                        : 'bg-gray-400'
                                }`}
                              />
                            )}
                            <span className="font-medium text-gray-900">{m.value}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Button */}
      {onEdit && (
        <div className="text-center">
          <button
            onClick={onEdit}
            className="inline-flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <ArrowRight size={16} />
            Compare Different Destinations
          </button>
        </div>
      )}
    </div>
  )
}
