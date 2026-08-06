import { setRequestLocale } from 'next-intl/server'
import ProfileWishlist from '@/components/ProfileWishlist'
import { Link } from '@/i18n/navigation'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'My Profile | Touresim',
  description: 'Your saved destinations and travel plans.',
}

export default async function ProfilePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <main className="flex flex-1 flex-col">
      {/* Hero */}
      <section className="bg-[var(--navy)] px-6 py-16 text-center">
        <div className="mx-auto max-w-2xl">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-3xl">
            ✈️
          </div>
          <h1 className="text-3xl font-bold text-white">My Travel Profile</h1>
          <p className="mt-2 text-white/60">Your saved destinations and wishlist, all in one place.</p>
        </div>
      </section>

      {/* Content */}
      <section className="px-6 py-12 bg-[var(--surface)] flex-1">
        <div className="mx-auto max-w-4xl">
          <ProfileWishlist locale={locale} />

          {/* Quick links */}
          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {[
              { href: '/destinations', label: 'Explore destinations', icon: '🌍', desc: 'Discover 132 countries' },
              { href: '/trip-planner', label: 'Plan a trip', icon: '🗺', desc: 'AI-powered itineraries' },
              { href: '/deals', label: 'Browse deals', icon: '🏷', desc: 'Exclusive travel offers' },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href as any}
                className="group flex flex-col items-center gap-2 rounded-xl border border-[var(--border)] bg-white p-6 text-center hover:border-[var(--gold)] hover:shadow-md transition-shadow"
              >
                <span className="text-3xl">{l.icon}</span>
                <span className="font-semibold text-[var(--navy)] group-hover:text-[var(--gold)] transition-colors text-sm">{l.label}</span>
                <span className="text-xs text-[var(--muted)]">{l.desc}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
