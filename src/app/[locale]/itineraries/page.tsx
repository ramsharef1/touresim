import { hasLocale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { routing } from '@/i18n/routing'
import { Link } from '@/i18n/navigation'
import { getAllItineraries, getCityById, getCountryForCity } from '@/lib/queries'
import type { Locale } from '@/lib/locales'

type Props = { params: Promise<{ locale: string }> }

export const metadata: Metadata = {
  title: 'Travel Itineraries — Day-by-Day Guides',
  description: 'Hand-crafted day-by-day travel itineraries for the world\'s best destinations. Plan your perfect trip with our expert guides.',
}

const DURATION_ICONS: Record<number, string> = { 3: '🗓️', 4: '📅', 5: '🗺️' }

export default async function ItinerariesPage({ params }: Props) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  const itineraries = await getAllItineraries(locale as Locale)

  // Enrich with city + country names
  const enriched = await Promise.all(
    itineraries.map(async (itin) => {
      const city = await getCityById(itin.cityId, locale as Locale)
      const country = city ? await getCountryForCity(itin.cityId, locale as Locale) : null
      return { ...itin, cityName: city?.name ?? '', countryName: country?.name ?? '', countrySlug: country?.slug ?? '' }
    })
  )

  const headings: Record<string, { title: string; subtitle: string; days: string }> = {
    en: { title: 'Travel Itineraries', subtitle: 'Day-by-day guides to the world\'s best destinations', days: 'days' },
    ar: { title: 'خطط السفر', subtitle: 'أدلة يومية لأفضل وجهات العالم', days: 'أيام' },
    fr: { title: 'Itinéraires de voyage', subtitle: 'Guides jour par jour pour les meilleures destinations', days: 'jours' },
    tr: { title: 'Seyahat Güzergahları', subtitle: 'Dünyanın en iyi destinasyonları için günlük rehberler', days: 'gün' },
    es: { title: 'Itinerarios de viaje', subtitle: 'Guías día a día para los mejores destinos del mundo', days: 'días' },
  }
  const h = headings[locale] ?? headings.en

  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-2 h-1 w-10 rounded-full bg-[var(--gold)]" />
      <h1 className="text-4xl font-bold text-[var(--navy)]">{h.title}</h1>
      <p className="mt-3 text-lg text-[var(--muted)]">{h.subtitle}</p>

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {enriched.map((itin) => (
          <Link
            key={itin.id}
            href={`/itineraries/${itin.slug}`}
            className="group flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm transition hover:border-[var(--gold)] hover:shadow-md"
          >
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--gold)]">
              <span>{DURATION_ICONS[itin.durationDays] ?? '🗓️'}</span>
              <span>{itin.durationDays} {h.days}</span>
            </div>
            <h2 className="mt-2 font-semibold leading-snug text-[var(--navy)] group-hover:text-[var(--gold)] transition-colors">
              {itin.title}
            </h2>
            {itin.cityName && (
              <p className="mt-auto pt-4 text-xs text-[var(--muted)]">
                {itin.cityName}{itin.countryName ? `, ${itin.countryName}` : ''}
              </p>
            )}
          </Link>
        ))}
      </div>
    </main>
  )
}
