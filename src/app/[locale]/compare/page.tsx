import { db } from '@/db'
import { countries, cities } from '@/db/schema'
import { ComparisonSearch } from '@/components/ComparisonSearch'
import { getTranslations } from 'next-intl'

export const metadata = {
  title: 'Compare Destinations',
  description: 'Compare countries and cities side by side to find your perfect travel destination',
}

export default async function ComparePage() {
  const t = getTranslations()

  // Fetch all countries and cities for search
  const [allCountries, allCities] = await Promise.all([
    db.select({ slug: countries.slug, name: countries.name }).from(countries),
    db.select({ slug: cities.slug, name: cities.name }).from(cities),
  ])

  const destinations = [
    ...allCountries.map((c) => ({ ...c, type: 'country' as const })),
    ...allCities.map((c) => ({ ...c, type: 'city' as const })),
  ].sort((a, b) => a.name.localeCompare(b.name))

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-12">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h1 className="text-4xl font-bold mb-2">Compare Destinations</h1>
          <p className="text-lg text-purple-100">
            Side-by-side comparison of countries and cities
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
            Choose destinations to compare
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Select 2 or 3 destinations to see how they compare on key metrics
          </p>

          <ComparisonSearch destinations={destinations} maxSelect={3} />
        </div>

        {/* Info Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-3xl font-bold text-purple-600 mb-2">🌍</div>
            <h3 className="font-semibold text-gray-900 mb-2">Population & Size</h3>
            <p className="text-sm text-gray-600">
              Compare population, area, and overall statistics
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-3xl font-bold text-purple-600 mb-2">🛂</div>
            <h3 className="font-semibold text-gray-900 mb-2">Visa Requirements</h3>
            <p className="text-sm text-gray-600">
              Check visa-free access and entry requirements
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-3xl font-bold text-purple-600 mb-2">💰</div>
            <h3 className="font-semibold text-gray-900 mb-2">Cost of Living</h3>
            <p className="text-sm text-gray-600">
              Compare GDP per capita, currency, and economic factors
            </p>
          </div>
        </div>

        {/* Popular Comparisons */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Popular Comparisons
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="/compare/france-italy-spain"
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold text-gray-900">Europe: France vs Italy vs Spain</h3>
              <p className="text-sm text-gray-600 mt-2">
                Classic European destinations compared
              </p>
            </a>

            <a
              href="/compare/japan-thailand-vietnam"
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold text-gray-900">Asia: Japan vs Thailand vs Vietnam</h3>
              <p className="text-sm text-gray-600 mt-2">
                Discover differences in Asian travel destinations
              </p>
            </a>

            <a
              href="/compare/united-states-canada-mexico"
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold text-gray-900">Americas: USA vs Canada vs Mexico</h3>
              <p className="text-sm text-gray-600 mt-2">
                North American travel options compared
              </p>
            </a>

            <a
              href="/compare/egypt-morocco-south-africa"
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold text-gray-900">Africa: Egypt vs Morocco vs South Africa</h3>
              <p className="text-sm text-gray-600 mt-2">
                African destination comparison
              </p>
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
