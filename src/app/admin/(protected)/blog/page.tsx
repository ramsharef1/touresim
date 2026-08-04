import { db } from '@/db'
import { schema } from '@/db'
import { desc, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

async function toggleStatus(id: number, currentStatus: string) {
  'use server'
  const next = currentStatus === 'published' ? 'draft' : 'published'
  await db
    .update(schema.blogPosts)
    .set({ status: next as 'draft' | 'published' | 'archived', publishedAt: next === 'published' ? new Date().toISOString() : null })
    .where(eq(schema.blogPosts.id, id))
  revalidatePath('/admin/blog')
}

async function deletePost(id: number) {
  'use server'
  await db.delete(schema.blogPosts).where(eq(schema.blogPosts.id, id))
  revalidatePath('/admin/blog')
}

const STATUS_STYLE: Record<string, string> = {
  published: 'bg-green-50 text-green-700 border-green-100',
  draft: 'bg-gray-50 text-gray-500 border-gray-100',
  archived: 'bg-red-50 text-red-600 border-red-100',
}

export default async function AdminBlogPage() {
  const posts = await db
    .select()
    .from(schema.blogPosts)
    .orderBy(desc(schema.blogPosts.createdAt))
    .limit(50)
    .catch(() => [] as typeof schema.blogPosts.$inferSelect[])

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog / Articles</h1>
          <p className="text-gray-500 text-sm mt-1">{posts.length} articles</p>
        </div>
        <a
          href="/admin/blog/new"
          className="rounded-lg bg-[#0a1628] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0a1628]/80 transition-colors"
        >
          + New article
        </a>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Category</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Author</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {posts.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-5 py-3">
                  <p className="font-medium text-gray-800 truncate max-w-[240px]">{p.title}</p>
                  <p className="text-xs text-gray-400">/{p.slug}</p>
                </td>
                <td className="px-4 py-3 text-gray-500 capitalize hidden md:table-cell">{p.category ?? '—'}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLE[p.status ?? 'draft']}`}>
                    {p.status ?? 'draft'}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-400 hidden lg:table-cell">{p.authorName ?? '—'}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <a
                      href={`/admin/blog/${p.id}`}
                      className="rounded-lg border border-gray-200 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                      Edit
                    </a>
                    <form action={toggleStatus.bind(null, p.id, p.status ?? 'draft')} className="inline">
                      <button type="submit" className="rounded-lg border border-gray-200 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors">
                        {p.status === 'published' ? 'Unpublish' : 'Publish'}
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {posts.length === 0 && (
          <p className="px-5 py-10 text-center text-gray-400 text-sm">No articles yet. Create your first one.</p>
        )}
      </div>
    </div>
  )
}
