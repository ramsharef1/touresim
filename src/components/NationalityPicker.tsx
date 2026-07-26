'use client'

import { useState, useTransition } from 'react'
import { NATIONALITIES, NATIONALITY_COOKIE, NATIONALITY_COOKIE_MAX_AGE, getNationality } from '@/lib/nationality'
import { useRouter } from '@/i18n/navigation'

interface Props {
  locale: string
  current: string | null
}

const UI = {
  ar: {
    prompt: 'من أي بلد أنت؟',
    sub: 'نخصّص معلومات التأشيرة والمحتوى بناءً على جنسيتك.',
    skip: 'تخطّ',
    change: 'جنسيتك',
    search: 'ابحث عن دولتك…',
  },
  en: {
    prompt: 'Where are you from?',
    sub: 'We personalise visa info and content based on your nationality.',
    skip: 'Skip',
    change: 'Your nationality',
    search: 'Search your country…',
  },
  fr: {
    prompt: 'D\'où venez-vous ?',
    sub: 'Nous personnalisons les infos visa selon votre nationalité.',
    skip: 'Ignorer',
    change: 'Votre nationalité',
    search: 'Rechercher votre pays…',
  },
  tr: {
    prompt: 'Nereden geliyorsunuz?',
    sub: 'Vize bilgilerini milliyetinize göre kişiselleştiriyoruz.',
    skip: 'Atla',
    change: 'Milliyetiniz',
    search: 'Ülkenizi arayın…',
  },
  es: {
    prompt: '¿De dónde eres?',
    sub: 'Personalizamos la información de visado según tu nacionalidad.',
    skip: 'Omitir',
    change: 'Tu nacionalidad',
    search: 'Busca tu país…',
  },
} as const

function t(locale: string, key: keyof typeof UI['en']): string {
  return (UI[locale as keyof typeof UI] ?? UI.en)[key]
}

function setNationalityCookie(iso2: string) {
  document.cookie = `${NATIONALITY_COOKIE}=${iso2}; max-age=${NATIONALITY_COOKIE_MAX_AGE}; path=/; SameSite=Lax`
}

function clearNationalityCookie() {
  document.cookie = `${NATIONALITY_COOKIE}=; max-age=0; path=/`
}

// ---- Banner shown on first visit ----
export function NationalityBanner({ locale }: { locale: string }) {
  const [dismissed, setDismissed] = useState(false)
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const [, startTransition] = useTransition()

  if (dismissed) return null

  function pick(iso2: string) {
    setNationalityCookie(iso2)
    setDismissed(true)
    setOpen(false)
    startTransition(() => router.refresh())
  }

  function skip() {
    setDismissed(true)
    clearNationalityCookie()
  }

  return (
    <>
      {/* Banner */}
      <div className="border-b border-[var(--border)] bg-[var(--navy-50)] px-4 py-3">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-[var(--navy)]">
            <span className="text-base">🌍</span>
            <span className="font-medium">{t(locale, 'prompt')}</span>
            <span className="hidden text-[var(--muted)] sm:inline">— {t(locale, 'sub')}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setOpen(true)}
              className="rounded-lg bg-[var(--navy)] px-4 py-1.5 text-sm font-medium text-white transition hover:bg-[var(--navy-700)]"
            >
              {t(locale, 'prompt')}
            </button>
            <button
              onClick={skip}
              className="text-sm text-[var(--muted)] hover:text-[var(--navy)] transition-colors"
            >
              {t(locale, 'skip')}
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {open && <NationalityModal locale={locale} onPick={pick} onClose={() => setOpen(false)} />}
    </>
  )
}

// ---- Header pill (shows current nationality, allows change) ----
export function NationalityPill({ locale, iso2 }: { locale: string; iso2: string }) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const [, startTransition] = useTransition()
  const n = getNationality(iso2)

  function pick(newIso2: string) {
    setNationalityCookie(newIso2)
    setOpen(false)
    startTransition(() => router.refresh())
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-white px-2.5 py-1.5 text-sm font-medium text-[var(--navy)] shadow-sm hover:border-[var(--gold)] transition-colors"
        title={t(locale, 'change')}
      >
        <span>{n?.flag ?? '🌍'}</span>
        <span className="hidden sm:inline">{n?.iso2}</span>
      </button>
      {open && <NationalityModal locale={locale} onPick={pick} onClose={() => setOpen(false)} />}
    </>
  )
}

// ---- Shared modal ----
function NationalityModal({
  locale,
  onPick,
  onClose,
}: {
  locale: string
  onPick: (iso2: string) => void
  onClose: () => void
}) {
  const [query, setQuery] = useState('')
  const labelKey = (locale in UI ? locale : 'en') as keyof typeof UI

  const filtered = NATIONALITIES.filter((n) => {
    if (!query) return true
    const q = query.toLowerCase()
    return (
      n.iso2.toLowerCase().includes(q) ||
      n.en.toLowerCase().includes(q) ||
      ((n as Record<string, string>)[locale] ?? '').toLowerCase().includes(q)
    )
  })

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-[var(--border)] px-5 py-4">
          <h2 className="font-bold text-[var(--navy)]">{t(locale, 'prompt')}</h2>
          <p className="mt-0.5 text-sm text-[var(--muted)]">{t(locale, 'sub')}</p>
        </div>

        {/* Search */}
        <div className="border-b border-[var(--border)] px-4 py-3">
          <input
            autoFocus
            type="text"
            placeholder={t(locale, 'search')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-[var(--navy)]"
            dir={locale === 'ar' ? 'rtl' : 'ltr'}
          />
        </div>

        {/* List */}
        <div className="max-h-72 overflow-y-auto py-1">
          {filtered.map((n) => (
            <button
              key={n.iso2}
              onClick={() => onPick(n.iso2)}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm hover:bg-[var(--navy-50)] transition-colors"
            >
              <span className="text-xl">{n.flag}</span>
              <span className="font-medium text-[var(--navy)]">
                {(n as Record<string, string>)[labelKey] ?? n.en}
              </span>
              <span className="ms-auto text-xs text-[var(--muted)]">{n.iso2}</span>
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="px-4 py-6 text-center text-sm text-[var(--muted)]">No results</p>
          )}
        </div>
      </div>
    </div>
  )
}
