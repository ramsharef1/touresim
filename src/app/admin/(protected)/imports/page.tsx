import { db } from '@/db'
import { schema } from '@/db'
import { asc, desc } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

const STATUS_COLORS: Record<string, string> = {
  applied: 'bg-green-50 text-green-700 border-green-100',
  open: 'bg-blue-50 text-blue-700 border-blue-100',
  blocked: 'bg-red-50 text-red-700 border-red-100',
}

export default async function AdminImportsPage() {
  const sources = await db
    .select()
    .from(schema.dataSources)
    .orderBy(asc(schema.dataSources.position), asc(schema.dataSources.name))
    .catch(() => [] as typeof schema.dataSources.$inferSelect[])

  const applied = sources.filter((s) => s.status === 'applied')
  const open = sources.filter((s) => s.status === 'open')
  const blocked = sources.filter((s) => s.status === 'blocked')

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Import Pipeline</h1>
        <p className="text-gray-500 text-sm mt-1">
          {applied.length} active · {open.length} pending · {blocked.length} blocked
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Active sources', value: applied.length, color: 'text-green-700 bg-green-50' },
          { label: 'Pending import', value: open.length, color: 'text-blue-700 bg-blue-50' },
          { label: 'Blocked', value: blocked.length, color: 'text-red-700 bg-red-50' },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className={`text-2xl font-bold ${s.color.split(' ')[0]}`}>{s.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Source</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Format</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Records</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Last run</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {sources.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="px-5 py-3">
                  <p className="font-medium text-gray-800">{s.name}</p>
                  {s.contents && <p className="text-xs text-gray-400 mt-0.5">{s.contents}</p>}
                  {s.lastRefreshStatus && s.status === 'blocked' && (
                    <p className="text-xs text-red-500 mt-0.5 truncate max-w-xs">{s.lastRefreshStatus}</p>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-400 hidden md:table-cell">{s.format ?? '—'}</td>
                <td className="px-4 py-3 text-gray-600 hidden lg:table-cell">
                  {s.recordCount ? s.recordCount.toLocaleString() : '—'}
                </td>
                <td className="px-4 py-3 text-gray-400 text-xs hidden lg:table-cell">
                  {s.lastRefreshedAt
                    ? new Date(s.lastRefreshedAt).toLocaleDateString('en-GB')
                    : 'Never'}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[s.status] ?? 'bg-gray-50 text-gray-500'}`}>
                    {s.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {sources.length === 0 && (
          <p className="px-5 py-10 text-center text-gray-400 text-sm">No data sources configured</p>
        )}
      </div>

      <p className="mt-4 text-xs text-gray-400">
        To trigger an import, run <code className="bg-gray-100 px-1 py-0.5 rounded">npm run import:&lt;key&gt;</code> on the VPS, or wire a cron job to the import API endpoints in <code className="bg-gray-100 px-1 py-0.5 rounded">src/app/api/sources/</code>.
      </p>
    </div>
  )
}
