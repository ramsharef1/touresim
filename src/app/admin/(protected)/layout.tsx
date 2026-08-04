import type { ReactNode } from 'react'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

async function logoutAction() {
  'use server'
  const jar = await cookies()
  jar.delete('admin_auth')
  redirect('/admin/login')
}

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: '▦' },
  { href: '/admin/countries', label: 'Countries', icon: '🌍' },
  { href: '/admin/cities', label: 'Cities', icon: '🏙' },
  { href: '/admin/imports', label: 'Import Pipeline', icon: '⬇' },
  { href: '/admin/media', label: 'Media Library', icon: '🖼' },
  { href: '/admin/affiliates', label: 'Affiliates', icon: '🔗' },
  { href: '/admin/deals', label: 'Deals', icon: '🏷' },
  { href: '/admin/reviews', label: 'Reviews', icon: '★' },
  { href: '/admin/blog', label: 'Blog / Articles', icon: '✍' },
  { href: '/admin/settings', label: 'Settings', icon: '⚙' },
]

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const jar = await cookies()
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'touresim-admin'
  if (jar.get('admin_auth')?.value !== adminPassword) redirect('/admin/login')
  return (
    <div className="flex min-h-screen bg-[#f4f5f7]">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 bg-[#0a1628] flex flex-col">
        {/* Brand */}
        <div className="px-5 py-6 border-b border-white/10">
          <p className="text-[#b19566] text-[10px] font-medium tracking-widest uppercase mb-0.5">by Convertic</p>
          <span className="text-white text-lg font-bold">Touresim</span>
          <span className="ml-2 text-white/30 text-xs">Admin</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-5 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors"
            >
              <span className="w-4 text-center text-base">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-white/10">
          <form action={logoutAction}>
            <button type="submit" className="text-xs text-white/30 hover:text-white/60 transition-colors">
              Sign out
            </button>
          </form>
          <p className="text-white/20 text-[10px] mt-1">Convertic © {new Date().getFullYear()}</p>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 min-w-0 overflow-auto">
        {children}
      </main>
    </div>
  )
}
