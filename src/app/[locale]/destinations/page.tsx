import { notFound } from 'next/navigation'
import { hasLocale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import Image from 'next/image'
import { routing } from '@/i18n/routing'
import { Link } from '@/i18n/navigation'
import { getAllCountries, getCountryHeroImage } from '@/lib/queries'
import type { Locale } from '@/lib/locales'
import type { Metadata } from 'next'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const titles: Record<string, string> = {
    ar: 'استكشف الوجهات السياحية حول العالم',
    en: 'Explore destinations around the world',
    fr: 'Explorez les destinations du monde',
    tr: 'Dünya genelindeki destinasyonları keşfedin',
    es: 'Explora destinos de todo el mundo',
  }
  return { title: titles[locale] ?? titles.en }
}

export default async function DestinationsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  const countries = await getAllCountries(locale as Locale)
  const images = await Promise.all(countries.map((c) => getCountryHeroImage(c.id)))

  const headings: Record<string, string> = {
    ar: 'استكشف الوجهات',
    en: 'Explore destinations',
    fr: 'Explorer les destinations',
    tr: 'Destinasyonları keşfet',
    es: 'Explorar destinos',
  }

  const subheadings: Record<string, string> = {
    en: `${countries.length} destinations worldwide`,
    ar: `${countries.length} وجهة حول العالم`,
    fr: `${countries.length} destinations dans le monde`,
    tr: `Dünya genelinde ${countries.length} destinasyon`,
    es: `${countries.length} destinos en el mundo`,
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-2 h-1 w-10 rounded-full bg-[var(--gold)]" />
      <h1 className="text-3xl font-bold text-[var(--navy)]">
        {headings[locale] ?? headings.en}
      </h1>
      <p className="mt-1 mb-8 text-sm text-[var(--muted)]">
        {subheadings[locale] ?? subheadings.en}
      </p>

      {countries.length === 0 ? (
        <p className="text-[var(--muted)]">No destinations available yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {countries.map((country, i) => {
            const img = images[i]
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
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
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
      )}
    </main>
  )
}
