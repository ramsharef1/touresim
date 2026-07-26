import { getTranslations, setRequestLocale } from 'next-intl/server'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { getAllCountries, getCountryHeroImage } from '@/lib/queries'
import type { Locale } from '@/lib/locales'

// Featured destination slugs — shown on homepage
const FEATURED_SLUGS = ['japan', 'united-arab-emirates', 'france', 'turkey', 'italy', 'spain', 'greece', 'morocco']

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('home')

  const allCountries = await getAllCountries(locale as Locale)
  const featured = FEATURED_SLUGS
    .map((slug) => allCountries.find((c) => c.slug === slug))
    .filter(Boolean) as typeof allCountries

  // Fetch hero images for featured countries in parallel
  const images = await Promise.all(featured.map((c) => getCountryHeroImage(c.id)))

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
