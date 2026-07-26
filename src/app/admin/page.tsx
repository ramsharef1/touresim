import { requireAdminAuth } from './auth'
import { adminListCountries, adminListCities, adminListPois } from './lib'
import { AdminNav } from './nav'

export default async function AdminDashboard() {
  await requireAdminAuth()

  const [countries, cities, poisList] = await Promise.all([
    adminListCountries(),
    adminListCities(),
    adminListPois(),
  ])

  const stats = [
    { label: 'Countries', count: countries.length, indexed: countries.filter(c => c.indexStatus === 'indexed').length, href: '/admin/countries' },
    { label: 'Cities', count: cities.length, indexed: cities.filter(c => c.indexStatus === 'indexed').length, href: '/admin/cities' },
    { label: 'POIs', count: poisList.length, indexed: poisList.filter(p => p.indexStatus === 'indexed').length, href: '/admin/pois' },
  ]

  return (
    <>
      <AdminNav />
      <main className="p-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {stats.map((s) => (
            <a key={s.label} href={s.href} className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 hover:border-amber-400 transition">
              <p className="text-sm text-zinc-400">{s.label}</p>
              <p className="mt-1 text-4xl font-bold text-white">{s.count}</p>
              <p className="mt-1 text-sm text-amber-400">{s.indexed} indexed</p>
            </a>
          ))}
        </div>
      </main>
    </>
  )
}
