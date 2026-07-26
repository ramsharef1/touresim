import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@/lib/locales'

const CATEGORIES = [
  { id: 'beach', icon: '🏖️', count: 45 },
  { id: 'mountain', icon: '⛰️', count: 38 },
  { id: 'city', icon: '🏙️', count: 52 },
  { id: 'adventure', icon: '🧗', count: 31 },
  { id: 'culture', icon: '🏛️', count: 42 },
  { id: 'nature', icon: '🌲', count: 48 },
  { id: 'food', icon: '🍴', count: 29 },
  { id: 'luxury', icon: '✨', count: 25 },
]

export default async function InspirationPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('inspiration')

  return (
    <main className="flex flex-1 flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-teal-600 to-teal-800 px-6 py-24 text-center sm:py-32">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-4xl font-bold text-white sm:text-5xl">
            {t('title')}
          </h1>
          <p className="mt-4 text-lg text-teal-100">
            {t('subtitle')}
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                className="group rounded-lg bg-white p-6 text-center border border-gray-200 hover:shadow-lg transition"
              >
                <div className="text-5xl mb-3 transition group-hover:scale-110">
                  {cat.icon}
                </div>
                <h3 className="font-semibold text-gray-900 capitalize">
                  {t(`categories.${cat.id}`)}
                </h3>
                <p className="text-sm text-gray-500 mt-2">{cat.count} places</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="bg-gray-50 px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">{t('gallery.title')}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 12 }, (_, i) => (
              <div
                key={i}
                className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-gray-300 to-gray-400 aspect-square cursor-pointer hover:shadow-lg transition"
              >
                <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-50 group-hover:opacity-100 transition">
                  {['🏖️', '⛰️', '🏙️', '🧗', '🏛️', '🌲', '🍴', '✨', '🌅', '🏰', '🌊', '🗿'][i]}
                </div>
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 opacity-0 group-hover:opacity-100 transition">
                  <p className="text-white font-semibold">
                    {t(`destinations.destination${i + 1}`)}
                  </p>
                  <p className="text-white/80 text-sm">Click to explore</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">{t('trending.title')}</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {Array.from({ length: 4 }, (_, i) => (
              <div
                key={i}
                className="rounded-lg overflow-hidden bg-white border border-gray-200 hover:shadow-lg transition cursor-pointer"
              >
                <div className="h-40 bg-gradient-to-br from-teal-200 to-teal-300 flex items-center justify-center text-5xl">
                  {['🏖️', '⛰️', '🌍', '🎭'][i]}
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-block px-3 py-1 rounded-full bg-teal-100 text-teal-700 text-xs font-semibold">
                      {t('trending.tags')[i]}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">
                    {t(`trending.destination${i + 1}.title`)}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {t(`trending.destination${i + 1}.description`)}
                  </p>
                  <div className="mt-4 flex items-center text-teal-600 font-semibold text-sm">
                    {t('discover')} →
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-teal-50 px-6 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-gray-900">{t('newsletter.title')}</h2>
          <p className="mt-3 text-gray-600">{t('newsletter.subtitle')}</p>
          <div className="mt-6 flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder={t('newsletter.placeholder')}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-3 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
            <button className="rounded-lg bg-teal-600 px-6 font-semibold text-white hover:bg-teal-700">
              {t('newsletter.button')}
            </button>
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
  const t = await getTranslations({ locale, namespace: 'inspiration' })
  return {
    title: t('meta.title'),
    description: t('meta.description'),
  }
}
