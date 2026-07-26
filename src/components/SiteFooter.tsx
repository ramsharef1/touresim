import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'

export async function SiteFooter({ locale }: { locale: string }) {
  const t = await getTranslations('nav')
  const isAr = locale === 'ar'

  return (
    <footer className="mt-auto border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">

          {/* Brand */}
          <div className="flex flex-col gap-3 max-w-xs">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--navy)]">
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
              </div>
              <span className={`font-bold text-[var(--navy)] text-lg ${isAr ? 'font-[family-name:var(--font-arabic)]' : ''}`}>
                {isAr ? 'توريسم' : 'Touresim'}
              </span>
            </Link>
            <p className="text-sm leading-6 text-[var(--muted)]">
              {isAr
                ? 'دليلك الكامل للسفر حول العالم — معلومات موثوقة ودائمة لكل مسافر.'
                : 'Your complete guide to travel anywhere — trusted, evergreen guidance for every traveler.'}
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-16">
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-[var(--navy)]">
                {isAr ? 'استكشف' : 'Explore'}
              </p>
              <ul className="flex flex-col gap-3">
                <li><Link href="/destinations" className="text-sm text-[var(--muted)] hover:text-[var(--navy)] transition-colors">{t('destinations')}</Link></li>
                <li><Link href="/destinations" className="text-sm text-[var(--muted)] hover:text-[var(--navy)] transition-colors">{t('thingsToDo')}</Link></li>
                <li><Link href="/destinations" className="text-sm text-[var(--muted)] hover:text-[var(--navy)] transition-colors">{t('guides')}</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center gap-2 border-t border-[var(--border)] pt-6 sm:flex-row sm:justify-between">
          <p className="text-xs text-[var(--muted)]">
            © {new Date().getFullYear()} Touresim.{' '}
            {isAr ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
          </p>
          <div className="flex items-center gap-1">
            <div className="h-1 w-6 rounded-full bg-[var(--navy)]" />
            <div className="h-1 w-2 rounded-full bg-[var(--gold)]" />
          </div>
        </div>
      </div>
    </footer>
  )
}
