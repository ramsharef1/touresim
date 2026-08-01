import DestinationsMap from '@/components/DestinationsMap'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Explore the Map',
  description: 'Interactive world map of all our destinations — explore cities across the globe.',
}

export default async function MapPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-12">
        <div className="mx-auto max-w-6xl px-4">
          <h1 className="text-4xl font-bold mb-2">Explore the World</h1>
          <p className="text-lg text-blue-100">Every destination on one interactive map</p>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <DestinationsMap locale={locale} />
      </div>
    </main>
  )
}
