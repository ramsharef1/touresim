import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@/lib/locales'

const CUISINES = [
  { id: 'asian', icon: '🍜', regions: 10 },
  { id: 'european', icon: '🍝', regions: 8 },
  { id: 'middle-eastern', icon: '🍢', regions: 6 },
  { id: 'african', icon: '🍲', regions: 7 },
  { id: 'american', icon: '🍔', regions: 5 },
  { id: 'oceanian', icon: '🦐', regions: 4 },
]

export default async function FoodGuidePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('foodGuide')

  return (
    <main className="flex flex-1 flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-600 to-orange-800 px-6 py-24 text-center sm:py-32">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-4xl font-bold text-white sm:text-5xl">
            {t('title')}
          </h1>
          <p className="mt-4 text-lg text-orange-100">
            {t('subtitle')}
          </p>
        </div>
      </section>

      {/* Cuisines */}
      <section className="px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-12">{t('cuisines.title')}</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CUISINES.map((cuisine) => (
              <div
                key={cuisine.id}
                className="rounded-lg bg-white p-8 text-center border border-gray-200 hover:shadow-lg transition"
              >
                <div className="text-6xl mb-4">{cuisine.icon}</div>
                <h3 className="text-xl font-bold text-gray-900">
                  {t(`cuisines.${cuisine.id}.name`)}
                </h3>
                <p className="mt-3 text-sm text-gray-600">
                  {t(`cuisines.${cuisine.id}.description`)}
                </p>
                <div className="mt-4 text-sm font-medium text-orange-600">
                  {cuisine.regions} regions
                </div>
                <button className="mt-6 text-orange-600 font-semibold hover:text-orange-700">
                  {t('explore')} →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dining Tips */}
      <section className="bg-gray-50 px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-12">{t('tips.title')}</h2>
          <div className="grid gap-8 md:grid-cols-2">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="rounded-lg bg-white p-6 border border-gray-200">
                <div className="text-3xl mb-3">
                  {[
                    '🔪',
                    '🍷',
                    '💬',
                    '💰',
                    '🧂',
                    '🌶️',
                  ][i]}
                </div>
                <h3 className="font-semibold text-gray-900">
                  {t(`tips.tip${i + 1}.title`)}
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  {t(`tips.tip${i + 1}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Allergens & Dietary */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">{t('dietary.title')}</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {['vegetarian', 'vegan', 'halal', 'kosher', 'gluten-free', 'allergen-free'].map((diet) => (
              <div key={diet} className="rounded-lg border-2 border-orange-200 bg-orange-50 p-6">
                <h3 className="font-semibold text-gray-900 mb-3">
                  {t(`dietary.${diet}.title`)}
                </h3>
                <p className="text-sm text-gray-700">
                  {t(`dietary.${diet}.description`)}
                </p>
                <button className="mt-4 text-sm text-orange-600 font-semibold hover:text-orange-700">
                  {t('learnMore')} →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Restaurant Etiquette */}
      <section className="bg-orange-50 px-6 py-16">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">{t('etiquette.title')}</h2>
          <div className="space-y-4">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="rounded-lg bg-white p-4 border-l-4 border-orange-600">
                <h3 className="font-semibold text-gray-900">
                  {t(`etiquette.rule${i + 1}.title`)}
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  {t(`etiquette.rule${i + 1}.description`)}
                </p>
              </div>
            ))}
          </div>
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
  const t = await getTranslations({ locale, namespace: 'foodGuide' })
  return {
    title: t('meta.title'),
    description: t('meta.description'),
  }
}
