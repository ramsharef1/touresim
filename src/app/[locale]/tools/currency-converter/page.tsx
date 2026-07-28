import { CurrencyConverter } from '@/components/CurrencyConverter'
import { getTranslations } from 'next-intl'

export const metadata = {
  title: 'Currency Converter',
  description: 'Real-time currency converter for travel. Convert between 100+ currencies.',
}

export default async function CurrencyConverterPage() {
  const t = getTranslations()

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-12">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h1 className="text-4xl font-bold mb-2">Currency Converter</h1>
          <p className="text-lg text-emerald-100">
            Real-time exchange rates for travelers
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-4 py-12">
        {/* Main Converter */}
        <div className="bg-white rounded-lg shadow-sm p-8 md:p-12 mb-12">
          <CurrencyConverter initialAmount={100} initialFrom="USD" initialTo="EUR" />
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-3xl mb-3">🌍</div>
            <h3 className="font-semibold text-gray-900 mb-2">Global Coverage</h3>
            <p className="text-sm text-gray-600">
              Convert between 100+ currencies from around the world
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="font-semibold text-gray-900 mb-2">Real-Time Rates</h3>
            <p className="text-sm text-gray-600">
              Exchange rates updated every 24 hours for accuracy
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="font-semibold text-gray-900 mb-2">Easy to Use</h3>
            <p className="text-sm text-gray-600">
              Simple interface with instant conversions
            </p>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                How often are exchange rates updated?
              </h3>
              <p className="text-gray-600 text-sm">
                Exchange rates are updated once daily. For the most current rates, check with your bank or payment provider.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Which currencies are supported?
              </h3>
              <p className="text-gray-600 text-sm">
                We support 100+ currencies including major ones like USD, EUR, GBP, JPY, and more. If you don't see a specific currency, it's likely not actively traded.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Are these rates accurate?
              </h3>
              <p className="text-gray-600 text-sm">
                Our rates are sourced from Open Exchange Rates and are updated daily. However, actual rates may vary slightly depending on your bank or payment method. Always check with your financial institution for exact rates.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Can I use this for my business?
              </h3>
              <p className="text-gray-600 text-sm">
                This converter is designed for personal travel use. For business transactions, please consult your bank or a dedicated currency exchange service.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Why doesn't my currency appear?
              </h3>
              <p className="text-gray-600 text-sm">
                We display the most commonly used currencies for travel. If your currency isn't listed, it may be a regional currency with limited exchange data available.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-lg p-8 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to travel?</h3>
          <p className="text-gray-600 mb-4">
            Plan your trip with our destination guides and travel tools
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="/deals"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Find Travel Deals
            </a>
            <a
              href="/compare"
              className="px-6 py-2 bg-white text-emerald-600 border-2 border-emerald-600 rounded-lg font-medium hover:bg-emerald-50 transition-colors"
            >
              Compare Destinations
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
