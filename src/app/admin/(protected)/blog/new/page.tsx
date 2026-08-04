import { db } from '@/db'
import { schema } from '@/db'
import { redirect } from 'next/navigation'
import RichTextEditor from '@/components/admin/RichTextEditor'

const CATEGORIES = ['travel-tips', 'guide', 'visa', 'budget', 'food', 'adventure', 'culture']

async function createPost(formData: FormData) {
  'use server'
  const title = formData.get('title') as string
  const slug = (formData.get('slug') as string) || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  const excerpt = formData.get('excerpt') as string
  const body = formData.get('body') as string
  const category = formData.get('category') as string
  const authorName = formData.get('authorName') as string
  const featuredImageUrl = formData.get('featuredImageUrl') as string
  const status = (formData.get('status') as string) ?? 'draft'

  await db.insert(schema.blogPosts).values({
    title,
    slug,
    excerpt: excerpt || null,
    body,
    category: category || null,
    authorName: authorName || null,
    featuredImageUrl: featuredImageUrl || null,
    status: status as 'draft' | 'published',
    publishedAt: status === 'published' ? new Date().toISOString() : null,
  })

  redirect('/admin/blog')
}

export default function AdminNewBlogPage() {
  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-6">
        <a href="/admin/blog" className="text-xs text-gray-400 hover:text-gray-600">← Blog</a>
        <h1 className="text-2xl font-bold text-gray-900 mt-1">New Article</h1>
      </div>

      <form action={createPost} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">Title *</label>
            <input name="title" required className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#b19566]/40" placeholder="10 Best Things to Do in Japan" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">Slug (auto-generated if blank)</label>
            <input name="slug" className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#b19566]/40" placeholder="10-best-things-japan" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">Category</label>
            <select name="category" className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#b19566]/40">
              <option value="">Select…</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">Author</label>
            <input name="authorName" className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#b19566]/40" placeholder="Touresim Team" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">Status</label>
            <select name="status" className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#b19566]/40">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          <div className="col-span-2">
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">Featured image URL</label>
            <input name="featuredImageUrl" type="url" className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#b19566]/40" placeholder="https://..." />
          </div>

          <div className="col-span-2">
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">Excerpt</label>
            <textarea name="excerpt" rows={2} className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#b19566]/40 resize-none" placeholder="Short preview shown on listing pages…" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">Body *</label>
          <RichTextEditor name="body" placeholder="Write your article here…" />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" className="rounded-lg bg-[#0a1628] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#0a1628]/80 transition-colors">
            Save article
          </button>
          <a href="/admin/blog" className="rounded-lg border border-gray-200 px-6 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            Cancel
          </a>
        </div>
      </form>
    </div>
  )
}
