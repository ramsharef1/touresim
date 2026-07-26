import { defineRouting } from 'next-intl/routing'
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from '@/lib/locales'

export const routing = defineRouting({
  locales: [...SUPPORTED_LOCALES],
  defaultLocale: DEFAULT_LOCALE,
  // English (default) has no prefix → `/`; other locales are prefixed → `/ar`, `/fr`…
  localePrefix: 'as-needed',
  // Disabled: `/` always renders English regardless of Accept-Language.
  localeDetection: false,
})
