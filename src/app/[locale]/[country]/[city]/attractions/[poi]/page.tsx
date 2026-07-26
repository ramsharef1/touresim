import { notFound } from 'next/navigation'
import { hasLocale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import { routing } from '@/i18n/routing'
import { Link } from '@/i18n/navigation'
import { getPoiBySlug, getCityBySlug, getCountryForCity } from '@/lib/queries'
import {
  JsonLd,
  buildAlternates,
  breadcrumbJsonLd,
  touristAttractionJsonLd,
  canonicalUrl,
  robotsDirective,
} from '@/lib/seo'
import type { Locale } from '@/lib/locales'

type Props = {
  params: Promise<{ locale: string; country: string; city: string; poi: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, poi: poiSlug } = await params
  const poi = await getPoiBySlug(poiSlug, locale as Locale)
  if (!poi) return {}

  return {
    title: poi.name,
    description: poi.description ?? undefined,
    alternates: buildAlternates(poi.allTranslations, (_l, slug) => `/${slug}`),
    robots: robotsDirective(poi.indexStatus, poi.completenessScore ?? 0),
  }
}

const priceLabels: Record<string, Record<string, string>> = {
  ar: { free: 'مجاني', budget: 'اقتصادي', moderate: 'متوسط', expensive: 'مكلف', luxury: 'فاخر' },
  en: { free: 'Free', budget: 'Budget', moderate: 'Moderate', expensive: 'Expensive', luxury: 'Luxury' },
  fr: { free: 'Gratuit', budget: 'Économique', moderate: 'Modéré', expensive: 'Cher', luxury: 'Luxe' },
  tr: { free: 'Ücretsiz', budget: 'Ekonomik', moderate: 'Orta', expensive: 'Pahalı', luxury: 'Lüks' },
  es: { free: 'Gratis', budget: 'Económico', moderate: 'Moderado', expensive: 'Caro', luxury: 'Lujo' },
}

export default async function PoiPage({ params }: Props) {
  const { locale, country: countrySlug, city: citySlug, poi: poiSlug } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  const poi = await getPoiBySlug(poiSlug, locale as Locale)
  if (!poi || poi.indexStatus === 'draft') notFound()

  const city = await getCityBySlug(citySlug, locale as Locale)
  if (!city) notFound()

  const country = await getCountryForCity(city.id, locale as Locale)
  if (!country) notFound()

  const url = canonicalUrl(locale as Locale, countrySlug, citySlug, 'attractions', poi.slug)
  const cityUrl = canonicalUrl(locale as Locale, countrySlug, city.slug)
  const countryUrl = canonicalUrl(locale as Locale, country.slug)

  const hours = poi.openingHours as Record<string, string> | null

  const tipsLabel: Record<string, string> = {
    ar: 'نصائح مفيدة',
    en: 'Useful tips',
    fr: 'Conseils pratiques',
    tr: 'Pratik ipuçları',
    es: 'Consejos útiles',
  }

  const hoursLabel: Record<string, string> = {
    ar: 'ساعات العمل',
    en: 'Opening hours',
    fr: 'Horaires',
    tr: 'Açılış saatleri',
    es: 'Horario',
  }

  const priceLabel: Record<string, string> = {
    ar: 'السعر',
    en: 'Price range',
    fr: 'Gamme de prix',
    tr: 'Fiyat aralığı',
    es: 'Rango de precios',
  }

  const dayNames: Record<string, Record<string, string>> = {
    en: { mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu', fri: 'Fri', sat: 'Sat', sun: 'Sun' },
    ar: { mon: 'الإثنين', tue: 'الثلاثاء', wed: 'الأربعاء', thu: 'الخميس', fri: 'الجمعة', sat: 'السبت', sun: 'الأحد' },
    fr: { mon: 'Lun', tue: 'Mar', wed: 'Mer', thu: 'Jeu', fri: 'Ven', sat: 'Sam', sun: 'Dim' },
    tr: { mon: 'Pzt', tue: 'Sal', wed: 'Çar', thu: 'Per', fri: 'Cum', sat: 'Cmt', sun: 'Paz' },
    es: { mon: 'Lun', tue: 'Mar', wed: 'Mié', thu: 'Jue', fri: 'Vie', sat: 'Sáb', sun: 'Dom' },
  }

  const days = dayNames[locale] ?? dayNames.en

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: country.name, url: countryUrl },
          { name: city.name, url: cityUrl },
          { name: poi.name, url },
        ])}
      />
      <JsonLd
        data={touristAttractionJsonLd({
          name: poi.name,
          description: poi.description,
          url,
          priceRange: poi.priceRange,
          geo: poi.latitude && poi.longitude
            ? { lat: String(poi.latitude), lng: String(poi.longitude) }
            : null,
        })}
      />

      <main className="mx-auto max-w-3xl px-4 py-12">
        {/* Breadcrumb */}
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-[var(--muted)]">
          <Link href={`/${country.slug}`} className="hover:text-[var(--navy)] transition-colors">
            {country.name}
          </Link>
          <span>/</span>
          <Link href={`/${country.slug}/${city.slug}`} className="hover:text-[var(--navy)] transition-colors">
            {city.name}
          </Link>
          <span>/</span>
          <span className="font-medium text-[var(--navy)]">{poi.name}</span>
        </nav>

        {/* Header */}
        <div className="mb-2 h-1 w-10 rounded-full bg-[var(--gold)]" />
        <h1 className="text-4xl font-bold text-[var(--navy)]">{poi.name}</h1>

        {/* Meta chips */}
        <div className="mt-3 flex flex-wrap gap-2">
          {poi.priceRange && (
            <span className="rounded-full border border-[var(--border)] bg-[var(--navy-50)] px-3 py-1 text-sm font-medium text-[var(--navy)]">
              {priceLabel[locale] ?? priceLabel.en}: {(priceLabels[locale] ?? priceLabels.en)[poi.priceRange] ?? poi.priceRange}
            </span>
          )}
        </div>

        {/* Description */}
        {poi.description && (
          <p className="mt-6 text-lg leading-8 text-[var(--muted)]">{poi.description}</p>
        )}

        {/* Opening hours */}
        {hours && Object.keys(hours).length > 0 && (
          <section className="mt-8 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
            <h2 className="mb-3 font-semibold text-[var(--navy)]">
              {hoursLabel[locale] ?? hoursLabel.en}
            </h2>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm sm:grid-cols-4">
              {Object.entries(hours).map(([day, time]) => (
                <div key={day} className="flex justify-between gap-2">
                  <dt className="font-medium text-[var(--foreground)]">{days[day] ?? day}</dt>
                  <dd className="text-[var(--muted)]">{time}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {/* Tips */}
        {poi.tips && (
          <section className="mt-8 rounded-xl border border-[var(--gold)]/30 bg-[var(--gold-light)] p-5">
            <h2 className="mb-3 font-semibold text-[var(--navy)]">
              {tipsLabel[locale] ?? tipsLabel.en}
            </h2>
            <p className="text-sm leading-7 text-[var(--foreground)]">{poi.tips}</p>
          </section>
        )}

        {/* Map link */}
        {poi.latitude && poi.longitude && (
          <section className="mt-8">
            <a
              href={`https://www.google.com/maps?q=${poi.latitude},${poi.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-medium text-[var(--navy)] shadow-sm transition hover:border-[var(--gold)]"
            >
              📍 {locale === 'ar' ? 'عرض على الخريطة' : 'View on map'}
            </a>
          </section>
        )}
      </main>
    </>
  )
}
