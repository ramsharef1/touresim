'use client'
import { useState } from 'react'

interface ReviewFormProps {
  destinationSlug: string
  destinationType: 'country' | 'city'
  destinationName: string
}

const STAR_LABELS = ['', 'Terrible', 'Poor', 'Average', 'Good', 'Excellent']

export function ReviewForm({ destinationSlug, destinationType, destinationName }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [open, setOpen] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (rating === 0) return
    setStatus('loading')
    const fd = new FormData(e.currentTarget)
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        destinationSlug,
        destinationType,
        rating,
        title: fd.get('title'),
        body: fd.get('body') || null,
        authorName: fd.get('name'),
        authorEmail: fd.get('email'),
        hp: fd.get('hp'), // honeypot
      }),
    })
    if (res.ok) {
      setStatus('success')
      setOpen(false)
    } else {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-xl border border-green-100 bg-green-50 px-5 py-4 text-center">
        <p className="text-green-700 font-medium">Thanks for your review!</p>
        <p className="text-green-600 text-sm mt-1">It will appear after moderation.</p>
      </div>
    )
  }

  const active = hovered || rating

  return (
    <div>
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="rounded-full border border-[var(--border)] bg-white px-5 py-2 text-sm font-medium text-[var(--navy)] hover:bg-[var(--surface)] transition-colors shadow-sm"
        >
          ★ Write a review
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="rounded-xl border border-[var(--border)] bg-white p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-[var(--navy)] text-lg">Review {destinationName}</h3>

          {/* Star picker */}
          <div>
            <p className="text-sm text-[var(--muted)] mb-2">Your rating *</p>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  onMouseEnter={() => setHovered(n)}
                  onMouseLeave={() => setHovered(0)}
                  className={`text-3xl transition-colors ${n <= active ? 'text-amber-400' : 'text-gray-200'}`}
                >
                  ★
                </button>
              ))}
              {active > 0 && (
                <span className="ml-2 text-sm text-[var(--muted)]">{STAR_LABELS[active]}</span>
              )}
            </div>
          </div>

          {/* Honeypot */}
          <input name="hp" type="text" className="hidden" tabIndex={-1} autoComplete="off" />

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-[var(--muted)] mb-1">Your name *</label>
              <input
                name="name" required maxLength={100}
                className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:border-[var(--navy)] focus:outline-none"
                placeholder="Jane Smith"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--muted)] mb-1">Email * (not shown)</label>
              <input
                name="email" type="email" required maxLength={255}
                className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:border-[var(--navy)] focus:outline-none"
                placeholder="jane@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--muted)] mb-1">Review title *</label>
            <input
              name="title" required maxLength={80}
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:border-[var(--navy)] focus:outline-none"
              placeholder="Amazing hidden gem!"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--muted)] mb-1">Your experience (optional)</label>
            <textarea
              name="body" maxLength={500} rows={3}
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm focus:border-[var(--navy)] focus:outline-none resize-none"
              placeholder="Share what made this destination special..."
            />
          </div>

          {status === 'error' && (
            <p className="text-red-600 text-sm">Something went wrong. Please try again.</p>
          )}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={rating === 0 || status === 'loading'}
              className="rounded-full bg-[var(--navy)] px-6 py-2 text-sm font-semibold text-white hover:bg-[var(--navy)]/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {status === 'loading' ? 'Submitting…' : 'Submit review'}
            </button>
            <button type="button" onClick={() => setOpen(false)} className="text-sm text-[var(--muted)] hover:text-[var(--navy)]">
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
