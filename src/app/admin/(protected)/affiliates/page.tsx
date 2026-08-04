import { db } from '@/db'
import { schema } from '@/db'
import { desc, count, sum } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

export default async function AdminAffiliatesPage() {
  const links = await db
    .select({
      id: schema.affiliateLinks.id,
      provider: schema.affiliateLinks.provider,
      label: schema.affiliateLinks.label,
      deepLink: schema.affiliateLinks.deepLink,
      cityId: schema.affiliateLinks.cityId,
      poiId: schema.affiliateLinks.poiId,
    })
    .from(schema.affiliateLinks)
    .limit(100)
    .catch(() => [] as { id: number; provider: string; label: string | null; deepLink: string; cityId: number | null; poiId: number | null }[])

  const byProvider = links.reduce<Record<string, number>>((acc, l) => {
    acc[l.provider] = (acc[l.provider] ?? 0) + 1
    return acc
  }, {})

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Affiliate Links</h1>
        <p className="text-gray-500 text-sm mt-1">{links.length} links configured</p>
      </div>

      {/* Partner breakdown */}
      {Object.keys(byProvider).length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {Object.entries(byProvider).map(([provider, n]) => (
            <div key={provider} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="text-xl font-bold text-gray-800">{n}</div>
              <div className="text-xs text-gray-500 mt-0.5 capitalize">{provider}</div>
            </div>
          ))}
        </div>
      )}

      {/* Affiliate ID settings CTA */}
      <div className="mb-6 rounded-xl border border-[#b19566]/30 bg-[#b19566]/5 px-5 py-4 flex items-start gap-3">
        <span className="text-[#b19566] text-lg">🔑</span>
        <div>
          <p className="text-sm font-medium text-gray-700">Set your affiliate partner IDs</p>
          <p className="text-xs text-gray-500 mt-0.5">
            Add Booking.com, Airbnb, and GetYourGuide partner IDs in{' '}
            <a href="/admin/settings" className="underline text-[#b19566]">Settings → Integrations</a>{' '}
            to earn commission on clicks.
          </p>
        </div>
      </div>

      {/* Links table */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Provider</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Label</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Link</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {links.map((l) => (
              <tr key={l.id} className="hover:bg-gray-50">
                <td className="px-5 py-3 font-medium text-gray-700 capitalize">{l.provider}</td>
                <td className="px-4 py-3 text-gray-500">{l.label ?? '—'}</td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  <a
                    href={l.deepLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#b19566] hover:underline text-xs truncate block max-w-xs"
                  >
                    {l.deepLink}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {links.length === 0 && (
          <p className="px-5 py-10 text-center text-gray-400 text-sm">
            No affiliate links yet. They are added automatically when you import POI data with affiliate IDs.
          </p>
        )}
      </div>
    </div>
  )
}
