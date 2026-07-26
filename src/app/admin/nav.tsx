export function AdminNav() {
  return (
    <nav className="border-b border-zinc-800 bg-zinc-900 px-6 py-3 flex items-center gap-6">
      <span className="font-bold text-amber-400">Touresim Admin</span>
      <a href="/admin" className="text-sm text-zinc-400 hover:text-white">Dashboard</a>
      <a href="/admin/countries" className="text-sm text-zinc-400 hover:text-white">Countries</a>
      <a href="/admin/cities" className="text-sm text-zinc-400 hover:text-white">Cities</a>
      <a href="/admin/pois" className="text-sm text-zinc-400 hover:text-white">POIs</a>
      <a href="/admin/sources" className="text-sm text-zinc-400 hover:text-white">Sources</a>
    </nav>
  )
}
