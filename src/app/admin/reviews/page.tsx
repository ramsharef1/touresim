import { db } from '@/db'
import { destinationReviews } from '@/db/schema'
import { desc, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export const dynamic = 'force-dynamic'

async function approveReview(id: number) {
  'use server'
  await db.update(destinationReviews).set({ isApproved: true }).where(eq(destinationReviews.id, id))
  revalidatePath('/admin/reviews')
}

async function rejectReview(id: number) {
  'use server'
  await db.delete(destinationReviews).where(eq(destinationReviews.id, id))
  revalidatePath('/admin/reviews')
}

const STARS = ['', '★', '★★', '★★★', '★★★★', '★★★★★']

export default async function AdminReviewsPage() {
  const [pending, approved] = await Promise.all([
    db.select().from(destinationReviews).where(eq(destinationReviews.isApproved, false)).orderBy(desc(destinationReviews.createdAt)),
    db.select().from(destinationReviews).where(eq(destinationReviews.isApproved, true)).orderBy(desc(destinationReviews.createdAt)).limit(50),
  ])

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-bold text-[var(--navy)] mb-8">Review moderation</h1>

      {/* Pending */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-[var(--navy)] mb-4">
          Pending approval
          {pending.length > 0 && (
            <span className="ml-2 rounded-full bg-amber-100 px-2.5 py-0.5 text-sm font-medium text-amber-800">
              {pending.length}
            </span>
          )}
        </h2>

        {pending.length === 0 ? (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center text-[var(--muted)]">
            No pending reviews
          </div>
        ) : (
          <div className="space-y-4">
            {pending.map((r) => (
              <div key={r.id} className="rounded-xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div>
                    <span className="text-amber-700 font-medium text-sm">{STARS[r.rating]}</span>
                    <span className="ml-2 text-xs text-[var(--muted)]">{r.destinationType}: {r.destinationSlug}</span>
                  </div>
                  <div className="flex gap-2">
                    <form action={approveReview.bind(null, r.id)}>
                      <button
                        type="submit"
                        className="rounded-lg bg-green-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-green-700 transition-colors"
                      >
                        Approve
                      </button>
                    </form>
                    <form action={rejectReview.bind(null, r.id)}>
                      <button
                        type="submit"
                        className="rounded-lg bg-red-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-red-700 transition-colors"
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
                <p className="font-semibold text-[var(--navy)] mb-1">{r.title}</p>
                {r.body && <p className="text-sm text-[var(--muted)] leading-6">{r.body}</p>}
                <p className="mt-3 text-xs text-[var(--muted)]">
                  {r.authorName} · {r.authorEmail} · {new Date(r.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Approved */}
      <section>
        <h2 className="text-xl font-semibold text-[var(--navy)] mb-4">
          Approved <span className="text-base font-normal text-[var(--muted)]">({approved.length})</span>
        </h2>
        {approved.length === 0 ? (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center text-[var(--muted)]">
            No approved reviews yet
          </div>
        ) : (
          <div className="space-y-3">
            {approved.map((r) => (
              <div key={r.id} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-amber-500 text-sm">{STARS[r.rating]}</span>
                    <span className="text-xs text-[var(--muted)]">{r.destinationType}: {r.destinationSlug}</span>
                  </div>
                  <p className="font-medium text-[var(--navy)] text-sm">{r.title}</p>
                  <p className="text-xs text-[var(--muted)] mt-1">{r.authorName} · {new Date(r.createdAt).toLocaleDateString()}</p>
                </div>
                <form action={rejectReview.bind(null, r.id)}>
                  <button
                    type="submit"
                    className="shrink-0 rounded-lg border border-red-200 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Delete
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
