import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@/lib/locales'

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('contact')

  return (
    <main className="flex flex-1 flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-600 to-indigo-800 px-6 py-24 text-center sm:py-32">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-4xl font-bold text-white sm:text-5xl">
            {t('hero.title')}
          </h1>
          <p className="mt-4 text-lg text-indigo-100">
            {t('hero.subtitle')}
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-2xl">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Form */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{t('form.title')}</h2>
              <form className="mt-8 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-900">
                    {t('form.name')}
                  </label>
                  <input
                    type="text"
                    className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder={t('form.namePlaceholder')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900">
                    {t('form.email')}
                  </label>
                  <input
                    type="email"
                    className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder={t('form.emailPlaceholder')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900">
                    {t('form.subject')}
                  </label>
                  <select className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                    <option>{t('form.selectSubject')}</option>
                    <option>{t('form.subject1')}</option>
                    <option>{t('form.subject2')}</option>
                    <option>{t('form.subject3')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900">
                    {t('form.message')}
                  </label>
                  <textarea
                    rows={5}
                    className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder={t('form.messagePlaceholder')}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-700"
                >
                  {t('form.submit')}
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{t('info.title')}</h2>
              <div className="mt-8 space-y-8">
                <div>
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                    📧 {t('info.email.label')}
                  </h3>
                  <p className="mt-2 text-gray-600">{t('info.email.value')}</p>
                </div>

                <div>
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                    📱 {t('info.phone.label')}
                  </h3>
                  <p className="mt-2 text-gray-600">{t('info.phone.value')}</p>
                </div>

                <div>
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                    📍 {t('info.address.label')}
                  </h3>
                  <p className="mt-2 text-gray-600">{t('info.address.value')}</p>
                </div>

                <div>
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                    ⏰ {t('info.hours.label')}
                  </h3>
                  <p className="mt-2 text-gray-600">{t('info.hours.value')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Links */}
      <section className="bg-gray-50 px-6 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-gray-900">{t('social.title')}</h2>
          <div className="mt-8 flex justify-center gap-6">
            {['twitter', 'facebook', 'instagram', 'linkedin'].map((social) => (
              <button
                key={social}
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border-2 border-gray-300 text-2xl hover:border-indigo-600 hover:text-indigo-600"
              >
                {social === 'twitter' && '𝕏'}
                {social === 'facebook' && 'f'}
                {social === 'instagram' && '📷'}
                {social === 'linkedin' && 'in'}
              </button>
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
  const t = await getTranslations({ locale, namespace: 'contact' })
  return {
    title: t('meta.title'),
    description: t('meta.description'),
  }
}
