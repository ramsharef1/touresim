'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from '@/i18n/navigation'

interface Result {
  id: number
  name: string
  slug: string
  description: string | null
}

const PLACEHOLDERS: Record<string, string> = {
  en: 'Search destinations…',
  ar: 'ابحث عن وجهة…',
  fr: 'Rechercher une destination…',
  tr: 'Destinasyon ara…',
  es: 'Buscar destino…',
}

export function SearchBar({ locale }: { locale: string }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Result[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    if (query.length < 2) { setResults([]); setOpen(false); return }
    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&locale=${locale}`)
        const data = await res.json()
        setResults(data)
        setOpen(data.length > 0)
      } finally {
        setLoading(false)
      }
    }, 200)
    return () => clearTimeout(timer)
  }, [query, locale])

  function go(slug: string) {
    setQuery('')
    setOpen(false)
    router.push(`/${slug}`)
  }

  return (
    <div ref={ref} className="relative w-full max-w-xs">
      <div className="relative">
        <svg
          className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted)] pointer-events-none"
          viewBox="0 0 20 20" fill="currentColor"
        >
          <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder={PLACEHOLDERS[locale] ?? PLACEHOLDERS.en}
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] ps-9 pe-3 py-2 text-sm outline-none transition focus:border-[var(--navy)] placeholder:text-[var(--muted)]"
          dir={locale === 'ar' ? 'rtl' : 'ltr'}
        />
        {loading && (
          <div className="absolute end-3 top-1/2 -translate-y-1/2 h-3 w-3 animate-spin rounded-full border border-[var(--navy)] border-t-transparent" />
        )}
      </div>

      {open && results.length > 0 && (
        <div className="absolute start-0 top-full z-50 mt-1 w-full rounded-xl border border-[var(--border)] bg-white py-1 shadow-xl">
          {results.map((r) => (
            <button
              key={r.id}
              onMouseDown={() => go(r.slug)}
              className="flex w-full flex-col px-4 py-2.5 text-start hover:bg-[var(--navy-50)] transition-colors"
            >
              <span className="text-sm font-medium text-[var(--navy)]">{r.name}</span>
              {r.description && (
                <span className="mt-0.5 line-clamp-1 text-xs text-[var(--muted)]">{r.description}</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
