import ProfileWishlist from '@/components/ProfileWishlist'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'My Profile',
  description: 'Your saved destinations and travel plans.',
}

export default async function ProfilePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-12">
        <div className="mx-auto max-w-6xl px-4">
          <h1 className="text-4xl font-bold mb-2">My Travel Profile</h1>
          <p className="text-lg text-blue-100">Your saved destinations, all in one place</p>
        </div>
      </div>
      <div className="mx-auto max-w-4xl px-4 py-12">
        <ProfileWishlist locale={locale} />
      </div>
    </main>
  )
}
