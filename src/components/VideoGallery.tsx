interface VideoGalleryProps {
  videos: { youtubeId: string; title: string }[]
}

export default function VideoGallery({ videos }: VideoGalleryProps) {
  if (!videos.length) return null

  return (
    <section className="rounded-xl bg-white shadow p-5">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Videos</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        {videos.map((v) => (
          <div key={v.youtubeId} className="aspect-video overflow-hidden rounded-lg">
            <iframe
              className="h-full w-full"
              src={`https://www.youtube-nocookie.com/embed/${v.youtubeId}`}
              title={v.title}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ))}
      </div>
    </section>
  )
}
