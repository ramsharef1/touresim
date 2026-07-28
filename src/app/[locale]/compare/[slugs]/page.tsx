import { compareDestinations } from '@/lib/comparison'
import { ComparisonGrid } from '@/components/ComparisonGrid'
import { ShareButtons } from '@/components/ShareButtons'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const revalidate = 3600 // Revalidate every hour

export async function generateMetadata({
  params,
}: {
  params: { slugs: string; locale: string }
}) {
  const slugArray = params.slugs.split('-').filter(Boolean)
  const names = slugArray.join(', ')
  return {
    title: `Compare ${names}`,
    description: `Side-by-side comparison of ${names}`,
  }
}

export default async function ComparisonPage({
  params,
}: {
  params: { slugs: string; locale: string }
}) {
  const slugArray = params.slugs.split('-').filter(Boolean)

  if (slugArray.length < 2 || slugArray.length > 3) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12">
        <div className="mx-auto max-w-6xl px-4">
          <Link href="/compare" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8">
            <ArrowLeft size={16} />
            Back to comparison
          </Link>

          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-lg text-red-600 mb-2">Invalid comparison</p>
            <p className="text-gray-600">Please select 2 or 3 destinations to compare</p>
          </div>
        </div>
      </main>
    )
  }

  try {
    const destinations = await compareDestinations(slugArray)

    if (destinations.length === 0) {
      return (
        <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12">
          <div className="mx-auto max-w-6xl px-4">
            <Link href="/compare" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8">
              <ArrowLeft size={16} />
              Back to comparison
            </Link>

            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <p className="text-lg text-gray-600">Destinations not found</p>
            </div>
          </div>
        </main>
      )
    }

    const title = destinations.map((d) => d.name).join(' vs ')

    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        {/* Hero */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-12">
          <div className="mx-auto max-w-6xl px-4">
            <Link href="/compare" className="inline-flex items-center gap-2 text-purple-100 hover:text-white mb-4">
              <ArrowLeft size={16} />
              Back to comparison
            </Link>

            <h1 className="text-4xl font-bold mb-2">{title}</h1>
            <p className="text-lg text-purple-100">
              Comparing {destinations.length} destination{destinations.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-6xl px-4 py-12">
          {/* Share */}
          <div className="mb-8 flex justify-center">
            <ShareButtons title={`Compare ${title}`} description="Check out this destination comparison" />
          </div>

          {/* Comparison Grid */}
          <ComparisonGrid
            destinations={destinations}
            onEdit={() => {
              // Redirect to compare page
              window.location.href = '/compare'
            }}
          />

          {/* Affiliate Links */}
          <div className="mt-12 bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Ready to book?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a
                href={`https://www.booking.com/searchresults.html?ss=${destinations[0]?.name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 border-2 border-blue-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-colors text-center"
              >
                <div className="font-bold text-gray-900 mb-1">Hotels</div>
                <p className="text-sm text-gray-600">Book via Booking.com</p>
              </a>

              <a
                href={`https://www.getyourguide.com/search?q=${destinations[0]?.name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 border-2 border-green-200 rounded-lg hover:border-green-600 hover:bg-green-50 transition-colors text-center"
              >
                <div className="font-bold text-gray-900 mb-1">Tours & Activities</div>
                <p className="text-sm text-gray-600">Book via GetYourGuide</p>
              </a>

              <a
                href={`https://www.skyscanner.com/transport/flights/${destinations[0]?.name}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 border-2 border-orange-200 rounded-lg hover:border-orange-600 hover:bg-orange-50 transition-colors text-center"
              >
                <div className="font-bold text-gray-900 mb-1">Flights</div>
                <p className="text-sm text-gray-600">Search via Skyscanner</p>
              </a>
            </div>
          </div>
        </div>
      </main>
    )
  } catch (error) {
    console.error('[Comparison] Error:', error)
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12">
        <div className="mx-auto max-w-6xl px-4">
          <Link href="/compare" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8">
            <ArrowLeft size={16} />
            Back to comparison
          </Link>

          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-lg text-red-600 mb-2">Something went wrong</p>
            <p className="text-gray-600">We couldn't load the comparison. Please try again.</p>
          </div>
        </div>
      </main>
    )
  }
}
