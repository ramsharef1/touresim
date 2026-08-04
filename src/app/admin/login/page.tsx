import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

async function loginAction(formData: FormData) {
  'use server'
  const password = formData.get('password') as string
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'touresim-admin'
  if (password === adminPassword) {
    const jar = await cookies()
    jar.set('admin_auth', adminPassword, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })
    redirect('/admin')
  }
  redirect('/admin/login?error=1')
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams
  return (
    <div className="min-h-screen bg-[#0a1628] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Dual-brand header */}
        <div className="text-center mb-8">
          <p className="text-[#b19566] text-xs font-medium tracking-widest uppercase mb-1">by Convertic</p>
          <h1 className="text-2xl font-bold text-white">Touresim</h1>
          <p className="text-white/40 text-sm mt-1">Admin Panel</p>
        </div>

        <form action={loginAction} className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-4">
          {error && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-2.5 text-sm text-red-400">
              Incorrect password. Try again.
            </div>
          )}
          <div>
            <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wider">
              Admin Password
            </label>
            <input
              type="password"
              name="password"
              autoFocus
              required
              className="w-full rounded-lg bg-white/10 border border-white/10 px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#b19566]/60 text-sm"
              placeholder="Enter password"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-[#b19566] py-2.5 text-sm font-semibold text-white hover:brightness-110 transition"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  )
}
