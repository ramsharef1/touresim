import { hasLocale } from 'next-intl'
import { getRequestConfig } from 'next-intl/server'
import { LAUNCH_LOCALES } from '@/lib/locales'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale

  // Launch locales ship their own UI strings; supported-but-unpopulated
  // locales fall back to the English UI until translated.
  const messagesLocale = (LAUNCH_LOCALES as readonly string[]).includes(locale)
    ? locale
    : 'en'

  const messages = (await import(`../../messages/${messagesLocale}.json`)).default
  return { locale, messages }
})
