import { db } from '@/db'
import { schema } from '@/db'
import { eq, asc, count } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

export default async function AdminCitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string; missing?: string }>
}) {
  const { q = '', page = '1', missing = '' } = await searchParams
  const pageSize = 40
  const offset = (Number(page) - 1) * pageSize

  const rows = await db
    .select({
      cityId: schema.cityTranslations.cityId,
      name: schema.cityTranslations.name,
      slug: schema.cityTranslations.slug,
      description: schema.cityTranslations.description,
      countryId: schema.cities.countryId,
    })
    .from(schema.cityTranslations)
    .innerJoin(schema.cities, eq(schema.cities.id, schema.cityTranslations.cityId))
    .where(eq(schema.cityTranslations.locale, 'en'))
    .orderBy(asc(schema.cityTranslations.name))
    .limit(pageSize)
    .offset(offset)

  let filtered = q
    ? rows.filter((r) => r.name.toLowerCase().includes(q.toLowerCase()))
    : rows

  if (missing === '1') {
    filtered = filtered.filter((r) => !r.description)
  }

  const missingCount = filtered.filter((r) => !r.description).length

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cities</h1>
          <p className="text-gray-500 text-sm mt-1">
            {missingCount > 0 && (
              <span className="text-amber-600 font-medium">{missingCount} missing descriptions on this page. </span>
            )}
            Edit city content and descriptions.
          </p>
        </div>
      </div>

      {/* Filters */}
      <form className="mb-5 flex flex-wrap gap-3">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search cities…"
          className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#b19566]/40 shadow-sm w-64"
        />
        <a
          href={missing === '1' ? '?' : '?missing=1'}
          className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
            missing === '1' ? 'bg-amber-50 border-amber-200 text-amber-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'
          }`}
        >
          Missing descriptions only
        </a>
      </form>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">City</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Description</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((c) => (
              <tr key={c.cityId} className="hover:bg-gray-50">
                <td className="px-5 py-3 font-medium text-gray-800">{c.name}</td>
                <td className="px-4 py-3 text-gray-400 max-w-xs truncate hidden lg:table-cell">
                  {c.description
                    ? c.description.slice(0, 80) + '…'
                    : <span className="text-amber-500 text-xs font-medium">⚠ Missing</span>
                  }
                </td>
                <td className="px-4 py-3 text-right">
                  <a
                    href={`/admin/cities/${c.cityId}`}
                    className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    Edit
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="px-5 py-10 text-center text-gray-400 text-sm">No cities found</p>
        )}
      </div>

      <div className="mt-4 flex gap-2 text-sm">
        {Number(page) > 1 && (
          <a href={`?page=${Number(page) - 1}&q=${q}&missing=${missing}`} className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">← Prev</a>
        )}
        {filtered.length === pageSize && (
          <a href={`?page=${Number(page) + 1}&q=${q}&missing=${missing}`} className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">Next →</a>
        )}
      </div>
    </div>
  )
}
