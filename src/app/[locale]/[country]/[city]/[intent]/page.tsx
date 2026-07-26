import { notFound } from 'next/navigation'
import { hasLocale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import Image from 'next/image'
import { routing } from '@/i18n/routing'
import { Link } from '@/i18n/navigation'
import {
  getCityBySlug,
  getCountryForCity,
  getIntentPage,
  getPoisForCity,
  getCityHeroImage,
} from '@/lib/queries'
import { generateIntentPage, type IntentType } from '@/lib/generate'
import { JsonLd, breadcrumbJsonLd, canonicalUrl } from '@/lib/seo'
import { intentTypeValues } from '@/db/schema'
import type { Locale } from '@/lib/locales'

type Props = {
  params: Promise<{ locale: string; country: string; city: string; intent: string }>
}

const VALID_INTENTS = new Set(intentTypeValues)

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, city: citySlug, intent } = await params
  if (!VALID_INTENTS.has(intent as never)) return {}

  const city = await getCityBySlug(citySlug, locale as Locale)
  if (!city) return {}

  const intentPage = await getIntentPage('city', city.id, intent, locale as Locale)

  // AI-generated pages are noindex until reviewed — reflect that in meta
  const indexStatus = intentPage?.indexStatus ?? 'noindex'
  const title = intentPage?.title ?? `${intent.replace(/-/g, ' ')} — ${city.name}`

  return {
    title,
    robots: indexStatus === 'indexed' ? 'index,follow' : 'noindex,nofollow',
  }
}

