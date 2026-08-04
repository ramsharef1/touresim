import { db } from '@/db'
import { schema } from '@/db'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import RichTextEditor from '@/components/admin/RichTextEditor'

export const dynamic = 'force-dynamic'

const CATEGORIES = ['travel-tips', 'guide', 'visa', 'budget', 'food', 'adventure', 'culture']

async function updatePost(formData: FormData) {
  'use server'
  const id = Number(formData.get('id'))
  const title = formData.get('title') as string
  const slug = formData.get('slug') as string
  const excerpt = formData.get('excerpt') as string
  const body = formData.get('body') as string
  const category = formData.get('category') as string
  const authorName = formData.get('authorName') as string
  const featuredImageUrl = formData.get('featuredImageUrl') as string
  const status = formData.get('status') as 'draft' | 'published' | 'archived'

  await db
    .update(schema.blogPosts)
    .set({
      title,
      slug,
      excerpt: excerpt || null,
      body,
      category: category || null,
      authorName: authorName || null,
      featuredImageUrl: featuredImageUrl || null,
      status,
      publishedAt: status === 'published' ? new Date().toISOString() : null,
    })
    .where(eq(schema.blogPosts.id, id))

  revalidatePath(`/admin/blog/${id}`)
  redirect(`/admin/blog/${id}?saved=1`)
}

export default async function AdminBlogEditPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ saved?: string }>
}) {
  const { id } = await params
  const { saved } = await searchParams

  const [post] = await db.select().from(schema.blogPosts).where(eq(schema.blogPosts.id, Number(id))).limit(1)
  if (!post) return <div className="p-8 text-gray-500">Article not found</div>

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-6">
        <a href="/admin/blog" className="text-xs text-gray-400 hover:text-gray-600">← Blog</a>
        <h1 className="text-2xl font-bold text-gray-900 mt-1 truncate">{post.title}</h1>
      </div>

      {saved && (
        <div className="mb-4 rounded-lg bg-green-50 border border-green-100 px-4 py-2.5 text-sm text-green-700">Saved ✓</div>
      )}

      <form action={updatePost} className="space-y-5">
        <input type="hidden" name="id" value={post.id} />

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">Title</label>
            <input name="title" defaultValue={post.title} required className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#b19566]/40" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">Slug</label>
            <input name="slug" defaultValue={post.slug} required className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#b19566]/40" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">Status</label>
            <select name="status" defaultValue={post.status ?? 'draft'} className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#b19566]/40">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">Category</label>
            <select name="category" defaultValue={post.category ?? ''} className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#b19566]/40">
              <option value="">Select…</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">Author</label>
            <input name="authorName" defaultValue={post.authorName ?? ''} className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#b19566]/40" />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">Featured image URL</label>
            <input name="featuredImageUrl" type="url" defaultValue={post.featuredImageUrl ?? ''} className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#b19566]/40" />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">Excerpt</label>
            <textarea name="excerpt" defaultValue={post.excerpt ?? ''} rows={2} className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#b19566]/40 resize-none" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">Body</label>
          <RichTextEditor name="body" defaultValue={post.body} />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" className="rounded-lg bg-[#0a1628] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#0a1628]/80 transition-colors">
            Save changes
          </button>
          <a href="/blog/${post.slug}" target="_blank" className="rounded-lg border border-gray-200 px-6 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            View live ↗
          </a>
        </div>
      </form>
    </div>
  )
}
