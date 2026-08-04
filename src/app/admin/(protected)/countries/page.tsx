import { db } from '@/db'
import { schema } from '@/db'
import { eq, asc, count } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

export default async function AdminCountriesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>
}) {
  const { q = '', page = '1' } = await searchParams
  const pageSize = 30
  const offset = (Number(page) - 1) * pageSize

  const enRows = await db
    .select({
      countryId: schema.countryTranslations.countryId,
      name: schema.countryTranslations.name,
      slug: schema.countryTranslations.slug,
      description: schema.countryTranslations.description,
      iso2: schema.countries.iso2,
    })
    .from(schema.countryTranslations)
    .innerJoin(schema.countries, eq(schema.countries.id, schema.countryTranslations.countryId))
    .where(eq(schema.countryTranslations.locale, 'en'))
    .orderBy(asc(schema.countryTranslations.name))
    .limit(pageSize)
    .offset(offset)

  const filtered = q
    ? enRows.filter((r) => r.name.toLowerCase().includes(q.toLowerCase()))
    : enRows

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Countries</h1>
          <p className="text-gray-500 text-sm mt-1">Edit content, visa info, and descriptions per country</p>
        </div>
      </div>

      {/* Search */}
      <form className="mb-6">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search countries…"
          className="w-full max-w-sm rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#b19566]/40 shadow-sm"
        />
      </form>

      {/* Table */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Country</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">ISO</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Description</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((c) => (
              <tr key={c.countryId} className="hover:bg-gray-50">
                <td className="px-5 py-3 font-medium text-gray-800">{c.name}</td>
                <td className="px-4 py-3 text-gray-400 hidden md:table-cell">{c.iso2}</td>
                <td className="px-4 py-3 text-gray-400 max-w-xs truncate hidden lg:table-cell">
                  {c.description ? c.description.slice(0, 80) + '…' : <span className="text-amber-500 text-xs">No description</span>}
                </td>
                <td className="px-4 py-3 text-right">
                  <a
                    href={`/admin/countries/${c.countryId}`}
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
          <p className="px-5 py-10 text-center text-gray-400 text-sm">No countries found</p>
        )}
      </div>

      {/* Pagination */}
      <div className="mt-4 flex gap-2 text-sm">
        {Number(page) > 1 && (
          <a href={`?page=${Number(page) - 1}&q=${q}`} className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">← Prev</a>
        )}
        {filtered.length === pageSize && (
          <a href={`?page=${Number(page) + 1}&q=${q}`} className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">Next →</a>
        )}
      </div>
    </div>
  )
}
