'use client'

import { useEffect, useState } from 'react'

export interface WishlistEntry {
  slug: string
  type: 'country' | 'city'
  name: string
  addedAt: string
}

const STORAGE_KEY = 'touresim_wishlist'

export function readWishlist(): WishlistEntry[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

function writeWishlist(entries: WishlistEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
}

interface WishlistButtonProps {
  slug: string
  type: 'country' | 'city'
  name: string
}

export default function WishlistButton({ slug, type, name }: WishlistButtonProps) {
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setSaved(readWishlist().some((e) => e.slug === slug && e.type === type))
  }, [slug, type])

  function toggle() {
    const list = readWishlist()
    if (saved) {
      writeWishlist(list.filter((e) => !(e.slug === slug && e.type === type)))
      setSaved(false)
    } else {
      writeWishlist([...list, { slug, type, name, addedAt: new Date().toISOString() }])
      setSaved(true)
    }
  }

  return (
    <button
      onClick={toggle}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${name} from wishlist` : `Add ${name} to wishlist`}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium shadow transition ${
        saved ? 'bg-rose-500 text-white hover:bg-rose-600' : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
      }`}
    >
      <span aria-hidden>{saved ? '❤️' : '🤍'}</span>
      {saved ? 'Saved' : 'Save'}
    </button>
  )
}
