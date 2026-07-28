import { notFound } from 'next/navigation'
import { hasLocale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { cookies } from 'next/headers'
import type { Metadata } from 'next'
import { routing } from '@/i18n/routing'
import { Link } from '@/i18n/navigation'
import Image from 'next/image'
import {
  getCountryBySlug,
  getCitiesForCountry,
  getVisaRequirement,
  getCountryHeroImage,
  getCountryHolidays,
  getHeritageSites,
  getCountryHighlights,
  getCurrency,
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

type Props = { params: Promise<{ locale: string; country: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, country: countrySlug } = await params
  const country = await getCountryBySlug(countrySlug, locale as Locale)
  if (!country) return {}

  return {
    title: country.name,
    description: country.description ?? undefined,
    alternates: buildAlternates(country.allTranslations, (_l, slug) => `/${slug}`),
    robots: robotsDirective(country.indexStatus, country.completenessScore),
  }
}

export default async function CountryPage({ params }: Props) {
  const { locale, country: countrySlug } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  const country = await getCountryBySlug(countrySlug, locale as Locale)
  if (!country) notFound()

  if (country.indexStatus === 'draft') notFound()

  const jar = await cookies()
  const passportIso2 = jar.get(NATIONALITY_COOKIE)?.value ?? null

  const [cities, visaReq, heroImage, holidays, heritageSites, highlights, currency] = await Promise.all([
    getCitiesForCountry(country.id, locale as Locale),
    passportIso2 ? getVisaRequirement(passportIso2, country.id) : Promise.resolve(null),
    getCountryHeroImage(country.id),
    getCountryHolidays(country.id, locale as Locale),
    getHeritageSites(country.id),
    getCountryHighlights(country.id),
    getCurrency(country.currencyCode),
  ])

  const url = canonicalUrl(locale as Locale, country.slug)

  const intentLabels: Record<string, Record<string, string>> = {
    ar: {
      'things-to-do': 'أشياء للقيام بها',
      'where-to-stay': 'أماكن الإقامة',
      'best-time-to-visit': 'أفضل وقت للزيارة',
      visa: 'تأشيرة الدخول',
      safety: 'الأمان',
      weather: 'الطقس',
      food: 'الطعام',
      budget: 'الميزانية',
    },
    en: {
      'things-to-do': 'Things to do',
      'where-to-stay': 'Where to stay',
      'best-time-to-visit': 'Best time to visit',
      visa: 'Visa',
      safety: 'Safety',
      weather: 'Weather',
      food: 'Food & drink',
      budget: 'Budget',
    },
    fr: {
      'things-to-do': 'Que faire',
      'where-to-stay': 'Où séjourner',
      'best-time-to-visit': 'Meilleure période',
      visa: 'Visa',
      safety: 'Sécurité',
      weather: 'Météo',
      food: 'Gastronomie',
      budget: 'Budget',
    },
    tr: {
      'things-to-do': 'Yapılacaklar',
      'where-to-stay': 'Nerede kalınır',
      'best-time-to-visit': 'En iyi ziyaret zamanı',
      visa: 'Vize',
      safety: 'Güvenlik',
      weather: 'Hava durumu',
      food: 'Yiyecek & içecek',
      budget: 'Bütçe',
    },
    es: {
      'things-to-do': 'Qué hacer',
      'where-to-stay': 'Dónde alojarse',
      'best-time-to-visit': 'Mejor época',
      visa: 'Visado',
      safety: 'Seguridad',
      weather: 'Clima',
      food: 'Gastronomía',
      budget: 'Presupuesto',
    },
  }

  const labels = intentLabels[locale] ?? intentLabels.en
  const intents = Object.keys(labels)

  const cityHeadings: Record<string, string> = {
    ar: 'المدن الرئيسية',
    en: 'Major cities',
    fr: 'Villes principales',
    tr: 'Başlıca şehirler',
    es: 'Ciudades principales',
  }

  const exploreHeadings: Record<string, string> = {
    ar: 'استكشف',
    en: 'Explore',
    fr: 'Explorer',
    tr: 'Keşfet',
    es: 'Explorar',
  }

  const t = (m: Record<string, string>) => m[locale] ?? m.en
  const factLabels = {
    capital: { ar: 'العاصمة', en: 'Capital', fr: 'Capitale', tr: 'Başkent', es: 'Capital' },
    population: { ar: 'عدد السكان', en: 'Population', fr: 'Population', tr: 'Nüfus', es: 'Población' },
    area: { ar: 'المساحة', en: 'Area', fr: 'Superficie', tr: 'Yüzölçümü', es: 'Superficie' },
    languages: { ar: 'اللغات', en: 'Languages', fr: 'Langues', tr: 'Diller', es: 'Idiomas' },
    currency: { ar: 'العملة', en: 'Currency', fr: 'Monnaie', tr: 'Para birimi', es: 'Moneda' },
    gdp: { ar: 'الناتج المحلي', en: 'GDP', fr: 'PIB', tr: 'GSYİH', es: 'PIB' },
  }
  const goodToKnowHeading = { ar: 'معلومات مفيدة', en: 'Good to know', fr: 'Bon à savoir', tr: 'Bilinmesi gerekenler', es: 'Información útil' }
  const guideHeading = { ar: 'دليل السفر', en: 'Travel guide', fr: 'Guide de voyage', tr: 'Seyahat rehberi', es: 'Guía de viaje' }
  const gtkLabels = {
    driving: { ar: 'جانب القيادة', en: 'Driving side', fr: 'Conduite', tr: 'Trafik yönü', es: 'Lado de conducción' },
    dish: { ar: 'الطبق الوطني', en: 'National dish', fr: 'Plat national', tr: 'Ulusal yemek', es: 'Plato nacional' },
    police: { ar: 'الشرطة', en: 'Police', fr: 'Police', tr: 'Polis', es: 'Policía' },
    ambulance: { ar: 'الإسعاف', en: 'Ambulance', fr: 'Ambulance', tr: 'Ambulans', es: 'Ambulancia' },
    fire: { ar: 'الإطفاء', en: 'Fire', fr: 'Pompiers', tr: 'İtfaiye', es: 'Bomberos' },
    visitors: { ar: 'الزوار سنويًا', en: 'Annual visitors', fr: 'Visiteurs / an', tr: 'Yıllık ziyaretçi', es: 'Visitantes anuales' },
    safety: { ar: 'الأمان', en: 'Safety', fr: 'Sécurité', tr: 'Güvenlik', es: 'Seguridad' },
    bigmac: { ar: 'سعر بيج ماك', en: 'Big Mac', fr: 'Big Mac', tr: 'Big Mac', es: 'Big Mac' },
    religion: { ar: 'الديانة', en: 'Religion', fr: 'Religion', tr: 'Din', es: 'Religión' },
    avgtemp: { ar: 'متوسط الحرارة', en: 'Avg temp', fr: 'Temp. moyenne', tr: 'Ort. sıcaklık', es: 'Temp. media' },
    coast: { ar: 'الساحل', en: 'Coast', fr: 'Littoral', tr: 'Kıyı', es: 'Costa' },
  }
  const coastValue = {
    yes: { ar: 'نعم', en: 'Coastal', fr: 'Littoral', tr: 'Kıyı var', es: 'Con costa' },
    no: { ar: 'حبيس', en: 'Landlocked', fr: 'Sans littoral', tr: 'Denize kıyısı yok', es: 'Sin litoral' },
  }
  const safetyBand = (rate: number) => {
    if (rate < 1) return { ar: 'منخفض جدًا', en: 'Very low', fr: 'Très faible', tr: 'Çok düşük', es: 'Muy bajo' }
    if (rate < 3) return { ar: 'منخفض', en: 'Low', fr: 'Faible', tr: 'Düşük', es: 'Bajo' }
    if (rate < 8) return { ar: 'متوسط', en: 'Moderate', fr: 'Modéré', tr: 'Orta', es: 'Moderado' }
    return { ar: 'مرتفع', en: 'Elevated', fr: 'Élevé', tr: 'Yüksek', es: 'Elevado' }
  }
  const drivingValue: Record<string, Record<string, string>> = {
    left: { ar: 'يسار', en: 'Left', fr: 'À gauche', tr: 'Sol', es: 'Izquierda' },
    right: { ar: 'يمين', en: 'Right', fr: 'À droite', tr: 'Sağ', es: 'Derecha' },
  }
  const holidaysHeading = { ar: 'العطل الرسمية', en: 'Public holidays', fr: 'Jours fériés', tr: 'Resmi tatiller', es: 'Días festivos' }
  const heritageHeading = { ar: 'مواقع التراث العالمي لليونسكو', en: 'UNESCO World Heritage Sites', fr: 'Sites du patrimoine mondial', tr: 'UNESCO Dünya Mirası', es: 'Patrimonio de la Humanidad' }
  const highlightsHeading = { ar: 'أبرز المعالم', en: 'Highlights', fr: 'À ne pas manquer', tr: 'Öne çıkanlar', es: 'Lo más destacado' }
  const monthNames = {
    en: ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    ar: ['', 'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
    fr: ['', 'janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
    tr: ['', 'Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'],
    es: ['', 'ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
  }
  const months = monthNames[locale as keyof typeof monthNames] ?? monthNames.en
  const fmtNum = (n: number | null) => (n == null ? null : new Intl.NumberFormat(locale === 'ar' ? 'ar' : locale).format(n))
  const currencyValue = currency?.name
    ? `${currency.name}${currency.symbol ? ` (${currency.symbol})` : ''}`
    : [country.currencyCode, country.currencySymbol].filter(Boolean).join(' ')
  const facts = [
    country.capital && { label: t(factLabels.capital), value: country.capital },
    country.population && { label: t(factLabels.population), value: fmtNum(country.population) },
    country.areaSqKm && { label: t(factLabels.area), value: `${fmtNum(country.areaSqKm)} km²` },
    country.languages && { label: t(factLabels.languages), value: country.languages },
    (currency?.name || country.currencySymbol || country.currencyCode) && {
      label: t(factLabels.currency),
      value: currencyValue,
    },
    country.gdp && { label: t(factLabels.gdp), value: `$${fmtNum(country.gdp)}M` },
  ].filter(Boolean) as { label: string; value: string }[]

  const emergency = [
    country.emergencyPolice && { label: t(gtkLabels.police), value: country.emergencyPolice },
    country.emergencyAmbulance && { label: t(gtkLabels.ambulance), value: country.emergencyAmbulance },
    country.emergencyFire && { label: t(gtkLabels.fire), value: country.emergencyFire },
  ].filter(Boolean) as { label: string; value: string }[]
  const goodToKnow = [
    country.drivingSide && {
      label: t(gtkLabels.driving),
      value: t(drivingValue[country.drivingSide] ?? { en: country.drivingSide }),
    },
    country.nationalDish && { label: t(gtkLabels.dish), value: country.nationalDish },
    country.touristArrivals && {
      label: t(gtkLabels.visitors),
      value: `${fmtNum(country.touristArrivals)}${country.touristArrivalsYear ? ` (${country.touristArrivalsYear})` : ''}`,
    },
    country.homicideRate != null && {
      label: t(gtkLabels.safety),
      value: `${t(safetyBand(Number(country.homicideRate)))} (${Number(country.homicideRate)}/100k)`,
    },
    country.bigMacUsd != null && {
      label: t(gtkLabels.bigmac),
      value: `$${Number(country.bigMacUsd).toFixed(2)}`,
    },
    country.avgTempC != null && {
      label: t(gtkLabels.avgtemp),
      value: `${Number(country.avgTempC).toFixed(1)}°C`,
    },
    country.religion && { label: t(gtkLabels.religion), value: country.religion },
    country.landlocked != null && {
      label: t(gtkLabels.coast),
      value: t(country.landlocked ? coastValue.no : coastValue.yes),
    },
  ].filter(Boolean) as { label: string; value: string }[]

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: country.name, url },
        ])}
      />
      <JsonLd
        data={touristDestinationJsonLd({
          name: country.name,
          description: country.description,
          url,
        })}
      />

      {/* Hero image */}
      {heroImage && (
        <div className="relative h-64 w-full overflow-hidden sm:h-80 md:h-96">
          <Image
            src={heroImage.url}
            alt={country.name}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="mx-auto max-w-4xl">
              <div className="mb-2 h-1 w-10 rounded-full bg-[var(--gold)]" />
              <h1 className="text-4xl font-bold text-white drop-shadow">{country.name}</h1>
            </div>
          </div>
          {heroImage.credit && (
            <p className="absolute bottom-2 end-3 text-[10px] text-white/50">
              Photo: {heroImage.credit} / Unsplash
            </p>
          )}
        </div>
      )}

      <main className="mx-auto max-w-4xl px-4 py-12">
        {/* Header — only show if no hero image */}
        {!heroImage && (
          <>
            <div className="mb-2 h-1 w-10 rounded-full bg-[var(--gold)]" />
            <h1 className="text-4xl font-bold text-[var(--navy)]">{country.name}</h1>
          </>
        )}
        {country.description && (
          <p className="mt-4 text-lg leading-8 text-[var(--muted)]">
            {country.description}
          </p>
        )}

        {/* Country facts strip (from dr5hn countries dataset) */}
        {facts.length > 0 && (
          <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {facts.map((f) => (
              <div key={f.label} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-center shadow-sm">
                <dt className="text-xs uppercase tracking-wide text-[var(--muted)]">{f.label}</dt>
                <dd className="mt-1 font-semibold text-[var(--navy)]">{f.value}</dd>
              </div>
            ))}
          </dl>
        )}

        {/* Good to know (driving side, national dish, emergency numbers, visitors) */}
        {(goodToKnow.length > 0 || emergency.length > 0) && (
          <section className="mt-8 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
            <h2 className="mb-3 font-semibold text-[var(--navy)]">{t(goodToKnowHeading)}</h2>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
              {goodToKnow.map((g) => (
                <div key={g.label}>
                  <p className="text-xs uppercase tracking-wide text-[var(--muted)]">{g.label}</p>
                  <p className="text-sm font-medium text-[var(--navy)]">{g.value}</p>
                </div>
              ))}
              {emergency.length > 0 && (
                <div className="col-span-2 sm:col-span-3">
                  <p className="text-xs uppercase tracking-wide text-[var(--muted)]">☎ {emergency.map((e) => `${e.label} ${e.value}`).join('  ·  ')}</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Travel guide intro (Wikivoyage, CC BY-SA) */}
        {country.travelGuide && (
          <section className="mt-8">
            <h2 className="mb-2 font-semibold text-[var(--navy)]">{t(guideHeading)}</h2>
            <p className="text-sm leading-7 text-[var(--muted)]">{country.travelGuide}</p>
            <p className="mt-1 text-[10px] text-[var(--muted)]">
              ©{' '}
              <a
                href={`https://en.wikivoyage.org/wiki/${encodeURIComponent(country.name)}`}
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="underline"
              >
                Wikivoyage
              </a>{' '}
              (CC BY-SA)
            </p>
          </section>
        )}

        {/* Intent cluster links */}
        <section className="mt-10">
          <h2 className="mb-4 text-xl font-semibold text-[var(--navy)]">
            {exploreHeadings[locale] ?? exploreHeadings.en} {country.name}
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {intents.map((intent) => (
              <Link
                key={intent}
                href={`/${country.slug}/${intent}`}
                className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm font-medium text-[var(--navy)] shadow-sm transition hover:border-[var(--gold)] hover:bg-[var(--gold-light)]"
              >
                {labels[intent]}
              </Link>
            ))}
          </div>
        </section>

        {/* Best time summary */}
        {country.bestTimeSummary && (
          <section className="mt-10">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
              <h3 className="mb-2 font-semibold text-[var(--navy)]">
                {labels['best-time-to-visit']}
              </h3>
              <p className="text-sm leading-6 text-[var(--muted)]">{country.bestTimeSummary}</p>
            </div>
          </section>
        )}

        {/* Visa info — personalized if nationality cookie set, generic fallback */}
        <section className="mt-6">
          <h3 className="font-semibold text-[var(--navy)]">{labels['visa']}</h3>
          {passportIso2 ? (
            <VisaBlock passportIso2={passportIso2} visa={visaReq} locale={locale} />
          ) : (
            country.visaSummary && (
              <div className="mt-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
                <p className="text-sm leading-6 text-[var(--muted)]">{country.visaSummary}</p>
              </div>
            )
          )}
        </section>

        {/* Highlights (top attractions) */}
        {highlights.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-4 text-xl font-semibold text-[var(--navy)]">{t(highlightsHeading)}</h2>
            {highlights.map((h) => (
              <div key={h.title} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
                <p className="text-sm leading-7 text-[var(--muted)]">{h.body}</p>
              </div>
            ))}
          </section>
        )}

        {/* Public holidays (from date-holidays dataset) */}
        {holidays.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-4 text-xl font-semibold text-[var(--navy)]">{t(holidaysHeading)}</h2>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {holidays.map((h, i) => (
                <div
                  key={`${h.name}-${i}`}
                  className="flex items-center justify-between gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm shadow-sm"
                >
                  <span className="text-[var(--navy)]">{h.name}</span>
                  {h.month != null && (
                    <span className="shrink-0 text-xs font-medium text-[var(--muted)]">
                      {months[h.month]}{h.day != null ? ` ${h.day}` : ''}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* UNESCO World Heritage Sites (from Wikidata) */}
        {heritageSites.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-4 text-xl font-semibold text-[var(--navy)]">
              {t(heritageHeading)} <span className="text-base font-normal text-[var(--muted)]">({heritageSites.length})</span>
            </h2>
            <div className="flex flex-wrap gap-2">
              {heritageSites.map((s) => (
                <span
                  key={s.name}
                  className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-sm text-[var(--navy)] shadow-sm"
                >
                  {s.name}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Cities */}
        {cities.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-4 text-xl font-semibold text-[var(--navy)]">
              {cityHeadings[locale] ?? cityHeadings.en}
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {cities.map((city) => (
                <Link
                  key={city.id}
                  href={`/${country.slug}/${city.slug}`}
                  className="group rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm transition hover:border-[var(--gold)] hover:shadow-md"
                >
                  <p className="font-semibold text-[var(--navy)] group-hover:text-[var(--gold)] transition-colors">{city.name}</p>
                  {city.description && (
                    <p className="mt-1 line-clamp-2 text-xs text-[var(--muted)]">{city.description}</p>
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  )
}
