'use client'

import { useState } from 'react'
import { Link } from '@/i18n/navigation'
import { SearchBar } from '@/components/SearchBar'

interface Props {
  locale: string
  navLinks: { href: string; label: string }[]
  localeLinks: { code: string; label: string; href: string }[]
  currentLocale: string
}

export function MobileMenu({ locale, navLinks, localeLinks, currentLocale }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Hamburger button — only on mobile */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] bg-white text-[var(--navy)] sm:hidden"
        aria-label="Menu"
      >
        {open ? (
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
            <path fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z" clipRule="evenodd" />
          </svg>
        )}
      </button>

      {/* Mobile drawer */}
      {open && (
        <div className="absolute inset-x-0 top-full z-40 border-b border-[var(--border)] bg-white shadow-lg sm:hidden">
          {/* Search */}
          <div className="border-b border-[var(--border)] px-4 py-3">
            <SearchBar locale={locale} />
          </div>

          {/* Nav links */}
          <nav className="px-2 py-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--navy)] hover:bg-[var(--navy-50)] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Language switcher */}
          <div className="border-t border-[var(--border)] px-4 py-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Language</p>
            <div className="flex flex-wrap gap-2">
              {localeLinks.map((l) => (
                <a
                  key={l.code}
                  href={l.href}
                  className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                    l.code === currentLocale
                      ? 'border-[var(--navy)] bg-[var(--navy)] text-white'
                      : 'border-[var(--border)] text-[var(--muted)] hover:border-[var(--gold)] hover:text-[var(--navy)]'
                  }`}
                >
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
