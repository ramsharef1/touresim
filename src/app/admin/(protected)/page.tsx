import { db } from '@/db'
import { schema } from '@/db'
import { count, eq, gte, desc } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

async function safeCount(fn: () => Promise<{ n: number }[]>): Promise<number> {
  try { return (await fn())[0]?.n ?? 0 } catch { return 0 }
}

async function getStats() {
  const [countries, cities, deals, media, pendingReviews] = await Promise.all([
    safeCount(() => db.select({ n: count() }).from(schema.countries)),
    safeCount(() => db.select({ n: count() }).from(schema.cities)),
    safeCount(() => db.select({ n: count() }).from(schema.deals)),
    safeCount(() => db.select({ n: count() }).from(schema.media)),
    safeCount(() => db.select({ n: count() }).from(schema.destinationReviews).where(eq(schema.destinationReviews.isApproved, false))),
  ])
  return { countries, cities, deals, mediaAssets: media, pendingReviews }
}

async function getRecentReviews() {
  try {
    return await db
      .select()
      .from(schema.destinationReviews)
      .orderBy(desc(schema.destinationReviews.createdAt))
      .limit(5)
  } catch {
    return []
  }
}

export default async function AdminDashboard() {
  const [stats, recentReviews] = await Promise.all([getStats(), getRecentReviews()])

  const kpis = [
    { label: 'Countries', value: stats.countries, icon: '🌍', href: '/admin/countries', color: 'bg-blue-50 text-blue-700' },
    { label: 'Cities', value: stats.cities, icon: '🏙', href: '/admin/cities', color: 'bg-indigo-50 text-indigo-700' },
    { label: 'Pending Reviews', value: stats.pendingReviews, icon: '★', href: '/admin/reviews', color: stats.pendingReviews > 0 ? 'bg-amber-50 text-amber-700' : 'bg-gray-50 text-gray-500' },
    { label: 'Active Deals', value: stats.deals, icon: '🏷', href: '/admin/deals', color: 'bg-green-50 text-green-700' },
    { label: 'Media Assets', value: stats.mediaAssets, icon: '🖼', href: '/admin/media', color: 'bg-purple-50 text-purple-700' },
  ]

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          {new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {kpis.map((k) => (
          <a
            key={k.label}
            href={k.href}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className={`inline-flex items-center justify-center w-9 h-9 rounded-lg text-lg mb-3 ${k.color}`}>
              {k.icon}
            </div>
            <div className="text-2xl font-bold text-gray-900">{k.value.toLocaleString()}</div>
            <div className="text-xs text-gray-500 mt-0.5">{k.label}</div>
          </a>
        ))}
      </div>

      {/* GA4 notice */}
      <div className="mb-8 rounded-xl border border-[#b19566]/30 bg-[#b19566]/5 px-5 py-4 flex items-start gap-3">
        <span className="text-[#b19566] text-lg">📊</span>
        <div>
          <p className="text-sm font-medium text-gray-700">Google Analytics not connected</p>
          <p className="text-xs text-gray-500 mt-0.5">
            Add your GA4 Measurement ID in{' '}
            <a href="/admin/settings" className="underline text-[#b19566]">Settings → Integrations</a>{' '}
            to see traffic, page views, and conversion data here.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent reviews */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">Recent Reviews</h2>
            <a href="/admin/reviews" className="text-xs text-[#b19566] hover:underline">View all →</a>
          </div>
          <div className="divide-y divide-gray-50">
            {recentReviews.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-gray-400">No reviews yet</p>
            ) : (
              recentReviews.map((r) => (
                <div key={r.id} className="px-5 py-3 flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{r.title}</p>
                    <p className="text-xs text-gray-400">{r.destinationSlug} · {r.authorName}</p>
                  </div>
                  <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${r.isApproved ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                    {r.isApproved ? 'Live' : 'Pending'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick actions */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">Quick Actions</h2>
          </div>
          <div className="p-4 grid grid-cols-2 gap-3">
            {[
              { href: '/admin/countries', label: 'Edit Country', icon: '🌍' },
              { href: '/admin/cities', label: 'Edit City', icon: '🏙' },
              { href: '/admin/blog/new', label: 'New Article', icon: '✍' },
              { href: '/admin/deals/new', label: 'Add Deal', icon: '🏷' },
              { href: '/admin/imports', label: 'Run Import', icon: '⬇' },
              { href: '/admin/media', label: 'Upload Media', icon: '🖼' },
              { href: '/admin/affiliates', label: 'Affiliate Links', icon: '🔗' },
              { href: '/admin/settings', label: 'Settings', icon: '⚙' },
            ].map((a) => (
              <a
                key={a.href}
                href={a.href}
                className="flex items-center gap-2 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <span>{a.icon}</span>
                {a.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
