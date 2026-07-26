import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@/lib/locales'

const SAFETY_TOPICS = [
  { id: 'personal-security', icon: '🔐', color: 'red' },
  { id: 'health-safety', icon: '⚕️', color: 'blue' },
  { id: 'money-safety', icon: '💳', color: 'green' },
  { id: 'transport-safety', icon: '🚗', color: 'yellow' },
  { id: 'natural-disasters', icon: '⚡', color: 'purple' },
  { id: 'emergency-contacts', icon: '📞', color: 'pink' },
]

export default async function SafetyGuidePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('safetyGuide')

  return (
    <main className="flex flex-1 flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-red-600 to-red-800 px-6 py-24 text-center sm:py-32">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-4xl font-bold text-white sm:text-5xl">
            {t('title')}
          </h1>
          <p className="mt-4 text-lg text-red-100">
            {t('subtitle')}
          </p>
        </div>
      </section>

      {/* Safety Topics */}
      <section className="px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SAFETY_TOPICS.map((topic) => (
              <div
                key={topic.id}
                className="rounded-lg bg-white p-8 border-t-4 border-red-500 shadow-sm hover:shadow-lg transition"
              >
                <div className="text-5xl mb-4">{topic.icon}</div>
                <h3 className="text-xl font-bold text-gray-900">
                  {t(`topics.${topic.id}.title`)}
                </h3>
                <p className="mt-3 text-gray-600 text-sm">
                  {t(`topics.${topic.id}.description`)}
                </p>
                <button className="mt-6 text-red-600 font-semibold hover:text-red-700">
                  {t('readMore')} →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety Checklist */}
      <section className="bg-gray-50 px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">{t('checklist.title')}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              'insurance',
              'documents',
              'contacts',
              'medicalInfo',
              'backup',
              'insurance2',
              'travel-alerts',
              'timezone',
            ].map((item, i) => (
              <label key={item} className="flex items-center gap-3 rounded-lg border border-gray-300 bg-white p-4 cursor-pointer hover:bg-gray-50">
                <input type="checkbox" className="w-5 h-5 text-red-600" />
                <span className="text-gray-900 font-medium">{t(`checklist.item${i + 1}`)}</span>
              </label>
            ))}
          </div>
        </div>
      </section>

      {/* Risk Levels by Country */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">{t('riskLevels.title')}</h2>
          <div className="space-y-3">
            {[
              { level: 'low', color: 'green', countries: 60 },
              { level: 'moderate', color: 'yellow', countries: 40 },
              { level: 'high', color: 'red', countries: 20 },
              { level: 'very-high', color: 'dark-red', countries: 12 },
            ].map((risk) => (
              <div key={risk.level} className="flex items-center gap-4">
                <div
                  className={`h-4 w-4 rounded-full ${
                    risk.color === 'green'
                      ? 'bg-green-500'
                      : risk.color === 'yellow'
                        ? 'bg-yellow-500'
                        : risk.color === 'red'
                          ? 'bg-red-500'
                          : 'bg-red-800'
                  }`}
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 capitalize">
                    {t(`riskLevels.${risk.level}.title`)}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {risk.countries} countries
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Resources */}
      <section className="bg-red-50 px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">{t('emergency.title')}</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg bg-white p-6 border-l-4 border-red-600">
              <h3 className="font-bold text-gray-900 mb-2">🆘 {t('emergency.help')}</h3>
              <p className="text-sm text-gray-600 mb-3">{t('emergency.helpText')}</p>
              <button className="text-red-600 font-semibold hover:text-red-700">
                Emergency numbers →
              </button>
            </div>
            <div className="rounded-lg bg-white p-6 border-l-4 border-blue-600">
              <h3 className="font-bold text-gray-900 mb-2">📞 {t('emergency.embassy')}</h3>
              <p className="text-sm text-gray-600 mb-3">{t('emergency.embassyText')}</p>
              <button className="text-blue-600 font-semibold hover:text-blue-700">
                Embassy contacts →
              </button>
            </div>
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
  const t = await getTranslations({ locale, namespace: 'safetyGuide' })
  return {
    title: t('meta.title'),
    description: t('meta.description'),
  }
}
