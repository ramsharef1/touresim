import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { db } from '@/db'
import { schema } from '@/db'
import { eq, desc, and } from 'drizzle-orm'
import type { Locale } from '@/lib/locales'

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

const CATEGORY_ICONS: Record<string, string> = {
  'travel-tips': '💡',
  guide: '🗺',
  visa: '🛂',
  budget: '💰',
  food: '🍜',
  adventure: '🏔',
  culture: '🏛',
}

export default async function BlogPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ category?: string }>
}) {
  const { locale } = await params
  const { category } = await searchParams
  setRequestLocale(locale)

  const posts = await db
    .select()
    .from(schema.blogPosts)
    .where(
      category
        ? and(eq(schema.blogPosts.status, 'published'), eq(schema.blogPosts.category, category))
        : eq(schema.blogPosts.status, 'published')
    )
    .orderBy(desc(schema.blogPosts.publishedAt))
    .limit(30)
    .catch(() => [] as typeof schema.blogPosts.$inferSelect[])

  const featured = posts[0]
  const rest = posts.slice(1)

  const categories = ['travel-tips', 'guide', 'visa', 'budget', 'food', 'adventure', 'culture']

  return (
    <main className="flex flex-1 flex-col">
      {/* Hero */}
      <section className="bg-[var(--navy)] px-6 py-20 text-center">
        <div className="mx-auto max-w-2xl">
          <div className="mb-2 h-1 w-10 rounded-full bg-[var(--gold)] mx-auto" />
          <h1 className="text-4xl font-bold text-white sm:text-5xl">Travel Journal</h1>
          <p className="mt-4 text-lg text-white/60">
            Guides, tips, and stories from around the world
          </p>
        </div>
      </section>

      {/* Category filters */}
      <section className="border-b border-[var(--border)] bg-white px-6 py-4">
        <div className="mx-auto max-w-6xl flex gap-2 overflow-x-auto pb-1">
          <Link
            href="/blog"
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${!category ? 'bg-[var(--navy)] text-white' : 'border border-[var(--border)] text-[var(--muted)] hover:bg-gray-50'}`}
          >
            All
          </Link>
          {categories.map((c) => (
            <Link
              key={c}
              href={`/blog?category=${c}`}
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors capitalize ${category === c ? 'bg-[var(--navy)] text-white' : 'border border-[var(--border)] text-[var(--muted)] hover:bg-gray-50'}`}
            >
              {CATEGORY_ICONS[c]} {c.replace('-', ' ')}
            </Link>
          ))}
        </div>
      </section>

      {posts.length === 0 ? (
        <section className="px-6 py-24 text-center">
          <p className="text-4xl mb-4">✍️</p>
          <p className="text-[var(--muted)]">No articles published yet. Check back soon.</p>
        </section>
      ) : (
        <>
          {/* Featured post */}
          {featured && !category && (
            <section className="px-6 py-12">
              <div className="mx-auto max-w-6xl">
                <Link href={`/blog/${featured.slug}`} className="group grid lg:grid-cols-2 gap-8 rounded-2xl border border-[var(--border)] bg-white shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  {featured.featuredImageUrl ? (
                    <div className="relative h-64 lg:h-auto overflow-hidden">
                      <img src={featured.featuredImageUrl} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  ) : (
                    <div className="h-64 lg:h-auto bg-gradient-to-br from-[var(--navy)] to-[var(--navy)]/70 flex items-center justify-center text-7xl">
                      {CATEGORY_ICONS[featured.category ?? ''] ?? '✈️'}
                    </div>
                  )}
                  <div className="p-8 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${CATEGORY_COLORS[featured.category ?? ''] ?? 'bg-gray-100 text-gray-600'}`}>
                        {featured.category?.replace('-', ' ')}
                      </span>
                      <span className="text-xs text-[var(--muted)]">Featured</span>
                    </div>
                    <h2 className="text-2xl font-bold text-[var(--navy)] mb-3 group-hover:text-[var(--gold)] transition-colors">{featured.title}</h2>
                    {featured.excerpt && <p className="text-[var(--muted)] leading-relaxed mb-4">{featured.excerpt}</p>}
                    <div className="flex items-center gap-3 text-xs text-[var(--muted)]">
                      {featured.authorName && <span>{featured.authorName}</span>}
                      {featured.authorName && <span>·</span>}
                      {featured.publishedAt && <span>{new Date(featured.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>}
                      {featured.readTimeMinutes && <><span>·</span><span>{featured.readTimeMinutes} min read</span></>}
                    </div>
                  </div>
                </Link>
              </div>
            </section>
          )}

          {/* Grid */}
          {rest.length > 0 && (
            <section className="px-6 pb-16 bg-[var(--surface)]">
              <div className="mx-auto max-w-6xl">
                {!category && <div className="mb-2 h-1 w-10 rounded-full bg-[var(--gold)]" />}
                {!category && <h2 className="text-xl font-bold text-[var(--navy)] mb-8 pt-12">More articles</h2>}
                {category && <div className="pt-12" />}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {(category ? posts : rest).map((post) => (
                    <Link
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      className="group rounded-xl border border-[var(--border)] bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                      {post.featuredImageUrl ? (
                        <div className="h-48 overflow-hidden">
                          <img src={post.featuredImageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                      ) : (
                        <div className="h-48 bg-gradient-to-br from-[var(--navy-50)] to-[var(--border)] flex items-center justify-center text-5xl">
                          {CATEGORY_ICONS[post.category ?? ''] ?? '✈️'}
                        </div>
                      )}
                      <div className="p-5">
                        {post.category && (
                          <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium mb-2 ${CATEGORY_COLORS[post.category] ?? 'bg-gray-100 text-gray-600'}`}>
                            {post.category.replace('-', ' ')}
                          </span>
                        )}
                        <h3 className="font-bold text-[var(--navy)] group-hover:text-[var(--gold)] transition-colors leading-snug">{post.title}</h3>
                        {post.excerpt && <p className="mt-2 text-sm text-[var(--muted)] line-clamp-2">{post.excerpt}</p>}
                        <div className="mt-3 flex items-center gap-2 text-xs text-[var(--muted)]">
                          {post.publishedAt && <span>{new Date(post.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>}
                          {post.readTimeMinutes && <><span>·</span><span>{post.readTimeMinutes} min</span></>}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      )}
    </main>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  return {
    title: 'Travel Journal | Touresim',
    description: 'Travel guides, tips, visa advice and stories from around the world.',
  }
}
