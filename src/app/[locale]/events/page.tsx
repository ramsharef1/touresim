import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@/lib/locales'

const EVENTS = [
  { id: 'event-1', month: 'Jan', icon: '❄️', type: 'winter' },
  { id: 'event-2', month: 'Feb', icon: '💝', type: 'festival' },
  { id: 'event-3', month: 'Mar', icon: '🌸', type: 'seasonal' },
  { id: 'event-4', month: 'Apr', icon: '🌼', type: 'seasonal' },
  { id: 'event-5', month: 'May', icon: '🌞', type: 'festival' },
  { id: 'event-6', month: 'Jun', icon: '🏖️', type: 'seasonal' },
  { id: 'event-7', month: 'Jul', icon: '🎆', type: 'festival' },
  { id: 'event-8', month: 'Aug', icon: '🎭', type: 'cultural' },
  { id: 'event-9', month: 'Sep', icon: '🍂', type: 'seasonal' },
  { id: 'event-10', month: 'Oct', icon: '🎃', type: 'festival' },
  { id: 'event-11', month: 'Nov', icon: '🦃', type: 'seasonal' },
  { id: 'event-12', month: 'Dec', icon: '🎄', type: 'festival' },
]

export default async function EventsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('events')

  return (
    <main className="flex flex-1 flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-pink-600 to-pink-800 px-6 py-24 text-center sm:py-32">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-4xl font-bold text-white sm:text-5xl">
            {t('title')}
          </h1>
          <p className="mt-4 text-lg text-pink-100">
            {t('subtitle')}
          </p>
        </div>
      </section>

      {/* Calendar */}
      <section className="px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-12">{t('calendar.title')}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {EVENTS.map((event) => (
              <div
                key={event.id}
                className="rounded-lg bg-white p-6 text-center border border-gray-200 hover:shadow-lg transition cursor-pointer group"
              >
                <div className="text-5xl mb-3 transition group-hover:scale-110">
                  {event.icon}
                </div>
                <h3 className="font-bold text-lg text-gray-900">{event.month}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {t(`types.${event.type}`)}
                </p>
                <button className="mt-4 text-pink-600 font-semibold hover:text-pink-700 text-sm">
                  View events →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="bg-gray-50 px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">{t('upcoming.title')}</h2>
          <div className="space-y-4">
            {Array.from({ length: 8 }, (_, i) => (
              <div
                key={i}
                className="rounded-lg bg-white p-6 border border-gray-200 hover:shadow-md transition flex items-center gap-6"
              >
                <div className="flex-shrink-0">
                  <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-pink-100 text-2xl">
                    {['🎉', '🎊', '🎈', '🎭', '🎪', '🎨', '🎵', '🎸'][i]}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">
                    {t(`events.event${i + 1}.title`)}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {t(`events.event${i + 1}.description`)}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    📍 {t(`events.event${i + 1}.location`)}
                  </p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <p className="text-sm font-semibold text-pink-600">
                    {t(`events.event${i + 1}.date`)}
                  </p>
                  <button className="mt-2 text-sm text-pink-600 hover:text-pink-700 font-semibold">
                    {t('learnMore')} →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Festival Types */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">{t('festivals.title')}</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {['cultural', 'seasonal', 'religious', 'food', 'music', 'art'].map((type) => (
              <div key={type} className="rounded-lg bg-pink-50 border-l-4 border-pink-600 p-6">
                <h3 className="font-bold text-gray-900 capitalize mb-2">
                  {t(`festivals.${type}.title`)}
                </h3>
                <p className="text-sm text-gray-700 mb-4">
                  {t(`festivals.${type}.description`)}
                </p>
                <p className="text-xs text-gray-600">
                  {t(`festivals.${type}.examples`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscribe */}
      <section className="bg-pink-50 px-6 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-gray-900">{t('subscribe.title')}</h2>
          <p className="mt-3 text-gray-600">{t('subscribe.subtitle')}</p>
          <div className="mt-6 flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder={t('subscribe.placeholder')}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-3 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
            />
            <button className="rounded-lg bg-pink-600 px-6 font-semibold text-white hover:bg-pink-700">
              {t('subscribe.button')}
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
  const t = await getTranslations({ locale, namespace: 'events' })
  return {
    title: t('meta.title'),
    description: t('meta.description'),
  }
}
