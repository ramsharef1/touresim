import { notFound } from 'next/navigation'
import { hasLocale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import { routing } from '@/i18n/routing'
import { Link } from '@/i18n/navigation'
import { getItineraryBySlug, getCityById, getCountryForCity } from '@/lib/queries'
import type { Locale } from '@/lib/locales'

type Props = { params: Promise<{ locale: string; slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const itin = await getItineraryBySlug(slug, locale as Locale)
  if (!itin) return {}
  return { title: itin.title }
}

export default async function ItineraryPage({ params }: Props) {
  const { locale, slug } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  const itin = await getItineraryBySlug(slug, locale as Locale)
  if (!itin) notFound()

  const [city, country] = await Promise.all([
    getCityById(itin.cityId, locale as Locale),
    getCountryForCity(itin.cityId, locale as Locale),
  ])

  const durationLabel: Record<string, string> = {
    en: `${itin.durationDays}-day itinerary`,
    ar: `خطة ${itin.durationDays} أيام`,
    fr: `Itinéraire de ${itin.durationDays} jours`,
    tr: `${itin.durationDays} günlük gezi planı`,
    es: `Itinerario de ${itin.durationDays} días`,
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      {/* Breadcrumb */}
      <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-[var(--muted)]">
        <Link href="/" className="hover:text-[var(--navy)] transition-colors">Home</Link>
        <span>/</span>
        {country && (
          <>
            <Link href={`/${country.slug}`} className="hover:text-[var(--navy)] transition-colors">
              {country.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="font-medium text-[var(--navy)] line-clamp-1">{itin.title}</span>
      </nav>

      {/* Header */}
      <div className="mb-2 h-1 w-10 rounded-full bg-[var(--gold)]" />
      <span className="text-sm font-medium text-[var(--gold)]">
        {durationLabel[locale] ?? durationLabel.en}
      </span>
      <h1 className="mt-1 text-3xl font-bold text-[var(--navy)] sm:text-4xl">{itin.title}</h1>

      {/* Body */}
      {itin.body && (
        <article className="prose prose-slate mt-8 max-w-none">
          <ItineraryBody body={itin.body} />
        </article>
      )}

      {/* Back link */}
      {country && (
        <div className="mt-12 border-t border-[var(--border)] pt-6">
          <Link
            href={`/${country.slug}`}
            className="text-sm font-medium text-[var(--navy)] hover:text-[var(--gold)] transition-colors"
          >
            ← Back to {country.name}
          </Link>
        </div>
      )}
    </main>
  )
}

function ItineraryBody({ body }: { body: string }) {
  // Simple Markdown-to-HTML renderer for the subset we use
  const lines = body.split('\n')
  const elements: React.ReactNode[] = []
  let key = 0

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    if (line.startsWith('**Day ') || (line.startsWith('**') && line.endsWith('**'))) {
      // Bold heading lines like **Day 1 — ...**
      const text = line.replace(/^\*\*/, '').replace(/\*\*$/, '')
      elements.push(
        <h2 key={key++} className="mt-8 mb-3 text-xl font-bold text-[var(--navy)]">
          {text}
        </h2>
      )
    } else if (line.startsWith('- ')) {
      elements.push(
        <li key={key++} className="ml-4 text-[var(--muted)] leading-7">
          {renderInline(line.slice(2))}
        </li>
      )
    } else if (line.trim() === '') {
      elements.push(<div key={key++} className="h-3" />)
    } else {
      elements.push(
        <p key={key++} className="leading-7 text-[var(--muted)]">
          {renderInline(line)}
        </p>
      )
    }
  }

  return <div>{elements}</div>
}

function renderInline(text: string): React.ReactNode {
  // Handle **bold** inline
  const parts = text.split(/(\*\*[^*]+\*\*)/)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold text-[var(--navy)]">{part.slice(2, -2)}</strong>
    }
    return part
  })
}
