interface BookingLinksProps {
  destinationName: string
}

export default function BookingLinks({ destinationName }: BookingLinksProps) {
  const bookingId = process.env.BOOKING_AFFILIATE_ID || ''
  const q = encodeURIComponent(destinationName)

  const partners = [
    {
      name: 'Booking.com',
      label: 'Find hotels',
      url: `https://www.booking.com/searchresults.html?ss=${q}${bookingId ? `&aid=${bookingId}` : ''}`,
      color: 'bg-blue-700 hover:bg-blue-800',
      icon: '🏨',
    },
    {
      name: 'Airbnb',
      label: 'Find stays',
      url: `https://www.airbnb.com/s/${q}/homes`,
      color: 'bg-rose-500 hover:bg-rose-600',
      icon: '🏡',
    },
    {
      name: 'GetYourGuide',
      label: 'Tours & activities',
      url: `https://www.getyourguide.com/s/?q=${q}`,
      color: 'bg-orange-500 hover:bg-orange-600',
      icon: '🎟️',
    },
  ]

  return (
    <section className="rounded-xl bg-white shadow p-5">
      <h3 className="text-lg font-semibold text-slate-800 mb-3">Book your trip to {destinationName}</h3>
      <div className="grid gap-3 sm:grid-cols-3">
        {partners.map((p) => (
          <a
            key={p.name}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className={`flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-white font-medium shadow transition ${p.color}`}
          >
            <span>{p.icon}</span>
            <span>{p.label}</span>
          </a>
        ))}
      </div>
      <p className="mt-3 text-xs text-slate-400">We may earn a commission when you book through these links.</p>
    </section>
  )
}
