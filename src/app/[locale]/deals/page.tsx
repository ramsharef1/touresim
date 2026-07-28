import { db } from '@/db'
import { deals } from '@/db/schema'
import { gte, desc, eq } from 'drizzle-orm'
import { DealCard } from '@/components/DealCard'

export const revalidate = 3600 // Revalidate every hour

export const metadata = {
  title: 'Travel Deals',
  description: 'Best travel deals from top partners including flights, hotels, tours, and activities',
}

const DEAL_TYPES = [
  { id: 'flight', label: 'Flights' },
  { id: 'hotel', label: 'Hotels' },
  { id: 'tour', label: 'Tours' },
  { id: 'activity', label: 'Activities' },
  { id: 'experience', label: 'Experiences' },
] as const

export default async function DealsPage({
  searchParams,
}: {
  searchParams: { type?: string; destination?: string }
}) {
  try {
    // Fetch active deals (not expired)
    const now = new Date()
    let query = db
      .select()
      .from(deals)
      .where(gte(deals.expiresAt, now))

    // Filter by type
    if (searchParams.type) {
      query = query.where(eq(deals.type, searchParams.type as any))
    }

    // Filter by destination
    if (searchParams.destination) {
      query = query.where(eq(deals.destinationSlug, searchParams.destination))
    }

    // Sort by discount (highest first), then by newest
    const allDeals = await query.orderBy(desc(deals.discount), desc(deals.createdAt)).limit(100)

    const dealCount = allDeals.length
    const avgDiscount = dealCount > 0 ? Math.round(allDeals.reduce((sum, d) => sum + (d.discount || 0), 0) / dealCount) : 0

    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        {/* Hero */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-12">
          <div className="mx-auto max-w-6xl px-4">
            <h1 className="text-4xl font-bold mb-2">Travel Deals</h1>
            <p className="text-lg text-blue-100">
              Save up to {avgDiscount}% on flights, hotels, tours, and activities
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-6xl px-4 py-12">
          {/* Filter Tabs */}
          <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
            <a
              href="/deals"
              className={`whitespace-nowrap px-4 py-2.5 rounded-full font-medium transition-all ${
                !searchParams.type
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              All Deals {dealCount > 0 && `(${dealCount})`}
            </a>

            {DEAL_TYPES.map((type) => {
              const filteredCount = allDeals.filter((d) => d.type === type.id).length
              return (
                <a
                  key={type.id}
                  href={`/deals?type=${type.id}`}
                  className={`whitespace-nowrap px-4 py-2.5 rounded-full font-medium transition-all ${
                    searchParams.type === type.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {type.label} {filteredCount > 0 && `(${filteredCount})`}
                </a>
              )
            })}
          </div>

          {/* Deals Grid */}
          {dealCount === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <p className="text-lg text-gray-600 mb-4">No deals available right now</p>
              <p className="text-sm text-gray-500">Check back soon for amazing travel offers!</p>
            </div>
          ) : (
            <>
              <div className="mb-4 text-sm text-gray-600">
                Showing {dealCount} active deal{dealCount !== 1 ? 's' : ''}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allDeals.map((deal) => (
                  <DealCard key={deal.id} {...deal} />
                ))}
              </div>
            </>
          )}

          {/* Info Section */}
          <div className="mt-16 bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Find Deals</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Curated Partners</h3>
                <p className="text-gray-600 text-sm">
                  We partner with leading travel companies like Booking.com, GetYourGuide, and Skyscanner to bring you the best deals.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Real-Time Updates</h3>
                <p className="text-gray-600 text-sm">
                  Our deals are updated multiple times daily, so you never miss out on limited-time offers.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Verified Savings</h3>
                <p className="text-gray-600 text-sm">
                  All prices are verified and up-to-date. We show you real savings compared to regular prices.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  } catch (error) {
    console.error('[/deals] Error:', error)
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12">
        <div className="mx-auto max-w-6xl px-4">
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-lg text-red-600 mb-2">Something went wrong</p>
            <p className="text-sm text-gray-600">We couldn't load the deals. Please try again later.</p>
          </div>
        </div>
      </main>
    )
  }
}
