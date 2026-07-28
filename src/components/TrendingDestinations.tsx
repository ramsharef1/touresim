import Link from 'next/link'
import { getCountryBySlug, getCityBySlug } from '@/lib/queries'

// Hardcoded trending destinations by month (MVP)
// Replace with analytics data in Phase 3
const TRENDING_BY_MONTH: Record<number, Array<{ slug: string; type: 'country' | 'city' }>> = {
  1: [
    { slug: 'japan', type: 'country' },
    { slug: 'switzerland', type: 'country' },
    { slug: 'new-zealand', type: 'country' },
    { slug: 'thailand', type: 'country' },
    { slug: 'argentina', type: 'country' },
  ],
  2: [
    { slug: 'thailand', type: 'country' },
    { slug: 'morocco', type: 'country' },
    { slug: 'spain', type: 'country' },
    { slug: 'france', type: 'country' },
    { slug: 'mexico', type: 'country' },
  ],
  3: [
    { slug: 'turkey', type: 'country' },
    { slug: 'peru', type: 'country' },
    { slug: 'iceland', type: 'country' },
    { slug: 'israel', type: 'country' },
    { slug: 'greece', type: 'country' },
  ],
  4: [
    { slug: 'spain', type: 'country' },
    { slug: 'italy', type: 'country' },
    { slug: 'portugal', type: 'country' },
    { slug: 'france', type: 'country' },
    { slug: 'uk', type: 'country' },
  ],
  5: [
    { slug: 'norway', type: 'country' },
    { slug: 'sweden', type: 'country' },
    { slug: 'iceland', type: 'country' },
    { slug: 'scotland', type: 'country' },
    { slug: 'canada', type: 'country' },
  ],
  6: [
    { slug: 'canada', type: 'country' },
    { slug: 'usa', type: 'country' },
    { slug: 'norway', type: 'country' },
    { slug: 'scotland', type: 'country' },
    { slug: 'finland', type: 'country' },
  ],
  7: [
    { slug: 'usa', type: 'country' },
    { slug: 'canada', type: 'country' },
    { slug: 'france', type: 'country' },
    { slug: 'switzerland', type: 'country' },
    { slug: 'italy', type: 'country' },
  ],
  8: [
    { slug: 'france', type: 'country' },
    { slug: 'italy', type: 'country' },
    { slug: 'spain', type: 'country' },
    { slug: 'greece', type: 'country' },
    { slug: 'croatia', type: 'country' },
  ],
  9: [
    { slug: 'india', type: 'country' },
    { slug: 'nepal', type: 'country' },
    { slug: 'thailand', type: 'country' },
    { slug: 'vietnam', type: 'country' },
    { slug: 'south-korea', type: 'country' },
  ],
  10: [
    { slug: 'egypt', type: 'country' },
    { slug: 'morocco', type: 'country' },
    { slug: 'jordan', type: 'country' },
    { slug: 'turkey', type: 'country' },
    { slug: 'india', type: 'country' },
  ],
  11: [
    { slug: 'vietnam', type: 'country' },
    { slug: 'thailand', type: 'country' },
    { slug: 'south-korea', type: 'country' },
    { slug: 'japan', type: 'country' },
    { slug: 'china', type: 'country' },
  ],
  12: [
    { slug: 'australia', type: 'country' },
    { slug: 'new-zealand', type: 'country' },
    { slug: 'philippines', type: 'country' },
    { slug: 'indonesia', type: 'country' },
    { slug: 'thailand', type: 'country' },
  ],
}

async function TrendingDestination({
  slug,
  type,
}: {
  slug: string
  type: 'country' | 'city'
}) {
  let destination
  let href

  if (type === 'country') {
    destination = await getCountryBySlug(slug, 'en')
    href = `/${slug}`
  } else {
    const [countrySlug] = slug.split('/')
    destination = await getCityBySlug(countrySlug, slug, 'en')
    href = `/${countrySlug}/${slug}`
  }

  if (!destination) return null

  return (
    <Link
      href={href}
      className="flex-shrink-0 w-64 bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
    >
      <div className="aspect-video bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
        <div className="text-white text-center p-4">
          <p className="text-sm text-blue-100">
            {type === 'country' ? 'Country' : 'City'}
          </p>
          <p className="text-2xl font-bold">
            {destination.name}
          </p>
        </div>
      </div>
      <div className="p-4">
        <p className="text-sm text-gray-600 line-clamp-2">
          {destination.shortDescription || 'Discover this amazing destination'}
        </p>
      </div>
    </Link>
  )
}

export async function TrendingDestinations() {
  const currentMonth = new Date().getMonth() + 1 // 1-12
  const trendingList = TRENDING_BY_MONTH[currentMonth] || TRENDING_BY_MONTH[1]

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Trending This Month
          </h2>
          <p className="text-gray-600">
            Discover the most popular destinations right now
          </p>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4">
          {trendingList.map((item) => (
            <TrendingDestination
              key={`${item.type}-${item.slug}`}
              slug={item.slug}
              type={item.type}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
