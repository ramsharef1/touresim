import { db } from '@/db'
import { schema } from '@/db'
import { desc, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

async function deleteDeal(id: number) {
  'use server'
  await db.delete(schema.deals).where(eq(schema.deals.id, id))
  revalidatePath('/admin/deals')
}

export default async function AdminDealsPage() {
  const deals = await db
    .select()
    .from(schema.deals)
    .orderBy(desc(schema.deals.createdAt))
    .limit(50)
    .catch(() => [] as typeof schema.deals.$inferSelect[])

  const active = deals.filter((d) => new Date(d.expiresAt) > new Date())
  const expired = deals.filter((d) => new Date(d.expiresAt) <= new Date())

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Deals</h1>
          <p className="text-gray-500 text-sm mt-1">{active.length} active · {expired.length} expired</p>
        </div>
        <a
          href="/admin/deals/new"
          className="rounded-lg bg-[#0a1628] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0a1628]/80 transition-colors"
        >
          + Add deal
        </a>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Type</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Partner</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Expires</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {deals.map((d) => {
              const isExpired = new Date(d.expiresAt) <= new Date()
              return (
                <tr key={d.id} className={`hover:bg-gray-50 ${isExpired ? 'opacity-50' : ''}`}>
                  <td className="px-5 py-3">
                    <p className="font-medium text-gray-800 truncate max-w-[200px]">{d.title}</p>
                    {d.destinationSlug && <p className="text-xs text-gray-400">{d.destinationSlug}</p>}
                  </td>
                  <td className="px-4 py-3 text-gray-500 capitalize hidden md:table-cell">{d.type}</td>
                  <td className="px-4 py-3 text-gray-500 capitalize hidden md:table-cell">{d.partner}</td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-gray-800">${Number(d.dealPrice).toFixed(0)}</div>
                    {d.discount && <div className="text-xs text-green-600">−{d.discount}%</div>}
                  </td>
                  <td className="px-4 py-3 text-xs hidden lg:table-cell">
                    <span className={isExpired ? 'text-red-500' : 'text-gray-400'}>
                      {new Date(d.expiresAt).toLocaleDateString('en-GB')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <form action={deleteDeal.bind(null, d.id)} className="inline">
                      <button
                        type="submit"
                        className="rounded-lg border border-red-100 px-3 py-1 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors"
                        onClick={(e) => {
                          if (!confirm('Delete this deal?')) e.preventDefault()
                        }}
                      >
                        Delete
                      </button>
                    </form>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {deals.length === 0 && (
          <p className="px-5 py-10 text-center text-gray-400 text-sm">No deals yet. Add one above.</p>
        )}
      </div>
    </div>
  )
}
