import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@/lib/locales'

const FAQS = [
  { id: 'visa-requirements', category: 'visa' },
  { id: 'passport-validity', category: 'visa' },
  { id: 'travel-budget', category: 'planning' },
  { id: 'best-time-to-visit', category: 'planning' },
  { id: 'travel-insurance', category: 'safety' },
  { id: 'vaccinations', category: 'health' },
  { id: 'currency-exchange', category: 'money' },
  { id: 'travel-apps', category: 'tech' },
  { id: 'luggage-restrictions', category: 'airlines' },
  { id: 'travel-documentation', category: 'documents' },
  { id: 'hotel-booking', category: 'accommodation' },
  { id: 'travel-insurance-claims', category: 'insurance' },
]

export default async function FAQPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('faq')

  return (
    <main className="flex flex-1 flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-purple-600 to-purple-800 px-6 py-24 text-center sm:py-32">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-4xl font-bold text-white sm:text-5xl">
            {t('title')}
          </h1>
          <p className="mt-4 text-lg text-purple-100">
            {t('subtitle')}
          </p>
        </div>
      </section>

      {/* Search */}
      <section className="border-b border-gray-200 bg-white px-6 py-8">
        <div className="mx-auto max-w-2xl">
          <input
            type="text"
            placeholder={t('search')}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-2xl space-y-4">
          {FAQS.map((faq) => (
            <details
              key={faq.id}
              className="group rounded-lg border border-gray-200 bg-white p-6 hover:bg-gray-50"
            >
              <summary className="flex cursor-pointer items-center justify-between font-semibold text-gray-900">
                <span>{t(`questions.${faq.id}.q`)}</span>
                <span className="text-purple-600 transition group-open:rotate-180">↓</span>
              </summary>
              <p className="mt-4 text-gray-700">
                {t(`questions.${faq.id}.a`)}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="bg-purple-50 px-6 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-gray-900">{t('stillHave.title')}</h2>
          <p className="mt-2 text-gray-600">{t('stillHave.subtitle')}</p>
          <button className="mt-6 inline-flex h-12 items-center justify-center rounded-lg bg-purple-600 px-8 font-semibold text-white hover:bg-purple-700">
            {t('stillHave.button')}
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
  const t = await getTranslations({ locale, namespace: 'faq' })
  return {
    title: t('meta.title'),
    description: t('meta.description'),
  }
}
