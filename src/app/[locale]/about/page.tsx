import { getTranslations, setRequestLocale } from 'next-intl/server'
import Image from 'next/image'
import type { Locale } from '@/lib/locales'

const TEAM_MEMBERS = [
  { id: 'member-1', role: 'founder' },
  { id: 'member-2', role: 'ceo' },
  { id: 'member-3', role: 'content-lead' },
  { id: 'member-4', role: 'product' },
]

const STATS = [
  { icon: '🌍', label: 'countries', value: '132' },
  { icon: '🏙️', label: 'cities', value: '444' },
  { icon: '👥', label: 'travelers', value: '50K+' },
  { icon: '📚', label: 'guides', value: '1000+' },
]

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('about')

  return (
    <main className="flex flex-1 flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-600 to-green-800 px-6 py-24 text-center sm:py-32">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-4xl font-bold text-white sm:text-5xl">
            {t('hero.title')}
          </h1>
          <p className="mt-4 text-lg text-green-100">
            {t('hero.subtitle')}
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl">
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{t('mission.title')}</h2>
              <p className="mt-6 text-lg text-gray-700 leading-relaxed">
                {t('mission.description')}
              </p>
            </div>
            <div className="flex h-80 items-center justify-center rounded-lg bg-gradient-to-br from-gray-200 to-gray-300">
              <span className="text-6xl">🗺️</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gray-50 px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-5xl">{stat.icon}</div>
                <div className="mt-4 text-4xl font-bold text-gray-900">
                  {stat.value}
                </div>
                <div className="mt-2 text-sm font-medium text-gray-600">
                  {t(`stats.${stat.label}`)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-3xl font-bold text-gray-900">
            {t('values.title')}
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {['trust', 'innovation', 'community'].map((value) => (
              <div key={value} className="text-center">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <span className="text-2xl">
                    {value === 'trust' && '✓'}
                    {value === 'innovation' && '💡'}
                    {value === 'community' && '🤝'}
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  {t(`values.${value}.title`)}
                </h3>
                <p className="mt-2 text-gray-600">
                  {t(`values.${value}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-gray-50 px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-3xl font-bold text-gray-900">
            {t('team.title')}
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM_MEMBERS.map((member) => (
              <div key={member.id} className="text-center">
                <div className="mx-auto mb-4 h-32 w-32 rounded-full bg-gradient-to-br from-gray-300 to-gray-400" />
                <h3 className="font-semibold text-gray-900">
                  {t(`team.${member.id}.name`)}
                </h3>
                <p className="text-sm text-gray-600">
                  {t(`team.${member.id}.role`)}
                </p>
                <p className="mt-2 text-xs text-gray-500">
                  {t(`team.${member.id}.bio`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-gray-900">{t('cta.title')}</h2>
          <p className="mt-4 text-lg text-gray-600">{t('cta.subtitle')}</p>
          <div className="mt-8 flex gap-4 justify-center">
            <button className="inline-flex h-12 items-center justify-center rounded-lg bg-green-600 px-8 font-semibold text-white hover:bg-green-700">
              {t('cta.button1')}
            </button>
            <button className="inline-flex h-12 items-center justify-center rounded-lg border border-gray-300 px-8 font-semibold text-gray-900 hover:bg-gray-50">
              {t('cta.button2')}
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
  const t = await getTranslations({ locale, namespace: 'about' })
  return {
    title: t('meta.title'),
    description: t('meta.description'),
  }
}
