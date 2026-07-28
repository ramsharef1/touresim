'use client'

import { useState } from 'react'
import { RatingStars } from './RatingStars'

interface ReviewFormProps {
  destinationSlug: string
  destinationType: 'country' | 'city'
  onSubmitSuccess?: () => void
}

export function ReviewForm({
  destinationSlug,
  destinationType,
  onSubmitSuccess,
}: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [authorEmail, setAuthorEmail] = useState('')
  const [honeypot, setHoneypot] = useState('') // Spam prevention
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    // Honeypot check
    if (honeypot) {
      console.log('Honeypot triggered')
      return
    }

    // Validation
    if (rating < 1 || rating > 5) {
      setError('Please select a rating')
      return
    }

    if (!title.trim()) {
      setError('Title is required')
      return
    }

    if (title.length > 255) {
      setError('Title must be 255 characters or less')
      return
    }

    if (body.length > 5000) {
      setError('Review must be 5000 characters or less')
      return
    }

    if (!authorName.trim()) {
      setError('Name is required')
      return
    }

    if (!authorEmail.trim()) {
      setError('Email is required')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destinationSlug,
          destinationType,
          rating,
          title,
          body: body.trim() || null,
          authorName: authorName.trim(),
          authorEmail: authorEmail.trim(),
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to submit review')
      }

      setSuccess(true)
      // Reset form
      setRating(0)
      setTitle('')
      setBody('')
      setAuthorName('')
      setAuthorEmail('')

      onSubmitSuccess?.()

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit review')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-gray-50 p-6 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-900">Share Your Experience</h3>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-red-800 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-50 border border-green-200 rounded text-green-800 text-sm">
          Thank you! Your review has been submitted for approval.
        </div>
      )}

      {/* Rating */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rating
        </label>
        <RatingStars
          rating={rating}
          onRatingChange={setRating}
          interactive
          size="lg"
          showLabel
        />
      </div>

      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Review Title
        </label>
        <input
          id="title"
          type="text"
          maxLength={255}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Sum up your experience in a few words"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">
          {title.length} / 255
        </p>
      </div>

      {/* Body */}
      <div>
        <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-1">
          Your Review (Optional)
        </label>
        <textarea
          id="body"
          maxLength={5000}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Tell us more about your experience..."
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">
          {body.length} / 5000
        </p>
      </div>

      {/* Author Name */}
      <div>
        <label htmlFor="authorName" className="block text-sm font-medium text-gray-700 mb-1">
          Your Name
        </label>
        <input
          id="authorName"
          type="text"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          placeholder="Your name"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Author Email */}
      <div>
        <label htmlFor="authorEmail" className="block text-sm font-medium text-gray-700 mb-1">
          Email (not published)
        </label>
        <input
          id="authorEmail"
          type="email"
          value={authorEmail}
          onChange={(e) => setAuthorEmail(e.target.value)}
          placeholder="your@email.com"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Honeypot (hidden) */}
      <input
        type="text"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        style={{ display: 'none' }}
        aria-hidden="true"
        tabIndex={-1}
        autoComplete="off"
      />

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  )
}
