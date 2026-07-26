import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@/lib/locales'

const ACCOMMODATION_TYPES = [
  { id: 'hotels', icon: '🏨', rating: '4.8' },
  { id: 'hostels', icon: '🏩', rating: '4.5' },
  { id: 'airbnb', icon: '🏠', rating: '4.6' },
  { id: 'resorts', icon: '🏖️', rating: '4.9' },
  { id: 'guesthouses', icon: '🏡', rating: '4.4' },
  { id: 'camping', icon: '⛺', rating: '4.2' },
]

export default async function AccommodationGuidePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('accommodationGuide')

  return (
    <main className="flex flex-1 flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-amber-600 to-amber-800 px-6 py-24 text-center sm:py-32">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-4xl font-bold text-white sm:text-5xl">
            {t('title')}
          </h1>
          <p className="mt-4 text-lg text-amber-100">
            {t('subtitle')}
          </p>
        </div>
      </section>

      {/* Accommodation Types */}
      <section className="px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-12">{t('types.title')}</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ACCOMMODATION_TYPES.map((type) => (
              <div
                key={type.id}
                className="rounded-lg border border-gray-200 bg-white p-8 text-center hover:shadow-lg transition"
              >
                <div className="text-6xl mb-4">{type.icon}</div>
                <h3 className="text-xl font-bold text-gray-900">
                  {t(`types.${type.id}.name`)}
                </h3>
                <p className="mt-3 text-gray-600 text-sm">
                  {t(`types.${type.id}.description`)}
                </p>
                <div className="mt-4 flex items-center justify-center gap-2">
                  <span className="text-2xl">⭐</span>
                  <span className="font-bold text-gray-900">{type.rating}/5</span>
                </div>
                <button className="mt-6 inline-block text-amber-600 font-semibold hover:text-amber-700">
                  {t('learnMore')} →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="bg-gray-50 px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">{t('comparison.title')}</h2>
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-gray-900">Type</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-900">{t('comparison.price')}</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-900">{t('comparison.comfort')}</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-900">{t('comparison.social')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {ACCOMMODATION_TYPES.map((type) => (
                  <tr key={type.id}>
                    <td className="px-6 py-4 font-medium text-gray-900">{type.icon} {t(`types.${type.id}.name`)}</td>
                    <td className="px-6 py-4 text-gray-600">{t(`comparison.${type.id}.price`)}</td>
                    <td className="px-6 py-4 text-gray-600">{t(`comparison.${type.id}.comfort`)}</td>
                    <td className="px-6 py-4 text-gray-600">{t(`comparison.${type.id}.social`)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Booking Tips */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">{t('tips.title')}</h2>
          <div className="space-y-6">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-amber-100">
                  <span className="text-lg">{[1, 2, 3, 4, 5][i]}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {t(`tips.tip${i + 1}.title`)}
                  </h3>
                  <p className="mt-1 text-gray-600">
                    {t(`tips.tip${i + 1}.description`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-amber-50 px-6 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-gray-900">{t('cta.title')}</h2>
          <p className="mt-4 text-gray-600">{t('cta.subtitle')}</p>
          <button className="mt-8 inline-block rounded-lg bg-amber-600 px-8 py-3 font-semibold text-white hover:bg-amber-700">
            {t('cta.button')}
          </button>
        </div>
      </section>
    </main>
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'accommodationGuide' })
  return {
    title: t('meta.title'),
    description: t('meta.description'),
  }
}
