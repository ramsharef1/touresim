import { setRequestLocale } from 'next-intl/server'
import { db } from '@/db'
import { schema } from '@/db'
import { desc, eq, and, gte } from 'drizzle-orm'
import { Link } from '@/i18n/navigation'

export const dynamic = 'force-dynamic'

const TYPE_ICONS: Record<string, string> = {
  flight: '✈️',
  hotel: '🏨',
  tour: '🗺',
  activity: '🎯',
  experience: '🌟',
}

const PARTNER_COLORS: Record<string, string> = {
  'booking.com': 'bg-blue-600',
  airbnb: 'bg-rose-500',
  getyourguide: 'bg-green-600',
  skyscanner: 'bg-cyan-600',
  viator: 'bg-purple-600',
  klook: 'bg-red-500',
  expedia: 'bg-yellow-500',
}

const DEAL_TYPES = ['flight', 'hotel', 'tour', 'activity', 'experience'] as const

export default async function DealsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ type?: string }>
}) {
  const { locale } = await params
  const { type } = await searchParams
  setRequestLocale(locale)

  const now = new Date()

  const deals = await db
    .select()
    .from(schema.deals)
    .where(
      type
        ? and(gte(schema.deals.expiresAt, now), eq(schema.deals.type, type as typeof DEAL_TYPES[number]))
        : gte(schema.deals.expiresAt, now)
    )
    .orderBy(desc(schema.deals.createdAt))
    .limit(48)
    .catch(() => [] as typeof schema.deals.$inferSelect[])

  return (
    <main className="flex flex-1 flex-col">
      {/* Hero */}
      <section className="bg-[var(--navy)] px-6 py-20 text-center">
        <div className="mx-auto max-w-2xl">
          <div className="mb-2 h-1 w-10 rounded-full bg-[var(--gold)] mx-auto" />
          <h1 className="text-4xl font-bold text-white sm:text-5xl">Travel Deals</h1>
          <p className="mt-4 text-lg text-white/60">
            Curated deals on flights, hotels, tours, and experiences
          </p>
        </div>
      </section>

      {/* Type filters */}
      <section className="border-b border-[var(--border)] bg-white px-6 py-4">
        <div className="mx-auto max-w-6xl flex gap-2 overflow-x-auto pb-1">
          <Link
            href="/deals"
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${!type ? 'bg-[var(--navy)] text-white' : 'border border-[var(--border)] text-[var(--muted)] hover:bg-gray-50'}`}
          >
            All
          </Link>
          {DEAL_TYPES.map((t) => (
            <Link
              key={t}
              href={`/deals?type=${t}`}
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors capitalize ${type === t ? 'bg-[var(--navy)] text-white' : 'border border-[var(--border)] text-[var(--muted)] hover:bg-gray-50'}`}
            >
              {TYPE_ICONS[t]} {t}s
            </Link>
          ))}
        </div>
      </section>

      {/* Deals grid */}
      <section className="px-6 py-12 bg-[var(--surface)]">
        <div className="mx-auto max-w-6xl">
          {deals.length === 0 ? (
            <div className="py-24 text-center">
              <p className="text-5xl mb-4">🏷</p>
              <p className="text-[var(--muted)] text-lg">No deals available right now.</p>
              <p className="text-[var(--muted)] text-sm mt-2">Check back soon — new deals are added regularly.</p>
              <Link href="/destinations" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--gold)] px-6 py-2.5 text-sm font-semibold text-white hover:brightness-110 transition">
                Browse destinations
              </Link>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {deals.map((deal) => {
                const daysLeft = Math.ceil((new Date(deal.expiresAt).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
                return (
                  <div key={deal.id} className="group rounded-xl border border-[var(--border)] bg-white shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                    {/* Image or gradient */}
                    {deal.imageUrl ? (
                      <div className="relative h-44 overflow-hidden">
                        <img src={deal.imageUrl} alt={deal.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        {deal.discount && (
                          <span className="absolute top-3 right-3 rounded-full bg-[var(--gold)] px-2.5 py-1 text-xs font-bold text-white">
                            −{deal.discount}%
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className={`h-44 flex items-center justify-center text-6xl ${PARTNER_COLORS[deal.partner] ?? 'bg-[var(--navy)]'} relative`}>
                        {TYPE_ICONS[deal.type] ?? '🌍'}
                        {deal.discount && (
                          <span className="absolute top-3 right-3 rounded-full bg-[var(--gold)] px-2.5 py-1 text-xs font-bold text-white">
                            −{deal.discount}%
                          </span>
                        )}
                      </div>
                    )}

                    <div className="p-5 flex flex-col flex-1">
                      {/* Partner + type */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium text-[var(--muted)] capitalize">{deal.partner}</span>
                        <span className="text-[var(--muted)]">·</span>
                        <span className="text-xs font-medium text-[var(--muted)] capitalize">{deal.type}</span>
                        {daysLeft <= 3 && (
                          <span className="ml-auto text-xs font-medium text-red-600 bg-red-50 rounded-full px-2 py-0.5">
                            {daysLeft}d left
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-[var(--navy)] leading-snug mb-1">{deal.title}</h3>
                      {deal.description && <p className="text-xs text-[var(--muted)] line-clamp-2 mb-3">{deal.description}</p>}

                      {/* Price */}
                      <div className="flex items-baseline gap-2 mt-auto mb-4">
                        <span className="text-2xl font-bold text-[var(--navy)]">${Number(deal.dealPrice).toFixed(0)}</span>
                        {deal.originalPrice && (
                          <span className="text-sm text-[var(--muted)] line-through">${Number(deal.originalPrice).toFixed(0)}</span>
                        )}
                      </div>

                      <a
                        href={deal.affiliateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full rounded-lg bg-[var(--navy)] py-2.5 text-center text-sm font-semibold text-white hover:bg-[var(--navy)]/80 transition-colors"
                      >
                        View deal →
                      </a>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

export const metadata = {
  title: 'Travel Deals | Touresim',
  description: 'Best travel deals on flights, hotels, tours and experiences.',
}
