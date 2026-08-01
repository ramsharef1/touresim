'use client'

import { useEffect, useRef, useState } from 'react'

interface MapCity {
  id: number
  name: string
  slug: string
  country: string
  countrySlug: string
  lat: number
  lng: number
}

const LEAFLET_CSS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
const LEAFLET_JS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
const CLUSTER_CSS = 'https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css'
const CLUSTER_CSS_DEFAULT = 'https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css'
const CLUSTER_JS = 'https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js'

function loadCss(href: string) {
  if (document.querySelector(`link[href="${href}"]`)) return
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = href
  document.head.appendChild(link)
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve()
    const script = document.createElement('script')
    script.src = src
    script.onload = () => resolve()
    script.onerror = () => reject(new Error(`Failed to load ${src}`))
    document.body.appendChild(script)
  })
}

export default function DestinationsMap({ locale }: { locale: string }) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [cityCount, setCityCount] = useState(0)

  useEffect(() => {
    let cancelled = false
    let map: { remove: () => void } | null = null

    async function init() {
      try {
        loadCss(LEAFLET_CSS)
        loadCss(CLUSTER_CSS)
        loadCss(CLUSTER_CSS_DEFAULT)
        await loadScript(LEAFLET_JS)
        await loadScript(CLUSTER_JS)

        const res = await fetch('/api/map/cities')
        const json = await res.json()
        if (cancelled || !mapRef.current) return

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const L = (window as any).L
        map = L.map(mapRef.current).setView([25, 10], 2)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 18,
          attribution: '&copy; OpenStreetMap contributors',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }).addTo(map as any)

        const cluster = L.markerClusterGroup()
        const list: MapCity[] = json.cities || []
        for (const city of list) {
          const marker = L.marker([city.lat, city.lng])
          marker.bindPopup(
            `<strong>${city.name}</strong><br/>${city.country}<br/>` +
              `<a href="/${locale}/destinations?q=${encodeURIComponent(city.name)}">Explore →</a>`,
          )
          cluster.addLayer(marker)
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(map as any).addLayer(cluster)

        setCityCount(list.length)
        setStatus('ready')
      } catch (err) {
        console.error('Map init error:', err)
        if (!cancelled) setStatus('error')
      }
    }

    init()
    return () => {
      cancelled = true
      if (map) map.remove()
    }
  }, [locale])

  return (
    <div className="relative">
      <div ref={mapRef} className="h-[70vh] w-full rounded-xl overflow-hidden shadow-lg z-0" />
      {status === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100/70 rounded-xl">
          <p className="text-slate-600 font-medium">Loading map…</p>
        </div>
      )}
      {status === 'error' && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100/70 rounded-xl">
          <p className="text-red-600 font-medium">Failed to load the map. Please try again.</p>
        </div>
      )}
      {status === 'ready' && (
        <p className="mt-3 text-sm text-slate-500">{cityCount} destinations on the map</p>
      )}
    </div>
  )
}