export default async function IntentPage({ params }: Props) {
  const { locale, country: countrySlug, city: citySlug, intent } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  if (!VALID_INTENTS.has(intent as never)) notFound()

  const city = await getCityBySlug(citySlug, locale as Locale)
  if (!city || city.indexStatus === 'draft') notFound()

  const country = await getCountryForCity(city.id, locale as Locale)
  if (!country) notFound()

  let intentPage = await getIntentPage('city', city.id, intent, locale as Locale)

  // If no content in DB, generate on-demand with Claude and persist for future visitors
  if (!intentPage) {
    const generated = await generateIntentPage({
      cityId: city.id,
      cityName: city.name,
      countryName: country.name,
      intentType: intent as IntentType,
      locale,
    })
    if (generated) {
      intentPage = { title: generated.title, body: generated.body, indexStatus: 'noindex', locale, slug: '', id: 0 }
    }
  }

  // Show the page shell even without intentPage content — useful while populating
  const pois = intent === 'things-to-do' ? await getPoisForCity(city.id, locale as Locale) : []
  const heroImage = await getCityHeroImage(city.id)

  const cityUrl = canonicalUrl(locale as Locale, countrySlug, city.slug)
  const countryUrl = canonicalUrl(locale as Locale, country.slug)
  const pageUrl = canonicalUrl(locale as Locale, countrySlug, city.slug, intent)

  const intentTitles: Record<string, Record<string, string>> = {
    'things-to-do': {
      ar: `أشياء للقيام بها في ${city.name}`,
      en: `Things to do in ${city.name}`,
      fr: `Que faire à ${city.name}`,
      tr: `${city.name}'da yapılacaklar`,
      es: `Qué hacer en ${city.name}`,
    },
    'where-to-stay': {
      ar: `أماكن الإقامة في ${city.name}`,
      en: `Where to stay in ${city.name}`,
      fr: `Où séjourner à ${city.name}`,
      tr: `${city.name}'da nerede kalınır`,
      es: `Dónde alojarse en ${city.name}`,
    },
    'best-time-to-visit': {
      ar: `أفضل وقت لزيارة ${city.name}`,
      en: `Best time to visit ${city.name}`,
      fr: `Meilleure période pour visiter ${city.name}`,
      tr: `${city.name}'ı ziyaret için en iyi zaman`,
      es: `Mejor época para visitar ${city.name}`,
    },
    'getting-around': {
      ar: `كيفية التنقل في ${city.name}`,
      en: `Getting around ${city.name}`,
      fr: `Se déplacer à ${city.name}`,
      tr: `${city.name}'da ulaşım`,
      es: `Cómo moverse por ${city.name}`,
    },
    food: {
      ar: `الطعام في ${city.name}`,
      en: `Food & drink in ${city.name}`,
      fr: `Gastronomie à ${city.name}`,
      tr: `${city.name}'da yiyecek & içecek`,
      es: `Gastronomía en ${city.name}`,
    },
    budget: {
      ar: `الميزانية والتكاليف في ${city.name}`,
      en: `Budget & costs in ${city.name}`,
      fr: `Budget et coûts à ${city.name}`,
      tr: `${city.name}'da bütçe ve maliyetler`,
      es: `Presupuesto y costos en ${city.name}`,
    },
    safety: {
      ar: `الأمان في ${city.name}`,
      en: `Safety in ${city.name}`,
      fr: `Sécurité à ${city.name}`,
      tr: `${city.name}'da güvenlik`,
      es: `Seguridad en ${city.name}`,
    },
    weather: {
      ar: `طقس ${city.name}`,
      en: `${city.name} weather`,
      fr: `Météo à ${city.name}`,
      tr: `${city.name} hava durumu`,
      es: `Clima en ${city.name}`,
    },
    itineraries: {
      ar: `خطط رحلات ${city.name}`,
      en: `${city.name} itineraries`,
      fr: `Itinéraires à ${city.name}`,
      tr: `${city.name} gezi planları`,
      es: `Itinerarios en ${city.name}`,
    },
    visa: {
      ar: `تأشيرة ${country.name}`,
      en: `${country.name} visa`,
      fr: `Visa pour ${country.name}`,
      tr: `${country.name} vizesi`,
      es: `Visado para ${country.name}`,
    },
  }

  const title =
    intentPage?.title ??
    (intentTitles[intent]?.[locale] ?? intentTitles[intent]?.en ?? city.name)

  // Short labels for the sibling-intent navigation chips.
  const siblingLabels: Record<string, Record<string, string>> = {
    'things-to-do': { ar: 'أشياء للقيام بها', en: 'Things to do', fr: 'Que faire', tr: 'Yapılacaklar', es: 'Qué hacer' },
    'where-to-stay': { ar: 'أماكن الإقامة', en: 'Where to stay', fr: 'Où séjourner', tr: 'Nerede kalınır', es: 'Dónde alojarse' },
    'best-time-to-visit': { ar: 'أفضل وقت', en: 'Best time', fr: 'Quand partir', tr: 'En iyi zaman', es: 'Mejor época' },
    'getting-around': { ar: 'التنقل', en: 'Getting around', fr: 'Se déplacer', tr: 'Ulaşım', es: 'Cómo moverse' },
    food: { ar: 'الطعام', en: 'Food & drink', fr: 'Gastronomie', tr: 'Yeme içme', es: 'Gastronomía' },
    budget: { ar: 'الميزانية', en: 'Budget', fr: 'Budget', tr: 'Bütçe', es: 'Presupuesto' },
    safety: { ar: 'الأمان', en: 'Safety', fr: 'Sécurité', tr: 'Güvenlik', es: 'Seguridad' },
    weather: { ar: 'الطقس', en: 'Weather', fr: 'Météo', tr: 'Hava durumu', es: 'Clima' },
    visa: { ar: 'التأشيرة', en: 'Visa', fr: 'Visa', tr: 'Vize', es: 'Visado' },
  }
  const siblingOrder = ['things-to-do', 'where-to-stay', 'best-time-to-visit', 'getting-around', 'food', 'budget', 'safety', 'weather', 'visa']
  const moreHeading: Record<string, string> = { ar: `المزيد عن ${city.name}`, en: `More about ${city.name}`, fr: `Plus sur ${city.name}`, tr: `${city.name} hakkında daha fazlası`, es: `Más sobre ${city.name}` }

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: country.name, url: countryUrl },
          { name: city.name, url: cityUrl },
          { name: title, url: pageUrl },
        ])}
      />

      {/* Hero */}
      {heroImage && (
        <div className="relative h-56 w-full overflow-hidden sm:h-72">
          <Image src={heroImage.url} alt={title} fill className="object-cover" priority sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="mx-auto max-w-4xl">
              <nav className="mb-2 flex flex-wrap items-center gap-1.5 text-sm text-white/80">
                <Link href={`/${country.slug}`} className="hover:text-white">{country.name}</Link>
                <span aria-hidden>›</span>
                <Link href={`/${country.slug}/${city.slug}`} className="hover:text-white">{city.name}</Link>
              </nav>
              <h1 className="text-3xl font-bold text-white drop-shadow sm:text-4xl">{title}</h1>
            </div>
          </div>
        </div>
      )}

      <main className="mx-auto max-w-4xl px-4 py-10">
        {/* Header — only if no hero */}
        {!heroImage && (
          <>
            <nav className="mb-4 flex flex-wrap items-center gap-1.5 text-sm text-[var(--muted)]">
              <Link href={`/${country.slug}`} className="hover:text-[var(--navy)]">{country.name}</Link>
              <span aria-hidden>›</span>
              <Link href={`/${country.slug}/${city.slug}`} className="hover:text-[var(--navy)]">{city.name}</Link>
            </nav>
            <div className="mb-2 h-1 w-10 rounded-full bg-[var(--gold)]" />
            <h1 className="text-4xl font-bold text-[var(--navy)]">{title}</h1>
          </>
        )}

        {/* Body content */}
        {intentPage?.body && (
          <article
            className="mt-8 max-w-none leading-7 text-[var(--foreground)] [&_p]:mb-4 [&_p]:leading-7 [&_h3]:mt-8 [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-[var(--navy)] [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:ps-5 [&_li]:mb-1 [&_a]:text-[var(--navy)] [&_a]:underline"
            dangerouslySetInnerHTML={{ __html: intentPage.body }}
          />
        )}

        {/* Things-to-do: show POIs */}
        {intent === 'things-to-do' && pois.length > 0 && (
          <section className="mt-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {pois.map((poi) => (
                <Link
                  key={poi.id}
                  href={`/${country.slug}/${city.slug}/attractions/${poi.slug}`}
                  className="group rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm transition hover:border-[var(--gold)] hover:shadow-md"
                >
                  <p className="font-semibold text-[var(--navy)] transition-colors group-hover:text-[var(--gold)]">{poi.name}</p>
                  {poi.description && (
                    <p className="mt-1 line-clamp-2 text-sm text-[var(--muted)]">{poi.description}</p>
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Placeholder when no content yet */}
        {!intentPage?.body && !(intent === 'things-to-do' && pois.length > 0) && (
          <div className="mt-8 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center text-[var(--muted)] shadow-sm">
            {locale === 'ar' ? 'المحتوى قيد الإعداد.' : 'Content coming soon.'}
          </div>
        )}

        {/* Sibling-intent navigation */}
        <section className="mt-12 border-t border-[var(--border)] pt-8">
          <h2 className="mb-4 text-lg font-semibold text-[var(--navy)]">{moreHeading[locale] ?? moreHeading.en}</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {siblingOrder
              .filter((s) => s !== intent)
              .map((s) => (
                <Link
                  key={s}
                  href={`/${country.slug}/${city.slug}/${s}`}
                  className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm font-medium text-[var(--navy)] shadow-sm transition hover:border-[var(--gold)] hover:bg-[var(--gold-light)]"
                >
                  {siblingLabels[s]?.[locale] ?? siblingLabels[s]?.en ?? s}
                </Link>
              ))}
          </div>
        </section>
      </main>
    </>
  )
}
