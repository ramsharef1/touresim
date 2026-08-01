'use client'

import { useEffect, useState } from 'react'
import { readWishlist, WishlistEntry } from './WishlistButton'

export default function ProfileWishlist({ locale }: { locale: string }) {
  const [entries, setEntries] = useState<WishlistEntry[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setEntries(readWishlist())
    setLoaded(true)
  }, [])

  function remove(slug: string, type: string) {
    const next = entries.filter((e) => !(e.slug === slug && e.type === type))
    localStorage.setItem('touresim_wishlist', JSON.stringify(next))
    setEntries(next)
  }

  if (!loaded) return null

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <div className="rounded-xl bg-white shadow p-5 text-center">
          <p className="text-3xl font-bold text-blue-600">{entries.length}</p>
          <p className="text-sm text-slate-500">Saved destinations</p>
        </div>
        <div className="rounded-xl bg-white shadow p-5 text-center">
          <p className="text-3xl font-bold text-blue-600">{entries.filter((e) => e.type === 'country').length}</p>
          <p className="text-sm text-slate-500">Countries</p>
        </div>
        <div className="rounded-xl bg-white shadow p-5 text-center">
          <p className="text-3xl font-bold text-blue-600">{entries.filter((e) => e.type === 'city').length}</p>
          <p className="text-sm text-slate-500">Cities</p>
        </div>
      </div>

      {entries.length === 0 ? (
        <div className="rounded-xl bg-white shadow p-10 text-center">
          <p className="text-slate-600 mb-4">Your wishlist is empty.</p>
          <a href={`/${locale}/destinations`} className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">
            Explore destinations
          </a>
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {entries.map((e) => (
            <li key={`${e.type}-${e.slug}`} className="flex items-center justify-between rounded-xl bg-white shadow p-4">
              <div>
                <p className="font-semibold text-slate-800">{e.name}</p>
                <p className="text-xs text-slate-400 capitalize">{e.type} · saved {new Date(e.addedAt).toLocaleDateString()}</p>
              </div>
              <button
                onClick={() => remove(e.slug, e.type)}
                className="text-sm text-rose-500 hover:text-rose-700 font-medium"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
