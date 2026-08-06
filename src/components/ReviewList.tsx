import { db } from '@/db'
import { destinationReviews } from '@/db/schema/engagement'
import { eq, and, desc, avg, count } from 'drizzle-orm'

interface ReviewListProps {
  destinationSlug: string
  destinationType: 'country' | 'city'
}

const STAR_LABELS = ['', 'Terrible', 'Poor', 'Average', 'Good', 'Excellent']

function StarBar({ rating, count: cnt, total }: { rating: number; count: number; total: number }) {
  const pct = total > 0 ? Math.round((cnt / total) * 100) : 0
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-3 text-[var(--muted)]">{rating}</span>
      <span className="text-amber-400 text-sm">★</span>
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
      </div>
      <span className="w-6 text-right text-[var(--muted)]">{cnt}</span>
    </div>
  )
}

export async function ReviewList({ destinationSlug, destinationType }: ReviewListProps) {
  const [reviews, stats] = await Promise.all([
    db
      .select()
      .from(destinationReviews)
      .where(and(
        eq(destinationReviews.destinationSlug, destinationSlug),
        eq(destinationReviews.destinationType, destinationType),
        eq(destinationReviews.isApproved, true),
      ))
      .orderBy(desc(destinationReviews.createdAt))
      .limit(10)
      .catch(() => [] as typeof destinationReviews.$inferSelect[]),
    db
      .select({ avgRating: avg(destinationReviews.rating), total: count() })
      .from(destinationReviews)
      .where(and(
        eq(destinationReviews.destinationSlug, destinationSlug),
        eq(destinationReviews.destinationType, destinationType),
        eq(destinationReviews.isApproved, true),
      ))
      .catch(() => [{ avgRating: null, total: 0 }]),
  ])

  if (reviews.length === 0) return null

  const { avgRating, total } = stats[0]
  const avg_ = Number(avgRating ?? 0)

  // Count per star
  const starCounts = [5, 4, 3, 2, 1].map((s) => ({
    rating: s,
    count: reviews.filter((r) => r.rating === s).length,
  }))

  return (
    <section className="mt-10">
      <h2 className="text-xl font-bold text-[var(--navy)] mb-6">Traveller Reviews</h2>

      {/* Summary */}
      {total > 0 && (
        <div className="mb-8 flex flex-col sm:flex-row gap-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <div className="flex flex-col items-center justify-center min-w-[100px]">
            <span className="text-5xl font-bold text-[var(--navy)]">{avg_.toFixed(1)}</span>
            <div className="flex gap-0.5 mt-1">
              {[1,2,3,4,5].map((n) => (
                <span key={n} className={`text-lg ${n <= Math.round(avg_) ? 'text-amber-400' : 'text-gray-200'}`}>★</span>
              ))}
            </div>
            <span className="text-xs text-[var(--muted)] mt-1">{total} review{total !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex-1 space-y-1.5">
            {starCounts.map((sc) => (
              <StarBar key={sc.rating} rating={sc.rating} count={sc.count} total={total} />
            ))}
          </div>
        </div>
      )}

      {/* Review cards */}
      <div className="space-y-4">
        {reviews.map((r) => (
          <div key={r.id} className="rounded-xl border border-[var(--border)] bg-white p-5">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <div className="flex gap-0.5 mb-1">
                  {[1,2,3,4,5].map((n) => (
                    <span key={n} className={`text-sm ${n <= r.rating ? 'text-amber-400' : 'text-gray-200'}`}>★</span>
                  ))}
                  <span className="ml-1 text-xs text-[var(--muted)]">{STAR_LABELS[r.rating]}</span>
                </div>
                <p className="font-semibold text-[var(--navy)]">{r.title}</p>
              </div>
              <span className="shrink-0 text-xs text-[var(--muted)]">
                {new Date(r.createdAt).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
              </span>
            </div>
            {r.body && <p className="text-sm text-[var(--muted)] leading-relaxed">{r.body}</p>}
            <p className="mt-3 text-xs text-[var(--muted)] font-medium">{r.authorName}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
