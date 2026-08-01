'use client'

import { useState } from 'react'

interface DayPlan {
  day: number
  city: string
  activities: string[]
  tip?: string
}

interface Itinerary {
  title: string
  summary: string
  days: DayPlan[]
}

const REGIONS = [
  'Europe', 'Southeast Asia', 'East Asia', 'Middle East', 'North Africa',
  'Sub-Saharan Africa', 'North America', 'Central America', 'South America',
  'Caribbean', 'Oceania', 'South Asia',
]
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export default function TripPlannerForm() {
  const [region, setRegion] = useState('Europe')
  const [duration, setDuration] = useState(7)
  const [budget, setBudget] = useState('medium')
  const [style, setStyle] = useState('mixed')
  const [month, setMonth] = useState('June')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [itinerary, setItinerary] = useState<Itinerary | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setItinerary(null)
    try {
      const res = await fetch('/api/trip-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ region, duration, budget, style, month }),
      })
      const json = await res.json()
      if (!json.success) {
        setError(json.error || 'Something went wrong. Please try again.')
      } else {
        setItinerary(json.itinerary)
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Region
          <select value={region} onChange={(e) => setRegion(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2">
            {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Trip length: {duration} days
          <input type="range" min={1} max={30} value={duration} onChange={(e) => setDuration(parseInt(e.target.value))} />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Budget
          <select value={budget} onChange={(e) => setBudget(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2">
            <option value="low">Budget-friendly</option>
            <option value="medium">Mid-range</option>
            <option value="high">Luxury</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Travel style
          <select value={style} onChange={(e) => setStyle(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2">
            <option value="mixed">A bit of everything</option>
            <option value="adventure">Adventure</option>
            <option value="relax">Relaxation</option>
            <option value="culture">Culture &amp; history</option>
            <option value="food">Food &amp; drink</option>
            <option value="nightlife">Nightlife</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          When
          <select value={month} onChange={(e) => setMonth(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2">
            {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </label>
        <div className="flex items-end">
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? 'Planning your trip…' : 'Plan my trip'}
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-6 rounded-lg bg-red-50 border border-red-200 p-4 text-red-700">{error}</div>
      )}

      {itinerary && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-slate-800">{itinerary.title}</h2>
          <p className="mt-2 text-slate-600">{itinerary.summary}</p>
          <div className="mt-6 grid gap-4">
            {itinerary.days.map((d) => (
              <div key={d.day} className="bg-white rounded-xl shadow p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-bold">{d.day}</span>
                  <h3 className="text-lg font-semibold text-slate-800">{d.city}</h3>
                </div>
                <ul className="mt-3 list-disc pl-6 text-slate-600 space-y-1">
                  {d.activities?.map((a, i) => <li key={i}>{a}</li>)}
                </ul>
                {d.tip && <p className="mt-3 text-sm text-blue-700 bg-blue-50 rounded-lg p-3">💡 {d.tip}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
