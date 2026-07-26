import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { NationalityPill } from '@/components/NationalityPicker'
import { SearchBar } from '@/components/SearchBar'
import { MobileMenu } from '@/components/MobileMenu'

const LOCALE_LABELS: Record<string, string> = {
  ar: 'العربية',
  en: 'English',
  fr: 'Français',
  tr: 'Türkçe',
  es: 'Español',
}

const LOCALES = ['en', 'ar', 'fr', 'tr', 'es'] as const

export async function SiteHeader({ locale, nationality }: { locale: string; nationality: string | null }) {
  const t = await getTranslations('nav')
  const isRtl = locale === 'ar'

  const navLinks = [
    { href: '/destinations', label: t('destinations') },
    { href: '/destinations', label: t('thingsToDo') },
    { href: '/destinations', label: t('guides') },
  ]

  const localeLinks = LOCALES.map((l) => ({
    code: l,
    label: LOCALE_LABELS[l],
    href: l === 'en' ? '/' : `/${l}`,
  }))

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-md shadow-sm">
      <div className="relative mx-auto flex max-w-6xl items-center justify-between px-4 py-3">

        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2.5 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--navy)]">
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
          </div>
          <span className={`text-xl font-bold text-[var(--navy)] group-hover:text-[var(--gold)] transition-colors ${isRtl ? 'font-[family-name:var(--font-arabic)]' : ''}`}>
            {locale === 'ar' ? 'توريسم' : 'Touresim'}
          </span>
        </Link>

        {/* Search — center, hidden on mobile (shown in mobile drawer instead) */}
        <div className="hidden sm:block flex-1 mx-6 max-w-xs">
          <SearchBar locale={locale} />
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 lg:flex">
            <NavLink href="/destinations">{t('destinations')}</NavLink>
          </nav>

          {/* Nationality pill */}
          {nationality && <NationalityPill locale={locale} iso2={nationality} />}

          {/* Desktop locale switcher */}
          <div className="hidden sm:block">
            <LocaleSwitcher locale={locale} />
          </div>

          {/* Mobile hamburger + drawer */}
          <MobileMenu
            locale={locale}
            navLinks={navLinks}
            localeLinks={localeLinks}
            currentLocale={locale}
          />
        </div>
      </div>
    </header>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--muted)] transition-colors hover:bg-[var(--navy-50)] hover:text-[var(--navy)]"
    >
      {children}
    </Link>
  )
}

function LocaleSwitcher({ locale }: { locale: string }) {
  return (
    <div className="relative group">
      <button className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-white px-3 py-1.5 text-sm font-medium text-[var(--navy)] shadow-sm hover:border-[var(--gold)] transition-colors">
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0 text-[var(--muted)]">
          <path fillRule="evenodd" d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389c-.188-.196-.373-.396-.554-.6a19.098 19.098 0 01-3.107 3.567 1 1 0 01-1.334-1.49 17.087 17.087 0 003.13-3.733 18.992 18.992 0 01-1.487-2.494 1 1 0 111.79-.89c.234.47.489.928.764 1.372.417-.934.752-1.913.997-2.927H3a1 1 0 110-2h3V3a1 1 0 011-1zm6 6a1 1 0 01.894.553l2.991 5.982a.869.869 0 01.02.037l.99 1.98a1 1 0 11-1.79.895L15.383 16h-4.764l-.724 1.447a1 1 0 11-1.788-.894l.99-1.98.019-.038 2.99-5.982A1 1 0 0113 8zm-1.382 6h2.764L13 11.236 11.618 14z" clipRule="evenodd" />
        </svg>
        {LOCALE_LABELS[locale] ?? locale}
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3 shrink-0 text-[var(--muted)]">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
      <div className="absolute end-0 top-full mt-1 hidden w-40 rounded-xl border border-[var(--border)] bg-white py-1 shadow-lg group-focus-within:block group-hover:block">
        {LOCALES.map((l) => (
          <a
            key={l}
            href={l === 'en' ? '/' : `/${l}`}
            className={`block px-4 py-2 text-sm transition-colors hover:bg-[var(--navy-50)] ${l === locale ? 'font-semibold text-[var(--navy)]' : 'text-[var(--muted)]'}`}
          >
            {LOCALE_LABELS[l]}
          </a>
        ))}
      </div>
    </div>
  )
}
