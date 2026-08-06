import { db } from '@/db'
import { schema } from '@/db'
import { count, eq, gte, desc } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try { return await fn() } catch { return fallback }
}

export default async function AdminAnalyticsPage() {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

  const [
    totalCountries,
    totalCities,
    totalPosts,
    publishedPosts,
    totalDeals,
    activeDeals,
    pendingReviews,
    approvedReviews,
    recentReviews,
    recentPosts,
  ] = await Promise.all([
    safe(() => db.select({ n: count() }).from(schema.countries).then(r => r[0].n), 0),
    safe(() => db.select({ n: count() }).from(schema.cities).then(r => r[0].n), 0),
    safe(() => db.select({ n: count() }).from(schema.blogPosts).then(r => r[0].n), 0),
    safe(() => db.select({ n: count() }).from(schema.blogPosts).where(eq(schema.blogPosts.status, 'published')).then(r => r[0].n), 0),
    safe(() => db.select({ n: count() }).from(schema.deals).then(r => r[0].n), 0),
    safe(() => db.select({ n: count() }).from(schema.deals).where(gte(schema.deals.expiresAt, new Date())).then(r => r[0].n), 0),
    safe(() => db.select({ n: count() }).from(schema.destinationReviews).where(eq(schema.destinationReviews.isApproved, false)).then(r => r[0].n), 0),
    safe(() => db.select({ n: count() }).from(schema.destinationReviews).where(eq(schema.destinationReviews.isApproved, true)).then(r => r[0].n), 0),
    safe(() => db.select().from(schema.destinationReviews).orderBy(desc(schema.destinationReviews.createdAt)).limit(5), [] as typeof schema.destinationReviews.$inferSelect[]),
    safe(() => db.select().from(schema.blogPosts).orderBy(desc(schema.blogPosts.createdAt)).limit(5), [] as typeof schema.blogPosts.$inferSelect[]),
  ])

  const kpis = [
    { label: 'Countries', value: totalCountries, sub: '132 total', color: 'bg-blue-50 text-blue-700', icon: '🌍' },
    { label: 'Cities', value: totalCities, sub: '444 indexed', color: 'bg-indigo-50 text-indigo-700', icon: '🏙' },
    { label: 'Blog Posts', value: totalPosts, sub: `${publishedPosts} published`, color: 'bg-green-50 text-green-700', icon: '✍️' },
    { label: 'Active Deals', value: activeDeals, sub: `${totalDeals} total`, color: 'bg-amber-50 text-amber-700', icon: '🏷' },
    { label: 'Pending Reviews', value: pendingReviews, sub: `${approvedReviews} approved`, color: pendingReviews > 0 ? 'bg-red-50 text-red-700' : 'bg-gray-50 text-gray-500', icon: '⭐' },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-500 text-sm mt-1">Overview of your Touresim content and engagement</p>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-xl border border-gray-100 bg-white shadow-sm p-5">
            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg text-xl mb-3 ${k.color}`}>
              {k.icon}
            </div>
            <p className="text-3xl font-bold text-gray-900">{k.value.toLocaleString()}</p>
            <p className="text-sm font-medium text-gray-700 mt-0.5">{k.label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{k.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent reviews */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">Recent Reviews</h2>
            <a href="/admin/reviews" className="text-xs text-blue-600 hover:underline">View all →</a>
          </div>
          <div className="divide-y divide-gray-50">
            {recentReviews.length === 0 ? (
              <p className="px-5 py-8 text-center text-gray-400 text-sm">No reviews yet</p>
            ) : recentReviews.map((r) => (
              <div key={r.id} className="px-5 py-3 flex items-start gap-3">
                <span className={`mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium ${r.isApproved ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                  {r.isApproved ? '✓' : '?'}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{r.title}</p>
                  <p className="text-xs text-gray-400">{r.authorName} · {'★'.repeat(r.rating)} · {r.destinationSlug}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent blog posts */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">Recent Articles</h2>
            <a href="/admin/blog" className="text-xs text-blue-600 hover:underline">View all →</a>
          </div>
          <div className="divide-y divide-gray-50">
            {recentPosts.length === 0 ? (
              <p className="px-5 py-8 text-center text-gray-400 text-sm">No articles yet</p>
            ) : recentPosts.map((p) => (
              <div key={p.id} className="px-5 py-3 flex items-start gap-3">
                <span className={`mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium ${p.status === 'published' ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-500'}`}>
                  {p.status === 'published' ? '✓' : '○'}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{p.title}</p>
                  <p className="text-xs text-gray-400 capitalize">{p.status} · {p.category ?? 'Uncategorized'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content health */}
      <div className="mt-6 rounded-xl border border-gray-200 bg-white shadow-sm p-6">
        <h2 className="font-semibold text-gray-800 mb-4">Content Health</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-xs font-medium text-gray-500 mb-1">Blog coverage</p>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: `${totalPosts > 0 ? Math.min((publishedPosts / Math.max(totalPosts, 1)) * 100, 100) : 0}%` }} />
            </div>
            <p className="text-xs text-gray-400 mt-1">{publishedPosts}/{totalPosts} published</p>
          </div>
          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-xs font-medium text-gray-500 mb-1">Review moderation</p>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${pendingReviews > 0 ? 'bg-amber-500' : 'bg-green-500'}`} style={{ width: pendingReviews > 0 ? '50%' : '100%' }} />
            </div>
            <p className="text-xs text-gray-400 mt-1">{pendingReviews} pending · {approvedReviews} live</p>
          </div>
          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-xs font-medium text-gray-500 mb-1">Deals active</p>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${totalDeals > 0 ? (activeDeals / totalDeals) * 100 : 0}%` }} />
            </div>
            <p className="text-xs text-gray-400 mt-1">{activeDeals}/{totalDeals} active</p>
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="mt-6 rounded-xl border border-dashed border-gray-200 p-5">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Quick actions</p>
        <div className="flex flex-wrap gap-2">
          {[
            { label: '+ New article', href: '/admin/blog/new' },
            { label: '+ New deal', href: '/admin/deals/new' },
            { label: 'Moderate reviews', href: '/admin/reviews' },
            { label: 'Edit settings', href: '/admin/settings' },
            { label: 'Import data', href: '/admin/imports' },
          ].map((l) => (
            <a key={l.href} href={l.href} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
