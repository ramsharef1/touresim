import { setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { db } from '@/db'
import { schema } from '@/db'
import { eq, and, ne, desc } from 'drizzle-orm'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

const CATEGORY_COLORS: Record<string, string> = {
  'travel-tips': 'bg-blue-50 text-blue-700',
  guide: 'bg-green-50 text-green-700',
  visa: 'bg-purple-50 text-purple-700',
  budget: 'bg-amber-50 text-amber-700',
  food: 'bg-orange-50 text-orange-700',
  adventure: 'bg-red-50 text-red-700',
  culture: 'bg-rose-50 text-rose-700',
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const [post] = await db
    .select()
    .from(schema.blogPosts)
    .where(and(eq(schema.blogPosts.slug, slug), eq(schema.blogPosts.status, 'published')))
    .limit(1)
    .catch(() => [])

  if (!post) notFound()

  const related = await db
    .select()
    .from(schema.blogPosts)
    .where(and(
      eq(schema.blogPosts.status, 'published'),
      ne(schema.blogPosts.slug, slug),
      post.category ? eq(schema.blogPosts.category, post.category) : eq(schema.blogPosts.status, 'published'),
    ))
    .orderBy(desc(schema.blogPosts.publishedAt))
    .limit(3)
    .catch(() => [] as typeof schema.blogPosts.$inferSelect[])

  return (
    <main className="flex flex-1 flex-col">
      {/* Hero */}
      {post.featuredImageUrl ? (
        <div className="relative h-72 sm:h-96 overflow-hidden">
          <img src={post.featuredImageUrl} alt={post.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 px-6 py-8 mx-auto max-w-3xl">
            {post.category && (
              <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium mb-3 ${CATEGORY_COLORS[post.category] ?? 'bg-white/20 text-white'}`}>
                {post.category.replace('-', ' ')}
              </span>
            )}
            <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight">{post.title}</h1>
          </div>
        </div>
      ) : (
        <section className="bg-[var(--navy)] px-6 py-16">
          <div className="mx-auto max-w-3xl">
            {post.category && (
              <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium mb-4 ${CATEGORY_COLORS[post.category] ?? 'bg-white/10 text-white'}`}>
                {post.category.replace('-', ' ')}
              </span>
            )}
            <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight">{post.title}</h1>
          </div>
        </section>
      )}

      {/* Meta */}
      <div className="border-b border-[var(--border)] bg-white px-6 py-4">
        <div className="mx-auto max-w-3xl flex flex-wrap items-center gap-4 text-sm text-[var(--muted)]">
          <Link href="/blog" className="hover:text-[var(--navy)] transition-colors">← Blog</Link>
          {post.authorName && <span>By {post.authorName}</span>}
          {post.publishedAt && (
            <span>{new Date(post.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          )}
          {post.readTimeMinutes && <span>{post.readTimeMinutes} min read</span>}
        </div>
      </div>

      {/* Body */}
      <article className="px-6 py-12">
        <div className="mx-auto max-w-3xl">
          {post.excerpt && (
            <p className="text-lg text-[var(--muted)] leading-relaxed mb-8 border-l-4 border-[var(--gold)] pl-4 italic">
              {post.excerpt}
            </p>
          )}
          <div
            className="prose prose-lg max-w-none prose-headings:text-[var(--navy)] prose-a:text-[var(--gold)] prose-img:rounded-xl"
            dangerouslySetInnerHTML={{ __html: post.body }}
          />
        </div>
      </article>

      {/* Related */}
      {related.length > 0 && (
        <section className="border-t border-[var(--border)] bg-[var(--surface)] px-6 py-12">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-xl font-bold text-[var(--navy)] mb-6">Related articles</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {related.map((r) => (
                <Link key={r.id} href={`/blog/${r.slug}`} className="group rounded-xl border border-[var(--border)] bg-white p-4 hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-[var(--navy)] group-hover:text-[var(--gold)] transition-colors text-sm leading-snug">{r.title}</h3>
                  {r.publishedAt && (
                    <p className="text-xs text-[var(--muted)] mt-2">{new Date(r.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { slug } = await params
  const [post] = await db.select().from(schema.blogPosts).where(eq(schema.blogPosts.slug, slug)).limit(1).catch(() => [])
  return {
    title: post ? `${post.title} | Touresim` : 'Article | Touresim',
    description: post?.excerpt ?? undefined,
    openGraph: post?.featuredImageUrl ? { images: [post.featuredImageUrl] } : undefined,
  }
}
