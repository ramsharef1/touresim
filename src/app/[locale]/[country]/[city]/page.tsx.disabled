import { notFound } from 'next/navigation'
import { hasLocale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { cookies } from 'next/headers'
import type { Metadata } from 'next'
import { routing } from '@/i18n/routing'
import { Link } from '@/i18n/navigation'
import Image from 'next/image'
import {
  getCityBySlug,
  getCountryBySlug,
  getCountryForCity,
  getCitiesForCountry,
  getPoisForCity,
  getVisaRequirement,
  getItinerariesForCity,
  getIntentPageContent,
  getCityHeroImage,
  getCityAttractions,
  getCountryHeroImage,
} from '@/lib/queries'
import {
  JsonLd,
  buildAlternates,
  breadcrumbJsonLd,
  touristDestinationJsonLd,
  canonicalUrl,
  robotsDirective,
} from '@/lib/seo'
import { NATIONALITY_COOKIE } from '@/lib/nationality'
import { VisaBlock } from '@/components/VisaBlock'
import type { Locale } from '@/lib/locales'

// Country-level intent slugs — intercepted before treating as a city slug
const COUNTRY_INTENTS = [
  'visa',
  'things-to-do',
  'where-to-stay',
  'best-time-to-visit',
  'safety',
  'weather',
  'food',
  'budget',
] as const
type CountryIntent = typeof COUNTRY_INTENTS[number]

function isCountryIntent(slug: string): slug is CountryIntent {
  return (COUNTRY_INTENTS as readonly string[]).includes(slug)
}

type Props = { params: Promise<{ locale: string; country: string; city: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, country: countrySlug, city: citySlug } = await params

  if (isCountryIntent(citySlug)) {
    const country = await getCountryBySlug(countrySlug, locale as Locale)
    if (!country) return {}
    const intentTitle: Record<CountryIntent, string> = {
      visa: `Visa for ${country.name}`,
      'things-to-do': `Things to do in ${country.name}`,
      'where-to-stay': `Where to stay in ${country.name}`,
      'best-time-to-visit': `Best time to visit ${country.name}`,
      safety: `Is ${country.name} safe?`,
      weather: `${country.name} weather`,
      food: `Food & drink in ${country.name}`,
      budget: `${country.name} travel budget`,
    }
    return {
      title: intentTitle[citySlug],
      description: country.description ?? undefined,
      robots: robotsDirective(country.indexStatus, country.completenessScore),
    }
  }

  const city = await getCityBySlug(citySlug, locale as Locale)
  if (!city) return {}
  return {
    title: city.name,
    description: city.description ?? undefined,
    alternates: buildAlternates(city.allTranslations, (_l, slug) => `/${slug}`),
    robots: robotsDirective(city.indexStatus, city.completenessScore),
  }
}

export default async function CityOrIntentPage({ params }: Props) {
  const { locale, country: countrySlug, city: citySlug } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  if (isCountryIntent(citySlug)) {
    return <CountryIntentPage locale={locale} countrySlug={countrySlug} intent={citySlug} />
  }

  return <CityPage locale={locale} countrySlug={countrySlug} citySlug={citySlug} />
}

// ── Country intent page ────────────────────────────────────────────────────

async function CountryIntentPage({
  locale,
  countrySlug,
  intent,
}: {
  locale: string
  countrySlug: string
  intent: CountryIntent
}) {
  const country = await getCountryBySlug(countrySlug, locale as Locale)
  if (!country || country.indexStatus === 'draft') notFound()

  const jar = await cookies()
  const passportIso2 = jar.get(NATIONALITY_COOKIE)?.value ?? null

  const isGenericIntent = intent !== 'visa' && intent !== 'best-time-to-visit'
  const [cities, visaReq, intentContent, heroImage] = await Promise.all([
    getCitiesForCountry(country.id, locale as Locale),
    intent === 'visa' && passportIso2
      ? getVisaRequirement(passportIso2, country.id)
      : Promise.resolve(null),
    isGenericIntent
      ? getIntentPageContent(country.id, intent, locale as Locale)
      : Promise.resolve(null),
    getCountryHeroImage(country.id),
  ])

  const url = canonicalUrl(locale as Locale, country.slug)

  const intentLabels: Record<string, Record<CountryIntent, string>> = {
    en: {
      visa: 'Visa',
      'things-to-do': 'Things to do',
      'where-to-stay': 'Where to stay',
      'best-time-to-visit': 'Best time to visit',
      safety: 'Safety',
      weather: 'Weather',
      food: 'Food & drink',
      budget: 'Budget',
    },
    ar: {
      visa: 'تأشيرة الدخول',
      'things-to-do': 'أشياء للقيام بها',
      'where-to-stay': 'أماكن الإقامة',
      'best-time-to-visit': 'أفضل وقت للزيارة',
      safety: 'الأمان',
      weather: 'الطقس',
      food: 'الطعام',
      budget: 'الميزانية',
    },
    fr: {
      visa: 'Visa',
      'things-to-do': 'Que faire',
      'where-to-stay': 'Où séjourner',
      'best-time-to-visit': 'Meilleure période',
      safety: 'Sécurité',
      weather: 'Météo',
      food: 'Gastronomie',
      budget: 'Budget',
    },
    tr: {
      visa: 'Vize',
      'things-to-do': 'Yapılacaklar',
      'where-to-stay': 'Nerede kalınır',
      'best-time-to-visit': 'En iyi ziyaret zamanı',
      safety: 'Güvenlik',
      weather: 'Hava durumu',
      food: 'Yiyecek & içecek',
      budget: 'Bütçe',
    },
    es: {
      visa: 'Visado',
      'things-to-do': 'Qué hacer',
      'where-to-stay': 'Dónde alojarse',
      'best-time-to-visit': 'Mejor época',
      safety: 'Seguridad',
      weather: 'Clima',
      food: 'Gastronomía',
      budget: 'Presupuesto',
    },
  }

  const labels = intentLabels[locale] ?? intentLabels.en
  const intentTitle = labels[intent]

  const headings: Record<string, Record<string, string>> = {
    en: {
      otherTopics: 'Other topics',
      cities: 'Cities in',
    },
    ar: {
      otherTopics: 'مواضيع أخرى',
      cities: 'مدن في',
    },
    fr: { otherTopics: 'Autres sujets', cities: 'Villes de' },
    tr: { otherTopics: 'Diğer konular', cities: 'Şehirler:' },
    es: { otherTopics: 'Otros temas', cities: 'Ciudades de' },
  }
  const h = headings[locale] ?? headings.en

  const otherIntents = COUNTRY_INTENTS.filter((i) => i !== intent)

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: country.name, url },
          { name: intentTitle, url: `${url}/${intent}` },
        ])}
      />

      {/* Hero */}
      {heroImage && (
        <div className="relative h-56 w-full overflow-hidden sm:h-72">
          <Image src={heroImage.url} alt={`${intentTitle}: ${country.name}`} fill className="object-cover" priority sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="mx-auto max-w-4xl">
              <nav className="mb-2 flex flex-wrap items-center gap-1.5 text-sm text-white/80">
                <Link href="/" className="hover:text-white">Home</Link>
                <span aria-hidden>›</span>
                <Link href={`/${country.slug}`} className="hover:text-white">{country.name}</Link>
              </nav>
              <h1 className="text-3xl font-bold text-white drop-shadow sm:text-4xl">
                {intentTitle}: {country.name}
              </h1>
            </div>
          </div>
        </div>
      )}

      <main className="mx-auto max-w-4xl px-4 py-10">
        {/* Header — only if no hero */}
        {!heroImage && (
          <>
            <nav className="mb-4 flex items-center gap-1.5 text-sm text-[var(--muted)]">
              <Link href="/" className="hover:text-[var(--navy)] transition-colors">Home</Link>
              <span aria-hidden>›</span>
              <Link href={`/${country.slug}`} className="hover:text-[var(--navy)] transition-colors">
                {country.name}
              </Link>
            </nav>
            <div className="mb-2 h-1 w-10 rounded-full bg-[var(--gold)]" />
            <h1 className="text-4xl font-bold text-[var(--navy)]">
              {intentTitle}: {country.name}
            </h1>
          </>
        )}

        {/* Intent-specific content */}
        <div className="mt-8">
          {intent === 'visa' && (
            <VisaSection
              locale={locale}
              country={country}
              passportIso2={passportIso2}
              visaReq={visaReq}
            />
          )}
          {intent === 'best-time-to-visit' && (
            <BestTimeSection locale={locale} country={country} />
          )}
          {intent !== 'visa' && intent !== 'best-time-to-visit' && (
            <GenericIntentSection
              locale={locale}
              country={country}
              intent={intent}
              label={intentTitle}
              body={intentContent?.body ?? null}
            />
          )}
        </div>

        {/* Other topics */}
        <section className="mt-12">
          <h2 className="mb-4 text-lg font-semibold text-[var(--navy)]">{h.otherTopics}</h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {otherIntents.map((i) => (
              <Link
                key={i}
                href={`/${country.slug}/${i}`}
                className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm font-medium text-[var(--navy)] text-center transition hover:border-[var(--gold)] hover:bg-[var(--gold-light)]"
              >
                {labels[i]}
              </Link>
            ))}
          </div>
        </section>

        {/* Cities */}
        {cities.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-4 text-lg font-semibold text-[var(--navy)]">
              {h.cities} {country.name}
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {cities.map((city) => (
                <Link
                  key={city.id}
                  href={`/${country.slug}/${city.slug}`}
                  className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm font-medium text-[var(--navy)] shadow-sm transition hover:border-[var(--gold)] hover:bg-[var(--gold-light)]"
                >
                  {city.name}
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  )
}

// ── Intent-specific section components ────────────────────────────────────

function VisaSection({
  locale,
  country,
  passportIso2,
  visaReq,
}: {
  locale: string
  country: { visaSummary: string | null; name: string }
  passportIso2: string | null
  visaReq: Awaited<ReturnType<typeof getVisaRequirement>> | null
}) {
  return (
    <div className="space-y-6">
      {passportIso2 ? (
        <VisaBlock passportIso2={passportIso2} visa={visaReq} locale={locale} />
      ) : (
        country.visaSummary && (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
            <p className="leading-7 text-[var(--muted)]">{country.visaSummary}</p>
          </div>
        )
      )}
      {!passportIso2 && !country.visaSummary && (
        <PlaceholderCard locale={locale} />
      )}
    </div>
  )
}

function BestTimeSection({
  locale,
  country,
}: {
  locale: string
  country: { bestTimeSummary: string | null; name: string }
}) {
  if (!country.bestTimeSummary) return <PlaceholderCard locale={locale} />

  const seasons: { key: string; en: string; ar: string; icon: string }[] = [
    { key: 'spring', en: 'Spring', ar: 'الربيع', icon: '🌸' },
    { key: 'summer', en: 'Summer', ar: 'الصيف', icon: '☀️' },
    { key: 'autumn', en: 'Autumn', ar: 'الخريف', icon: '🍂' },
    { key: 'winter', en: 'Winter', ar: 'الشتاء', icon: '❄️' },
  ]

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
        <p className="leading-7 text-[var(--muted)]">{country.bestTimeSummary}</p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {seasons.map((s) => (
          <div
            key={s.key}
            className="rounded-xl border border-[var(--border)] bg-[var(--navy-50)] p-4 text-center"
          >
            <div className="text-2xl">{s.icon}</div>
            <div className="mt-1 text-sm font-medium text-[var(--navy)]">
              {locale === 'ar' ? s.ar : s.en}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const INTENT_ICONS: Record<CountryIntent, string> = {
  visa: '🛂',
  'things-to-do': '🗺️',
  'where-to-stay': '🏨',
  'best-time-to-visit': '📅',
  safety: '🛡️',
  weather: '🌤️',
  food: '🍜',
  budget: '💰',
}

function GenericIntentSection({
  locale,
  country,
  intent,
  label,
  body,
}: {
  locale: string
  country: { name: string; description: string | null }
  intent: CountryIntent
  label: string
  body: string | null
}) {
  if (body) {
    return (
      <div className="space-y-4">
        <div
          className="prose prose-slate max-w-none leading-7 text-[var(--foreground)] [&_p]:mb-4 [&_p]:leading-7 [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-[var(--navy)]"
          dangerouslySetInnerHTML={{ __html: body }}
        />
      </div>
    )
  }

  const comingSoon: Record<string, string> = {
    en: 'Detailed guide coming soon.',
    ar: 'الدليل التفصيلي قادم قريباً.',
    fr: 'Guide détaillé bientôt disponible.',
    tr: 'Detaylı rehber yakında geliyor.',
    es: 'Guía detallada próximamente.',
  }

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-sm text-center">
      <div className="text-5xl mb-4">{INTENT_ICONS[intent]}</div>
      <h2 className="text-xl font-semibold text-[var(--navy)] mb-2">
        {label} — {country.name}
      </h2>
      <p className="text-[var(--muted)] max-w-md mx-auto leading-7">
        {comingSoon[locale] ?? comingSoon.en}
      </p>
    </div>
  )
}

function PlaceholderCard({ locale }: { locale: string }) {
  const msg: Record<string, string> = {
    en: 'Select your nationality above to see personalised visa information.',
    ar: 'اختر جنسيتك أعلاه لعرض معلومات التأشيرة المخصصة لك.',
    fr: 'Sélectionnez votre nationalité pour voir les informations visa personnalisées.',
    tr: 'Kişiselleştirilmiş vize bilgilerini görmek için milliyetinizi seçin.',
    es: 'Seleccione su nacionalidad para ver información de visado personalizada.',
  }
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--navy-50)] p-6 text-center">
      <p className="text-sm text-[var(--muted)]">{msg[locale] ?? msg.en}</p>
    </div>
  )
}

// ── Regular city page ──────────────────────────────────────────────────────

async function CityPage({
  locale,
  countrySlug,
  citySlug,
}: {
  locale: string
  countrySlug: string
  citySlug: string
}) {
  const city = await getCityBySlug(citySlug, locale as Locale)
  if (!city || city.indexStatus === 'draft') notFound()

  const country = await getCountryForCity(city.id, locale as Locale)
  if (!country) notFound()

  const [pois, itineraries, heroImage, attractions] = await Promise.all([
    getPoisForCity(city.id, locale as Locale),
    getItinerariesForCity(city.id, locale as Locale),
    getCityHeroImage(city.id),
    getCityAttractions(city.id),
  ])

  const url = canonicalUrl(locale as Locale, countrySlug, city.slug)

  const intentLabels: Record<string, Record<string, string>> = {
    ar: {
      'things-to-do': 'أشياء للقيام بها',
      'where-to-stay': 'أماكن الإقامة',
      'best-time-to-visit': 'أفضل وقت للزيارة',
      'getting-around': 'التنقل',
      food: 'الطعام',
      budget: 'الميزانية',
      safety: 'الأمان',
      weather: 'الطقس',
    },
    en: {
      'things-to-do': 'Things to do',
      'where-to-stay': 'Where to stay',
      'best-time-to-visit': 'Best time to visit',
      'getting-around': 'Getting around',
      food: 'Food & drink',
      budget: 'Budget',
      safety: 'Safety',
      weather: 'Weather',
    },
    fr: {
      'things-to-do': 'Que faire',
      'where-to-stay': 'Où séjourner',
      'best-time-to-visit': 'Meilleure période',
      'getting-around': 'Se déplacer',
      food: 'Gastronomie',
      budget: 'Budget',
      safety: 'Sécurité',
      weather: 'Météo',
    },
    tr: {
      'things-to-do': 'Yapılacaklar',
      'where-to-stay': 'Nerede kalınır',
      'best-time-to-visit': 'En iyi zaman',
      'getting-around': 'Ulaşım',
      food: 'Yiyecek & içecek',
      budget: 'Bütçe',
      safety: 'Güvenlik',
      weather: 'Hava',
    },
    es: {
      'things-to-do': 'Qué hacer',
      'where-to-stay': 'Dónde alojarse',
      'best-time-to-visit': 'Mejor época',
      'getting-around': 'Cómo moverse',
      food: 'Gastronomía',
      budget: 'Presupuesto',
      safety: 'Seguridad',
      weather: 'Clima',
    },
  }

  const labels = intentLabels[locale] ?? intentLabels.en
  const intents = Object.keys(labels)

  const attractionsLabel: Record<string, string> = {
    ar: 'أبرز المعالم السياحية',
    en: 'Top attractions',
    fr: 'Principaux sites',
    tr: 'Öne çıkan yerler',
    es: 'Principales atracciones',
  }

  const landmarksLabel: Record<string, string> = {
    ar: 'المعالم والأماكن البارزة',
    en: 'Landmarks & places',
    fr: 'Monuments et lieux',
    tr: 'Simgeler ve yerler',
    es: 'Monumentos y lugares',
  }

  const cf = (m: Record<string, string>) => m[locale] ?? m.en
  const cityFactLabels = {
    population: { ar: 'عدد السكان', en: 'Population', fr: 'Population', tr: 'Nüfus', es: 'Población' },
    timezone: { ar: 'المنطقة الزمنية', en: 'Timezone', fr: 'Fuseau horaire', tr: 'Saat dilimi', es: 'Zona horaria' },
    airport: { ar: 'أقرب مطار', en: 'Nearest airport', fr: 'Aéroport', tr: 'En yakın havaalanı', es: 'Aeropuerto' },
  }
  const cityFacts = [
    city.population && {
      label: cf(cityFactLabels.population),
      value: new Intl.NumberFormat(locale === 'ar' ? 'ar' : locale).format(city.population),
    },
    city.timezone && { label: cf(cityFactLabels.timezone), value: city.timezone.replace(/_/g, ' ') },
    city.iataCode && { label: cf(cityFactLabels.airport), value: city.iataCode },
  ].filter(Boolean) as { label: string; value: string }[]

  const exploreLabel: Record<string, string> = {
    ar: 'دليل',
    en: 'Guide to',
    fr: 'Guide de',
    tr: 'Rehber:',
    es: 'Guía de',
  }

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: country.name, url: canonicalUrl(locale as Locale, country.slug) },
          { name: city.name, url },
        ])}
      />
      <JsonLd
        data={touristDestinationJsonLd({
          name: city.name,
          description: city.description,
          url,
          geo: city.latitude && city.longitude
            ? { lat: String(city.latitude), lng: String(city.longitude) }
            : null,
        })}
      />

      <main className="mx-auto max-w-4xl px-4 py-12">
        <nav className="mb-6 flex items-center gap-2 text-sm text-[var(--muted)]">
          <Link href={`/${country.slug}`} className="hover:text-[var(--navy)] transition-colors">
            {country.name}
          </Link>
          <span>/</span>
          <span className="text-[var(--navy)] font-medium">{city.name}</span>
        </nav>

        <div className="mb-2 h-1 w-10 rounded-full bg-[var(--gold)]" />
        <h1 className="text-4xl font-bold text-[var(--navy)]">{city.name}</h1>
        {city.description && (
          <p className="mt-4 text-lg leading-8 text-[var(--muted)]">{city.description}</p>
        )}
        {heroImage && (
          <div className="relative mt-6 h-64 w-full overflow-hidden rounded-2xl sm:h-80">
            <Image
              src={heroImage.url}
              alt={city.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 896px"
              priority
            />
            {heroImage.credit && (
              <span className="absolute bottom-2 right-3 rounded bg-black/50 px-1.5 py-0.5 text-[10px] text-white/80">
                {heroImage.credit}
              </span>
            )}
          </div>
        )}

        {/* City facts strip (population, timezone, airport) */}
        {cityFacts.length > 0 && (
          <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {cityFacts.map((f) => (
              <div key={f.label} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-center shadow-sm">
                <dt className="text-xs uppercase tracking-wide text-[var(--muted)]">{f.label}</dt>
                <dd className="mt-1 font-semibold text-[var(--navy)]">{f.value}</dd>
              </div>
            ))}
          </dl>
        )}

        <section className="mt-10">
          <h2 className="mb-4 text-xl font-semibold text-[var(--navy)]">
            {exploreLabel[locale] ?? exploreLabel.en} {city.name}
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {intents.map((intent) => (
              <Link
                key={intent}
                href={`/${country.slug}/${city.slug}/${intent}`}
                className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm font-medium text-[var(--navy)] shadow-sm transition hover:border-[var(--gold)] hover:bg-[var(--gold-light)]"
              >
                {labels[intent]}
              </Link>
            ))}
          </div>
        </section>

        {itineraries.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-4 text-xl font-semibold text-[var(--navy)]">
              {{
                en: 'Suggested itineraries',
                ar: 'خطط سفر مقترحة',
                fr: 'Itinéraires suggérés',
                tr: 'Önerilen güzergahlar',
                es: 'Itinerarios sugeridos',
              }[locale] ?? 'Suggested itineraries'}
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {itineraries.map((itin) => (
                <Link
                  key={itin.id}
                  href={`/itineraries/${itin.slug}`}
                  className="group rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm transition hover:border-[var(--gold)] hover:shadow-md"
                >
                  <span className="text-xs font-medium text-[var(--gold)]">
                    {itin.durationDays}-day itinerary
                  </span>
                  <p className="mt-1 font-semibold text-[var(--navy)] group-hover:text-[var(--gold)] transition-colors">
                    {itin.title}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {pois.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-4 text-xl font-semibold text-[var(--navy)]">
              {attractionsLabel[locale] ?? attractionsLabel.en}
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {pois.map((poi) => (
                <Link
                  key={poi.id}
                  href={`/${country.slug}/${city.slug}/attractions/${poi.slug}`}
                  className="group rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm transition hover:border-[var(--gold)] hover:shadow-md"
                >
                  <p className="font-semibold text-[var(--navy)] group-hover:text-[var(--gold)] transition-colors">{poi.name}</p>
                  {poi.description && (
                    <p className="mt-1 line-clamp-2 text-sm text-[var(--muted)]">{poi.description}</p>
                  )}
                  {poi.priceRange && (
                    <span className="mt-3 inline-block rounded-full bg-[var(--navy-50)] px-2.5 py-0.5 text-xs font-medium text-[var(--navy)]">
                      {poi.priceRange}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Landmarks & places — from Wikidata (fame-ranked) */}
        {attractions.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-4 text-xl font-semibold text-[var(--navy)]">
              {landmarksLabel[locale] ?? landmarksLabel.en}
            </h2>
            <div className="flex flex-wrap gap-2">
              {attractions.map((a) => (
                <span
                  key={a.name}
                  className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-sm text-[var(--navy)] shadow-sm"
                  title={a.type ?? undefined}
                >
                  {a.name}
                </span>
              ))}
            </div>
            <p className="mt-2 text-[10px] text-[var(--muted)]">© Wikidata (CC0)</p>
          </section>
        )}
      </main>
    </>
  )
}
