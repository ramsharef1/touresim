import { requireAdminAuth } from '../auth'
import { adminListPois } from '../lib'
import { AdminNav } from '../nav'

const statusColor = { draft: 'text-zinc-500', noindex: 'text-yellow-400', indexed: 'text-green-400' }

export default async function PoisListPage() {
  await requireAdminAuth()
  const poisList = await adminListPois()

  return (
    <>
      <AdminNav />
      <main className="p-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">POIs</h1>
        <div className="rounded-xl border border-zinc-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-zinc-900 text-zinc-400">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Price</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Score</th>
                <th className="px-4 py-3 text-left"></th>
              </tr>
            </thead>
            <tbody>
              {poisList.map((p) => (
                <tr key={p.id} className="border-t border-zinc-800 hover:bg-zinc-900/50">
                  <td className="px-4 py-3">{p.name}</td>
                  <td className="px-4 py-3 text-zinc-400">{p.priceRange ?? '—'}</td>
                  <td className={`px-4 py-3 font-medium ${statusColor[p.indexStatus]}`}>{p.indexStatus}</td>
                  <td className="px-4 py-3 text-zinc-400">{p.completenessScore}</td>
                  <td className="px-4 py-3">
                    <a href={`/admin/pois/${p.id}`} className="text-amber-400 hover:underline">Edit →</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </>
  )
}
