import { getTranslations, setRequestLocale } from 'next-intl/server'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/lib/locales'

const GUIDES = [
  {
    id: 'packing-essentials',
    icon: '🎒',
    readTime: '5 min',
  },
  {
    id: 'passport-tips',
    icon: '🛂',
    readTime: '4 min',
  },
  {
    id: 'budget-travel',
    icon: '💰',
    readTime: '6 min',
  },
  {
    id: 'travel-safety',
    icon: '🛡️',
    readTime: '7 min',
  },
  {
    id: 'jet-lag-tips',
    icon: '✈️',
    readTime: '5 min',
  },
  {
    id: 'travel-insurance',
    icon: '🏥',
    readTime: '8 min',
  },
]

export default async function TravelGuidesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('travelGuides')

  return (
    <main className="flex flex-1 flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-800 px-6 py-24 text-center sm:py-32">
        <div className="relative mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold text-white sm:text-5xl">
            {t('title')}
          </h1>
          <p className="mt-4 text-lg text-blue-100">
            {t('subtitle')}
          </p>
        </div>
      </section>

      {/* Guides Grid */}
      <section className="px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {GUIDES.map((guide) => (
              <article
                key={guide.id}
                className="group flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
              >
                {/* Image Placeholder */}
                <div className="relative h-48 w-full bg-gradient-to-br from-gray-200 to-gray-300">
                  <div className="flex h-full items-center justify-center">
                    <span className="text-6xl">{guide.icon}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {t(`guides.${guide.id}.title`)}
                  </h3>
                  <p className="mt-2 flex-1 text-gray-600">
                    {t(`guides.${guide.id}.description`)}
                  </p>

                  {/* Footer */}
                  <div className="mt-4 flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-sm text-gray-500">{guide.readTime} read</span>
                    <Link
                      href={`/travel-guides/${guide.id}`}
                      className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                    >
                      Read →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-50 px-6 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-gray-900">{t('cta.title')}</h2>
          <p className="mt-4 text-lg text-gray-600">{t('cta.subtitle')}</p>
          <Link
            href="/contact"
            className="mt-8 inline-flex h-12 items-center justify-center rounded-lg bg-blue-600 px-8 font-semibold text-white hover:bg-blue-700"
          >
            {t('cta.button')}
          </Link>
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
  const t = await getTranslations({ locale, namespace: 'travelGuides' })
  return {
    title: t('meta.title'),
    description: t('meta.description'),
  }
}
