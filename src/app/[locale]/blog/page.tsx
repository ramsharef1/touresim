import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Locale } from '@/lib/locales'

const ARTICLES = Array.from({ length: 12 }, (_, i) => ({
  id: `article-${i + 1}`,
  category: ['destinations', 'tips', 'stories', 'news'][i % 4],
  readTime: 5 + (i % 6),
  date: new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
}))

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('blog')

  return (
    <main className="flex flex-1 flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-rose-600 to-rose-800 px-6 py-24 text-center sm:py-32">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-4xl font-bold text-white sm:text-5xl">
            {t('title')}
          </h1>
          <p className="mt-4 text-lg text-rose-100">
            {t('subtitle')}
          </p>
        </div>
      </section>

      {/* Featured */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Featured Article */}
            <div className="lg:col-span-2 rounded-lg overflow-hidden bg-white shadow-md">
              <div className="h-64 bg-gradient-to-br from-rose-200 to-rose-300 flex items-center justify-center">
                <span className="text-6xl">📸</span>
              </div>
              <div className="p-8">
                <div className="flex gap-2">
                  <span className="inline-block rounded-full bg-rose-100 px-3 py-1 text-sm font-medium text-rose-700">
                    {t('category.destinations')}
                  </span>
                </div>
                <h2 className="mt-4 text-3xl font-bold text-gray-900">
                  {t('featured.title')}
                </h2>
                <p className="mt-4 text-lg text-gray-600">
                  {t('featured.description')}
                </p>
                <div className="mt-6 flex items-center gap-4 text-sm text-gray-500">
                  <span>{t('featured.date')}</span>
                  <span>•</span>
                  <span>{t('featured.readTime')} min read</span>
                </div>
                <button className="mt-6 text-rose-600 font-semibold hover:text-rose-700">
                  {t('readMore')} →
                </button>
              </div>
            </div>

            {/* Trending */}
            <div className="rounded-lg bg-white p-8 shadow-md">
              <h3 className="text-xl font-bold text-gray-900">{t('trending.title')}</h3>
              <div className="mt-6 space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border-b border-gray-200 pb-4 last:border-0">
                    <p className="text-sm font-medium text-gray-600">{t(`trending.item${i}`)}</p>
                    <p className="mt-1 text-xs text-gray-500">2 days ago</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* All Articles */}
      <section className="px-6 py-16 bg-gray-50">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold text-gray-900">{t('allArticles')}</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ARTICLES.map((article) => (
              <article key={article.id} className="rounded-lg bg-white p-6 shadow-sm hover:shadow-md transition">
                <div className="mb-4 h-40 rounded bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <span className="text-4xl">
                    {article.category === 'destinations' && '✈️'}
                    {article.category === 'tips' && '💡'}
                    {article.category === 'stories' && '📖'}
                    {article.category === 'news' && '📰'}
                  </span>
                </div>
                <div className="flex gap-2 mb-3">
                  <span className="text-xs font-medium text-rose-700 bg-rose-100 rounded-full px-2 py-1">
                    {t(`category.${article.category}`)}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900">
                  {t(`articles.${article.id}.title`)}
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  {t(`articles.${article.id}.excerpt`)}
                </p>
                <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                  <span>{article.date}</span>
                  <span>{article.readTime} min</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-gray-900">{t('newsletter.title')}</h2>
          <p className="mt-4 text-gray-600">{t('newsletter.subtitle')}</p>
          <div className="mt-8 flex gap-3">
            <input
              type="email"
              placeholder={t('newsletter.placeholder')}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
            <button className="rounded-lg bg-rose-600 px-6 font-semibold text-white hover:bg-rose-700">
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
  const t = await getTranslations({ locale, namespace: 'blog' })
  return {
    title: t('meta.title'),
    description: t('meta.description'),
  }
}
