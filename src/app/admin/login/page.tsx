import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const ADMIN_USERNAME = process.env.ADMIN_USERNAME ?? 'admin'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'admin'

async function login(formData: FormData) {
  'use server'
  const user = formData.get('username') as string
  const pass = formData.get('password') as string
  if (user === ADMIN_USERNAME && pass === ADMIN_PASSWORD) {
    const jar = await cookies()
    jar.set('admin_auth', 'ok', {
      httpOnly: true,
      sameSite: 'lax',
      path: '/admin',
      maxAge: 60 * 60 * 8,
    })
    redirect('/admin')
  }
  redirect('/admin/login?error=1')
}

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-sm rounded-xl border border-zinc-800 bg-zinc-900 p-8">
        <h1 className="mb-6 text-xl font-bold text-amber-400">Touresim Admin</h1>
        {error && <p className="mb-4 text-sm text-red-400">Wrong username or password.</p>}
        <form action={login} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm text-zinc-400">Username</label>
            <input
              name="username"
              type="text"
              autoFocus
              autoComplete="username"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-white focus:border-amber-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-zinc-400">Password</label>
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-white focus:border-amber-400 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-amber-400 px-4 py-2 font-semibold text-zinc-900 hover:bg-amber-300"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  )
}
