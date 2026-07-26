import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function requireAdminAuth() {
  const jar = await cookies()
  if (jar.get('admin_auth')?.value !== 'ok') {
    redirect('/admin/login')
  }
}
