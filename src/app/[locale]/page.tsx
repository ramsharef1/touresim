import { getTranslations, setRequestLocale } from 'next-intl/server'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { getAllCountries, getCountryHeroImage } from '@/lib/queries'
import type { Locale } from '@/lib/locales'

// Featured destination slugs — shown on homepage
const FEATURED_SLUGS = ['japan', 'united-arab-emirates', 'france', 'turkey', 'italy', 'spain', 'greece', 'morocco']

// Trending by month (1-indexed) — swaps each month for freshness
const TRENDING_BY_MONTH: Record<number, string[]> = {
  1:  ['japan', 'new-zealand', 'switzerland', 'peru'],
  2:  ['thailand', 'morocco', 'spain', 'egypt'],
  3:  ['italy', 'vietnam', 'india', 'portugal'],
  4:  ['france', 'croatia', 'georgia', 'south-africa'],
  5:  ['greece', 'turkey', 'cambodia', 'ireland'],
  6:  ['indonesia', 'canada', 'iceland', 'austria'],
  7:  ['united-states', 'norway', 'finland', 'czech-republic'],
  8:  ['maldives', 'united-arab-emirates', 'kenya', 'albania'],
  9:  ['italy', 'spain', 'mexico', 'peru'],
  10: ['japan', 'south-korea', 'nepal', 'turkey'],
  11: ['thailand', 'morocco', 'jordan', 'brazil'],
  12: ['finland', 'austria', 'new-zealand', 'tanzania'],
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('home')

  const allCountries = await getAllCountries(locale as Locale)
  const featured = FEATURED_SLUGS
    .map((slug) => allCountries.find((c) => c.slug === slug))
    .filter(Boolean) as typeof allCountries

  const month = new Date().getMonth() + 1
  const trendingSlugs = TRENDING_BY_MONTH[month] ?? TRENDING_BY_MONTH[1]
  const trending = trendingSlugs
    .map((slug) => allCountries.find((c) => c.slug === slug))
    .filter(Boolean) as typeof allCountries

  // Fetch hero images in parallel
  const [images, trendingImages] = await Promise.all([
    Promise.all(featured.map((c) => getCountryHeroImage(c.id))),
    Promise.all(trending.map((c) => getCountryHeroImage(c.id))),
  ])

  return (
    <main className="flex flex-1 flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[var(--navy)] px-6 py-24 text-center sm:py-32">
        <div
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'radial-gradient(circle at 25% 50%, #b19566 0%, transparent 60%), radial-gradient(circle at 75% 20%, #ffffff 0%, transparent 50%)',
          }}
        />
        <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--gold)]/40 bg-white/10 px-4 py-1.5 text-sm font-medium text-[var(--gold)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--gold)]" />
            {t('badge')}
          </span>
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-6xl">
            {t('title')}
          </h1>
          <p className="max-w-xl text-lg leading-8 text-white/70">
            {t('subtitle')}
          </p>
          <Link
            href="/destinations"
            className="mt-2 inline-flex h-12 items-center justify-center rounded-full bg-[var(--gold)] px-8 text-base font-semibold text-white shadow-lg transition hover:brightness-110"
          >
            {t('cta')}
          </Link>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-b border-[var(--border)] bg-[var(--surface)] px-6 py-5">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-8 text-sm text-[var(--muted)]">
          {[
            { icon: '🌍', label: locale === 'ar' ? 'وجهات حول العالم' : 'Destinations worldwide' },
            { icon: '✍️', label: locale === 'ar' ? 'محتوى محرَّر باحتراف' : 'Expert-curated content' },
            { icon: '🛂',  label: locale === 'ar' ? 'معلومات تأشيرة مخصصة' : 'Personalised visa info' },
            { icon: '🌐', label: locale === 'ar' ? 'متاح بـ 5 لغات' : 'Available in 5 languages' },
          ].map(({ icon, label }) => (
            <div key={label} className="flex items-center gap-2">
              <span className="text-base">{icon}</span>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Popular destinations — image cards */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <div className="mb-2 h-1 w-10 rounded-full bg-[var(--gold)]" />
              <h2 className="text-2xl font-bold text-[var(--navy)]">
                {locale === 'ar' ? 'أبرز الوجهات' : 'Popular destinations'}
              </h2>
            </div>
            <Link
              href="/destinations"
              className="text-sm font-medium text-[var(--navy)] hover:text-[var(--gold)] transition-colors"
            >
              {locale === 'ar' ? 'عرض الكل ←' : 'View all →'}
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {featured.map((country, i) => {
              const img = images[i]
              return (
                <Link
                  key={country.id}
                  href={`/${country.slug}`}
                  className="group relative overflow-hidden rounded-xl border border-[var(--border)] shadow-sm transition hover:shadow-lg"
                >
                  {img ? (
                    <div className="relative h-40 w-full sm:h-48">
                      <Image
                        src={img.url}
                        alt={country.name}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                      <span className="absolute bottom-3 start-3 text-base font-bold text-white drop-shadow">
                        {country.name}
                      </span>
                    </div>
                  ) : (
                    <div className="flex h-40 items-center justify-center bg-[var(--navy-50)] p-4 sm:h-48">
                      <span className="font-semibold text-[var(--navy)] group-hover:text-[var(--gold)] transition-colors">
                        {country.name}
                      </span>
                    </div>
                  )}
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Trending this month */}
      {trending.length > 0 && (
        <section className="border-t border-[var(--border)] px-6 py-16">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <div className="mb-2 h-1 w-10 rounded-full bg-[var(--gold)]" />
                <h2 className="text-2xl font-bold text-[var(--navy)]">
                  {locale === 'ar' ? 'الأكثر شيوعًا هذا الشهر' : 'Trending this month'}
                </h2>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {trending.map((country, i) => {
                const img = trendingImages[i]
                return (
                  <Link
                    key={country.id}
                    href={`/${country.slug}`}
                    className="group relative overflow-hidden rounded-xl border border-[var(--border)] shadow-sm transition hover:shadow-lg"
                  >
                    {img ? (
                      <div className="relative h-36 w-full sm:h-44">
                        <Image
                          src={img.url}
                          alt={country.name}
                          fill
                          className="object-cover transition duration-500 group-hover:scale-105"
                          sizes="(max-width: 640px) 50vw, 25vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                        <span className="absolute bottom-3 start-3 text-sm font-bold text-white drop-shadow">
                          {country.name}
                        </span>
                      </div>
                    ) : (
                      <div className="flex h-36 items-center justify-center bg-[var(--navy-50)] p-4 sm:h-44">
                        <span className="font-semibold text-[var(--navy)] group-hover:text-[var(--gold)] transition-colors text-sm">
                          {country.name}
                        </span>
                      </div>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Trip Planner CTA */}
      <section className="px-6 pb-16">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-2xl bg-[var(--navy)] px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-[var(--gold)] text-sm font-medium mb-1">
                {locale === 'ar' ? 'مدعوم بالذكاء الاصطناعي' : 'Powered by AI'}
              </p>
              <h3 className="text-2xl font-bold text-white mb-2">
                {locale === 'ar' ? 'خطط لرحلتك في ثوانٍ' : 'Plan your perfect trip in seconds'}
              </h3>
              <p className="text-white/70 text-sm max-w-md">
                {locale === 'ar'
                  ? 'أخبرنا عن أسلوب سفرك وميزانيتك وسنبني لك خطة سفر مخصصة.'
                  : 'Tell us your style, budget, and duration — we\'ll build a personalised itinerary.'}
              </p>
            </div>
            <Link
              href="/trip-planner"
              className="shrink-0 inline-flex items-center gap-2 rounded-full bg-[var(--gold)] px-7 py-3 text-base font-semibold text-white shadow-lg transition hover:brightness-110"
            >
              {locale === 'ar' ? 'ابدأ التخطيط' : 'Start planning'}
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Touresim */}
      <section className="border-t border-[var(--border)] bg-[var(--navy-50)] px-6 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-2 flex justify-center">
            <div className="h-1 w-10 rounded-full bg-[var(--gold)]" />
          </div>
          <h2 className="mb-10 text-2xl font-bold text-[var(--navy)]">
            {locale === 'ar' ? 'لماذا توريسم؟' : 'Why Touresim?'}
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                icon: '📖',
                title: locale === 'ar' ? 'محتوى عميق' : 'Deep content',
                body: locale === 'ar'
                  ? 'تأشيرات، أفضل أوقات الزيارة، الميزانية، الطعام — كل ما تحتاجه في مكان واحد.'
                  : 'Visas, best times, budget, food — everything you need in one place.',
              },
              {
                icon: '🛂',
                title: locale === 'ar' ? 'مخصص لجنسيتك' : 'Personalised for you',
                body: locale === 'ar'
                  ? 'اختر جنسيتك وسنعرض لك متطلبات التأشيرة المناسبة لك تحديداً.'
                  : 'Select your nationality and see visa requirements tailored to your passport.',
              },
              {
                icon: '✅',
                title: locale === 'ar' ? 'موثوق ومحدَّث' : 'Trusted & updated',
                body: locale === 'ar'
                  ? 'معلومات دقيقة تُحدَّث باستمرار لتبقى موثوقة.'
                  : 'Accurate information continuously updated to stay reliable.',
              },
            ].map((card) => (
              <div key={card.title} className="rounded-xl border border-[var(--border)] bg-white p-6 text-start shadow-sm">
                <div className="mb-3 text-3xl">{card.icon}</div>
                <h3 className="mb-2 font-bold text-[var(--navy)]">{card.title}</h3>
                <p className="text-sm leading-6 text-[var(--muted)]">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
