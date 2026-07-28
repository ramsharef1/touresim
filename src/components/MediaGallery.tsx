import Image from 'next/image'
import { db } from '@/db'
import { entityMedia, media } from '@/db/schema'
import { eq, and } from 'drizzle-orm'

interface MediaGalleryProps {
  entityType: 'country' | 'city'
  entitySlug: string
  title?: string
}

export async function MediaGallery({
  entityType,
  entitySlug,
  title = 'Gallery',
}: MediaGalleryProps) {
  try {
    // Query entity_media and join with media table
    const images = await db
      .select({
        id: media.id,
        url: media.url,
        title: media.title,
        alt: media.alt,
      })
      .from(entityMedia)
      .innerJoin(media, eq(entityMedia.mediaId, media.id))
      .where(
        and(
          eq(entityMedia.entityType, entityType),
          eq(entityMedia.entityId, entitySlug),
        ),
      )
      .limit(12) // Max 12 images

    if (images.length === 0) {
      return null
    }

    return (
      <section className="py-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">{title}</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((img) => (
            <div
              key={img.id}
              className="relative aspect-video overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <Image
                src={img.url}
                alt={img.alt || img.title || `${entityType} image`}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              {img.title && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end p-3">
                  <p className="text-white text-sm font-medium">{img.title}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {images.length > 0 && (
          <p className="text-xs text-gray-500 mt-4">
            Showing {images.length} image{images.length !== 1 ? 's' : ''}
          </p>
        )}
      </section>
    )
  } catch (error) {
    console.error('Error loading media gallery:', error)
    return null
  }
}
