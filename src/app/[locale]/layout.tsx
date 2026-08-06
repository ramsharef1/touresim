import type { Metadata } from 'next'
import { Cairo, Geist, Geist_Mono } from 'next/font/google'
import { notFound } from 'next/navigation'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { cookies } from 'next/headers'
import { routing } from '@/i18n/routing'
import { dirFor, isRtl } from '@/lib/locales'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { NationalityBanner } from '@/components/NationalityPicker'
import { NATIONALITY_COOKIE } from '@/lib/nationality'
import '../globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })
const cairo = Cairo({ variable: '--font-arabic', subsets: ['arabic', 'latin'] })

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })
  return {
    title: { default: t('siteName'), template: `%s · ${t('siteName')}` },
    description: t('description'),
    manifest: '/manifest.json',
    themeColor: '#0a1628',
    appleWebApp: {
      capable: true,
      statusBarStyle: 'black-translucent',
      title: 'Touresim',
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  const jar = await cookies()
  const nationality = jar.get(NATIONALITY_COOKIE)?.value ?? null

  const rtl = isRtl(locale)
  return (
    <html
      lang={locale}
      dir={dirFor(locale)}
      className={`${geistSans.variable} ${geistMono.variable} ${cairo.variable} h-full antialiased`}
    >
      <body
        className={`min-h-full flex flex-col bg-background text-foreground ${
          rtl ? 'font-[family-name:var(--font-arabic)]' : 'font-sans'
        }`}
      >
        <NextIntlClientProvider>
          <SiteHeader locale={locale} nationality={nationality} />
          {/* Show banner only on first visit (no nationality cookie yet) */}
          {!nationality && <NationalityBanner locale={locale} />}
          {children}
          <SiteFooter locale={locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
