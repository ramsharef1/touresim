import { db } from '@/db'
import { schema } from '@/db'
import { desc, count } from 'drizzle-orm'
import Image from 'next/image'

export const dynamic = 'force-dynamic'

export default async function AdminMediaPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page = '1' } = await searchParams
  const pageSize = 48
  const offset = (Number(page) - 1) * pageSize

  const [items, totalRows] = await Promise.all([
    db.select().from(schema.media).orderBy(desc(schema.media.createdAt)).limit(pageSize).offset(offset).catch(() => [] as typeof schema.media.$inferSelect[]),
    db.select({ n: count() }).from(schema.media).catch(() => [{ n: 0 }]),
  ])
  const [total] = totalRows

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Media Library</h1>
          <p className="text-gray-500 text-sm mt-1">{total.n.toLocaleString()} assets total</p>
        </div>
      </div>

      <div className="mb-4 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-700">
        Media upload UI is coming soon. Images are currently imported via the data pipeline. To add images, use the import scripts or insert directly into the <code className="bg-amber-100 px-1 rounded">media</code> table.
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
        {items.map((m) => (
          <div
            key={m.id}
            className="group relative aspect-square overflow-hidden rounded-lg border border-gray-200 bg-gray-100"
          >
            <Image
              src={m.url}
              alt={`Media ${m.id}`}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, 17vw"
              unoptimized
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end">
              <div className="px-2 py-1.5 w-full opacity-0 group-hover:opacity-100 transition-opacity">
                {m.credit && (
                  <p className="text-white text-[10px] truncate">{m.credit}</p>
                )}
                <p className="text-white/60 text-[10px]">#{m.id}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <p className="py-20 text-center text-gray-400">No media assets found</p>
      )}

      {/* Pagination */}
      <div className="mt-6 flex gap-2 text-sm">
        {Number(page) > 1 && (
          <a href={`?page=${Number(page) - 1}`} className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">← Prev</a>
        )}
        {items.length === pageSize && (
          <a href={`?page=${Number(page) + 1}`} className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">Next →</a>
        )}
      </div>
    </div>
  )
}
