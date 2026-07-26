import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('home')

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
            { icon: '🔄', label: locale === 'ar' ? 'تُحدَّث باستمرار' : 'Constantly updated' },
            { icon: '🌐', label: locale === 'ar' ? 'متاح بـ 5 لغات' : 'Available in 5 languages' },
          ].map(({ icon, label }) => (
            <div key={label} className="flex items-center gap-2">
              <span className="text-base">{icon}</span>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Popular destinations */}
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
            {[
              { emoji: '🇯🇵', name: locale === 'ar' ? 'اليابان' : 'Japan', href: '/japan' },
              { emoji: '🇫🇷', name: locale === 'ar' ? 'فرنسا' : 'France', href: '/france' },
              { emoji: '🇮🇹', name: locale === 'ar' ? 'إيطاليا' : 'Italy', href: '/italy' },
              { emoji: '🇹🇷', name: locale === 'ar' ? 'تركيا' : 'Turkey', href: '/turkey' },
            ].map((dest) => (
              <Link
                key={dest.href}
                href={dest.href}
                className="group flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm transition hover:border-[var(--gold)] hover:shadow-md"
              >
                <span className="text-2xl">{dest.emoji}</span>
                <span className="font-semibold text-[var(--navy)] group-hover:text-[var(--gold)] transition-colors">
                  {dest.name}
                </span>
              </Link>
            ))}
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
                  : 'Visas, best times, budget, food — everything in one place.',
              },
              {
                icon: '🌍',
                title: locale === 'ar' ? 'عربي أولاً' : 'Arabic-first',
                body: locale === 'ar'
                  ? 'صُمِّم للمسافر العربي والخليجي بشكل خاص.'
                  : 'Designed specifically for Arabic and GCC travelers.',
              },
              {
                icon: '✅',
                title: locale === 'ar' ? 'موثوق ومحدَّث' : 'Trusted & updated',
                body: locale === 'ar'
                  ? 'معلومات دقيقة تُحدَّث باستمرار لتبقى موثوقة.'
                  : 'Accurate information continuously updated to stay reliable.',
              },
            ].map((card) => (
              <div
                key={card.title}
                className="rounded-xl border border-[var(--border)] bg-white p-6 text-start shadow-sm"
              >
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
